'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, X, FileText } from 'lucide-react';

export default function TransactionForm({ onSubmit, editingTx = null, onCancelEdit, currency = '৳' }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const amountInputRef = useRef(null);

  useEffect(() => {
    if (editingTx) {
      setAmount(editingTx.amount.toString());
      setNote(editingTx.note || '');
    } else {
      setAmount('');
      setNote('');
    }
    amountInputRef.current?.focus();
  }, [editingTx]);

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  const handleSubmit = (type) => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    
    onSubmit(type, numAmount, note.trim());
    
    if (!editingTx) {
      setAmount('');
      setNote('');
      amountInputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handleSubmit('received');
      } else {
        handleSubmit('gave');
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">
          {editingTx ? 'Edit Transaction' : 'LOG TRANSACTION'}
        </h3>
        {editingTx && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      {/* Clean Amount Input (No Spinners) */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currency}</span>
        <input
          ref={amountInputRef}
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="0.00"
          className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-3xl font-extrabold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none focus:outline-none"
        />
      </div>

      {/* Clean Note Input Box */}
      <div className="relative">
        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note (e.g. Dinner, Rent, Tuition)..."
          className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none focus:outline-none"
        />
      </div>

      {/* Side by Side Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <button
          onClick={() => handleSubmit('gave')}
          disabled={!parseFloat(amount)}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-base font-extrabold mb-0.5">
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span>I Gave {currency}</span>
          </div>
          <span className="text-[10px] text-rose-100 font-mono font-medium">Press Enter</span>
        </button>
        
        <button
          onClick={() => handleSubmit('received')}
          disabled={!parseFloat(amount)}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-base font-extrabold mb-0.5">
            <ArrowDownLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
            <span>I Received {currency}</span>
          </div>
          <span className="text-[10px] text-emerald-100 font-mono font-medium">Shift + Enter</span>
        </button>
      </div>
    </div>
  );
}
