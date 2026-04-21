// This nextauth route has been disabled since the app uses a custom JWT auth system.
// Keeping the file to avoid 404s if it's somehow referenced.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'OAuth not configured' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: 'OAuth not configured' }, { status: 501 });
}
