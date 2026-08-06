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
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-100 light:text-slate-900 tracking-tight">{person}</h2>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 light:bg-rose-50 light:text-rose-700 text-xs font-medium rounded-xl transition-all border border-rose-500/20 light:border-rose-200"
          >
            Delete Person
          </button>
        </div>

        {/* Balance Card */}
        <div className="animate-fade-in">
          <BalanceCard amount={balance} size="lg" currency={currency} />
        </div>

        {/* Transaction Form */}
        <div className="animate-fade-in">
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
