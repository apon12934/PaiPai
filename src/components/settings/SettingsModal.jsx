'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '@/hooks/useAuth';

const CURRENCIES = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka (৳)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (د.إ)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings = {},
  onUpdateSettings,
  onExport,
  onImport,
  onClearAllData,
}) {
  const {
    user,
    updateUserProfile,
    updateUserPassword,
    getLinkedProviders,
    linkGoogleAccount,
    linkEmailAccount,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'profile' | 'security' | 'data'

  // General Settings State
  const [currency, setCurrency] = useState(settings.currency || '৳');
  const [theme, setTheme] = useState(settings.theme || 'dark');
  const [sortOrder, setSortOrder] = useState(settings.sortOrder || 'newest');

  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });

  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', isError: false });
  const [linkEmailInput, setLinkEmailInput] = useState('');
  const [linkPassInput, setLinkPassInput] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  useEffect(() => {
    setCurrency(settings.currency || '৳');
    setTheme(settings.theme || 'dark');
    setSortOrder(settings.sortOrder || 'newest');
  }, [settings]);

  // Handle General Settings Update
  const handleCurrencyChange = (sym) => {
    setCurrency(sym);
    onUpdateSettings({ ...settings, currency: sym });
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    onUpdateSettings({ ...settings, theme: t });
  };

  const handleSortChange = (so) => {
    setSortOrder(so);
    onUpdateSettings({ ...settings, sortOrder: so });
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', isError: false });
    const finalPhoto = customPhotoInput.trim() || photoURL;
    const res = await updateUserProfile(displayName.trim(), finalPhoto);
    if (res.success) {
      setProfileMsg({ text: 'Profile updated successfully!', isError: false });
    } else {
      setProfileMsg({ text: res.error || 'Failed to update profile', isError: true });
    }
  };

  // Handle Password Update
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSecurityMsg({ text: '', isError: false });
    if (newPassword.length < 6) {
      setSecurityMsg({ text: 'Password must be at least 6 characters.', isError: true });
      return;
    }
    const res = await updateUserPassword(newPassword);
    if (res.success) {
      setSecurityMsg({ text: 'Password changed successfully!', isError: false });
      setNewPassword('');
    } else {
      setSecurityMsg({ text: res.error || 'Failed to change password.', isError: true });
    }
  };

  // Provider linking
  const { hasGoogle, hasEmail } = getLinkedProviders();

  const handleLinkGoogle = async () => {
    const res = await linkGoogleAccount();
    if (res.success) {
      alert('Google account linked successfully!');
    } else {
      alert('Linking failed: ' + res.error);
    }
  };

  const handleLinkEmail = async (e) => {
    e.preventDefault();
    const res = await linkEmailAccount(linkEmailInput.trim(), linkPassInput);
    if (res.success) {
      alert('Email/Password account linked successfully!');
      setLinkEmailInput('');
      setLinkPassInput('');
    } else {
      alert('Linking failed: ' + res.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="App Settings">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-1 overflow-x-auto pb-1">
        {[
          { id: 'general', label: '⚙️ General' },
          { id: 'profile', label: '👤 Profile' },
          { id: 'security', label: '🔐 Security' },
          { id: 'data', label: '💾 Data' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL PREFERENCES */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Currency Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Currency Symbol
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.symbol)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    currency === c.symbol
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="font-bold text-sm ml-2 text-indigo-300">{c.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              App Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🌙 Dark Glass (Default)</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>☀️ Light Theme</span>
              </button>
            </div>
          </div>

          {/* Transaction Sort Order */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              History Sort Order
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSortChange('newest')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  sortOrder === 'newest'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  sortOrder === 'oldest'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & AVATAR */}
      {activeTab === 'profile' && (
        <div>
          {user ? (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {profileMsg.text && (
                <div
                  className={`text-xs p-3 rounded-xl border ${
                    profileMsg.isError
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {profileMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Choose Profile Picture
                </label>
                <div className="flex items-center gap-3 mb-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preset Avatar"
                      onClick={() => {
                        setPhotoURL(url);
                        setCustomPhotoInput('');
                      }}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        photoURL === url
                          ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  value={customPhotoInput}
                  onChange={(e) => {
                    setCustomPhotoInput(e.target.value);
                    setPhotoURL(e.target.value);
                  }}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Save Profile Changes
              </button>
            </form>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Please log in to customize your profile.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SECURITY & LINKING */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {user ? (
            <>
              {/* Linked Accounts */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Linked Login Accounts
                </label>

                {/* Google Provider Status */}
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🌐 Google</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        hasGoogle
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-700/50 text-slate-400'
                      }`}
                    >
                      {hasGoogle ? 'Linked ✓' : 'Not Linked'}
                    </span>
                  </div>
                  {!hasGoogle && (
                    <button
                      onClick={handleLinkGoogle}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded-lg transition"
                    >
                      Link
                    </button>
                  )}
                </div>

                {/* Email Provider Status */}
                <div className="p-3 border border-white/10 rounded-xl bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">✉️ Email & Password</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          hasEmail
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        {hasEmail ? 'Linked ✓' : 'Not Linked'}
                      </span>
                    </div>
                  </div>

                  {!hasEmail && (
                    <form onSubmit={handleLinkEmail} className="space-y-2 pt-2 border-t border-white/5">
                      <input
                        type="email"
                        value={linkEmailInput}
                        onChange={(e) => setLinkEmailInput(e.target.value)}
                        required
                        placeholder="Attach Email address"
                        className="w-full px-3 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="password"
                        value={linkPassInput}
                        onChange={(e) => setLinkPassInput(e.target.value)}
                        required
                        minlength="6"
                        placeholder="Set Password"
                        className="w-full px-3 py-1.5 rounded-lg text-xs"
                      />
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1.5 rounded-lg font-medium transition"
                      >
                        Attach Email Login
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Change Password Form (if email linked) */}
              {hasEmail && (
                <form onSubmit={handleSavePassword} className="space-y-3 pt-4 border-t border-white/5">
                  <label className="block text-xs font-semibold uppercase text-slate-400">
                    Change Password
                  </label>
                  {securityMsg.text && (
                    <div
                      className={`text-xs p-3 rounded-xl border ${
                        securityMsg.isError
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {securityMsg.text}
                    </div>
                  )}
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minlength="6"
                    placeholder="New Password (min 6 chars)"
                    className="w-full px-3 py-2 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded-xl font-medium transition"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Please log in to manage security & linked accounts.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DATA & BACKUP */}
      {activeTab === 'data' && (
        <div className="space-y-5">
          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <h4 className="text-xs font-semibold text-slate-200 uppercase mb-1">Export Backup</h4>
            <p class="text-xs text-slate-400 mb-3">Download a full JSON backup of all your transactions and people records.</p>
            <button
              onClick={onExport}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg font-medium transition border border-white/10"
            >
              Export JSON Backup
            </button>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <h4 className="text-xs font-semibold text-slate-200 uppercase mb-1">Import Backup</h4>
            <p className="text-xs text-slate-400 mb-3">Restore your data from a previously exported PaiPai JSON file.</p>
            <label className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg font-medium transition cursor-pointer border border-white/10">
              Select JSON File to Restore
              <input type="file" className="hidden" accept=".json" onChange={onImport} />
            </label>
          </div>

          <div className="p-4 border border-rose-500/20 rounded-xl bg-rose-500/5">
            <h4 className="text-xs font-semibold text-rose-400 uppercase mb-1">Danger Zone</h4>
            <p className="text-xs text-slate-400 mb-3">Permanently delete all people and transaction history.</p>
            <button
              onClick={onClearAllData}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs py-2 rounded-lg font-medium transition border border-rose-500/20"
            >
              Reset All Application Data
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
