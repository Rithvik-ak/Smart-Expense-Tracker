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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 ring-1 ring-inset ring-blue-100 mb-6 font-sans">
            <ShieldAlert className="h-4 w-4" />
            Decision Logic Module
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl mb-4 leading-tight">
            Pre-Spend <span className="text-blue-600">Advisor</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Run your purchase through our economic logic module before committing. 
            Discover hidden costs and opportunity trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-all hover:ring-blue-100">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Purchase Amount (₹)</label>
              <input
                type="number"
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-3xl font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-4 px-4 transition-all"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <select
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 py-4 px-4 transition-all appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Housing">Housing</option>
                <option value="Transportation">Transportation</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Info className="h-4 w-4 mr-2 text-blue-600" />
                <span>Budget Limit: ₹{user?.budget?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* Analysis Result Section */}
          <div className="flex flex-col">
            {!analysis ? (
              <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-white shadow-sm">
                <ShieldAlert className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Enter an amount to generate real-time economic insights</p>
              </div>
            ) : (
              <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Recommendation Banner */}
                <div className={`rounded-2xl p-6 ring-1 ring-inset shadow-lg flex items-center gap-4 ${
                  analysis.recommendation === 'Safe' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                  analysis.recommendation === 'Think' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
                  'bg-red-50 text-red-700 ring-red-200'
                }`}>
                  {analysis.recommendation === 'Safe' ? <CheckCircle2 className="h-10 w-10 text-emerald-600" /> :
                   analysis.recommendation === 'Think' ? <AlertTriangle className="h-10 w-10 text-amber-600" /> :
                   <XCircle className="h-10 w-10 text-red-600" />}
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1 opacity-70">Advisor Verdict</h3>
                    <p className="text-xl font-black">{analysis.reasoning}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yearly Impact</p>
                    <p className="text-2xl font-black text-slate-900">₹{analysis.yearlyImpact.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">If recurring monthly</p>
                  </div>
                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Load</p>
                    <p className="text-2xl font-black text-slate-900">{analysis.budgetPercentage.toFixed(1)}%</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Of monthly limit</p>
                  </div>
                </div>

                {/* Opportunity Cost */}
                <div className="rounded-3xl bg-blue-600 p-8 shadow-xl shadow-blue-500/30 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Clock className="h-24 w-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <Clock className="h-5 w-5" />
                      <h3 className="text-sm font-black uppercase tracking-widest">The "Cost of Wait"</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">5-Year Opportunity Cost</p>
                        <p className="text-4xl font-black">₹{analysis.opportunityCost5yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm ring-1 ring-white/20">
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">Invest this instead</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Suggestion */}
                <div className="flex gap-4 items-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <TrendingDown className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-slate-600 font-bold italic leading-relaxed">"{analysis.suggestion}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
