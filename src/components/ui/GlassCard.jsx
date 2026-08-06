'use client';
import React from 'react';

const variants = {
  default: 'bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl',
  subtle: 'bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-xl',
  prominent: 'bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-2xl shadow-lg shadow-black/10'
};

export default function GlassCard({ children, className = '', variant = 'default' }) {
  const variantClass = variants[variant] || variants.default;
  return (
    <div className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
}
