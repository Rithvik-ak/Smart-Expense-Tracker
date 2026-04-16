/**
 * Calculates Quadrant based on Importance (1-10) and Usefulness (1-10)
 * Q1: High Importance (>=6) + High Usefulness (>=6)
 * Q2: High Importance (>=6) + Low Usefulness (<6)
 * Q3: Low Importance (<6) + High Usefulness (>=6)
 * Q4: Low Importance (<6) + Low Usefulness (<6)
 */
const getQuadrant = (importance, usefulness) => {
  if (importance >= 6 && usefulness >= 6) return 'Q1';
  if (importance >= 6 && usefulness < 6) return 'Q2';
  if (importance < 6 && usefulness >= 6) return 'Q3';
  return 'Q4';
};

const getRecommendation = (quadrant) => {
  switch (quadrant) {
    case 'Q1': return { text: 'Proceed. This is an important and useful expense.', class: 'text-green-600', action: 'Approved' };
    case 'Q2': return { text: 'Proceed carefully. Important, but try to find a more useful/efficient alternative.', class: 'text-yellow-600', action: 'Caution' };
    case 'Q3': return { text: 'Think twice. It\'s useful but not important. Consider reducing the amount or frequency.', class: 'text-yellow-600', action: 'Caution' };
    case 'Q4': return { text: 'Avoid. This expense is neither important nor useful. Your money is better saved.', class: 'text-red-600', action: 'Avoid' };
    default: return { text: 'Analyze carefully before proceeding.', class: 'text-gray-600', action: 'Neutral' };
  }
};

module.exports = { getQuadrant, getRecommendation };
