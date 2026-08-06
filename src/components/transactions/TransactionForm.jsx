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
    <div className="w-full space-y-4 pt-2">
      {editingTx && (
        <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
          <span>Editing Transaction</span>
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Amount Input with Currency Symbol and Underline Divider (Stitch Style) */}
      <div className="relative border-b border-white/10 light:border-slate-300 pb-3">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">{currency}</span>
        <input
          ref={amountInputRef}
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="0.00"
          className="w-full bg-transparent text-right text-3xl font-extrabold text-white light:text-slate-900 placeholder-slate-600 focus:outline-none pr-2"
        />
      </div>

      {/* Note Pill Input Box (Stitch Style) */}
      <div className="relative flex items-center bg-white/[0.04] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-xl px-3 py-2.5">
        <FileText className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Lunch at Madchef..."
          className="w-full bg-transparent text-xs text-slate-200 light:text-slate-800 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Side by Side Action Buttons (Stitch Style) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => handleSubmit('gave')}
          disabled={!parseFloat(amount)}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 light:bg-rose-50 light:hover:bg-rose-100 border border-rose-500/20 light:border-rose-200 text-rose-400 light:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
        >
          <ArrowUpRight className="w-5 h-5 mb-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="text-xs font-bold">I Gave {currency}</span>
        </button>
        
        <button
          onClick={() => handleSubmit('received')}
          disabled={!parseFloat(amount)}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 light:bg-emerald-50 light:hover:bg-emerald-100 border border-emerald-500/20 light:border-emerald-200 text-emerald-400 light:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
        >
          <ArrowDownLeft className="w-5 h-5 mb-1 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
          <span className="text-xs font-bold">I Received {currency}</span>
        </button>
      </div>
    </div>
  );
}
