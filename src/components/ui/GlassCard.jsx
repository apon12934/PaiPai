'use client';
import React from 'react';

const variants = {
  default: 'bg-white dark:bg-[#151624] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-lg',
  subtle: 'bg-slate-50 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-lg',
  prominent: 'bg-white dark:bg-[#151624] backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50'
};

export default function GlassCard({ children, className = '', variant = 'default' }) {
  const variantClass = variants[variant] || variants.default;
  return (
    <div className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
}
