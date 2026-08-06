'use client';

import TransactionCard from '../transactions/TransactionCard';

export default function HistoryPanel({ transactions, onEdit, onDelete, editingTxId }) {
  return (
    <div className="w-full sm:w-[280px] sm:min-w-[280px] h-full bg-white/[0.02] border-l border-white/5 flex flex-col backdrop-blur-xl">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-slate-300">History</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No history yet.</p>
        ) : (
          transactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onEdit={() => onEdit(tx)}
              onDelete={() => onDelete(tx.id)}
              isEditing={editingTxId === tx.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
