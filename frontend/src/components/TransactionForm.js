'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, Sparkles, Plus, Wallet, Tag, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const CATEGORY_MAP = {
  'Essential': ['Rent', 'Utilities', 'Groceries', 'Transport', 'Insurance', 'Medical'],
  'Investment': ['Stocks', 'Mutual Funds', 'Crypto', 'Gold', 'Real Estate', 'Savings'],
  'Lifestyle': ['Dining', 'Shopping', 'Travel', 'Entertainment', 'Hobbies', 'Gifts'],
  'Health': ['Pharmacy', 'Doctor', 'Wellness', 'Gym', 'Therapy'],
  'Education': ['Tuition', 'Books', 'Courses', 'Software', 'Supplies'],
  'Personal': ['Clothing', 'Grooming', 'Laundry', 'Subscriptions'],
  'Income': ['Salary', 'Freelance', 'Scholarship', 'Gift', 'Investment Return', 'Sales'],
  'Other': ['Taxes', 'Donations', 'Fees', 'Maintenance', 'Misc']
};

export default function TransactionForm({ onSuccess, editData, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Essential',
    subcategory: 'Groceries',
    description: '',
    matrix: {
      importance: 'High',
      usefulness: 'High'
    }
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        amount: editData.amount.toString()
      });
    }
  }, [editData]);

  const handleCategoryChange = (cat) => {
    setFormData({ 
      ...formData, 
      category: cat, 
      subcategory: CATEGORY_MAP[cat][0] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;

    setLoading(true);
    try {
      const url = editData ? `/api/transactions/${editData._id}` : '/api/transactions';
      const method = editData ? 'PUT' : 'POST';
      
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      // Clean data for submission
      if (editData) {
        delete submissionData._id;
        delete submissionData.__v;
        delete submissionData.user;
        delete submissionData.createdAt;
        delete submissionData.updatedAt;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-[40px] bg-slate-900 p-10 shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh] relative custom-scrollbar">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <CreditCard className="h-40 w-40" />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white leading-none tracking-tight">
              {editData ? 'Adjust Stream' : 'Secure Entry'}
            </h2>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">Fiscal Matrix Synchronization</p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="text-slate-500 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl border border-white/10"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Objective Type</label>
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl ring-1 ring-white/10">
              {['expense', 'income'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.type === type 
                    ? 'bg-white text-slate-950 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Value ({user?.currency || '₹'})</label>
            <input
              type="number"
              required
              step="0.01"
              className="w-full rounded-2xl bg-white/5 border border-white/10 text-2xl font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Node Classification</label>
            <select
              className="w-full rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {Object.keys(CATEGORY_MAP).map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Sub-Sector</label>
            <select
              className="w-full rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none appearance-none cursor-pointer"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            >
              {CATEGORY_MAP[formData.category].map(sub => (
                <option key={sub} value={sub} className="bg-slate-900">{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Protocol Note</label>
          <input
            type="text"
            className="w-full rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white focus:ring-4 focus:ring-blue-500/20 py-4 px-6 outline-none transition-all"
            placeholder="Operational description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="rounded-[32px] bg-white/[0.03] p-8 border border-white/10 space-y-6">
          <h3 className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
            <Tag className="h-4 w-4 mr-3" />
            Decision Matrix Parameters
          </h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Importance</label>
              <select
                className="w-full rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-white focus:ring-4 focus:ring-blue-500/20 py-3 px-4 outline-none appearance-none"
                value={formData.matrix.importance}
                onChange={(e) => setFormData({ ...formData, matrix: { ...formData.matrix, importance: e.target.value } })}
              >
                <option value="High" className="bg-slate-900">Priority / High</option>
                <option value="Low" className="bg-slate-900">Trivial / Low</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Usefulness</label>
              <select
                className="w-full rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-white focus:ring-4 focus:ring-blue-500/20 py-3 px-4 outline-none appearance-none"
                value={formData.matrix.usefulness}
                onChange={(e) => setFormData({ ...formData, matrix: { ...formData.matrix, usefulness: e.target.value } })}
              >
                <option value="High" className="bg-slate-900">Productive / High</option>
                <option value="Low" className="bg-slate-900">Wasteful / Low</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.amount}
          className="w-full rounded-[24px] bg-blue-600 py-6 font-black tracking-[0.3em] text-white transition-all hover:bg-blue-500 shadow-2xl shadow-blue-600/20 disabled:opacity-50 active:scale-[0.98] uppercase text-[10px] flex items-center justify-center gap-3"
        >
          {loading ? 'Synchronizing...' : editData ? 'Execute Update' : <><Plus className="h-4 w-4" /> Initialize Transaction</>}
        </button>
      </form>
    </div>
  );
}

