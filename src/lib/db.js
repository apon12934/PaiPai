// Database Sync Module (Firestore Cloud Sync & Local Storage Fallback)
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'paiPaiDB';
const LEGACY_STORAGE_KEY = 'debtTrackerDB';

// Load local database from localStorage
export function loadLocalData() {
  if (typeof window === 'undefined') return {};
  const data =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ||
    JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY)) ||
    {};
  return data;
}

// Save to local storage
export function saveLocalData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// Setup Firestore Real-time Listener for logged-in user
export function setupCloudSync(user, onData, onError) {
  if (!user) return null;

  const userDocRef = doc(db, 'users', user.uid);

  // Auto-migrate local data on first login
  getDoc(userDocRef)
    .then((docSnap) => {
      if (!docSnap.exists()) {
        const localData = loadLocalData();
        if (localData && Object.keys(localData).length > 0) {
          console.log('Migrating local PaiPai data to Cloud Firestore...');
          setDoc(userDocRef, {
            trackerData: localData,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    })
    .catch((err) => {
      console.warn('Cloud migration check warning:', err);
    });

  // Real-time Firestore Listener
  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data().trackerData || {};
        // Keep local storage in sync as offline backup
        saveLocalData(cloudData);
        onData(cloudData);
      } else {
        // Document doesn't exist yet — initialize with current local data
        const localData = loadLocalData();
        saveCloudData(user, localData);
        onData(localData);
      }
    },
    (error) => {
      console.error('Firestore sync error:', error);
      if (onError) onError(error);
      // Fallback to local
      onData(loadLocalData());
    }
  );

  return unsubscribe;
}

// Save data to Firestore (and local as immediate cache)
export async function saveCloudData(user, data) {
  // Always update local storage immediately
  saveLocalData(data);

  if (user) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          trackerData: data,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
    }
  }
}
