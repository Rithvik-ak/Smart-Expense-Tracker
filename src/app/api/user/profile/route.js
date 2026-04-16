import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { name, email, income, budget, currency } = await req.json();
    
    // Check if email is being updated and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: decoded.id } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (income !== undefined) updateData.income = income;
    if (budget !== undefined) updateData.budget = budget;
    if (currency) updateData.currency = currency;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
