import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken(user._id);

    const response = NextResponse.json({ 
      success: true, 
      user: { id: user._id, email: user.email } 
    }, { status: 200 });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    let errorMessage = error.message;
    if (error.message.includes('ENOTFOUND')) {
      errorMessage = "Database connection error: The MongoDB host could not be resolved. Please check your MONGODB_URI.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
