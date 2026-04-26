/**
 * Economic Analysis Engine (Astra Core)
 * Calculates long-term impact and opportunity cost using annuity projections.
 */

export const calculateAnalysis = (amount, category, budget, totalExpenses) => {
  const yearlyImpact = amount * 12;
  const budgetPercentage = budget ? (amount / budget) * 100 : 0;
  
  // Future Value of an Annuity: FV = P * [((1 + r)^n - 1) / r]
  // P = monthly amount, r = monthly rate (7% annual / 12), n = number of months (5 * 12)
  const annualRate = 0.08; // 8% expected return in index funds
  const monthlyRate = annualRate / 12;
  const months = 5 * 12;
  
  const fvAnnuity = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const opportunityCost5yr = fvAnnuity;
  
  let recommendation = 'Safe';
  let reasoning = '';

  if (budgetPercentage > 25) {
    recommendation = 'Critical';
    reasoning = 'Warning: This single outlay consumes over 25% of your threshold. High risk of liquidity depletion.';
  } else if (budgetPercentage > 15) {
    recommendation = 'Think';
    reasoning = 'Significant impact detected. Our matrix suggests deferring this for 48 hours to assess true utility.';
  } else {
    recommendation = 'Safe';
    reasoning = 'System clearance granted. This allocation fits comfortably within your monthly budget parameters.';
  }

  // Smart suggestions based on Astra Taxonomy
  const suggestions = {
    'Essential': 'Critical node. Ensure this is the most efficient provider for this service.',
    'Lifestyle': 'Lifestyle inflation detected. Can this experience be optimized or reduced?',
    'Entertainment': 'Temporal joy often carries a high opportunity cost. Check free local alternatives.',
    'Education': 'Strategic investment. The long-term ROI likely exceeds the 8% market baseline.',
    'Health': 'Vital maintenance. Prioritize quality over cost for long-term physiological stability.',
    'Investment': 'Capital compounding. This move will accelerate your system rank significantly.'
  };

  return {
    yearlyImpact,
    budgetPercentage,
    opportunityCost5yr,
    recommendation,
    reasoning,
    suggestion: suggestions[category] || 'Track this in your activity feed to monitor its cyclical frequency.'
  };
};
