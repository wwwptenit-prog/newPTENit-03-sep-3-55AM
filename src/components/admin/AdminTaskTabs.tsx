import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Bot,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  BookOpen,
  Settings,
  Plus,
  X,
  Maximize2,
  Search,
  Sparkles,
  Zap,
  Percent,
  Layers,
  GraduationCap
} from 'lucide-react';

export interface TaskTabItem {
  id: string;
  label: string;
  iconName?: string;
  badge?: number;
  closable?: boolean;
}

interface AdminTaskTabsProps {
  openTabs: TaskTabItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onLaunchTask: (tabId: string) => void;
  onOpenCommandPalette: () => void;
}

export const AVAILABLE_TASKS: { id: string; label: string; desc: string; category: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'ড্যাশবোর্ড ওভারভিউ', desc: 'সার্বিক প্ল্যাটফর্ম রেভিনিউ, অ্যানালিটিক্স ও মেট্রিক্স', category: 'কোর', icon: LayoutDashboard },
  { id: 'users_teacher_seller', label: 'ইউজার ডিরেক্টরি ও কমপ্লেইন', desc: 'টিচার, সেলার, শিক্ষার্থী, বায়ার মনিটরিং ও রেস্ট্রিক্ট', category: 'ইউজার', icon: Users },
  { id: 'ai_core', label: 'ফাইন্যান্সিয়াল ও বিলিং কোর', desc: 'সকল পেমেন্ট সংক্রান্ত কাজ, বিল ভাউচার, পেআউট অনুরোধ ও অডিট হিসাব', category: 'ফাইন্যান্স', icon: CreditCard },
  { id: 'sub_admins', label: 'সাব-এডমিন রোল ও এক্সেস (RBAC)', desc: 'পদবীভিত্তিক ডিপার্টমেন্ট ম্যানেজার ও পারমিশন কন্ট্রোল', category: 'টিম', icon: ShieldCheck },
  { id: 'billing_verify', label: 'বিল জমা ও পেমেন্ট ভেরিফাই', desc: 'বিকাশ, নগদ, রকেট ও ব্যাংক পেমেন্ট অনুমোদন', category: 'পেমেন্ট', icon: CreditCard },
  { id: 'gigs_manage', label: 'মার্কেটপ্লেস গিগ ম্যানেজমেন্ট', desc: 'সার্ভিস গিগ অডিট, অনুমোদন ও প্রাইজ কন্ট্রোল', category: 'মার্কেটপ্লেস', icon: ShoppingBag },
  { id: 'courses', label: 'একাডেমি কোর্স কনসোল', desc: 'কোর্স কারিকুলাম, ভিডিও লেসন ও প্রাইসিং', category: 'একাডেমি', icon: BookOpen },
  { id: 'teachers', label: 'টিচার্স ও ইনস্ট্রাক্টর টিম', desc: 'সম্মানী হিসেব, পেআউট রিকোয়েস্ট ও ক্লাস মনিটরিং', category: 'একাডেমি', icon: GraduationCap },
  { id: 'users_trainees', label: 'প্রশিক্ষণার্থী ও শিক্ষার্থী তালিকা', desc: 'শিক্ষার্থী রেজিস্ট্রি, প্রোফাইল ও অগ্রগতি', category: 'ইউজার', icon: Users },
  { id: 'digital_products', label: 'ডিজিটাল প্রোডাক্ট স্টোর', desc: 'সফটওয়্যার, টেমপ্লেট ও কোড অ্যাসেট বিক্রি', category: 'মার্কেটপ্লেস', icon: Zap },
  { id: 'fee_commission', label: 'প্ল্যাটফর্ম ফি ও কমিশন', desc: 'মার্কেটপ্লেস ও একাডেমি ট্রানজেকশন ফি শতাংশ', category: 'অর্থ', icon: Percent },
  { id: 'settings', label: 'সিস্টেম কনফিগারেশন', desc: 'পেমেন্ট গেটওয়ে, প্ল্যাটফর্ম ব্র্যান্ডিং ও ব্যাকআপ', category: 'সেটিংস', icon: Settings },
];

export const AdminTaskTabs: React.FC<AdminTaskTabsProps> = ({
  openTabs,
  activeTab,
  onSelectTab,
  onCloseTab,
  onLaunchTask,
  onOpenCommandPalette
}) => {
  const [taskPickerOpen, setTaskPickerOpen] = useState(false);

  // Map icon component
  const getTabIcon = (id: string) => {
    if (id === 'dashboard') return LayoutDashboard;
    if (id.startsWith('users')) return Users;
    if (id === 'ai_core') return CreditCard;
    if (id === 'sub_admins') return ShieldCheck;
    if (id === 'billing_verify') return CreditCard;
    if (id === 'gigs_manage' || id === 'marketplace') return ShoppingBag;
    if (id === 'courses') return BookOpen;
    if (id === 'teachers') return GraduationCap;
    if (id === 'students') return Users;
    if (id === 'digital_products') return Zap;
    if (id === 'fee_commission') return Percent;
    if (id === 'settings') return Settings;
    return Layers;
  };

  return (
    <div className="space-y-2 font-bengali">
      {/* ENTERPRISE WORKSPACE TAB BAR */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 shadow-lg">
        
        {/* Left: Interactive Tabs List */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-slate-400 text-xs shrink-0 font-medium">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>টাস্কস:</span>
          </div>

          {openTabs.map((tab) => {
            const Icon = getTabIcon(tab.id);
            const isActive = activeTab === tab.id;

            return (
              <div
                key={tab.id}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => onSelectTab(tab.id)}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="truncate max-w-[130px] sm:max-w-[180px]">{tab.label}</span>

                {!!tab.badge && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}

                {tab.closable !== false && openTabs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className={`p-0.5 rounded-md hover:bg-black/20 transition ${
                      isActive ? 'text-slate-950 hover:text-black' : 'text-slate-400 hover:text-white'
                    }`}
                    title="টাস্ক বন্ধ করুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add New Working Task Tab Button */}
          <button
            type="button"
            onClick={() => setTaskPickerOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/15 hover:border-amber-400 transition text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            title="নতুন কোনো টাস্ক ওপেন করুন"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">নতুন টাস্ক</span>
          </button>
        </div>

        {/* Right: Quick Command Search */}
        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-slate-600 transition text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs"
            title="কমান্ড ও অ্যাকশন সার্চ (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-slate-400">কমান্ড বা কাজ খুঁজুন...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400 font-bold">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* TASK LAUNCHER POPUP MODAL */}
      {taskPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">নতুন টাস্ক বা মডিউল নির্বাচন করুন</h3>
                  <p className="text-xs text-slate-400 font-normal">দ্রুত প্রয়োজনীয় মডিউলে সুইচ করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTaskPickerOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
              {AVAILABLE_TASKS.map(task => {
                const Icon = task.icon;
                const isAlreadyOpen = openTabs.some(t => t.id === task.id);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      onLaunchTask(task.id);
                      setTaskPickerOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                      isAlreadyOpen
                        ? 'bg-slate-800/40 border-slate-800 hover:border-amber-500/40'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-white truncate">{task.label}</h4>
                        {isAlreadyOpen && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-mono">
                            খোলা আছে
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal mt-0.5 line-clamp-2">{task.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setTaskPickerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
