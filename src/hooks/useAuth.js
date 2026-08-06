'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  observeAuthState,
  loginWithGoogle as _loginWithGoogle,
  signUpWithEmail as _signUpWithEmail,
  loginWithEmail as _loginWithEmail,
  linkGoogleAccount as _linkGoogleAccount,
  linkEmailAccount as _linkEmailAccount,
  updateUserProfile as _updateUserProfile,
  updateUserPassword as _updateUserPassword,
  getLinkedProviders as _getLinkedProviders,
  logoutUser as _logoutUser,
} from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    return await _loginWithGoogle();
  };

  const signUpWithEmail = async (email, password) => {
    return await _signUpWithEmail(email, password);
  };

  const loginWithEmail = async (email, password) => {
    return await _loginWithEmail(email, password);
  };

  const linkGoogleAccount = async () => {
    const result = await _linkGoogleAccount();
    if (result.success && result.user) setUser({ ...result.user });
    return result;
  };

  const linkEmailAccount = async (email, password) => {
    const result = await _linkEmailAccount(email, password);
    if (result.success && result.user) setUser({ ...result.user });
    return result;
  };

  const updateUserProfile = async (displayName, photoURL) => {
    const result = await _updateUserProfile(displayName, photoURL);
    if (result.success && result.user) setUser({ ...result.user });
    return result;
  };

  const updateUserPassword = async (newPassword) => {
    return await _updateUserPassword(newPassword);
  };

  const getLinkedProviders = () => {
    return _getLinkedProviders(user);
  };

  const logout = async () => {
    return await _logoutUser();
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    linkGoogleAccount,
    linkEmailAccount,
    updateUserProfile,
    updateUserPassword,
    getLinkedProviders,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
