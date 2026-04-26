'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Zap, LayoutDashboard, User, LogOut, Settings, BarChart3, Clock, MessageSquare, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-[#030712]/50 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/20 flex items-center justify-center"
              >
                <Zap className="h-6 w-6 text-white fill-white" />
              </motion.div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Astra</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavLink href="/reports" icon={BarChart3} label="Reports" />
              <NavLink href="/advisor" icon={Settings} label="Advisor" />
              <NavLink href="/chat" icon={MessageSquare} label="Astra" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Node Active</p>
                </div>
                <Link href="/profile" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <User className="h-5 w-5 text-slate-400" />
                </Link>
                <button
                  onClick={logout}
                  className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest px-4">Initialize</Link>
                <Link href="/signup" className="rounded-xl bg-white px-6 py-2.5 text-[10px] font-black text-slate-950 uppercase tracking-widest hover:scale-105 transition-transform">Access</Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-400"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-t border-white/5 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsOpen(false)} />
              <NavLink href="/reports" icon={BarChart3} label="Reports" onClick={() => setIsOpen(false)} />
              <NavLink href="/advisor" icon={Settings} label="Advisor" onClick={() => setIsOpen(false)} />
              <NavLink href="/chat" icon={MessageSquare} label="Astra" onClick={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, icon: Icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] group"
    >
      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
      {label}
    </Link>
  );
}

