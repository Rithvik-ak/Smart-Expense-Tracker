import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, name, age } = await req.json();

    if (!email || !password || !name || !age) {
      return NextResponse.json({ error: 'Please provide all details' }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({ email, password, name, age, income: 50000 });
    const token = signToken(user._id);

    const response = NextResponse.json({ 
      success: true, 
      user: { id: user._id, email: user.email } 
    }, { status: 201 });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    let errorMessage = error.message;
    if (error.message.includes('ENOTFOUND')) {
      errorMessage = "Database connection error: The MongoDB host could not be resolved. Please check your MONGODB_URI.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
