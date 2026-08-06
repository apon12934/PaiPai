// Database Sync Module (Firestore Cloud Sync & Local Storage Fallback)
import { db } from './firebase-config.js';
import { 
    doc, 
    onSnapshot, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const LOCAL_STORAGE_KEY = 'paiPaiDB';
const LEGACY_STORAGE_KEY = 'debtTrackerDB';

let currentDbState = {};
let unsubscribeListener = null;
let syncCallbacks = [];

// Subscribe to database updates
export function onDatabaseChange(callback) {
    syncCallbacks.push(callback);
    callback(currentDbState);
}

function notifySync(data) {
    currentDbState = data || {};
    syncCallbacks.forEach(cb => cb(currentDbState));
}

// Get current state snapshot synchronously
export function getDbData() {
    return currentDbState;
}

// Load local database from localStorage
export function loadLocalData() {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || 
                      JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY)) || {};
    currentDbState = localData;
    notifySync(currentDbState);
    return currentDbState;
}

// Save local database to localStorage
export function saveLocalData(data) {
    currentDbState = data;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    notifySync(currentDbState);
}

// Setup Firestore Real-time Listener for logged in user
export function setupCloudSync(user, onSyncError = null) {
    // Unsubscribe from previous user if any
    if (unsubscribeListener) {
        unsubscribeListener();
        unsubscribeListener = null;
    }

    if (!user) {
        // Fallback to local storage when logged out
        loadLocalData();
        return;
    }

    const userDocRef = doc(db, "users", user.uid);

    // Initial check and auto-migrate local data if user has no cloud data yet
    getDoc(userDocRef).then(docSnap => {
        if (!docSnap.exists()) {
            const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || 
                              JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
            if (localData && Object.keys(localData).length > 0) {
                console.log("Migrating local PaiPai data to Cloud Firestore...");
                setDoc(userDocRef, { trackerData: localData, lastUpdated: new Date().toISOString() });
            }
        }
    }).catch(err => {
        console.warn("Cloud snap check warning:", err);
    });

    // Real-time Firestore Listener
    unsubscribeListener = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const cloudData = docSnap.data().trackerData || {};
            currentDbState = cloudData;
            // Also keep local storage updated as an offline backup
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData));
            notifySync(currentDbState);
        } else {
            // Document doesn't exist yet, save empty or current local state
            saveCloudData(user, currentDbState);
        }
    }, (error) => {
        console.error("Firestore sync error:", error);
        if (onSyncError) onSyncError(error);
        // Fallback to local
        loadLocalData();
    });
}

// Save database to Firestore (or local if offline/logged out)
export async function saveDbData(user, data) {
    currentDbState = data;
    // Always update local storage cache immediately
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    notifySync(currentDbState);

    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { 
                trackerData: data, 
                lastUpdated: new Date().toISOString() 
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save to Firestore:", error);
        }
    }
}
