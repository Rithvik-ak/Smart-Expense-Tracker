'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { calculateAnalysis } from '@/lib/economicEngine';
import { ShieldAlert, Info, TrendingDown, Clock, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function PreSpendAdvisor() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (amount > 0) {
      const result = calculateAnalysis(parseFloat(amount), category, user?.budget || 0, 0);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [amount, category, user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 h-64 w-64 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-6 py-2 text-[10px] font-black text-blue-400 border border-blue-500/20 mb-8 uppercase tracking-[0.3em] backdrop-blur-md"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Decision Intelligence Core
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter sm:text-7xl mb-6 leading-none">
            Pre-Spend <span className="text-gradient">Advisor</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-bold leading-relaxed">
            Stress-test your financial decisions. Our quantum logic module analyzes 
            opportunity cost and long-term asset impact in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8 glass-card p-10 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <TrendingDown className="h-40 w-40" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Capital Outlay ({user.currency || '₹'})</label>
              <input
                type="number"
                className="w-full rounded-2xl bg-white/5 border border-white/10 text-5xl font-black text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 py-6 px-6 transition-all shadow-inner outline-none tracking-tighter"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Functional Category</label>
              <div className="relative">
                <select
                  className="w-full rounded-2xl bg-white/5 border border-white/10 text-white font-black focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 py-5 px-6 transition-all appearance-none outline-none text-lg tracking-tight"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Housing" className="bg-slate-900">Housing</option>
                  <option value="Transportation" className="bg-slate-900">Transportation</option>
                  <option value="Food" className="bg-slate-900">Food</option>
                  <option value="Entertainment" className="bg-slate-900">Entertainment</option>
                  <option value="Utilities" className="bg-slate-900">Utilities</option>
                  <option value="Other" className="bg-slate-900">Miscellaneous</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ArrowRight className="h-5 w-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Info className="h-4 w-4" />
                </div>
                <span>Budget Threshold: {user.currency || '₹'}{user?.budget?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Analysis Result Section */}
          <div className="flex flex-col">
            {!analysis ? (
              <div className="flex-1 flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-white/10 p-12 text-center bg-white/[0.02] backdrop-blur-sm group">
                <div className="h-24 w-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <ShieldAlert className="h-10 w-10 text-slate-600" />
                </div>
                <p className="text-slate-400 font-bold text-lg max-w-[200px]">Waiting for capital input to initiate analysis...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 space-y-8"
              >
                {/* Recommendation Banner */}
                <div className={`rounded-[32px] p-8 border shadow-2xl flex items-center gap-6 relative overflow-hidden ${
                  analysis.recommendation === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  analysis.recommendation === 'Think' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    analysis.recommendation === 'Safe' ? 'bg-emerald-500 text-white' :
                    analysis.recommendation === 'Think' ? 'bg-amber-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {analysis.recommendation === 'Safe' ? <CheckCircle2 className="h-8 w-8" /> :
                     analysis.recommendation === 'Think' ? <AlertTriangle className="h-8 w-8" /> :
                     <XCircle className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">System Verdict</h3>
                    <p className="text-2xl font-black leading-tight tracking-tight">{analysis.reasoning}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="glass-card p-8 rounded-[32px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Cyclical Impact</p>
                    <p className="text-3xl font-black text-white tracking-tight">{user.currency || '₹'}{analysis.yearlyImpact.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-widest">Projected Yearly</p>
                  </div>
                  <div className="glass-card p-8 rounded-[32px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Budget Saturation</p>
                    <p className="text-3xl font-black text-white tracking-tight">{analysis.budgetPercentage.toFixed(1)}%</p>
                    <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-widest">Of limit capacity</p>
                  </div>
                </div>

                {/* Opportunity Cost */}
                <div className="rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 p-10 shadow-2xl shadow-blue-500/30 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-12">
                    <Clock className="h-48 w-48" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Opportunity Cost</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row items-baseline lg:items-center justify-between gap-6">
                      <div>
                        <p className="text-sm font-black text-blue-100 uppercase tracking-widest mb-2 opacity-70">5-Cycle Projection</p>
                        <p className="text-5xl font-black tracking-tighter leading-none">{user.currency || '₹'}{analysis.opportunityCost5yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-xl">
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Asset Divergence</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Suggestion */}
                <div className="flex gap-6 items-center p-8 rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <TrendingDown className="h-7 w-7 text-slate-500" />
                  </div>
                  <p className="text-slate-300 font-bold italic text-lg leading-relaxed">"{analysis.suggestion}"</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
