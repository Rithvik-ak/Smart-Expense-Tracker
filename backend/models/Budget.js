const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        monthlyBudget: {
            type: Number,
            required: [true, 'Please add a monthly budget']
        },
        month: {
            type: Number,
            required: [true, 'Please add a month (1-12)']
        },
        year: {
            type: Number,
            required: [true, 'Please add a year']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Budget', budgetSchema);
