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

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_google_genai_api_key_here')) {
      return res.status(200).json({ success: true, insights: "AI Insights are currently disabled. Please add a valid GEMINI_API_KEY to your environment variables to enable this feature." });
    }

    // Initialize the SDK
    const genAI = new GoogleGenAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const summary = expenses.map(e => `- ${e.title}: ₹${e.amount} (${e.category}) on ${new Date(e.date).toLocaleDateString()}`).join('\n');
    
    const prompt = `You are a strict, helpful, and highly analytical financial advisor named Smart Advisor.
Here are my recent expenses (in INR):
${summary}

Please provide exactly 3 concise, actionable insights and recommendations to help me optimize my spending. Format the response as a simple, easy-to-read list without any extra conversational filler. Focus on identifying patterns, highlighting areas of high spend, or suggesting budget adjustments. Avoid Markdown formatting like asterisks or bold text, just provide clean plain text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, insights: text });
  } catch (err) {
    console.error('Get AI Insights Error:', err);
    res.status(500).json({ error: 'Server error while generating insights. Ensure your GEMINI_API_KEY is valid.' });
  }
};
