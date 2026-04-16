'use client';

import { useState } from 'react';
import { Calculator, X, RotateCcw, Check } from 'lucide-react';

export default function MiniCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isResult, setIsResult] = useState(false);

  const handleNumber = (n) => {
    if (display === '0' || isResult) {
      setDisplay(n);
      setIsResult(false);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
    setIsResult(false);
  };

  const calculate = () => {
    try {
      const parts = equation.split(' ');
      const val1 = parseFloat(parts[0]);
      const val2 = parseFloat(display);
      let res = 0;

      switch (parts[1]) {
        case '+': res = val1 + val2; break;
        case '-': res = val1 - val2; break;
        case '*': res = val1 * val2; break;
        case '/': res = val2 !== 0 ? val1 / val2 : 'Error'; break;
        default: res = val2;
      }

      const final = Math.round(res * 100) / 100;
      setDisplay(final.toString());
      setEquation('');
      setIsResult(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsResult(false);
  };

  const sendToForm = () => {
    // Custom event to communicate with TransactionForm
    const event = new CustomEvent('setAmount', { detail: display });
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-8 z-[60]">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-xl shadow-slate-900/20 ring-1 ring-slate-700 transition-all hover:scale-110 active:scale-95"
          title="Open Calculator"
        >
          <Calculator className="h-6 w-6" />
        </button>
      )}

      {/* Calculator Popup */}
      {isOpen && (
        <div className="w-64 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calculator</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Display */}
          <div className="mb-4 bg-slate-900/5 rounded-xl p-3 text-right">
            <div className="text-[10px] text-slate-400 h-4 font-mono">{equation}</div>
            <div className="text-2xl font-black text-slate-900 truncate font-mono tracking-tighter">{display}</div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '/'].map(btn => (
              <CalcBtn key={btn} val={btn} onClick={btn === '/' ? () => handleOperator('/') : () => handleNumber(btn)} />
            ))}
            {['4', '5', '6', '*'].map(btn => (
              <CalcBtn key={btn} val={btn} onClick={btn === '*' ? () => handleOperator('*') : () => handleNumber(btn)} />
            ))}
            {['1', '2', '3', '-'].map(btn => (
              <CalcBtn key={btn} val={btn} onClick={btn === '-' ? () => handleOperator('-') : () => handleNumber(btn)} />
            ))}
            <CalcBtn val="0" onClick={() => handleNumber('0')} />
            <CalcBtn val="." onClick={() => handleNumber('.')} />
            <CalcBtn val="C" onClick={clear} highlighted />
            <CalcBtn val="+" onClick={() => handleOperator('+')} />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={calculate}
              className="flex items-center justify-center rounded-xl bg-slate-900 py-3 text-white transition-all hover:bg-slate-800 font-bold text-sm shadow-lg shadow-slate-900/10"
            >
              =
            </button>
            <button
              disabled={display === '0' || display === 'Error'}
              onClick={sendToForm}
              className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-white transition-all hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-500/10 disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-1 stroke-[3px]" /> Use
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalcBtn({ val, onClick, highlighted = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 items-center justify-center rounded-lg text-sm font-black transition-all active:scale-90 ${
        highlighted 
        ? 'bg-red-50 text-red-500 border border-red-100' 
        : 'bg-white text-slate-900 border border-slate-100 hover:bg-slate-50'
      }`}
    >
      {val}
    </button>
  );
}
