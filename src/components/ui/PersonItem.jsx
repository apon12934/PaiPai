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

  let balanceColor = 'text-slate-400 light:text-slate-500';
  let balancePrefix = '';
  
  if (isPositive) {
    balanceColor = 'text-emerald-400 light:text-emerald-600';
    balancePrefix = '+';
  } else if (isNegative) {
    balanceColor = 'text-rose-400 light:text-rose-600';
    balancePrefix = '-';
  }

  const baseClasses = 'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer border';
  const selectedClasses = 'bg-indigo-600/15 border-indigo-500/30 text-white light:bg-indigo-50 light:border-indigo-200 light:text-indigo-950 font-semibold shadow-sm';
  const defaultClasses = 'bg-transparent border-transparent hover:bg-white/5 light:hover:bg-slate-100 text-slate-300 light:text-slate-700 font-medium';

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
    >
      <div className="truncate pr-4 font-medium">
        {name}
      </div>
      <div className={`whitespace-nowrap text-xs font-semibold ${balanceColor}`}>
        {isZero ? 'Settled' : `${balancePrefix}${currency}${displayBalance}`}
      </div>
    </div>
  );
}
