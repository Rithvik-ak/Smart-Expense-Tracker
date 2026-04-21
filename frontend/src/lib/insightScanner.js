const CATEGORY_MAP_LIST = {
  'Essential': [],
  'Investment': [],
  'Lifestyle': [],
  'Health': [],
  'Education': [],
  'Other': []
};

export const calculateDashboardInsights = (transactions, user) => {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Weekly Total
  const weeklyTransactions = transactions.filter(t => new Date(t.date) >= weekStart);
  const weeklyTotal = weeklyTransactions.reduce((acc, t) => acc + (t.type === 'expense' ? t.amount : 0), 0);

  // Category Consumption
  const categoryTotals = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Generate Insights
  const insights = [];
  const limits = user?.categoryLimits || {};
  
  Object.keys(categoryTotals).forEach(cat => {
    const total = categoryTotals[cat];
    const limit = limits[cat] || (user?.budget / 5) || 5000; // Added safety default
    const usage = (total / limit) * 100;

    if (usage > 100) {
      insights.push({
        id: `over-${cat}`,
        category: cat,
        status: 'critical',
        text: `You are overspending on ${cat} this month 🍔`,
        color: 'red'
      });
    } else if (usage > 80) {
      insights.push({
        id: `warn-${cat}`,
        category: cat,
        status: 'warn',
        text: `Nearing budget limit for ${cat} ⚠️`,
        color: 'yellow'
      });
    }
  });

  if (insights.length === 0 && (user?.budget > 0 || user?.income > 0)) {
    insights.push({
      id: 'good-job',
      status: 'success',
      text: 'Good job! You stayed within your budget 🎯',
      color: 'green'
    });
  }

  // Budget Suggestions (30/40/20 Rule)
  const income = user?.income || (user?.budget * 1.5) || 50000;
  const suggestions = {
    Essential: Math.round(income * 0.4),
    Investment: Math.round(income * 0.1),
    Lifestyle: Math.round(income * 0.2),
    Health: Math.round(income * 0.1),
    Education: Math.round(income * 0.1),
    Other: Math.round(income * 0.1),
  };

  return {
    weeklyTotal,
    categoryTotals,
    insights,
    suggestions,
    usageData: Object.keys(CATEGORY_MAP_LIST).map(cat => ({
      name: cat,
      spent: categoryTotals[cat] || 0,
      limit: limits[cat] || suggestions[cat]
    }))
  };
};
