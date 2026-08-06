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
  let badgeStyle = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  if (isPositive) {
    defaultLabel = 'THEY OWE YOU';
    badgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200';
  } else if (isNegative) {
    defaultLabel = 'YOU OWE THEM';
    badgeStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30 light:bg-rose-50 light:text-rose-700 light:border-rose-200';
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6 md:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-600/30">
            {initial}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100 light:text-slate-900 tracking-tight">{person}</h2>
            <span className="text-xs text-slate-400">Personal Debt & Expense Ledger</span>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 light:bg-rose-50 light:text-rose-700 text-xs font-bold rounded-xl transition-all border border-rose-500/20 light:border-rose-200 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Person</span>
        </button>
      </div>

      {/* Hero Balance Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 via-[#151624] to-[#151624] light:from-indigo-50/50 light:to-white border border-indigo-500/20 light:border-slate-200 shadow-xl flex flex-col items-center justify-center text-center space-y-2 animate-fade-in">
        <span className={`text-[10px] font-extrabold tracking-widest px-3.5 py-1 rounded-full border ${badgeStyle}`}>
          {defaultLabel}
        </span>
        <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
          isPositive ? 'text-emerald-400 light:text-emerald-600' : isNegative ? 'text-rose-400 light:text-rose-600' : 'text-slate-200 light:text-slate-800'
        }`}>
          {currency} {displayBalance}
        </div>
      </div>

      {/* Transaction Logger Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151624] light:bg-white border border-white/10 light:border-slate-200 shadow-xl animate-fade-in">
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
