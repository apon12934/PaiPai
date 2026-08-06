'use client';

import BalanceCard from '../ui/BalanceCard';
import TransactionForm from '../transactions/TransactionForm';

export default function MainPanel({
  person,
  balance,
  onDelete,
  onSubmitTx,
  editingTx,
  onCancelEdit,
  currency = '৳',
}) {
  return (
    <div className="h-full overflow-y-auto bg-transparent">
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{person}</h2>
          <button
            onClick={onDelete}
            className="px-3.5 py-1.5 bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl hover:bg-rose-500/25 transition-all duration-200 border border-rose-500/30 shadow-sm"
          >
            Delete Person
          </button>
        </div>

        {/* Balance */}
        <div className="animate-slide-up">
          <BalanceCard amount={balance} size="lg" currency={currency} />
        </div>

        {/* Transaction Form */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <TransactionForm
            onSubmit={onSubmitTx}
            editingTx={editingTx}
            onCancelEdit={onCancelEdit}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
}
