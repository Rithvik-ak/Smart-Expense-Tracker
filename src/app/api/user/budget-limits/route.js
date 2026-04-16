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

    const { categoryLimits, income } = await req.json();
    
    const updateData = {};
    if (categoryLimits) updateData.categoryLimits = categoryLimits;
    if (income) updateData.income = income;

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
