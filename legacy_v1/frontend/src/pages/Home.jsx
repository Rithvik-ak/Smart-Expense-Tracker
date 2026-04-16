import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-grow bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 left-0 -m-32 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
          Make smarter <span className="text-emerald-600">financial decisions</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Smart Expense Decision System isn't just a tracker. It's an economic advisor that analyzes your spending in real-time, helping you prioritize what matters and cut out what doesn't.
        </p>
        <div className="flex justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center">
            Log In
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Pre-Spend Advisor</h3>
            <p className="text-slate-600 leading-relaxed">Analyze potential purchases before making them. See the long-term impact on your budget.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Decision Matrix</h3>
            <p className="text-slate-600 leading-relaxed">Automatically classify your expenses by Importance and Usefulness to identify money sinks.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Pattern Detection</h3>
            <p className="text-slate-600 leading-relaxed">Discover opportunity costs and alternative investments for your non-essential spending.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
