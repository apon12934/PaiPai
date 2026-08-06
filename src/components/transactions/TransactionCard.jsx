'use client';

import GlassCard from '../ui/GlassCard';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionCard({ transaction, onEdit, onDelete, isEditing, currency = '৳' }) {
  const isGave = transaction.type === 'gave';
  
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <GlassCard 
      variant="subtle" 
      className={`p-3.5 group relative overflow-hidden transition-all duration-150 rounded-2xl ${
        isGave ? 'history-card-gave' : 'history-card-received'
      } ${
        isEditing ? 'border-indigo-500 bg-indigo-500/10' : 'hover:border-white/15 light:hover:border-slate-300'
      }`}
    >
      {/* Top Row: Type Pill + Date */}
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[10px] font-extrabold tracking-wider uppercase ${
          isGave ? 'text-rose-400 light:text-rose-600' : 'text-emerald-400 light:text-emerald-600'
        }`}>
          {isGave ? 'YOU GAVE THEM' : 'THEY PAID YOU'}
        </span>
        <span className="text-[10px] text-slate-400 light:text-slate-500 font-semibold">{formattedDate}</span>
      </div>

      {/* Bottom Row: Note Title + Large Amount */}
      <div className="flex justify-between items-end gap-2 mt-1">
        <span className="text-xs text-slate-200 light:text-slate-800 font-semibold truncate max-w-[140px]">
          {transaction.note || (isGave ? 'Expense Logged' : 'Payment Received')}
        </span>
        <span className={`text-lg font-extrabold font-mono tracking-tight shrink-0 ${
          isGave ? 'text-rose-400 light:text-rose-600' : 'text-emerald-400 light:text-emerald-600'
        }`}>
          {isGave ? '-' : '+'}{currency} {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Hover Action Menu */}
      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 light:bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-white/10 light:border-slate-200 shadow-md">
        <button
          onClick={onEdit}
          className="p-1 text-slate-400 hover:text-indigo-400 light:hover:text-indigo-600 hover:bg-white/10 rounded transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-slate-400 hover:text-rose-400 light:hover:text-rose-600 hover:bg-white/10 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassCard>
  );
}
