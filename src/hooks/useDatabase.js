'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { setupCloudSync, loadLocalData, saveLocalData, saveCloudData } from '@/lib/db';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Cloud sync mode
      const unsubscribe = setupCloudSync(
        user,
        (cloudData) => {
          setData(cloudData || {});
          setLoading(false);
        },
        (error) => {
          console.warn('Cloud sync error, using local:', error);
          setData(loadLocalData());
          setLoading(false);
        }
      );
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      // Local-only mode
      setData(loadLocalData());
      setLoading(false);
    }
  }, [user, authLoading]);

  const saveData = useCallback(
    (newData) => {
      setData(newData);
      if (user) {
        saveCloudData(user, newData);
      } else {
        saveLocalData(newData);
      }
    },
    [user]
  );

  const value = { data, saveData, loading };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
