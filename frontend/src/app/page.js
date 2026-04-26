'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight, Zap, Target, BarChart3, Shield, PieChart, Activity, Globe, MousePointer2, Sparkles, Brain, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Dynamic hero scene
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function LandingPage() {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-slate-50 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 flex items-center justify-center"
            >
              <Zap className="h-6 w-6 text-white fill-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Astra</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] hidden md:block">Modules</Link>
            <Link href="#preview" className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] hidden md:block">Preview</Link>
            {user ? (
              <Link href="/dashboard" className="glass px-6 py-2.5 rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]">Command Center</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[10px] font-black text-slate-300 px-4 py-2 hover:text-white transition-all uppercase tracking-[0.2em]">Access</Link>
                <Link href="/signup" className="rounded-xl bg-white px-6 py-2.5 text-[10px] font-black text-slate-950 shadow-xl shadow-white/10 transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 uppercase tracking-[0.2em]">Initialize</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <HeroScene />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8 border-blue-500/30"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">System v1.0.4 Online</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-5xl text-7xl font-black tracking-tight sm:text-8xl lg:text-9xl leading-[0.85] mb-8"
          >
            Your Life. <br />
            <span className="text-gradient">Optimized.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mx-auto max-w-2xl text-lg text-slate-400 font-medium leading-relaxed mb-12"
          >
            Astra helps students manage money, time, and goals in one system. 
            The central command center for your academic and financial future.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href={user ? "/dashboard" : "/signup"} className="group relative rounded-2xl bg-white px-10 py-5 text-[10px] font-black text-slate-950 shadow-2xl shadow-white/10 transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.3em]">
              Get Started
              <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#preview" className="glass rounded-2xl px-10 py-5 text-[10px] font-black text-white transition-all hover:bg-white/10 uppercase tracking-[0.3em]">
              Explore System
            </Link>
          </motion.div>
        </div>

        {/* Floating Icons */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-1 h-10 rounded-full bg-gradient-to-b from-blue-500 to-transparent" />
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 lg:py-48 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3} 
              title="Finance OS" 
              desc="Scientific spending analysis with 2x2 matrix categorization. Stop guessing, start growing."
              gradient="from-blue-600 to-indigo-600"
            />
            <FeatureCard 
              icon={Clock} 
              title="Time Control" 
              desc="Built-in Pomodoro and task management designed for deep focus sessions."
              gradient="from-purple-600 to-pink-600"
            />
            <FeatureCard 
              icon={Brain} 
              title="AI Insights" 
              desc="Neural suggestions that adapt to your student lifestyle. Predictive saving at its best."
              gradient="from-emerald-600 to-teal-600"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="preview" className="py-24 lg:py-48 relative overflow-hidden bg-white/[0.01]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
         
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-4 block"
               >
                 Command Center
               </motion.span>
               <h2 className="text-5xl font-black sm:text-7xl tracking-tight mb-8">Master Your <span className="text-gradient">Ecosystem.</span></h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mx-auto max-w-6xl"
            >
              <div className="glass-card rounded-[40px] p-2 lg:p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                  alt="Dashboard Preview" 
                  className="rounded-[32px] w-full border border-white/5 grayscale-[0.2] opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                   <Link href="/signup" className="glass p-6 rounded-full group">
                     <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-slate-950 transition-transform group-hover:scale-110">
                        <ArrowRight className="h-8 w-8" />
                     </div>
                   </Link>
                </div>
              </div>
              
              {/* Floating Labels */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl hidden lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</p>
                    <p className="text-lg font-black text-white">+12.4%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-56 relative">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="rounded-[64px] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-16 lg:p-32 shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-5xl font-black sm:text-7xl mb-12 relative z-10 tracking-tight leading-tight">Ready to <br /> Upgrade?</h2>
            <Link href="/signup" className="inline-flex items-center gap-3 rounded-2xl bg-white px-12 py-6 text-[10px] font-black text-blue-700 shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.3em] relative z-10">
              Initialize Astra
              <Zap className="h-5 w-5 fill-current" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white fill-white" />
                  </div>
                  <span className="text-xl font-black uppercase italic tracking-tighter">Astra</span>
               </div>
               <p className="text-slate-500 text-sm font-medium">The Operating System for Students.</p>
            </div>
            <div className="flex gap-12">
               <FooterLink href="#" label="System" />
               <FooterLink href="#" label="Security" />
               <FooterLink href="#" label="Network" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">© 2026 Astra OS • v1.0.4</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, gradient }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card p-10 rounded-[40px] group transition-all duration-500 hover:border-white/20"
    >
      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium text-lg leading-relaxed">{desc}</p>
      
      <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
        Learn More <ArrowRight className="h-3 w-3" />
      </div>
    </motion.div>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link href={href} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
      {label}
    </Link>
  );
}
