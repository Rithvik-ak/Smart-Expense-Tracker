'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, TrendingUp, ShieldCheck, Award, Sparkles } from 'lucide-react';

export default function StudentProfilePanel({ user }) {
  const stats = [
    { label: 'Savings Streak', value: '12 Days', icon: Zap, color: 'text-blue-400' },
    { label: 'System Rank', value: 'Lv. 4 Architect', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Neural Points', value: '1,240', icon: Star, color: 'text-amber-400' },
  ];

  const badges = [
    { name: 'Eco-Warrior', icon: Target, locked: false },
    { name: 'Alpha Saver', icon: TrendingUp, locked: false },
    { name: 'Consistency', icon: Award, locked: true },
  ];

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -top-24 -left-24 h-48 w-48 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="relative">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.05 }}
            className="h-24 w-24 rounded-[32px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-2xl shadow-blue-500/20"
          >
            <div className="h-full w-full rounded-[30px] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=transparent&color=fff&bold=true&size=128`} 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-blue-600 border-[6px] border-[#030712] flex items-center justify-center shadow-xl">
            <Trophy className="h-4 w-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter leading-none">{user?.name || 'Astra User'}</h2>
          <div className="flex items-center gap-2 mt-3">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Status: Optimized</p>
          </div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="mb-10 space-y-3 relative z-10">
        <div className="flex justify-between items-end px-1">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Architecture Progress</span>
           <span className="text-[11px] font-black text-blue-400">74%</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '74%' }}
             transition={{ duration: 2, ease: "easeOut" }}
             className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full relative"
           >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
           </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10 relative z-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/stat"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-slate-900/50 ${stat.color} group-hover/stat:scale-110 transition-transform`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
            </div>
            <span className="text-sm font-black text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 px-1 flex items-center gap-3">
          Achievements
          <Sparkles className="h-3 w-3" />
        </h3>
        <div className="flex gap-4">
          {badges.map((badge, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8, scale: 1.1 }}
              className={`h-16 w-16 rounded-3xl flex items-center justify-center relative group/badge ${
                badge.locked ? 'bg-white/5 grayscale opacity-20' : 'bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-white/10 shadow-xl'
              }`}
            >
              <badge.icon className={`h-8 w-8 ${badge.locked ? 'text-slate-500' : 'text-indigo-400'}`} />
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-all pointer-events-none z-50 shadow-2xl">
                {badge.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

