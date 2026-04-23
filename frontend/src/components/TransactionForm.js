'use client';

import { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const [isOpen, setIsOpen] = useState(false);
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
      setFormData(editData);
      setIsOpen(true);
    }
  }, [editData]);

  // Listen for Calculator Result
  useEffect(() => {
    const handleSetAmount = (e) => {
      setFormData(prev => ({ ...prev, amount: e.detail }));
      setIsOpen(true); // Open form if calculator sends value
    };
    window.addEventListener('setAmount', handleSetAmount);
    return () => window.removeEventListener('setAmount', handleSetAmount);
  }, []);

  const handleCategoryChange = (cat) => {
    setFormData({ 
      ...formData, 
      category: cat, 
      subcategory: CATEGORY_MAP[cat][0] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editData ? `/api/transactions/${editData._id}` : '/api/transactions';
      const method = editData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        if (!editData) {
          setFormData({
            amount: '',
            type: 'expense',
            category: 'Essential',
            subcategory: 'Groceries',
            description: '',
            matrix: { importance: 'High', usefulness: 'High' }
          });
        }
        setIsOpen(false);
        if (onCancel) onCancel();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Primary Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-xl shadow-blue-500/40 transition-all hover:scale-110 active:scale-95 group z-50 text-white"
        >
          <Plus className="h-8 w-8 transition-transform group-hover:rotate-90" />
        </button>
      )}

      {/* Modal - Upgraded with Animations */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none">Add Record</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Real-time Decision Engine</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (onCancel) onCancel();
                }} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl ring-1 ring-slate-100">
                    {['expense', 'income'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black capitalize transition-all ${
                          formData.type === type 
                          ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-100 scale-[1.02]' 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount ({user?.currency || '₹'})</label>
                  <input
                    type="number"
                    required
                    className="w-full rounded-2xl bg-slate-50 border-none text-slate-900 font-black text-lg focus:ring-2 focus:ring-blue-600 py-3 px-4 placeholder:text-slate-300 ring-1 ring-slate-100"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <select
                    className="w-full rounded-2xl bg-slate-50 border-none text-xs font-black text-slate-900 focus:ring-2 focus:ring-blue-600 py-3 px-4 ring-1 ring-slate-100"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {Object.keys(CATEGORY_MAP).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sub-Category</label>
                  <select
                    className="w-full rounded-2xl bg-slate-50 border-none text-xs font-black text-slate-900 focus:ring-2 focus:ring-blue-600 py-3 px-4 ring-1 ring-slate-100"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  >
                    {CATEGORY_MAP[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Note (Optional)</label>
                <input
                  type="text"
                  className="w-full rounded-2xl bg-slate-50 border-none text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 py-3 px-4 placeholder:text-slate-300 ring-1 ring-slate-100"
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Matrix Control Section */}
              <div className="rounded-3xl bg-blue-50/50 p-5 ring-1 ring-blue-100 border border-white space-y-4">
                <h3 className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Decision Matrix
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Importance</label>
                    <select
                      className="w-full rounded-xl bg-white border border-slate-100 text-[11px] font-black text-slate-900 focus:ring-2 focus:ring-blue-500 py-2 px-3"
                      value={formData.matrix.importance}
                      onChange={(e) => setFormData({ ...formData, matrix: { ...formData.matrix, importance: e.target.value } })}
                    >
                      <option value="High">Priority / High</option>
                      <option value="Low">Trivial / Low</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Usefulness</label>
                    <select
                      className="w-full rounded-xl bg-white border border-slate-100 text-[11px] font-black text-slate-900 focus:ring-2 focus:ring-blue-500 py-2 px-3"
                      value={formData.matrix.usefulness}
                      onChange={(e) => setFormData({ ...formData, matrix: { ...formData.matrix, usefulness: e.target.value } })}
                    >
                      <option value="High">Productive / High</option>
                      <option value="Low">Wasteful / Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.amount}
                className="w-full rounded-2xl bg-blue-600 py-4 font-black tracking-widest text-white transition-all hover:bg-blue-500 shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98] uppercase text-xs"
              >
                {loading ? 'Processing...' : editData ? 'Execute Update' : 'Secure Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
