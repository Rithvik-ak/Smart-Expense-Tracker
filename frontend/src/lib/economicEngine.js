/**
 * Economic Analysis Engine
 * Calculates long-term impact and opportunity cost of a purchase.
 */

export const calculateAnalysis = (amount, category, budget, totalExpenses) => {
  const yearlyImpact = amount * 12;
  const budgetPercentage = budget ? (amount / budget) * 100 : 0;
  
  // Calculate potential growth if invested instead (simple 7% annual return)
  const opportunityCost5yr = amount * Math.pow(1.07, 5) - amount;
  
  let recommendation = 'Proceed';
  let reasoning = '';

  if (budgetPercentage > 20) {
    recommendation = 'Hold';
    reasoning = 'This single purchase accounts for over 20% of your monthly budget.';
  } else if (budgetPercentage > 10) {
    recommendation = 'Think';
    reasoning = 'Significant budget impact. Consider if there is a more cost-effective alternative.';
  } else {
    recommendation = 'Safe';
    reasoning = 'Fits comfortably within your monthly limits.';
  }

  // Smart suggestions based on category
  const suggestions = {
    'Food': 'Consider meal prepping to reduce this recurring cost.',
    'Entertainment': 'Are there free alternatives for this experience?',
    'Housing': 'High impact on fixed costs. Ensure this is essential.',
    'Transportation': 'Evaluate the cost-to-utility ratio for this travel.',
    'Other': 'Custom purchases should be scrutinized for true usefulness.'
  };

  return {
    yearlyImpact,
    budgetPercentage,
    opportunityCost5yr,
    recommendation,
    reasoning,
    suggestion: suggestions[category] || 'Track this to see its long-term frequency.'
  };
};
