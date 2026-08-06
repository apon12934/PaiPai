// Database Sync Module (Firestore Cloud Sync - Isolated per User Account)
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY_PREFIX = 'paiPaiDB_';

// Load user-scoped local data
export function loadLocalData(userId) {
  if (typeof window === 'undefined' || !userId) return {};
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId)) || {};
    return data;
  } catch {
    return {};
  }
}

// Save user-scoped local data
export function saveLocalData(userId, data) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Clear all legacy and cached local storage on logout
export function clearAllLocalCache() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('paiPaiDB');
    localStorage.removeItem('debtTrackerDB');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('paiPaiDB')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn('Failed to clear cache:', e);
  }
}

// Setup Firestore Real-time Listener for logged-in user
export function setupCloudSync(user, onData, onError) {
  if (!user || !user.uid) return null;

  const userDocRef = doc(db, 'users', user.uid);

  // Real-time Firestore Listener strictly scoped to user.uid
  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data().trackerData || {};
        // Cache locally ONLY for this specific user.uid
        saveLocalData(user.uid, cloudData);
        onData(cloudData);
      } else {
        // First time login for this account — initialize empty document
        const initialData = {};
        setDoc(userDocRef, {
          trackerData: initialData,
          lastUpdated: new Date().toISOString(),
        }).catch((err) => console.warn('Init user doc warning:', err));
        saveLocalData(user.uid, initialData);
        onData(initialData);
      }
    },
    (error) => {
      console.error('Firestore sync error:', error);
      if (onError) onError(error);
      // Fallback to user-scoped local cache
      onData(loadLocalData(user.uid));
    }
  );

  return unsubscribe;
}

// Save data strictly to current user's Firestore document
export async function saveCloudData(user, data) {
  if (!user || !user.uid) return;

  // Cache locally only for this user
  saveLocalData(user.uid, data);

  try {
    const userDocRef = doc(db, 'users', user.uid);
    // Replace trackerData completely without merge:true so deleted contact keys are actually removed from Firestore
    await setDoc(userDocRef, {
      trackerData: data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to save to Firestore:', error);
  }
}
