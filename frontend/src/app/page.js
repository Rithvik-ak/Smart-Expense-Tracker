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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20" />
            <span className="text-lg font-black tracking-tighter">SmartExpense</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">Framework</Link>
            {user ? (
              <Link href="/dashboard" className="rounded-xl bg-white px-5 py-2 text-xs font-black text-slate-950 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">Dashboard</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-black text-white px-4 py-2 hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest">Login</Link>
                <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 uppercase tracking-widest">Try Free</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-50">
          <HeroScene />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, staggerChildren: 0.2 }}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-8 backdrop-blur-md"
          >
            <Zap className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">AI-Powered Financial Engine</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-4xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl leading-[1.1] mb-8"
          >
            Your Money. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Smarter Decisions.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mx-auto max-w-2xl text-lg text-slate-400 font-medium leading-relaxed mb-10"
          >
            Track every rupee with clarity and control. Get real-time insights into your spending and make smarter financial decisions—without the complexity. Built for modern users who want simplicity with power.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={user ? "/dashboard" : "/signup"} className="group relative rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
              Start Tracking Now
              <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#features" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-sm font-black text-white transition-all hover:bg-white/10 uppercase tracking-widest">
              View Analytics
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Feature Grid */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-black sm:text-4xl mb-4">Precision Engineering for Finance</h2>
            <p className="text-slate-400 font-medium">Tools designed to give you an unfair advantage in money management.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Main Feature */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <BarChart3 className="h-40 w-40" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4">Advanced Expense Tracking</h3>
                <p className="max-w-md text-slate-400 leading-relaxed font-medium">Categorize transactions into our unique 2x2 importance/usefulness matrix. Move beyond simple logging into actual economic analysis.</p>
              </div>
            </motion.div>

            {/* AI Insight Feature */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="md:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-8 backdrop-blur-md group"
            >
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6 ring-4 ring-indigo-500/20 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">AI Insights</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Real-time alerts when you're overspending. Smarter budget proposals based on your income.</p>
            </motion.div>

            {/* Budget Control */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="md:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-6">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Budget Control</h3>
              <p className="text-slate-500 font-medium text-sm">Set hard limits for categories and track your health with interactive 3D indicators.</p>
            </motion.div>

            {/* Global Preferences */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="md:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
            >
              <div className="h-10 w-10 rounded-xl bg-amber-600 flex items-center justify-center mb-6">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Global Currency</h3>
              <p className="text-slate-500 font-medium text-sm">Seamlessly switch between symbols and manage international expenditures with ease.</p>
            </motion.div>

            {/* Mini Utilities */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="md:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center mb-6">
                <MousePointer2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2">Smart Utilities</h3>
              <p className="text-slate-500 font-medium text-sm">Includes a built-in calculator that directly syncs with your input fields.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-white/2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black sm:text-5xl mb-8 leading-tight italic">
                The Roadmap to <br />
                <span className="text-blue-500">Financial Mastery.</span>
              </h2>
              <div className="space-y-12">
                <Step num="01" title="Add" desc="Log transactions instantly using our high-speed input form." />
                <Step num="02" title="Track" desc="Classify every spend into the 2x2 Decision Matrix." />
                <Step num="03" title="Analyze" desc="Review AI-generated trends and budget health scores." />
                <Step num="04" title="Improve" desc="Refine your habits with data-backed financial coaching." />
              </div>
            </div>
            <div className="rounded-[40px] border border-white/10 bg-gradient-to-tr from-slate-900 to-slate-800 p-8 shadow-2xl ring-1 ring-white/20 aspect-video flex items-center justify-center overflow-hidden">
             <div className="relative w-full h-full">
                <div className="absolute top-4 left-4 h-20 w-48 rounded-2xl bg-blue-600/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-[10px] font-black tracking-widest uppercase">Syncing...</div>
                <div className="absolute bottom-4 right-4 h-32 w-32 rounded-full border border-blue-500/30 flex items-center justify-center animate-pulse">
                   <div className="h-20 w-20 rounded-full bg-blue-600/40 blur-xl" />
                   <Target className="h-8 w-8 text-blue-400 relative z-10" />
                </div>
             </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-40">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="rounded-[48px] bg-gradient-to-b from-blue-600 to-indigo-700 p-12 lg:p-24 shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-4xl font-black sm:text-6xl mb-8 relative z-10 tracking-tight">Ready for a smarter <br /> wallet?</h2>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-sm font-black text-blue-700 shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest relative z-10">
              Try SmartExpense Free
              <Zap className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2026 SmartExpense Decision System • All Rupee's Accounted For</p>
      </footer>
    </div>
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
