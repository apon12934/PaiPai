'use client';

import TransactionCard from '../transactions/TransactionCard';

export default function HistoryPanel({ transactions, onEdit, onDelete, editingTxId, currency = '৳', sortOrder = 'newest' }) {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="w-full h-full bg-white/[0.02] border-l border-white/5 flex flex-col backdrop-blur-xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 light:text-slate-800">History</h2>
        <span className="text-[10px] text-slate-400 bg-white/5 light:bg-slate-100 px-2 py-0.5 rounded-md font-mono">
          {transactions.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTransactions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8 italic font-normal">No history recorded yet.</p>
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
