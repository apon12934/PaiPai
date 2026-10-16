// Authentication Functions Module
import { auth, googleProvider, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithPopup,
  linkWithCredential,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  updatePassword,
  deleteUser,
  signOut,
  signInWithCustomToken,
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';


// Observe Auth State & Handle Redirect Result
export function observeAuthState(callback) {
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

// Sign In with Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/web-storage-unsupported'
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirecting: true };
      } catch (redirectError) {
        return { success: false, error: redirectError.message };
      }
    }
    return { success: false, error: error.message };
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

// Request 6-digit OTP code for Email Verification or Password Reset
export async function sendOtp(email, type = 'signup') {
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to send verification code.' };
    }
    return {
      success: true,
      message: data.message,
      verificationToken: data.verificationToken,
    };
  } catch (error) {
    return { success: false, error: error.message || 'Network error while requesting verification code.' };
  }
}

// Verify Sign-Up OTP and authenticate user
export async function verifySignupOtp(email, otp, password, verificationToken) {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password, type: 'signup', verificationToken }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Verification failed.' };
    }

    if (data.customToken) {
      const userCred = await signInWithCustomToken(auth, data.customToken);
      return { success: true, user: userCred.user };
    } else if (data.verified) {
      // Fallback for client-side registration when Admin SDK token isn't generated
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Verify Reset Password OTP and update password
export async function verifyResetOtp(email, otp, newPassword, verificationToken) {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword, type: 'reset', verificationToken }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Password reset failed.' };
    }

    if (data.customToken) {
      const userCred = await signInWithCustomToken(auth, data.customToken);
      return { success: true, user: userCred.user, message: data.message };
    }

    return { success: true, message: data.message || 'Password updated successfully!' };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Sign in with custom Firebase token
export async function loginWithCustomToken(customToken) {
  try {
    const userCred = await signInWithCustomToken(auth, customToken);
    return { success: true, user: userCred.user };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Link Google Provider to current account
export async function linkGoogleAccount() {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    googleProvider.setCustomParameters({ login_hint: auth.currentUser.email });
    const result = await linkWithPopup(auth.currentUser, googleProvider);
    googleProvider.setCustomParameters({}); // Reset for regular logins
    return { success: true, user: result.user };
  } catch (error) {
    googleProvider.setCustomParameters({}); // Reset on error too
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

// Update User Password with Current Password Re-authentication
export async function updateUserPassword(currentPassword, newPassword) {
  if (!auth.currentUser) return { success: false, error: 'No user logged in.' };
  try {
    if (currentPassword) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
    }
    await updatePassword(auth.currentUser, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: friendlyError(error) };
  }
}

// Delete User Account Permanently (Auth + Firestore Data)
export async function deleteUserAccount(currentPassword) {
  const user = auth.currentUser;
  if (!user) return { success: false, error: 'No user logged in.' };

  try {
    // 1. Re-authenticate first to verify password and refresh credentials
    if (currentPassword && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    }

    // 2. Delete Firestore user document while still authenticated
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);
    } catch (e) {
      console.warn('Firestore user doc delete warning:', e);
    }

    // 3. Delete user account from Firebase Auth
    await deleteUser(user);

    return { success: true };
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'Security requirement: Please log out and log back in before deleting your account.',
      };
    }
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
    'auth/wrong-password': 'Current password is incorrect.',
    'auth/invalid-credential': 'Current password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/popup-closed-by-user': 'Sign-in popup closed. Please try again.',
    'auth/provider-already-linked': 'This provider is already linked to your account.',
    'auth/credential-already-in-use': 'This credential is already associated with another account.',
    'auth/requires-recent-login': 'Security requirement: Please log out and log back in before performing this action.',
  };
  return map[error.code] || error.message || 'An unexpected error occurred.';
}
