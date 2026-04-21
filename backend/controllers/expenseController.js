const { getDb } = require('../config/db');
const { ExpenseModel, ObjectId } = require('../models/expenseModel');

// @route   POST /api/expenses
// @desc    Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please enter all fields (title, amount, category, date)' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number' });
    }

    const db = getDb();
    const newExpense = ExpenseModel.formatDoc({ title, amount, category, date });
    
    // Insert into collection
    const result = await db.collection('expenses').insertOne(newExpense);
    
    res.status(201).json({ 
      success: true, 
      message: 'Expense added successfully',
      data: { ...newExpense, _id: result.insertedId }
    });

  } catch (err) {
    console.error('Add Expense Error:', err);
    res.status(500).json({ error: 'Server error while adding expense' });
  }
};

// @route   GET /api/expenses
// @desc    Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const db = getDb();
    const expenses = await db.collection('expenses')
                             .find({})
                             .sort({ date: -1 })
                             .toArray();
                             
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    console.error('Get Expenses Error:', err);
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
};

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }

    const db = getDb();
    const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Delete Expense Error:', err);
    res.status(500).json({ error: 'Server error while deleting expense' });
  }
};
