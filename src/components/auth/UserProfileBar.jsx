'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfileBar({ onOpenSettings }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-white/[0.02] p-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5 overflow-hidden">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0 shadow"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-lg shadow-indigo-600/20">
            {initial}
          </div>
        )}
        <div className="overflow-hidden flex flex-col">
          <span className="text-xs font-semibold text-slate-200 truncate">{displayName}</span>
          <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        )}

        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
