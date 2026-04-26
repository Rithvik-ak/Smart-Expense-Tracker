'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2 }}
      onAnimationComplete={() => document.body.style.overflow = 'auto'}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030712]"
      style={{ overflow: 'hidden' }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 blur-xl opacity-50 absolute inset-0"
            />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center relative z-10 border border-white/20 shadow-2xl">
              <Zap className="w-12 h-12 text-white fill-white animate-pulse" />
            </div>
          </div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black tracking-tighter text-white uppercase italic"
          >
            Astra
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mt-4"
          >
            Initializing OS
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
