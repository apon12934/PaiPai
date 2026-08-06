'use client';

import React from 'react';

export default function PersonItem({ name, balance = 0, isSelected, onClick, currency = '৳' }) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;
  const isZero = balance === 0;

  const displayBalance = Math.abs(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let balanceColor = 'text-slate-500 dark:text-slate-400';
  let balancePrefix = '';
  
  if (isPositive) {
    balanceColor = isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400';
    balancePrefix = '+';
  } else if (isNegative) {
    balanceColor = isSelected ? 'text-rose-200' : 'text-rose-600 dark:text-rose-400';
    balancePrefix = '-';
  } else if (isSelected) {
    balanceColor = 'text-indigo-200';
  }

  const baseClasses = 'w-full flex items-center justify-between rounded-xl p-3 text-sm transition-all duration-200 cursor-pointer';
  const selectedClasses = 'bg-indigo-600 border border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20';
  const defaultClasses = 'bg-transparent border border-transparent hover:bg-slate-200/70 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-medium';

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
    >
      <div className="truncate pr-4 font-semibold">
        {name}
      </div>
      <div className={`whitespace-nowrap font-extrabold ${balanceColor}`}>
        {isZero ? 'Settled' : `${balancePrefix}${currency}${displayBalance}`}
      </div>
    </div>
  );
}
