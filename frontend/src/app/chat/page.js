'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Brain, TrendingUp } from 'lucide-react';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Protocol initialized. I am your Neural Financial Advisor. How can I optimize your fiscal behavior today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (authLoading || !user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const quickAnalysis = () => {
    setInput('Analyze my recent spending habits and find unnecessary expenses.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 pt-20 flex flex-col">
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-8 flex flex-col h-[calc(100vh-160px)]">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Neural Advisor</h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Intelligence</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: 'Memory purged. Ready for new instructions.' }])}
            className="p-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all border border-white/10"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-6 px-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    msg.role === 'user' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <div className={`rounded-[24px] p-5 text-sm font-bold leading-relaxed shadow-xl ${
                    msg.role === 'user' ? 'bg-white/5 text-slate-200 border border-white/10 rounded-tr-none' : 'glass-card text-white rounded-tl-none border-blue-500/20'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pl-4">
              <div className="flex gap-4 items-center glass-card px-6 py-4 rounded-2xl border-blue-500/10">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processing Logic...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4">
          {messages.length === 1 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={quickAnalysis}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600/20 transition-all"
              >
                <Brain className="h-3.5 w-3.5" /> Analyze Spending
              </button>
              <button 
                onClick={() => setInput('Give me 3 practical ways to save money as a student.')}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest hover:bg-purple-600/20 transition-all"
              >
                <TrendingUp className="h-3.5 w-3.5" /> Savings Tips
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 glass-card p-2 rounded-[28px] border-white/10 group-focus-within:border-blue-500/50 transition-all shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query neural advisor..."
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder:text-slate-600 font-bold tracking-tight"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-14 w-14 rounded-[22px] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              </button>
            </div>
          </form>
          <p className="text-center mt-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Powered by Gemini 1.5 Flash Neural Engine</p>
        </div>
      </main>
    </div>
  );
}
