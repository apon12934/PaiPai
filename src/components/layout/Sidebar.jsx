'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserProfileBar from '../auth/UserProfileBar';
import PersonItem from '../ui/PersonItem';
import BouncingText from '../ui/BouncingText';
import { Settings, LogIn, UserPlus, Download, Upload } from 'lucide-react';

export default function Sidebar({
  people,
  grandTotal,
  selectedPerson,
  onSelectPerson,
  onAddPerson,
  onExport,
  onImport,
  onOpenLogin,
  onOpenSettings,
  currency = '৳',
}) {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
      setShowAddForm(false);
    }
  };

  const isGrandTotalPositive = grandTotal > 0;
  const isGrandTotalNegative = grandTotal < 0;

  return (
    <div className="w-full h-full glass-sidebar flex flex-col justify-between">
      {/* Top Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Dark Mode Logo */}
            <img 
              src="/logo.svg" 
              alt="PaiPai Logo" 
              className="hidden dark:block h-10 w-auto object-contain shrink-0"
            />
            {/* Light Mode Logo */}
            <img 
              src="/logo-light.svg" 
              alt="PaiPai Logo" 
              className="block dark:hidden h-10 w-auto object-contain shrink-0"
            />
          </div>
          {!user && (
            <div className="flex items-center gap-1 shrink-0 ml-2 bg-slate-50 dark:bg-[#141414] z-10 pl-2">
              <button
                onClick={onOpenSettings}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all border border-slate-300 dark:border-white/5 shrink-0"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all border border-slate-300 dark:border-white/5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>Log In</span>
              </button>
            </div>
          )}
        
          </div>
          {/* Slogan Ticker */}
          <BouncingText 
            text="পাই পাই করে হিসাব নিবো"
            className="h-[14px] opacity-60 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-0"
          />
        </div>

        {/* User Profile Status Bar */}
        {user && (
          <div className="border-b border-slate-200 dark:border-white/5">
            <UserProfileBar onOpenSettings={onOpenSettings} />
          </div>
        )}

        {/* Total Net Position Card */}
        <div className="p-4">
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-sm">
            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-400 uppercase tracking-widest block mb-1">
              Total Net Position
            </span>
            <div className={`text-xl font-extrabold font-mono tracking-tight ${
              isGrandTotalPositive ? 'text-emerald-600 dark:text-emerald-400' : isGrandTotalNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-300'
            }`}>
              {isGrandTotalPositive ? '+' : isGrandTotalNegative ? '-' : ''}{currency} {Math.abs(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Contacts Section Header */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <h2 className="text-[10px] font-extrabold text-slate-700 dark:text-slate-400 uppercase tracking-widest">
            CONTACTS ({people.length})
          </h2>
        </div>

        {/* People List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {people.map((person) => (
            <PersonItem
              key={person.name}
              name={person.name}
              balance={person.balance}
              isSelected={selectedPerson === person.name}
              onClick={() => onSelectPerson(person.name)}
              currency={currency}
            />
          ))}
          {people.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6 italic">No contacts added yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Container: Add New Contact + Backup Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-2">
        {showAddForm ? (
          <form onSubmit={handleAddSubmit} className="flex gap-2 animate-fade-in">
            <input
              type="text"
              autoFocus
              placeholder="Contact name..."
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="flex-1 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:border-slate-100"
            />
            <button
              type="submit"
              disabled={!newPersonName.trim()}
              className="px-3 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-md shadow-black/20 dark:shadow-white/20 disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-slate-900 dark:text-slate-300" />
            <span>Add New Contact</span>
          </button>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-lg py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all"
          >
            <Download className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Export</span>
          </button>
          <label className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-lg py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-center">
            <Upload className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Import</span>
            <input type="file" className="hidden" accept=".json" onChange={onImport} />
          </label>
        </div>
        
        <div className="pt-2 text-center">
          <a href="/privacy" className="text-[10px] text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
