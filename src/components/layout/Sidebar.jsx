'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserProfileBar from '../auth/UserProfileBar';
import BalanceCard from '../ui/BalanceCard';
import PersonItem from '../ui/PersonItem';
import { Settings, LogIn, Plus, Download, Upload, Users } from 'lucide-react';

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
  const [newPersonName, setNewPersonName] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
    }
  };

  return (
    <div className="w-full h-full bg-white/[0.02] border-r border-white/5 flex flex-col backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20">
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
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all border border-white/5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          </div>
        )}
      </div>

      {/* User Auth Bar */}
      {user && (
        <div className="border-b border-white/5">
          <UserProfileBar onOpenSettings={onOpenSettings} />
        </div>
      )}

      {/* Grand Total */}
      <div className="p-4 border-b border-white/5">
        <BalanceCard amount={grandTotal} size="sm" label="Overall Balance" currency={currency} />
      </div>

      {/* Add Person */}
      <div className="p-4 border-b border-white/5">
        <form onSubmit={handleAddSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add person..."
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="flex-1 bg-white/5 light:bg-white border border-white/10 light:border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!newPersonName.trim()}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* People List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 mb-2 mt-2">
          <h2 className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Users className="w-3 h-3 text-slate-400" />
            <span>People</span>
          </h2>
          <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">
            {people.length}
          </span>
        </div>
        <div className="space-y-1">
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
            <p className="text-xs text-slate-500 text-center py-6 italic font-normal">No people added yet.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 flex gap-2">
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-3 py-2 text-[11px] font-medium text-slate-300 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>
        <label className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-3 py-2 text-[11px] font-medium text-slate-300 transition-all cursor-pointer text-center">
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Import</span>
          <input type="file" className="hidden" accept=".json" onChange={onImport} />
        </label>
      </div>
    </div>
  );
}
