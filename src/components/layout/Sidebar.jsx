'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserProfileBar from '../auth/UserProfileBar';
import PersonItem from '../ui/PersonItem';
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
        <div className="p-4 border-b border-white/5 light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              {currency}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 light:text-slate-900 tracking-tight leading-none">PaiPai</h1>
              <span className="text-[10px] text-slate-400 font-medium">
                পাই পাই করে হিসাব নিব
              </span>
            </div>
          </div>
          {!user && (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSettings}
                className="p-1.5 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 rounded-lg transition-all border border-white/5 light:border-slate-200"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white bg-white/5 hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-all border border-white/5 light:border-slate-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Status Bar */}
        {user && (
          <div className="border-b border-white/5 light:border-slate-200">
            <UserProfileBar onOpenSettings={onOpenSettings} />
          </div>
        )}

        {/* Total Net Position Card (Stitch Mockup Design) */}
        <div className="p-4">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] light:bg-white border border-white/5 light:border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 light:text-slate-500 uppercase tracking-widest block mb-1">
              Total Net Position
            </span>
            <div className={`text-xl font-bold font-mono tracking-tight ${
              isGrandTotalPositive ? 'text-emerald-400 light:text-emerald-600' : isGrandTotalNegative ? 'text-rose-400 light:text-rose-600' : 'text-slate-300 light:text-slate-700'
            }`}>
              {isGrandTotalPositive ? '+' : isGrandTotalNegative ? '-' : ''}{currency} {Math.abs(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Contacts Section Header */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <h2 className="text-[10px] font-bold text-slate-400 light:text-slate-500 uppercase tracking-widest">
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
      <div className="p-3 border-t border-white/5 light:border-slate-200 space-y-2">
        {showAddForm ? (
          <form onSubmit={handleAddSubmit} className="flex gap-2 animate-fade-in">
            <input
              type="text"
              autoFocus
              placeholder="Contact name..."
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="flex-1 bg-white/5 light:bg-white border border-white/10 light:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-100 light:text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newPersonName.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2 py-2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] light:bg-slate-100 light:hover:bg-slate-200 border border-white/10 light:border-slate-200 text-slate-200 light:text-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Add New Contact</span>
          </button>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 rounded-xl py-1.5 text-[11px] font-medium text-slate-400 light:text-slate-600 transition-all"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
          <label className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 light:bg-slate-100 light:hover:bg-slate-200 border border-white/5 light:border-slate-200 rounded-xl py-1.5 text-[11px] font-medium text-slate-400 light:text-slate-600 transition-all cursor-pointer text-center">
            <Upload className="w-3 h-3" />
            <span>Import</span>
            <input type="file" className="hidden" accept=".json" onChange={onImport} />
          </label>
        </div>
      </div>
    </div>
  );
}
