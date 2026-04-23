'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { BarChart3, LogOut, User, Menu, X, Zap, PieChart, Activity, UserCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white hidden sm:block tracking-tighter">
                SmartExpense
              </span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <NavLink href="/dashboard" label="Dashboard" icon={Activity} />
              <NavLink href="/reports" label="Analytics" icon={PieChart} />
              <NavLink href="/advisor" label="Advisor" icon={Zap} />
              <NavLink href="/chat" label="AI Chat" icon={MessageSquare} />
              <NavLink href="/profile" label="Profile" icon={UserCircle} />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-4 flex items-center md:ml-6 gap-6">
              <div className="flex items-center gap-3 text-xs font-black text-slate-400 bg-white/5 px-4 py-2 rounded-xl ring-1 ring-white/10 uppercase tracking-widest">
                <User className="h-4 w-4 text-blue-400" />
                <span>{user?.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-xl bg-white/5 p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all ring-1 ring-white/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all ring-1 ring-white/10"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-white/5 px-4 pt-2 pb-6 space-y-2">
          <MobileNavLink href="/dashboard" label="Dashboard" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/reports" label="Analytics" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/advisor" label="Advisor" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/chat" label="AI Chat" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/profile" label="Profile" onClick={() => setIsOpen(false)} />
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-400 hover:bg-red-400/10 w-full px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label, icon: Icon }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-slate-300 hover:text-white block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all"
    >
      {label}
    </Link>
  );
}
