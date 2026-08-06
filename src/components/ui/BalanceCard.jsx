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

  let defaultLabel = 'All Settled Up';
  let cardClass = 'bg-slate-500/10 border-slate-500/20';
  let amountTextColor = 'text-slate-700 dark:text-slate-200';
  let labelTextColor = 'text-slate-500 dark:text-slate-400';

  if (isPositive) {
    defaultLabel = 'They Owe You';
    cardClass = 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/15';
    amountTextColor = 'text-emerald-700 dark:text-emerald-300';
    labelTextColor = 'text-emerald-800/80 dark:text-emerald-400/90';
  } else if (isNegative) {
    defaultLabel = 'You Owe Them';
    cardClass = 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-500/15';
    amountTextColor = 'text-rose-700 dark:text-rose-300';
    labelTextColor = 'text-rose-800/80 dark:text-rose-400/90';
  }

  const finalLabel = label || defaultLabel;

  return (
    <GlassCard className={`relative overflow-hidden transition-all ${cardClass}`}>
      <div className={`p-5 flex flex-col ${size === 'lg' ? 'items-center text-center' : 'items-start'}`}>
        <p className={`font-semibold mb-1 tracking-wide ${labelTextColor} ${size === 'lg' ? 'text-sm uppercase' : 'text-xs'}`}>
          {finalLabel}
        </p>
        <div className={`font-black tracking-tight ${amountTextColor} ${size === 'lg' ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
          {currency} {displayAmount}
        </div>
      </div>
    </GlassCard>
  );
}
