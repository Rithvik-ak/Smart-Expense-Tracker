const Budget = require('../models/Budget');

const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ user: req.user._id });
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, monthlyAmount: 0 });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { monthlyAmount } = req.body;
    let budget = await Budget.findOne({ user: req.user._id });
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, monthlyAmount });
    } else {
      budget.monthlyAmount = monthlyAmount;
      await budget.save();
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudget, updateBudget };
