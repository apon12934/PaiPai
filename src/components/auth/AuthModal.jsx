'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Eye, ArrowLeft, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  // Modes: 'login' | 'signup' | 'verify-signup' | 'forgot' | 'verify-reset'
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const {
    loginWithGoogle,
    loginWithEmail,
    sendOtp,
    verifySignupOtp,
    verifyResetOtp,
    loading: authLoading,
  } = useAuth();
  const { enableGuestMode } = useDatabase();

  const handleClose = () => {
    setMode('login');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setVerificationToken('');
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(false);
    if (onClose) onClose();
  };

  // Resend Cooldown Countdown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleGoogle = async () => {
    setError(null);
    setSuccessMsg(null);
    const res = await loginWithGoogle();
    if (res.success) {
      if (res.redirecting) {
        setError('Browser blocked popup. Redirecting to secure login...');
      } else {
        handleClose();
      }
    } else if (res.error) {
      setError(res.error);
    }
  };

  // Step 1: Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    const res = await loginWithEmail(email, password);
    setIsSubmitting(false);
    if (res.success) {
      handleClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  // Step 2: Request Sign-Up OTP
  const handleRequestSignupOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await sendOtp(email, 'signup');
    setIsSubmitting(false);

    if (res.success) {
      if (res.verificationToken) setVerificationToken(res.verificationToken);
      setResendCooldown(60);
      setOtp('');
      setMode('verify-signup');
      setSuccessMsg('A 6-digit verification code has been dispatched to your email.');
    } else {
      setError(res.error);
    }
  };

  // Step 3: Verify Sign-Up OTP & Complete Registration
  const handleVerifySignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    const res = await verifySignupOtp(email, cleanOtp, password, verificationToken);
    setIsSubmitting(false);

    if (res.success) {
      handleClose();
    } else {
      setError(res.error);
    }
  };

  // Step 4: Request Forgot Password OTP
  const handleRequestForgotOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    setIsSubmitting(true);
    const res = await sendOtp(email, 'reset');
    setIsSubmitting(false);

    if (res.success) {
      if (res.verificationToken) setVerificationToken(res.verificationToken);
      setResendCooldown(60);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setMode('verify-reset');
      setSuccessMsg('Password reset code dispatched! Please check your inbox.');
    } else {
      setError(res.error);
    }
  };

  // Step 5: Verify Reset OTP & Update Password
  const handleVerifyReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const res = await verifyResetOtp(email, cleanOtp, newPassword, verificationToken);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Password updated successfully! Logging you in...');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } else {
      setError(res.error);
    }
  };

  // Resend OTP Handler
  const handleResend = async (type) => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);
    const res = await sendOtp(email, type);
    setIsResending(false);

    if (res.success) {
      if (res.verificationToken) setVerificationToken(res.verificationToken);
      setResendCooldown(60);
      setSuccessMsg('New verification code sent! Check your inbox.');
    } else {
      setError(res.error);
    }
  };

  const handleExploreGuest = () => {
    enableGuestMode();
    handleClose();
  };

  const getModalMeta = () => {
    switch (mode) {
      case 'signup':
        return {
          title: 'Create an Account',
          subtitle: 'We will send a 6-digit verification code to confirm your email',
        };
      case 'verify-signup':
        return {
          title: 'Verify Your Email',
          subtitle: `Enter the 6-digit code sent to ${email}`,
        };
      case 'forgot':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your registered email to receive a 6-digit reset code',
        };
      case 'verify-reset':
        return {
          title: 'Set New Password',
          subtitle: `Enter the 6-digit code sent to ${email} and choose a new password`,
        };
      case 'login':
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Log in to save & sync your expenses to your account',
        };
    }
  };

  const meta = getModalMeta();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={meta.title} subtitle={meta.subtitle}>
      <div className="flex flex-col gap-4">
        {/* VIEW 1: LOGIN */}
        {mode === 'login' && (
          <>
            <Button
              variant="glass"
              onClick={handleGoogle}
              disabled={authLoading || isSubmitting}
              className="w-full relative justify-center"
            >
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">Or email</span>
              <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                disabled={authLoading || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging In...
                  </span>
                ) : (
                  'Log In'
                )}
              </Button>
            </form>

            <div className="mt-2 text-center flex flex-col gap-3 border-t border-white/5 light:border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-300 text-xs transition-colors"
              >
                Don&apos;t have an account? Sign Up
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
          </>
        )}

        {/* VIEW 2: SIGN UP (EMAIL & PASSWORD -> REQUEST OTP) */}
        {mode === 'signup' && (
          <>
            <Button
              variant="glass"
              onClick={handleGoogle}
              disabled={authLoading || isSubmitting}
              className="w-full relative justify-center"
            >
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">Or email</span>
              <div className="flex-grow border-t border-white/10 light:border-slate-300"></div>
            </div>

            <form onSubmit={handleRequestSignupOtp} className="flex flex-col gap-3">
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
                  placeholder="Password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                  required
                />
              </div>

              {error && (
                <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                disabled={authLoading || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Verification Code...
                  </span>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>

            <div className="mt-2 text-center flex flex-col gap-3 border-t border-white/5 light:border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-300 text-xs transition-colors"
              >
                Already have an account? Log In
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
          </>
        )}

        {/* VIEW 3: VERIFY SIGN UP OTP */}
        {mode === 'verify-signup' && (
          <form onSubmit={handleVerifySignup} autoComplete="off" className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to edit email
            </button>

            {successMsg && (
              <div className="flex items-start gap-2 text-emerald-400 text-xs p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                id="signup-otp-input"
                name="oneTimeCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono font-bold bg-black/40 light:bg-white border border-white/20 light:border-slate-300 rounded-lg py-3 text-white light:text-slate-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-slate-600"
                autoFocus
                autoComplete="one-time-code"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Didn&apos;t receive code?</span>
              {resendCooldown > 0 ? (
                <span className="text-slate-400 font-mono">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleResend('signup')}
                  disabled={isResending}
                  className="text-white hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  {isResending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Resend Code
                </button>
              )}
            </div>

            {error && (
              <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center mt-1"
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </span>
              ) : (
                'Verify & Complete Sign Up'
              )}
            </Button>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD (REQUEST RESET CODE) */}
        {mode === 'forgot' && (
          <form onSubmit={handleRequestForgotOtp} className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
            </button>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Account Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending Reset Code...
                </span>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>
        )}

        {/* VIEW 5: VERIFY RESET CODE & SET NEW PASSWORD */}
        {mode === 'verify-reset' && (
          <form onSubmit={handleVerifyReset} autoComplete="off" className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setError(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Request a different code
            </button>

            {successMsg && (
              <div className="flex items-start gap-2 text-emerald-400 text-xs p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 text-center uppercase tracking-wider">
                6-Digit Reset Code
              </label>
              <input
                id="reset-otp-input"
                name="oneTimeCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full text-center text-xl tracking-[0.4em] font-mono font-bold bg-black/40 light:bg-white border border-white/20 light:border-slate-300 rounded-lg py-2.5 text-white light:text-slate-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder-slate-600"
                autoFocus
                autoComplete="one-time-code"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-slate-500">Didn&apos;t receive code?</span>
              {resendCooldown > 0 ? (
                <span className="text-slate-400 font-mono">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleResend('reset')}
                  disabled={isResending}
                  className="text-white hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  {isResending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Resend Code
                </button>
              )}
            </div>

            <div>
              <input
                id="reset-new-password"
                name="newPassword"
                type="password"
                placeholder="New Password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                required
              />
            </div>

            <div>
              <input
                id="reset-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                className="w-full bg-black/20 light:bg-white border border-white/10 light:border-slate-300 rounded-lg px-4 py-2.5 text-slate-200 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all text-sm"
                required
              />
            </div>

            {error && (
              <div className="text-rose-400 text-xs p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 leading-relaxed">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center mt-1"
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                </span>
              ) : (
                'Update Password & Log In'
              )}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
