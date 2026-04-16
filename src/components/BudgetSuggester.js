'use client';

import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function BudgetSuggester({ suggestions, currentLimits, onApply }) {
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    try {
      const res = await fetch('/api/user/budget-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryLimits: suggestions }),
      });
      if (res.ok) {
        setApplied(true);
        if (onApply) onApply();
        setTimeout(() => setApplied(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900 p-6 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="h-24 w-24 text-white" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-black leading-none">Smart Proposals</h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Based on 30/40/20 Rule</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {Object.entries(suggestions).map(([cat, val]) => (
            <div key={cat} className="flex items-center justify-between group/item">
              <span className="text-xs font-bold text-slate-300">{cat}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 line-through">₹{currentLimits?.[cat] || 0}</span>
                <ArrowRight className="h-3 w-3 text-slate-600 group-hover/item:translate-x-1 transition-transform" />
                <span className="text-sm font-black text-blue-400">₹{val.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleApply}
          disabled={applied}
          className={`w-full py-4 rounded-2xl font-black tracking-widest transition-all flex items-center justify-center gap-2 ${
            applied 
            ? 'bg-emerald-500 text-white' 
            : 'bg-white text-slate-900 hover:bg-blue-50'
          }`}
        >
          {applied ? (
            <><Check className="h-4 w-4" /> Applied</>
          ) : 'Accept Suggestions'}
        </button>
      </div>
    </div>
  );
}
