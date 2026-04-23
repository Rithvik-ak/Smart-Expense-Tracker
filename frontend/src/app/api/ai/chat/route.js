import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await dbConnect();
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // Fetch transactions for context
    const transactions = await Transaction.find({ user: decoded.id }).sort({ date: -1 }).limit(50);
    
    const context = transactions.map(t => ({
      description: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date,
      type: t.type
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert financial advisor specializing in student finance. 
      Your goal is to help the user manage their money, identify unnecessary spending, and save more.
      
      User's Recent Transactions:
      ${JSON.stringify(context)}
      
      Instructions:
      - Analyze the spending habits based on the transactions provided.
      - Identify specific areas where they can cut back.
      - Suggest practical, student-friendly saving tips.
      - Keep your answers short, professional, and actionable.
      - If the user asks something unrelated to finance, politely steer them back.
      
      User Message: "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      success: true, 
      role: 'assistant',
      content: text 
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: 'System processing failure' }, { status: 500 });
  }
}
