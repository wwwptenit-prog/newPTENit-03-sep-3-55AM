import React, { useState, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  ShoppingBag,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Send,
  Eye,
  Award,
  Package,
  X,
  Briefcase,
  ClipboardList,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

interface UserManagementHubProps {
  initialTab?: string;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const UserManagementHub: React.FC<UserManagementHubProps> = ({ 
  initialTab = 'teacher_seller',
  activeTab,
  onSelectTab
}) => {
  const {
    users,
    toggleUserBlock,
    restrictUser,
    unrestrictUser,
    deleteUser,
    approveMentorApplication,
    rejectMentorApplication,
    sendCentralNotification,
    courses,
    gigs,
    digitalProducts,
    marketplaceOrders,
    playAppSound
  } = useData();

  // Unified Current Active Tab (Single Source of Truth from AdminPanel or internal state)
  const currentTab = useMemo(() => {
    const raw = activeTab || initialTab || 'teacher_seller';
    if (raw === 'users_just_seller' || raw === 'just_seller') return 'just_seller';
    if (raw === 'users_trainees' || raw === 'trainees') return 'trainees';
    if (raw === 'users_buyers' || raw === 'buyers') return 'buyers';
    if (raw === 'users_applications' || raw === 'applications') return 'applications';
    return 'teacher_seller';
  }, [activeTab, initialTab]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'restricted' | 'pending'>('all');

  // Restriction Modal State
  const [restrictionModalUser, setRestrictionModalUser] = useState<User | null>(null);
  const [restrictionReasonType, setRestrictionReasonType] = useState<string>('অর্ডার ডেলিভারিতে অনিয়ম / প্রতারণা');
  const [customRestrictionNotes, setCustomRestrictionNotes] = useState<string>('');
  const [sendNoticeCheck, setSendNoticeCheck] = useState<boolean>(true);

  // User Profile Detail Modal
  const [viewProfileUser, setViewProfileUser] = useState<User | null>(null);

  // Warning Notice Modal
  const [warningModalUser, setWarningModalUser] = useState<User | null>(null);
  const [warningMessage, setWarningMessage] = useState<string>('');

  // Enterprise Multi-Select Bulk Actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBulkWarningOpen, setIsBulkWarningOpen] = useState(false);
  const [bulkWarningText, setBulkWarningText] = useState('');

  // Segregate User Groups
  const teacherSellers = useMemo(() => {
    return (users || []).filter(u => {
      if (!u || u.role === 'admin') return false;
      const isTeacher = u.role === 'instructor' || u.isMentor === true;
      return isTeacher;
    });
  }, [users]);

  const justSellers = useMemo(() => {
    return (users || []).filter(u => {
      if (!u || u.role === 'admin') return false;
      const isTeacher = u.role === 'instructor' || u.isMentor === true;
      const isSeller = u.isSeller === true || u.role === 'specialist' || u.sellerStatus === 'approved';
      return isSeller && !isTeacher;
    });
  }, [users]);

  const trainees = useMemo(() => {
    return (users || []).filter(u => {
      if (!u || u.role === 'admin') return false;
      const isTeacher = u.role === 'instructor' || u.isMentor === true;
      const isSeller = u.isSeller === true || u.role === 'specialist';
      return u.role === 'student' || (!isTeacher && !isSeller && u.role !== 'customer');
    });
  }, [users]);

  const buyers = useMemo(() => {
    return (users || []).filter(u => {
      if (!u || u.role === 'admin') return false;
      return u.role === 'customer' || u.marketplaceMode === 'buying';
    });
  }, [users]);

  const pendingApplicants = useMemo(() => {
    return (users || []).filter(u => 
      u && (
        u.mentorStatus === 'pending' || 
        u.specialistStatus === 'pending' || 
        u.mentorApplication?.status === 'pending'
      )
    );
  }, [users]);

  // Current Working List based on Current Tab
  const activeTabList = useMemo(() => {
    let list: User[] = [];
    switch (currentTab) {
      case 'teacher_seller':
        list = teacherSellers;
        break;
      case 'just_seller':
        list = justSellers;
        break;
      case 'trainees':
        list = trainees;
        break;
      case 'buyers':
        list = buyers;
        break;
      case 'applications':
        list = pendingApplicants;
        break;
      default:
        list = (users || []).filter(u => u && u.role !== 'admin');
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(u => 
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobile?.toLowerCase().includes(q) ||
        u.title?.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter === 'active') {
      list = list.filter(u => !u.blocked && !u.isRestricted && u.mentorStatus !== 'pending');
    } else if (statusFilter === 'restricted') {
      list = list.filter(u => u.blocked || u.isRestricted);
    } else if (statusFilter === 'pending') {
      list = list.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending');
    }

    return list;
  }, [currentTab, users, teacherSellers, justSellers, trainees, buyers, pendingApplicants, searchQuery, statusFilter]);

  // Execute Restriction
  const handleConfirmRestriction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restrictionModalUser) return;

    const fullReason = customRestrictionNotes.trim()
      ? `${restrictionReasonType}: ${customRestrictionNotes.trim()}`
      : restrictionReasonType;

    restrictUser(restrictionModalUser.id, fullReason);

    if (sendNoticeCheck) {
      sendCentralNotification({
        title: '⚠️ অ্যাকাউন্ট রেস্ট্রিকশন নোটিশ',
        message: `প্রশাসনিক তদন্ত ও অভিযোগের পরিপ্রেক্ষিতে আপনার অ্যাকাউন্ট রেস্ট্রিক্ট করা হয়েছে। কারণ: ${fullReason}। সহায়তার জন্য সাপোর্টে যোগাযোগ করুন।`,
        type: 'warning',
        category: 'system'
      });
    }

    setRestrictionModalUser(null);
    setCustomRestrictionNotes('');
  };

  // Handle Unrestrict
  const handleUnrestrict = (user: User) => {
    unrestrictUser(user.id);
    sendCentralNotification({
      title: '✅ অ্যাকাউন্ট পুনরায় সক্রিয় করা হয়েছে',
      message: `${user.name}-এর অ্যাকাউন্টের সকল রেস্ট্রিকশন প্রত্যাহার করে পুনরায় সক্রিয় করা হয়েছে।`,
      type: 'info',
      category: 'system'
    });
  };

  // Handle Send Warning Notice
  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningModalUser || !warningMessage.trim()) return;

    sendCentralNotification({
      title: '⚠️ পিটেন আইটি এডমিন সতর্কতা নোটিশ',
      message: `${warningMessage.trim()} - পিটেন আইটি প্রশাসন`,
      type: 'warning',
      category: 'system'
    });

    playAppSound('notification');
    alert(`${warningModalUser.name}-কে অফিসিয়াল সতর্কতা বার্তা সফলভাবে পাঠানো হয়েছে!`);
    setWarningModalUser(null);
    setWarningMessage('');
  };

  // Handle Bulk Restrict
  const handleBulkRestrict = () => {
    if (selectedUserIds.length === 0) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedUserIds.length} জন ইউজারকে একযোগে রেস্ট্রিক্ট করতে চান?`)) {
      selectedUserIds.forEach(id => {
        restrictUser(id, 'প্রশাসনিক গণ-তদন্ত ও নীতি লঙ্ঘন');
      });
      playAppSound('notification');
      alert(`সফলভাবে ${selectedUserIds.length} জন ইউজারকে রেস্ট্রিক্ট করা হয়েছে।`);
      setSelectedUserIds([]);
    }
  };

  // Handle Bulk Unrestrict
  const handleBulkUnrestrict = () => {
    if (selectedUserIds.length === 0) return;
    selectedUserIds.forEach(id => {
      unrestrictUser(id);
    });
    playAppSound('success');
    alert(`সফলভাবে ${selectedUserIds.length} জন ইউজারকে সক্রিয় করা হয়েছে।`);
    setSelectedUserIds([]);
  };

  // Handle Bulk Warning
  const handleConfirmBulkWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkWarningText.trim() || selectedUserIds.length === 0) return;

    sendCentralNotification({
      title: '⚠️ পিটেন আইটি গণ-সতর্কতা নোটিশ',
      message: `${bulkWarningText.trim()} - পিটেন আইটি প্রশাসন`,
      type: 'warning',
      category: 'system'
    });

    playAppSound('notification');
    alert(`নির্বাচিত ${selectedUserIds.length} জন ইউজারের অ্যাকাউন্টে সতর্কবার্তা পাঠানো হয়েছে!`);
    setIsBulkWarningOpen(false);
    setBulkWarningText('');
    setSelectedUserIds([]);
  };

  // Export CSV of currently displayed users
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Role', 'Status'];
    const rows = activeTabList.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.mobile,
      u.role,
      u.blocked || u.isRestricted ? 'Restricted' : 'Active'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ptenit_users_${currentTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playAppSound('click');
  };

  // Toggle select all on current page
  const handleToggleSelectAll = () => {
    if (selectedUserIds.length === activeTabList.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(activeTabList.map(u => u.id));
    }
  };

  return (
    <div className="space-y-5 font-bengali">
      {/* HEADER BANNER - UNIFIED ENTERPRISE DESIGN */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                <span>হাই-স্কেল ইউজার ডিরেক্টরি ও কমপ্লেইন হাব</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  মোট {users.length} জন
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-normal mt-0.5 max-w-2xl">
                টিচার, সেলার, শিক্ষার্থী ও বায়ারদের প্রোফাইল পর্যবেক্ষণ, অভিযোগ নিরীক্ষা, একক ও বাল্ক একশনে রেস্ট্রিক্ট বা অনুমোদন।
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH, STATUS FILTER & TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-normal"
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

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 font-normal">ক্যাটাগরি:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1.5">
              {currentTab === 'teacher_seller' && <><GraduationCap className="w-3.5 h-3.5 text-sky-400" /> টিচার ও সেলার ({teacherSellers.length})</>}
              {currentTab === 'just_seller' && <><Briefcase className="w-3.5 h-3.5 text-purple-400" /> যাস্ট সেলার ({justSellers.length})</>}
              {currentTab === 'trainees' && <><BookOpen className="w-3.5 h-3.5 text-sky-400" /> প্রশিক্ষণার্থী ({trainees.length})</>}
              {currentTab === 'buyers' && <><ShoppingBag className="w-3.5 h-3.5 text-blue-400" /> বায়ার ({buyers.length})</>}
              {currentTab === 'applications' && <><ClipboardList className="w-3.5 h-3.5 text-amber-400" /> নতুন আবেদনপত্র ({pendingApplicants.length})</>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="ইউজার লিস্ট CSV ফরম্যাটে এক্সপোর্ট করুন"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>CSV এক্সপোর্ট</span>
          </button>

          <span className="text-xs text-slate-400 font-normal hidden sm:inline-block">ফিল্টার:</span>
          {[
            { id: 'all', label: 'সকল' },
            { id: 'active', label: 'শুধুমাত্র সক্রিয়' },
            { id: 'restricted', label: 'রেস্ট্রিক্টেড / ব্যানড' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* BATCH / BULK ACTION FLOATING TOOLBAR */}
      {selectedUserIds.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/50 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold font-mono">
              {selectedUserIds.length}
            </span>
            <span className="text-white font-bold">জন ইউজার নির্বাচিত করা হয়েছে</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsBulkWarningOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>গণ-সতর্কবার্তা পাঠান</span>
            </button>

            <button
              type="button"
              onClick={handleBulkRestrict}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>একযোগে রেস্ট্রিক্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={handleBulkUnrestrict}
              className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-sky-300 border border-blue-500/40 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>সক্রিয় করুন</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-normal border border-slate-700 transition"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPLICATIONS SPECIAL REVIEW BANNER (IF ON APPLICATIONS TAB) */}
      {currentTab === 'applications' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">টিচার ও স্পেশালিস্ট আবেদন রিভিউ হাব</p>
              <p className="text-slate-400 text-xs font-normal">
                নতুন আবেদনকারীদের এক্সপার্টিজ, অভিজ্ঞতা, কোর্স টপিক ও পোর্টফোলিও যাচাই করে এক ক্লিকে অনুমোদন বা বাতিল করুন।
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl font-bold text-xs text-amber-300 shrink-0 font-mono">
            {pendingApplicants.length} টি আবেদন
          </span>
        </div>
      )}

      {/* USER CARDS GRID */}
      {activeTabList.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 hover:text-white transition font-medium cursor-pointer"
          >
            {selectedUserIds.length === activeTabList.length && activeTabList.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-amber-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>সবাইকে নির্বাচন করুন ({activeTabList.length} জন)</span>
          </button>
          <span className="font-mono text-slate-400">নির্বাচিত: <strong className="text-amber-400 font-bold">{selectedUserIds.length}</strong> / {activeTabList.length}</span>
        </div>
      )}

      {activeTabList.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm space-y-2">
          <Users className="w-8 h-8 mx-auto text-slate-600" />
          <p className="font-bold text-white">কোনো ইউজার পাওয়া যায়নি</p>
          <p className="text-xs text-slate-500 font-normal">আপনার সার্চ বা ফিল্টারের সাথে মিলে এমন কোনো অ্যাকাউন্ট নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeTabList.map(user => {
            const isBlocked = user.blocked === true || user.isRestricted === true;
            const isPending = user.mentorStatus === 'pending' || user.specialistStatus === 'pending' || user.mentorApplication?.status === 'pending';
            const isTeacher = user.role === 'instructor' || user.isMentor === true;
            const isSeller = user.isSeller === true || user.role === 'specialist';
            const isSelected = selectedUserIds.includes(user.id);
            
            // Related stats
            const userCoursesCount = (courses || []).filter(c => c && (c.instructor?.id === user.id || c.instructor?.name === user.name)).length;
            const userGigsCount = (gigs || []).filter(g => g && (g.seller?.id === user.id || g.seller?.name === user.name)).length;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 space-y-3.5 bg-slate-900 shadow-sm ${
                  isSelected
                    ? 'border-amber-500 ring-1 ring-amber-500/30'
                    : isBlocked
                    ? 'border-rose-500/50'
                    : isPending
                    ? 'border-amber-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Row: Avatar, Identity, Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserIds(prev => 
                          prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                        );
                      }}
                      className="text-slate-500 hover:text-amber-400 p-0.5 mt-2 cursor-pointer transition shrink-0"
                      title="ইউজার সিলেক্ট করুন"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>

                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className={`w-12 h-12 rounded-xl object-cover border-2 shrink-0 ${
                        isBlocked
                          ? 'border-rose-500 grayscale'
                          : isPending
                          ? 'border-amber-400'
                          : isTeacher
                          ? 'border-sky-400'
                          : 'border-purple-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate">
                          {user.name}
                        </h3>
                        {isTeacher && (
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-black bg-blue-500/20 text-sky-300 border border-blue-500/40">
                            টিচার
                          </span>
                        )}
                        {isSeller && (
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            সেলার
                          </span>
                        )}
                        {user.role === 'student' && !isTeacher && !isSeller && (
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/40">
                            প্রশিক্ষণার্থী
                          </span>
                        )}
                        {user.role === 'customer' && !isTeacher && !isSeller && (
                          <span className="px-2 py-0.2 rounded-md text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            বায়ার
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {user.title || user.institution || 'রেজিস্টার্ড প্ল্যাটফর্ম ইউজার'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-400" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3 text-slate-400" /> {user.mobile || 'প্রযোজ্য নয়'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="shrink-0 text-right space-y-1">
                    {isBlocked ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-1 animate-pulse">
                        <Ban className="w-3 h-3 text-rose-400" />
                        <span>রেস্ট্রিক্টেড / ব্যানড</span>
                      </span>
                    ) : isPending ? (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>অপেক্ষমান আবেদন</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-blue-500/20 text-sky-300 border border-blue-500/40 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-sky-400" />
                        <span>সক্রিয় (Active)</span>
                      </span>
                    )}

                    <p className="text-[10px] text-slate-500 font-mono">
                      যোগদান: {user.createdAt || '২০২৬-০১-০১'}
                    </p>
                  </div>
                </div>

                {/* RESTRICTION WARNING ALERT (IF USER IS RESTRICTED) */}
                {isBlocked && (
                  <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-3 text-xs text-rose-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                      <span>অ্যাকাউন্ট রেস্ট্রিকশন তথ্য ও অভিযোগ:</span>
                    </div>
                    <p className="text-slate-200">
                      {user.restrictionReason || 'অভিযোগ ও নীতিমালা লঙ্ঘনের কারণে এই ইউজারের কার্যক্রম স্থগিত রাখা হয়েছে।'}
                    </p>
                    {user.restrictedAt && (
                      <p className="text-[10px] text-rose-400/80 font-mono">
                        রেস্ট্রিকশনের তারিখ: {user.restrictedAt}
                      </p>
                    )}
                  </div>
                )}

                {/* PENDING APPLICATION DETAILS BOX (IF PENDING) */}
                {user.mentorApplication && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800/80 pb-1">
                      <span>ইনস্ট্রাক্টর ও মেন্টরশিপ আবেদন তথ্য</span>
                      <span className="text-[10px] text-slate-400 font-normal">তারিখ: {user.mentorApplication.appliedAt}</span>
                    </div>
                    <p className="text-slate-300">
                      <strong className="text-white">স্কিল / এক্সপার্টিজ:</strong> {user.mentorApplication.expertise?.join(', ')}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-white">অভিজ্ঞতা:</strong> {user.mentorApplication.experienceYears}
                    </p>
                    {user.mentorApplication.proposedCourseTopic && (
                      <p className="text-slate-300">
                        <strong className="text-white">প্রস্তাবিত কোর্স টপিক:</strong> {user.mentorApplication.proposedCourseTopic}
                      </p>
                    )}
                    {user.mentorApplication.bio && (
                      <p className="text-slate-400 italic">
                        "{user.mentorApplication.bio}"
                      </p>
                    )}
                    {user.mentorApplication.portfolioUrl && (
                      <p className="text-slate-400 truncate">
                        <strong className="text-white">পোর্টফোলিও:</strong>{' '}
                        <a
                          href={user.mentorApplication.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 underline inline-flex items-center gap-1"
                        >
                          {user.mentorApplication.portfolioUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {/* Platform Summary Metrics */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60 flex-wrap">
                  {isTeacher && (
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      পরিচালিত কোর্স: <strong className="text-sky-400 font-mono">{userCoursesCount}</strong>
                    </span>
                  )}
                  {isSeller && (
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                      লাইভ গিগস: <strong className="text-purple-400 font-mono">{userGigsCount}</strong>
                    </span>
                  )}
                  <span className="text-slate-500 font-mono text-[10px]">
                    ইউজার আইডি: {user.id}
                  </span>
                </div>

                {/* ACTION BUTTONS BAR */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                  {/* PENDING REVIEW ACTIONS */}
                  {isPending && (
                    <>
                      <button
                        onClick={() => {
                          approveMentorApplication(user.id);
                          playAppSound('success');
                          alert(`${user.name}-কে সফলভাবে টিচার ও মেন্টর হিসেবে অনুমোদন প্রদান করা হয়েছে!`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#047857] hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>গ্রহণ ও অনুমোদন</span>
                      </button>

                      <button
                        onClick={() => {
                          const r = prompt("আবেদন বাতিলের কারণ লিখুন (ঐচ্ছিক):", "তথ্য অসম্পূর্ণ বা ক্রাইটেরিয়া পূর্ণ হয়নি।");
                          if (r !== null) {
                            rejectMentorApplication(user.id, r);
                            playAppSound('notification');
                            alert(`${user.name}-এর আবেদন বাতিল করা হয়েছে।`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>বাতিল</span>
                      </button>
                    </>
                  )}

                  {/* WARNING NOTICE BUTTON */}
                  {!isPending && (
                    <button
                      onClick={() => {
                        setWarningModalUser(user);
                        setWarningMessage(`প্রিয় ${user.name}, আপনার অ্যাকাউন্ট বিষয়ে একটি সতর্কতা নোটিশ জারি করা হয়েছে। নীতিমালা অনুসরণ নিশ্চিত করুন।`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                      title="অফিসিয়াল সতর্কবার্তা পাঠান"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>সতর্কবার্তা</span>
                    </button>
                  )}

                  {/* RESTRICT / UNRESTRICT BUTTON */}
                  {user.role !== 'admin' && (
                    <>
                      {isBlocked ? (
                        <button
                          onClick={() => handleUnrestrict(user)}
                          className="px-3 py-1.5 rounded-xl bg-[#047857] hover:bg-blue-500 text-white font-black text-xs shadow cursor-pointer transition flex items-center gap-1 active:scale-95"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>আনরেস্ট্রিক্ট করুন</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setRestrictionModalUser(user);
                            setCustomRestrictionNotes('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-black text-xs transition cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>রেস্ট্রিক্ট / ব্যান</span>
                        </button>
                      )}

                      {/* DELETE USER BUTTON */}
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি নিশ্চিতভাবে ${user.name}-এর অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করতে চান?`)) {
                            deleteUser(user.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-700 text-slate-400 hover:text-white border border-slate-700 hover:border-rose-600 transition cursor-pointer"
                        title="ইউজার ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESTRICTION REASON MODAL */}
      {restrictionModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/50 text-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">অ্যাকাউন্ট রেস্ট্রিক্ট / সাসপেনশন</h3>
                  <p className="text-xs text-rose-300/80">ইউজারের বিরুদ্ধে অভিযোগ বা কারণ লিপিবদ্ধ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setRestrictionModalUser(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700 text-xs space-y-1">
              <p className="font-bold text-white">টার্গেট ইউজার: <span className="text-amber-400">{restrictionModalUser.name}</span></p>
              <p className="text-slate-300 font-mono text-[11px]">{restrictionModalUser.email} • {restrictionModalUser.mobile}</p>
              <p className="text-[11px] text-slate-400 uppercase font-bold">বর্তমান রোল: {restrictionModalUser.role}</p>
            </div>

            <form onSubmit={handleConfirmRestriction} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">অভিযোগের মূল ধরন নির্বাচন করুন *</label>
                <select
                  value={restrictionReasonType}
                  onChange={(e) => setRestrictionReasonType(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-400 font-bold"
                >
                  <option value="অর্ডার ডেলিভারিতে অনিয়ম / প্রতারণা">অর্ডার ডেলিভারিতে অনিয়ম / প্রতারণা</option>
                  <option value="গ্রাহক বা শিক্ষার্থীর সাথে অসদাচরণ">গ্রাহক বা শিক্ষার্থীর সাথে অসদাচরণ</option>
                  <option value="কপিরাইট ও পাইরেসি লঙ্ঘন">কপিরাইট ও পাইরেসি লঙ্ঘন</option>
                  <option value="ফেক পোর্টফোলিও বা ভুয়া তথ্য প্রদান">ফেক পোর্টফোলিও বা ভুয়া তথ্য প্রদান</option>
                  <option value="অফসাইট পেমেন্ট বা অননুমোদিত লেনদেনের চেষ্টা">অফসাইট পেমেন্ট বা অননুমোদিত লেনদেনের চেষ্টা</option>
                  <option value="অন্যান্য অভিযোগ বা প্রশাসনিক সিদ্ধান্ত">অন্যান্য অভিযোগ বা প্রশাসনিক সিদ্ধান্ত</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">বিস্তারিত কারণ ও কমপ্লেইন নোট (ঐচ্ছিক)</label>
                <textarea
                  rows={3}
                  value={customRestrictionNotes}
                  onChange={(e) => setCustomRestrictionNotes(e.target.value)}
                  placeholder="নির্দিষ্ট অর্ডার বা শিক্ষার্থীর অভিযোগের রেফারেন্স লিখুন..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sendNoticeCheck"
                  checked={sendNoticeCheck}
                  onChange={(e) => setSendNoticeCheck(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="sendNoticeCheck" className="text-slate-300 text-xs cursor-pointer">
                  ইউজারের প্যানেলে অফিসিয়াল রেস্ট্রিকশন নোটিশ পাঠান
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRestrictionModalUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow-lg transition flex items-center gap-1.5 active:scale-95"
                >
                  <Ban className="w-4 h-4" />
                  <span>রেস্ট্রিকশন নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WARNING NOTICE MODAL */}
      {warningModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 text-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">সতর্কবার্তা পাঠান (Official Warning)</h3>
                  <p className="text-xs text-amber-300/80">ইউজারকে নির্দিষ্ট বিষয়ে সতর্ক করুন</p>
                </div>
              </div>
              <button
                onClick={() => setWarningModalUser(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendWarning} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">প্রাপক ইউজার</label>
                <input
                  type="text"
                  readOnly
                  value={`${warningModalUser.name} (${warningModalUser.email})`}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">সতর্কবার্তার বিবরণ লিখুন *</label>
                <textarea
                  rows={4}
                  required
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="যেমন: সময়মত কাজ জমা দিন, অন্যথায় অ্যাকাউন্ট স্থগিত করা হবে..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setWarningModalUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg transition flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>সতর্কবার্তা পাঠান</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENTERPRISE BULK WARNING NOTICE MODAL */}
      {isBulkWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 text-white w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">গণ-সতর্কবার্তা প্রেরণ (Bulk Notice)</h3>
                  <p className="text-xs text-slate-400 font-normal">নির্বাচিত {selectedUserIds.length} জন ইউজারের একাউন্টে নোটিশ যাবে</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkWarningOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBulkWarning} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">সতর্কবার্তার বিবরণ লিখুন *</label>
                <textarea
                  rows={4}
                  required
                  value={bulkWarningText}
                  onChange={(e) => setBulkWarningText(e.target.value)}
                  placeholder="যেমন: সকল সেলারদের নির্ধারিত সময়ের মধ্যে অর্ডার প্রসেস করার নির্দেশ দেয়া হচ্ছে..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBulkWarningOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>গণ-নোটিশ পাঠান</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagementHub;
