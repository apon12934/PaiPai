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

export default function Home() {
  const { user } = useAuth();
  const { data: dbState, saveData } = useDatabase();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingTxId, setEditingTxId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

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
    if (confirm('ARE YOU SURE? This will permanently delete ALL people and transactions!')) {
      saveData({});
      setSelectedPerson(null);
      setEditingTxId(null);
      setSettingsModalOpen(false);
      alert('All data has been reset.');
    }
  }, [saveData]);

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
    if (selectedPerson && confirm(`Delete ${selectedPerson} and all their history?`)) {
      const newData = { ...dbState };
      delete newData[selectedPerson];
      saveData(newData);
      setSelectedPerson(null);
      setEditingTxId(null);
    }
  }, [selectedPerson, dbState, saveData]);

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
      if (!selectedPerson || !confirm('Delete this transaction?')) return;
      const newData = { ...dbState };
      newData[selectedPerson] = newData[selectedPerson].filter((tx) => tx.id !== id);
      saveData(newData);
      if (editingTxId === id) setEditingTxId(null);
    },
    [selectedPerson, dbState, saveData, editingTxId]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingTxId(null);
  }, []);

  // Export / Import
  const handleExport = useCallback(() => {
    if (people.length === 0) {
      alert("You don't have any data to export yet!");
      return;
    }
    const blob = new Blob([JSON.stringify(dbState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paipai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dbState, people.length]);

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
            alert('PaiPai backup restored successfully!');
          } else {
            throw new Error('Invalid format');
          }
        } catch {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    [saveData]
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
    <div className="h-screen w-screen flex items-center justify-center p-3 relative z-10">
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
    </div>
  );
}
