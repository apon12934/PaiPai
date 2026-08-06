'use client';

import { useState, useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import { ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

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
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-200 light:text-slate-800">
          {editingTx ? 'Edit Transaction' : 'Log Transaction'}
        </h3>
        {editingTx && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-900 transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 light:border-slate-200"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400 font-bold">{currency}</span>
            <input
              ref={amountInputRef}
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-3xl font-bold text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note (optional)"
            className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-200 light:text-slate-800 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleSubmit('gave')}
            disabled={!parseFloat(amount)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 light:bg-rose-50 light:hover:bg-rose-100 light:text-rose-700 light:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-base mb-0.5">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span>I Gave {currency}</span>
            </div>
            <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">Press Enter</span>
          </button>
          
          <button
            onClick={() => handleSubmit('received')}
            disabled={!parseFloat(amount)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 light:bg-emerald-50 light:hover:bg-emerald-100 light:text-emerald-700 light:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold text-base mb-0.5">
              <ArrowDownLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              <span>I Received {currency}</span>
            </div>
            <span className="text-[10px] text-slate-400 light:text-slate-500 font-mono">Shift + Enter</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
