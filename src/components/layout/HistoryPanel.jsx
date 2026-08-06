'use client';

import TransactionCard from '../transactions/TransactionCard';

export default function HistoryPanel({ transactions, onEdit, onDelete, editingTxId, currency = '৳', sortOrder = 'newest' }) {
  const sortedTransactions = [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="w-full h-full glass-history flex flex-col">
      <div className="p-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100 light:text-slate-900 tracking-tight">Transaction History</h2>
        <span className="text-[10px] text-slate-400 bg-white/5 light:bg-slate-100 px-2 py-0.5 rounded-full font-mono">
          {transactions.length} items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTransactions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8 italic">No transaction history recorded yet.</p>
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
