'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Settings, LogOut } from 'lucide-react';

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
            title="Settings & Accounts"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
