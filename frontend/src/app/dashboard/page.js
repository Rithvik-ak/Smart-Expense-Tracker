'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';
import MiniCalculator from '@/components/MiniCalculator';
import AIInsightsCard from '@/components/AIInsightsCard';
import BudgetSuggester from '@/components/BudgetSuggester';
import CategoryProgress from '@/components/CategoryProgress';
import { SpendingTrendChart, CategoryComparisonChart } from '@/components/EnhancedCharts';
import { calculateDashboardInsights } from '@/lib/insightScanner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Target, Zap, LayoutGrid, Tag, Brain, BarChart3, ArrowUpRight, Activity, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import 3D scene to avoid SSR issues
const BudgetScene = dynamic(() => import('@/components/three/BudgetScene'), { ssr: false });

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading || (!user && !authLoading)) return null;

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'expense') acc.expense += curr.amount;
    else acc.income += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;
  const budgetUsage = user?.budget ? (totals.expense / user.budget) * 100 : 0;

  // Pie chart data
  const categoryData = Object.entries(
    transactions.filter(t => t.type === 'expense').reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const { insights, suggestions, weeklyTotal, usageData, categoryTotals } = calculateDashboardInsights(transactions, user);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Weekly Summary Banner */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-10"
          >
            <div className="rounded-[40px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-500/20 relative overflow-hidden group border border-white/10">
              <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-12">
                <BarChart3 className="h-56 w-56" />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <p className="text-blue-100 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Financial Velocity</p>
                <h2 className="text-4xl font-black tracking-tight leading-none mb-4">
                  {user.currency || '₹'}{weeklyTotal.toLocaleString()} <span className="text-blue-200/60 text-xl font-medium tracking-normal">spent this week</span>
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5 text-blue-300" />
                  {weeklyTotal > (user?.budget / 4) ? 'Efficiency Below Target' : 'Optimal Spending Pattern'} 
                </div>
              </div>
              <div className="relative z-10 flex gap-4">
                <Link href="/reports" className="glass px-8 py-4 rounded-2xl font-black text-xs hover:bg-white/10 transition-all uppercase tracking-widest">Full Report</Link>
                <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-xs shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">Quick Export</button>
              </div>
            </div>
          </motion.div>

          {/* Header Stats */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
          >
            <StatCard title="Liquidity" value={balance} icon={Wallet} color="blue" currency={user.currency} />
            <StatCard title="Inflow" value={totals.income} icon={TrendingUp} color="green" currency={user.currency} />
            <StatCard title="Outflow" value={totals.expense} icon={TrendingDown} color="red" currency={user.currency} />
            <StatCard title="Efficiency" value={Math.max(0, 100 - budgetUsage).toFixed(0) + '%'} icon={Zap} color="yellow" />
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
          {/* 3D Budget Visualization */}
          <div className="lg:col-span-1 glass-card p-8 rounded-[32px]">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                <Target className="h-5 w-5" />
              </div>
              Budget Alignment
            </h3>
            <div className="h-[250px] relative">
               <BudgetScene percentage={Math.min(100, budgetUsage)} />
            </div>
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Consumption</p>
                  <p className="text-2xl font-black text-white">{user.currency || '₹'}{totals.expense.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Threshold</p>
                  <p className="text-xl font-black text-blue-500">{user.currency || '₹'}{user?.budget?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, budgetUsage)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${budgetUsage > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                />
              </div>
            </div>
          </div>

          {/* Charts & AI Dashboard Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI and Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AIInsightsCard insights={insights} />
              <div className="glass-card p-8 rounded-[32px] flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Expenditure Trend</h3>
                <div className="flex-1 min-h-[200px]">
                   <SpendingTrendChart data={transactions} />
                </div>
              </div>
            </div>

            {/* Budget Suggestions & Detailed Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <BudgetSuggester suggestions={suggestions} currentLimits={user?.categoryLimits} onApply={fetchTransactions} />
               <div className="glass-card p-8 rounded-[32px] space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Category Saturation</h3>
                 <div className="space-y-6">
                    {usageData.map(data => (
                      <CategoryProgress key={data.name} category={data.name} spent={data.spent} limit={data.limit} />
                    ))}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Bar Comparison */}
              <div className="glass-card p-8 rounded-[32px]">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  Structural Analysis
                </h3>
                <div className="h-[250px]">
                  <CategoryComparisonChart categoryTotals={categoryTotals} />
                </div>
              </div>

              {/* Matrix Quadrant Summary */}
              <div className="glass-card p-8 rounded-[32px]">
                <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                      <LayoutGrid className="h-5 w-5" />
                   </div>
                   Decision Matrix
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <MatrixBox quadrant="Q1" color="border-emerald-500/20 bg-emerald-500/5 text-emerald-400" label="Essential" count={transactions.filter(t => t.matrix?.quadrant === 'Q1').length} />
                  <MatrixBox quadrant="Q2" color="border-blue-500/20 bg-blue-500/5 text-blue-400" label="Investment" count={transactions.filter(t => t.matrix?.quadrant === 'Q2').length} />
                  <MatrixBox quadrant="Q3" color="border-orange-500/20 bg-orange-500/5 text-orange-400" label="Lifestyle" count={transactions.filter(t => t.matrix?.quadrant === 'Q3').length} />
                  <MatrixBox quadrant="Q4" color="border-red-500/20 bg-red-500/5 text-red-400" label="Trash" count={transactions.filter(t => t.matrix?.quadrant === 'Q4').length} />
                </div>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="glass-card p-8 rounded-[32px] overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white">Activity Feed</h3>
                <Link href="/reports" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">View All History</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500">
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px]">Reference</th>
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-center">Category</th>
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-center">Quadrant</th>
                      <th className="pb-4 font-black uppercase tracking-widest text-[10px] text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-slate-600 font-bold">No activity detected.</td>
                      </tr>
                    ) : (
                      transactions.slice(0, 6).map((t) => (
                        <tr key={t._id} className="group/row hover:bg-white/[0.02] transition-colors">
                          <td className="py-5">
                            <div className="font-black text-slate-200">{t.description || t.category}</div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{new Date(t.date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-5 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{t.category}</span>
                              {t.subcategory && (
                                <span className="text-[9px] text-slate-600 font-bold flex items-center gap-1 uppercase tracking-widest">
                                  {t.subcategory}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black border ${
                              t.matrix?.quadrant === 'Q1' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                              t.matrix?.quadrant === 'Q2' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                              t.matrix?.quadrant === 'Q3' ? 'border-orange-500/20 text-orange-400 bg-orange-600/5' :
                              'border-red-500/20 text-red-400 bg-red-500/5'
                            }`}>
                              {t.matrix?.quadrant}
                            </span>
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
          </motion.div>
        </motion.div>
      </main>

      <TransactionForm onSuccess={fetchTransactions} />
      <MiniCalculator />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, currency }) {
  const colorMap = {
    blue: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-600/10 text-red-400 border-red-500/20',
    yellow: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="glass-card p-6 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <div className={`rounded-xl p-2.5 border ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-black text-white tracking-tight">
        {typeof value === 'number' ? `${currency || '₹'}${value.toLocaleString()}` : value}
      </p>
    </div>
  );
}

function MatrixBox({ quadrant, label, count, color }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl p-6 border transition-all hover:scale-105 ${color}`}>
      <span className="text-2xl font-black">{quadrant}</span>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-60 text-center">{label}</span>
      <span className="mt-3 text-2xl font-black">{count}</span>
    </div>
  );
}
