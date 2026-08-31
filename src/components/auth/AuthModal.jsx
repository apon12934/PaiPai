'use client';

import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Eye } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { loginWithGoogle, signUpWithEmail, loginWithEmail, loading } = useAuth();
  const { enableGuestMode } = useDatabase();

  const handleGoogle = async () => {
    setError(null);
    const res = await loginWithGoogle();
    if (res.success) {
      if (res.redirecting) {
        setError("Browser blocked popup. Redirecting to secure login...");
      } else {
        onClose();
      }
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let res;
    if (isLogin) {
      res = await loginWithEmail(email, password);
    } else {
      res = await signUpWithEmail(email, password);
    }
    if (res.success) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleExploreGuest = () => {
    enableGuestMode();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isLogin ? 'Welcome Back' : 'Create an Account'}
      subtitle={isLogin ? 'Log in to save & sync your expenses to your account' : 'Sign up to get started'}
    >
      <div className="flex flex-col gap-4">
        <Button 
          variant="glass" 
          onClick={handleGoogle}
          disabled={loading}
          className="w-full relative justify-center"
        >
          <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">Or email</span>
          <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
              required
            />
          </div>
          
          {error && (
            <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>
        </form>

        <div className="mt-2 text-center flex flex-col gap-3 border-t border-white/5 light:border-slate-200 pt-3">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-300 text-xs transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>

          <button
            type="button"
            onClick={handleExploreGuest}
            className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 py-2 px-3 rounded-lg border border-white/10 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore as Guest (No saving)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
