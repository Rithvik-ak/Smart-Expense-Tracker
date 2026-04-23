'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight, Zap, Target, BarChart3, Shield, PieChart, Activity, Globe, MousePointer2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic hero scene
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">SmartExpense</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/about" className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">Technology</Link>
            {user ? (
              <Link href="/dashboard" className="glass px-6 py-2.5 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Dashboard</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-black text-slate-300 px-4 py-2 hover:text-white transition-all uppercase tracking-widest">Login</Link>
                <Link href="/signup" className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 uppercase tracking-widest">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <HeroScene />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 mb-10"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">AI-Powered Financial Intelligence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-5xl text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl leading-[0.9] mb-10"
          >
            Control Your <br />
            <span className="text-gradient">Money Smartly.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mx-auto max-w-2xl text-xl text-slate-400 font-medium leading-relaxed mb-12"
          >
            The world's most advanced personal finance tracker. Experience deep insights, AI-driven suggestions, and a 2x2 decision matrix designed to optimize your spending.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/signup"} className="group relative rounded-2xl bg-white px-10 py-5 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
              Start Your Journey
              <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#demo" className="glass rounded-2xl px-10 py-5 text-sm font-black text-white transition-all hover:bg-white/10 uppercase tracking-widest">
              Watch Demo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Feature Grid */}
      <section id="features" className="py-24 lg:py-40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24 text-center">
            <h2 className="text-4xl font-black sm:text-6xl mb-6 tracking-tight">Built for Precision.</h2>
            <p className="text-slate-400 text-lg font-medium">Next-generation tools for the modern financial architect.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Main Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 glass-card p-10 relative overflow-hidden group rounded-[40px]"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-110">
                <BarChart3 className="h-64 w-64" />
              </div>
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-600/30">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-6">Advanced Matrix Analysis</h3>
                <p className="max-w-md text-slate-400 text-lg leading-relaxed font-medium">Don't just track expenses—analyze them. Our unique 2x2 matrix categorizes every transaction by Importance and Usefulness, giving you a scientific view of your spending.</p>
              </div>
            </motion.div>

            {/* AI Insight Feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 glass-card bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-10 group rounded-[40px]"
            >
              <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-3xl font-black mb-6">AI Insights</h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">Real-time alerts and generative financial suggestions tailored to your habits. It's like having a CFO in your pocket.</p>
            </motion.div>

            {/* Grid Items */}
            <FeatureCard icon={Target} title="Budget Mastery" desc="Set granular limits per category and track them with stunning 3D indicators." color="emerald" />
            <FeatureCard icon={Globe} title="Multi-Currency" desc="Seamlessly manage international transactions with real-time symbol switching." color="amber" />
            <FeatureCard icon={MousePointer2} title="Smart UI" desc="A fluid, high-performance interface designed for speed and clarity." color="slate" />
          </motion.div>
        </div>
      </section>

      {/* Demo Section (Placeholder for SaaS feel) */}
      <section id="demo" className="py-24 lg:py-40 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[60px] p-4 lg:p-8 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <div className="bg-slate-950 rounded-[48px] overflow-hidden aspect-video border border-white/5 shadow-inner flex items-center justify-center">
              <div className="text-center">
                 <div className="h-20 w-20 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                   <Target className="h-10 w-10 text-blue-500" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-widest text-slate-500">Interactive Dashboard Preview</h3>
                 <p className="text-slate-600 font-bold mt-2">Sign up to experience the full power</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-56">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="rounded-[64px] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-16 lg:p-32 shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-black sm:text-7xl mb-12 relative z-10 tracking-tight leading-tight">Ready to Master <br /> Your Wealth?</h2>
            <Link href="/signup" className="inline-flex items-center gap-3 rounded-2xl bg-white px-12 py-6 text-sm font-black text-blue-700 shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest relative z-10">
              Join SmartExpense Now
              <Zap className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 rounded-lg bg-blue-600" />
            <span className="font-black tracking-tighter">SmartExpense</span>
         </div>
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 SmartExpense Decision System • All Assets Optimized</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  const colorMap = {
    emerald: 'bg-emerald-600 shadow-emerald-600/30',
    amber: 'bg-amber-600 shadow-amber-600/30',
    slate: 'bg-slate-700 shadow-slate-700/30',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="md:col-span-4 glass-card p-10 rounded-[40px]"
    >
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-8 shadow-lg ${colorMap[color]}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-slate-500 font-medium text-base leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="flex gap-6 group">
      <div className="text-3xl font-black text-slate-800 group-hover:text-blue-500/50 transition-colors uppercase italic">{num}</div>
      <div>
        <h4 className="text-xl font-black mb-2 uppercase tracking-wide">{title}</h4>
        <p className="text-slate-500 font-medium text-sm max-w-xs">{desc}</p>
      </div>
    </div>
  );
}
