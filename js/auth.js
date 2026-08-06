// Firebase Authentication Handler & Account Linking Module
import { 
    auth, 
    googleProvider 
} from './firebase-config.js';
import { 
    onAuthStateChanged,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    linkWithPopup,
    linkWithCredential,
    EmailAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;
let authListeners = [];

// Subscribe to Auth state changes
export function subscribeAuthState(callback) {
    authListeners.push(callback);
    if (currentUser !== null) {
        callback(currentUser);
    }
}

function notifyAuthListeners(user) {
    currentUser = user;
    authListeners.forEach(cb => cb(user));
}

// Observe Auth state
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    notifyAuthListeners(user);
});

export function getCurrentUser() {
    return currentUser;
}

// Sign In with Google
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Google login error:", error);
        return { success: false, error: error.message };
    }
}

// Sign Up with Email & Password
export async function signUpWithEmail(email, password) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Email signup error:", error);
        return { success: false, error: error.message };
    }
}

// Log In with Email & Password
export async function loginWithEmail(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Email login error:", error);
        return { success: false, error: error.message };
    }
}

// Link Google Provider to currently logged-in account
export async function linkGoogleAccount() {
    if (!auth.currentUser) return { success: false, error: "No user currently logged in." };
    try {
        const result = await linkWithPopup(auth.currentUser, googleProvider);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Link Google error:", error);
        return { success: false, error: error.message };
    }
}

// Link Email/Password Provider to currently logged-in account
export async function linkEmailAccount(email, password) {
    if (!auth.currentUser) return { success: false, error: "No user currently logged in." };
    try {
        const credential = EmailAuthProvider.credential(email, password);
        const result = await linkWithCredential(auth.currentUser, credential);
        return { success: true, user: result.user };
    } catch (error) {
        console.error("Link Email error:", error);
        return { success: false, error: error.message };
    }
}

// Check which providers are linked to the user
export function getLinkedProviders(user = auth.currentUser) {
    if (!user) return { hasGoogle: false, hasEmail: false };
    const providers = user.providerData.map(p => p.providerId);
    return {
        hasGoogle: providers.includes('google.com'),
        hasEmail: providers.includes('password')
    };
}

// Sign Out
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return { success: false, error: error.message };
    }
}
