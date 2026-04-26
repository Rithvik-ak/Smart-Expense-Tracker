'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { calculateAnalysis } from '@/lib/economicEngine';
import { ShieldAlert, Info, TrendingDown, Clock, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Zap, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreSpendAdvisor() {
  const { user, loading: authLoading } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Lifestyle');
  const [analysis, setAnalysis] = useState(null);

  if (authLoading || !user) return null;

  useEffect(() => {
    if (amount > 0) {
      const result = calculateAnalysis(parseFloat(amount), category, user?.budget || 0, 0);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [amount, category, user]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 pb-20 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 h-64 w-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-6 py-2 text-[10px] font-black text-blue-400 border border-blue-500/20 mb-8 uppercase tracking-[0.4em] backdrop-blur-md"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Strategic Intelligence Module
          </motion.div>
          <h1 className="text-6xl font-black text-white tracking-tighter sm:text-8xl mb-8 leading-[0.9]">
            Pre-Spend <span className="text-gradient italic">Advisor.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-bold leading-relaxed">
            Stress-test your financial decisions before execution. Our neural module 
            analyzes opportunity costs and systemic budget impacts in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8 glass-card p-12 rounded-[48px] relative overflow-hidden group border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Cpu className="h-64 w-64" />
            </div>
            
            <div className="relative z-10">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Allocation Amount ({user.currency || '₹'})</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full rounded-[32px] bg-white/[0.03] border border-white/10 text-6xl font-black text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 py-8 px-8 transition-all outline-none tracking-tighter"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/10">
                   <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Target Taxonomy</label>
              <div className="grid grid-cols-2 gap-3">
                {['Essential', 'Investment', 'Lifestyle', 'Health', 'Education', 'Personal'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat 
                      ? 'bg-white text-slate-950 border-white shadow-xl' 
                      : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 relative z-10">
              <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-slate-400">Monthly System Threshold</p>
                   <p className="text-white mt-1">{user.currency || '₹'}{user?.budget?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Result Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!analysis ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-white/5 p-20 text-center bg-white/[0.01] min-h-[500px]"
                >
                  <div className="h-24 w-24 rounded-[32px] bg-white/[0.02] flex items-center justify-center mb-10 border border-white/5">
                      <ShieldAlert className="h-10 w-10 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-600 tracking-tight mb-4">Awaiting Signal...</h3>
                  <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto leading-relaxed italic uppercase tracking-tighter">Enter a capital outlay to initialize the neural analysis engine.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Recommendation Banner */}
                  <div className={`rounded-[48px] p-10 border shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden ${
                    analysis.recommendation === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                    analysis.recommendation === 'Think' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                    'bg-red-500/10 text-red-400 border-red-500/10'
                  }`}>
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                       {analysis.recommendation === 'Safe' ? <CheckCircle2 className="h-48 w-48" /> :
                        analysis.recommendation === 'Think' ? <AlertTriangle className="h-48 w-48" /> :
                        <XCircle className="h-48 w-48" />}
                    </div>

                    <div className={`h-20 w-20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl relative z-10 ${
                      analysis.recommendation === 'Safe' ? 'bg-emerald-500 text-white' :
                      analysis.recommendation === 'Think' ? 'bg-amber-500 text-white' :
                      'bg-red-500 text-white shadow-red-500/20'
                    }`}>
                      {analysis.recommendation === 'Safe' ? <CheckCircle2 className="h-10 w-10" /> :
                       analysis.recommendation === 'Think' ? <AlertTriangle className="h-10 w-10" /> :
                       <XCircle className="h-10 w-10" />}
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Neural Verdict</h3>
                      <p className="text-3xl font-black leading-[1.1] tracking-tighter">{analysis.reasoning}</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="glass-card p-10 rounded-[40px] border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Cyclical Weight</p>
                      <p className="text-4xl font-black text-white tracking-tighter">{user.currency || '₹'}{analysis.yearlyImpact.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-slate-600 mt-3 uppercase tracking-widest italic">52-Week Total Projective Outlay</p>
                    </div>
                    <div className="glass-card p-10 rounded-[40px] border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Resource Saturation</p>
                      <p className="text-4xl font-black text-white tracking-tighter">{analysis.budgetPercentage.toFixed(1)}%</p>
                      <p className="text-[9px] font-black text-slate-600 mt-3 uppercase tracking-widest italic">Current System Load Factor</p>
                    </div>
                  </div>

                  {/* Opportunity Cost */}
                  <div className="rounded-[48px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 shadow-2xl shadow-blue-500/20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
                      <Clock className="h-64 w-64" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                          <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Temporal Asset Divergence</h3>
                      </div>
                      <div className="flex flex-col xl:flex-row items-baseline xl:items-center justify-between gap-8">
                        <div>
                          <p className="text-sm font-black text-blue-100 uppercase tracking-[0.2em] mb-3 opacity-80 italic">5-Year Growth Potential</p>
                          <p className="text-7xl font-black tracking-tighter leading-none">{user.currency || '₹'}{analysis.opportunityCost5yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 px-8 py-4 rounded-[24px] backdrop-blur-2xl border border-white/10 shadow-2xl hover:bg-white/20 transition-all cursor-default">
                          <ArrowRight className="h-5 w-5" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Projected Yield</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Suggestion */}
                  <div className="flex gap-8 items-center p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-md group hover:bg-white/[0.04] transition-all">
                    <div className="h-16 w-16 rounded-[24px] bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:rotate-6 transition-transform border border-white/5">
                      <TrendingDown className="h-8 w-8 text-slate-500" />
                    </div>
                    <p className="text-slate-300 font-black italic text-xl leading-relaxed tracking-tight leading-none">"{analysis.suggestion}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

