'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Zap, Shield, BarChart3, TrendingUp, Sparkles, ArrowRight, LayoutGrid, Clock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 flex">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-white transition-colors">Return to Home</span>
          </Link>
          <Link href="/signup" className="rounded-xl bg-white px-5 py-2 text-[10px] font-black text-slate-950 shadow-xl shadow-white/10 transition-all hover:bg-blue-50 uppercase tracking-widest">Initialize System</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-8 backdrop-blur-md"
          >
            <Cpu className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">System Architecture</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl text-5xl font-black tracking-tight sm:text-7xl mb-8 leading-[0.9]"
          >
            The Operating <br />
            <span className="text-gradient">System for Students.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-slate-400 font-medium leading-relaxed"
          >
            Astra isn't just a tracker. It's a comprehensive engine designed to optimize 
            every aspect of a student's fiscal and temporal life.
          </motion.p>
        </div>
      </section>

      {/* 2x2 Matrix Deep Dive */}
      <section className="py-20 lg:py-48 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter flex items-center gap-4 italic">
                <LayoutGrid className="h-10 w-10 text-blue-500" />
                The Neural Matrix
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-12 text-lg">
                Our proprietary decision engine classifies transactions into one of four nodes based on its 
                long-term value and immediate necessity.
              </p>
              
              <div className="space-y-8">
                <QuadrantDetail 
                    color="text-emerald-400" 
                    title="Node Alpha (Vital)" 
                    desc="High Importance, High Utility. Foundations like rent, groceries, and academic fees." 
                />
                <QuadrantDetail 
                    color="text-blue-400" 
                    title="Node Beta (Strategy)" 
                    desc="High Utility, Low Importance. Growth assets: courses, books, and investments." 
                />
                <QuadrantDetail 
                    color="text-amber-400" 
                    title="Node Gamma (Comfort)" 
                    desc="High Importance, Low Utility. Necessary lifestyle adjustments to maintain sanity." 
                />
                <QuadrantDetail 
                    color="text-red-400" 
                    title="Node Delta (Waste)" 
                    desc="Zero Utility. Impulsive leaks that drain the system's efficiency." 
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-lg mx-auto w-full group"
            >
               <div className="absolute inset-0 bg-white/5 rounded-[64px] border border-white/10 backdrop-blur-3xl shadow-2xl p-8 grid grid-cols-2 grid-rows-2 gap-4">
                  <MatrixQuadrant code="α" label="VITAL" color="from-emerald-600/20 to-emerald-500/10 border-emerald-500/20" dot="bg-emerald-500" />
                  <MatrixQuadrant code="β" label="STRATEGY" color="from-blue-600/20 to-blue-500/10 border-blue-500/20" dot="bg-blue-500" />
                  <MatrixQuadrant code="γ" label="COMFORT" color="from-amber-600/20 to-amber-500/10 border-amber-500/20" dot="bg-amber-500" />
                  <MatrixQuadrant code="δ" label="WASTE" color="from-red-600/20 to-red-500/10 border-red-500/20" dot="bg-red-500" />
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
               </div>
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase">Neural Utility</div>
               <div className="absolute top-1/2 -right-16 -translate-y-1/2 rotate-90 text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase">Impact Node</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 lg:py-48 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-24">
          <h2 className="text-5xl font-black mb-6 tracking-tighter">Integrated <span className="text-gradient">Modules.</span></h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg">Astra converges multiple streams of intelligence into one unified interface.</p>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <ModuleCard icon={BarChart3} title="Fiscal Engine" desc="Advanced matrix analysis for scientific spending." />
           <ModuleCard icon={Clock} title="Temporal Control" desc="Built-in Pomodoro and deep work tracking." />
           <ModuleCard icon={Target} title="Goal Protocol" desc="Gamified achievement system for long-term growth." />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-56 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-20 rounded-[64px] border-white/20"
          >
            <h2 className="text-5xl font-black mb-12 italic leading-tight tracking-tighter">The future of <br /> Student Life is <span className="text-blue-500">Automated.</span></h2>
            <Link href="/signup" className="group rounded-2xl bg-white px-12 py-6 text-[10px] font-black text-slate-900 shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.3em] inline-flex items-center gap-3">
              Initialize Astra Node
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center">
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Astra System Framework v1.0.4 • Protocol 091-B</p>
      </footer>
    </div>
  );
}

function QuadrantDetail({ color, title, desc }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className={`mt-1.5 h-3 w-3 rounded-full shrink-0 bg-current ${color} shadow-lg shadow-current/20 group-hover:scale-125 transition-transform`} />
      <div>
        <h4 className={`text-xl font-black ${color} mb-2 tracking-tight`}>{title}</h4>
        <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function MatrixQuadrant({ code, label, color, dot }) {
  return (
    <div className={`rounded-3xl border bg-gradient-to-tr ${color} flex flex-col items-center justify-center p-6 transition-transform hover:scale-105`}>
      <div className={`h-3 w-3 rounded-full mb-4 ${dot} shadow-lg shadow-current/50`} />
      <span className="text-4xl font-black opacity-30 italic">{code}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">{label}</span>
    </div>
  );
}

function ModuleCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass-card p-10 rounded-[40px] hover:border-white/20 transition-all group">
       <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
          <Icon className="h-8 w-8" />
       </div>
       <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{title}</h3>
       <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

