'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 hidden sm:block tracking-tight">
                Smart Expense
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
              <Link href="/reports" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Reports</Link>
              <Link href="/advisor" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Pre-Spend Advisor</Link>
              <Link href="/profile" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Profile</Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full ring-1 ring-slate-200">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-red-500 transition-colors ring-1 ring-slate-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
          <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
          <Link href="/reports" className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Reports</Link>
          <Link href="/advisor" className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Pre-Spend Advisor</Link>
          <Link href="/profile" className="text-slate-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
          <button
            onClick={logout}
            className="text-red-600 hover:bg-slate-100 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
