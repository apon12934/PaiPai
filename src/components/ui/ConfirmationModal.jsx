'use client';

import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2, Check, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-400" />,
          iconBg: 'bg-rose-500/10 border-rose-500/20',
          button: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20',
        };
      default:
        return {
          icon: <Check className="w-6 h-6 text-indigo-400" />,
          iconBg: 'bg-indigo-500/10 border-indigo-500/20',
          button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 ${styles.iconBg}`}>
          {styles.icon}
        </div>

        <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
