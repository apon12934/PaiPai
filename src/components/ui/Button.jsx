'use client';
import React from 'react';

const variants = {
  primary: 'bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-400',
  glass: 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300',
  gave: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20',
  received: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
};

export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const baseClasses = 'rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2';
  const variantClass = variants[variant] || variants.primary;

  return (
    <button className={`${baseClasses} ${variantClass} ${className}`} {...rest}>
      {variant === 'gave' && <span>↑</span>}
      {variant === 'received' && <span>↓</span>}
      {children}
    </button>
  );
}
