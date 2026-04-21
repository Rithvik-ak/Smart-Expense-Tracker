import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
  },
  matrix: {
    importance: {
      type: String,
      enum: ['High', 'Low'],
      required: true,
    },
    usefulness: {
      type: String,
      enum: ['High', 'Low'],
      required: true,
    },
    quadrant: {
      type: String,
      enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    }
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Pre-save hook to calculate quadrant
TransactionSchema.pre('save', function () {
  const { importance, usefulness } = this.matrix;
  if (importance === 'High' && usefulness === 'High') this.matrix.quadrant = 'Q1';
  else if (importance === 'Low' && usefulness === 'High') this.matrix.quadrant = 'Q2';
  else if (importance === 'High' && usefulness === 'Low') this.matrix.quadrant = 'Q3';
  else if (importance === 'Low' && usefulness === 'Low') this.matrix.quadrant = 'Q4';
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
