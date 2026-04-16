import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PlusCircle, Trash2 } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense', amount: '', category: 'Food', subcategory: '', description: '', importance: 5, usefulness: 5
  });

  const categories = ['Food', 'Travel', 'Education', 'Bills', 'Lifestyle', 'Entertainment', 'Health', 'Other'];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const conf = { headers: { Authorization: `Bearer ${token}` } };
      const [txRes, bRes] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions', conf),
        axios.get('http://localhost:5000/api/budgets', conf)
      ]);
      setTransactions(txRes.data);
      setBudget(bRes.data.monthlyAmount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setFormData({ type: 'expense', amount: '', category: 'Food', subcategory: '', description: '', importance: 5, usefulness: 5 });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/budgets', { monthlyAmount: budget }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Budget updated!');
    } catch (error) {
      console.error(error);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryData = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) existing.value += t.amount;
    else acc.push({ name: t.category, value: t.amount });
    return acc;
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

  return (
    <div className="flex-grow bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Income</p>
            <p className="text-3xl font-black text-slate-900">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Expenses</p>
            <p className="text-3xl font-black text-slate-900">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Remaining Balance</p>
            <p className={`text-3xl font-black ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
            <form onSubmit={handleUpdateBudget} className="flex flex-col h-full justify-between">
               <div>
                 <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Monthly Budget</p>
                 <div className="flex space-x-2">
                   <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                   <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-xl text-sm font-bold transition-colors">Set</button>
                 </div>
               </div>
               <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                     <div className={`h-2 rounded-full ${totalExpense > budget ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((totalExpense / (budget || 1)) * 100, 100)}%` }}></div>
                  </div>
                 <p className="text-xs font-semibold text-slate-500 text-right">{budget > 0 ? ((totalExpense / budget) * 100).toFixed(1) : 0}% Used</p>
               </div>
            </form>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Transactions</h2>
              <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-100 font-bold transition-colors">
                <PlusCircle className="w-5 h-5" />
                <span>Add Record</span>
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddTransaction} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 shadow-inner">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount</label>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description/Details</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm" placeholder="What was it for?" />
                  </div>
                  {formData.type === 'expense' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                          <span>Importance</span> <span className="text-emerald-600">{formData.importance}</span>
                        </label>
                        <input type="range" min="1" max="10" required value={formData.importance} onChange={e => setFormData({...formData, importance: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                          <span>Usefulness</span> <span className="text-blue-600">{formData.usefulness}</span>
                        </label>
                        <input type="range" min="1" max="10" required value={formData.usefulness} onChange={e => setFormData({...formData, usefulness: e.target.value})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2 flex justify-end mt-2">
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">Save Transaction</button>
                  </div>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Date</th>
                    <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Details</th>
                    <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Category</th>
                    <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">Class</th>
                    <th className="py-3 px-2 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Amount</th>
                    <th className="py-3 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2 text-slate-500 font-medium">{new Date(t.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</td>
                      <td className="py-4 px-2 text-slate-900 font-medium">{t.description || t.category}</td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{t.category}</span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        {t.type === 'expense' ? (
                          <span className={`inline-flex items-center w-8 h-8 justify-center rounded-full text-xs font-black
                            ${t.quadrant === 'Q1' ? 'bg-green-100 text-green-700' : 
                              t.quadrant === 'Q4' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {t.quadrant}
                          </span>
                        ) : (
                           <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className={`py-4 px-2 text-right font-black text-base ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button onClick={() => handleDelete(t._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Delete">
                          <Trash2 className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan="6" className="py-12 text-center text-slate-500 font-medium">No transactions found. It's quiet here.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">Spending Breakdown</h2>
             {categoryData.length > 0 ? (
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={categoryData} cx="50%" cy="50%" innerRadius={75} outerRadius={100} paddingAngle={6} dataKey="value" cornerRadius={6} stroke="none">
                       {categoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} />
                     <Legend iconType="circle" wrapperStyle={{fontSize: '13px', fontWeight: '500'}} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <PieChart className="w-12 h-12 mb-2 text-slate-300" />
                 <span className="font-medium text-sm">Add expenses to see visualization</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
