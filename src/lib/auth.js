// Authentication Functions Module
import { auth, googleProvider } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  updateProfile,
  updatePassword,
  signOut,
} from 'firebase/auth';

// Observe Auth State & Handle Redirect Result
export function observeAuthState(callback) {
  // Check for pending redirect result first
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        callback(result.user);
      }
    })
    .catch((err) => {
      console.warn('Redirect result check:', err);
    });

  return onAuthStateChanged(auth, callback);
}

// Sign In with Google (Popup with automatic Redirect fallback)
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    // Fallback to redirect if popup is blocked or closed unexpectedly
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirecting: true };
      } catch (redirectError) {
        return { success: false, error: friendlyError(redirectError) };
      }
    }
    return { success: false, error: friendlyError(error) };
  }
}

// Sign Up with Email & Password
export async function signUpWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Log In with Email & Password
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Link Google Provider to current account
export async function linkGoogleAccount() {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    const result = await linkWithPopup(auth.currentUser, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Link Email/Password to current account
export async function linkEmailAccount(email, password) {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(auth.currentUser, credential);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Update User Profile (DisplayName & PhotoURL)
export async function updateUserProfile(displayName, photoURL) {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: photoURL !== undefined ? photoURL : auth.currentUser.photoURL,
    });
    return { success: true, user: auth.currentUser };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Update User Password
export async function updateUserPassword(newPassword) {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    await updatePassword(auth.currentUser, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Check linked providers
export function getLinkedProviders(user) {
  if (!user) return { hasGoogle: false, hasEmail: false };
  const providers = user.providerData.map((p) => p.providerId);
  return {
    hasGoogle: providers.includes('google.com'),
    hasEmail: providers.includes('password'),
  };
}

// Sign Out
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Map Firebase error codes to user-friendly messages
function friendlyError(error) {
  const map = {
    'auth/unauthorized-domain': 'Domain not authorized! Add your domain (e.g. paipai.ddns.net or vercel.app) to Firebase Console > Authentication > Settings > Authorized domains.',
    'auth/email-already-in-use': 'This email is already registered. Try logging in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Incorrect email or password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/popup-closed-by-user': 'Sign-in popup closed. Please try again.',
    'auth/provider-already-linked': 'This provider is already linked to your account.',
    'auth/credential-already-in-use': 'This credential is already associated with another account.',
    'auth/requires-recent-login': 'Please log out and log back in before updating your password.',
  };
  return map[error.code] || error.message || 'An unexpected error occurred.';
}
