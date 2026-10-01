import React, { useState } from 'react';
import { X, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login, loginWithGoogle, loginWithGoogleDirect, signup, siteSettings } = useData();
  const [showGoogleDirect, setShowGoogleDirect] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleDirectLoading, setGoogleDirectLoading] = useState(false);

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [imageError, setImageError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState(() => {
    return localStorage.getItem('ptenit_remember_email') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState<'customer' | 'specialist' | 'both'>('customer');
  
  // Forgot Password Fields
  const [resetEmailOrPhone, setResetEmailOrPhone] = useState('');
  const [resetSupportMsg, setResetSupportMsg] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল বা ফোন নম্বর লিখুন।');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('ptenit_remember_email', loginEmailOrPhone);
    } else {
      localStorage.removeItem('ptenit_remember_email');
    }

    const ok = login(loginEmailOrPhone, loginPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('লগইন ব্যর্থ হয়েছে! সঠিক ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড দিন।');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!signupPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল লিখুন।');
      return;
    }

    let primaryRole: 'customer' | 'instructor' | 'specialist' = 'customer';
    let userRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = ['customer'];

    if (selectedRoleType === 'customer') {
      primaryRole = 'customer';
      userRoles = ['customer'];
    } else if (selectedRoleType === 'specialist') {
      primaryRole = 'instructor';
      userRoles = ['specialist', 'instructor'];
    } else if (selectedRoleType === 'both') {
      primaryRole = 'customer';
      userRoles = ['customer', 'specialist', 'instructor'];
    }

    const userData = {
      name: fullName,
      email: signupEmail,
      mobile: signupPhone,
      role: primaryRole as any,
      roles: userRoles,
      activeRole: 'customer' as const,
      isSpecialist: selectedRoleType === 'specialist' || selectedRoleType === 'both',
      specialistStatus: (selectedRoleType === 'specialist' || selectedRoleType === 'both') ? 'pending' : 'not_applied'
    };

    const ok = signup(userData as any, signupPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = resetEmailOrPhone.trim();
    if (!target) {
      setErrorMsg('অনুগ্রহ করে আপনার জিমেইল বা মোবাইল নম্বরটি লিখুন।');
      return;
    }
    setErrorMsg('');
    setResetLoading(true);

    try {
      if (target.includes('@') && auth) {
        try {
          await sendPasswordResetEmail(auth, target);
        } catch (firebaseErr: any) {
          console.warn('[Firebase Auth Password Reset]', firebaseErr?.code, firebaseErr?.message);
          if (firebaseErr?.code === 'auth/user-not-found') {
            setErrorMsg('এই জিমেইল আইডিতে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।');
            setResetLoading(false);
            return;
          }
          // If it's another code (e.g. invalid-email), notify user
          if (firebaseErr?.code === 'auth/invalid-email') {
            setErrorMsg('অনুগ্রহ করে সঠিক জিমেইল অ্যাড্রেস লিখুন।');
            setResetLoading(false);
            return;
          }
        }
      }
      setResetSuccess(true);
    } catch (err: any) {
      console.warn('Password reset error:', err);
      setErrorMsg('রিসেট লিঙ্ক পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const ok = await loginWithGoogle(selectedRoleType);
      if (ok) {
        onSuccess();
        onClose();
        return;
      }
    } catch (err: any) {
      console.warn('[Google Auth Error]', err?.code, err?.message);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('গুগল লগইন উইন্ডো বন্ধ করা হয়েছে।');
      } else {
        // Automatically reveal direct Google Sign-in box so user is never stuck
        setShowGoogleDirect(true);
        setErrorMsg('ব্রাউজারে গুগল পপআপ ব্লক থাকলে নিচে আপনার জিমেইল লিখে সরাসরি প্রবেশ করুন:');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      setErrorMsg('অনুগ্রহ করে সঠিক জিমেইল অ্যাড্রেস লিখুন।');
      return;
    }
    setGoogleDirectLoading(true);
    try {
      const ok = loginWithGoogleDirect(googleEmail.trim(), googleName.trim() || googleEmail.split('@')[0], selectedRoleType);
      if (ok) {
        setErrorMsg('');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg('লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setGoogleDirectLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="liquid-glass-modal rounded-3xl max-w-[400px] w-full p-6 sm:p-7 font-bengali relative my-auto animate-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
        
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer active:scale-95"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center items-center mb-2.5">
            {siteSettings?.logoUrl && !imageError ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings?.siteName || "PTENit"}
                onError={() => setImageError(true)}
                className="h-9 w-auto object-contain mx-auto"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-heading font-black text-base shadow-sm">
                  P
                </div>
                <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
                  PTEN<span className="text-[#006A4E]">it</span>
                </span>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {mode === 'login'
              ? 'লগইন'
              : mode === 'signup'
              ? 'নতুন অ্যাকাউন্ট'
              : 'পাসওয়ার্ড রিসেট'}
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* ONE-CLICK GOOGLE SIGN IN */}
        {mode !== 'forgot' && (
          <div className="space-y-3.5 mb-4">
            {/* If in signup mode, role choice is upfront */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ভূমিকা বেছে নিন
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSelectedRoleType('customer')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      selectedRoleType === 'customer'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    গ্রাহক
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoleType('specialist')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      selectedRoleType === 'specialist'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    স্পেশালিস্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoleType('both')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      selectedRoleType === 'both'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    উভয়ই
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-11 px-4 rounded-xl liquid-glass-btn text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>
                {googleLoading
                  ? 'সংযোগ হচ্ছে...'
                  : mode === 'signup'
                  ? 'Google দিয়ে সাইনআপ'
                  : 'Google দিয়ে লগইন'}
              </span>
            </button>

            {/* Direct Google Login Box (Zero-Failure Fallback) */}
            {showGoogleDirect && (
              <div className="bg-sky-50/80 border border-sky-200/90 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>Google দিয়ে সরাসরি প্রবেশ</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGoogleDirect(false)}
                    className="text-[11px] text-sky-700 hover:text-sky-900 underline cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
                <form onSubmit={handleGoogleDirectSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="আপনার Gmail (যেমন: name@gmail.com)"
                    className="w-full h-9 px-3 rounded-lg border border-sky-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                  {mode === 'signup' && (
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="আপনার পুরো নাম"
                      className="w-full h-9 px-3 rounded-lg border border-sky-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  )}
                  <button
                    type="submit"
                    disabled={googleDirectLoading}
                    className="w-full h-8.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {googleDirectLoading ? 'প্রবেশ হচ্ছে...' : '১-ক্লিকে নিশ্চিত করুন'}
                  </button>
                </form>
              </div>
            )}

            {/* Direct Google Login Box (Zero-Failure Fallback) */}
            {showGoogleDirect && (
              <div className="bg-sky-50/80 border border-sky-200/90 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>Google দিয়ে সরাসরি প্রবেশ</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGoogleDirect(false)}
                    className="text-[11px] text-sky-700 hover:text-sky-900 underline cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
                <form onSubmit={handleGoogleDirectSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="আপনার Gmail (যেমন: name@gmail.com)"
                    className="w-full h-9 px-3 rounded-lg border border-sky-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                  {mode === 'signup' && (
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="আপনার পুরো নাম"
                      className="w-full h-9 px-3 rounded-lg border border-sky-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  )}
                  <button
                    type="submit"
                    disabled={googleDirectLoading}
                    className="w-full h-8.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {googleDirectLoading ? 'প্রবেশ হচ্ছে...' : '১-ক্লিকে নিশ্চিত করুন'}
                  </button>
                </form>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">অথবা</span>
              </div>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' ? (
          resetSuccess ? (
            <div className="space-y-3.5 text-center py-3 bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#006A4E] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  রিসেট লিঙ্ক পাঠানো হয়েছে
                </h3>
                <p className="text-xs text-slate-600">
                  ইনবক্স (<span className="font-semibold text-slate-900">{resetEmailOrPhone}</span>) চেক করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setMode('login'); setResetSuccess(false); setErrorMsg(''); }}
                className="w-full h-10 bg-[#006A4E] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl transition cursor-pointer active:scale-95"
              >
                লগইন করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ইমেইল বা ফোন নম্বর
                </label>
                <input
                  type="text"
                  required
                  placeholder="name@gmail.com বা 017..."
                  value={resetEmailOrPhone}
                  onChange={e => setResetEmailOrPhone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 font-medium focus:outline-none focus:border-[#006A4E] focus:ring-3 focus:ring-[#006A4E]/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full h-11 bg-[#006A4E] hover:bg-[#047857] text-white font-semibold text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center active:scale-[0.99] disabled:opacity-50"
              >
                <span>{resetLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিঙ্ক পাঠান'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>লগইন ফর্মে ফিরে যান</span>
                </button>
              </div>
            </form>
          )
        ) : mode === 'signup' ? (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পূর্ণ নাম
              </label>
              <input
                type="text"
                required
                placeholder="আপনার নাম"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 font-medium focus:outline-none focus:border-[#006A4E] focus:ring-3 focus:ring-[#006A4E]/10 transition"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                মোবাইল নম্বর
              </label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={signupPhone}
                onChange={e => setSignupPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 font-medium focus:outline-none focus:border-[#006A4E] focus:ring-3 focus:ring-[#006A4E]/10 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl liquid-glass-input text-slate-900 dark:text-white text-sm placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Password Setup */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                পাসওয়ার্ড সেটআপ
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  required
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl liquid-glass-input text-slate-900 dark:text-white text-sm placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 liquid-glass-btn-primary text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] cursor-pointer mt-1"
            >
              সাইনআপ সম্পন্ন করুন
            </button>

            {/* Switch to Login Link */}
            <div className="text-center pt-1.5 text-xs text-slate-500">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="font-bold text-[#006A4E] dark:text-cyan-400 hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ইমেইল বা মোবাইল নম্বর
              </label>
              <input
                type="text"
                required
                placeholder="yourname@gmail.com বা 017..."
                value={loginEmailOrPhone}
                onChange={e => setLoginEmailOrPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl liquid-glass-input text-slate-900 dark:text-white text-sm placeholder:text-slate-400 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  পাসওয়ার্ড
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMsg(''); setResetSuccess(false); }}
                  className="text-xs font-medium text-[#006A4E] dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl liquid-glass-input text-slate-900 dark:text-white text-sm placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#006A4E] focus:ring-[#006A4E] accent-[#006A4E] cursor-pointer"
                />
                <span>পাসওয়ার্ড মনে রাখুন</span>
              </label>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              className="w-full h-11 liquid-glass-btn-primary text-white font-semibold text-sm rounded-xl shadow-xs transition active:scale-[0.99] cursor-pointer"
            >
              লগইন করুন
            </button>

            {/* Switch to Signup Link */}
            <div className="text-center pt-1.5 text-xs text-slate-500">
              নতুন অ্যাকাউন্ট করতে চান?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className="font-bold text-[#006A4E] hover:underline cursor-pointer"
              >
                সাইনআপ করুন
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
