'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react';

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTime(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTime(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const progress = mode === 'work' ? (time / (25 * 60)) : (time / (5 * 60));

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className={`h-full ${mode === 'work' ? 'bg-blue-500' : 'bg-emerald-500'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => switchMode('work')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            mode === 'work' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-white'
          }`}
        >
          Focus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            mode === 'break' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-500 hover:text-white'
          }`}
        >
          Rest
        </button>
      </div>

      <div className="relative mb-8">
        <svg className="w-48 h-48 -rotate-90">
          <circle 
            cx="96" cy="96" r="88" 
            className="stroke-white/5 fill-none" 
            strokeWidth="4" 
          />
          <motion.circle 
            cx="96" cy="96" r="88" 
            className={`fill-none ${mode === 'work' ? 'stroke-blue-500' : 'stroke-emerald-500'}`}
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 88}
            animate={{ strokeDashoffset: (1 - progress) * 2 * Math.PI * 88 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white tabular-nums">{formatTime(time)}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">
            {mode === 'work' ? 'Deep Work' : 'Refuel'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button 
          onClick={toggleTimer}
          className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${
            isActive ? 'bg-red-500 text-white' : 'bg-white text-slate-950'
          } shadow-xl`}
        >
          {isActive ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
        </button>
        <div className="w-12 h-12 flex items-center justify-center text-slate-600">
           {mode === 'work' ? <Clock className="h-6 w-6" /> : <Coffee className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
}
