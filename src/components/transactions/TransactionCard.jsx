'use client';

import GlassCard from '../ui/GlassCard';
import { Pencil, Trash2 } from 'lucide-react';

export default function TransactionCard({ transaction, onEdit, onDelete, isEditing, currency = '৳' }) {
  const isGave = transaction.type === 'gave';
  
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <GlassCard 
      variant="subtle" 
      className={`p-3.5 group relative overflow-hidden transition-all duration-150 ${
        isEditing ? 'border-indigo-500/50 bg-indigo-500/[0.06]' : 'hover:border-white/15 light:hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
          isGave 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-50 light:text-rose-700 light:border-rose-200' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200'
        }`}>
          {isGave ? 'You gave them' : 'They paid you'}
        </span>
        <span className="text-[10px] text-slate-400 light:text-slate-500">{formattedDate}</span>
      </div>

      <div className="my-1">
        <span className={`text-xl font-bold tracking-tight ${
          isGave ? 'text-rose-400 light:text-rose-600' : 'text-emerald-400 light:text-emerald-600'
        }`}>
          {isGave ? '-' : '+'}{currency}{transaction.amount.toFixed(2)}
        </span>
      </div>

      {transaction.note && (
        <div className="mt-2 text-xs text-slate-300 light:text-slate-700 bg-white/5 light:bg-slate-100 border border-white/5 light:border-slate-200 p-2 rounded-lg">
          {transaction.note}
        </div>
      )}

      {/* Hover action menu */}
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
