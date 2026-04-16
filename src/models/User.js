import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
  },
  budget: {
    type: Number,
    default: 0,
  },
  income: {
    type: Number,
    default: 0,
  },
  categoryLimits: {
    Essential: { type: Number, default: 0 },
    Investment: { type: Number, default: 0 },
    Lifestyle: { type: Number, default: 0 },
    Health: { type: Number, default: 0 },
    Education: { type: Number, default: 0 },
    Other: { type: Number, default: 0 },
  },
  currency: {
    type: String,
    default: '₹',
  },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
