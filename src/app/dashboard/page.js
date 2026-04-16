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
import { Wallet, TrendingUp, TrendingDown, Target, Zap, LayoutGrid, Tag, Brain, BarChart3, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Weekly Summary Banner */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="rounded-3xl bg-blue-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-500/30 ring-4 ring-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <BarChart3 className="h-40 w-40" />
            </div>
            <div className="relative z-10 text-center md:text-left">
              <p className="text-blue-100 font-black uppercase tracking-widest text-[10px] mb-2">Weekly Summary</p>
              <h2 className="text-3xl font-black">You spent {user.currency || '₹'}{weeklyTotal.toLocaleString()} this week</h2>
              <p className="text-blue-100 text-sm font-bold mt-2 flex items-center gap-2 justify-center md:justify-start">
                {weeklyTotal > (user?.budget / 4) ? 'You are pacing high for your budget' : 'Excellent spending control detected'} 
                <ArrowUpRight className="h-4 w-4" />
              </p>
            </div>
            <div className="relative z-10 flex gap-4">
              <Link href="/reports" className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-xs hover:bg-white/30 transition-all ring-1 ring-white/20 uppercase tracking-widest">Reports</Link>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">Optimized View</button>
            </div>
          </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Balance" value={balance} icon={Wallet} color="blue" currency={user.currency} />
          <StatCard title="Monthly Income" value={totals.income} icon={TrendingUp} color="green" currency={user.currency} />
          <StatCard title="Monthly Expenses" value={totals.expense} icon={TrendingDown} color="red" currency={user.currency} />
          <StatCard title="Budget Score" value={Math.max(0, 100 - budgetUsage).toFixed(0) + '%'} icon={Zap} color="yellow" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 3D Budget Visualization */}
          <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-600" />
              Budget Health
            </h3>
            <p className="text-sm text-slate-500 mb-4 font-medium">Real-time spending vs goal alignment</p>
            <BudgetScene percentage={Math.min(100, budgetUsage)} />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Spent</span>
                <span className="text-slate-900 font-bold">{user.currency || '₹'}{totals.expense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Limit</span>
                <span className="text-blue-600 font-bold">{user.currency || '₹'}{user?.budget?.toLocaleString() || 0}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-4 shadow-inner">
                <div 
                  className={`h-full transition-all duration-500 ${budgetUsage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, budgetUsage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Charts & AI Dashboard Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI and Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AIInsightsCard insights={insights} />
              <div className="space-y-4">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-1">Weekly Trends</h3>
                  <SpendingTrendChart data={transactions} />
                </div>
              </div>
            </div>

            {/* Budget Suggestions & Detailed Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <BudgetSuggester suggestions={suggestions} currentLimits={user?.categoryLimits} onApply={fetchTransactions} />
               <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-3">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Goal Consumption</h3>
                 {usageData.map(data => (
                   <CategoryProgress key={data.name} category={data.name} spent={data.spent} limit={data.limit} />
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Bar Comparison */}
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-emerald-600" />
                  Structure Analysis
                </h3>
                <CategoryComparisonChart categoryTotals={categoryTotals} />
              </div>

              {/* Matrix Quadrant Summary */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Matrix Distribution</h3>
                <div className="grid grid-cols-2 gap-3 h-[250px]">
                  <MatrixBox quadrant="Q1" color="bg-green-50 text-green-700 ring-green-100" label="Essential" count={transactions.filter(t => t.matrix?.quadrant === 'Q1').length} />
                  <MatrixBox quadrant="Q2" color="bg-blue-50 text-blue-700 ring-blue-100" label="Investment" count={transactions.filter(t => t.matrix?.quadrant === 'Q2').length} />
                  <MatrixBox quadrant="Q3" color="bg-orange-50 text-orange-700 ring-orange-100" label="Lifestyle" count={transactions.filter(t => t.matrix?.quadrant === 'Q3').length} />
                  <MatrixBox quadrant="Q4" color="bg-red-50 text-red-700 ring-red-100" label="Trash" count={transactions.filter(t => t.matrix?.quadrant === 'Q4').length} />
                </div>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400">
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Description</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-center">Category / Sub</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-center">Quadrant</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-[10px] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-slate-500 italic">No transactions found.</td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((t) => (
                        <tr key={t._id} className="group hover:bg-slate-50 transition-colors text-xs">
                          <td className="py-4">
                            <div className="font-bold text-slate-900">{t.description || t.category}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{new Date(t.date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-black text-slate-700">{t.category}</span>
                              {t.subcategory && (
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                  <Tag className="h-2 w-2" /> {t.subcategory}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ring-1 ring-inset ${
                              t.matrix?.quadrant === 'Q1' ? 'bg-green-50 text-green-700 ring-green-600/10' :
                              t.matrix?.quadrant === 'Q2' ? 'bg-blue-50 text-blue-700 ring-blue-600/10' :
                              t.matrix?.quadrant === 'Q3' ? 'bg-orange-50 text-orange-700 ring-orange-600/10' :
                              'bg-red-50 text-red-700 ring-red-600/10'
                            }`}>
                              {t.matrix?.quadrant}
                            </span>
                          </td>
                          <td className={`py-4 text-right font-black ${t.type === 'expense' ? 'text-slate-700' : 'text-green-600'}`}>
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
        </div>
      </main>

      <TransactionForm onSuccess={fetchTransactions} />
      <MiniCalculator />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, currency }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 ring-blue-500/20',
    green: 'bg-green-500/10 text-green-500 ring-green-500/20',
    red: 'bg-red-500/10 text-red-500 ring-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 ring-yellow-500/20',
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className={`rounded-lg p-2 ring-1 ring-inset ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">
        {typeof value === 'number' ? `${currency || '₹'}${value.toLocaleString()}` : value}
      </p>
    </div>
  );
}

function MatrixBox({ quadrant, label, count, color }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:ring-blue-100 ${color}`}>
      <span className="text-lg font-black">{quadrant}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{label}</span>
      <span className="mt-2 text-xl font-black text-slate-900">{count}</span>
    </div>
  );
}
