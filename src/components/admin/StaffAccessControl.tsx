import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  Unlock,
  Key,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  BookOpen,
  ShoppingBag,
  Sliders,
  Cpu,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Search,
  Check,
  X,
  Eye,
  Activity
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: 'Administration' | 'Operations' | 'Finance' | 'Marketplace' | 'Academy' | 'Support' | 'AI & Security';
  avatar?: string;
  status: 'active' | 'inactive' | 'on_duty';
  joinedDate: string;
  lastActive: string;
  permissions: {
    canManageUsers: boolean;
    canApproveTeachers: boolean;
    canVerifyPayments: boolean;
    canManageCourses: boolean;
    canModerateGigs: boolean;
    canIssueRestrictions: boolean;
    canAccessLedger: boolean;
    canModifySettings: boolean;
    canControlAI: boolean;
  };
  actionsTakenCount: number;
}

const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'কাজী মিজানুর রহমান',
    email: 'mdskazi2016@gmail.com',
    phone: '01886221191',
    designation: 'চিফ এক্সিকিউটিভ / সুপার এডমিন',
    department: 'Administration',
    status: 'on_duty',
    joinedDate: '২০২৪-০১-১০',
    lastActive: 'এখনই সক্রিয়',
    actionsTakenCount: 1480,
    permissions: {
      canManageUsers: true,
      canApproveTeachers: true,
      canVerifyPayments: true,
      canManageCourses: true,
      canModerateGigs: true,
      canIssueRestrictions: true,
      canAccessLedger: true,
      canModifySettings: true,
      canControlAI: true,
    }
  },
  {
    id: 'staff-02',
    name: 'ফারহানা ইয়াসমিন',
    email: 'farhana.ops@ptenit.com',
    phone: '01711223344',
    designation: 'সিনিয়র অপারেশনস ডিরেক্টর',
    department: 'Operations',
    status: 'active',
    joinedDate: '২০২৪-০৩-১৫',
    lastActive: '১০ মিনিট আগে',
    actionsTakenCount: 620,
    permissions: {
      canManageUsers: true,
      canApproveTeachers: true,
      canVerifyPayments: false,
      canManageCourses: true,
      canModerateGigs: true,
      canIssueRestrictions: true,
      canAccessLedger: false,
      canModifySettings: false,
      canControlAI: true,
    }
  },
  {
    id: 'staff-03',
    name: 'শফিকুল ইসলাম চৌধুরী',
    email: 'shafiq.finance@ptenit.com',
    phone: '01912334455',
    designation: 'হেড অব একাউন্টস ও ফাইন্যান্স',
    department: 'Finance',
    status: 'on_duty',
    joinedDate: '২০২৪-০৪-০১',
    lastActive: '২ মিনিট আগে',
    actionsTakenCount: 890,
    permissions: {
      canManageUsers: false,
      canApproveTeachers: false,
      canVerifyPayments: true,
      canManageCourses: false,
      canModerateGigs: false,
      canIssueRestrictions: false,
      canAccessLedger: true,
      canModifySettings: false,
      canControlAI: false,
    }
  },
  {
    id: 'staff-04',
    name: 'তানভীর হাসান',
    email: 'tanvir.market@ptenit.com',
    phone: '01688997766',
    designation: 'মার্কেটপ্লেস লিড মডারেটর',
    department: 'Marketplace',
    status: 'active',
    joinedDate: '২০২৪-০৫-১২',
    lastActive: '২৫ মিনিট আগে',
    actionsTakenCount: 450,
    permissions: {
      canManageUsers: true,
      canApproveTeachers: false,
      canVerifyPayments: false,
      canManageCourses: false,
      canModerateGigs: true,
      canIssueRestrictions: true,
      canAccessLedger: false,
      canModifySettings: false,
      canControlAI: true,
    }
  },
  {
    id: 'staff-05',
    name: 'রাফিয়া সুলতানা',
    email: 'rafia.academy@ptenit.com',
    phone: '01555443322',
    designation: 'একাডেমিক কোর্স কো-অর্ডিনেটর',
    department: 'Academy',
    status: 'active',
    joinedDate: '২০২৪-০৬-২০',
    lastActive: '১ ঘণ্টা আগে',
    actionsTakenCount: 310,
    permissions: {
      canManageUsers: false,
      canApproveTeachers: true,
      canVerifyPayments: false,
      canManageCourses: true,
      canModerateGigs: false,
      canIssueRestrictions: false,
      canAccessLedger: false,
      canModifySettings: false,
      canControlAI: false,
    }
  }
];

const PERMISSION_CONFIGS = [
  { key: 'canManageUsers', label: 'ইউজার ম্যানেজমেন্ট ও রোল নিয়ন্ত্রণ', icon: Users, desc: 'সেলার, স্টুডেন্ট ও বায়ার অ্যাকাউন্ট পরিচালনা' },
  { key: 'canApproveTeachers', label: 'টিচার ও মেন্টর আবেদন যাচাই', icon: CheckCircle2, desc: 'নতুন প্রশিক্ষক আবেদনপত্র রিভিউ ও অ্যাপ্রুভ' },
  { key: 'canVerifyPayments', label: 'পেমেন্ট ও ট্রানজেকশন ভেরিফিকেশন', icon: DollarSign, desc: 'বিকাশ, নগদ ও ব্যাংক পেমেন্ট অনুমোদন' },
  { key: 'canManageCourses', label: 'কোর্স ও লেকচার মডারেশন', icon: BookOpen, desc: 'কোর্স পাবলিশ, সিলেবাস ও ভিডিও অ্যাকসেস' },
  { key: 'canModerateGigs', label: 'গিগ ও ডিজিটাল প্রোডাক্ট অ্যাপ্রুভাল', icon: ShoppingBag, desc: 'মার্কেটপ্লেস সার্ভিস ও ফাইল রিভিউ' },
  { key: 'canIssueRestrictions', label: 'রেস্ট্রিকশন ও ব্যান আদেশ', icon: AlertTriangle, desc: 'নীতি লঙ্ঘনকারী ইউজার ব্লক ও সাসপেনশন' },
  { key: 'canAccessLedger', label: 'ফিনান্সিয়াল লেজার ও রেভিনিউ হিসাব', icon: FileText, desc: 'কোম্পানি প্রফিট ও উত্তোলন স্টেটমেন্ট' },
  { key: 'canModifySettings', label: 'সিস্টেম কনফিগারেশন পরিবর্তন', icon: Sliders, desc: 'পেমেন্ট গেটওয়ে, পিক্সেল ও সাইট কন্ট্রোল' },
  { key: 'canControlAI', label: 'এআই অডিট ও ফ্রড ডিটেকশন কোর', icon: Cpu, desc: 'স্বয়ংক্রিয় ঝুঁকি স্ক্যানার ও সিকিউরিটি শিল্ড' },
];

export const StaffAccessControl: React.FC = () => {
  const { playAppSound, sendCentralNotification } = useData();

  // Load from local storage or default
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_enterprise_staff_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STAFF_MEMBERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // New staff form state
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    email: '',
    phone: '',
    designation: 'মডারেটর',
    department: 'Marketplace',
    status: 'active',
    permissions: {
      canManageUsers: true,
      canApproveTeachers: false,
      canVerifyPayments: false,
      canManageCourses: false,
      canModerateGigs: true,
      canIssueRestrictions: false,
      canAccessLedger: false,
      canModifySettings: false,
      canControlAI: false,
    }
  });

  // Persist
  const saveStaffList = (list: StaffMember[]) => {
    setStaffList(list);
    try {
      localStorage.setItem('ptenit_enterprise_staff_list', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return (staffList || []).filter(s => {
      if (!s) return false;
      const matchSearch = !searchQuery.trim() ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.phone && s.phone.includes(searchQuery)) ||
        (s.designation && s.designation.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDept = deptFilter === 'all' || s.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [staffList, searchQuery, deptFilter]);

  // Toggle single permission for staff
  const handleTogglePermission = (staffId: string, permKey: keyof StaffMember['permissions']) => {
    const updated = staffList.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          permissions: {
            ...s.permissions,
            [permKey]: !s.permissions[permKey]
          }
        };
      }
      return s;
    });
    saveStaffList(updated);
    playAppSound('click');
  };

  // Toggle Status
  const handleToggleStatus = (staffId: string) => {
    const updated = staffList.map(s => {
      if (s.id === staffId) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        return { ...s, status: nextStatus as any };
      }
      return s;
    });
    saveStaffList(updated);
    playAppSound('notification');
  };

  // Save new or edited staff
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      alert('অনুগ্রহ করে নাম এবং অফিসিয়াল ইমেইল লিখুন!');
      return;
    }

    if (editingStaff) {
      const updated = staffList.map(s => {
        if (s.id === editingStaff.id) {
          return {
            ...s,
            ...formData,
            permissions: {
              ...s.permissions,
              ...(formData.permissions || {})
            }
          } as StaffMember;
        }
        return s;
      });
      saveStaffList(updated);
      playAppSound('success');
      alert(`${formData.name}-এর পদবী ও পারমিশন সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      const newMember: StaffMember = {
        id: `staff-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '০১৭xxxxxxxx',
        designation: formData.designation || 'কর্মকর্তা',
        department: (formData.department as any) || 'Operations',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'নতুন নিয়োগপ্রাপ্ত',
        actionsTakenCount: 0,
        permissions: {
          canManageUsers: !!formData.permissions?.canManageUsers,
          canApproveTeachers: !!formData.permissions?.canApproveTeachers,
          canVerifyPayments: !!formData.permissions?.canVerifyPayments,
          canManageCourses: !!formData.permissions?.canManageCourses,
          canModerateGigs: !!formData.permissions?.canModerateGigs,
          canIssueRestrictions: !!formData.permissions?.canIssueRestrictions,
          canAccessLedger: !!formData.permissions?.canAccessLedger,
          canModifySettings: !!formData.permissions?.canModifySettings,
          canControlAI: !!formData.permissions?.canControlAI,
        }
      };
      saveStaffList([newMember, ...staffList]);
      playAppSound('success');
      sendCentralNotification({
        title: '👥 নতুন এডমিন কর্মকর্তা নিয়োগ',
        message: `${newMember.name}-কে "${newMember.designation}" হিসেবে নিয়োগ প্রদান করা হয়েছে।`,
        type: 'info',
        category: 'system'
      });
      alert(`সফলভাবে ${newMember.name}-কে পদবী অনুযায়ী এডমিন ক্ষমতা প্রদান করা হয়েছে!`);
    }

    setIsAddModalOpen(false);
    setEditingStaff(null);
  };

  // Remove staff
  const handleRemoveStaff = (staff: StaffMember) => {
    if (staff.id === 'staff-01') {
      alert('প্রধান সুপার এডমিন প্রোফাইল ডিলিট করা সম্ভব নয়!');
      return;
    }
    if (window.confirm(`আপনি কি নিশ্চিত যে ${staff.name} (${staff.designation})-এর সকল এডমিন একসেস প্রত্যাহার করতে চান?`)) {
      const updated = staffList.filter(s => s.id !== staff.id);
      saveStaffList(updated);
      playAppSound('notification');
    }
  };

  return (
    <div className="space-y-5 font-bengali">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white">
              পদবীভিত্তিক এডমিন নিয়োগ ও একসেস কন্ট্রোল (RBAC)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-normal max-w-2xl">
            লক্ষ লক্ষ ইউজার, ট্রানজেকশন ও অর্ডার সুচারুভাবে পরিচালনার জন্য বিভিন্ন ডিপার্টমেন্ট ও পদবী অনুযায়ী দায়িত্বশীল কর্মকর্তাদের নিয়ন্ত্রণ ক্ষমতা নির্ধারণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setEditingStaff(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                designation: 'মডারেটর',
                department: 'Marketplace',
                status: 'active',
                permissions: {
                  canManageUsers: true,
                  canApproveTeachers: false,
                  canVerifyPayments: false,
                  canManageCourses: false,
                  canModerateGigs: true,
                  canIssueRestrictions: false,
                  canAccessLedger: false,
                  canModifySettings: false,
                  canControlAI: false,
                }
              });
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন কর্মকর্তা নিয়োগ ও পদবী নির্ধারণ</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-normal">মোট কর্মকর্তা</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1.5 font-mono">{staffList.length}</p>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">সবগুলো ডিপার্টমেন্ট মিলে</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-normal">বর্তমানে সক্রিয়</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1.5 font-mono">
            {staffList.filter(s => s.status !== 'inactive').length}
          </p>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">সিস্টেমে লগইন অবস্থায়</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-normal">কার্যসম্পাদন লগ</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-sky-400 mt-1.5 font-mono">
            {staffList.reduce((acc, curr) => acc + curr.actionsTakenCount, 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">অ্যাকশন সফলভাবে ভেরিফাইড</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-normal">সিকিউরিটি শিল্ড</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-1.5 font-mono">2FA Active</p>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">আইপি অডিট এনক্রিপ্টেড</p>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কর্মকর্তার নাম, ইমেইল, পদবী দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-normal"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-normal shrink-0">ডিপার্টমেন্ট:</span>
          {[
            { id: 'all', label: 'সকল' },
            { id: 'Administration', label: 'এডমিনিস্ট্রেশন' },
            { id: 'Operations', label: 'অপারেশনস' },
            { id: 'Finance', label: 'ফাইন্যান্স' },
            { id: 'Marketplace', label: 'মার্কেটপ্লেস' },
            { id: 'Academy', label: 'একাডেমি' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setDeptFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border cursor-pointer shrink-0 ${
                deptFilter === f.id
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Cards List */}
      <div className="space-y-3">
        {filteredStaff.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">কোনো কর্মকর্তা খুঁজে পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 font-normal mt-1">
              অন্য কোনো নাম দিয়ে সার্চ করুন অথবা নতুন মেম্বার যুক্ত করুন।
            </p>
          </div>
        ) : (
          filteredStaff.map(staff => {
            const isSuperAdmin = staff.id === 'staff-01';
            return (
              <div
                key={staff.id}
                className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl hover:border-slate-700 transition"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Staff Info Left */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white truncate">{staff.name}</h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {staff.designation}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-normal border ${
                          staff.status === 'on_duty'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : staff.status === 'active'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}>
                          {staff.status === 'on_duty' ? 'অন-ডিউটি' : staff.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 font-normal mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-mono">{staff.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-mono">{staff.phone}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>লাস্ট অ্যাক্টিভ: {staff.lastActive}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sky-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-mono">{staff.actionsTakenCount}</span> টি সম্পন্ন অ্যাকশন
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons Right */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(staff.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
                        staff.status === 'inactive'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {staff.status === 'inactive' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{staff.status === 'inactive' ? 'পুনরায় সচল করুন' : 'একসেস সাময়িক স্থগিত'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingStaff(staff);
                        setFormData({
                          name: staff.name,
                          email: staff.email,
                          phone: staff.phone,
                          designation: staff.designation,
                          department: staff.department,
                          status: staff.status,
                          permissions: { ...staff.permissions }
                        });
                        setIsAddModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                      title="পদবী ও পারমিশন এডিট"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {!isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStaff(staff)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                        title="পদ প্রত্যাহার ও ডিলিট"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Granular Permissions Badges / Toggles */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 font-normal mb-2 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>প্রদত্ত একসেস পারমিশনসমূহ (ক্লিক করে অন/অফ করতে পারেন):</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSION_CONFIGS.map(cfg => {
                      const hasPerm = staff.permissions[cfg.key as keyof StaffMember['permissions']];
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={cfg.key}
                          type="button"
                          disabled={isSuperAdmin}
                          onClick={() => handleTogglePermission(staff.id, cfg.key as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 transition border cursor-pointer ${
                            hasPerm
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800/50 text-slate-500 border-slate-800 hover:text-slate-400 opacity-60'
                          } ${isSuperAdmin ? 'cursor-default' : ''}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span className={hasPerm ? 'font-medium' : 'font-normal'}>{cfg.label}</span>
                          {hasPerm ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <X className="w-2.5 h-2.5 text-slate-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingStaff ? 'কর্মকর্তার পদবী ও একসেস এডিট' : 'নতুন এডমিন কর্মকর্তা নিয়োগ ও পদবী নির্ধারণ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-normal">কর্মকর্তার নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: শফিকুল ইসলাম"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-normal">অফিসিয়াল ইমেইল *</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@ptenit.com"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-normal">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="০১৭xxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-normal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-normal">পদবী (Designation) *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation || ''}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="যেমন: হেড অব ফাইন্যান্স, গিগ মডারেটর"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-normal"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-300 font-normal">ডিপার্টমেন্ট</label>
                  <select
                    value={formData.department || 'Operations'}
                    onChange={e => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-normal"
                  >
                    <option value="Administration">Administration (এডমিনিস্ট্রেশন)</option>
                    <option value="Operations">Operations (অপারেশনস)</option>
                    <option value="Finance">Finance (ফাইন্যান্স ও বিলিং)</option>
                    <option value="Marketplace">Marketplace (মার্কেটপ্লেস ও ফ্রিল্যান্সিং)</option>
                    <option value="Academy">Academy (একাডেমি ও কোর্স)</option>
                    <option value="Support">Support (কাস্টমার সাপোর্ট)</option>
                    <option value="AI & Security">AI & Security (এআই ও সাইবার নিরাপত্তা)</option>
                  </select>
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>নির্দিষ্ট কার্যক্ষমতা / পারমিশন প্রদান করুন:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PERMISSION_CONFIGS.map(cfg => {
                    const isChecked = !!formData.permissions?.[cfg.key as keyof StaffMember['permissions']];
                    return (
                      <label
                        key={cfg.key}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            setFormData({
                              ...formData,
                              permissions: {
                                ...(formData.permissions || ({} as any)),
                                [cfg.key]: e.target.checked
                              }
                            });
                          }}
                          className="mt-0.5 rounded accent-amber-500"
                        />
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold text-white">{cfg.label}</p>
                          <p className="text-slate-400 font-normal mt-0.5">{cfg.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-normal"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow transition cursor-pointer"
                >
                  {editingStaff ? 'আপডেট সম্পন্ন করুন' : 'নিয়োগ ও একসেস নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
