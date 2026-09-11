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
    demoLogin(role);
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
        <div className="mb-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl text-slate-900 w-72 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#006A4E]" />
              <span className="text-xs font-bold text-slate-900">ড্যাশবোর্ড সুইচ</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#006A4E] font-bold">
              Full Access
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
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
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive ? activeBorder : color
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 text-[#006A4E]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs leading-tight">{label}</div>
                      <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">{subtitle}</div>
                    </div>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#006A4E] text-white px-2 py-0.5 rounded-full font-black shadow-2xs shrink-0">
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
        className="flex items-center gap-2 px-4 py-3 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#006A4E]/40"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>ড্যাশবোর্ড সুইচ</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
