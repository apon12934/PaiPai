'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  observeAuthState,
  loginWithGoogle as _loginWithGoogle,
  signUpWithEmail as _signUpWithEmail,
  loginWithEmail as _loginWithEmail,
  linkGoogleAccount as _linkGoogleAccount,
  linkEmailAccount as _linkEmailAccount,
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
    const result = await _loginWithGoogle();
    return result;
  };

  const signUpWithEmail = async (email, password) => {
    const result = await _signUpWithEmail(email, password);
    return result;
  };

  const loginWithEmail = async (email, password) => {
    const result = await _loginWithEmail(email, password);
    return result;
  };

  const linkGoogleAccount = async () => {
    const result = await _linkGoogleAccount();
    if (result.success) setUser(result.user);
    return result;
  };

  const linkEmailAccount = async (email, password) => {
    const result = await _linkEmailAccount(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const getLinkedProviders = () => {
    return _getLinkedProviders(user);
  };

  const logout = async () => {
    const result = await _logoutUser();
    return result;
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    signUpWithEmail,
    loginWithEmail,
    linkGoogleAccount,
    linkEmailAccount,
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
