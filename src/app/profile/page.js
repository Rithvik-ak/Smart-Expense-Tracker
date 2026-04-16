'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { User, Mail, Calendar, Target, ShieldCheck, Zap, Edit3, X, Save, Wallet } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100 overflow-hidden relative">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute top-8 right-8 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest"
          >
            <Edit3 className="h-3 w-3" /> Update Details
          </button>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-500/20">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{user.name || 'User'}</h1>
              <p className="text-slate-500 font-medium">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-center">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-inset ring-blue-100 uppercase tracking-tight">
                  Premium Member
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-inset ring-emerald-100 uppercase tracking-tight">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Account Verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem icon={User} label="Full Name" value={user.name} />
                <DetailItem icon={Calendar} label="Age" value={user.age} />
                <DetailItem icon={Mail} label="Email Address" value={user.email} />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Zap className="mr-2 h-4 w-4 text-amber-500" />
                Financial Stats
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <DetailItem icon={Target} label="Personal Budget" value={`${user.currency || '₹'}${user.budget?.toLocaleString() || 0}`} highlight />
                <DetailItem icon={Wallet} label="Monthly Income" value={`${user.currency || '₹'}${user.income?.toLocaleString() || 0}`} />
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Currency Preference</p>
                  <p className="text-sm text-slate-700 font-black">{user.currency || '₹'} - Indian Rupee (Default)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Security Settings</h2>
            <button className="rounded-xl bg-slate-50 px-8 py-3.5 text-sm font-bold text-slate-400 cursor-not-allowed">
              Password Lock (Enabled)
            </button>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-xl text-white">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">Update Profile</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Sync your financial parameters</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 py-3.5 px-4 ring-1 ring-slate-100"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 py-3.5 px-4 ring-1 ring-slate-100"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Income</label>
                  <input
                    type="number"
                    className="w-full rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 py-3.5 px-4 ring-1 ring-slate-100"
                    placeholder="0"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Symbol</label>
                  <select
                    className="w-full rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 py-3.5 px-4 ring-1 ring-slate-100"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || success}
                className={`w-full rounded-2xl py-4 font-black tracking-widest text-white transition-all shadow-xl flex items-center justify-center gap-2 uppercase text-xs ${
                  success ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                }`}
              >
                {saving ? 'Processing...' : success ? <><Check className="h-4 w-4" /> Profile Updated</> : <><Save className="h-4 w-4" /> Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 group hover:border-blue-100 transition-colors">
      <div className="rounded-xl bg-white p-2.5 shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-sm font-black ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>{value}</p>
      </div>
    </div>
  );
}

function Check({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
}
