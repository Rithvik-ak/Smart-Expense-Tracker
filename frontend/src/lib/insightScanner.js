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
  const prevWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Weekly Totals for comparison
  const weeklyTransactions = transactions.filter(t => new Date(t.date) >= weekStart);
  const prevWeeklyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= prevWeekStart && d < weekStart;
  });

  const weeklyTotal = weeklyTransactions.reduce((acc, t) => acc + (t.type === 'expense' ? t.amount : 0), 0);
  const prevWeeklyTotal = prevWeeklyTransactions.reduce((acc, t) => acc + (t.type === 'expense' ? t.amount : 0), 0);

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
  
  // 1. Weekly comparison insight
  if (prevWeeklyTotal > 0) {
    const diff = ((weeklyTotal - prevWeeklyTotal) / prevWeeklyTotal) * 100;
    if (diff > 10) {
      insights.push({
        id: 'weekly-spike',
        text: `Velocity Spike: You spent ${Math.abs(diff).toFixed(0)}% more than last week. Analyze lifestyle clusters.`,
        color: 'red'
      });
    } else if (diff < -10) {
      insights.push({
        id: 'weekly-drop',
        text: `Efficiency Gain: Outflow is down ${Math.abs(diff).toFixed(0)}%. Redirecting surplus to Investment Node recommended.`,
        color: 'emerald'
      });
    }
  }

  // 2. Category specific insights
  Object.keys(categoryTotals).forEach(cat => {
    const total = categoryTotals[cat];
    const limit = limits[cat] || (user?.budget / 5) || 5000;
    const usage = (total / limit) * 100;

    if (usage > 100) {
      insights.push({
        id: `over-${cat}`,
        text: `Critical: ${cat} node has exceeded threshold by ${(usage - 100).toFixed(0)}%. Immediate correction required.`,
        color: 'red'
      });
    } else if (usage > 80) {
      insights.push({
        id: `warn-${cat}`,
        text: `Saturation Alert: ${cat} resources at ${usage.toFixed(0)}% capacity. Scale back non-essential operations.`,
        color: 'yellow'
      });
    }
  });

  // 3. Potential Savings
  const potentialSavings = Math.round((user?.budget || 0) - weeklyTotal * 4);
  if (potentialSavings > 0) {
    insights.push({
      id: 'savings-proj',
      text: `Projection: Optimal operation could yield ${user.currency || '₹'}${potentialSavings.toLocaleString()} in surplus this cycle.`,
      color: 'indigo'
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'system-stable',
      text: 'System Stable: Fiscal operations are within projected parameters. Maintain current trajectory.',
      color: 'emerald'
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

