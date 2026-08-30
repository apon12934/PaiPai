'use client';
import React from 'react';
import Modal from './Modal';
import { BookOpen, ExternalLink } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Help & Guide"
      subtitle="How to use PaiPai effectively"
    >
      <div className="space-y-6">
        
        {/* Short Guide */}
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">1</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Add a Contact</h4>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Click "+ Add" to create a new person you want to track debts with.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">2</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Log Transactions</h4>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Select a person and enter an amount. Use <strong className="text-rose-500">I Gave</strong> if you gave them money, or <strong className="text-emerald-500">I Received</strong> if they paid you.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">3</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sync Across Devices</h4>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Log in via Google in Settings to securely backup and sync your data to the cloud.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200 dark:bg-white/10" />

        {/* Github Link */}
        <div>
          <a
            href="https://github.com/apon12934/PaiPai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 transition shadow-lg shadow-black/20 dark:shadow-white/20 group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-white dark:text-slate-900" />
              <div>
                <h4 className="text-sm font-bold text-white dark:text-slate-900">Source Code & Contact</h4>
                <p className="text-xs font-medium text-slate-300 dark:text-slate-600">apon12934 / PaiPai</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white dark:text-slate-900 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

      </div>
    </Modal>
  );
}
