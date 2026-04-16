const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  date: { type: Date, default: Date.now },
  description: { type: String },
  // For expenses only
  importance: { type: Number, min: 1, max: 10, default: 5 }, // 1 low, 10 high
  usefulness: { type: Number, min: 1, max: 10, default: 5 }, // 1 low, 10 high
  quadrant: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4', 'N/A'], default: 'N/A' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
