import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, BarChart3, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-emerald-600">
              <Wallet className="h-8 w-8" />
              <span className="text-xl font-bold text-slate-800 tracking-tight">Smart<span className="text-emerald-600">Expense</span></span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-emerald-600 flex items-center space-x-1 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/advisor" className="text-slate-600 hover:text-emerald-600 flex items-center space-x-1 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Ask Advisor</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 pl-4 border-l border-slate-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Log in</Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
