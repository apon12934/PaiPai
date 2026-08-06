'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import {
  Settings,
  User,
  ShieldCheck,
  Database,
  Moon,
  Sun,
  Mail,
  Key,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  ArrowUpDown,
  Coins,
} from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState('general');

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
      if (user.email) {
        setLinkEmailInput(user.email);
      }
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
    const emailToUse = linkEmailInput.trim() || user?.email;
    if (!emailToUse) {
      alert('Please enter a valid email address.');
      return;
    }
    const res = await linkEmailAccount(emailToUse, linkPassInput);
    if (res.success) {
      alert('Email/Password account linked successfully!');
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
          { id: 'general', label: 'General', icon: Settings },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: ShieldCheck },
          { id: 'data', label: 'Data', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL PREFERENCES */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Currency Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              <Coins className="w-3.5 h-3.5 text-indigo-400" />
              <span>Currency Symbol</span>
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
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>App Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Glass (Default)</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* Transaction Sort Order */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>History Sort Order</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSortChange('newest')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  sortOrder === 'newest'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  sortOrder === 'oldest'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
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
                  className={`text-xs p-3 rounded-xl border flex items-center gap-2 ${
                    profileMsg.isError
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Linked Login Accounts
                </label>

                {/* Google Provider Status */}
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-xs font-semibold text-slate-200">Google Account</span>
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
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1 rounded-lg transition font-medium"
                    >
                      Link Google
                    </button>
                  )}
                </div>

                {/* Email Provider Status */}
                <div className="p-3 border border-white/10 rounded-xl bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-slate-200">Password Login</span>
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
                    <form onSubmit={handleLinkEmail} className="space-y-2.5 pt-2.5 border-t border-white/5">
                      <p className="text-[11px] text-slate-400">
                        Attach a password to your Google account (<span className="text-indigo-300 font-semibold">{user?.email}</span>) to log in with password too:
                      </p>
                      <input
                        type="email"
                        value={linkEmailInput}
                        onChange={(e) => setLinkEmailInput(e.target.value)}
                        required
                        readOnly={!!user?.email}
                        placeholder="Email address"
                        className={`w-full px-3 py-2 rounded-lg text-xs ${
                          user?.email ? 'opacity-70 bg-white/5 cursor-not-allowed' : ''
                        }`}
                      />
                      <input
                        type="password"
                        value={linkPassInput}
                        onChange={(e) => setLinkPassInput(e.target.value)}
                        required
                        minlength="6"
                        placeholder="Set Password (min 6 chars)"
                        className="w-full px-3 py-2 rounded-lg text-xs"
                      />
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-lg font-semibold transition shadow-md shadow-indigo-600/20"
                      >
                        Attach Password Login
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Change Password Form (if email linked) */}
              {hasEmail && (
                <form onSubmit={handleSavePassword} className="space-y-3 pt-4 border-t border-white/5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Change Password</span>
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
            <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-200 uppercase mb-1">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Backup</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">Download a full JSON backup of all your transactions and people records.</p>
            <button
              onClick={onExport}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg font-medium transition border border-white/10 flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.02]">
            <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-200 uppercase mb-1">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Import Backup</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">Restore your data from a previously exported PaiPai JSON file.</p>
            <label className="flex items-center justify-center gap-2 w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg font-medium transition cursor-pointer border border-white/10">
              <Upload className="w-3.5 h-3.5" />
              <span>Select JSON File to Restore</span>
              <input type="file" className="hidden" accept=".json" onChange={onImport} />
            </label>
          </div>

          <div className="p-4 border border-rose-500/20 rounded-xl bg-rose-500/5">
            <h4 className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase mb-1">
              <Trash2 className="w-4 h-4" />
              <span>Danger Zone</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">Permanently delete all people and transaction history.</p>
            <button
              onClick={onClearAllData}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs py-2 rounded-lg font-medium transition border border-rose-500/20 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Application Data</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
