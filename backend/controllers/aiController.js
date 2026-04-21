const { GoogleGenAI } = require('@google/genai');
const { getDb } = require('../config/db');

exports.getInsights = async (req, res) => {
  try {
    const db = getDb();
    const expenses = await db.collection('expenses')
                             .find({})
                             .sort({ date: -1 })
                             .limit(50) // Analyze up to last 50 expenses
                             .toArray();
                             
    if (expenses.length === 0) {
      return res.status(200).json({ success: true, insights: "You have no expenses recorded yet. Start tracking to get actionable insights!" });
    }

    // Initialize the SDK - it will automatically use process.env.GEMINI_API_KEY
    const ai = new GoogleGenAI({});

    const summary = expenses.map(e => `- ${e.title}: ₹${e.amount} (${e.category}) on ${new Date(e.date).toLocaleDateString()}`).join('\n');
    
    const prompt = `You are a strict, helpful, and highly analytical financial advisor named Smart Advisor.
Here are my recent expenses (in INR):
${summary}

Please provide exactly 3 concise, actionable insights and recommendations to help me optimize my spending. Format the response as a simple, easy-to-read list without any extra conversational filler. Focus on identifying patterns, highlighting areas of high spend, or suggesting budget adjustments. Avoid Markdown formatting like asterisks or bold text, just provide clean plain text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ success: true, insights: response.text });
  } catch (err) {
    console.error('Get AI Insights Error:', err);
    res.status(500).json({ error: 'Server error while generating insights. Check your GEMINI_API_KEY.' });
  }
};
