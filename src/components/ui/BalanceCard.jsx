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
  let gradientClass = 'bg-gradient-to-br from-slate-700/50 to-slate-800/50';
  let glowClass = 'shadow-[0_0_15px_rgba(100,116,139,0.1)]';
  let textGradient = 'from-slate-200 to-slate-400';

  if (isPositive) {
    defaultLabel = 'They Owe You';
    gradientClass = 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10';
    glowClass = 'shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    textGradient = 'from-emerald-300 to-teal-100';
  } else if (isNegative) {
    defaultLabel = 'You Owe Them';
    gradientClass = 'bg-gradient-to-br from-rose-500/20 to-red-500/10';
    glowClass = 'shadow-[0_0_20px_rgba(244,63,94,0.15)]';
    textGradient = 'from-rose-300 to-red-100';
  }

  const finalLabel = label || defaultLabel;

  return (
    <GlassCard className={`relative overflow-hidden ${gradientClass} ${glowClass}`}>
      <div className={`p-5 flex flex-col ${size === 'lg' ? 'items-center text-center' : 'items-start'}`}>
        <p className={`text-slate-400 font-medium mb-1 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {finalLabel}
        </p>
        <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${textGradient} ${size === 'lg' ? 'text-4xl' : 'text-xl'}`}>
          {currency} {displayAmount}
        </div>
      </div>
    </GlassCard>
  );
}
