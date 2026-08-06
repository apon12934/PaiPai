'use client';

import React from 'react';
import GlassCard from './GlassCard';

export default function BalanceCard({ amount = 0, label, size = 'sm', currency = '৳' }) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  const displayAmount = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let defaultLabel = 'ALL SETTLED UP';
  let badgeStyle = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let amountStyle = 'text-slate-200 dark:text-slate-200 light:text-slate-800';
  let cardBg = 'bg-slate-500/5 border-slate-500/15';

  if (isPositive) {
    defaultLabel = 'THEY OWE YOU';
    badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200';
    amountStyle = 'text-emerald-400 light:text-emerald-600';
    cardBg = 'bg-emerald-500/[0.04] border-emerald-500/20 light:bg-emerald-50/50 light:border-emerald-100';
  } else if (isNegative) {
    defaultLabel = 'YOU OWE THEM';
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-50 light:text-rose-700 light:border-rose-200';
    amountStyle = 'text-rose-400 light:text-rose-600';
    cardBg = 'bg-rose-500/[0.04] border-rose-500/20 light:bg-rose-50/50 light:border-rose-100';
  }

  const finalLabel = label || defaultLabel;

  return (
    <GlassCard className={`relative overflow-hidden transition-all border ${cardBg}`}>
      <div className={`p-6 flex flex-col ${size === 'lg' ? 'items-center text-center' : 'items-start'}`}>
        <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full border mb-2 ${badgeStyle}`}>
          {finalLabel}
        </span>
        <div className={`font-bold tracking-tight ${amountStyle} ${size === 'lg' ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
          {currency} {displayAmount}
        </div>
      </div>
    </GlassCard>
  );
}
