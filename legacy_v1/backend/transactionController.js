const Transaction = require('../models/Transaction');
const { getQuadrant } = require('../utils/economicEngine');

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a transaction
const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, subcategory, date, description, importance, usefulness } = req.body;
    
    let quadrant = 'N/A';
    if (type === 'expense') {
      const imp = importance || 5;
      const use = usefulness || 5;
      quadrant = getQuadrant(imp, use);
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type, amount, category, subcategory, date, description, importance, usefulness, quadrant
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    
    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, addTransaction, deleteTransaction };
