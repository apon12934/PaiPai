'use client';
import React, { useEffect } from 'react';
import GlassCard from './GlassCard';

export default function Modal({ isOpen, onClose, children, title, subtitle }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modal-overlay">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md animate-modal-pop">
        <GlassCard variant="prominent" className="w-full flex flex-col relative overflow-hidden bg-white dark:bg-[#151624] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="p-6">
            {title && (
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
                {subtitle && <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
