import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  ShoppingBag, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MarketplaceOrder } from '../types';

interface MarketplaceCenterBuyerOrdersProps {
  orders: MarketplaceOrder[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onClearSearch?: () => void;
  onBack: () => void;
  onOpenChat?: (chatData: { id: string; senderName: string; senderAvatar?: string; initialMessage?: string }) => void;
  onViewOrderDetails?: (order: MarketplaceOrder) => void;
  onBrowseGigs?: () => void;
}

export const MarketplaceCenterBuyerOrders: React.FC<MarketplaceCenterBuyerOrdersProps> = ({
  orders,
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  onBack,
  onOpenChat,
  onViewOrderDetails,
  onBrowseGigs
}) => {
  const [statusFilter, setStatusFilter] = useState<'in_progress' | 'in_review' | 'completed'>('in_progress');

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      if (statusFilter === 'in_progress') {
        const isInProgress = order.status === 'in_progress' || order.status === 'active' || order.status === 'pending';
        if (!isInProgress) return false;
      } else if (statusFilter === 'in_review') {
        const isInReview = order.status === 'in_review' || order.status === 'review' || order.status === 'pending_approval' || order.status === 'revision';
        if (!isInReview) return false;
      } else if (statusFilter === 'completed') {
        if (order.status !== 'completed' && order.status !== 'cancelled') return false;
      }
      return true;
    });
  }, [orders, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] dark:bg-emerald-400 animate-pulse" />
            চলমান কাজ
          </span>
        );
      case 'in_review':
      case 'review':
      case 'pending_approval':
      case 'revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            রিভিউ চলছে
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-300 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            সম্পন্ন
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-300 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            বাতিল
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-300 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-bengali animate-fadeIn">
      {/* 1. Clean Header Toolbar (No Card Box, No Search Bar, No Total Count) */}
      <div className="space-y-2.5 pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer active:scale-95 shrink-0"
              title="গিগ ফিডে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#38BDF8] shrink-0" />
              <span>সার্ভিস অর্ডার</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBrowseGigs || onBack}
            className="text-[#38BDF8] hover:text-sky-400 font-black text-xs sm:text-sm flex items-center transition cursor-pointer hover:underline underline-offset-2 shrink-0 whitespace-nowrap"
          >
            <span>নতুন প্রজেক্ট ব্রাউজ →</span>
          </button>
        </div>

        {/* Status Filter Tabs: Strictly 3 (চলমান, রিভিউ, সম্পন্ন) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {[
            {
              id: 'in_progress',
              label: 'চলমান',
              count: orders.filter(o => o.status === 'in_progress' || o.status === 'active' || o.status === 'pending').length,
              activeClass: 'bg-blue-600 text-white shadow-xs font-black',
              inactiveClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50',
              badgeActive: 'bg-black/20 text-white',
              badgeInactive: 'bg-blue-200/70 dark:bg-blue-900 text-blue-900 dark:text-blue-200'
            },
            {
              id: 'in_review',
              label: 'রিভিউ',
              count: orders.filter(o => o.status === 'in_review' || o.status === 'review' || o.status === 'pending_approval' || o.status === 'revision').length,
              activeClass: 'bg-amber-500 text-white shadow-xs font-black',
              inactiveClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50',
              badgeActive: 'bg-black/20 text-white',
              badgeInactive: 'bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
            },
            {
              id: 'completed',
              label: 'সম্পন্ন',
              count: orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length,
              activeClass: 'bg-[#006A4E] text-white shadow-xs font-black',
              inactiveClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
              badgeActive: 'bg-black/20 text-white',
              badgeInactive: 'bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
            }
          ].map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`py-1.5 px-1.5 sm:px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive ? tab.activeClass : tab.inactiveClass
                }`}
              >
                <span className="truncate">{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black min-w-4 text-center leading-none ${
                    isActive ? tab.badgeActive : tab.badgeInactive
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {searchQuery ? 'খুঁজে পাওয়া যায়নি' : 'এই ক্যাটাগরিতে কোনো অর্ডার নেই'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery 
              ? `"${searchQuery}" এর সাথে সম্পর্কিত কোনো অর্ডার পাওয়া যায়নি। ফিল্টার রিসেট করুন।` 
              : 'মার্কেটপ্লেস থেকে বিশেষজ্ঞ সেলারদের প্রিমিয়াম গিগ বা সার্ভিস অর্ডার করুন।'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {searchQuery && onClearSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                সার্চ রিসেট
              </button>
            )}
            <button
              type="button"
              onClick={onBrowseGigs || onBack}
              className="px-4 py-2 bg-[#006A4E] hover:bg-[#00543E] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
            >
              গিগসমূহ ব্রাউজ করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const isTargetMatched = searchQuery && (order.id || '').toLowerCase().includes(searchQuery.toLowerCase().trim());

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition shadow-2xs space-y-3 ${
                  isTargetMatched
                    ? 'border-[#006A4E] ring-2 ring-[#006A4E]/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header row: Order ID, Escrow Badge, Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('bn-BD') : 'সম্প্রতি'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#006A4E] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ৳{(order.totalAmount || order.price || 0).toLocaleString()} এসক্রো
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Gig Title & Package */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {order.gigTitle || order.title || 'মার্কেটপ্লেস সার্ভিস অর্ডার'}
                  </h3>
                  {order.packageName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      প্যাকেজ: <span className="text-slate-700 dark:text-slate-200 font-bold">{order.packageName}</span>
                    </p>
                  )}
                </div>

                {/* Seller info row & Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={order.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={order.sellerName || 'Seller'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {order.sellerName || 'এক্সপার্ট ফ্রিল্যান্সার'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        ভেরিফায়েড সার্ভিস প্রোভাইডার
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenChat && (
                      <button
                        type="button"
                        onClick={() => onOpenChat({
                          id: `chat-${order.sellerId || order.id}`,
                          senderName: order.sellerName || 'Seller Support',
                          senderAvatar: order.sellerAvatar,
                          initialMessage: `হ্যালো, আমার অর্ডার #${order.id} সংক্রান্ত বিষয়ে আপডেট প্রয়োজন।`
                        })}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="সেলারকে মেসেজ দিন"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#006A4E]" />
                        <span>মেসেজ</span>
                      </button>
                    )}
                    {onViewOrderDetails && (
                      <button
                        type="button"
                        onClick={() => onViewOrderDetails(order)}
                        className="px-3 py-1.5 bg-[#006A4E] hover:bg-[#00543E] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                        title="অর্ডার বিস্তারিত ও ওয়ার্কস্পেস"
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        <span>বিস্তারিত</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
