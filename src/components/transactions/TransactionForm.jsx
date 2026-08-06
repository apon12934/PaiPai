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
        <h3 className="text-lg font-medium text-slate-200">
          {editingTx ? 'Edit Transaction' : 'Log Transaction'}
        </h3>
        {editingTx && (
          <button
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5"
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
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-3xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
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
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleSubmit('gave')}
            disabled={!parseFloat(amount)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 disabled:opacity-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-1.5 font-semibold text-lg mb-0.5">
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span>I Gave {currency}</span>
            </div>
            <span className="text-[10px] opacity-70 font-mono">Press Enter</span>
          </button>
          
          <button
            onClick={() => handleSubmit('received')}
            disabled={!parseFloat(amount)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 disabled:opacity-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-1.5 font-semibold text-lg mb-0.5">
              <ArrowDownLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
              <span>I Received {currency}</span>
            </div>
            <span className="text-[10px] opacity-70 font-mono">Shift + Enter</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
