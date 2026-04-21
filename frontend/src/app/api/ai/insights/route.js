import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const transactions = await Transaction.find({ user: decoded.id }).sort({ date: -1 }).limit(50);
    
    if (transactions.length === 0) {
      return NextResponse.json({ success: true, text: "Wait, you have no expenses recorded yet. Start tracking to get actionable insights!" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const summary = transactions.map(e => `- ${e.description || e.category || 'Item'}: ₹${e.amount} (${e.category}) on ${new Date(e.date).toLocaleDateString()}`).join('\n');
    
    const prompt = `You are a strict, helpful, and highly analytical financial advisor named Smart Advisor.
Here are my recent expenses (in INR):
${summary}

Please provide exactly 3 concise, actionable insights to help me optimize my spending. Focus on identifying patterns, highlighting areas of high spend, or suggesting budget adjustments. Avoid Markdown formatting like asterisks or bold text, just provide clean plain text. Separate the 3 points by a clearly defined newline.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ success: true, text: response.text });
  } catch (error) {
    console.error("AI Insight Error:", error);
    return NextResponse.json({ error: 'Server error while generating insights. Check your GEMINI_API_KEY.' }, { status: 500 });
  }
}
