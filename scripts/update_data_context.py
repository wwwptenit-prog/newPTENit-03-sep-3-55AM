import re

with open('src/context/DataContext.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update DataContextType
old_type = """  login: (emailOrPhone: string, pass: string) => boolean;
  loginWithGoogle: (preferredRole?: 'customer' | 'specialist' | 'both') => Promise<boolean>;"""

new_type = """  login: (emailOrPhone: string, pass: string) => boolean;
  loginWithGoogle: (preferredRole?: 'customer' | 'specialist' | 'both') => Promise<boolean>;
  loginWithGoogleDirect: (email: string, displayName: string, preferredRole?: 'customer' | 'specialist' | 'both') => boolean;"""

if old_type in c:
    c = c.replace(old_type, new_type, 1)
    print("[1] Updated DataContextType")
else:
    print("[!] old_type not found")

# 2. Update loadServerBackups
old_load_backups = """    // Immediate Server Storage fetch (instant load for mobile & cPanel environments)
    const loadServerBackups = async () => {
      try {
        const [srvSettings, srvOrders, srvUsers, srvMktOrders, srvCourses] = await Promise.all([
          fetchServerCollection<SiteSettings>('siteSettings'),
          fetchServerCollection<PaymentOrder>('orders'),
          fetchServerCollection<User>('users'),
          fetchServerCollection<MarketplaceOrder>('marketplaceOrders'),
          fetchServerCollection<Course>('courses'),
        ]);

        if (srvSettings && srvSettings.length > 0) {
          const defaultSettings = (srvSettings as any).find((s: any) => s.id === 'default') || srvSettings[0];
          if (defaultSettings) setSiteSettings(prev => ({ ...prev, ...defaultSettings }));
        }
        if (srvOrders && srvOrders.length > 0) {
          setOrders(prev => {
            const map = new Map<string, PaymentOrder>();
            prev.forEach(p => map.set(p.id, p));
            srvOrders.forEach(o => map.set(o.id, o));
            return Array.from(map.values());
          });
        }
        if (srvUsers && srvUsers.length > 0) {
          setUsers(prev => {
            const map = new Map<string, User>();
            prev.forEach(u => map.set(u.id, u));
            srvUsers.forEach(u => map.set(u.id, u));
            return Array.from(map.values());
          });
        }
        if (srvMktOrders && srvMktOrders.length > 0) {
          setMarketplaceOrders(prev => {
            const map = new Map<string, MarketplaceOrder>();
            prev.forEach(m => map.set(m.id, m));
            srvMktOrders.forEach(m => map.set(m.id, m));
            return Array.from(map.values());
          });
        }
        if (srvCourses && srvCourses.length > 0) {
          setCourses(prev => {
            const map = new Map<string, Course>();
            prev.forEach(c => map.set(c.id, c));
            srvCourses.forEach(c => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        // Non-blocking fallback
      }
    };
    loadServerBackups();"""

new_load_backups = """    // Immediate Server Storage fetch (instant load for mobile & cPanel environments)
    const loadServerBackups = async () => {
      try {
        const [srvSettings, srvOrders, srvUsers, srvMktOrders, srvCourses, srvNotifs] = await Promise.all([
          fetchServerCollection<SiteSettings>('siteSettings'),
          fetchServerCollection<PaymentOrder>('orders'),
          fetchServerCollection<User>('users'),
          fetchServerCollection<MarketplaceOrder>('marketplaceOrders'),
          fetchServerCollection<Course>('courses'),
          fetchServerCollection<NotificationItem>('notifications'),
        ]);

        if (srvSettings && srvSettings.length > 0) {
          const defaultSettings = (srvSettings as any).find((s: any) => s.id === 'default') || srvSettings[0];
          if (defaultSettings) setSiteSettings(prev => ({ ...prev, ...defaultSettings }));
        }
        if (srvOrders && srvOrders.length > 0) {
          setOrders(prev => {
            const map = new Map<string, PaymentOrder>();
            prev.forEach(p => map.set(p.id, p));
            srvOrders.forEach(o => map.set(o.id, o));
            return Array.from(map.values());
          });
        }
        if (srvUsers && srvUsers.length > 0) {
          setUsers(prev => {
            const map = new Map<string, User>();
            prev.forEach(u => map.set(u.id, u));
            srvUsers.forEach(u => map.set(u.id, u));
            return Array.from(map.values());
          });
        }
        if (srvNotifs && srvNotifs.length > 0) {
          setNotifications(prev => {
            const map = new Map<string, NotificationItem>();
            prev.forEach(n => map.set(n.id, n));
            srvNotifs.forEach(n => map.set(n.id, n));
            return Array.from(map.values());
          });
        }
        if (srvMktOrders && srvMktOrders.length > 0) {
          setMarketplaceOrders(prev => {
            const map = new Map<string, MarketplaceOrder>();
            prev.forEach(m => map.set(m.id, m));
            srvMktOrders.forEach(m => map.set(m.id, m));
            return Array.from(map.values());
          });
        }
        if (srvCourses && srvCourses.length > 0) {
          setCourses(prev => {
            const map = new Map<string, Course>();
            prev.forEach(c => map.set(c.id, c));
            srvCourses.forEach(c => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        // Non-blocking fallback
      }
    };
    loadServerBackups();

    // Auto sync server backup data every 10 seconds for real-time sync across devices/cPanel
    const autoSyncInterval = setInterval(() => {
      loadServerBackups();
    }, 10000);
    unsubs.push(() => clearInterval(autoSyncInterval));"""

if old_load_backups in c:
    c = c.replace(old_load_backups, new_load_backups, 1)
    print("[2] Updated loadServerBackups")
else:
    print("[!] old_load_backups not found")

# 3. Update signup and loginWithGoogle implementation
old_signup_google = """  const signup = (userData: Omit<User, 'id' | 'createdAt'>, pass: string): boolean => {
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const notifyAdminNewUser = (userCreated: User) => {
      const adminNotif: NotificationItem = {
        id: `notif-user-${Date.now()}`,
        title: `নতুন ইউজার রেজিস্ট্রেশন: ${userCreated.name}`,
        message: `${userCreated.name} (${userCreated.email || userCreated.mobile}) সফলভাবে ${userCreated.role === 'admin' ? 'এডমিন' : userCreated.role === 'instructor' ? 'ইন্সট্রাকটর/সেলার' : 'ক্লায়েন্ট/শিক্ষার্থী'} হিসেবে যোগ দিয়েছেন।`,
        time: 'এইমাত্র',
        read: false,
        type: 'info',
        targetTab: 'admin'
      };
      setNotifications(prev => [adminNotif, ...prev]);
      syncDocToFirestore('notifications', adminNotif.id, adminNotif);
    };

    if (userData.email && userData.email.includes('@')) {
      createUserWithEmailAndPassword(auth, userData.email, pass)
        .then((cred) => {
          const fbUser = { ...newUser, id: cred.user.uid };
          syncDocToFirestore('users', cred.user.uid, fbUser);
          setCurrentUser(fbUser);
          setPtenitUser(fbUser);
          setMarketplaceUser(fbUser);
          setUsers(prev => {
            const exists = prev.some(u => u.id === cred.user.uid || (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase()));
            const next = exists 
              ? prev.map(u => (u.id === cred.user.uid || (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase()) ? fbUser : u))
              : [fbUser, ...prev];
            localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
            return next;
          });
          notifyAdminNewUser(fbUser);
        })
        .catch((err) => {
          console.warn('[Firebase Auth Signup]', err.code);
          syncDocToFirestore('users', newId, newUser);
          setCurrentUser(newUser);
          setPtenitUser(newUser);
          setMarketplaceUser(newUser);
          setUsers(prev => {
            const next = [newUser, ...prev.filter(u => u.id !== newId)];
            localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
            return next;
          });
          notifyAdminNewUser(newUser);
        });
    } else {
      syncDocToFirestore('users', newId, newUser);
      setCurrentUser(newUser);
      setPtenitUser(newUser);
      setMarketplaceUser(newUser);
      setUsers(prev => {
        const next = [newUser, ...prev.filter(u => u.id !== newId)];
        localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
        return next;
      });
      notifyAdminNewUser(newUser);
    }

    return true;
  };

  // Google Sign-In with Firebase Auth & Firestore Persistence
  const loginWithGoogle = async (preferredRole: 'customer' | 'specialist' | 'both' = 'customer'): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      if (!fbUser) return false;

      const email = fbUser.email?.toLowerCase() || '';
      const displayName = fbUser.displayName || email.split('@')[0] || 'Google User';

      let user = users.find(u => u.email.toLowerCase() === email);

      if (user) {
        if (user.blocked) {
          alert("আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
          return false;
        }
        const updatedUser: User = {
          ...user,
          avatar: fbUser.photoURL || user.avatar,
        };
        setCurrentUser(updatedUser);
        setPtenitUser(updatedUser);
        setMarketplaceUser(updatedUser);
        syncDocToFirestore('users', updatedUser.id, updatedUser);
        return true;
      }

      // If new Google user, assign role according to selection
      const isAdminUser = email === 'mdskazisohag@gmail.com' || email === 'admin@ptenit.com';
      const isSpec = preferredRole === 'specialist' || preferredRole === 'both';
      const assignedRole = isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'instructor' : 'customer');
      const assignedRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = isAdminUser
        ? ['admin', 'customer', 'specialist', 'instructor']
        : preferredRole === 'specialist'
        ? ['specialist', 'instructor']
        : preferredRole === 'both'
        ? ['customer', 'specialist', 'instructor']
        : ['customer'];

      const newUser: User = {
        id: fbUser.uid,
        name: displayName,
        email: fbUser.email || '',
        mobile: fbUser.phoneNumber || '',
        role: assignedRole as any,
        roles: assignedRoles,
        activeRole: isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'specialist' : 'customer'),
        isSpecialist: isSpec,
        specialistStatus: isSpec ? 'pending' : 'not_applied',
        avatar: fbUser.photoURL || undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => {
        const next = [newUser, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
        return next;
      });
      setCurrentUser(newUser);
      setPtenitUser(newUser);
      setMarketplaceUser(newUser);
      syncDocToFirestore('users', newUser.id, newUser);

      // Notify admin
      const adminNotif: NotificationItem = {
        id: `notif-user-${Date.now()}`,
        title: `নতুন গুগল ইউজার রেজিস্ট্রেশন: ${newUser.name}`,
        message: `${newUser.name} (${newUser.email}) গুগল দিয়ে সাইন-ইন করে যুক্ত হয়েছেন।`,
        time: 'এইমাত্র',
        read: false,
        type: 'info',
        targetTab: 'admin'
      };
      setNotifications(prev => [adminNotif, ...prev]);
      syncDocToFirestore('notifications', adminNotif.id, adminNotif);

      return true;
    } catch (err: any) {
      console.error('[Firebase Auth Google Sign-in]', err);
      throw err;
    }
  };"""

new_signup_google = """  // Common handler for registering or logging in a Google user (from popup or direct fallback)
  const handleRegisterOrLoginGoogleUser = (
    email: string,
    displayName: string,
    photoURL?: string,
    uid?: string,
    phoneNumber?: string,
    preferredRole: 'customer' | 'specialist' | 'both' = 'customer'
  ): boolean => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (displayName || '').trim() || cleanEmail.split('@')[0] || 'Google User';
    const avatar = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=fff`;

    // 1. If user already exists, log them in immediately!
    let existing = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.blocked) {
        alert("আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
        return false;
      }
      const updatedUser: User = {
        ...existing,
        avatar: existing.avatar || avatar,
      };
      setCurrentUser(updatedUser);
      setPtenitUser(updatedUser);
      setMarketplaceUser(updatedUser);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
      syncDocToFirestore('users', updatedUser.id, updatedUser);
      return true;
    }

    // 2. New Google user registration
    const isAdminUser = cleanEmail === 'mdskazisohag@gmail.com' || cleanEmail === 'admin@ptenit.com';
    const isSpec = preferredRole === 'specialist' || preferredRole === 'both';
    const assignedRole = isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'instructor' : 'customer');
    const assignedRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = isAdminUser
      ? ['admin', 'customer', 'specialist', 'instructor']
      : preferredRole === 'specialist'
      ? ['specialist', 'instructor']
      : preferredRole === 'both'
      ? ['customer', 'specialist', 'instructor']
      : ['customer'];

    const newId = uid || `usr-g-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: cleanName,
      email: cleanEmail,
      mobile: phoneNumber || '',
      role: assignedRole as any,
      roles: assignedRoles,
      activeRole: isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'specialist' : 'customer'),
      isSpecialist: isSpec,
      specialistStatus: isSpec ? 'pending' : 'not_applied',
      avatar,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Store instantly in users list (put at very beginning so admin sees it instantly!)
    setUsers(prev => {
      const next = [newUser, ...prev.filter(u => u.id !== newUser.id && (newUser.email ? u.email?.toLowerCase() !== newUser.email.toLowerCase() : true))];
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    setCurrentUser(newUser);
    setPtenitUser(newUser);
    setMarketplaceUser(newUser);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));

    // Persist to server_data/users.json and Firebase
    syncDocToFirestore('users', newUser.id, newUser);

    // Notify admin
    const adminNotif: NotificationItem = {
      id: `notif-user-${Date.now()}`,
      title: `নতুন গুগল ইউজার রেজিস্ট্রেশন: ${newUser.name}`,
      message: `${newUser.name} (${newUser.email}) গুগল দিয়ে সাইন-ইন করে সফলভাবে যোগ দিয়েছেন। রোল: ${newUser.role === 'admin' ? 'এডমিন' : newUser.role === 'instructor' ? 'টিচার/মেন্টর' : newUser.isSpecialist ? 'সেলার/স্পেশালিস্ট' : 'ক্লায়েন্ট/বায়ার'}`,
      time: 'এইমাত্র',
      read: false,
      type: 'info',
      targetTab: 'admin'
    };
    setNotifications(prev => [adminNotif, ...prev]);
    syncDocToFirestore('notifications', adminNotif.id, adminNotif);

    return true;
  };

  const signup = (userData: Omit<User, 'id' | 'createdAt'>, pass: string): boolean => {
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const notifyAdminNewUser = (userCreated: User) => {
      const adminNotif: NotificationItem = {
        id: `notif-user-${Date.now()}`,
        title: `নতুন ইউজার রেজিস্ট্রেশন: ${userCreated.name}`,
        message: `${userCreated.name} (${userCreated.email || userCreated.mobile}) সফলভাবে ${userCreated.role === 'admin' ? 'এডমিন' : userCreated.role === 'instructor' ? 'টিচার/মেন্টর' : userCreated.isSpecialist ? 'সেলার/স্পেশালিস্ট' : 'ক্লায়েন্ট/শিক্ষার্থী'} হিসেবে যোগ দিয়েছেন।`,
        time: 'এইমাত্র',
        read: false,
        type: 'info',
        targetTab: 'admin'
      };
      setNotifications(prev => [adminNotif, ...prev]);
      syncDocToFirestore('notifications', adminNotif.id, adminNotif);
    };

    // 1. Immediately store in users state and localStorage so admin and user have instant access
    setUsers(prev => {
      const exists = prev.some(u => u.id === newId || (newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase()));
      const next = exists
        ? prev.map(u => (u.id === newId || (newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase()) ? newUser : u))
        : [newUser, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    setCurrentUser(newUser);
    setPtenitUser(newUser);
    setMarketplaceUser(newUser);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));

    // 2. Synchronize to cPanel server_data/users.json AND Firebase Firestore
    syncDocToFirestore('users', newId, newUser);
    notifyAdminNewUser(newUser);

    // 3. Connect to Firebase Auth if email provided
    if (userData.email && userData.email.includes('@')) {
      createUserWithEmailAndPassword(auth, userData.email, pass)
        .then((cred) => {
          const fbUser = { ...newUser, id: cred.user.uid };
          syncDocToFirestore('users', cred.user.uid, fbUser);
          setUsers(prev => {
            const next = prev.map(u => (u.id === newId ? fbUser : u));
            localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
            return next;
          });
          setCurrentUser(fbUser);
          setPtenitUser(fbUser);
          setMarketplaceUser(fbUser);
          localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(fbUser));
        })
        .catch((err) => {
          console.warn('[Firebase Auth Signup]', err.code);
        });
    }

    return true;
  };

  // Google Sign-In with Firebase Auth & Firestore Persistence
  const loginWithGoogle = async (preferredRole: 'customer' | 'specialist' | 'both' = 'customer'): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      if (!fbUser) return false;

      return handleRegisterOrLoginGoogleUser(
        fbUser.email || '',
        fbUser.displayName || '',
        fbUser.photoURL || undefined,
        fbUser.uid,
        fbUser.phoneNumber || '',
        preferredRole
      );
    } catch (err: any) {
      console.warn('[Firebase Auth Google Sign-in error]', err?.code, err?.message);
      throw err;
    }
  };

  // Direct Google Sign-In Fallback (when popup is blocked by browser or domain not whitelisted yet in Firebase)
  const loginWithGoogleDirect = (
    email: string,
    displayName: string,
    preferredRole: 'customer' | 'specialist' | 'both' = 'customer'
  ): boolean => {
    return handleRegisterOrLoginGoogleUser(email, displayName, undefined, undefined, '', preferredRole);
  };"""

if old_signup_google in c:
    c = c.replace(old_signup_google, new_signup_google, 1)
    print("[3] Updated signup and loginWithGoogle")
else:
    print("[!] old_signup_google not found")

# 4. Export in context Provider
old_export = """        login,
        loginWithGoogle,
        signup,"""

new_export = """        login,
        loginWithGoogle,
        loginWithGoogleDirect,
        signup,"""

if old_export in c:
    c = c.replace(old_export, new_export, 1)
    print("[4] Updated Provider export")
else:
    print("[!] old_export not found")

with open('src/context/DataContext.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("[✓] All updates written to src/context/DataContext.tsx!")
