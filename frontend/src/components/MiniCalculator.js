'use client';

import { useState } from 'react';
import { Calculator, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (parts.length < 2) return;
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
    const event = new CustomEvent('setAmount', { detail: display });
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-32 right-10 z-[60]">
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-2xl hover:bg-white/10 transition-colors"
          title="Neural Calculator"
        >
          <Calculator className="h-6 w-6" />
        </motion.button>
      )}

      {/* Calculator Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-72 rounded-[32px] glass-card p-6 border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Link</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Display */}
            <div className="mb-6 bg-white/[0.03] rounded-2xl p-5 text-right border border-white/5">
              <div className="text-[10px] text-slate-600 h-4 font-black uppercase tracking-widest">{equation}</div>
              <div className="text-3xl font-black text-white truncate tracking-tighter leading-none mt-1">{display}</div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-3">
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

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={calculate}
                className="flex items-center justify-center rounded-xl bg-white text-slate-950 py-3 transition-all hover:bg-slate-200 font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Execute
              </button>
              <button
                disabled={display === '0' || display === 'Error'}
                onClick={sendToForm}
                className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-white transition-all hover:bg-blue-500 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                <Check className="h-4 w-4 mr-1 stroke-[3px]" /> Sync
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CalcBtn({ val, onClick, highlighted = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex h-12 items-center justify-center rounded-xl text-[11px] font-black transition-all ${
        highlighted 
        ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
        : 'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10 hover:text-white'
      }`}
    >
      {val}
    </motion.button>
  );
}

