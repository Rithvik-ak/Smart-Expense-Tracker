'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { User, Mail, Calendar, Target, ShieldCheck, Zap, Edit3, X, Save, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    income: '',
    budget: '',
    currency: '₹'
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        income: user.income || '',
        budget: user.budget || '',
        currency: user.currency || '₹'
      });
    }
  }, [user]);

  if (loading || !user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsModalOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-card p-10 rounded-[40px] relative overflow-hidden group">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute top-10 right-10 flex items-center gap-2 rounded-2xl bg-white text-slate-950 px-6 py-3 text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-widest z-10"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>

          <div className="flex flex-col md:flex-row items-center gap-10 mb-16 relative z-10">
            <div className="h-32 w-32 rounded-[32px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-700">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">{user.name || 'Financial Voyager'}</h1>
              <p className="text-slate-500 font-bold text-lg">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <span className="inline-flex items-center rounded-xl bg-blue-600/10 px-4 py-1.5 text-[10px] font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                  Enterprise Tier
                </span>
                <span className="inline-flex items-center rounded-xl bg-emerald-600/10 px-4 py-1.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Biometrically Verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-8">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500 border border-white/10">
                  <User className="h-4 w-4" />
                </div>
                Identity Core
              </h2>
              <div className="space-y-4">
                <DetailItem icon={User} label="Operational Name" value={user.name} />
                <DetailItem icon={Mail} label="Comms Channel" value={user.email} />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 border border-white/10">
                  <Zap className="h-4 w-4" />
                </div>
                Fiscal Parameters
              </h2>
              <div className="space-y-4">
                <DetailItem icon={Target} label="Budget Threshold" value={`${user.currency || '₹'}${user.budget?.toLocaleString() || 0}`} highlight />
                <DetailItem icon={Wallet} label="Revenue Stream" value={`${user.currency || '₹'}${user.income?.toLocaleString() || 0}`} />
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-white/5 relative z-10">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Security Protocol</h2>
            <div className="flex gap-4">
               <div className="rounded-2xl bg-white/5 px-8 py-4 text-[10px] font-black text-slate-500 border border-white/10 uppercase tracking-widest cursor-not-allowed">
                 Quantum Encryption: Active
               </div>
               <div className="rounded-2xl bg-white/5 px-8 py-4 text-[10px] font-black text-slate-500 border border-white/10 uppercase tracking-widest cursor-not-allowed">
                 MFA Override: Disabled
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl rounded-[40px] bg-slate-900 p-10 shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Edit3 className="h-40 w-40" />
              </div>

              <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="bg-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <Edit3 className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none tracking-tight">Sync Parameters</h2>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">Adjust your fiscal environment</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-500 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl border border-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Display Identification</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 text-lg font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Communication Node</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 text-lg font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Fiscal Limit</label>
                    <input
                      type="number"
                      className="w-full rounded-2xl bg-white/5 border border-white/10 text-lg font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all"
                      placeholder="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Symbol Set</label>
                    <select
                      className="w-full rounded-2xl bg-white/5 border border-white/10 text-lg font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all appearance-none"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="₹" className="bg-slate-900">₹ (INR)</option>
                      <option value="$" className="bg-slate-900">$ (USD)</option>
                      <option value="€" className="bg-slate-900">€ (EUR)</option>
                      <option value="£" className="bg-slate-900">£ (GBP)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || success}
                  className={`w-full rounded-2xl py-5 font-black tracking-[0.2em] text-white transition-all shadow-2xl flex items-center justify-center gap-3 uppercase text-xs ${
                    success ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  }`}
                >
                  {saving ? 'Processing Sync...' : success ? <><Check className="h-5 w-5" /> Protocol Updated</> : <><Save className="h-5 w-5" /> Execute Update</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-6 rounded-[24px] bg-white/[0.03] p-6 border border-white/5 group hover:bg-white/[0.06] transition-all">
      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors border border-white/10">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className={`text-xl font-black ${highlight ? 'text-blue-400' : 'text-white'} tracking-tight`}>{value || 'Unset'}</p>
      </div>
    </div>
  );
}

function Check({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>;
}
