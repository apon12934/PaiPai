'use client';

import BalanceCard from '../ui/BalanceCard';
import TransactionForm from '../transactions/TransactionForm';

export default function MainPanel({ person, balance, onDelete, onSubmitTx, editingTx, onCancelEdit }) {
  return (
    <div className="h-full overflow-y-auto bg-transparent">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <h2 className="text-2xl font-bold text-white">{person}</h2>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-xs font-medium rounded-lg hover:bg-rose-500/20 transition-all duration-200 border border-rose-500/20"
          >
            Delete Person
          </button>
        </div>

        {/* Balance */}
        <div className="animate-slide-up">
          <BalanceCard amount={balance} size="lg" />
        </div>

        {/* Transaction Form */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <TransactionForm
            onSubmit={onSubmitTx}
            editingTx={editingTx}
            onCancelEdit={onCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}
