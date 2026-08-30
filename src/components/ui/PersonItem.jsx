'use client';

import React from 'react';

export default function PersonItem({ name, balance = 0, isSelected, onClick, currency = '৳' }) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;
  const isZero = balance === 0;

  const displayBalance = Math.abs(balance).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const initial = (name || 'P').charAt(0).toUpperCase();

  let balanceColor = 'text-slate-500 dark:text-slate-400';
  let balancePrefix = '';

  if (isPositive) {
    balanceColor = isSelected ? 'text-white dark:text-slate-900' : 'text-emerald-600 dark:text-emerald-400 font-bold';
    balancePrefix = '+';
  } else if (isNegative) {
    balanceColor = isSelected ? 'text-white dark:text-slate-900' : 'text-rose-600 dark:text-rose-400 font-bold';
    balancePrefix = '-';
  } else if (isSelected) {
    balanceColor = 'text-white dark:text-slate-900';
  }

  // Selected item classes: Solid Indigo background with pure white text in both light and dark mode!
  const baseClasses = 'w-full relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer overflow-hidden';
  const selectedClasses = 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-md shadow-black/20 dark:shadow-white/20';
  const defaultClasses = 'bg-transparent hover:bg-slate-200/60 dark:hover:bg-white/[0.04] text-slate-900 dark:text-slate-200 font-medium';

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
    >
      <div className="flex items-center gap-3 truncate pr-2">
        {/* Contact Initial Circle Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
          isSelected 
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' 
            : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
        }`}>
          {initial}
        </div>
        <span className={`truncate font-bold ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-slate-100'}`}>{name}</span>
      </div>

      <div className={`whitespace-nowrap text-xs font-mono tracking-tight ${balanceColor}`}>
        {isZero ? 'Settled' : `${balancePrefix}${currency} ${displayBalance}`}
      </div>
    </div>
  );
}
