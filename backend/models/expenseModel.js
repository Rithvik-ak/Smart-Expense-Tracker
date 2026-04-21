// While native MongoDB doesn't enforce schemas like Mongoose,
// keeping an architecture wrapper pattern is incredibly readable.

const { ObjectId } = require('mongodb');

class ExpenseModel {
  static formatDoc(data) {
    return {
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: new Date(data.date),
      createdAt: new Date()
    };
  }
}

module.exports = { ExpenseModel, ObjectId };
