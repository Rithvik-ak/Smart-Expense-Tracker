const { getQuadrant, getRecommendation } = require('../utils/economicEngine');
const Budget = require('../models/Budget');

const preSpendAnalyze = async (req, res) => {
  try {
    const { amount, importance, usefulness } = req.body;
    
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    
    const imp = importance || 5;
    const use = usefulness || 5;
    
    const quadrant = getQuadrant(imp, use);
    const recommendation = getRecommendation(quadrant);
    
    // Yearly Cost
    const yearlyCost = amount * 12;
    
    // Get budget impact
    let budgetPercentage = 0;
    const budget = await Budget.findOne({ user: req.user._id });
    if (budget && budget.monthlyAmount > 0) {
      budgetPercentage = parseFloat(((amount / budget.monthlyAmount) * 100).toFixed(2));
    }
    
    // Trade-offs logic (simple heuristic for example)
    const tradeOffs = [];
    if (yearlyCost >= 500) {
      tradeOffs.push(`Investing this $${yearlyCost} per year in an index fund could yield ~$${Math.round(yearlyCost * 0.07)} annually.`);
    }
    if (quadrant === 'Q4' || quadrant === 'Q3') {
       tradeOffs.push(`Skipping this saves $${amount} today, adding directly to your safety net.`);
    }
    if (budgetPercentage > 10) {
       tradeOffs.push(`This single purchase consumes ${budgetPercentage}% of your monthly budget. Ensure it brings lasting value.`);
    }

    res.status(200).json({
      quadrant,
      recommendation,
      yearlyCost,
      budgetPercentage,
      tradeOffs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { preSpendAnalyze };
