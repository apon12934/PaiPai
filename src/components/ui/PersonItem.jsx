'use client';

import React from 'react';

export default function PersonItem({ name, balance = 0, isSelected, onClick, currency = '৳' }) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;
  const isZero = balance === 0;

  const displayBalance = Math.abs(balance).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const initial = (name || 'P').charAt(0).toUpperCase();

  let balanceColor = 'text-slate-500 light:text-slate-400';
  let balancePrefix = '';

  if (isPositive) {
    balanceColor = 'text-emerald-400 light:text-emerald-600 font-bold';
    balancePrefix = '+';
  } else if (isNegative) {
    balanceColor = 'text-rose-400 light:text-rose-600 font-bold';
    balancePrefix = '-';
  }

  // Selected item classes with left indigo indicator stripe
  const baseClasses = 'w-full relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer overflow-hidden';
  const selectedClasses = 'bg-[#1D1C33] light:bg-[#E0E8FF] text-white light:text-indigo-950 font-semibold shadow-sm border border-indigo-500/30 light:border-indigo-200';
  const defaultClasses = 'bg-transparent hover:bg-white/[0.04] light:hover:bg-slate-100 text-slate-300 light:text-slate-700 font-medium';

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
    >
      {/* Left Indicator Pill for Selected Contact */}
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-md shadow-indigo-500/50" />
      )}

      <div className="flex items-center gap-3 truncate pr-2">
        {/* Contact Initial Circle Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
          isSelected 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
            : 'bg-white/10 light:bg-slate-200 text-slate-300 light:text-slate-700'
        }`}>
          {initial}
        </div>
        <span className="truncate font-semibold">{name}</span>
      </div>

      <div className={`whitespace-nowrap text-xs font-mono tracking-tight ${balanceColor}`}>
        {isZero ? 'Settled' : `${balancePrefix}${currency} ${displayBalance}`}
      </div>
    </div>
  );
}
