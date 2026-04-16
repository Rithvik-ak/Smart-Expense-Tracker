import { useState } from 'react';
import axios from 'axios';
import { Target, AlertTriangle, CheckCircle, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';

const PreSpendAdvisor = () => {
  const [formData, setFormData] = useState({
    amount: '', category: 'Food', subcategory: '', importance: 5, usefulness: 5
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Travel', 'Education', 'Bills', 'Lifestyle', 'Entertainment', 'Health', 'Other'];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/advisor/analyze', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Pre-Spend <span className="text-blue-600">Advisor</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Thinking about making a purchase? Enter the details below to receive an instant economic analysis, revealing hidden costs and opportunity values before you part with your money.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">What are you buying?</h2>
             <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Expected Cost ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-lg">$</span>
                    </div>
                    <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 pr-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-xl font-black transition-colors" placeholder="0.00" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none font-medium transition-colors">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Item Name</label>
                    <input type="text" required value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none font-medium transition-colors" placeholder="e.g. New Shoes" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Priority / Urgency</label>
                    <span className="text-xl font-black text-emerald-600">{formData.importance}<span className="text-sm text-slate-400 font-medium">/10</span></span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">1 = "I can definitely live without this" | 10 = "Absolutely essential"</p>
                  <input type="range" min="1" max="10" value={formData.importance} onChange={e => setFormData({...formData, importance: e.target.value})} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Utility / Value</label>
                    <span className="text-xl font-black text-blue-600">{formData.usefulness}<span className="text-sm text-slate-400 font-medium">/10</span></span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">1 = "Short-term dopamine hit" | 10 = "Daily high-value use"</p>
                  <input type="range" min="1" max="10" value={formData.usefulness} onChange={e => setFormData({...formData, usefulness: e.target.value})} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                
                <button type="submit" disabled={loading} className="w-full mt-6 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:bg-slate-300 disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2 text-lg">
                  {loading ? <span>Analyzing...</span> : <><span>Analyze Purchase</span> <ArrowRight className="w-5 h-5" /></>}
                </button>
             </form>
          </div>

          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
            <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight flex items-center"><TrendingUp className="w-6 h-6 mr-3 text-blue-600" /> Analysis & Insights</h2>
            {result ? (
              <div className="space-y-8 flex-grow flex flex-col z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-2xl border-2 flex items-start space-x-5 shadow-sm
                  ${result.recommendation.action === 'Approved' ? 'bg-green-50 border-green-200' : 
                    result.recommendation.action === 'Avoid' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                    {result.recommendation.action === 'Approved' ? <CheckCircle className="w-8 h-8 text-green-600" /> : 
                     result.recommendation.action === 'Avoid' ? <AlertTriangle className="w-8 h-8 text-red-600" /> : <AlertTriangle className="w-8 h-8 text-yellow-600" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Decision Framework</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${result.recommendation.action === 'Approved' ? 'bg-green-100 text-green-800' : result.recommendation.action === 'Avoid' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{result.quadrant} Quadrant</span>
                    </div>
                    <p className={`text-lg font-bold leading-snug ${result.recommendation.action === 'Approved' ? 'text-green-800' : result.recommendation.action === 'Avoid' ? 'text-red-800' : 'text-yellow-800'}`}>{result.recommendation.text}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">True Yearly Cost</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center">
                      ${result.yearlyCost.toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-2 bg-slate-50 py-1 px-3 rounded-lg inline-block">if repeated monthly</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Budget Impact</p>
                    <p className={`text-3xl font-black tracking-tight ${result.budgetPercentage > 20 ? 'text-red-500' : result.budgetPercentage > 10 ? 'text-yellow-500' : 'text-blue-600'}`}>
                      {result.budgetPercentage}%
                    </p>
                    <p className="text-sm font-medium text-slate-500 mt-2 bg-slate-50 py-1 px-3 rounded-lg inline-block">of monthly budget</p>
                  </div>
                </div>

                {result.tradeOffs.length > 0 && (
                  <div className="flex-grow bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wide">Economic Realities & Trade-offs</h3>
                    <ul className="space-y-3">
                      {result.tradeOffs.map((trade, idx) => (
                        <li key={idx} className="flex items-start text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed font-medium">
                           <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5"><DollarSign className="w-4 h-4" /></div>
                           <span>{trade}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-center h-full min-h-[300px]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <Target className="w-10 h-10 text-slate-300" />
                </div>
                <p className="font-medium text-lg text-slate-500">Run the analysis to reveal economic insights.</p>
                <p className="text-sm max-w-sm mt-2 leading-relaxed">Discover the true yearly cost and opportunity value of your potential purchase.</p>
              </div>
            )}
            
            {/* Background decoration matrix */}
            <div className={`absolute -right-20 -bottom-20 w-80 h-80 transition-all duration-1000 z-0 pointer-events-none opacity-5
              ${result ? (result.recommendation.action === 'Approved' ? 'bg-green-500 text-green-900' : result.recommendation.action === 'Avoid' ? 'bg-red-500 text-red-900' : 'bg-yellow-500 text-yellow-900') : 'bg-slate-400 text-slate-900'} rounded-full blur-3xl`}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PreSpendAdvisor;
