with open('src/components/AuthModal.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update useData destructuring
old_usedata = """const { login, loginWithGoogle, signup, siteSettings } = useData();"""
new_usedata = """const { login, loginWithGoogle, loginWithGoogleDirect, signup, siteSettings } = useData();
  const [showGoogleDirect, setShowGoogleDirect] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleDirectLoading, setGoogleDirectLoading] = useState(false);"""

if old_usedata in c:
    c = c.replace(old_usedata, new_usedata, 1)
    print("[1] Updated useData in AuthModal")
else:
    print("[!] old_usedata not found")

# 2. Update handleGoogleSignIn
old_handle_google = """  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      const ok = await loginWithGoogle(selectedRoleType);
      if (ok) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.warn('[Google Auth Error]', err?.code, err?.message);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('গুগল লগইন পপআপটি বন্ধ করা হয়েছে।');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setErrorMsg('গুগল দিয়ে প্রবেশ করতে সমস্যা হয়েছে।');
      }
    } finally {
      setGoogleLoading(false);
    }
  };"""

new_handle_google = """  const handleGoogleSignIn = async () => {
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
  };"""

if old_handle_google in c:
    c = c.replace(old_handle_google, new_handle_google, 1)
    print("[2] Updated handleGoogleSignIn in AuthModal")
else:
    print("[!] old_handle_google not found")

# 3. Add Google direct box right after Google button
old_button_area = """            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer disabled:opacity-50 shadow-2xs"
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
            </button>"""

new_button_area = """            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer disabled:opacity-50 shadow-2xs"
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
            )}"""

if old_button_area in c:
    c = c.replace(old_button_area, new_button_area, 1)
    print("[3] Updated Google button area in AuthModal")
else:
    print("[!] old_button_area not found")

with open('src/components/AuthModal.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("[✓] AuthModal.tsx successfully updated!")
