'use client';

import TransactionForm from '../transactions/TransactionForm';
import { Trash2 } from 'lucide-react';

export default function MainPanel({
  person,
  balance,
  onDelete,
  onSubmitTx,
  editingTx,
  onCancelEdit,
  currency = '৳',
}) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;
  const initial = (person || 'P').charAt(0).toUpperCase();

  const displayBalance = Math.abs(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let defaultLabel = 'ALL SETTLED UP';
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';

  if (isPositive) {
    defaultLabel = 'THEY OWE YOU';
    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30';
  } else if (isNegative) {
    defaultLabel = 'YOU OWE THEM';
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30';
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6 md:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-600/30">
            {initial}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{person}</h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personal Debt & Expense Ledger</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-lg transition-all border border-rose-200 dark:border-rose-500/20 cursor-pointer shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Person</span>
        </button>
      </div>

      {/* Hero Balance Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151624] border border-slate-200 dark:border-indigo-500/20 shadow-lg dark:shadow-xl flex flex-col items-center justify-center text-center space-y-2 animate-fade-in">
        <span className={`text-[10px] font-extrabold tracking-widest px-3.5 py-1 rounded-full border ${badgeStyle}`}>
          {defaultLabel}
        </span>
        <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
          isPositive ? 'text-emerald-600 dark:text-emerald-400' : isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-200'
        }`}>
          {currency} {displayBalance}
        </div>
      </div>

      {/* Transaction Logger Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151624] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-xl animate-fade-in">
        <TransactionForm
          onSubmit={onSubmitTx}
          editingTx={editingTx}
          onCancelEdit={onCancelEdit}
          currency={currency}
        />
      </div>
    </div>
  );
}
