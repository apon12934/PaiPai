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
    badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200';
  } else if (isNegative) {
    defaultLabel = 'YOU OWE THEM';
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-50 light:text-rose-700 light:border-rose-200';
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent flex flex-col">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            {initial}
          </div>
          <h2 className="text-xl font-bold text-slate-100 light:text-slate-900 tracking-tight">{person}</h2>
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 light:bg-rose-50 light:hover:bg-rose-100 text-rose-400 light:text-rose-700 text-xs font-semibold rounded-xl transition-all border border-rose-500/20 light:border-rose-200 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Person</span>
        </button>
      </div>

      {/* Center Combined Workspace Card (Stitch Mockup) */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-pop-in">
          {/* Top Status Pill Badge */}
          <div className="flex justify-center">
            <span className={`text-[10px] font-extrabold tracking-widest px-3.5 py-1 rounded-full border ${badgeStyle}`}>
              {defaultLabel}
            </span>
          </div>

          {/* Giant Amount Display */}
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white light:text-slate-900 font-mono">
              {currency} {displayBalance}
            </div>
          </div>

          {/* Transaction Form Container */}
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
