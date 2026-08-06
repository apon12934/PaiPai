'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '../ui/Modal';
import {
  Coins,
  Moon,
  Sun,
  Laptop,
  ArrowUpDown,
  User,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Check,
  UploadCloud,
  Loader2,
  RotateCcw,
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
    linkGoogleAccount,
    getLinkedProviders,
    deleteUserAccount,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('general');

  // Settings local states
  const currency = settings.currency || '৳';
  const theme = settings.theme || 'dark';
  const sortOrder = settings.sortOrder || 'newest';

  // Profile Form states
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Link status states
  const [linkMsg, setLinkMsg] = useState({ text: '', isError: false });

  // Delete Account Confirmation Modal inside Settings
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountMsg, setDeleteAccountMsg] = useState('');

  const handleCurrencyChange = (newCurrency) => {
    onUpdateSettings({ ...settings, currency: newCurrency });
  };

  const handleThemeChange = (newTheme) => {
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  const handleSortChange = (newSort) => {
    onUpdateSettings({ ...settings, sortOrder: newSort });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setProfileMsg({ text: 'Compressing and optimizing photo...', isError: false });

    try {
      const croppedCanvas = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const side = Math.min(img.width, img.height);
            const startX = (img.width - side) / 2;
            const startY = (img.height - side) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, startX, startY, side, side, 0, 0, 500, 500);
            resolve(canvas);
          };
          img.onerror = reject;
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const blob = await new Promise((resolve) =>
        croppedCanvas.toBlob(resolve, 'image/jpeg', 0.85)
      );

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'paipai_preset');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djuwac0hj';
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        let transformedUrl = data.secure_url;
        if (transformedUrl.includes('/upload/')) {
          transformedUrl = transformedUrl.replace(
            '/upload/',
            '/upload/c_fill,g_auto,w_500,h_500,q_auto,f_auto/'
          );
        }
        setPhotoURL(transformedUrl);
        setProfileMsg({ text: 'Photo uploaded to Cloudinary successfully!', isError: false });
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      setProfileMsg({ text: err.message || 'Image upload failed', isError: true });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleResetToGooglePhoto = () => {
    const googleProviderData = user?.providerData?.find(
      (p) => p.providerId === 'google.com'
    );
    if (googleProviderData?.photoURL) {
      setPhotoURL(googleProviderData.photoURL);
      setProfileMsg({ text: 'Reset to Google profile photo.', isError: false });
    } else {
      setProfileMsg({ text: 'No Google account profile photo found.', isError: true });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', isError: false });
    try {
      await updateUserProfile(displayName, photoURL);
      setProfileMsg({ text: 'Profile updated successfully!', isError: false });
    } catch (err) {
      setProfileMsg({ text: err.message, isError: true });
    }
  };

  const handleLinkGoogle = async () => {
    setLinkMsg({ text: '', isError: false });
    try {
      await linkGoogleAccount();
      setLinkMsg({ text: 'Google account linked successfully!', isError: false });
    } catch (err) {
      setLinkMsg({ text: err.message, isError: true });
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleteAccountMsg('');
    try {
      await deleteUserAccount();
      setShowDeleteAccountModal(false);
      onClose();
    } catch (err) {
      setDeleteAccountMsg(err.message);
    }
  };

  const rawProviders = getLinkedProviders ? getLinkedProviders() : [];
  const linkedProviders = Array.isArray(rawProviders) ? rawProviders : [];
  const isGoogleLinked = linkedProviders.includes('google.com');
  const googlePhotoURL = user?.providerData?.find(
    (p) => p.providerId === 'google.com'
  )?.photoURL;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="App Settings">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10">
          {[
            { id: 'general', label: 'General', icon: Coins },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'data', label: 'Data', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isAct
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
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
              <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2.5">
                <Coins className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Currency Symbol</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CURRENCIES.map((c) => {
                  const isSel = currency === c.symbol;
                  return (
                    <button
                      key={c.code}
                      onClick={() => handleCurrencyChange(c.symbol)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className={`font-black text-sm ml-2 ${isSel ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {c.symbol}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Selector (Dark, Light, Auto System) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>App Theme</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon, color: 'text-indigo-400' },
                  { id: 'light', label: 'Light', icon: Sun, color: 'text-amber-500' },
                  { id: 'system', label: 'Auto (Device)', icon: Laptop, color: 'text-emerald-500' },
                ].map((th) => {
                  const Icon = th.icon;
                  const isSel = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => handleThemeChange(th.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSel
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? 'text-white' : th.color}`} />
                      <span>{th.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction Sort Order */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>History Sort Order</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'oldest', label: 'Oldest First' },
                ].map((so) => {
                  const isSel = sortOrder === so.id;
                  return (
                    <button
                      key={so.id}
                      onClick={() => handleSortChange(so.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {so.label}
                    </button>
                  );
                })}
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
                    className={`text-xs p-3 rounded-xl border flex items-center gap-2 font-semibold ${
                      profileMsg.isError
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    }`}
                  >
                    {profileMsg.isError ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                {/* Current Preview */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30">
                      {(displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{displayName || 'User'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Cloudinary PC Photo Upload */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">
                    Upload Photo from PC (Cloudinary)
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-indigo-500/40 hover:border-indigo-500 bg-indigo-50 dark:bg-indigo-500/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 rounded-xl cursor-pointer transition-all">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {isUploadingPhoto ? 'Uploading to Cloudinary...' : 'Choose Image File from PC'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset to Google Photo button */}
                {googlePhotoURL && (
                  <button
                    type="button"
                    onClick={handleResetToGooglePhoto}
                    className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 text-xs py-2.5 rounded-xl border border-slate-300 dark:border-white/10 transition font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Reset to Google Profile Picture</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-medium">
                Please log in to customize your profile.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SECURITY & LINK ACCOUNTS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {user ? (
              <>
                {linkMsg.text && (
                  <div
                    className={`text-xs p-3 rounded-xl border flex items-center gap-2 font-semibold ${
                      linkMsg.isError
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    }`}
                  >
                    {linkMsg.isError ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    <span>{linkMsg.text}</span>
                  </div>
                )}

                {/* Google Provider Link Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Google Account</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isGoogleLinked ? 'Linked ✓' : 'Not linked'}
                      </p>
                    </div>
                  </div>
                  {isGoogleLinked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" /> Linked
                    </span>
                  ) : (
                    <button
                      onClick={handleLinkGoogle}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition font-bold shadow-sm"
                    >
                      Link Google
                    </button>
                  )}
                </div>

                {/* Account Danger Zone */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Danger Zone
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-rose-900 dark:text-rose-300">
                        Permanently Delete Account
                      </h5>
                      <p className="text-[10px] text-rose-700 dark:text-rose-400">
                        Removes profile and cloud database files permanently.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-rose-600/20"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs font-medium">
                Please log in to manage security settings.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DATA BACKUP & RESET */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Export Backup Data</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Download a JSON backup of your contacts and transaction history.
              </p>
              <button
                onClick={onExport}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-md shadow-indigo-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON Backup</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Import Backup File</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Restore contacts and history from a previously exported JSON backup.
              </p>
              <label className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs py-2.5 rounded-xl font-bold transition cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON File</span>
                <input type="file" className="hidden" accept=".json" onChange={onImport} />
              </label>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-3">
              <h4 className="text-xs font-black text-rose-900 dark:text-rose-300">Reset Application Data</h4>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Delete all contacts and transaction history from this device/account.
              </p>
              <button
                onClick={onClearAllData}
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs py-2.5 rounded-xl font-bold transition shadow-md shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <Modal
          isOpen={showDeleteAccountModal}
          onClose={() => setShowDeleteAccountModal(false)}
          title="Delete Your Account Permanently?"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete your account? This will erase all your contacts, balance sheets, and transaction logs.
            </p>
            {deleteAccountMsg && (
              <div className="text-xs text-rose-600 font-bold p-2 bg-rose-50 rounded-lg">
                {deleteAccountMsg}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="flex-1 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
