import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Command,
  LayoutDashboard,
  Users,
  Bot,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  BookOpen,
  Settings,
  Zap,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Send,
  Download,
  Terminal,
  Activity
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const data = useData() as any;
  const {
    users = [],
    courses = [],
    gigs = [],
    playAppSound,
    sendCentralNotification
  } = data || {};
  const companyBills: any[] = data?.companyBills || [];

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Direct Quick Navigation Commands
  const navCommands = useMemo(() => [
    { id: 'dashboard', title: 'ড্যাশবোর্ড ওভারভিউ', subtitle: 'সার্বিক আয় ও স্ট্যাটস', icon: LayoutDashboard, category: 'নেভিগেশন' },
    { id: 'users_teacher_seller', title: 'ইউজার ডিরেক্টরি ও কমপ্লেইন হাব', subtitle: 'টিচার, সেলার, শিক্ষার্থী ও বায়ার', icon: Users, category: 'নেভিগেশন' },
    { id: 'ai_core', title: 'ফাইন্যান্সিয়াল ও বিলিং কোর (সকল পেমেন্ট ও হিসাব)', subtitle: 'ইনভয়েস, বিল ভাউচার, উত্তোলন অনুরোধ ও ক্যাশ লেজার', icon: CreditCard, category: 'নেভিগেশন' },
    { id: 'sub_admins', title: 'সাব-এডমিন রোল ও পারমিশন (RBAC)', subtitle: 'পদবীভিত্তিক অ্যাক্সেস ও দায়িত্ব বণ্টন', icon: ShieldCheck, category: 'নেভিগেশন' },
    { id: 'billing_verify', title: 'পেমেন্ট ও বিল ভেরিফিকেশন', subtitle: 'বিকাশ/নগদ TrxID অডিট ও অনুমোদন', icon: CreditCard, category: 'নেভিগেশন' },
    { id: 'gigs_manage', title: 'মার্কেটপ্লেস গিগ ম্যানেজমেন্ট', subtitle: 'গিগ অডিট, অনুমোদন ও প্রাইজ রেট', icon: ShoppingBag, category: 'নেভিগেশন' },
    { id: 'courses', title: 'একাডেমি কোর্স কনসোল', subtitle: 'কোর্স কারিকুলাম, ইনস্ট্রাক্টর ও প্রাইস', icon: BookOpen, category: 'নেভিগেশন' },
    { id: 'settings', title: 'প্ল্যাটফর্ম সেটিংস ও গেটওয়ে', subtitle: 'সাইট মেটা, পেমেন্ট নাম্বার ও ব্যাকআপ', icon: Settings, category: 'নেভিগেশন' },
    { id: 'fee_commission', title: 'ফি ও কমিশন কন্ট্রোল', subtitle: 'মার্কেটপ্লেস ও কোর্স ট্রানজেকশন ফি', icon: Percent, category: 'নেভিগেশন' },
  ], []);

  // Filtered Results
  const filteredNavs = useMemo(() => {
    if (!query.trim()) return navCommands;
    const q = query.toLowerCase();
    return navCommands.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));
  }, [navCommands, query]);

  // Filtered Users matching query
  const matchedUsers = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return (users || []).filter((u: any) =>
      u?.name?.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q) ||
      (u?.mobile && u.mobile.includes(q)) ||
      (u?.phone && u.phone.includes(q)) ||
      u?.id?.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [users, query]);

  // Filtered Pending Bills matching query
  const matchedBills = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return (companyBills || []).filter((b: any) =>
      b?.transactionId?.toLowerCase().includes(q) ||
      b?.payerName?.toLowerCase().includes(q) ||
      (b?.payerPhone && b.payerPhone.includes(q))
    ).slice(0, 3);
  }, [companyBills, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-bengali">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কমান্ড, ইউজার, TrxID বা টাস্কের নাম লিখুন (যেমন: AI, বিল, মিজানুর, কোর্স)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-normal"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              ESC
            </span>
          )}
        </div>

        {/* Results Body */}
        <div className="p-3 overflow-y-auto space-y-4 max-h-[60vh]">
          
          {/* Quick Execution Actions (If no query or relevant query) */}
          {(!query || query.toLowerCase().includes('fin') || query.toLowerCase().includes('পেমেন্ট') || query.toLowerCase().includes('বিল')) && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider px-2">
                💳 কুইক ফাইন্যান্সিয়াল অ্যাকশন
              </p>
              <div
                onClick={() => {
                  onNavigate('ai_core');
                  onClose();
                  playAppSound('click');
                }}
                className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between cursor-pointer transition text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">ফাইন্যান্সিয়াল কোর ও পেমেন্ট অডিট হাব খুলুন</span>
                    <span className="text-[11px] text-emerald-300/80 font-normal">বিকাশ, নগদ, ব্যাংক ও ইনভয়েস লেজার হিসাব</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}

          {/* Matched Users Section */}
          {matchedUsers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider px-2">
                👥 ইউজার রেকর্ডস ({matchedUsers.length})
              </p>
              <div className="space-y-1">
                {matchedUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => {
                      onNavigate('users_teacher_seller');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={user.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-600"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{user.email} • {user.mobile || 'No Mobile'}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700 font-mono">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Bills Section */}
          {matchedBills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider px-2">
                💳 পেমেন্ট ও ট্রানজেকশন ({matchedBills.length})
              </p>
              <div className="space-y-1">
                {matchedBills.map(bill => (
                  <div
                    key={bill.id}
                    onClick={() => {
                      onNavigate('billing_verify');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-between cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-white block">Trx: {bill.transactionId}</span>
                        <span className="text-[10px] text-slate-400">{bill.payerName} ({bill.gateway})</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">৳{bill.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Commands */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              🧭 মডিউল ও ওয়ার্কস্পেস
            </p>
            <div className="space-y-1">
              {filteredNavs.map(cmd => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => {
                      onNavigate(cmd.id);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-900 text-amber-400 border border-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{cmd.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{cmd.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">খুলুন ↵</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>ক্লিক করুন বা প্রেস করুন:</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono border border-slate-800">↵ সিলেক্ট</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono border border-slate-800">ESC বন্ধ</span>
          </div>
          <span className="font-bold text-amber-400">PTENit AI Enterprise</span>
        </div>
      </div>
    </div>
  );
};
