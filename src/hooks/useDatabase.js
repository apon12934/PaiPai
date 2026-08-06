'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { setupCloudSync, saveCloudData } from '@/lib/db';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Logged In: Real-time Cloud Sync with Firestore
      setIsGuestMode(false);
      const unsubscribe = setupCloudSync(
        user,
        (cloudData) => {
          setData(cloudData || {});
          setLoading(false);
        },
        (error) => {
          console.warn('Cloud sync error:', error);
          setLoading(false);
        }
      );
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      // Logged Out / Guest Mode: In-memory temporary state (NOT saved to browser)
      setData({});
      setLoading(false);
    }
  }, [user, authLoading]);

  const saveData = useCallback(
    (newData) => {
      setData(newData);
      if (user) {
        // Only save persistent data to Firebase Cloud Account
        saveCloudData(user, newData);
      }
      // If logged out / guest mode, data remains strictly in-memory (never written to localStorage)
    },
    [user]
  );

  const enableGuestMode = useCallback(() => {
    setIsGuestMode(true);
    // Initialize sample guest demo data
    setData({
      "Sample Alex": [
        {
          id: "demo-1",
          date: new Date().toISOString(),
          amount: 500,
          type: "gave",
          note: "Lunch tab"
        }
      ]
    });
  }, []);

  const value = { data, saveData, loading, isGuestMode, enableGuestMode };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
