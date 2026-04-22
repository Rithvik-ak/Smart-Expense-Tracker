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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_google_genai_api_key_here')) {
      return NextResponse.json({ success: true, text: "AI Insights are currently disabled. Please add a valid GEMINI_API_KEY to your environment variables to enable this feature." });
    }
    
    const genAI = new GoogleGenAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const summary = transactions.map(e => `- ${e.description || e.category || 'Item'}: ₹${e.amount} (${e.category}) on ${new Date(e.date).toLocaleDateString()}`).join('\n');
    
    const prompt = `You are a strict, helpful, and highly analytical financial advisor named Smart Advisor.
Here are my recent expenses (in INR):
${summary}

Please provide exactly 3 concise, actionable insights to help me optimize my spending. Focus on identifying patterns, highlighting areas of high spend, or suggesting budget adjustments. Avoid Markdown formatting like asterisks or bold text, just provide clean plain text. Separate the 3 points by a clearly defined newline.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text: text });
  } catch (error) {
    console.error("AI Insight Error:", error);
    return NextResponse.json({ error: 'Server error while generating insights. Ensure your GEMINI_API_KEY is valid.' }, { status: 500 });
  }
}
