'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  FileText, Calendar, Download, TrendingUp, TrendingDown, 
  Filter, PieChart as PieIcon, Activity, ArrowLeft, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // '7' or '30'

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

  const now = new Date();
  const rangeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - parseInt(timeRange));
  
  const filteredData = transactions.filter(t => new Date(t.date) >= rangeDate);

  const stats = filteredData.reduce((acc, t) => {
    if (t.type === 'expense') acc.expense += t.amount;
    else acc.income += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  // Pie Data - Category Breakdown
  const categoryData = Object.entries(
    filteredData.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Trend Data - Group by Date
  const trendData = filteredData.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
    if (t.type === 'expense') acc[date].expense += t.amount;
    else acc[date].income += t.amount;
    return acc;
  }, {});

  const sortedTrend = Object.values(trendData).sort((a, b) => new Date(a.date) - new Date(b.date));

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Subcategory', 'Type', 'Amount', 'Importance', 'Usefulness'];
    const rows = filteredData.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description || 'N/A',
      t.category,
      t.subcategory || 'N/A',
      t.type,
      t.amount,
      t.matrix?.importance || 'N/A',
      t.matrix?.usefulness || 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SmartExpense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 pt-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-6">
             <Link href="/dashboard" className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 shadow-xl ring-1 ring-white/10 text-slate-400 hover:text-white transition-all hover:bg-white/10">
               <ArrowLeft className="h-6 w-6" />
             </Link>
             <div>
               <h1 className="text-4xl font-black tracking-tight text-white">Quantum Reports</h1>
               <p className="text-[10px] font-black text-slate-500 flex items-center gap-2 mt-2 uppercase tracking-[0.3em]">
                 <FileText className="h-3.5 w-3.5 text-blue-500" /> Historical Statement Analysis
               </p>
             </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-white/5 p-1.5 rounded-2xl shadow-xl ring-1 ring-white/10 flex-1 md:flex-none backdrop-blur-md">
              <button 
                onClick={() => setTimeRange('7')}
                className={`flex-1 md:w-28 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${timeRange === '7' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                7 Cycles
              </button>
              <button 
                onClick={() => setTimeRange('30')}
                className={`flex-1 md:w-28 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${timeRange === '30' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                30 Cycles
              </button>
            </div>
            <button 
               onClick={exportCSV}
               className="flex items-center gap-2 rounded-2xl bg-white text-slate-950 px-8 py-3.5 text-[10px] font-black shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              <Download className="h-4 w-4" /> Export Data
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <ReportStatCard title="Capital Outflow" value={stats.expense} sub={`Net usage for ${timeRange} days`} color="red" icon={TrendingDown} currency={user.currency} />
          <ReportStatCard title="Asset Inflow" value={stats.income} sub="Total liquidity detected" color="green" icon={TrendingUp} currency={user.currency} />
          <ReportStatCard title="Residual Balance" value={stats.income - stats.expense} sub="Immediate liquidity" color="blue" icon={Activity} currency={user.currency} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
           {/* Expense Trend Chart */}
           <div className="glass-card p-10 rounded-[40px]">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-400 shadow-inner">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Spending Velocity</h3>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedTrend}>
                    <defs>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }} 
                      itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" animationDuration={1500} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} fillOpacity={0} animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Pie Chart & Comparison */}
           <div className="space-y-10">
              <div className="glass-card p-10 rounded-[40px]">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="bg-purple-600/20 p-3 rounded-2xl text-purple-400 shadow-inner">
                      <PieIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Category Distribution</h3>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '20px', border: 'none' }} />
                        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Weekly Comparison */}
              <div className="rounded-[40px] bg-gradient-to-br from-slate-900 to-slate-950 p-10 shadow-2xl border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-5 transition-transform duration-1000 group-hover:scale-110">
                   <Zap className="h-40 w-40 text-blue-500" />
                 </div>
                 <div className="relative z-10 flex items-center justify-between mb-10">
                    <div>
                       <h4 className="text-2xl font-black text-white tracking-tight">Efficiency Audit</h4>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-2">Resource Utilization</p>
                    </div>
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/40">
                       <Zap className="h-6 w-6" />
                    </div>
                 </div>
                 <div className="relative z-10 space-y-8">
                    <EfficiencyRow label="Capital Absorption" score={Math.min(100, (stats.income > 0 ? (stats.expense / stats.income) * 100 : 0)).toFixed(1)} />
                    <EfficiencyRow label="Asset Retention" score={stats.income > 0 ? ((stats.income - stats.expense) / stats.income * 100).toFixed(1) : 0} />
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function ReportStatCard({ title, value, sub, color, icon: Icon, currency }) {
  const colorMap = {
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <div className="glass-card p-8 rounded-[32px] flex items-center gap-8 group hover:-translate-y-1 transition-all">
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border shadow-inner ${colorMap[color]}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</h4>
        <p className="text-3xl font-black text-white mt-2 tracking-tight">{currency}{value.toLocaleString()}</p>
        <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

function EfficiencyRow({ label, score }) {
  return (
    <div className="space-y-3">
       <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
          <span className="text-xs font-black text-blue-400">{score}%</span>
       </div>
       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" 
          />
       </div>
    </div>
  );
}
