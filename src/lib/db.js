// Database Sync Module (Firestore Cloud Sync - Isolated per User Account)
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

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
        onData(cloudData);
      } else {
        // First time login for this account - initialize empty document
        const initialData = {};
        setDoc(userDocRef, {
          trackerData: initialData,
          lastUpdated: new Date().toISOString(),
        }).catch((err) => console.warn('Init user doc warning:', err));
        
        onData(initialData);
      }
    },
    (error) => {
      console.error('Firestore sync error:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

// Save data strictly to current user's Firestore document
export async function saveCloudData(user, data) {
  if (!user || !user.uid) return;

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
