'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import Sidebar from '@/components/layout/Sidebar';
import MainPanel from '@/components/layout/MainPanel';
import HistoryPanel from '@/components/layout/HistoryPanel';
import EmptyState from '@/components/layout/EmptyState';
import AuthModal from '@/components/auth/AuthModal';
import SettingsModal from '@/components/settings/SettingsModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { Eye, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { data: dbState, saveData, isGuestMode } = useDatabase();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingTxId, setEditingTxId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Toast Banner State (Replaces native alert popups)
  const [toastMsg, setToastMsg] = useState({ text: '', isError: false });

  const showToast = useCallback((text, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => {
      setToastMsg({ text: '', isError: false });
    }, 4000);
  }, []);

  // Confirmation Modal State (Replaces native confirm popups)
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

  // Automatically prompt auth modal for unauthenticated visitors
  useEffect(() => {
    if (!authLoading && !user && !isGuestMode) {
      setAuthModalOpen(true);
    }
  }, [authLoading, user, isGuestMode]);

  // Settings state from dbState or default
  const appSettings = dbState._settings || {
    currency: '৳',
    theme: 'dark',
    sortOrder: 'newest',
  };

  const currency = appSettings.currency || '৳';
  const sortOrder = appSettings.sortOrder || 'newest';

  // Resizer state
  const [leftWidth, setLeftWidth] = useState(280);
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

  // Compute people list with balances (excluding internal keys like _settings)
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

  // Settings update handler
  const handleUpdateSettings = useCallback(
    (newSettings) => {
      saveData({
        ...dbState,
        _settings: newSettings,
      });
    },
    [dbState, saveData]
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
      if (name && !dbState[name]) {
        const newData = { ...dbState, [name]: [] };
        saveData(newData);
        setSelectedPerson(name);
      }
    },
    [dbState, saveData]
  );

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
    },
    [selectedPerson, editingTxId, dbState, saveData]
  );

  const handleEditTx = useCallback((id) => {
    setEditingTxId(id);
  }, []);

  const handleDeleteTx = useCallback(
    (id) => {
      if (!selectedPerson) return;
      setConfirmModal({
        isOpen: true,
        title: 'Delete Transaction?',
        message: 'Are you sure you want to remove this transaction record?',
        confirmText: 'Delete Transaction',
        variant: 'danger',
        onConfirm: () => {
          const newData = { ...dbState };
          newData[selectedPerson] = newData[selectedPerson].filter((tx) => tx.id !== id);
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
          if (typeof imported === 'object' && imported !== null) {
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
        if (newWidth > 220 && newWidth < 450) setLeftWidth(newWidth);
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

  // Find editing tx for the form
  const editingTx =
    editingTxId && selectedPerson && dbState[selectedPerson]
      ? dbState[selectedPerson].find((t) => t.id === editingTxId)
      : null;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-3 relative z-10">
      {/* Toast Notification Banner */}
      {toastMsg.text && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all animate-slide-up ${
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
        <div className="w-full max-w-[1600px] mb-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300 backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Guest Mode:</strong> You are exploring in preview mode. Data is NOT saved to browser storage.
            </span>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold px-3 py-1 rounded-lg border border-amber-500/30 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Save Account Data</span>
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex w-full max-w-[1600px] h-full max-h-[92vh] glass-prominent rounded-2xl overflow-hidden"
      >
        {/* Left Sidebar */}
        <div style={{ width: leftWidth, minWidth: 220 }} className="flex-shrink-0">
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
            className="resizer hidden md:block"
            onMouseDown={() => handleMouseDown('left')}
          />
        )}

        {/* Center + Right Panels or Empty State */}
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
              className="resizer hidden md:block"
              onMouseDown={() => handleMouseDown('right')}
            />

            {/* Right History Panel */}
            <div
              style={{ width: rightWidth, minWidth: 250 }}
              className="flex-shrink-0 hidden md:flex"
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
    </div>
  );
}
