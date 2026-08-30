'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import Sidebar from '@/components/layout/Sidebar';
import MainPanel from '@/components/layout/MainPanel';
import HistoryPanel from '@/components/layout/HistoryPanel';
import EmptyState from '@/components/layout/EmptyState';
import SkeletonApp from '@/components/layout/SkeletonApp';
import AuthModal from '@/components/auth/AuthModal';
import SettingsModal from '@/components/settings/SettingsModal';
import HelpModal from '@/components/ui/HelpModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import TransactionForm from '@/components/transactions/TransactionForm';
import {
  Settings as SettingsIcon,
  Eye,
  LogIn,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { data: dbState, saveData, loading: dbLoading, isGuestMode } = useDatabase();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingTxId, setEditingTxId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [showMobileAddForm, setShowMobileAddForm] = useState(false);
  const [newMobilePersonName, setNewMobilePersonName] = useState('');

  // Toast Banner State
  const [toastMsg, setToastMsg] = useState({ text: '', isError: false });

  const showToast = useCallback((text, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => {
      setToastMsg({ text: '', isError: false });
    }, 4000);
  }, []);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger',
    onConfirm: () => {},
  });

  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Prompt auth modal for unauthenticated visitors
  useEffect(() => {
    if (!authLoading && !user && !isGuestMode) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user, isGuestMode]);

  // Settings state from dbState
  const appSettings = dbState._settings || {
    currency: '৳',
    theme: 'dark',
    sortOrder: 'newest',
  };

  const currency = appSettings.currency || '৳';
  const sortOrder = appSettings.sortOrder || 'newest';
  const theme = appSettings.theme || 'dark';

  // Dynamic Theme Effect (Dark, Light, or Auto System Device Preference)
  useEffect(() => {
    // Mirror the database theme to global localStorage for the blocking anti-flash script
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Resizer state
  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(320);
  const containerRef = useRef(null);
  const resizingRef = useRef(null);

  // If selected person was deleted externally (cloud sync), deselect
  useEffect(() => {
    if (selectedPerson && !dbState[selectedPerson]) {
      setSelectedPerson(null);
      setEditingTxId(null);
    }
  }, [dbState, selectedPerson]);

  // Compute people list with balances
  const people = Object.keys(dbState)
    .filter((key) => !key.startsWith('_'))
    .sort()
    .map((name) => {
      const txs = dbState[name] || [];
      let gave = 0, received = 0;
      txs.forEach((tx) => {
        if (tx.type === 'gave') gave += tx.amount;
        if (tx.type === 'received') received += tx.amount;
      });
      return { name, balance: gave - received };
    });

  // Compute grand total
  const grandTotal = people.reduce((sum, p) => sum + p.balance, 0);

  // Compute selected person balance
  const selectedBalance = selectedPerson
    ? people.find((p) => p.name === selectedPerson)?.balance || 0
    : 0;

  // Flatten all transactions for mobile recent activity
  const allTransactions = [];
  people.forEach((p) => {
    (dbState[p.name] || []).forEach((tx) => {
      allTransactions.push({ ...tx, personName: p.name });
    });
  });
  allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Settings update handler
  const handleUpdateSettings = useCallback(
    (partialSettings) => {
      saveData((prev) => {
        const currentSettings = prev._settings || {};
        return {
          ...prev,
          _settings: { ...currentSettings, ...partialSettings },
        };
      });
    },
    [saveData]
  );

  // Clear all application data
  const handleClearAllData = useCallback(() => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset All Application Data?',
      message: 'PERMANENT: This will delete ALL people and transaction history from your account. This action cannot be undone!',
      confirmText: 'Yes, Reset All Data',
      variant: 'danger',
      onConfirm: () => {
        saveData({});
        setSelectedPerson(null);
        setEditingTxId(null);
        setSettingsModalOpen(false);
        showToast('All application data has been reset.');
      },
    });
  }, [saveData, showToast]);

  // Transaction handlers
  const handleAddPerson = useCallback(
    (name) => {
      if (!name) return;
      const normalizedName = name.trim();
      const existingNames = Object.keys(dbState).filter(k => !k.startsWith('_'));
      const duplicate = existingNames.find(k => k.toLowerCase() === normalizedName.toLowerCase());
      
      if (duplicate) {
        showToast(`Contact "${duplicate}" already exists!`, true);
        return;
      }
      
      const newData = { ...dbState, [normalizedName]: [] };
      saveData(newData);
      setSelectedPerson(normalizedName);
    },
    [dbState, saveData, showToast]
  );

  const handleMobileAddPerson = (e) => {
    e.preventDefault();
    if (newMobilePersonName.trim()) {
      handleAddPerson(newMobilePersonName.trim());
      setNewMobilePersonName('');
      setShowMobileAddForm(false);
    }
  };

  const handleDeletePerson = useCallback(() => {
    if (!selectedPerson) return;
    setConfirmModal({
      isOpen: true,
      title: `Delete ${selectedPerson}?`,
      message: `Are you sure you want to delete ${selectedPerson} and all their transaction history?`,
      confirmText: 'Delete Person',
      variant: 'danger',
      onConfirm: () => {
        const newData = { ...dbState };
        delete newData[selectedPerson];
        saveData(newData);
        setSelectedPerson(null);
        setEditingTxId(null);
        showToast(`${selectedPerson} was deleted.`);
      },
    });
  }, [selectedPerson, dbState, saveData, showToast]);

  const handleSubmitTx = useCallback(
    (type, amount, note) => {
      if (!selectedPerson) return;
      const newData = { ...dbState };
      if (!newData[selectedPerson]) newData[selectedPerson] = [];

      if (editingTxId) {
        const txIndex = newData[selectedPerson].findIndex((t) => t.id === editingTxId);
        if (txIndex !== -1) {
          newData[selectedPerson] = [...newData[selectedPerson]];
          newData[selectedPerson][txIndex] = {
            ...newData[selectedPerson][txIndex],
            amount,
            type,
            note,
          };
        }
        setEditingTxId(null);
      } else {
        newData[selectedPerson] = [
          ...newData[selectedPerson],
          {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            amount,
            type,
            note,
          },
        ];
      }
      saveData(newData);
      showToast('Transaction logged successfully!');
    },
    [selectedPerson, editingTxId, dbState, saveData, showToast]
  );

  const handleEditTx = useCallback((id) => {
    setEditingTxId(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const scrollArea = document.getElementById('mobile-scroll-area');
      if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  const handleDeleteTx = useCallback(
    (id, personName = selectedPerson) => {
      if (!personName) return;
      setConfirmModal({
        isOpen: true,
        title: 'Delete Transaction?',
        message: 'Are you sure you want to remove this transaction record?',
        confirmText: 'Delete Transaction',
        variant: 'danger',
        onConfirm: () => {
          const newData = { ...dbState };
          newData[personName] = newData[personName].filter((tx) => tx.id !== id);
          saveData(newData);
          if (editingTxId === id) setEditingTxId(null);
          showToast('Transaction deleted.');
        },
      });
    },
    [selectedPerson, dbState, saveData, editingTxId, showToast]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingTxId(null);
  }, []);

  // Export / Import
  const handleExport = useCallback(() => {
    if (people.length === 0) {
      showToast("No data available to export yet!", true);
      return;
    }
    const blob = new Blob([JSON.stringify(dbState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paipai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON backup downloaded successfully!");
  }, [dbState, people.length, showToast]);

  const handleImport = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (typeof imported === 'object' && imported !== null && !Array.isArray(imported)) {
            for (const key of Object.keys(imported)) {
              if (key === '_settings') continue;
              if (!Array.isArray(imported[key])) {
                throw new Error('Invalid backup data format for contact: ' + key);
              }
            }
            saveData(imported);
            setSelectedPerson(null);
            setEditingTxId(null);
            showToast('PaiPai backup restored successfully!');
          } else {
            throw new Error('Invalid format');
          }
        } catch {
          showToast('Invalid backup JSON file.', true);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    [saveData, showToast]
  );

  // Resizer logic
  const handleMouseDown = useCallback((side) => {
    resizingRef.current = side;
    document.body.classList.add('no-select');
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (resizingRef.current === 'left') {
        const newWidth = e.clientX - rect.left;
        if (newWidth > 320 && newWidth < 450) setLeftWidth(newWidth);
      } else if (resizingRef.current === 'right') {
        const newWidth = rect.right - e.clientX;
        if (newWidth > 250 && newWidth < 500) setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      document.body.classList.remove('no-select');
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const editingTx =
    editingTxId && selectedPerson && dbState[selectedPerson]
      ? dbState[selectedPerson].find((t) => t.id === editingTxId)
      : null;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-0 md:p-3 relative z-10 overflow-hidden">
      {/* Toast Notification Banner */}
      {toastMsg.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all animate-pop-in ${
            toastMsg.isError
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-rose-500/20'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20'
          }`}
        >
          {toastMsg.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Guest Mode Warning Banner */}
      {!user && isGuestMode && (
        <div className="w-full max-w-[1600px] mb-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-300 backdrop-blur-md animate-pop-in">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Guest Mode:</strong> Previewing live app. Data is NOT saved.
            </span>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold px-3 py-1 rounded-lg border border-amber-500/30 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      )}

      { (authLoading || (user && dbLoading)) ? (
        <SkeletonApp />
      ) : (
        <>
          {/* DESKTOP VIEW (≥ 768px Width): 3-Panel Split View */}
          <div
        ref={containerRef}
        className="hidden md:flex w-full max-w-[1600px] h-full max-h-[92vh] glass-prominent rounded-2xl overflow-hidden"
      >
        {/* Left Sidebar */}
        <div style={{ width: leftWidth, minWidth: 320 }} className="flex-shrink-0">
          <Sidebar
            people={people}
            grandTotal={grandTotal}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
            onAddPerson={handleAddPerson}
            onExport={handleExport}
            onImport={handleImport}
            onOpenLogin={() => setAuthModalOpen(true)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            currency={currency}
          />
        </div>

        {/* Left Resizer */}
        {selectedPerson && (
          <div
            className="resizer"
            onMouseDown={() => handleMouseDown('left')}
          />
        )}

        {/* Center Workspace or Empty State */}
        {selectedPerson ? (
          <>
            <div className="flex-1 min-w-[300px]">
              <MainPanel
                person={selectedPerson}
                balance={selectedBalance}
                onDelete={handleDeletePerson}
                onSubmitTx={handleSubmitTx}
                editingTx={editingTx}
                onCancelEdit={handleCancelEdit}
                currency={currency}
              />
            </div>

            {/* Right Resizer */}
            <div
              className="resizer"
              onMouseDown={() => handleMouseDown('right')}
            />

            {/* Right History Panel */}
            <div
              style={{ width: rightWidth, minWidth: 250 }}
              className="flex-shrink-0"
            >
              <HistoryPanel
                transactions={dbState[selectedPerson] || []}
                onEdit={handleEditTx}
                onDelete={handleDeleteTx}
                editingTxId={editingTxId}
                currency={currency}
                sortOrder={sortOrder}
              />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* MOBILE VIEW (< 768px Width): Clean Single-Page View */}
      <div className="flex md:hidden flex-col w-full h-full bg-[#07080D] light:bg-[#F8F9FE] overflow-hidden">
        {/* Mobile Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 light:border-slate-200 shrink-0">
          <div className="flex items-center">
            {/* Dark Mode Logo */}
            <img src="/logo.svg" alt="PaiPai Logo" className="hidden dark:block h-7 w-auto object-contain" />
            {/* Light Mode Logo */}
            <img src="/logo-light.svg" alt="PaiPai Logo" className="block dark:hidden h-7 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-200 bg-white/5 light:bg-slate-100 rounded-lg shrink-0"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            {user ? (
              user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  onClick={() => setSettingsModalOpen(true)}
                  className="w-8 h-8 rounded-full object-cover border border-slate-900 dark:border-slate-100 cursor-pointer shadow-md shrink-0"
                />
              ) : (
                <div
                  onClick={() => setSettingsModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-xs cursor-pointer shadow-md shadow-black/20 dark:shadow-white/20 shrink-0"
                >
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 light:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-slate-300 dark:border-white/5 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Body Content Stack */}
        <div id="mobile-scroll-area" className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Total Net Position Card */}
          <div className="p-6 rounded-2xl bg-white/[0.03] light:bg-white border border-white/5 light:border-slate-200 shadow-xl text-center space-y-2">
            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest block">
              Total Net Position
            </span>
            <div className={`text-4xl font-black font-mono tracking-tight ${
              grandTotal > 0 ? 'text-emerald-400 light:text-emerald-600' : grandTotal < 0 ? 'text-rose-400 light:text-rose-600' : 'text-slate-200 light:text-slate-800'
            }`}>
              {grandTotal > 0 ? '+' : grandTotal < 0 ? '-' : ''}{currency} {Math.abs(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Contacts Carousel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 light:text-slate-500 uppercase tracking-wider">
                Contacts ({people.length})
              </h2>
              <button
                onClick={() => setShowMobileAddForm(!showMobileAddForm)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add</span>
              </button>
            </div>

            {/* Inline Add Contact Form for Mobile */}
            {showMobileAddForm && (
              <form onSubmit={handleMobileAddPerson} className="flex gap-2 mb-3 animate-pop-in">
                <input
                  type="text"
                  autoFocus
                  placeholder="New contact name..."
                  value={newMobilePersonName}
                  onChange={(e) => setNewMobilePersonName(e.target.value)}
                  className="flex-1 bg-white/5 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-3 py-2 text-xs text-white light:text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMobilePersonName.trim()}
                  className="px-3 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg disabled:opacity-40"
                >
                  Save
                </button>
              </form>
            )}

            <div className="flex gap-3 overflow-x-auto pt-3 pb-4 px-1 -mx-1">
              {people.map((p) => {
                const initial = (p.name || 'P').charAt(0).toUpperCase();
                const isSel = selectedPerson === p.name;
                return (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPerson(p.name)}
                    className={`flex flex-col items-center p-3.5 rounded-xl border min-w-[110px] transition-all cursor-pointer ${
                      isSel
                        ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900 shadow-lg shadow-black/20 dark:shadow-white/20 scale-105'
                        : 'bg-white/[0.03] light:bg-white border-white/5 light:border-slate-200 text-slate-300 light:text-slate-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                      isSel ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white' : 'bg-white/10 light:bg-slate-200 text-slate-300 light:text-slate-700'
                    }`}>
                      {initial}
                    </div>
                    <span className="text-xs font-bold truncate max-w-[90px]">{p.name}</span>
                    <span className={`text-[10px] font-mono font-bold mt-0.5 ${
                      p.balance > 0 ? (isSel ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-600 dark:text-emerald-400') : p.balance < 0 ? (isSel ? 'text-rose-400 dark:text-rose-600' : 'text-rose-600 dark:text-rose-400') : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {p.balance > 0 ? '+' : p.balance < 0 ? '-' : ''}{currency}{Math.abs(p.balance).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Contact Logger Form */}
          {selectedPerson ? (
            <div className="p-5 rounded-2xl glass-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 light:border-slate-200">
                <h3 className="text-sm font-bold text-white light:text-slate-900">
                  Log for <span className="text-slate-700 dark:text-slate-300">{selectedPerson}</span>
                </h3>
                <button
                  onClick={handleDeletePerson}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  Delete Contact
                </button>
              </div>
              <TransactionForm
                onSubmit={handleSubmitTx}
                editingTx={editingTx}
                onCancelEdit={handleCancelEdit}
                currency={currency}
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/[0.02] light:bg-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-400">Select a contact above to log transactions or view history.</p>
            </div>
          )}

          {/* Recent Activity List */}
          <div className="space-y-3 pt-2 pb-32">
            <h2 className="text-xs font-bold text-slate-400 light:text-slate-500 uppercase tracking-wider">
              {selectedPerson ? `History with ${selectedPerson}` : 'Recent Activity'}
            </h2>
            {(() => {
              const mobileTx = selectedPerson 
                ? allTransactions.filter(tx => tx.personName === selectedPerson) 
                : allTransactions;
              
              if (mobileTx.length === 0) {
                return <p className="text-xs text-slate-500 italic py-4">No {selectedPerson ? 'history' : 'recent activity'}.</p>;
              }

              return mobileTx.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] light:bg-white border border-white/5 light:border-slate-200 flex items-center justify-between shadow-sm relative"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 light:text-slate-800">
                      {tx.note || (tx.type === 'gave' ? 'Gave money' : 'Received money')}
                    </h4>
                    {!selectedPerson && (
                      <span className="text-[10px] text-slate-500">
                        with <strong className="text-slate-400">{tx.personName}</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-sm font-bold font-mono ${
                      tx.type === 'gave' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {tx.type === 'gave' ? '-' : '+'}{currency} {tx.amount.toLocaleString()}
                    </span>
                    {/* Tiny Edit/Delete buttons on mobile */}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => {
                          setSelectedPerson(tx.personName);
                          handleEditTx(tx.id);
                        }}
                        className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTx(tx.id, tx.personName)}
                        className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
      </>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={appSettings}
        onUpdateSettings={handleUpdateSettings}
        onExport={handleExport}
        onImport={handleImport}
        onClearAllData={handleClearAllData}
      />

      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
      />

      {/* GitHub Repo Floating Help Button */}
      <button
        onClick={() => setHelpModalOpen(true)}
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-black/30 dark:shadow-white/30 transition-all hover:scale-110 active:scale-95 z-50"
        title="Help & Source Code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
      </button>
    </div>
  );
}
