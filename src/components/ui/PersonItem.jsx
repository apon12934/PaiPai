'use client';
import React from 'react';

export default function PersonItem({ name, balance = 0, isSelected, onClick }) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;
  const isZero = balance === 0;

  const displayBalance = Math.abs(balance).toLocaleString();

  let balanceColor = 'text-slate-500';
  let balancePrefix = '';
  
  if (isPositive) {
    balanceColor = 'text-emerald-400';
    balancePrefix = '+';
  } else if (isNegative) {
    balanceColor = 'text-rose-400';
    balancePrefix = '-';
  }

  const baseClasses = 'w-full flex items-center justify-between rounded-xl p-3 text-sm transition-all duration-200 cursor-pointer';
  const selectedClasses = 'bg-indigo-600/20 border border-indigo-500/30 text-white';
  const defaultClasses = 'bg-transparent border border-transparent hover:bg-white/5 text-slate-300';

  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
    >
      <div className="truncate pr-4 font-medium">
        {name}
      </div>
      <div className={`whitespace-nowrap font-semibold ${balanceColor}`}>
        {isZero ? 'Settled' : `${balancePrefix}৳${displayBalance}`}
      </div>
    </div>
  );
}
