'use client';

import { useState } from 'react';
import { Brain, AlertCircle, CheckCircle2, Info, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        const points = data.text.split('\n').filter(p => p.trim() !== '');
        const structuredInsights = points.map((text, i) => ({
           id: `deep-${i}`,
           text: text.replace(/^-\s*/, ''),
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
    <div className="glass-card p-8 rounded-[32px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
         <Brain className="h-40 w-40" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl text-white shadow-lg ${deepInsights ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-indigo-500/30' : 'bg-blue-600 shadow-blue-500/30'}`}>
            {deepInsights ? <Sparkles className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white leading-none">
                {deepInsights ? 'Neural Intelligence' : 'Pattern Recognition'}
            </h3>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">
                {deepInsights ? 'Generative Engine' : 'Heuristic Analysis'}
            </p>
          </div>
        </div>
        {!deepInsights && (
             <button 
                onClick={fetchDeepInsights}
                disabled={loading}
                className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl transition-all disabled:opacity-50 ring-1 ring-white/10 flex items-center justify-center group"
                title="Generate Deep AI Insights"
             >
                 {loading ? <Loader2 className="h-6 w-6 animate-spin text-blue-400" /> : <Sparkles className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />}
             </button>
        )}
      </div>

      {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black rounded-2xl flex items-center gap-3 uppercase tracking-widest">
                <AlertCircle className="h-4 w-4" />
                {error}
            </div>
      )}

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="wait">
          {currentInsights.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 text-slate-400"
            >
               <Info className="h-5 w-5 mt-0.5 text-blue-500" />
               <p className="text-sm font-bold leading-relaxed">
                 Data set incomplete for heuristic analysis. Leverage the Neural Engine for deeper financial projections.
               </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {currentInsights.map((insight, idx) => (
                <motion.div 
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border ${
                    insight.color === 'red' ? 'bg-red-500/5 text-red-400 border-red-500/20' :
                    insight.color === 'yellow' ? 'bg-amber-500/5 text-amber-400 border-amber-500/20' :
                    insight.color === 'indigo' ? 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20' :
                    'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  <div className="mt-1">
                    {insight.color === 'red' ? <AlertCircle className="h-4 w-4" /> :
                     insight.color === 'yellow' ? <Info className="h-4 w-4" /> :
                     insight.color === 'indigo' ? <Sparkles className="h-4 w-4" /> :
                     <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <p className="text-sm font-bold leading-relaxed">
                    {insight.text}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {deepInsights && (
          <div className="mt-8 flex justify-end relative z-10">
              <button onClick={() => setDeepInsights(null)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 transition-colors">
                  Purge Neural Cache
              </button>
          </div>
      )}
    </div>
  );
}

