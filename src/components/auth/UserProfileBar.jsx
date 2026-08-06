'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AccountLinkModal from './AccountLinkModal';

export default function UserProfileBar() {
  const { user, logout } = useAuth();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg shadow-indigo-600/20">
            {initial}
          </div>
          <div className="overflow-hidden flex flex-col">
            <span className="text-sm font-medium text-slate-200 truncate">{displayName}</span>
            <span className="text-xs text-slate-500 truncate">{user.email}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button 
            onClick={() => setIsLinkModalOpen(true)}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all"
            title="Link Accounts"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>
          
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <AccountLinkModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
}
