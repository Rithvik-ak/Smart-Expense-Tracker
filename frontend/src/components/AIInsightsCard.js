'use client';

import { Brain, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function AIInsightsCard({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none">AI Insights</h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Real-time Analysis</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`flex items-start gap-4 p-4 rounded-2xl ring-1 ring-inset ${
              insight.color === 'red' ? 'bg-red-50 text-red-700 ring-red-100' :
              insight.color === 'yellow' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
              'bg-emerald-50 text-emerald-700 ring-emerald-100'
            }`}
          >
            <div className="mt-0.5">
              {insight.color === 'red' ? <AlertCircle className="h-5 w-5" /> :
               insight.color === 'yellow' ? <Info className="h-5 w-5" /> :
               <CheckCircle2 className="h-5 w-5" />}
            </div>
            <p className="text-sm font-bold leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
