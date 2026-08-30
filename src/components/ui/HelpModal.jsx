'use client';
import React from 'react';
import Modal from './Modal';
import { ExternalLink } from 'lucide-react';

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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white dark:text-slate-900"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
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
