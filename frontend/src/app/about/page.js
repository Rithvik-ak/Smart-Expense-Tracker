'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Zap, Shield, BarChart3, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">Back to Home</span>
          </Link>
          <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-500 uppercase tracking-widest">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-8 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">The Methodology</span>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-6xl mb-8 leading-tight">
            Financial Decision <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic">Engineering.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 font-medium leading-relaxed">
            Most trackers tell you *what* you spent. Smart Expense tells you *why* you spent it and *how* to do better. We use Economic Principles to turn raw data into intelligence.
          </p>
        </div>
      </section>

      {/* 2x2 Matrix Deep Dive */}
      <section className="py-20 lg:py-32 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tight flex items-center">
                <Target className="mr-3 h-8 w-8 text-blue-500" />
                The Decision Matrix
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-8">
                Our core engine classifies every transaction into one of four quadrants based on its Economic Utility. This identifies "Wealth Leaks" that basic categories like 'Food' or 'Travel' often hide.
              </p>
              
              <div className="space-y-6 text-sm">
                <QuadrantDetail 
                    color="text-emerald-400" 
                    title="Q1: Vital/Essential" 
                    desc="High Importance, High Usefulness. These are the foundations of your life and wealth building (Rent, Groceries, Education)." 
                />
                <QuadrantDetail 
                    color="text-blue-400" 
                    title="Q2: Dynamic Strategy" 
                    desc="High Usefulness but Low Immediate Importance. This is where growth happens. Mutual funds, workshops, and productivity tools live here." 
                />
                <QuadrantDetail 
                    color="text-amber-400" 
                    title="Q3: Lifestyle Comfort" 
                    desc="High Importance to you, but lower overall Economic Utility. Dining out or entertainment that keeps you sane." 
                />
                <QuadrantDetail 
                    color="text-red-400" 
                    title="Q4: Economic Waste" 
                    desc="Low Importance and Low Utility. Impulsive buys, unused subscriptions, and 'trash' spending that drains your future." 
                />
              </div>
            </div>

            <div className="relative aspect-square max-w-md mx-auto w-full">
               <div className="absolute inset-0 bg-white/5 rounded-[48px] border border-white/10 backdrop-blur-md shadow-2xl p-8 grid grid-cols-2 grid-rows-2 gap-4">
                  <MatrixQuadrant code="Q1" label="VITAL" color="from-emerald-600/20 to-emerald-500/10 border-emerald-500/20" dot="bg-emerald-500" />
                  <MatrixQuadrant code="Q2" label="STRATEGY" color="from-blue-600/20 to-blue-500/10 border-blue-500/20" dot="bg-blue-500" />
                  <MatrixQuadrant code="Q3" label="COMFORT" color="from-amber-600/20 to-amber-500/10 border-amber-500/20" dot="bg-amber-500" />
                  <MatrixQuadrant code="Q4" label="WASTE" color="from-red-600/20 to-red-500/10 border-red-500/20" dot="bg-red-500" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
               </div>
               {/* Labels */}
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest text-slate-500 uppercase">Utility</div>
               <div className="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 text-[10px] font-black tracking-widest text-slate-500 uppercase">Importance</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Budgeting Rules */}
      <section className="py-20 lg:py-32 bg-white/2 relative overflow-hidden">
        <div className="mx-auto max-max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-16">
          <Zap className="mx-auto h-12 w-12 text-blue-500 mb-6" />
          <h2 className="text-3xl font-black sm:text-4xl mb-4">The 40-10-20 AI Standard</h2>
          <p className="max-w-xl mx-auto text-slate-400 font-medium">We don't just 'guess' your budget. We apply the global standard for financial health, optimized for modern living.</p>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RuleCard rule="40%" title="Essentials" desc="Housing, Utilities, and core survival needs." />
              <RuleCard rule="10%" title="Investment" desc="Strategic growth, stocks, and crypto." />
              <RuleCard rule="20%" title="Lifestyle" desc="Dining, wellness, and tactical sanity." />
           </div>
           
           <div className="mt-12 rounded-3xl bg-slate-900/50 border border-white/10 p-8 text-center backdrop-blur-lg">
              <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-left">
                    <h4 className="text-xl font-bold mb-2">Dynamic Adjustments</h4>
                    <p className="text-sm text-slate-400 font-medium">Our AI monitors your matrix distribution. If your Q4 (Waste) increases, your suggested Q2 (Strategy) budget automatically scales to offset the risk.</p>
                 </div>
                 <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30">
                    <TrendingUp className="h-8 w-8" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 lg:py-40">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-black mb-8 italic">Data alone is noise. <br /><span className="text-blue-500">Analysis is power.</span></h2>
          <Link href="/signup" className="group rounded-2xl bg-white px-10 py-5 text-sm font-black text-slate-900 shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest inline-flex items-center gap-2">
            Start Engineering Your Wealth
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Decision System Framework 1.0 • Built for Clarity</p>
      </footer>
    </div>
  );
}

function QuadrantDetail({ color, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className={`mt-1 h-3 w-3 rounded-full shrink-0 bg-current ${color}`} />
      <div>
        <h4 className={`text-base font-black ${color} mb-1`}>{title}</h4>
        <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function MatrixQuadrant({ code, label, color, dot }) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-tr ${color} flex flex-col items-center justify-center p-4 transition-transform hover:scale-105`}>
      <div className={`h-2 w-2 rounded-full mb-2 ${dot}`} />
      <span className="text-xl font-black opacity-40">{code}</span>
      <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function RuleCard({ rule, title, desc }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center transition-all hover:bg-white/10">
       <div className="text-4xl font-black text-blue-500 mb-2 italic">{rule}</div>
       <div className="text-lg font-black uppercase tracking-widest mb-4">{title}</div>
       <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-tight">{desc}</p>
    </div>
  );
}
