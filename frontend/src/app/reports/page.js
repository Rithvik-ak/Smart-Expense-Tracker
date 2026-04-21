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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
             <Link href="/dashboard" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 text-slate-500 hover:text-blue-600 transition-colors">
               <ArrowLeft className="h-5 w-5" />
             </Link>
             <div>
               <h1 className="text-3xl font-black tracking-tight text-slate-900">Financial Reports</h1>
               <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-1 uppercase tracking-widest">
                 <FileText className="h-3 w-3" /> Statement Dashboard
               </p>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white p-1 rounded-2xl shadow-sm ring-1 ring-slate-200 flex-1 md:flex-none">
              <button 
                onClick={() => setTimeRange('7')}
                className={`flex-1 md:w-24 py-2 rounded-xl text-xs font-black transition-all ${timeRange === '7' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeRange('30')}
                className={`flex-1 md:w-24 py-2 rounded-xl text-xs font-black transition-all ${timeRange === '30' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                30 Days
              </button>
            </div>
            <button 
               onClick={exportCSV}
               className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-black text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all uppercase tracking-widest"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <ReportStatCard title="Period Spend" value={stats.expense} sub={`Net usage for ${timeRange} days`} color="red" icon={TrendingDown} currency={user.currency} />
          <ReportStatCard title="Period Income" value={stats.income} sub="Total inflows detected" color="green" icon={TrendingUp} currency={user.currency} />
          <ReportStatCard title="Net Balance" value={stats.income - stats.expense} sub="Available liquidity" color="blue" icon={Activity} currency={user.currency} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
           {/* Expense Trend Chart */}
           <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/10 p-2 rounded-xl text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Spending Velocity</h3>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedTrend}>
                    <defs>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Pie Chart & Comparison */}
           <div className="space-y-8">
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="bg-purple-600/10 p-2 rounded-xl text-purple-600">
                      <PieIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Category Density</h3>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Weekly Comparison */}
              <div className="rounded-3xl bg-slate-900 p-8 shadow-2xl text-white relative overflow-hidden">
                 <div className="relative z-10 flex items-center justify-between mb-6">
                    <div>
                       <h4 className="text-xl font-black">Performance Audit</h4>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Efficiency Ratio</p>
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/40">
                       <Zap className="h-5 w-5" />
                    </div>
                 </div>
                 <div className="relative z-10 space-y-4">
                    <EfficiencyRow label="Resource Allocation" score={Math.min(100, (stats.income > 0 ? (stats.expense / stats.income) * 100 : 0)).toFixed(1)} />
                    <EfficiencyRow label="Saving Capacity" score={stats.income > 0 ? ((stats.income - stats.expense) / stats.income * 100).toFixed(1) : 0} />
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
    red: 'text-red-600 bg-red-50 ring-red-100',
    green: 'text-emerald-600 bg-emerald-50 ring-emerald-100',
    blue: 'text-blue-600 bg-blue-50 ring-blue-100',
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex items-center gap-6 group hover:scale-[1.02] transition-transform">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ring-1 ring-inset ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
        <p className="text-2xl font-black text-slate-900 mt-1">{currency}{value.toLocaleString()}</p>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{sub}</p>
      </div>
    </div>
  );
}

function EfficiencyRow({ label, score }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
          <span className="text-xs font-black text-blue-400">{score}%</span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${score}%` }} />
       </div>
    </div>
  );
}
