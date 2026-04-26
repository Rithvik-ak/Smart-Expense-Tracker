'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';
import MiniCalculator from '@/components/MiniCalculator';
import AIInsightsCard from '@/components/AIInsightsCard';
import TaskManager from '@/components/TaskManager';
import PomodoroTimer from '@/components/PomodoroTimer';
import StudentProfilePanel from '@/components/StudentProfilePanel';
import { SpendingTrendChart, CategoryComparisonChart } from '@/components/EnhancedCharts';
import { calculateDashboardInsights } from '@/lib/insightScanner';
import { Wallet, TrendingUp, TrendingDown, Target, Zap, LayoutGrid, Tag, Brain, BarChart3, ArrowUpRight, Activity, Sparkles, ChevronRight, Trash2, Edit3, Plus, Search, Calendar, Bell } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import 3D scene to avoid SSR issues
const BudgetScene = dynamic(() => import('@/components/three/BudgetScene'), { ssr: false });

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading || (!user && !authLoading)) return null;

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.expense += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;
  const budgetUsage = user?.budget ? (totals.expense / user.budget) * 100 : 0;

  const { insights, suggestions, weeklyTotal, usageData, categoryTotals } = calculateDashboardInsights(transactions, user);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 pb-24 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="xl:col-span-3 space-y-8">
            <StudentProfilePanel user={user} />
            
            <div className="glass-card p-8 rounded-[32px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Financial Overview</h3>
              <div className="space-y-6">
                 <MiniStat label="Liquidity" value={balance} icon={Wallet} color="text-blue-400" currency={user.currency} />
                 <MiniStat label="Inflow" value={totals.income} icon={TrendingUp} color="text-emerald-400" currency={user.currency} />
                 <MiniStat label="Outflow" value={totals.expense} icon={TrendingDown} color="text-red-400" currency={user.currency} />
              </div>
            </div>

            <div className="glass-card p-8 rounded-[32px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <ActionBtn icon={Search} label="Search" />
                <ActionBtn icon={Calendar} label="Plans" />
                <ActionBtn icon={Bell} label="Alerts" />
                <ActionBtn icon={Target} label="Goals" />
              </div>
            </div>
          </div>

          {/* Middle Column: Central Intelligence */}
          <div className="xl:col-span-6 space-y-8">
            
            {/* Header / Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[48px] bg-gradient-to-br from-indigo-600 to-purple-800 p-12 text-white overflow-hidden shadow-2xl shadow-indigo-500/20"
            >
              <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
                 <Zap className="h-64 w-64 fill-white" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-[0.2em] mb-6">
                   <Activity className="h-3 w-3" /> System Operational
                </div>
                <p className="text-indigo-100 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Total Weekly Expenditure</p>
                <h2 className="text-6xl font-black tracking-tighter leading-none mb-8">
                  {user.currency || '₹'}{weeklyTotal.toLocaleString()}
                </h2>
                <div className="flex gap-4">
                   <button className="px-6 py-3 rounded-2xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Optimize Flow</button>
                   <Link href="/reports" className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Intelligence Report</Link>
                </div>
              </div>
            </motion.div>

            {/* AI Insights & Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <AIInsightsCard insights={insights} />
               <div className="glass-card p-8 rounded-[32px] flex flex-col h-full">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center justify-between">
                    Velocity Analysis
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </h3>
                  <div className="flex-1 min-h-[250px]">
                    <SpendingTrendChart data={transactions} />
                  </div>
               </div>
            </div>

            {/* Matrix & Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-card p-8 rounded-[32px]">
                  <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                       <LayoutGrid className="h-5 w-5" />
                    </div>
                    Decision Engine
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MatrixBox quadrant="Q1" color="border-emerald-500/20 bg-emerald-500/5 text-emerald-400" label="Essential" count={transactions.filter(t => t.matrix?.quadrant === 'Q1').length} />
                    <MatrixBox quadrant="Q2" color="border-blue-500/20 bg-blue-500/5 text-blue-400" label="Investment" count={transactions.filter(t => t.matrix?.quadrant === 'Q2').length} />
                    <MatrixBox quadrant="Q3" color="border-orange-500/20 bg-orange-500/5 text-orange-400" label="Lifestyle" count={transactions.filter(t => t.matrix?.quadrant === 'Q3').length} />
                    <MatrixBox quadrant="Q4" color="border-red-500/20 bg-red-500/5 text-red-400" label="Waste" count={transactions.filter(t => t.matrix?.quadrant === 'Q4').length} />
                  </div>
               </div>

               <div className="glass-card p-8 rounded-[32px]">
                  <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                       <BarChart3 className="h-5 w-5" />
                    </div>
                    Structural Map
                  </h3>
                  <div className="h-[200px]">
                    <CategoryComparisonChart categoryTotals={categoryTotals} />
                  </div>
               </div>
            </div>

            {/* Recent Activity Card */}
            <div className="glass-card p-8 rounded-[32px] overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Activity Feed</h3>
                <Link href="/reports" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Neural History</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500">
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px]">Objective</th>
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-center">Module</th>
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-12 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">No Data Streams Detected</td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((t) => (
                        <tr key={t._id} className="group/row hover:bg-white/[0.02] transition-colors">
                          <td className="py-5">
                            <div className="font-black text-slate-200">{t.description || t.category}</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{new Date(t.date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-5 text-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.category}</span>
                          </td>
                          <td className={`py-5 text-right font-black ${t.type === 'expense' ? 'text-slate-200' : 'text-emerald-400'}`}>
                            {t.type === 'expense' ? '-' : '+'}{user.currency || '₹'}{t.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Productivity Modules */}
          <div className="xl:col-span-3 space-y-8">
             <PomodoroTimer />
             <TaskManager />
             
             <div className="glass-card p-8 rounded-[32px]">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center justify-between">
                 Budget Saturation
                 <span className="text-blue-500">{budgetUsage.toFixed(0)}%</span>
               </h3>
               <div className="space-y-6">
                 {usageData.slice(0, 3).map(data => (
                   <div key={data.name} className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">{data.name}</span>
                       <span className="text-slate-500">{user.currency}{data.spent} / {user.currency}{data.limit}</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(100, (data.spent / data.limit) * 100)}%` }}
                         className={`h-full ${data.spent > data.limit ? 'bg-red-500' : 'bg-blue-500'}`}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* Floating Quick Add Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-10 right-10 h-20 w-20 rounded-[28px] bg-white text-slate-950 flex items-center justify-center shadow-2xl shadow-white/10 z-[90] group overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Plus className="h-10 w-10 relative z-10 transition-colors group-hover:text-white" />
      </motion.button>

      {/* Forms */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowForm(false)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative z-10 w-full max-w-xl"
             >
               <TransactionForm 
                 onSuccess={() => {
                   fetchTransactions();
                   setShowForm(false);
                 }} 
                 onCancel={() => setShowForm(false)}
               />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {editItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setEditItem(null)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative z-10 w-full max-w-xl"
             >
               <TransactionForm 
                 editData={editItem} 
                 onSuccess={() => {
                   setEditItem(null);
                   fetchTransactions();
                 }}
                 onCancel={() => setEditItem(null)}
               />
             </motion.div>
        </div>
      )}

      <MiniCalculator />
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color, currency }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
           <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <span className="text-sm font-black text-white">{currency || '₹'}{value.toLocaleString()}</span>
    </div>
  );
}

function ActionBtn({ icon: Icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/10 group">
      <Icon className="h-5 w-5 text-slate-400 group-hover:text-white mb-2 transition-colors" />
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">{label}</span>
    </button>
  );
}

function MatrixBox({ quadrant, label, count, color }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl p-4 border transition-all hover:scale-105 ${color}`}>
      <span className="text-xl font-black">{quadrant}</span>
      <span className="text-[8px] font-black uppercase tracking-[0.1em] mt-1 opacity-60 text-center">{label}</span>
      <span className="mt-2 text-xl font-black">{count}</span>
    </div>
  );
}

