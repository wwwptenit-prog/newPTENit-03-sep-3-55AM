import React, { useState } from 'react';
import { Briefcase, ShieldAlert, ChevronUp, ChevronDown, Sparkles, Check, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface QuickRoleSwitcherProps {
  activeTab?: string;
  setActiveTab: (tab: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, demoLogin } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSwitch = (role: UserRole, targetTab: string) => {
    demoLogin(role as any);
    setActiveTab(targetTab);
  };

  const roleConfigs: {
    role: UserRole;
    targetTab: string;
    label: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    activeBorder: string;
  }[] = [
    {
      role: 'admin',
      targetTab: 'admin',
      label: 'এডমিন প্যানেল',
      subtitle: 'প্ল্যাটফর্ম ও সিস্টেম কন্ট্রোল',
      icon: ShieldAlert,
      color: 'text-slate-800 bg-slate-50 border-slate-200 hover:bg-slate-100',
      activeBorder: 'border-[#E11D48] ring-2 ring-[#E11D48]/30 bg-rose-50/50'
    },
    {
      role: 'customer',
      targetTab: 'customer-dashboard',
      label: 'গ্রাহক ড্যাশবোর্ড',
      subtitle: 'বায়ার ড্যাশবোর্ড ও অর্ডার হাব',
      icon: Briefcase,
      color: 'text-slate-800 bg-slate-50 border-slate-200 hover:bg-slate-100',
      activeBorder: 'border-[#006A4E] ring-2 ring-[#006A4E]/30 bg-emerald-50/50'
    },
    {
      role: 'instructor',
      targetTab: 'teacher-dashboard',
      label: 'স্পেশালিস্ট ড্যাশবোর্ড',
      subtitle: 'সেলার ড্যাশবোর্ড ও সার্ভিস হাব',
      icon: Zap,
      color: 'text-slate-800 bg-slate-50 border-slate-200 hover:bg-slate-100',
      activeBorder: 'border-[#006A4E] ring-2 ring-[#006A4E]/30 bg-emerald-50/50'
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 font-bengali">
      {isOpen && (
        <div className="mb-3 liquid-glass-card rounded-3xl p-4 shadow-2xl text-slate-900 dark:text-white w-72 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-white/60 dark:border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#006A4E] dark:text-cyan-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">ড্যাশবোর্ড সুইচ</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[#006A4E] dark:text-cyan-300 font-bold">
              Full Access
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            যেকোনো ড্যাশবোর্ডে প্রবেশ করতে ক্লিক করুন:
          </p>

          <div className="space-y-2">
            {roleConfigs.map(({ role, targetTab, label, subtitle, icon: Icon, color, activeBorder }) => {
              const isCurrentTab = activeTab === targetTab;
              const isCurrentRole = currentUser?.role === role;
              const isActive = isCurrentTab || (isCurrentRole && !['admin', 'customer-dashboard', 'teacher-dashboard'].includes(activeTab || ''));

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role, targetTab)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer backdrop-blur-md ${
                    isActive ? activeBorder : 'text-slate-800 dark:text-slate-200 bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-white/10 hover:bg-white/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/15 shadow-2xs shrink-0 text-[#006A4E] dark:text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs leading-tight">{label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight mt-0.5">{subtitle}</div>
                    </div>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-0.5 rounded-full font-black shadow-xs shrink-0">
                      <Check className="w-3 h-3" /> এক্টিভ
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 liquid-glass-btn-primary font-bold text-xs rounded-2xl shadow-xl hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>ড্যাশবোর্ড সুইচ</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
