import re
import os

# --- 1. Fix AdminPanel.tsx ---
print("[*] Updating AdminPanel.tsx...")
with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    ap = f.read()

# A. Add lg:hidden to Mobile Secondary Sub-Tabs Row
old_mobile_subtabs = """          {/* Mobile Secondary Sub-Tabs Row (Only when module !== 'dashboard') */}
          {activeMainModule !== 'dashboard' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none bg-slate-900/90 p-1 rounded-lg border border-slate-800">"""

new_mobile_subtabs = """          {/* Mobile Secondary Sub-Tabs Row (Only for mobile/tablet screens: lg:hidden) */}
          {activeMainModule !== 'dashboard' && (
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none bg-slate-900/90 p-1 rounded-lg border border-slate-800">"""

if old_mobile_subtabs in ap:
    ap = ap.replace(old_mobile_subtabs, new_mobile_subtabs, 1)
    print("  [✓] Added lg:hidden to mobile subtabs row")
else:
    print("  [!] old_mobile_subtabs not found")

# B. Add 'সকল ইউজার' to mobile currentSubTabs for users module
old_mobile_users_sub = """                } else if (activeMainModule === 'users') {
                  const pendingCount = users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending').length;
                  currentSubTabs = [
                    { id: 'users_teacher_seller', label: 'টিচার ও সেলার' },"""

new_mobile_users_sub = """                } else if (activeMainModule === 'users') {
                  const pendingCount = users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending').length;
                  currentSubTabs = [
                    { id: 'users', label: 'সকল ইউজার', badge: users.length },
                    { id: 'users_teacher_seller', label: 'টিচার ও সেলার' },"""

if old_mobile_users_sub in ap:
    ap = ap.replace(old_mobile_users_sub, new_mobile_users_sub, 1)
    print("  [✓] Added 'সকল ইউজার' to mobile users subtabs")
else:
    print("  [!] old_mobile_users_sub not found")

# C. Add 'সকল ইউজার' to desktop subTabs for users module
old_desktop_users_sub = """              } else if (activeMainModule === 'users') {
                const pendingCount = users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending').length;
                categoryTitle = '👥 ইউজার হাব:';
                categoryColor = 'text-sky-400';
                subTabs = [
                  { id: 'users_teacher_seller', label: 'টিচার ও সেলার', icon: GraduationCap },"""

new_desktop_users_sub = """              } else if (activeMainModule === 'users') {
                const pendingCount = users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending').length;
                categoryTitle = '👥 ইউজার হাব:';
                categoryColor = 'text-sky-400';
                subTabs = [
                  { id: 'users', label: 'সকল ইউজার', icon: Users, badge: users.length },
                  { id: 'users_teacher_seller', label: 'টিচার ও সেলার', icon: GraduationCap },"""

if old_desktop_users_sub in ap:
    ap = ap.replace(old_desktop_users_sub, new_desktop_users_sub, 1)
    print("  [✓] Added 'সকল ইউজার' to desktop users subTabs")
else:
    print("  [!] old_desktop_users_sub not found")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(ap)


# --- 2. Fix UserManagementHub.tsx ---
print("[*] Updating UserManagementHub.tsx...")
with open('src/components/admin/UserManagementHub.tsx', 'r', encoding='utf-8') as f:
    umh = f.read()

# Remove the redundant INTERACTIVE CATEGORY TABS block
# Let's locate from {/* INTERACTIVE CATEGORY TABS */} down to {/* SEARCH, STATUS FILTER & TOOLBAR */}
cat_tabs_pattern = r'\{\/\* INTERACTIVE CATEGORY TABS \*\/\}[\s\S]*?\{\/\* SEARCH, STATUS FILTER & TOOLBAR \*\/\}\n\s*<div className="bg-slate-900 border border-slate-800'
replacement_search = '{/* SEARCH, STATUS FILTER & TOOLBAR */}\n      <div className="bg-slate-900 border border-slate-800'

if re.search(cat_tabs_pattern, umh):
    umh = re.sub(cat_tabs_pattern, replacement_search, umh, count=1)
    print("  [✓] Removed duplicate category tabs inside UserManagementHub")
else:
    print("  [!] INTERACTIVE CATEGORY TABS pattern not found")

with open('src/components/admin/UserManagementHub.tsx', 'w', encoding='utf-8') as f:
    f.write(umh)


# --- 3. Fix DataContext.tsx default orders & marketplaceOrders ---
print("[*] Updating DataContext.tsx...")
with open('src/context/DataContext.tsx', 'r', encoding='utf-8') as f:
    dc = f.read()

# A. Empty default orders
old_orders_init = """  const [orders, setOrders] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : [
      {
        id: "ord-101",
        userId: "student-1",
        userName: "সাব্বির রহমান",
        userEmail: "student@ptenit.com",
        userMobile: "01812345678",
        courseId: "course-canva",
        courseTitle: "Canva Design & Freelancing Masterclass",
        amount: 850,
        paymentMethod: "bKash",
        transactionId: "BK9X82M1A7",
        senderPhone: "01812345678",
        status: "Paid",
        createdAt: "2026-02-05 14:30"
      }
    ];
  });"""

new_orders_init = """  const [orders, setOrders] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(o => o.id !== 'ord-101');
      } catch {}
    }
    return [];
  });"""

if old_orders_init in dc:
    dc = dc.replace(old_orders_init, new_orders_init, 1)
    print("  [✓] Cleaned default dummy orders from DataContext")
else:
    print("  [!] old_orders_init not found")

# B. Empty default marketplaceOrders (remove ord-mkt-4 injection)
old_mkt_init = """  const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>(() => {
    let initialList = initialMarketplaceOrders;
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketplace_orders`);
    if (saved) {
      try {
        const parsed: MarketplaceOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPendingApproval = parsed.some(o => o.status === 'pending_approval');
          if (!hasPendingApproval) {
            const demoOrd = initialMarketplaceOrders.find(o => o.id === 'ord-mkt-4');
            if (demoOrd) {
              const without4 = parsed.filter(o => o.id !== 'ord-mkt-4');
              initialList = [demoOrd, ...without4];
            } else {
              initialList = parsed;
            }
          } else {
            initialList = parsed;
          }
        }
      } catch {}
    }
    const { updatedOrders } = checkAndAutoCancelOverdueOrders(initialList);
    return updatedOrders;
  });"""

new_mkt_init = """  const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketplace_orders`);
    if (saved) {
      try {
        const parsed: MarketplaceOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(o => o.id !== 'ord-mkt-4' && o.id !== 'ord-ptenit-1789742851626');
          return checkAndAutoCancelOverdueOrders(cleaned).updatedOrders;
        }
      } catch {}
    }
    return [];
  });"""

if old_mkt_init in dc:
    dc = dc.replace(old_mkt_init, new_mkt_init, 1)
    print("  [✓] Cleaned default dummy marketplaceOrders from DataContext")
else:
    print("  [!] old_mkt_init not found")

with open('src/context/DataContext.tsx', 'w', encoding='utf-8') as f:
    f.write(dc)


# --- 4. Fix CustomerDashboard.tsx filtering ---
print("[*] Updating CustomerDashboard.tsx...")
with open('src/components/CustomerDashboard.tsx', 'r', encoding='utf-8') as f:
    cd = f.read()

old_cd_filter = """  const myProjects = customerProjects;
  const myMessages = contactMessages;"""

new_cd_filter = """  const myProjects = useMemo(() => {
    if (!currentUser) return [];
    return customerProjects.filter(p => 
      p.customerId === currentUser.id ||
      (currentUser.email && p.customerEmail && p.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && p.customerPhone && p.customerPhone.trim() === currentUser.mobile.trim())
    );
  }, [customerProjects, currentUser]);

  const myMessages = useMemo(() => {
    if (!currentUser) return [];
    return contactMessages.filter(m => 
      (m as any).userId === currentUser.id ||
      (currentUser.email && m.email && m.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && m.phone && m.phone.trim() === currentUser.mobile.trim())
    );
  }, [contactMessages, currentUser]);"""

if old_cd_filter in cd:
    cd = cd.replace(old_cd_filter, new_cd_filter, 1)
    print("  [✓] Filtered myProjects and myMessages by logged-in user in CustomerDashboard")
else:
    print("  [!] old_cd_filter not found")

with open('src/components/CustomerDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(cd)


# --- 5. Fix MarketplaceSection.tsx buyer orders isolation ---
print("[*] Updating MarketplaceSection.tsx...")
with open('src/components/MarketplaceSection.tsx', 'r', encoding='utf-8') as f:
    ms = f.read()

# Fix buyerProjectOrders & buyerDigitalOrders to ONLY return current user's orders
old_orders_hook = """  const buyerDigitalOrders = useMemo(() => {
    return (allBuyerOrders || []).filter(o => 
      o.type === 'digital_product_order' || 
      Boolean(o.digitalProductId) || 
      Boolean(o.id?.startsWith('DIGI-')) ||
      Boolean(o.deliveryType) ||
      o.category?.toLowerCase().includes('canva') ||
      o.category?.toLowerCase().includes('source code') ||
      o.category?.toLowerCase().includes('script')
    );
  }, [allBuyerOrders]);

  const buyerProjectOrders = useMemo(() => {
    return (allBuyerOrders || []).filter(o => 
      o.type !== 'digital_product_order' && 
      !o.digitalProductId && 
      !o.id?.startsWith('DIGI-') &&
      !o.deliveryType
    );
  }, [allBuyerOrders]);"""

new_orders_hook = """  const isMyBuyerOrder = useCallback((o: MarketplaceOrder) => {
    if (currentUser) {
      if (o.buyerId && (o.buyerId === currentUser.id || o.buyerId === 'buyer-self')) return true;
      if ((o as any).customerId && ((o as any).customerId === currentUser.id || (o as any).customerId === 'buyer-self')) return true;
      if (currentUser.email && o.buyerEmail && o.buyerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
      if (currentUser.name && o.buyerName && o.buyerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return true;
      if (currentUser.mobile && (o as any).buyerPhone && (o as any).buyerPhone.trim() === currentUser.mobile.trim()) return true;
      if (myCreatedPostIds.includes(o.id)) return true;
      return false;
    }
    return myCreatedPostIds.includes(o.id) || o.buyerId === 'buyer-self';
  }, [currentUser, myCreatedPostIds]);

  const buyerDigitalOrders = useMemo(() => {
    return (allBuyerOrders || [])
      .filter(isMyBuyerOrder)
      .filter(o => 
        o.type === 'digital_product_order' || 
        Boolean(o.digitalProductId) || 
        Boolean(o.id?.startsWith('DIGI-')) ||
        Boolean(o.deliveryType) ||
        o.category?.toLowerCase().includes('canva') ||
        o.category?.toLowerCase().includes('source code') ||
        o.category?.toLowerCase().includes('script')
      );
  }, [allBuyerOrders, isMyBuyerOrder]);

  const buyerProjectOrders = useMemo(() => {
    return (allBuyerOrders || [])
      .filter(isMyBuyerOrder)
      .filter(o => 
        o.type !== 'digital_product_order' && 
        !o.digitalProductId && 
        !o.id?.startsWith('DIGI-') &&
        !o.deliveryType
      );
  }, [allBuyerOrders, isMyBuyerOrder]);"""

if old_orders_hook in ms:
    ms = ms.replace(old_orders_hook, new_orders_hook, 1)
    print("  [✓] Strictly isolated buyerProjectOrders & buyerDigitalOrders to logged-in user")
else:
    print("  [!] old_orders_hook not found")

# Fix line 10970: orders={buyerProjectOrders.length > 0 ? buyerProjectOrders : (marketplaceOrders || [])}
old_buyer_center = """orders={buyerProjectOrders.length > 0 ? buyerProjectOrders : (marketplaceOrders || [])}"""
new_buyer_center = """orders={buyerProjectOrders}"""
if old_buyer_center in ms:
    ms = ms.replace(old_buyer_center, new_buyer_center, 1)
    print("  [✓] Removed fallback to all marketplaceOrders in MarketplaceCenterBuyerOrders")
else:
    print("  [!] old_buyer_center not found")

# Fix fake fallback 16টি in counters
ms = ms.replace(
    'AnimatedOverviewCounter value={`${buyerProjectOrders.length > 0 ? buyerProjectOrders.length : 16}টি`}',
    'AnimatedOverviewCounter value={`${buyerProjectOrders.length}টি`}'
)
print("  [✓] Fixed overview counters to show real count (no fake 16টি)")

with open('src/components/MarketplaceSection.tsx', 'w', encoding='utf-8') as f:
    f.write(ms)

print("\n[🎉 All fixes applied successfully!]")
