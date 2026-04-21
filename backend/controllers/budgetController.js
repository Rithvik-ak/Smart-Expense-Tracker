const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Set monthly budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res, next) => {
    try {
        const { monthlyBudget, month, year } = req.body;

        if (!monthlyBudget || !month || !year) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        // Check if budget already exists for this month/year
        let budget = await Budget.findOne({
            userId: req.user.id,
            month,
            year
        });

        if (budget) {
            // Update existing budget
            budget.monthlyBudget = monthlyBudget;
            await budget.save();
        } else {
            // Create new budget
            budget = await Budget.create({
                userId: req.user.id,
                monthlyBudget,
                month,
                year
            });
        }

        res.status(200).json(budget);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current budget and compare with expenses
// @route   GET /api/budget/:month/:year
// @access  Private
const getBudget = async (req, res, next) => {
    try {
        const { month, year } = req.params;

        const budget = await Budget.findOne({
            userId: req.user.id,
            month: parseInt(month),
            year: parseInt(year)
        });

        if (!budget) {
            res.status(404);
            throw new Error('Budget not found for this month');
        }

        // Calculate total expenses for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: '$amount' }
                }
            }
        ]);

        const totalSpent = expenses.length > 0 ? expenses[0].totalExpenses : 0;

        res.json({
            budget: budget.monthlyBudget,
            totalSpent,
            remaining: budget.monthlyBudget - totalSpent,
            month: budget.month,
            year: budget.year
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    setBudget,
    getBudget
};
