'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, TrendingUp, ShieldCheck, Award } from 'lucide-react';

export default function StudentProfilePanel({ user }) {
  const stats = [
    { label: 'Savings Streak', value: '12 Days', icon: Zap, color: 'text-blue-400' },
    { label: 'Budget Level', value: 'Lv. 4 Architect', icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Points', value: '1,240', icon: Star, color: 'text-amber-400' },
  ];

  const badges = [
    { name: 'Eco-Warrior', icon: Target, locked: false },
    { name: 'Alpha Saver', icon: TrendingUp, locked: false },
    { name: 'Consistency', icon: Award, locked: true },
  ];

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col h-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="relative">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px]">
            <div className="h-full w-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=transparent&color=fff&bold=true&size=128`} 
                alt="Avatar" 
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-blue-600 border-4 border-slate-950 flex items-center justify-center">
            <Trophy className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{user?.name || 'Astra User'}</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Status: Optimized</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
            </div>
            <span className="text-sm font-black text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 px-2">Achievements</h3>
        <div className="flex gap-4">
          {badges.map((badge, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`h-14 w-14 rounded-2xl flex items-center justify-center relative group ${
                badge.locked ? 'bg-white/5 grayscale opacity-30' : 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10'
              }`}
            >
              <badge.icon className={`h-6 w-6 ${badge.locked ? 'text-slate-500' : 'text-indigo-400'}`} />
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {badge.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
