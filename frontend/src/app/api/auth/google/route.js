import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await dbConnect();
    const { credential } = await req.json();

    // In case no client ID is set, bypass verification (or securely verify when ENV is set)
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'dummy-id') {
      return NextResponse.json({ error: 'Google Login not configured by administrator.' }, { status: 400 });
    }

    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload; 

    // Find if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for google signup giving them a secure random password hash
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + Date.now(), 10);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        age: 18 // Default age
      });
    }

    const token = generateToken(user._id);

    const response = NextResponse.json(
      { success: true, user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 400 });
  }
}
