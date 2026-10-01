import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  Mail,
  Bell,
  Search,
  X,
  CheckCheck,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Info,
  ExternalLink,
  Clock,
  ArrowRight,
  User,
  Filter,
  Trash2,
  Maximize2,
  ShieldCheck,
  MessageSquare,
  Eye
} from 'lucide-react';

interface MarketplaceLastColumnProps {
  children?: React.ReactNode;
  isSellerMode?: boolean;
  onOpenOrder?: (orderId: string) => void;
  onOpenGig?: (gigId: string) => void;
  onNavigateTab?: (tab: string, subTab?: string) => void;
}

interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  badge?: string;
  rating?: number;
  ordersCount?: number;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline: boolean;
  onlineTimeAgo?: string;
  category?: string;
  orderId?: string;
}

export const MarketplaceLastColumn: React.FC<MarketplaceLastColumnProps> = ({
  children,
  isSellerMode = false,
  onOpenOrder,
  onOpenGig,
  onNavigateTab
}) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    activeChatWindows,
    openChatWindow,
    directMessages,
    markDirectMessageRead,
    markConversationRead,
    activeMessengerConversationId,
    setActiveMessengerConversationId,
    unreadMarketplaceMsgCount,
    roleScopedNotifications,
    playAppSound,
    openMessengerInbox,
    closeMessengerInbox,
    readConversationIds,
    rightColumnView,
    setRightColumnView
  } = useData();

  // Search & Filter State
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'sellers' | 'orders'>('all');
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'orders' | 'system'>('all');

  // Build conversations strictly from real active chat windows and directMessages for currentUser (No default/mock fake chats)
  const mergedConversations: ConversationItem[] = useMemo(() => {
    if (!currentUser) return [];
    const map = new Map<string, ConversationItem>();

    // 1. Convert active chat windows to conversations
    (activeChatWindows || []).forEach(w => {
      const isRead = readConversationIds && readConversationIds.includes(w.id);
      map.set(w.id, {
        id: w.id,
        name: w.senderName,
        avatar: w.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: w.senderRole || (isSellerMode ? 'বায়ার • প্রজেক্ট ক্লায়েন্ট' : 'সেলার • ভেরিফাইড প্রফেশনাল'),
        badge: isSellerMode ? 'Buyer' : 'Verified Seller',
        rating: 5.0,
        ordersCount: 1,
        lastMessage: w.messages[w.messages.length - 1]?.text || 'চ্যাট শুরু হয়েছে...',
        time: w.messages[w.messages.length - 1]?.time || 'এইমাত্র',
        unreadCount: isRead ? 0 : 0,
        isOnline: true,
        category: isSellerMode ? 'orders' : 'sellers'
      });
    });

    // 2. Add real directMessages strictly for currentUser
    if (directMessages && directMessages.length > 0) {
      directMessages.forEach(dm => {
        const isForMe =
          (dm.recipientId && dm.recipientId === currentUser.id) ||
          (dm.senderId && dm.senderId === currentUser.id) ||
          (currentUser.email && dm.recipientEmail && dm.recipientEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
          (currentUser.email && dm.senderEmail && dm.senderEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim());

        if (!isForMe) return;

        const isDmRead = dm.read || (readConversationIds && readConversationIds.includes(dm.id));
        if (map.has(dm.id)) {
          const item = map.get(dm.id)!;
          item.lastMessage = dm.message;
          item.time = dm.time;
          item.unreadCount = isDmRead ? 0 : (dm.unreadCount || 1);
        } else {
          map.set(dm.id, {
            id: dm.id,
            name: dm.senderName || 'ইউজার',
            avatar: dm.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            role: dm.senderRole || (isSellerMode ? 'বায়ার' : 'সেলার'),
            badge: isSellerMode ? 'Buyer' : 'Seller',
            lastMessage: dm.message,
            time: dm.time || 'এইমাত্র',
            unreadCount: isDmRead ? 0 : (dm.unreadCount || 1),
            isOnline: true,
            category: dm.category || (isSellerMode ? 'orders' : 'sellers'),
            orderId: dm.orderId
          });
        }
      });
    }

    return Array.from(map.values());
  }, [activeChatWindows, directMessages, readConversationIds, isSellerMode, currentUser]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return mergedConversations.filter(convo => {
      const matchesSearch =
        !msgSearchQuery.trim() ||
        convo.name.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
        convo.role.toLowerCase().includes(msgSearchQuery.toLowerCase()) ||
        convo.lastMessage.toLowerCase().includes(msgSearchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (msgFilter === 'unread') return (convo.unreadCount || 0) > 0;
      if (msgFilter === 'orders') return convo.category === 'orders' || !!convo.orderId;
      if (msgFilter === 'sellers') return convo.category === 'sellers';
      return true;
    });
  }, [mergedConversations, msgSearchQuery, msgFilter]);

  // Notifications strictly scoped to currentUser and isSellerMode
  const effectiveNotifications = useMemo(() => {
    if (!currentUser) return [];
    const list = roleScopedNotifications || notifications || [];
    return list.filter(n => {
      // Exclude admin alerts from non-admins
      if ((n.recipientRole === 'admin' || n.targetTab === 'admin' || n.recipientId === 'admin') && currentUser.role !== 'admin') {
        return false;
      }
      // Scoped to this user
      if (currentUser.role !== 'admin') {
        const matchesId = Boolean(n.recipientId && (n.recipientId === currentUser.id || (n.recipientId === 'all' && n.isBroadcast)));
        const matchesEmail = Boolean(currentUser.email && n.recipientEmail && n.recipientEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim());
        const isOfficialBroadcast = Boolean(n.isBroadcast && n.recipientId === 'broadcast');
        if (!matchesId && !matchesEmail && !isOfficialBroadcast) return false;
      }

      if (n.mode === 'selling') return isSellerMode;
      if (n.mode === 'buying') return !isSellerMode;
      if (n.recipientRole) {
        if (n.recipientRole === 'all') return true;
        return isSellerMode ? n.recipientRole === 'seller' : n.recipientRole === 'buyer';
      }
      const cat = (n.category || '').toLowerCase();
      const title = (n.title || '').toLowerCase();
      const isSellerSpecific = cat === 'seller' || cat === 'payout' || title.includes('সেলার') || title.includes('উইথড্র') || title.includes('ক্লাইন্ট') || title.includes('ক্লায়েন্ট');
      const isBuyerSpecific = cat === 'buyer' || cat === 'course' || title.includes('বায়ার') || title.includes('কোর্স') || title.includes('অ্যাসাইনমেন্ট');
      if (isSellerMode) {
        if (isBuyerSpecific && !isSellerSpecific) return false;
        return true;
      } else {
        if (isSellerSpecific && !isBuyerSpecific) return false;
        return true;
      }
    });
  }, [roleScopedNotifications, notifications, isSellerMode, currentUser]);

  const unreadNotifCount = effectiveNotifications.filter(n => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return effectiveNotifications.filter(n => {
      if (notifFilter === 'unread') return !n.read;
      if (notifFilter === 'orders') {
        const titleLower = (n.title || '').toLowerCase();
        const msgLower = (n.message || '').toLowerCase();
        return n.category === 'payout' || titleLower.includes('অর্ডার') || titleLower.includes('order') || msgLower.includes('অর্ডার');
      }
      if (notifFilter === 'system') {
        return (n.category as any) === 'system' || (n.category as any) === 'enrollment';
      }
      return true;
    });
  }, [effectiveNotifications, notifFilter]);

  // Handler for clicking a conversation: "লাস্ট কলামে লিষ্ট সু করবে, তারপর ক্লিক করলে ওপেন হবে"
  const handleOpenConversation = (item: ConversationItem) => {
    // 1. Mark as read immediately to decrease badge count
    if (markDirectMessageRead) markDirectMessageRead(item.id);
    if (markConversationRead) markConversationRead(item.id);
    if (item.orderId && markConversationRead) markConversationRead(item.orderId);

    // Also mark any directMessages matching senderName as read
    if (directMessages) {
      directMessages.forEach(dm => {
        if (
          dm.id === item.id ||
          dm.senderId === item.id ||
          (dm.senderName && item.name && (item.name.includes(dm.senderName) || dm.senderName.includes(item.name)))
        ) {
          if (markDirectMessageRead) markDirectMessageRead(dm.id);
          if (markConversationRead) markConversationRead(dm.id);
        }
      });
    }

    if (setActiveMessengerConversationId) setActiveMessengerConversationId(item.id);
    if (playAppSound) playAppSound('message');

    // 2. Close full-screen modal if open so bottom-right floating window is prominent
    if (closeMessengerInbox) closeMessengerInbox();

    // 3. Open chat window in bottom-right corner (Facebook style)
    if (openChatWindow) {
      openChatWindow({
        id: item.id,
        orderId: item.orderId,
        senderName: item.name,
        senderRole: item.role,
        senderAvatar: item.avatar,
        initialMessage: item.lastMessage
      });
    }
  };

  // Handler for clicking a notification: "লাস্ট কলামে লিষ্ট সু করবে, তারপর ক্লিক করলে ওপেন হবে"
  const handleOpenNotification = (notif: any) => {
    if (markNotificationRead) markNotificationRead(notif.id);
    if (playAppSound) playAppSound('notification');

    const titleLower = (notif.title || '').toLowerCase();
    const msgLower = (notif.message || '').toLowerCase();

    // 1. Message notification -> open chat window
    if (notif.targetTab === 'messenger' || notif.category === 'message' || notif.targetId?.startsWith('chat-')) {
      if (openChatWindow) {
        openChatWindow({
          id: notif.targetId || 'chat-piten-support',
          senderName: notif.title || 'Support',
          senderAvatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80',
          initialMessage: notif.message
        });
      }
      return;
    }

    // 2. Order notification -> open order in 2nd column
    if (
      notif.targetTab === 'marketplace' ||
      notif.category === 'payout' ||
      titleLower.includes('অর্ডার') ||
      msgLower.includes('অর্ডার') ||
      titleLower.includes('পেমেন্ট') ||
      msgLower.includes('পেমেন্ট') ||
      titleLower.includes('এস্ক্রো') ||
      notif.targetId?.includes('ORD') ||
      notif.targetId?.includes('PT-') ||
      notif.targetId?.includes('ord-')
    ) {
      if (onOpenOrder) {
        onOpenOrder(notif.targetId || '');
      } else if (onNavigateTab) {
        onNavigateTab('marketplace', isSellerMode ? 'orders' : 'my-orders');
      }
      return;
    }

    // 3. Gig notification -> open gig details in 2nd column
    if (
      notif.targetId &&
      (notif.targetId.startsWith('gig-') || notif.targetId.startsWith('srv-') || titleLower.includes('গিগ') || msgLower.includes('গিগ'))
    ) {
      if (onOpenGig) {
        onOpenGig(notif.targetId);
        return;
      }
    }

    // 4. Course notification -> show courses in 2nd column
    if (notif.targetTab === 'courses' || notif.category === 'enrollment' || titleLower.includes('কোর্স') || msgLower.includes('কোর্স')) {
      if (onNavigateTab) {
        onNavigateTab('marketplace', 'courses');
      }
      return;
    }

    // 5. Default -> show target subtab in 2nd column
    if (onNavigateTab) {
      onNavigateTab('marketplace', notif.targetTab || (isSellerMode ? 'orders' : 'my-orders'));
    }
  };

  // If rightColumnView is 'default', render the original widgets!
  if (rightColumnView === 'default') {
    return <>{children}</>;
  }

  // =========================================================================
  // 1. MESSAGES LIST VIEW (IN PC LAST COLUMN)
  // =========================================================================
  if (rightColumnView === 'messages') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col font-bengali transition-all duration-200">
        {/* Dedicated Message Inbox Header */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#006A4E]/15 text-[#006A4E] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">মেসেজ ইনবক্স</h4>
                  {unreadMarketplaceMsgCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {unreadMarketplaceMsgCount}টি নতুন
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">সেলার ও বায়ারদের মেসেজ তালিকা</p>
              </div>
            </div>

            {/* Close Button to return to default widgets */}
            <button
              type="button"
              onClick={() => setRightColumnView('default')}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="বন্ধ করুন (Close)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={msgSearchQuery}
              onChange={(e) => setMsgSearchQuery(e.target.value)}
              placeholder="নাম বা মেসেজ খুঁজুন..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006A4E]"
            />
            {msgSearchQuery && (
              <button
                type="button"
                onClick={() => setMsgSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            <button
              type="button"
              onClick={() => setMsgFilter('all')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                msgFilter === 'all'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              সব ({mergedConversations.length})
            </button>
            <button
              type="button"
              onClick={() => setMsgFilter('unread')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                msgFilter === 'unread'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              আনরিড
            </button>
            <button
              type="button"
              onClick={() => setMsgFilter('orders')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                msgFilter === 'orders'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              অর্ডার চ্যাট
            </button>
            <button
              type="button"
              onClick={() => setMsgFilter('sellers')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                msgFilter === 'sellers'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {isSellerMode ? 'বায়ার' : 'সেলার'}
            </button>
          </div>
        </div>

        {/* Conversation List: "লাস্ট কলামে লিষ্ট সু করবে, তারপর ক্লিক করলে ওপেন হবে" */}
        <div className="max-h-[calc(100vh-270px)] overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-3 text-slate-400 dark:text-slate-500 text-xs">
              <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p>কোনো মেসেজ বা কনভার্সেশন পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isChatOpen = activeChatWindows.some(w => w.id === item.id);
              const isSelected = activeMessengerConversationId === item.id;
              const hasUnread = (item.unreadCount || 0) > 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenConversation(item)}
                  className={`pt-1.5 first:pt-0 pb-1.5 px-2 rounded-xl transition cursor-pointer group flex items-start gap-2.5 ${
                    isSelected || isChatOpen
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 ring-1 ring-[#006A4E]/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                  title="চ্যাট ওপেন করতে ক্লিক করুন"
                >
                  {/* Avatar with online pulse */}
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    {item.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold truncate ${hasUnread ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {item.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.role}
                    </p>

                    <p className={`text-[11px] truncate mt-0.5 ${
                      hasUnread
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.lastMessage}
                    </p>

                    {/* Status row */}
                    <div className="flex items-center justify-between mt-1">
                      {isChatOpen ? (
                        <span className="text-[9px] font-bold text-[#006A4E] dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] dark:bg-emerald-400 animate-pulse" />
                          খোলা আছে
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 group-hover:text-[#006A4E] transition flex items-center gap-0.5">
                          ওপেন করতে ক্লিক করুন <ArrowRight className="w-2.5 h-2.5 inline" />
                        </span>
                      )}

                      {hasUnread && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                          {item.unreadCount}টি নতুন
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006A4E]" />
            এসক্রো সুরক্ষিত মেসেঞ্জার
          </span>
          <button
            type="button"
            onClick={() => setRightColumnView('default')}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold hover:underline cursor-pointer"
          >
            বন্ধ করুন ✕
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. NOTIFICATIONS LIST VIEW (IN PC LAST COLUMN)
  // =========================================================================
  if (rightColumnView === 'notifications') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col font-bengali transition-all duration-200">
        {/* Dedicated Notification Header */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">নোটিফিকেশন</h4>
                  {unreadNotifCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {unreadNotifCount}টি নতুন
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">অর্ডার ও সিস্টেম আপডেট তালিকা</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotifCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-bold text-[#006A4E] dark:text-emerald-400 hover:underline px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                  title="সবগুলো পড়া হিসেবে চিহ্নিত করুন"
                >
                  সব পড়া ✓
                </button>
              )}
              {/* Close Button to return to default widgets */}
              <button
                type="button"
                onClick={() => setRightColumnView('default')}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="বন্ধ করুন (Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            <button
              type="button"
              onClick={() => setNotifFilter('all')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                notifFilter === 'all'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              সব ({effectiveNotifications.length})
            </button>
            <button
              type="button"
              onClick={() => setNotifFilter('unread')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                notifFilter === 'unread'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              নতুন ({unreadNotifCount})
            </button>
            <button
              type="button"
              onClick={() => setNotifFilter('orders')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                notifFilter === 'orders'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              অর্ডার
            </button>
            <button
              type="button"
              onClick={() => setNotifFilter('system')}
              className={`px-2 py-0.5 rounded-full font-bold transition cursor-pointer whitespace-nowrap ${
                notifFilter === 'system'
                  ? 'bg-[#006A4E] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              সিস্টেম
            </button>
          </div>
        </div>

        {/* Notifications List: "লাস্ট কলামে লিষ্ট সু করবে, তারপর ক্লিক করলে ওপেন হবে" */}
        <div className="max-h-[calc(100vh-270px)] overflow-y-auto p-2 space-y-1.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 px-3 text-slate-400 dark:text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p>কোনো নোটিফিকেশন নেই</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUnread = !notif.read;

              // Notification Category Icon & Colors
              let IconComponent = Bell;
              let iconColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/30';

              if (notif.category === 'payout' || notif.title?.includes('অর্ডার') || notif.title?.includes('পেমেন্ট')) {
                IconComponent = ShoppingBag;
                iconColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30';
              } else if (notif.category === 'message' || notif.targetTab === 'messenger') {
                IconComponent = Mail;
                iconColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30';
              } else if (notif.category === 'system') {
                IconComponent = Sparkles;
                iconColor = 'text-purple-500 bg-purple-50 dark:bg-purple-950/30';
              } else if ((notif.category as any) === 'enrollment') {
                IconComponent = CheckCircle2;
                iconColor = 'text-sky-500 bg-sky-50 dark:bg-sky-950/30';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleOpenNotification(notif)}
                  className={`p-3 rounded-xl transition cursor-pointer group border flex items-start gap-2.5 relative ${
                    isUnread
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-[#006A4E]/30 shadow-2xs'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  title="২য় কলামে দেখতে ক্লিক করুন"
                >
                  {/* Category Icon */}
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${iconColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className={`text-xs leading-snug line-clamp-1 ${
                        isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'
                      }`}>
                        {notif.title}
                      </h5>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#006A4E] shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {notif.time || 'কিছুক্ষণ আগে'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {deleteNotification && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNotification(notif);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#006A4E] hover:bg-[#00543e] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer"
                          title="২য় কলামে দেখুন"
                        >
                          <Eye className="w-3 h-3 text-white" />
                          <span>দেখুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 dark:text-slate-400">
            রিয়েল-টাইম নোটিফিকেশন সেন্টার
          </span>
          <button
            type="button"
            onClick={() => setRightColumnView('default')}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold hover:underline cursor-pointer"
          >
            বন্ধ করুন ✕
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
