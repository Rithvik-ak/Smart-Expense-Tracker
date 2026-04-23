'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const result = await signup(email, password, name, age);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full space-y-12 max-w-md relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex justify-center group mb-12">
            <div className="rounded-[24px] bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
          </Link>
          <h2 className="text-5xl font-black tracking-tighter text-white mb-4">
            Initialize <span className="text-gradient">Account</span>
          </h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Deploy your personal fiscal instance
          </p>
        </div>
        
        <div className="glass-card rounded-[40px] p-10 relative overflow-hidden">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-500/10 p-4 border border-red-500/20"
              >
                <p className="text-[10px] font-black text-red-400 text-center uppercase tracking-widest">{error}</p>
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Display Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-[20px] border border-white/10 bg-white/5 py-4 px-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold outline-none tracking-tight"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Age</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-[20px] border border-white/10 bg-white/5 py-4 px-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold outline-none tracking-tight"
                    placeholder="00"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Communication Node</label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-[24px] border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold outline-none tracking-tight"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Security Key</label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-[24px] border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold outline-none tracking-tight"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Confirm Key</label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-[24px] border border-white/10 bg-white/5 py-5 pl-14 pr-6 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold outline-none tracking-tight"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-[24px] bg-blue-600 py-5 text-[10px] font-black text-white transition-all hover:bg-blue-500 shadow-2xl shadow-blue-600/30 disabled:opacity-50 uppercase tracking-[0.2em]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Generate Instance'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Existing operative?{' '}
            <Link href="/login" className="text-blue-400 hover:text-white transition-colors">
              Access Core
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
