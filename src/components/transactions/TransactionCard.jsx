'use client';

import GlassCard from '../ui/GlassCard';

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
      className={`p-3 group relative overflow-hidden transition-all duration-200 ${
        isEditing ? 'border-indigo-500/50 bg-indigo-500/10' : 'hover:border-slate-300 dark:hover:border-white/15'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
          isGave 
            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' 
            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        }`}>
          {isGave ? 'You gave them' : 'They paid you'}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{formattedDate}</span>
      </div>

      <div className="mt-2 mb-1">
        <span className={`text-2xl font-black tracking-tight ${isGave ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {isGave ? '-' : '+'}{currency}{transaction.amount.toFixed(2)}
        </span>
      </div>

      {transaction.note && (
        <div className="mt-2 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 p-2 rounded-lg">
          {transaction.note}
        </div>
      )}

      {/* Actions overlay */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-sm p-1 rounded-lg border border-slate-300 dark:border-white/10 shadow-md">
        <button
          onClick={onEdit}
          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-md transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </GlassCard>
  );
}
