const Expense = require('../models/Expense');

// @desc    Get all expenses (with pagination & filters)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
    try {
        const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

        let query = { userId: req.user.id };

        if (category) {
            query.category = category;
        }

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);
        const skip = (pageNum - 1) * limitNum;

        const expenses = await Expense.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Expense.countDocuments(query);

        res.json({
            count: expenses.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: expenses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        const expense = await Expense.create({
            userId: req.user.id,
            title,
            amount,
            category,
            date
        });

        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            res.status(404);
            throw new Error('Expense not found');
        }

        // Check for user
        if (expense.userId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExpense);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            res.status(404);
            throw new Error('Expense not found');
        }

        if (expense.userId.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await expense.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
};
