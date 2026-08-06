'use client';
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';
import GlassCard from '../ui/GlassCard';

export default function AccountLinkModal({ isOpen, onClose }) {
  const { getLinkedProviders, linkGoogleAccount, linkEmailAccount, loading } = useAuth();
  const [providers, setProviders] = useState({ google: false, password: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const p = getLinkedProviders();
      setProviders({
        google: p.includes('google.com'),
        password: p.includes('password')
      });
      setError(null);
    }
  }, [isOpen, getLinkedProviders]);

  const handleLinkGoogle = async () => {
    try {
      setError(null);
      await linkGoogleAccount();
      const p = getLinkedProviders();
      setProviders({
        google: p.includes('google.com'),
        password: p.includes('password')
      });
    } catch (err) {
      setError(err.message || 'Failed to link Google account');
    }
  };

  const handleLinkEmail = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await linkEmailAccount(email, password);
      const p = getLinkedProviders();
      setProviders({
        google: p.includes('google.com'),
        password: p.includes('password')
      });
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to link email account');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Linked Accounts"
      subtitle="Connect multiple ways to sign in to your account"
    >
      <div className="flex flex-col gap-4">
        {error && (
          <div className="text-rose-400 text-sm p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
            {error}
          </div>
        )}

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-medium text-slate-200">Google Account</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md ${providers.google ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
              {providers.google ? 'Linked ✓' : 'Not Linked'}
            </span>
          </div>
          {!providers.google && (
            <Button variant="glass" className="w-full mt-3 text-xs" onClick={handleLinkGoogle} disabled={loading}>
              Link Google Account
            </Button>
          )}
        </GlassCard>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span className="font-medium text-slate-200">Email / Password</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md ${providers.password ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
              {providers.password ? 'Linked ✓' : 'Not Linked'}
            </span>
          </div>
          
          {!providers.password && (
            <form onSubmit={handleLinkEmail} className="flex flex-col gap-3 mt-3">
              <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                required
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                required
              />
              <Button type="submit" variant="glass" className="w-full text-xs" disabled={loading}>
                Attach Email Login
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </Modal>
  );
}
