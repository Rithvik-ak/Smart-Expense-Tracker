const Expense = require('../models/Expense');

// @desc    Get analytics (total spending, category breakdown, recent stats)
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
    try {
        const { period = 'monthly' } = req.query; // daily, weekly, monthly

        const now = new Date();
        let startDate;

        if (period === 'daily') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (period === 'weekly') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const matchStage = {
            $match: {
                userId: req.user._id,
                date: { $gte: startDate }
            }
        };

        // 1. Total Spending (in the selected period)
        const totalSpending = await Expense.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // 2. Category-wise Breakdown
        const categoryBreakdown = await Expense.aggregate([
            matchStage,
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // 3. Recent Transactions
        const recentTransactions = await Expense.find({ userId: req.user.id })
            .sort({ date: -1 })
            .limit(5);

        res.json({
            period,
            totalSpending: totalSpending.length > 0 ? totalSpending[0].total : 0,
            categoryBreakdown,
            recentTransactions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAnalytics
};
