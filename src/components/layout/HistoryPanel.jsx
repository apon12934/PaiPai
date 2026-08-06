'use client';

import TransactionCard from '../transactions/TransactionCard';

export default function HistoryPanel({ transactions, onEdit, onDelete, editingTxId, currency = '৳', sortOrder = 'newest' }) {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="w-full h-full bg-slate-50/50 dark:bg-white/[0.02] border-l border-slate-200 dark:border-white/5 flex flex-col backdrop-blur-xl">
      <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 tracking-tight">History Feed</h2>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-white/5 px-2 py-0.5 rounded-full font-mono">
          {transactions.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTransactions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8 italic font-medium">No history recorded yet.</p>
        ) : (
          sortedTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onEdit={() => onEdit(tx.id)}
              onDelete={() => onDelete(tx.id)}
              isEditing={editingTxId === tx.id}
              currency={currency}
            />
          ))
        )}
      </div>
    </div>
  );
}
