'use client';

import { useState } from 'react';
import { Brain, AlertCircle, CheckCircle2, Info, Sparkles, Loader2 } from 'lucide-react';

export default function AIInsightsCard({ insights: localInsights }) {
  const [deepInsights, setDeepInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeepInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/insights');
      const data = await res.json();
      if (data.success) {
        // Split text by newlines and filter empty lines
        const points = data.text.split('\n').filter(p => p.trim() !== '');
        
        const structuredInsights = points.map((text, i) => ({
           id: `deep-${i}`,
           text: text.replace(/^-\s*/, ''), // remove leading dash if present
           color: i % 4 === 0 ? 'yellow' : i % 4 === 1 ? 'emerald' : i % 4 === 2 ? 'indigo' : 'red'
        }));
        
        setDeepInsights(structuredInsights);
      } else {
        setError(data.error || 'Failed to fetch insights');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentInsights = deepInsights || localInsights || [];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border border-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl text-white ${deepInsights ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30' : 'bg-indigo-600'}`}>
            {deepInsights ? <Sparkles className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none">
                {deepInsights ? 'Generative AI Insights' : 'Local Logic Insights'}
            </h3>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">
                {deepInsights ? 'Deep Analysis Mode' : 'Real-time Analysis'}
            </p>
          </div>
        </div>
        {!deepInsights && (
             <button 
                onClick={fetchDeepInsights}
                disabled={loading}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2 rounded-xl transition-all disabled:opacity-50 ring-1 ring-slate-200 flex items-center justify-center group"
                title="Generate Deep AI Insights"
             >
                 {loading ? <Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> : <Sparkles className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />}
             </button>
        )}
      </div>

      {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
            </div>
      )}

      <div className="space-y-4">
        {currentInsights.length === 0 ? (
          <div className="flex items-start gap-4 p-4 rounded-2xl ring-1 ring-inset bg-slate-50 text-slate-500 ring-slate-200">
             <div className="mt-0.5">
               <Info className="h-5 w-5" />
             </div>
             <p className="text-sm font-bold leading-relaxed">
               More data needed for local insights. Click the sparkles button above to leverage Generative AI.
             </p>
          </div>
        ) : currentInsights.map((insight) => (
          <div 
            key={insight.id} 
            className={`flex items-start gap-4 p-4 rounded-2xl ring-1 ring-inset ${
              insight.color === 'red' ? 'bg-red-50 text-red-700 ring-red-100' :
              insight.color === 'yellow' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
              insight.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' :
              'bg-emerald-50 text-emerald-700 ring-emerald-100'
            }`}
          >
            <div className="mt-0.5">
              {insight.color === 'red' ? <AlertCircle className="h-5 w-5" /> :
               insight.color === 'yellow' ? <Info className="h-5 w-5" /> :
               insight.color === 'indigo' ? <Sparkles className="h-5 w-5" /> :
               <CheckCircle2 className="h-5 w-5" />}
            </div>
            <p className="text-sm font-bold leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
      
      {deepInsights && (
          <div className="mt-6 flex justify-end">
              <button onClick={() => setDeepInsights(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                  Return to Local Logic mode
              </button>
          </div>
      )}
    </div>
  );
}
