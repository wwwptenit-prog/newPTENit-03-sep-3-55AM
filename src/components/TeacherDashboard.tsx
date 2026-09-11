import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Radio,
  Briefcase,
  FileCheck,
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  CheckCircle2,
  BadgeCheck,
  Info,
  Award,
  Upload,
  User,
  Send,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Trash2,
  Check,
  Search,
  Filter,
  Video,
  Play,
  X,
  Plus,
  FileVideo,
  ExternalLink,
  Eye,
  Download,
  Film,
  CreditCard,
  DollarSign,
  Bell,
  Wallet,
  Receipt,
  Target,
  Globe,
  LogOut,
  Settings,
  Lock,
  Moon,
  Sun,
  Shield,
  ShieldCheck,
  XCircle,
  Phone,
  Save,
  Image,
  Pencil,
  MoreVertical,
  Zap,
  Banknote,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Link as LinkIcon,
  AlertCircle,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  Copy
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Assignment, AssignmentSubmission, Course, CustomerProject, LiveClassSession } from '../types';
import {
  getActiveLiveSessions,
  getLiveSessionDynamicStatus,
  formatBanglaLiveSchedule
} from '../services/liveClassService';

interface TeacherDashboardProps {
  onViewCourse?: (courseId: string) => void;
  setActiveTab?: (tab: string) => void;
  initialTab?: 'courses' | 'submissions' | 'completed' | 'certificates' | 'assignments' | 'payments' | 'profile' | 'students' | 'live_classes';
  initialStatusFilter?: 'all' | 'new' | 'review';
  openCreateAssignmentModal?: boolean;
  onCloseCreateAssignmentModal?: () => void;
  hideHeader?: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onViewCourse,
  setActiveTab,
  initialTab,
  initialStatusFilter,
  openCreateAssignmentModal,
  onCloseCreateAssignmentModal,
  hideHeader
}) => {
  const {
    currentUser,
    users = [],
    courses = [],
    liveSessions = [],
    customerProjects = [],
    enrollments = [],
    certificates = [],
    assignments = [],
    submissions = [],
    payouts = [],
    teacherNotices = [],
    notifications = [],
    markNotificationRead,
    markAllNotificationsRead,
    sendCentralNotification,
    requestTeacherPayout,
    addAssignment,
    deleteAssignment,
    addLiveSession,
    updateLiveSession,
    deleteLiveSession,
    gradeSubmission,
    updateSubmissionStatus,
    deleteSubmission,
    updateSubmission,
    updateProfile,
    updateCourse,
    issueCertificate,
    acceptCourseOffer,
    declineCourseOffer,
    logout,
    t,
    lang,
    setLang,
    darkMode,
    toggleDarkMode
  } = useData();

  const [activeTab, setActiveTabState] = useState<'courses' | 'submissions' | 'completed' | 'certificates' | 'assignments' | 'payments' | 'profile' | 'students' | 'live_classes'>(() => {
    if (initialTab === 'assignments') return 'submissions';
    if (initialTab === 'certificates') return 'completed';
    return initialTab || 'courses';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (openCreateAssignmentModal) {
      if (courses.length > 0) setSelectedCourseId(courses[0].id);
      setShowCreateModal(true);
    }
  }, [openCreateAssignmentModal, courses]);
  
  // Certificate Issue State
  const [certStudentId, setCertStudentId] = useState('');
  const [certCourseId, setCertCourseId] = useState(courses[0]?.id || '');
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Payment Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [payoutsList, setPayoutsList] = useState([
    { id: 'W-9081', date: '2026-07-28', amount: 12500, method: 'bKash (01712***89)', paymentMethod: 'bKash', accountNumber: '01712000089', status: 'Approved' },
    { id: 'W-8812', date: '2026-07-15', amount: 8000, method: 'Nagad (01812***34)', paymentMethod: 'Nagad', accountNumber: '01812000034', status: 'Approved' },
  ]);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [isEditPayoutModalOpen, setIsEditPayoutModalOpen] = useState(false);
  const [openTeacherPayoutMenuId, setOpenTeacherPayoutMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenTeacherPayoutMenuId(null);
    };
    if (openTeacherPayoutMenuId) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [openTeacherPayoutMenuId]);

  const [editingPayoutItem, setEditingPayoutItem] = useState<{ id: string; amount: number; paymentMethod: string; accountNumber: string } | null>(null);
  const [editPayoutAmount, setEditPayoutAmount] = useState<number>(0);
  const [editPayoutMethod, setEditPayoutMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [editPayoutAccount, setEditPayoutAccount] = useState('');
  
  // Assignment Creation Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [asgnTitle, setAsgnTitle] = useState('');
  const [asgnDesc, setAsgnDesc] = useState('');
  const [asgnDueDate, setAsgnDueDate] = useState('');
  const [asgnPoints, setAsgnPoints] = useState('50');
  const [asgnAttachmentName, setAsgnAttachmentName] = useState('');
  const [asgnAttachmentUrl, setAsgnAttachmentUrl] = useState('');

  // Course Video Upload & Module Manager Modal state
  const [selectedManageCourseId, setSelectedManageCourseId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonModuleId, setLessonModuleId] = useState('');
  const [newModuleName, setNewModuleName] = useState('');
  const [lessonVideoType, setLessonVideoType] = useState<'url' | 'file'>('url');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoFileName, setLessonVideoFileName] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15:00 min');
  const [lessonResourceName, setLessonResourceName] = useState('');
  const [lessonResourceUrl, setLessonResourceUrl] = useState('');
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [manageModalTab, setManageModalTab] = useState<'upload' | 'curriculum'>('upload');

  // Integrated Task/Assignment inside Video Upload state
  const [includeLessonTask, setIncludeLessonTask] = useState(false);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [lessonTaskTitle, setLessonTaskTitle] = useState('');
  const [lessonTaskDesc, setLessonTaskDesc] = useState('');
  const [lessonTaskDueDate, setLessonTaskDueDate] = useState('');
  const [lessonTaskPoints, setLessonTaskPoints] = useState('50');
  const [lessonTaskAttachmentName, setLessonTaskAttachmentName] = useState('');
  const [lessonTaskAttachmentUrl, setLessonTaskAttachmentUrl] = useState('');
  const [lessonTaskReferenceLink, setLessonTaskReferenceLink] = useState('');

  // Grading & Edit Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradePoints, setGradePoints] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [gradeLinkUrl, setGradeLinkUrl] = useState<string>('');
  const [deleteConfirmSubId, setDeleteConfirmSubId] = useState<string | null>(null);

  // Again / Redo Modal state
  const [againModalSub, setAgainModalSub] = useState<AssignmentSubmission | null>(null);
  const [againLessonNo, setAgainLessonNo] = useState<string>('লেসন নং ১');
  const [againReason, setAgainReason] = useState<string>('');

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileTitle, setProfileTitle] = useState(currentUser?.title || 'সিনিয়র ইনস্ট্রাক্টর');
  const [profilePhone, setProfilePhone] = useState(currentUser?.mobile || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || 'PTENit-এর অভিজ্ঞ ট্রেইনার ও আইটি বিশেষজ্ঞ।');
  const [profileInstitution, setProfileInstitution] = useState(currentUser?.institution || 'PTENit IT Academy');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Search/Filter state for assignments
  const [searchQuery, setSearchQuery] = useState('');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<'all' | 'new' | 'review'>(
    initialStatusFilter || 'review'
  );

  useEffect(() => {
    if (initialStatusFilter) {
      setAssignmentStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);
  const [submissionCourseFilter, setSubmissionCourseFilter] = useState('all');
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetConfigCourseId, setTargetConfigCourseId] = useState(courses[0]?.id || '');
  const [targetConfigModules, setTargetConfigModules] = useState<number>(4);
  const [targetConfigLessons, setTargetConfigLessons] = useState<number>(16);
  const [targetConfigAssignments, setTargetConfigAssignments] = useState<number>(4);

  // Notification dismissal state
  const [isPolicyDismissed, setIsPolicyDismissed] = useState(false);
  const [isOfferNoticeDismissed, setIsOfferNoticeDismissed] = useState(false);

  // Detail Modal States for Offers & Projects
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);
  const [selectedPreviewCourse, setSelectedPreviewCourse] = useState<Course | null>(null);
  const [expandedPreviewModules, setExpandedPreviewModules] = useState<Record<string, boolean>>({});
  const [expandedManageModules, setExpandedManageModules] = useState<Record<string, boolean>>({});
  const [selectedDetailProject, setSelectedDetailProject] = useState<CustomerProject | null>(null);
  const [offerToastMsg, setOfferToastMsg] = useState<string | null>(null);
  const [offerCountdown, setOfferCountdown] = useState<number>(45);
  const [currentOfferIndex, setCurrentOfferIndex] = useState<number>(0);

  // Notification and Message Filtering & Preferences Toggle State
  const [teacherNotifToggles, setTeacherNotifToggles] = useState({
    admin: true,       // 👑 এডমিন নোটিশ
    expert: true,      // ⚡ এক্সপার্ট/ট্রেইনার আপডেট
    student: true,     // 🎓 স্টুডেন্ট সাবমিশন
    system: true       // ⚙️ সিস্টেম নোটিফিকেশন
  });
  const [teacherMsgToggles, setTeacherMsgToggles] = useState({
    admin: true,       // 📩 এডমিন মেসেজ
    support: true,     // 🎧 কাস্টমার/ক্লায়েন্ট সাপোর্ট
    student: true      // 🎓 স্টুডেন্ট চ্যাট
  });

  // Profile Section Popups, Policy Directives, and Full View Modals
  const [showTeacherNotifPop, setShowTeacherNotifPop] = useState(false);
  const [showTeacherMsgPop, setShowTeacherMsgPop] = useState(false);
  const [showDirectivesModal, setShowDirectivesModal] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const [activeChatSender, setActiveChatSender] = useState<string>('PTENit Admin');

  // Profile Settings Modal State
  const [showTeacherSettingsModal, setShowTeacherSettingsModal] = useState(false);
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'payout' | 'security' | 'preferences'>('profile');
  const [settingsPassword, setSettingsPassword] = useState({ old: '', new: '', confirm: '' });
  const [settingsPasswordSaved, setSettingsPasswordSaved] = useState(false);
  const [settingsPayoutMethod, setSettingsPayoutMethod] = useState('bkash');
  const [settingsPayoutNumber, setSettingsPayoutNumber] = useState(currentUser?.mobile || '01700000000');
  const [settingsPayoutSaved, setSettingsPayoutSaved] = useState(false);

  // Smart & Automated Live Class Management State
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [modalCourseId, setModalCourseId] = useState<string>('');
  const [modalModuleNo, setModalModuleNo] = useState<string>('১');
  const [modalModuleTitle, setModalModuleTitle] = useState<string>('');
  const [modalLessonNo, setModalLessonNo] = useState<string>('১');
  const [modalLessonTitle, setModalLessonTitle] = useState<string>('');
  const [modalClassSerialNo, setModalClassSerialNo] = useState<string>('১');
  const [modalTopic, setModalTopic] = useState<string>('');
  const [modalDate, setModalDate] = useState<string>('');
  const [modalTime, setModalTime] = useState<string>('21:00');
  const [modalDuration, setModalDuration] = useState<number>(90);
  const [modalMeetingLink, setModalMeetingLink] = useState<string>('https://meet.google.com/ptenit-live-class');
  const [modalSpecialNotes, setModalSpecialNotes] = useState<string>('');
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [showPastSessions, setShowPastSessions] = useState<boolean>(false);
  const [liveToastMsg, setLiveToastMsg] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Helper to format schedule into readable Bengali
  const getFormattedSchedule = (dateStr: string, timeStr: string) => {
    return formatBanglaLiveSchedule(dateStr, timeStr);
  };

  // Helper to auto-generate topic title
  const generateLiveTopic = (modNo: string, lesNo: string, lesTitle: string) => {
    const cleanMod = modNo ? `মডিউল ${modNo}` : '';
    const cleanLes = lesNo ? `লেসন ${lesNo}` : '';
    const prefix = [cleanMod, cleanLes].filter(Boolean).join(': ');
    if (lesTitle && lesTitle.trim()) {
      return prefix ? `${prefix} - ${lesTitle.trim()}` : lesTitle.trim();
    }
    return prefix ? `${prefix} - লাইভ প্র্যাকটিস ও ডিসকাশন ক্লাস` : 'লাইভ ক্লাস';
  };

  const openCreateLiveModal = (preselectedCourseId?: string) => {
    const course = courses.find(c => c.id === preselectedCourseId) || courses[0];
    setEditingSessionId(null);
    setModalCourseId(course ? course.id : '');
    setModalModuleNo('১');
    setModalModuleTitle(course?.modules?.[0]?.title || 'মৌলিক পরিচিতি ও ফান্ডামেন্টালস');
    setModalLessonNo('১');
    setModalLessonTitle(course?.modules?.[0]?.lessons?.[0]?.title || 'প্রথম পরিচিতি ও প্র্যাকটিস');
    setModalClassSerialNo('১');
    setModalTopic(course ? `${course.title} - লাইভ প্র্যাকটিস ও প্রশ্নোত্তর সেশন` : 'লাইভ প্র্যাকটিস ক্লাস');
    
    const today = new Date().toISOString().split('T')[0];
    setModalDate(today);
    setModalTime('21:00');
    setModalDuration(90);
    setModalMeetingLink('https://meet.google.com/ptenit-live-class');
    setModalSpecialNotes('সকলকে সময়মতো গুগল মিট রুমে জয়েন করার অনুরোধ করা হচ্ছে।');
    setLiveModalOpen(true);
  };

  const openEditLiveModal = (session: LiveClassSession) => {
    setEditingSessionId(session.id);
    setModalCourseId(session.courseId);
    setModalModuleNo(session.moduleNo || '১');
    setModalModuleTitle(session.moduleTitle || '');
    setModalLessonNo(session.lessonNo || '১');
    setModalLessonTitle(session.lessonTitle || '');
    setModalClassSerialNo(session.classSerialNo || '১');
    setModalTopic(session.topic || '');
    setModalDate(session.date || new Date().toISOString().split('T')[0]);
    setModalTime(session.time || '21:00');
    setModalDuration(session.durationMinutes || 90);
    setModalMeetingLink(session.meetingLink || 'https://meet.google.com/ptenit-live-class');
    setModalSpecialNotes(session.specialNotes || '');
    setLiveModalOpen(true);
  };

  const handleSaveLiveSession = () => {
    const course = courses.find(c => c.id === modalCourseId);
    if (!modalCourseId || !course) {
      alert('অনুগ্রহ করে একটি কোর্স নির্বাচন করুন।');
      return;
    }

    if (!modalTopic.trim()) {
      alert('অনুগ্রহ করে ক্লাসের টপিক লিখুন।');
      return;
    }

    if (editingSessionId) {
      updateLiveSession(editingSessionId, {
        courseId: modalCourseId,
        courseTitle: course.title,
        courseThumbnail: course.thumbnail,
        instructorName: course.instructor || currentUser?.name || 'PTENit Teacher',
        moduleNo: modalModuleNo.trim(),
        moduleTitle: modalModuleTitle.trim(),
        lessonNo: modalLessonNo.trim(),
        lessonTitle: modalLessonTitle.trim(),
        classSerialNo: modalClassSerialNo.trim(),
        topic: modalTopic.trim(),
        date: modalDate.trim(),
        time: modalTime.trim(),
        durationMinutes: modalDuration || 90,
        meetingLink: modalMeetingLink.trim(),
        specialNotes: modalSpecialNotes.trim()
      });
      setLiveToastMsg(`✅ "${modalTopic}" শিডিউল সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      addLiveSession({
        courseId: modalCourseId,
        courseTitle: course.title,
        courseThumbnail: course.thumbnail,
        instructorName: course.instructor || currentUser?.name || 'PTENit Teacher',
        moduleNo: modalModuleNo.trim(),
        moduleTitle: modalModuleTitle.trim(),
        lessonNo: modalLessonNo.trim(),
        lessonTitle: modalLessonTitle.trim(),
        classSerialNo: modalClassSerialNo.trim(),
        topic: modalTopic.trim(),
        date: modalDate.trim(),
        time: modalTime.trim(),
        durationMinutes: modalDuration || 90,
        meetingLink: modalMeetingLink.trim(),
        specialNotes: modalSpecialNotes.trim()
      });
      setLiveToastMsg(`✅ নতুন লাইভ ক্লাস "${modalTopic}" সফলভাবে তৈরি হয়েছে!`);
    }

    // Sync to course object for backward compatibility
    updateCourse(modalCourseId, {
      liveClassLink: modalMeetingLink.trim(),
      liveClassDate: modalDate.trim(),
      liveClassTime: modalTime.trim(),
      liveClassModuleNo: modalModuleNo.trim(),
      liveClassModuleTitle: modalModuleTitle.trim(),
      liveClassLessonNo: modalLessonNo.trim(),
      liveClassLessonTitle: modalLessonTitle.trim(),
      liveClassSerialNo: modalClassSerialNo.trim(),
      liveClassTopic: modalTopic.trim()
    });

    setLiveModalOpen(false);
    setTimeout(() => setLiveToastMsg(''), 3500);
  };

  const handleDeleteLiveSession = (session: LiveClassSession) => {
    if (window.confirm(`আপনি কি নিশ্চিত "${session.topic}" লাইভ ক্লাসটি ডিলিট করতে চান?`)) {
      deleteLiveSession(session.id);
      setLiveToastMsg(`🗑️ "${session.topic}" ক্লাসটি মুছে ফেলা হয়েছে।`);
      setTimeout(() => setLiveToastMsg(''), 3500);
    }
  };

  const [chatInputText, setChatInputText] = useState('');
  const [chatImageInput, setChatImageInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [chatAttachedFile, setChatAttachedFile] = useState<{ name: string; url: string; type?: string } | null>(null);
  const chatFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [teacherChatList, setTeacherChatList] = useState([
    {
      id: '1',
      sender: 'PTENit Admin',
      text: 'নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা: সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।',
      time: '10:30 AM',
      isTeacher: false,
      read: false,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      sender: 'অ্যাকাডেমিক ক্লায়েন্ট সাপোর্ট',
      text: 'স্যার, ক্লায়েন্ট সার্ভিসেস ও বিশেষ ট্রেনিং সেশনের তালিকা শিট সংযুক্ত করা হয়েছে। বিস্তারিত দেখতে ইমেজে ক্লিক করুন।',
      time: '11:15 AM',
      isTeacher: false,
      read: false,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Combined Teacher Notifications State (Includes Student Assignment Submissions & Admin Notices)
  const [teacherNotificationsList, setTeacherNotificationsList] = useState([
    {
      id: 'notif-asgn-1',
      title: 'নতুন অ্যাসাইনমেন্ট জমা ও কমেন্ট (আরিফ হোসেন)',
      message: 'শিক্ষার্থী আরিফ হোসেন "PTE Speaking Describe Image Task Practice" অ্যাসাইনমেন্ট জমা ও কমেন্ট করেছেন: "স্যার আমার ডেসক্রাইব ইমেজ টাস্কের ফাইল ও প্র্যাকটিস নোট জমা দিয়েছি, ফিডব্যাক ও রিভিউ রিপ্লাই দিলে কৃতজ্ঞ থাকবো।"',
      time: '৫ মিনিট আগে',
      read: false,
      type: 'assignment',
      assignmentId: 'asgn-1',
      submissionId: 'sub-1',
      studentName: 'আরিফ হোসেন'
    },
    {
      id: 'notif-asgn-2',
      title: 'অ্যাসাইনমেন্ট ২ উত্তরপত্র জমা (রাফসান)',
      message: 'শিক্ষার্থী রাফসান "React Components & Tailwind Layout" অ্যাসাইনমেন্টে ফাইল আপলোড করে প্রশ্ন কমেন্ট জমা দিয়েছেন।',
      time: '২৫ মিনিট আগে',
      read: false,
      type: 'assignment',
      assignmentId: 'asgn-2',
      submissionId: 'sub-2',
      studentName: 'রাফসান'
    },
    {
      id: 'notif-admin-1',
      title: 'PTENit এডমিন অফিশিয়াল গাইডলাইন নোটিশ',
      message: 'সম্মানিত কোর্স ইনস্ট্রাক্টরবৃন্দ, নতুন ব্যাচের মডিউল, লেকচার স্লাইড ও কুইজ সম্পর্কিত নির্দেশিকা প্রকাশ করা হলো।',
      time: '১ ঘন্টা আগে',
      read: false,
      type: 'admin'
    },
    {
      id: 'notif-admin-2',
      title: 'ক্লাস শিডিউল ও রেজাল্ট সিস্টেম আপডেট',
      message: 'আগামী সেমিস্টারের ক্লাস রুটিং টিচার প্যানেলে যুক্ত করা হয়েছে।',
      time: '২ ঘন্টা আগে',
      read: false,
      type: 'admin'
    }
  ]);

  // Sound Synthesizer for Notifications & Offer Actions
  const playChimeSound = (type: 'notification' | 'accept' | 'decline' = 'notification') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === 'notification') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12); // A5
        gain2.gain.setValueAtTime(0.25, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.6);
      } else if (type === 'accept') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.45);
        });
      } else if (type === 'decline') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [hasPlayedOfferSound, setHasPlayedOfferSound] = useState(false);

  // Format and Clean Module Titles (Remove redundant 'Module 1:' or 'মডিউল ১:' double language)
  const formatCleanModuleTitle = (title?: string, index?: number) => {
    if (!title) return typeof index === 'number' ? `মডিউল ${index + 1}` : 'মডিউল';
    const clean = title.replace(/^(?:Module|মডিউল)\s*[\d০-৯]+\s*[:\-–]\s*/i, '').trim();
    return typeof index === 'number' ? `মডিউল ${index + 1}: ${clean || title}` : (clean || title);
  };

  // Format and Clean Lesson Titles (Guarantee clean 'লেসন ০১: ...' everywhere)
  const formatCleanLessonTitle = (title?: string, index?: number) => {
    if (!title) return typeof index === 'number' ? `লেসন ${index + 1 < 10 ? '০' + (index + 1) : index + 1}` : 'লেসন';
    const clean = title.replace(/^(?:Lesson|লেসন|ক্লাস|Class)\s*[\d০-৯]+\s*[:\-–]\s*/i, '').trim();
    if (typeof index === 'number') {
      const num = index + 1;
      const bengaliNum = num < 10 ? `০${num}` : `${num}`;
      return `লেসন ${bengaliNum}: ${clean || title}`;
    }
    return clean || title;
  };

  // Video File Upload Handler with Auto-Duration Detection
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLessonVideoFileName(file.name);
      try {
        const objectUrl = URL.createObjectURL(file);
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.src = objectUrl;
        tempVideo.onloadedmetadata = () => {
          const sec = Math.round(tempVideo.duration);
          if (sec && !isNaN(sec) && isFinite(sec)) {
            const mins = Math.floor(sec / 60);
            const secs = sec % 60;
            setLessonDuration(`${mins}:${secs < 10 ? '0' : ''}${secs} মিনিট`);
          }
          URL.revokeObjectURL(objectUrl);
        };
      } catch (err) {
        console.warn('Could not auto-extract video duration', err);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLessonVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // File Upload Handler (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, setName?: (name: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (setName) setName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload Handler
  const handleAddVideoLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourse = courses.find(c => c.id === selectedManageCourseId);
    if (!targetCourse || !lessonTitle.trim()) return;

    let currentModules = targetCourse.modules ? [...targetCourse.modules] : [];
    let targetModuleId = lessonModuleId;

    if (lessonModuleId !== 'new' && !lessonModuleId && currentModules.length > 0) {
      alert('দয়া করে একটি মডিউল নির্বাচন করুন অথবা নতুন মডিউল তৈরি করুন।');
      return;
    }

    // Create module if "new" is selected or no modules exist
    if (!targetModuleId || targetModuleId === 'new' || currentModules.length === 0) {
      const modTitle = newModuleName.trim() || `মডিউল ${currentModules.length + 1}: লেসন ভিডিও সিরিজ`;
      const newModuleObj = {
        id: `mod-${Date.now()}`,
        courseId: targetCourse.id,
        title: modTitle,
        lessons: [],
        order: currentModules.length + 1
      };
      currentModules.push(newModuleObj);
      targetModuleId = newModuleObj.id;
    }

    const finalVideoUrl = lessonVideoUrl.trim() || "https://www.youtube.com/embed/dQw4w9WgXcQ";

    const newLessonObj = {
      id: `les-${Date.now()}`,
      courseId: targetCourse.id,
      moduleId: targetModuleId,
      title: lessonTitle.trim(),
      duration: lessonDuration.trim() || '15 mins',
      videoUrl: finalVideoUrl,
      pdfResourceUrl: lessonResourceUrl || undefined,
      content: lessonResourceName ? `নোটস: ${lessonResourceName}` : undefined,
      isFreePreview: false,
      order: Date.now()
    };

    currentModules = currentModules.map(m => {
      if (m.id === targetModuleId) {
        return {
          ...m,
          lessons: [...(m.lessons || []), newLessonObj]
        };
      }
      return m;
    });

    const totalLessons = currentModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

    updateCourse(targetCourse.id, {
      modules: currentModules,
      lessonsCount: totalLessons
    });

    // Automatic task creation for every single lesson/video with exact module & lesson number info
    const modIdxForTask = currentModules.findIndex(m => m.id === targetModuleId);
    const modObjForTask = currentModules.find(m => m.id === targetModuleId);
    const modNameForTask = modObjForTask
      ? formatCleanModuleTitle(modObjForTask.title, modIdxForTask >= 0 ? modIdxForTask : undefined)
      : `মডিউল ${currentModules.length}`;
    const lesIdxInMod = (modObjForTask?.lessons?.length || 1) - 1;
    const lesCleanTitleForTask = formatCleanLessonTitle(lessonTitle.trim(), lesIdxInMod);

    const autoTaskTitle = lessonTaskTitle.trim() || `${modNameForTask} • ${lesCleanTitleForTask} - অনুশীলন ও প্র্যাকটিস টাস্ক`;
    const autoTaskDesc = lessonTaskDesc.trim() || `${modNameForTask}-এর ${lesCleanTitleForTask} ভিডিও টিউটোরিয়াল দেখে অনুশীলন সম্পন্ন করে সমাধান ফাইল বা নোট জমা দিন।`;
    const autoTaskDueDate = lessonTaskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const autoTaskPoints = Number(lessonTaskPoints) || 50;

    const finalTaskAttachmentUrl = lessonTaskAttachmentUrl || lessonTaskReferenceLink.trim() || lessonResourceUrl || undefined;
    const finalTaskAttachmentName = lessonTaskAttachmentName || (lessonTaskReferenceLink.trim() ? 'রেফারেন্স লিংক' : (lessonResourceName || undefined));

    addAssignment({
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      instructorId: currentUser?.id,
      title: autoTaskTitle,
      description: autoTaskDesc,
      dueDate: autoTaskDueDate,
      totalPoints: autoTaskPoints,
      attachmentName: finalTaskAttachmentName,
      attachmentUrl: finalTaskAttachmentUrl
    });

    setLessonTaskTitle('');
    setLessonTaskDesc('');
    setLessonTaskDueDate('');
    setLessonTaskPoints('50');
    setLessonTaskAttachmentName('');
    setLessonTaskAttachmentUrl('');
    setLessonTaskReferenceLink('');
    setIncludeLessonTask(false);
    setLessonSuccessMsg('নতুন লেসন ভিডিও এবং সংশ্লিষ্ট অনুশীলন টাস্ক সফলভাবে যুক্ত করা হয়েছে!');

    if (targetModuleId) {
      setExpandedManageModules(prev => ({
        ...prev,
        [targetModuleId]: true
      }));
    }

    setLessonTitle('');
    setLessonVideoUrl('');
    setLessonVideoFileName('');
    setLessonResourceName('');
    setLessonResourceUrl('');
    setNewModuleName('');
    setTimeout(() => setLessonSuccessMsg(''), 4000);
  };

  const handleDeleteLesson = (courseId: string, moduleId: string, lessonId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: (m.lessons || []).filter(l => l.id !== lessonId)
        };
      }
      return m;
    });

    const totalLessons = updatedModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

    updateCourse(courseId, {
      modules: updatedModules,
      lessonsCount: totalLessons
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgnTitle || !selectedCourseId) return;

    const courseObj = courses.find(c => c.id === selectedCourseId);

    addAssignment({
      courseId: selectedCourseId,
      courseTitle: courseObj?.title || 'General Course',
      instructorId: currentUser?.id,
      title: asgnTitle,
      description: asgnDesc,
      dueDate: asgnDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalPoints: Number(asgnPoints) || 50,
      attachmentName: asgnAttachmentName,
      attachmentUrl: asgnAttachmentUrl
    });

    setAsgnTitle('');
    setAsgnDesc('');
    setAsgnDueDate('');
    setAsgnAttachmentName('');
    setAsgnAttachmentUrl('');
    setShowCreateModal(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission) {
      gradeSubmission(selectedSubmission.id, gradePoints, gradeFeedback);
      if (gradeLinkUrl) {
        updateSubmission(selectedSubmission.id, { linkUrl: gradeLinkUrl });
      }
      setSelectedSubmission(null);
    }
  };

  const handleSendAgainRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!againModalSub) return;
    const asgn = assignments.find(a => a.id === againModalSub.assignmentId);
    const lessonInfo = getAssignmentLessonInfo(asgn);
    const currentLessonName = lessonInfo.lessonNo || asgn?.lessonNo || 'এই লেসন';
    const feedbackMsg = `⚠️ [${currentLessonName} পুনরায় সম্পন্ন করুন]: ${againReason || 'কাজটি সঠিকভাবে সম্পন্ন হয়নি। অনুগ্রহ করে লেসনটি পুনরায় প্র্যাকটিস করে জমা দিন।'}`;
    
    updateSubmission(againModalSub.id, {
      status: 'returned',
      points: 0,
      feedback: feedbackMsg
    });

    if (sendCentralNotification) {
      sendCentralNotification({
        title: `🔄 ${currentLessonName} পুনরায় জমা দেওয়ার নির্দেশ`,
        message: `${againModalSub.studentName}, আপনার "${asgn?.courseTitle || 'কোর্স'}" এর ${currentLessonName} কাজটি সন্তোষজনক না হওয়ায় পুনরায় সম্পন্ন করতে বলা হয়েছে। কারণ: "${againReason || 'সংশোধন করে জমা দিন'}"`,
        type: 'warning',
        category: 'mentor'
      });
    }

    setAgainModalSub(null);
    setAgainReason('');
  };

  const handleDeleteSubmission = (subId: string) => {
    deleteSubmission(subId);
    setDeleteConfirmSubId(null);
    if (selectedSubmission?.id === subId) {
      setSelectedSubmission(null);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      title: profileTitle,
      mobile: profilePhone,
      bio: profileBio,
      institution: profileInstitution,
      avatar: profileAvatar
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleIssueCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudentId || !certCourseId) return;
    const newCert = issueCertificate(certStudentId, certCourseId);
    if (newCert) {
      setCertSuccessMsg(`সার্টিফিকেটটি সফলভাবে তৈরি করা হয়েছে! সার্টিফিকেট কোড: ${newCert.certificateCode}`);
      setTimeout(() => setCertSuccessMsg(''), 5000);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || !withdrawAccount) return;

    if (requestTeacherPayout) {
      requestTeacherPayout({
        teacherId: currentUser?.id || 'teacher-1',
        teacherName: currentUser?.name || 'তানভীর আহমেদ',
        teacherEmail: currentUser?.email || 'teacher@ptenit.com',
        amount: amt,
        paymentMethod: withdrawMethod === 'bkash' ? 'bKash' : withdrawMethod === 'nagad' ? 'Nagad' : 'Bank Transfer',
        accountNumber: withdrawAccount,
        note: 'ইনস্ট্রাক্টর ক্যাশআউট উইথড্র রিকোয়েস্ট'
      });
    }

    setWithdrawAmount('');
    setWithdrawAccount('');
    setWithdrawSuccessMsg('উইথড্র রিকোয়েস্ট সফলভাবে জমা দেওয়া হয়েছে! এডমিন যাচাই শেষে আপনার একাউন্টে টাকা পৌছে যাবে।');
    setTimeout(() => setWithdrawSuccessMsg(''), 5000);
  };

  // Offered & Active Courses - show all admin course offers to trainers
  const offeredCourses = courses.filter(c => c.offerStatus === 'offered');

  // Auto countdown for live offer banner
  useEffect(() => {
    if (offeredCourses.length === 0) return;
    const interval = setInterval(() => {
      setOfferCountdown(prev => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [offeredCourses.length]);

  // Helper to extract or detect links from a submission (URLs, GitHub, Figma, Drive, Live Web)
  const getSubmissionLinks = (sub: AssignmentSubmission) => {
    const links: { title: string; url: string; type: 'github' | 'figma' | 'drive' | 'web' }[] = [];
    
    if (sub.linkUrl) {
      let type: 'github' | 'figma' | 'drive' | 'web' = 'web';
      if (sub.linkUrl.includes('github.com')) type = 'github';
      else if (sub.linkUrl.includes('figma.com')) type = 'figma';
      else if (sub.linkUrl.includes('drive.google.com')) type = 'drive';
      links.push({
        title: sub.linkTitle || (type === 'github' ? 'GitHub Repo' : type === 'figma' ? 'Figma Design' : type === 'drive' ? 'Google Drive' : 'লাইভ লিংক'),
        url: sub.linkUrl,
        type
      });
    }

    if (sub.fileUrl && (sub.fileUrl.startsWith('http://') || sub.fileUrl.startsWith('https://')) && !sub.fileUrl.match(/\.(mp3|wav|zip|pdf|docx|png|jpg|jpeg)$/i)) {
      if (!links.some(l => l.url === sub.fileUrl)) {
        let type: 'github' | 'figma' | 'drive' | 'web' = 'web';
        if (sub.fileUrl.includes('github.com')) type = 'github';
        else if (sub.fileUrl.includes('figma.com')) type = 'figma';
        else if (sub.fileUrl.includes('drive.google.com')) type = 'drive';
        links.push({
          title: type === 'github' ? 'GitHub কোড' : type === 'figma' ? 'Figma ফাইল' : type === 'drive' ? 'ড্রাইভ লিংক' : 'প্রজেক্ট লিংক',
          url: sub.fileUrl,
          type
        });
      }
    }

    // Extract any http/https URLs mentioned in the written submission text
    if (sub.submissionText) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matched = sub.submissionText.match(urlRegex);
      if (matched) {
        matched.forEach(url => {
          if (!links.some(l => l.url === url)) {
            let type: 'github' | 'figma' | 'drive' | 'web' = 'web';
            if (url.includes('github.com')) type = 'github';
            else if (url.includes('figma.com')) type = 'figma';
            else if (url.includes('drive.google.com')) type = 'drive';
            links.push({
              title: type === 'github' ? 'GitHub' : type === 'figma' ? 'Figma' : type === 'drive' ? 'Drive' : 'ওয়েব লিংক',
              url,
              type
            });
          }
        });
      }
    }

    return links;
  };

  // Helper to calculate student's task progress for their course (how many tasks done vs total)
  const getStudentCourseProgress = (studentId?: string, studentEmail?: string, assignmentId?: string) => {
    const asgn = assignments.find(a => a.id === assignmentId);
    const targetCourseId = asgn?.courseId;
    
    // Course assignments list
    const courseAsgns = targetCourseId 
      ? assignments.filter(a => a.courseId === targetCourseId)
      : (asgn ? [asgn] : []);
    
    // Total course tasks (matches course assignments count, default min 2 for realistic progression)
    const totalTasks = Math.max(courseAsgns.length, 2);

    // Submissions belonging to this student in this course
    const studentSubs = submissions.filter(s => 
      ((studentId && s.studentId === studentId) || (studentEmail && s.studentEmail === studentEmail)) &&
      (courseAsgns.some(a => a.id === s.assignmentId) || s.assignmentId === assignmentId)
    );

    const gradedSubs = studentSubs.filter(s => s.status === 'graded');
    const completedTasks = gradedSubs.length;
    const isAllCompleted = completedTasks >= totalTasks;
    const remainingTasks = Math.max(0, totalTasks - completedTasks);
    const progressPercent = Math.min(100, Math.round((completedTasks / totalTasks) * 100));

    return {
      totalTasks,
      completedTasks,
      submittedTasks: studentSubs.length,
      remainingTasks,
      isAllCompleted,
      progressPercent
    };
  };

  const getAssignmentLessonInfo = (asgn?: Assignment) => {
    if (!asgn) {
      return {
        lessonNo: 'লেসন নং ১',
        taskTitle: 'কোর্স অ্যাসাইনমেন্ট টাস্ক',
        taskDesc: 'প্রদত্ত লেসনের নির্দেশনা অনুযায়ী টাস্ক সম্পন্ন করে ফাইল বা সমাধান জমা দিন।'
      };
    }

    if (asgn.lessonNo) {
      return {
        lessonNo: asgn.lessonNo,
        taskTitle: asgn.title,
        taskDesc: asgn.description || 'প্রদত্ত লেসনের নির্দেশনা অনুযায়ী টাস্ক সম্পন্ন করে ফাইল বা সমাধান জমা দিন।'
      };
    }

    const match = asgn.title.match(/(লেসন\s*\d+|Lesson\s*\d+)/i);
    if (match) {
      return {
        lessonNo: match[0],
        taskTitle: asgn.title,
        taskDesc: asgn.description || 'প্রদত্ত লেসনের নির্দেশনা অনুযায়ী টাস্ক সম্পন্ন করে ফাইল বা সমাধান জমা দিন।'
      };
    }

    const courseAsgns = assignments.filter(a => a.courseId === asgn.courseId);
    const idx = courseAsgns.findIndex(a => a.id === asgn.id);
    const lessonNo = idx >= 0 ? `লেসন নং ${idx + 1}` : 'লেসন নং ১';
    return {
      lessonNo,
      taskTitle: asgn.title,
      taskDesc: asgn.description || 'প্রদত্ত লেসনের নির্দেশনা অনুযায়ী টাস্ক সম্পন্ন করে ফাইল বা সমাধান জমা দিন।'
    };
  };

  const teacherCourses = courses.length > 0 ? courses : [];

  // Workflow Categorization:
  // 1. নতুন (New): status === 'submitted' or status === 'new'
  // 2. রিভিউ (Review): under_review or review or returned
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'new');
  const reviewSubmissions = submissions.filter(s => 
    s.status === 'under_review' || 
    s.status === 'review' || 
    s.status === 'returned' ||
    (s.status === 'graded' && !getStudentCourseProgress(s.studentId, s.studentEmail, s.assignmentId).isAllCompleted)
  );
  const totalGraded = submissions.filter(s => 
    s.status === 'graded' && getStudentCourseProgress(s.studentId, s.studentEmail, s.assignmentId).isAllCompleted
  );

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 py-4 sm:py-8 transition-colors font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Teacher Profile Header Banner & Menubar (Hidden when hideHeader is true) */}
        {!hideHeader && (
          <>
        {/* Teacher Profile Header Banner */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-slate-900 shadow-sm border border-slate-200 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
            <div className="relative group shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser?.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-2 sm:border-4 border-slate-100 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#006A4E] border-2 border-white flex items-center justify-center text-xs text-white shadow-xs" title="Active Teacher">
                ✓
              </span>
            </div>

            <div className="space-y-1.5 flex-1 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-3xl font-black text-slate-900">{currentUser?.name}</h1>
                <span className="bg-emerald-50 text-[#006A4E] border border-emerald-200 text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#006A4E]" /> স্পেশালিস্ট ড্যাশবোর্ড
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">{currentUser?.title || 'ইনস্ট্রাক্টর ও কোর্স মেন্টর'}</p>
              <p className="text-slate-500 text-[11px] sm:text-xs">{currentUser?.institution || 'PTENit IT Training Academy'}</p>
            </div>

            {/* Action Suite: Controls, Directives, Notification, Message, Settings */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 font-bengali">
              
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="ভাষা পরিবর্তন / Switch Language"
              >
                <Globe className="w-4 h-4 text-[#006A4E]" />
                <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
              </button>

              {/* Night Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 sm:p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs flex items-center justify-center cursor-pointer transition-all text-xs"
                title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>

              {/* Main Site Link */}
              <button
                onClick={() => setActiveTab?.('home')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="মূল ওয়েবসাইট"
              >
                <Globe className="w-4 h-4 text-[#006A4E]" />
                <span className="hidden md:inline">{t('হোম পেইজ', 'Home Page')}</span>
              </button>

              {/* Marketplace Projects Link */}
              <button
                onClick={() => setActiveTab?.('marketplace')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-[#006A4E] hover:bg-[#047857] text-white border border-[#006A4E] rounded-xl sm:rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all font-black text-xs"
                title="মার্কেটপ্লেস ও ডেসপ্যাচ জবস"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span className="hidden md:inline">মার্কেটপ্লেস জবস</span>
              </button>

              {/* Profile Policy & Directives Button */}
              <button
                onClick={() => setShowDirectivesModal(true)}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                title="টিচার পলিসি ও এডমিন নির্দেশিকা"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">পলিসি & নির্দেশিকা</span>
              </button>

              {/* Profile Notification Button & Floating Dock Window */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTeacherMsgPop(false);
                    setShowTeacherNotifPop(!showTeacherNotifPop);
                  }}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl sm:rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                  title="টিচার নোটিফিকেশন"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="hidden md:inline">নোটিফিকেশন</span>
                  {teacherNotificationsList.filter(n => !n.read).length > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-[#E11D48] text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse border border-white">
                      {teacherNotificationsList.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Floating Facebook Lite / Messenger Style Notification Dock Window */}
                {showTeacherNotifPop && (
                  <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[460px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-amber-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                            <Bell className="w-4 h-4 text-amber-400" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>টিচার নোটিফিকেশন সেন্টার</span>
                            {teacherNotificationsList.filter(n => !n.read).length > 0 ? (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                                {teacherNotificationsList.filter(n => !n.read).length} অপঠিত
                              </span>
                            ) : (
                              <span className="text-[9px] bg-blue-500/20 text-sky-400 px-1.5 py-0.2 rounded font-bold">
                                সব দেখা হয়েছে ✓
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-amber-400">এডমিন, ট্রেইনার ও স্টুডেন্ট অ্যাক্টিভিটি আপডেট</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          onClick={() => {
                            setTeacherNotificationsList(prev => prev.map(item => ({ ...item, read: true })));
                            markAllNotificationsRead?.();
                          }}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        >
                          সব পঠিত ✓
                        </button>
                        <button
                          onClick={() => setShowTeacherNotifPop(false)}
                          className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="বন্ধ করুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter & Toggle Controls Bar */}
                    <div className="p-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] font-bold">
                      <span className="text-slate-400 shrink-0 px-1">ফিল্টার:</span>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, admin: !prev.admin }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.admin
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="এডমিন নোটিশ চালু/বন্ধ করুন"
                      >
                        <span>👑 এডমিন {teacherNotifToggles.admin ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, expert: !prev.expert }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.expert
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="ট্রেইনার/এক্সপার্ট আপডেট চালু/বন্ধ করুন"
                      >
                        <span>⚡ এক্সপার্ট {teacherNotifToggles.expert ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, student: !prev.student }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.student
                            ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="স্টুডেন্ট অ্যাক্টিভিটি চালু/বন্ধ করুন"
                      >
                        <span>🎓 স্টুডেন্ট {teacherNotifToggles.student ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, system: !prev.system }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.system
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="সিস্টেম অ্যালার্ট চালু/বন্ধ করুন"
                      >
                        <span>⚙️ সিস্টেম {teacherNotifToggles.system ? '✓' : '✕'}</span>
                      </button>
                    </div>

                    {/* Notification Items List */}
                    <div className="p-3 space-y-2.5 h-72 sm:h-96 overflow-y-auto bg-slate-950/50">
                      {teacherNotificationsList.filter(n => {
                        const type = (n as any).type || 'admin';
                        if (type === 'admin' && !teacherNotifToggles.admin) return false;
                        if (type === 'expert' && !teacherNotifToggles.expert) return false;
                        if (type === 'assignment' && !teacherNotifToggles.student) return false;
                        if (type === 'system' && !teacherNotifToggles.system) return false;
                        return true;
                      }).length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <Bell className="w-8 h-8 text-amber-500/40 mx-auto" />
                          <p className="text-xs text-slate-400">ফিল্টার ফিল্ড অনুযায়ী কোনো নোটিফিকেশন নেই।</p>
                        </div>
                      ) : (
                        teacherNotificationsList
                          .filter(n => {
                            const type = (n as any).type || 'admin';
                            if (type === 'admin' && !teacherNotifToggles.admin) return false;
                            if (type === 'expert' && !teacherNotifToggles.expert) return false;
                            if (type === 'assignment' && !teacherNotifToggles.student) return false;
                            if (type === 'system' && !teacherNotifToggles.system) return false;
                            return true;
                          })
                          .map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                setTeacherNotificationsList(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                markNotificationRead?.(n.id);
                                if (n.targetTab && n.targetTab !== 'teacher-dashboard' && setActiveTab) {
                                  setActiveTab(n.targetTab);
                                } else {
                                  setExpandedNotifId(prev => prev === n.id ? null : n.id);
                                }
                              }}
                              className={`p-3 rounded-2xl text-xs cursor-pointer transition-all ${
                                n.read
                                  ? 'bg-slate-800/40 border border-slate-800 text-slate-400'
                                  : 'bg-slate-800 border border-amber-500/30 text-white shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1 gap-2">
                                <p className="font-bold text-white text-[12px] flex items-center gap-1.5 truncate">
                                  {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0 border border-amber-500/20">
                                  {expandedNotifId === n.id ? 'সংক্ষিপ্ত ▲' : 'বিস্তারিত ▼'}
                                </span>
                              </div>
                              <p className={`text-[11px] leading-relaxed ${expandedNotifId === n.id ? 'whitespace-pre-wrap text-slate-200' : 'line-clamp-2 text-slate-300'}`}>
                                {n.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                                <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                                {(n as any).type === 'assignment' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTabState('assignments');
                                      setShowTeacherNotifPop(false);
                                      const matched = submissions.find(s => s.id === (n as any).submissionId) || submissions[0];
                                      if (matched) {
                                        setSelectedSubmission(matched);
                                        setGradePoints(matched.points || 50);
                                        setGradeFeedback(matched.feedback || '');
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                  >
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>অ্যাসাইনমেন্টে যান</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Message Button & Attached Facebook Messenger-style Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTeacherNotifPop(false);
                    const nextState = !showTeacherMsgPop;
                    setShowTeacherMsgPop(nextState);
                    if (nextState) {
                      // Mark all unread messages as read when opening messenger
                      setTeacherChatList(prev => prev.map(m => ({ ...m, read: true })));
                    }
                  }}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-sky-300 hover:text-sky-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                  title="মেসেজ ও ইনবক্স"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline">মেসেজ</span>
                  {teacherChatList.filter(m => !m.isTeacher && !m.read).length > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                      {teacherChatList.filter(m => !m.isTeacher && !m.read).length}
                    </span>
                  )}
                </button>

                {/* Floating Facebook Messenger / FB Lite Style Bottom Dock Window */}
                {showTeacherMsgPop && (
                  <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[440px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-sky-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                    {/* Hidden Native File Input for attaching any document/file/image */}
                    <input
                      type="file"
                      ref={chatFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setChatAttachedFile({
                              name: file.name,
                              url: event.target?.result as string,
                              type: file.type
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />

                    {/* Facebook Messenger Header Bar */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/40">
                            {activeChatSender === 'PTENit Admin' ? 'A' : 'C'}
                          </div>
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{activeChatSender}</span>
                            <span className="text-[9px] bg-blue-500/20 text-sky-400 px-1.5 py-0.2 rounded font-semibold">অনলাইন</span>
                          </h4>
                          <p className="text-[10px] text-sky-400">লাইভ চ্যাট & ডাইরেক্ট ইনবক্স</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          onClick={() => setTeacherChatList(prev => prev.map(m => ({ ...m, read: true })))}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                          title="সকল বার্তা পঠিত হিসেবে চিহ্নিত করুন"
                        >
                          সব পঠিত ✓
                        </button>
                        <button
                          onClick={() => setShowTeacherMsgPop(false)}
                          className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="বন্ধ করুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sender Selector Bar with Full On/Off Toggles */}
                    <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none">
                      {['PTENit Admin', 'অ্যাকাডেমিক ক্লায়েন্ট সাপোর্ট', 'শিক্ষার্থী কমিউনিটি'].map((sender) => {
                        const unreadCount = teacherChatList.filter(m => m.sender === sender && !m.isTeacher && !m.read).length;
                        return (
                          <button
                            key={sender}
                            onClick={() => {
                              setActiveChatSender(sender);
                              setTeacherChatList(prev => prev.map(m => m.sender === sender ? { ...m, read: true } : m));
                            }}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              activeChatSender === sender
                                ? 'bg-sky-500 text-slate-950 shadow'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span>{sender}</span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-rose-600 text-white font-black rounded-full animate-pulse">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                      
                      {/* On/Off Category Toggles */}
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, admin: !prev.admin }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.admin ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="এডমিন বার্তা ফিল্টার অন/অফ"
                      >
                        এডমিন {teacherMsgToggles.admin ? '✓' : '✕'}
                      </button>
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, support: !prev.support }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.support ? 'bg-indigo-500/20 text-sky-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="সাপোর্ট বার্তা ফিল্টার অন/অফ"
                      >
                        সাপোর্ট {teacherMsgToggles.support ? '✓' : '✕'}
                      </button>
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, student: !prev.student }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.student ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="স্টুডেন্ট বার্তা ফিল্টার অন/অফ"
                      >
                        স্টুডেন্ট {teacherMsgToggles.student ? '✓' : '✕'}
                      </button>
                    </div>

                    {/* Chat Thread Area */}
                    <div className="p-3 space-y-2.5 h-64 sm:h-72 overflow-y-auto bg-slate-950/50">
                      {teacherChatList
                        .filter(m => m.sender === activeChatSender || (m.isTeacher && m.text.includes(activeChatSender)))
                        .length === 0 ? (
                          <div className="text-center py-10 space-y-2">
                            <MessageSquare className="w-8 h-8 text-sky-500/40 mx-auto" />
                            <p className="text-xs text-slate-400">{activeChatSender}-এর সাথে চ্যাট শুরু করুন।</p>
                          </div>
                        ) : (
                          teacherChatList
                            .filter(m => m.sender === activeChatSender || (m.isTeacher && m.text.includes(activeChatSender)))
                            .map(msg => (
                              <div
                                key={msg.id}
                                onClick={() => {
                                  setTeacherChatList(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                                }}
                                className={`p-2.5 rounded-2xl text-xs space-y-1 cursor-pointer hover:opacity-95 transition-all max-w-[88%] ${
                                  msg.isTeacher
                                    ? 'bg-slate-950/90 border border-blue-500/30 text-blue-100 ml-auto text-right'
                                    : 'bg-slate-800 border border-sky-500/30 text-slate-100 mr-auto text-left shadow-sm'
                                }`}
                              >
                                <div className="flex justify-between items-center gap-2">
                                  <span className="font-bold text-white text-[10px]">{msg.sender}</span>
                                  <span className="text-[9px] text-slate-400">{msg.time}</span>
                                </div>
                                <p className="text-[11px] leading-relaxed">{msg.text}</p>
                                {(msg as any).imageUrl && (
                                  <div className="mt-1 rounded-xl overflow-hidden border border-slate-700">
                                    <img
                                      src={(msg as any).imageUrl}
                                      alt="Attached file"
                                      className="w-full h-28 object-cover hover:scale-105 transition-transform"
                                    />
                                  </div>
                                )}
                                {(msg as any).fileName && (
                                  <a
                                    href={(msg as any).fileUrl || '#'}
                                    download={(msg as any).fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1.5 p-2 bg-slate-900/90 rounded-xl border border-sky-500/40 flex items-center gap-2 hover:bg-slate-800 transition-all text-sky-300 text-[11px] font-semibold"
                                  >
                                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                                    <span className="truncate flex-1 font-mono">{(msg as any).fileName}</span>
                                    <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                  </a>
                                )}
                              </div>
                            ))
                        )}
                    </div>

                    {/* Attached Local File Preview Bar */}
                    {chatAttachedFile && (
                      <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-sky-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{chatAttachedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setChatAttachedFile(null)}
                          className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Input Footer */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatInputText.trim() && !chatAttachedFile) return;
                        const isImg = chatAttachedFile?.type?.startsWith('image/') || (chatAttachedFile?.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(chatAttachedFile.name));
                        setTeacherChatList([
                          ...teacherChatList,
                          {
                            id: String(Date.now()),
                            sender: currentUser?.name || 'টিচার',
                            text: chatInputText.trim() ? `${chatInputText.trim()} (${activeChatSender}-কে)` : `ফাইল/ছবি সংযুক্ত বার্তা (${activeChatSender}-কে)`,
                            time: 'এখনই',
                            isTeacher: true,
                            read: true,
                            imageUrl: isImg ? chatAttachedFile?.url : undefined,
                            fileName: chatAttachedFile?.name,
                            fileUrl: chatAttachedFile?.url
                          }
                        ]);
                        setChatInputText('');
                        setChatAttachedFile(null);
                        playChimeSound('notification');
                      }}
                      className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          chatAttachedFile ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-400 hover:bg-slate-700'
                        }`}
                        title="যে কোনো ফাইল বা ছবি (PDF, Doc, Image) যুক্ত করুন"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder={`${activeChatSender}-কে লিখুন...`}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">পাঠান</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Settings Option Button */}
              <button
                onClick={() => setShowTeacherSettingsModal(true)}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-sky-300 hover:text-blue-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                title="প্রোফাইল সেটিং, অ্যাকাউন্ট ও সিকিউরিটি"
              >
                <Settings className="w-4 h-4 text-sky-400" />
                <span>সেটিংস</span>
              </button>

              {/* Create Assignment CTA */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[#006A4E] to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন অ্যাসাইনমেন্ট দিন</span>
              </button>
            </div>
          </div>

          {/* LIVE OFFER & ORDER NOTIFICATION BANNER INSIDE COVER SECTION */}
          {offeredCourses.length > 0 && (
            <div className="relative z-20 mt-1.5 sm:mt-3 w-full max-w-2xl mx-auto animate-slideUp font-bengali">
              {(() => {
                const safeOfferIndex = currentOfferIndex % offeredCourses.length;
                const offerCourse = offeredCourses[safeOfferIndex] || offeredCourses[0];
                const coursePrice = offerCourse.price || 9500;
                const teacherEarnings = Math.round(coursePrice * ((offerCourse.teacherCommissionRate || 90) / 100));
                const totalModules = offerCourse.targetModules || (offerCourse.modules?.length || 4);
                const totalLessons = offerCourse.targetLessons || 20;
                const timerPercentage = (offerCountdown / 45) * 100;

                return (
                  <div>
                    {/* 1. CENTERED AUTO-SEARCH STYLE LIVE TEXT WITH SEQUENTIAL ANIMATED DOTS */}
                    <div className="flex items-center justify-center gap-2 mb-2 px-3 py-1 text-slate-700 text-[11px] sm:text-xs font-semibold w-fit mx-auto select-none">
                      <div className="relative flex items-center justify-center">
                        <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-60" />
                      </div>
                      <span className="text-slate-800 font-bold tracking-tight flex items-center">
                        <span>নতুন অর্ডার এসেছে</span>
                        <span className="inline-flex items-center ml-0.5 font-black text-[#006A4E] tracking-wider">
                          <span className="animate-pulse inline-block" style={{ animationDelay: "0ms", animationDuration: "1s" }}>.</span>
                          <span className="animate-pulse inline-block" style={{ animationDelay: "200ms", animationDuration: "1s" }}>.</span>
                          <span className="animate-pulse inline-block" style={{ animationDelay: "400ms", animationDuration: "1s" }}>.</span>
                        </span>
                      </span>
                    </div>

                    {/* 2. 3D COMPACT ORDER CARD (REDUCED HEIGHT, EXPANDED WIDTH, CRISP TYPOGRAPHY) */}
                    <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-blue-50/20 rounded-2xl sm:rounded-3xl border-t-2 border-l-2 border-r-2 border-b-4 border-slate-200 hover:border-sky-300 shadow-[0_12px_28px_-8px_rgba(16,185,129,0.14),0_4px_12px_-2px_rgba(0,0,0,0.05)] p-3 sm:p-3.5 text-slate-800 transition-all font-bengali">
                      {/* Ambient Top Glow Line */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-400" />

                      {/* Row 1: Sender Profile & Multi-Order Switcher */}
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 mt-0.5">
                        {/* Sender Info */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80"
                              alt="PTENit"
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#006A4E] shadow-xs"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs sm:text-[13px] font-black text-slate-900 truncate">
                                PTENit IT Academy
                              </span>
                              <BadgeCheck className="w-3.5 h-3.5 text-[#006A4E] shrink-0" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-blue-700 font-bold block leading-none">
                              মেইন এডমিন • লাইভ কোর্স অফার
                            </span>
                          </div>
                        </div>

                        {/* Right: Multi-Order Switcher */}
                        {offeredCourses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setCurrentOfferIndex((curr) => (curr + 1) % offeredCourses.length)}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs shrink-0"
                            title="অন্যান্য কোর্স অফার দেখুন"
                          >
                            <span className="font-mono">{offeredCourses.length}</span>
                            <span>অর্ডার</span>
                            <ChevronRight className="w-3 h-3 text-blue-700" />
                          </button>
                        )}
                      </div>

                      {/* Row 2: Course Title & Clean Tags (No Borders, Light Soft Backgrounds) */}
                      <div className="py-1.5 sm:py-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1" title={offerCourse.title}>
                          {offerCourse.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] sm:text-[11px] font-medium">
                          <span className="px-2 py-0.5 bg-sky-50/80 text-sky-700 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sky-600" />
                            <span>{totalLessons}টি লেসন</span>
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-50/80 text-indigo-700 rounded-md flex items-center gap-1">
                            <Layers className="w-3 h-3 text-indigo-600" />
                            <span>{totalModules}টি মডিউল</span>
                          </span>
                          <span className="px-2 py-0.5 bg-purple-50/80 text-purple-700 rounded-md flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-purple-600" />
                            <span>{offerCourse.category || "UI/UX"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Compact Earnings Box With Subtle Dashed Border */}
                      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50/90 border border-dashed border-slate-300 dark:border-slate-700 mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                            <Banknote className="w-4 h-4 text-rose-600" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-bold block leading-none">অর্ডার বাজেট</span>
                            <span className="text-xs sm:text-sm font-black font-mono text-slate-800 leading-tight">
                              ৳{coursePrice.toLocaleString("bn-BD")}
                            </span>
                          </div>
                        </div>
                        <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-2.5 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-rose-600 font-bold block leading-none">আপনার আয় (৯০%)</span>
                            <span className="text-sm sm:text-base font-black font-mono text-blue-700 leading-tight">
                              ৳{teacherEarnings.toLocaleString("bn-BD")}
                            </span>
                          </div>
                          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#047857] text-white text-[8px] font-black rounded">
                            ইনস্ট্যান্ট
                          </span>
                        </div>
                      </div>

                      {/* Row 4: 2 Equal Action Buttons With Countdown in the Middle */}
                      <div className="flex items-center gap-2">
                        {/* বিস্তারিত Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedDetailCourse(offerCourse)}
                          className="flex-1 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-500" />
                          <span>বিস্তারিত</span>
                        </button>

                        {/* Center Countdown Badge */}
                        <div className="flex items-center gap-1 font-mono text-[11px] text-amber-700 font-black bg-amber-50 px-2 py-1.5 rounded-xl shrink-0 select-none">
                          <Clock className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
                          <span>{offerCountdown}s</span>
                        </div>

                        {/* রিসিভ করুন Button */}
                        <button
                          type="button"
                          onClick={() => {
                            acceptCourseOffer(offerCourse.id, currentUser?.id, currentUser?.name);
                            playChimeSound("accept");
                            setOfferToastMsg(`🎉 "${offerCourse.title}" অর্ডার রিসিভ করা হয়েছে • ৳${coursePrice.toLocaleString("bn-BD")}`);
                            setTimeout(() => setOfferToastMsg(null), 4000);
                          }}
                          className="flex-1 py-2 px-2.5 bg-[#047857] hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-600/20 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white text-white" />
                          <span>রিসিভ করুন</span>
                        </button>
                      </div>

                      {/* Micro Animated Progress Line */}
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-rose-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-linear"
                          style={{ width: `${timerPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

                                                                                                              {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-700/60">
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মোট কোর্স</span>
              <span className="text-xl sm:text-2xl font-black text-sky-300">{teacherCourses.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মোট অ্যাসাইনমেন্ট</span>
              <span className="text-xl sm:text-2xl font-black text-sky-300">{assignments.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মূল্যায়ন বাকি</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">{pendingSubmissions.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">ইস্যুকৃত সার্টিফিকেট</span>
              <span className="text-xl sm:text-2xl font-black text-[#38BDF8]">{certificates.length} টি</span>
            </div>
          </div>
        </div>

        {/* Full Dashboard Menubar with Header & Extensible Navigation Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-black">ইনস্ট্রাক্টর ড্যাশবোর্ড মেনুবার (Instructor Menubar)</span>
            </div>
          </div>

          <div className="p-2 sm:p-3 flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none">
            {[
              { 
                id: 'courses', 
                label: `কোর্স (${teacherCourses.length}টি)`, 
                icon: BookOpen, 
                onClick: () => setActiveTabState('courses'),
                isActive: activeTab === 'courses',
                badge: null,
                colorClass: 'bg-indigo-600 border-indigo-500'
              },
              { 
                id: 'submissions_new', 
                label: `নতুন (${pendingSubmissions.length})`, 
                icon: AlertCircle, 
                onClick: () => {
                  setActiveTabState('submissions');
                  setAssignmentStatusFilter('new');
                },
                isActive: (activeTab === 'submissions' || activeTab === 'assignments') && assignmentStatusFilter === 'new',
                badge: pendingSubmissions.length > 0 ? pendingSubmissions.length : null,
                colorClass: 'bg-purple-600 border-purple-500'
              },
              { 
                id: 'submissions_review', 
                label: `রিভিউ (${reviewSubmissions.length})`, 
                icon: Clock, 
                onClick: () => {
                  setActiveTabState('submissions');
                  setAssignmentStatusFilter('review');
                },
                isActive: (activeTab === 'submissions' || activeTab === 'assignments') && assignmentStatusFilter === 'review',
                badge: reviewSubmissions.length > 0 ? reviewSubmissions.length : null,
                colorClass: 'bg-amber-600 border-amber-500'
              },
              { 
                id: 'live_classes', 
                label: 'লাইভ ক্লাস', 
                icon: Video, 
                onClick: () => setActiveTabState('live_classes'),
                isActive: activeTab === 'live_classes',
                badge: courses.filter(c => c.liveClassStatus === 'live_now').length > 0 ? 'LIVE' : null,
                colorClass: 'bg-rose-600 border-rose-500'
              },
              { 
                id: 'students', 
                label: `শিক্ষার্থীবৃন্দ (${enrollments.length})`, 
                icon: Users, 
                onClick: () => setActiveTabState('students'),
                isActive: activeTab === 'students',
                badge: null,
                colorClass: 'bg-indigo-600 border-indigo-500'
              },
              { 
                id: 'payments', 
                label: 'পেমেন্ট ও ক্যাশআউট', 
                icon: CreditCard, 
                onClick: () => setActiveTabState('payments'),
                isActive: activeTab === 'payments',
                badge: null,
                colorClass: 'bg-indigo-600 border-indigo-500'
              },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tab.isActive;
              return (
                <button
                  key={tab.id}
                  onClick={tab.onClick}
                  className={`py-2 sm:py-2.5 px-3.5 sm:px-4 font-black text-xs sm:text-sm md:text-base flex items-center gap-2 rounded-xl sm:rounded-2xl transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? `${tab.colorClass} text-white shadow-md font-black ring-2 ring-white/20`
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {!!tab.badge && (
                    <span className={`px-2 py-0.5 text-xs font-black rounded-full ${
                      isActive ? 'bg-white text-slate-900' : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
          </>
        )}

        {/* TAB 0: কোর্স তালিকা (COURSES TAB) */}
        {activeTab === 'courses' && (
          <div className="space-y-6 font-bengali animate-fadeIn">
            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {teacherCourses.map(course => {
                const targetModules = course.targetModules || 4;
                const targetLessons = course.targetLessons || 16;
                const targetAssignments = course.targetAssignments || targetLessons;
                const currentModules = course.modules?.length || 0;
                const currentLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
                const courseAsgns = assignments.filter(a => a.courseId === course.id);
                const currentAssignments = Math.max(courseAsgns.length, currentLessons);
                const courseSubs = submissions.filter(s => s.courseId === course.id);
                const pendingCount = courseSubs.filter(s => s.status === 'submitted').length;

                const modulePercentage = Math.min(100, Math.round((currentModules / targetModules) * 100));
                const lessonPercentage = Math.min(100, Math.round((currentLessons / targetLessons) * 100));
                const asgnPercentage = Math.min(100, Math.round((currentAssignments / targetAssignments) * 100));

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:border-blue-600/50/50"
                  >
                    {/* Course Banner */}
                    <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-950">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <span className="px-3.5 py-1 bg-blue-500 text-white font-black text-xs sm:text-sm rounded-full shadow-md">
                          {course.category}
                        </span>
                        <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-amber-300 font-bold text-xs sm:text-sm rounded-full border border-amber-500/30 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-xs text-sky-300 font-bold uppercase tracking-wider block mb-1">সক্রিয় রানিং কোর্স</span>
                        <h3 className="font-black text-base sm:text-lg leading-snug line-clamp-1">{course.title}</h3>
                      </div>
                    </div>

                    {/* Progress & Target Section */}
                    <div className="p-4 sm:p-5 space-y-4 flex-1">
                      {/* Upload Target Tracker Box */}
                      <div className="bg-gradient-to-br from-amber-500/10 via-indigo-500/5 to-indigo-500/10 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-3.5 sm:p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300 flex items-center gap-2">
                            <Target className="w-4 h-4 text-amber-500" />
                            <span>কোর্স আপলোড টার্গেট</span>
                          </span>
                        </div>

                        {/* Module Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className="text-slate-700 dark:text-slate-200">মডিউল টার্গেট: {currentModules} / {targetModules} টি</span>
                            <span className="text-indigo-600 dark:text-sky-400 font-mono font-black">{modulePercentage}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${modulePercentage}%` }} />
                          </div>
                        </div>

                        {/* Lessons / Videos Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className="text-slate-700 dark:text-slate-200">লেসন/ভিডিও টার্গেট: {currentLessons} / {targetLessons} টি</span>
                            <span className="text-[#006A4E] dark:text-sky-400 font-mono font-black">{lessonPercentage}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${lessonPercentage}%` }} />
                          </div>
                        </div>

                        {/* Assignment Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs sm:text-sm font-bold">
                            <span className="text-slate-700 dark:text-slate-200">অ্যাসাইনমেন্ট টার্গেট: {currentAssignments} / {targetAssignments} টি</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{asgnPercentage}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${asgnPercentage}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Stats Overview */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">মোট টাস্ক</span>
                          <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{courseAsgns.length} টি</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">জমা পড়া</span>
                          <span className="font-black text-sm sm:text-base text-indigo-500">{courseSubs.length} টি</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-semibold">মূল্যায়ন বাকি</span>
                          <span className="font-black text-sm sm:text-base text-rose-500">{pendingCount} টি</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Exactly 2 clean, responsive buttons */}
                    <div className="p-4 sm:p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedManageCourseId(course.id);
                          setManageModalTab('upload');
                          if (course.modules && course.modules.length > 0) {
                            setLessonModuleId('');
                          } else {
                            setLessonModuleId('new');
                          }
                        }}
                        className="py-3 px-3.5 bg-gradient-to-r from-[#006A4E] to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-xs sm:text-sm md:text-base rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                        <span className="truncate">মডিউল আপলোড</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPreviewCourse(course);
                          if (onViewCourse) onViewCourse(course.id);
                        }}
                        className="py-3 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.99] text-slate-700 dark:text-slate-200 font-black text-xs sm:text-sm md:text-base rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400 shrink-0" />
                        <span className="truncate">প্রিভিউ দেখুন →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* TAB: জমা কাজ (SUBMISSIONS / ASSIGNMENTS) */}
        {(activeTab === 'submissions' || activeTab === 'assignments') && (
          <div className="space-y-4 font-bengali animate-fadeIn">
            {/* 2 FILTER BUTTONS & COUNTERS: [ ❗ নতুন (0) ] [ 🕒 রিভিউ (7) ] (Hidden when embedded in Live Hub with hideHeader) */}
            {!hideHeader && (
              <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-full border border-slate-200/90 dark:border-slate-700/80 shadow-xs max-w-xs mx-auto w-full">
                <div className="grid grid-cols-2 gap-1 w-full">
                  {/* 1. নতুন */}
                  <button
                    type="button"
                    onClick={() => setAssignmentStatusFilter('new')}
                    className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                      assignmentStatusFilter === 'new'
                        ? 'bg-purple-600 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${
                      assignmentStatusFilter === 'new' ? 'text-white' : 'text-purple-500'
                    }`} />
                    <span className="truncate">নতুন</span>
                    <span className={`font-black text-xs ${
                      assignmentStatusFilter === 'new' ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {pendingSubmissions.length}
                    </span>
                  </button>

                  {/* 2. রিভিউ */}
                  <button
                    type="button"
                    onClick={() => setAssignmentStatusFilter('review')}
                    className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                      assignmentStatusFilter === 'review'
                        ? 'bg-amber-500 text-white shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Clock className={`w-3.5 h-3.5 shrink-0 ${
                      assignmentStatusFilter === 'review' ? 'text-white' : 'text-amber-500'
                    }`} />
                    <span className="truncate">রিভিউ</span>
                    <span className={`font-black text-xs ${
                      assignmentStatusFilter === 'review' ? 'text-white' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {reviewSubmissions.length}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* DYNAMIC FILTERED SUBMISSIONS LIST */}
            {(() => {
              const currentList = (
                assignmentStatusFilter === 'new'
                  ? pendingSubmissions
                  : reviewSubmissions
              ).filter(sub =>
                !searchQuery.trim() ||
                sub.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.submissionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sub.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <div className="space-y-3 font-bengali">
                  {/* BULK DELETE ACTION FOR REVIEW TAB */}
                  {assignmentStatusFilter === 'review' && currentList.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          মোট <strong className="text-amber-700 dark:text-amber-400">{currentList.length}টি</strong> রিভিউ কাজ রয়েছে
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`আপনি কি নিশ্চিত যে এই তালিকার সবগুলা (${currentList.length}টি) রিভিউ কাজ একসাথে মুছে ফেলতে চান? এতে আপনার তালিকা সম্পূর্ণ ক্লিয়ার হবে।`)) {
                            currentList.forEach(s => deleteSubmission(s.id));
                            setLiveToastMsg('সবগুলো রিভিউ কাজ সফলভাবে মুছে ফেলা হয়েছে।');
                            setTimeout(() => setLiveToastMsg(''), 3000);
                          }
                        }}
                        className="py-1.5 px-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                        title="সবগুলো রিভিউ কাজ একসাথে তালিকা থেকে মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>সবগুলা একসাথে ডিলেট</span>
                      </button>
                    </div>
                  )}

                  {currentList.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {assignmentStatusFilter === 'new' && 'বর্তমানে কোনো নতুন অপেক্ষমাণ জমা নেই'}
                        {assignmentStatusFilter === 'review' && 'বর্তমানে পর্যালোচনায় কোনো কাজ নেই'}
                      </h4>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
                      {currentList.map(sub => {
                        const asgn = assignments.find(a => a.id === sub.assignmentId);
                        const lessonInfo = getAssignmentLessonInfo(asgn);
                        const isGraded = sub.status === 'graded';
                        const isUnderReview = sub.status === 'under_review' || sub.status === 'review';
                        const progress = getStudentCourseProgress(sub.studentId, sub.studentEmail, sub.assignmentId);
                        const links = getSubmissionLinks(sub);

                        let leftAccentBorder = "border-l-4 border-l-purple-500";
                        let badgeClasses = "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
                        let statusLabel = "নতুন জমা";
                        let StatusIcon = AlertCircle;

                        if (sub.status === 'returned' || sub.feedback?.includes('পুনরায়')) {
                          leftAccentBorder = "border-l-4 border-l-amber-500";
                          badgeClasses = "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                          statusLabel = "এগেইন আবশ্যক";
                          StatusIcon = RotateCcw;
                        } else if (isGraded && progress.isAllCompleted) {
                          leftAccentBorder = "border-l-4 border-l-[#006A4E]";
                          badgeClasses = "bg-blue-50 dark:bg-slate-950/50 text-blue-700 dark:text-sky-400 border-blue-200 dark:border-blue-900";
                          statusLabel = `সফল (${sub.points || 50})`;
                          StatusIcon = CheckCircle2;
                        } else if (isUnderReview || (isGraded && !progress.isAllCompleted)) {
                          leftAccentBorder = "border-l-4 border-l-amber-500";
                          badgeClasses = "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                          statusLabel = isGraded ? `রিভিউ (${progress.remainingTasks} বাকি)` : "রিভিউধীন";
                          StatusIcon = Clock;
                        }

                        return (
                          <div
                            key={sub.id}
                            className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-3.5 sm:p-4 text-slate-800 dark:text-slate-100 flex flex-col justify-between gap-3 ${leftAccentBorder}`}
                          >
                            {/* Row 1: Student Profile, ID & Status Badge */}
                            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative shrink-0">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white font-black text-sm flex items-center justify-center ring-2 ring-indigo-500/30 shadow-2xs">
                                    {sub.studentName?.charAt(0) || 'S'}
                                  </div>
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white dark:border-slate-900" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                                      {sub.studentName}
                                    </span>
                                    <BadgeCheck className="w-4 h-4 text-[#006A4E] dark:text-sky-400 shrink-0" />
                                  </div>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block truncate">
                                    {sub.studentEmail || 'শিক্ষার্থী'} • {sub.submittedAt || 'আজ'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-black border flex items-center gap-1 shadow-2xs ${badgeClasses}`}>
                                  <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span>{statusLabel}</span>
                                </span>
                              </div>
                            </div>

                            {/* Row 2: Lesson Number & Assigned Task Details */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-black flex items-center gap-1 shadow-2xs">
                                    <BookOpen className="w-3 h-3 shrink-0" />
                                    <span>{lessonInfo.lessonNo}</span>
                                  </span>
                                  <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-sky-300 border border-teal-200 dark:border-teal-800 rounded-lg text-xs font-bold truncate max-w-[160px]">
                                    {asgn?.courseTitle || 'কোর্স'}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-black flex items-center gap-1 shrink-0">
                                  <Award className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span>{asgn?.totalPoints || 50} মার্কস</span>
                                </span>
                              </div>

                              {/* Task Title & Description */}
                              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                                {asgn?.title || lessonInfo.taskTitle}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="font-black text-indigo-600 dark:text-indigo-400">টাস্ক: </span>
                                {asgn?.description || lessonInfo.taskDesc}
                              </p>
                            </div>

                            {/* Row 2.5: Task Completion Progress */}
                            <div className="px-3 py-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span>অগ্রগতি: {progress.completedTasks}/{progress.totalTasks}</span>
                                  <span className="text-indigo-600 dark:text-sky-400 font-black">({progress.progressPercent}%)</span>
                                </span>
                                <span className={`text-xs font-black ${
                                  progress.isAllCompleted ? 'text-[#38BDF8]' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                  {progress.isAllCompleted ? '🎉 সম্পন্ন' : `⏳ ${progress.remainingTasks}টি বাকি`}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    progress.isAllCompleted
                                      ? 'bg-[#006A4E]'
                                      : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                                  }`}
                                  style={{ width: `${progress.progressPercent}%` }}
                                />
                              </div>
                            </div>

                            {/* Row 3: Evaluation Score Box */}
                            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isGraded ? 'bg-blue-50 dark:bg-blue-950/40 text-[#006A4E]' : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600'
                                }`}>
                                  <Award className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block leading-none">
                                    {isGraded ? 'স্কোর' : 'মোট নম্বর'}
                                  </span>
                                  <span className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white leading-tight truncate block mt-0.5">
                                    {isGraded ? `${sub.points || 50}/${asgn?.totalPoints || 50}` : `${asgn?.totalPoints || 50} পয়েন্ট`}
                                  </span>
                                </div>
                              </div>
                              <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-2 flex items-center justify-between">
                                <div className="min-w-0">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block leading-none">ফলাফল</span>
                                  <span className={`text-xs sm:text-sm font-black leading-tight truncate block mt-0.5 ${
                                    isGraded && progress.isAllCompleted
                                      ? 'text-blue-700 dark:text-sky-400'
                                      : isUnderReview || (isGraded && !progress.isAllCompleted)
                                      ? 'text-amber-500'
                                      : 'text-purple-600 dark:text-purple-400'
                                  }`}>
                                    {isGraded && progress.isAllCompleted ? 'উত্তীর্ণ' : isUnderReview || isGraded ? 'রিভিউ' : 'নতুন'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Row 3.5: Student Solution / Note (if any) */}
                            {sub.submissionText && (
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                <p className="italic line-clamp-2 leading-relaxed">"{sub.submissionText}"</p>
                              </div>
                            )}
                            
                            {/* If again requested or graded feedback */}
                            {(sub.status === 'returned' || sub.feedback?.includes('পুনরায়')) ? (
                              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-2 text-xs sm:text-sm">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <span className="font-bold text-amber-700 dark:text-amber-300 block text-xs">
                                    এগেইন নির্দেশিত:
                                  </span>
                                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-normal">
                                    {sub.feedback}
                                  </p>
                                </div>
                              </div>
                            ) : isGraded && sub.feedback ? (
                              <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-slate-950/20 border border-blue-500/20 flex items-start gap-1.5 text-xs sm:text-sm text-blue-900 dark:text-sky-300">
                                <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="italic line-clamp-1 leading-normal font-medium">মন্তব্য: "{sub.feedback}"</p>
                              </div>
                            ) : null}

                            {/* Row 4: Attached Files/Links */}
                            {(sub.fileName || links.length > 0) && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                {(sub.fileName || (sub.fileUrl && !links.some(l => l.url === sub.fileUrl))) && (
                                  <a
                                    href={sub.fileUrl || '#'}
                                    download={sub.fileName || 'submission_file'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 truncate max-w-[160px] border border-slate-200 dark:border-slate-700"
                                    title={sub.fileName || 'ফাইল ডাউনলোড'}
                                  >
                                    <Paperclip className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span className="truncate">{sub.fileName || 'ফাইল'}</span>
                                    <Download className="w-3 h-3 ml-0.5 shrink-0 text-slate-400" />
                                  </a>
                                )}

                                {links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-sky-300 border border-sky-300 dark:border-teal-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 truncate max-w-[160px]"
                                    title={link.url}
                                  >
                                    <Globe className="w-3 h-3 text-indigo-600 dark:text-sky-400 shrink-0" />
                                    <span className="truncate">{link.title}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0 ml-0.5 text-indigo-500" />
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Row 5: Action Buttons */}
                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                জমা: {sub.submittedAt || 'আজ'}
                              </span>

                              {assignmentStatusFilter === 'review' ? (
                                /* রিভিউ ট্যাবে শুধুমাত্র নিজস্ব ডিলিট বাটন (মূল্যায়ন/এগেইন ছাড়া) */
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteSubmission(sub.id);
                                    setLiveToastMsg('রিভিউ কাজটি মুছে ফেলা হয়েছে।');
                                    setTimeout(() => setLiveToastMsg(''), 3000);
                                  }}
                                  className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-xs sm:text-sm rounded-xl border border-rose-500/30 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                                  title="এই কাজটি তালিকা থেকে মুছুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>ডিলেট</span>
                                </button>
                              ) : (
                                /* নতুন ট্যাবে মূল্যায়ন ও এগেইন বাটন */
                                <div className="flex items-center gap-2 shrink-0">
                                  {/* 1. Evaluate / Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedSubmission(sub);
                                      setGradePoints(sub.points || asgn?.totalPoints || 50);
                                      setGradeFeedback(sub.feedback || 'কাজ খুব ভালো হয়েছে! নিয়মিত প্র্যাকটিস অব্যাহত রাখুন।');
                                      setGradeLinkUrl(sub.linkUrl || (links.length > 0 ? links[0].url : ''));
                                    }}
                                    className="px-3.5 py-1.5 font-black text-xs sm:text-sm rounded-xl border transition cursor-pointer flex items-center gap-1.5 active:scale-95 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white border-transparent shadow-xs"
                                    title="মূল্যায়ন করুন"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>মূল্যায়ন</span>
                                  </button>

                                  {/* 2. Again / Redo Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAgainModalSub(sub);
                                      const defaultLesson = asgn?.lessonNo || asgn?.title?.match(/লেসন\s*\d+|Lesson\s*\d+/i)?.[0] || 'লেসন নং ১';
                                      setAgainLessonNo(defaultLesson);
                                      setAgainReason('');
                                    }}
                                    className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs sm:text-sm rounded-xl border border-amber-500/30 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                                    title="যে লেসনটি হয়নি সেটি আবার করার জন্য এগেইন পাঠান"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                    <span>এগেইন</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB: লাইভ ক্লাস ও লিংক সেটআপ (LIVE CLASSES TAB - AUTOMATED & CLEAN) */}
        {activeTab === 'live_classes' && (
          <div className="space-y-5 font-bengali animate-fadeIn">
            {/* Live Toast Alert */}
            {liveToastMsg && (
              <div className="bg-blue-500/10 border-2 border-blue-500/30 text-blue-700 dark:text-sky-300 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-bounce">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm">{liveToastMsg}</span>
                </div>
                <button
                  onClick={() => setLiveToastMsg('')}
                  className="text-[#006A4E] dark:text-sky-400 text-xs font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Simple Clean Header with Create Live Class Button */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>লাইভ ক্লাস</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  শিডিউল অনুযায়ী অটো লাইভ ও স্বয়ংক্রিয় রিমুভ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Quick Search */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={liveSearchQuery}
                    onChange={e => setLiveSearchQuery(e.target.value)}
                    placeholder="খুঁজুন..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                {/* Primary Action: Create Live Class */}
                <button
                  type="button"
                  onClick={() => openCreateLiveModal()}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>নতুন লাইভ ক্লাস</span>
                </button>
              </div>
            </div>

            {/* Active Live Classes List (Auto-Scheduled & Auto-Removing Expired) */}
            {(() => {
              const activeSessions = getActiveLiveSessions(liveSessions);
              const filteredSessions = activeSessions.filter(s =>
                s.topic.toLowerCase().includes(liveSearchQuery.toLowerCase()) ||
                s.courseTitle.toLowerCase().includes(liveSearchQuery.toLowerCase()) ||
                (s.moduleTitle && s.moduleTitle.toLowerCase().includes(liveSearchQuery.toLowerCase()))
              );

              if (filteredSessions.length === 0) {
                return (
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                      <Video className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        কোনো লাইভ ক্লাস নেই
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        শিক্ষার্থীদের জন্য নতুন লাইভ ক্লাস শিডিউল করুন।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCreateLiveModal()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>নতুন লাইভ ক্লাস তৈরি করুন</span>
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSessions.map(session => {
                    const dynamicStatus = getLiveSessionDynamicStatus(session);
                    const isLive = dynamicStatus === 'live_now';
                    const link = session.meetingLink || 'https://meet.google.com/ptenit-live-class';
                    const scheduleDisplay = formatBanglaLiveSchedule(session.date, session.time);
                    const course = courses.find(c => c.id === session.courseId);

                    return (
                      <div
                        key={session.id}
                        className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md ${
                          isLive
                            ? 'border-rose-500 dark:border-rose-500 ring-2 ring-rose-500/20 shadow-rose-500/10'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {/* Session Info & Badges */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={session.courseThumbnail || course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                              alt={session.courseTitle}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[130px]">
                                  {course?.category || 'কোর্স'}
                                </span>
                                <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${
                                  isLive
                                    ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                                    : 'bg-blue-500/10 text-[#006A4E] dark:text-sky-400 border border-blue-500/20'
                                }`}>
                                  <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white' : 'bg-blue-500'}`} />
                                  {isLive ? 'লাইভ চলছে' : 'শিডিউলড'}
                                </span>
                              </div>
                              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-1">
                                {session.courseTitle}
                              </h3>
                            </div>
                          </div>

                          {/* Module, Lesson & Serial Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-black text-xs">
                              <Layers className="w-3.5 h-3.5" />
                              <span>মডিউল {session.moduleNo}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-black text-xs">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>লেসন {session.lessonNo}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-black text-xs">
                              <span>ক্লাস নং {session.classSerialNo}</span>
                            </span>
                          </div>

                          {/* Live Class Topic Box */}
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
                            <div>
                              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                ক্লাসের টপিক / বিষয়বস্তু
                              </span>
                              <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 line-clamp-2 mt-1">
                                {session.topic}
                              </p>
                            </div>

                            {/* Schedule Date, Time & Duration */}
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs sm:text-sm font-bold">
                              <div className="flex items-center gap-2 text-teal-700 dark:text-sky-400 truncate">
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span className="truncate">{scheduleDisplay}</span>
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-black shrink-0 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                {session.durationMinutes || 90} মিনিট
                              </span>
                            </div>

                            {/* Link Row */}
                            <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-2 px-3 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                              <span className="truncate flex-1 text-indigo-600 dark:text-sky-400 font-bold text-xs">
                                {link}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(link);
                                    setCopiedLink(session.id);
                                    setTimeout(() => setCopiedLink(null), 2000);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer transition"
                                  title="মিটিং লিংক কপি করুন"
                                >
                                  {copiedLink === session.id ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 dark:text-sky-400 cursor-pointer transition"
                                  title="রুম টেস্ট / সরাসরি ওপেন"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex-1 py-2.5 px-3 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                              isLive
                                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'
                                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                            }`}
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>{isLive ? 'গুগল মিটে জয়েন করুন' : 'মিট রুম খুলুন'}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => openEditLiveModal(session)}
                            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                            title="শিডিউল ও টপিক এডিট করুন"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLiveSession(session)}
                            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 transition cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* UNIFIED AUTOMATED LIVE CLASS CREATION & EDIT MODAL */}
            {liveModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-bengali animate-fadeIn overflow-y-auto">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 my-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/20">
                        <Video className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {editingSessionId ? 'লাইভ ক্লাস শিডিউল এডিট করুন' : 'নতুন লাইভ ক্লাস তৈরি করুন'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-bold">
                          তারিখ ও সময় অনুযায়ী স্ট্যাটাস স্বয়ংক্রিয়ভাবে পরিচালিত হবে
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLiveModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Form Body */}
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {/* SECTION 1: Course Selection */}
                    <div>
                      <label className="block text-xs font-black text-slate-900 dark:text-white mb-1.5">
                        ১. কোর্স নির্বাচন করুন:
                      </label>
                      <select
                        value={modalCourseId}
                        onChange={e => {
                          const cId = e.target.value;
                          setModalCourseId(cId);
                          const selCourse = courses.find(c => c.id === cId);
                          if (selCourse) {
                            setModalModuleTitle(selCourse.modules?.[0]?.title || 'মৌলিক পরিচিতি');
                            setModalLessonTitle(selCourse.modules?.[0]?.lessons?.[0]?.title || 'প্রথম পরিচিতি');
                            setModalTopic(generateLiveTopic(modalModuleNo, modalLessonNo, selCourse.modules?.[0]?.lessons?.[0]?.title || selCourse.title));
                          }
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SECTION 2: Module, Lesson & Serial */}
                    {(() => {
                      const selCourse = courses.find(c => c.id === modalCourseId);
                      return (
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-purple-600" />
                              <span>২. মডিউল, লেসন ও সিরিয়াল নির্বাচন</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              ক্লাস ক্রম
                            </span>
                          </div>

                          {/* Quick Syllabus dropdown if course has modules */}
                          {selCourse?.modules && selCourse.modules.length > 0 && (
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                কোর্সের সিলেবাস থেকে দ্রুত সেট করুন:
                              </label>
                              <select
                                onChange={e => {
                                  const modIndex = Number(e.target.value);
                                  const selectedMod = selCourse.modules?.[modIndex];
                                  if (selectedMod) {
                                    const mNo = (modIndex + 1).toString();
                                    setModalModuleNo(mNo);
                                    setModalModuleTitle(selectedMod.title);
                                    const firstLesson = selectedMod.lessons?.[0];
                                    const lNo = firstLesson ? '১' : '১';
                                    setModalLessonNo(lNo);
                                    setModalLessonTitle(firstLesson ? firstLesson.title : '');
                                    setModalClassSerialNo((modIndex + 1).toString());
                                    setModalTopic(generateLiveTopic(mNo, lNo, firstLesson ? firstLesson.title : selectedMod.title));
                                  }
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              >
                                <option value="">-- সিলেবাস থেকে নির্বাচন করুন --</option>
                                {selCourse.modules.map((m, idx) => (
                                  <option key={m.id || idx} value={idx}>
                                    মডিউল {idx + 1}: {m.title} ({m.lessons?.length || 0}টি লেসন)
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* 3 Grid Inputs: Module No, Lesson No, Class Serial No */}
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-black text-purple-700 dark:text-purple-300 mb-1">
                                মডিউল নং:
                              </label>
                              <input
                                type="text"
                                value={modalModuleNo}
                                onChange={e => {
                                  setModalModuleNo(e.target.value);
                                  setModalTopic(generateLiveTopic(e.target.value, modalLessonNo, modalLessonTitle));
                                }}
                                placeholder="যেমন: ১ বা ০২"
                                className="w-full bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 rounded-xl px-2.5 py-1.5 text-xs font-black text-purple-900 dark:text-purple-100 text-center focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-indigo-700 dark:text-indigo-300 mb-1">
                                লেসন নং:
                              </label>
                              <input
                                type="text"
                                value={modalLessonNo}
                                onChange={e => {
                                  setModalLessonNo(e.target.value);
                                  setModalTopic(generateLiveTopic(modalModuleNo, e.target.value, modalLessonTitle));
                                }}
                                placeholder="যেমন: ১ বা ০৩"
                                className="w-full bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 rounded-xl px-2.5 py-1.5 text-xs font-black text-indigo-900 dark:text-indigo-100 text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-amber-700 dark:text-amber-300 mb-1">
                                ক্লাস সিরিয়াল নং:
                              </label>
                              <input
                                type="text"
                                value={modalClassSerialNo}
                                onChange={e => setModalClassSerialNo(e.target.value)}
                                placeholder="যেমন: ১ বা ০৫"
                                className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl px-2.5 py-1.5 text-xs font-black text-amber-900 dark:text-amber-100 text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* SECTION 3: Live Topic */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          ৩. লাইভ ক্লাসের টাইটেল/টপিক:
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const selCourse = courses.find(c => c.id === modalCourseId);
                            const auto = generateLiveTopic(modalModuleNo, modalLessonNo, modalLessonTitle || selCourse?.title || '');
                            setModalTopic(auto);
                          }}
                          className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>অটো-টাইটেল</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={modalTopic}
                        onChange={e => setModalTopic(e.target.value)}
                        placeholder="যেমন: মডিউল ০১: লেসন ০৩ - ফটোশপ সিলেকশন টুলস প্র্যাকটিস"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* SECTION 4: Date, Time & Duration Schedule */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>৪. তারিখ, সময় ও স্থায়িত্বকাল</span>
                        </span>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-sky-400">
                          সময়সূচি
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            তারিখ (Date):
                          </label>
                          <input
                            type="date"
                            value={modalDate}
                            onChange={e => setModalDate(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            সময় (Time):
                          </label>
                          <input
                            type="time"
                            value={modalTime}
                            onChange={e => setModalTime(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Duration Presets */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          ক্লাস স্থায়িত্বকাল (Duration):
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '৬০ মিনিট (১ ঘণ্টা)', val: 60 },
                            { label: '৯০ মিনিট (দেড় ঘণ্টা)', val: 90 },
                            { label: '১২০ মিনিট (২ ঘণ্টা)', val: 120 }
                          ].map(dur => (
                            <button
                              key={dur.val}
                              type="button"
                              onClick={() => setModalDuration(dur.val)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                                modalDuration === dur.val
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {dur.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Formatted Preview */}
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-sky-300">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>শিডিউল প্রিভিউ: <strong className="font-black">{formatBanglaLiveSchedule(modalDate, modalTime)} ({modalDuration} মিনিট)</strong></span>
                      </div>
                    </div>

                    {/* SECTION 5: Meeting Link */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          ৫. লাইভ মিটিং লিংক:
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setModalMeetingLink('https://meet.google.com/ptenit-live-class')}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                          >
                            Google Meet
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalMeetingLink('https://zoom.us/j/ptenit-live-room')}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                          >
                            Zoom
                          </button>
                        </div>
                      </div>
                      <input
                        type="url"
                        value={modalMeetingLink}
                        onChange={e => setModalMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* SECTION 6: Instructions / Notes */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        ৬. শিক্ষার্থীদের জন্য নির্দেশনা (ঐচ্ছিক):
                      </label>
                      <input
                        type="text"
                        value={modalSpecialNotes}
                        onChange={e => setModalSpecialNotes(e.target.value)}
                        placeholder="যেমন: ক্লাসে মাইক্রোফোন মিউট রাখবেন এবং প্রশ্ন থাকলে হ্যান্ডরেইজ করবেন।"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* Automatic Status Explanation Notice */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                      <div>
                        <span className="font-bold">স্বয়ংক্রিয় শিডিউল সিস্টেম:</span> নির্ধারিত সময় এলে সিস্টেমে অটোমেটিক <strong>"লাইভ চলছে"</strong> স্ট্যাটাস সক্রিয় হবে এবং ক্লাস সমাপ্তির পর তালিকা থেকে নিজে নিজেই হাইড হয়ে যাবে।
                      </div>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setLiveModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLiveSession}
                      className="px-5 py-2.5 bg-[#047857] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingSessionId ? 'আপডেট সেভ করুন' : 'শিডিউল প্রকাশ করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: সফল (COMPLETED / GRADED / CERTIFICATES) */}
        {(activeTab === 'completed' || activeTab === 'certificates') && (
          <div className="space-y-6 font-bengali animate-fadeIn">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-sky-400" />
                  <span>সফল ও মূল্যায়িত কাজসমূহ ({totalGraded.length} টি)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  যে সকল কাজ সফলভাবে চেক ও মূল্যায়ন সম্পন্ন করা হয়েছে সেগুলোর তালিকা ও ভেরিফাইড সার্টিফিকেট প্রদান হাব।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (courses.length > 0) setCertCourseId(courses[0].id);
                    const certElem = document.getElementById('cert-issue-form');
                    if (certElem) certElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-[#006A4E] hover:bg-[#047857] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>+ নতুন সার্টিফিকেট ইস্যু</span>
                </button>
              </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">মোট সফল কাজ</span>
                  <span className="text-xl font-black text-blue-500">{totalGraded.length} টি</span>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">ইস্যুকৃত সার্টিফিকেট</span>
                  <span className="text-xl font-black text-amber-500">{certificates.length} টি</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">অংশগ্রহণকারী শিক্ষার্থী</span>
                  <span className="text-xl font-black text-blue-400">{enrollments.length} জন</span>
                </div>
              </div>
            </div>

            {/* GRADED SUBMISSIONS GRID */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-sky-400" />
                <span>সফলভাবে অনুমোদিত ও গ্রেডেড অ্যাসাইনমেন্ট তালিকা</span>
              </h3>

              {totalGraded.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">এখনো কোনো কাজ মূল্যায়িত হয়নি। 'জমা কাজ' ট্যাব থেকে কাজ চেক করে মূল্যায়ন সম্পন্ন করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
                  {totalGraded.map(sub => {
                    const asgn = assignments.find(a => a.id === sub.assignmentId);
                    const lessonInfo = getAssignmentLessonInfo(asgn);
                    const links = getSubmissionLinks(sub);
                    return (
                      <div
                        key={sub.id}
                        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#006A4E] shadow-2xs hover:shadow-xs transition-all p-2.5 sm:p-3 text-slate-800 dark:text-slate-100 flex flex-col justify-between gap-2"
                      >
                        {/* Row 1: Student Profile, ID & Status Badge */}
                        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="relative shrink-0">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-sky-400 text-white font-black text-[11px] flex items-center justify-center ring-1.5 ring-[#006A4E] shadow-2xs">
                                {sub.studentName?.charAt(0) || 'S'}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-900" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                                  {sub.studentName}
                                </span>
                                <BadgeCheck className="w-3 h-3 text-[#006A4E] dark:text-sky-400 shrink-0" />
                              </div>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium block leading-none truncate">
                                {sub.studentEmail || 'শিক্ষার্থী'} • {sub.submittedAt || 'আজ'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-slate-950/50 text-blue-700 dark:text-sky-400 flex items-center gap-0.5 shadow-2xs">
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                              <span>সফল ({sub.points || 50})</span>
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Lesson Number & Assigned Task Details (Compact) */}
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded-md bg-[#047857] text-white text-[9px] font-black flex items-center gap-0.5 shadow-2xs">
                                <BookOpen className="w-2.5 h-2.5 shrink-0" />
                                <span>{lessonInfo.lessonNo}</span>
                              </span>
                              <span className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-sky-300 border border-teal-200 dark:border-teal-800 rounded text-[9px] font-bold truncate max-w-[130px]">
                                {asgn?.courseTitle || 'কোর্স'}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[9px] font-black flex items-center gap-0.5 shrink-0">
                              <Award className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400 shrink-0" />
                              <span>{asgn?.totalPoints || 50} মার্কস</span>
                            </span>
                          </div>

                          {/* Task Title & Description */}
                          <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                            {asgn?.title || lessonInfo.taskTitle}
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-[#006A4E] dark:text-sky-400">টাস্ক: </span>
                            {asgn?.description || lessonInfo.taskDesc}
                          </p>
                        </div>

                        {/* Row 3: Evaluation Stats Box */}
                        <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#006A4E] flex items-center justify-center shrink-0 shadow-2xs">
                              <Award className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold block leading-none">অর্জিত স্কোর</span>
                              <span className="text-[11px] font-black font-mono text-[#006A4E] dark:text-sky-400 leading-tight block truncate">
                                {sub.points || 50} / {asgn?.totalPoints || 50}
                              </span>
                            </div>
                          </div>
                          <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-1.5 flex items-center justify-between">
                            <div className="min-w-0">
                              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold block leading-none">ফলাফল</span>
                              <span className="text-[10px] font-black text-[#006A4E] dark:text-sky-400 leading-tight block truncate">
                                পাস ({Math.round(((sub.points || 50) / (asgn?.totalPoints || 50)) * 100)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Row 3.5: Student Solution and Mentor Feedback */}
                        {sub.submissionText && (
                          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-1.5 text-[10px] text-slate-700 dark:text-slate-300">
                            <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                            <p className="italic line-clamp-2 leading-snug">"{sub.submissionText}"</p>
                          </div>
                        )}

                        {sub.feedback && (
                          <div className="p-1.5 rounded-lg bg-blue-50/60 dark:bg-slate-950/20 border border-blue-500/20 flex items-start gap-1 text-[10px] text-blue-900 dark:text-sky-300">
                            <Sparkles className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                            <p className="italic line-clamp-1 leading-tight font-medium">মন্তব্য: "{sub.feedback}"</p>
                          </div>
                        )}

                        {/* Row 4: Footer with 2 Action Buttons (এডিট & এগেইন, No Delete Button) */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5">
                          <span className="text-[9px] text-slate-400 font-medium truncate">
                            জমা: {sub.submittedAt || 'আজ'}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setGradePoints(sub.points || asgn?.totalPoints || 50);
                                setGradeFeedback(sub.feedback || 'খুব ভালো কাজ!');
                                setGradeLinkUrl(sub.linkUrl || '');
                              }}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] sm:text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1 active:scale-95"
                              title="মূল্যায়ন এডিট করুন"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>এডিট</span>
                            </button>

                            {/* Again Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setAgainModalSub(sub);
                                const defaultLesson = asgn?.lessonNo || asgn?.title?.match(/লেসন\s*\d+|Lesson\s*\d+/i)?.[0] || 'লেসন নং ১';
                                setAgainLessonNo(defaultLesson);
                                setAgainReason('');
                              }}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] sm:text-[11px] rounded-lg border border-amber-500/30 transition cursor-pointer flex items-center gap-1 active:scale-95"
                              title="যে লেসনটি হয়নি সেটি আবার করার জন্য এগেইন পাঠান"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              <span>এগেইন</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CERTIFICATE ISSUANCE & VERIFICATION MODULE */}
            <div id="cert-issue-form" className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* Issue Form */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#38BDF8]" /> নতুন সার্টিফিকেট ইস্যু করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  কোর্স সম্পন্নকারী শিক্ষার্থীকে ভেরিফাইড কোর্স সার্টিফিকেট প্রদান করুন।
                </p>

                {certSuccessMsg && (
                  <div className="p-3 bg-blue-500/20 border border-blue-500/40 text-[#38BDF8] text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{certSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleIssueCertificateSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
                    <select
                      value={certStudentId}
                      onChange={e => setCertStudentId(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                      required
                    >
                      <option value="">-- শিক্ষার্থী সিলেক্ট করুন --</option>
                      {users.filter(u => u.role === 'student' || !u.role).map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.email || st.mobile || st.id})
                        </option>
                      ))}
                      <option value="stu-demo-1">কাজী সিয়াম (siam@gmail.com)</option>
                      <option value="stu-demo-2">রাকিবুল হাসান (rakib@gmail.com)</option>
                      <option value="stu-demo-3">সামিয়া সুলতানা (samiya@gmail.com)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">কোর্স নির্বাচন করুন *</label>
                    <select
                      value={certCourseId}
                      onChange={e => setCertCourseId(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                      required
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>সার্টিফিকেট জেনারেট ও ইস্যু করুন</span>
                  </button>
                </form>
              </div>

              {/* Issued Certificates List */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> ইস্যুকৃত সার্টিফিকেট রেকর্ডস ({certificates.length} টি)
                  </h3>
                </div>

                <div className="space-y-3">
                  {certificates.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">এখনো কোনো সার্টিফিকেট ইস্যু করা হয়নি।</p>
                  ) : (
                    certificates.map(cert => (
                      <div key={cert.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">{cert.studentName}</span>
                            <span className="px-2 py-0.5 bg-blue-500/10 text-[#38BDF8] text-[10px] font-mono font-bold rounded border border-blue-500/20">
                              {cert.certificateCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{cert.courseTitle}</p>
                          <span className="text-[11px] text-slate-400 block">ইস্যু ডেট: {cert.issueDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-blue-500/20 text-[#38BDF8] text-xs font-bold rounded-xl flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5" /> ভেরিফাইড
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENROLLED STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">এনরোলকৃত শিক্ষার্থীবৃন্দ</h2>

            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5 sm:p-4">শিক্ষার্থীর আইডি</th>
                      <th className="p-3.5 sm:p-4">এনরোলমেন্ট নম্বর</th>
                      <th className="p-3.5 sm:p-4">কোর্স প্রোগ্রেস</th>
                      <th className="p-3.5 sm:p-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {enrollments.map(enr => (
                      <tr key={enr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white">
                          শিক্ষার্থী #{enr.userId.slice(-4)}
                        </td>
                        <td className="p-3.5 sm:p-4 font-mono text-slate-400">{enr.id}</td>
                        <td className="p-3.5 sm:p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 sm:w-28 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#006A4E] h-full" style={{ width: `${enr.progress}%` }} />
                            </div>
                            <span className="font-bold">{enr.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3.5 sm:p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enr.status === 'completed' ? 'bg-blue-500/20 text-[#38BDF8]' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {enr.status === 'completed' ? 'সম্পন্ন' : 'রানিং'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TEACHER PAYMENTS & CASHOUT HUB */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fadeIn font-bengali">
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                    <DollarSign className="w-4 h-4 text-[#38BDF8] shrink-0" /> মোট কোর্স আয়
                  </span>
                  <span className="text-[10px] text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full font-black">আর্নড</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  ৳{(courses.reduce((acc, c) => acc + ((c.price || 3500) * (c.studentsCount || 12)), 0) || 420000).toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] text-slate-400 font-bold truncate">কোর্স বিক্রয় ও স্টুডেন্ট এনরোলমেন্ট</div>
              </div>

              <div className="p-4 bg-blue-500/10 dark:bg-slate-950/30 border-2 border-blue-600/50 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 dark:text-sky-400 flex items-center gap-1.5 truncate">
                    <Wallet className="w-4 h-4 text-[#38BDF8] shrink-0" /> ক্যাশআউট ব্যালেন্স
                  </span>
                  <span className="text-[10px] text-[#38BDF8] bg-[#006A4E]/20 px-2 py-0.5 rounded-full font-black">রেডি</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#38BDF8] tracking-tight">
                  ৳{(345000).toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] text-blue-700 dark:text-sky-400 font-bold truncate">উইথড্র করার জন্য প্রস্তুত</div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                    <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" /> মোট উত্তোলিত
                  </span>
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-black">পেইড</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  ৳{(75000).toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] text-slate-400 font-bold truncate">সফল ক্যাশআউট সম্পন্ন</div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" /> পেন্ডিং উইথড্র
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-black">প্রসেসিং</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  ৳{(0).toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] text-slate-400 font-bold truncate">অপেক্ষমান আবেদন</div>
              </div>
            </div>

            {/* CASHOUT FORM & HISTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CASHOUT FORM */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[#38BDF8]" /> নতুন ক্যাশআউট আবেদন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    বিকাশ, নগদ বা ব্যাংক একাউন্টে তাৎক্ষণিক আয় উত্তোলন করুন
                  </p>
                </div>

                {withdrawSuccessMsg && (
                  <div className="p-3.5 bg-blue-500/15 border border-blue-500/40 text-[#38BDF8] text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 shrink-0 fill-sky-400 text-slate-950" />
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      পেমেন্ট মেথড নির্বাচন করুন *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'bkash', label: 'বিকাশ (bKash)', color: 'border-pink-500/50 hover:bg-pink-500/10 text-pink-500' },
                        { id: 'nagad', label: 'নগদ (Nagad)', color: 'border-orange-500/50 hover:bg-orange-500/10 text-orange-500' },
                        { id: 'bank', label: 'ব্যাংক (Bank)', color: 'border-blue-500/50 hover:bg-blue-500/10 text-blue-400' },
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setWithdrawMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-center font-black transition cursor-pointer ${
                            withdrawMethod === m.id
                              ? 'bg-[#006A4E] text-white border-blue-600/50 shadow-sm'
                              : `bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ${m.color}`
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      {withdrawMethod === 'bank' ? 'ব্যাংক একাউন্ট নম্বর ও শাখা *' : 'মোবাইল একাউন্ট নম্বর *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={withdrawAccount}
                      onChange={e => setWithdrawAccount(e.target.value)}
                      placeholder={withdrawMethod === 'bank' ? 'যেমন: DBBL 205.120.xxxxx (ধানমন্ডি ব্রাঞ্চ)' : 'যেমন: 017xxxxxxxx'}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 dark:text-slate-300">
                        উত্তোলনের পরিমাণ (টাকা) *
                      </label>
                      <span className="text-[11px] text-slate-400">সর্বনিম্ন ৳৫০০</span>
                    </div>
                    <input
                      type="number"
                      required
                      min={500}
                      max={345000}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder="যেমন: 5000"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-base font-black focus:outline-none focus:border-[#006A4E]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[1000, 2500, 5000, 10000, 25000, 50000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setWithdrawAmount(amt.toString())}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#006A4E] hover:text-white text-slate-600 dark:text-slate-300 text-[11px] rounded-lg transition font-mono cursor-pointer"
                        >
                          ৳{amt.toLocaleString('bn-BD')}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount('345000')}
                        className="px-2.5 py-1 bg-blue-500/20 hover:bg-[#006A4E] text-[#38BDF8] hover:text-white text-[11px] font-black rounded-lg transition font-mono cursor-pointer"
                      >
                        সব টাকা (Max)
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#006A4E] to-blue-600 hover:from-[#18a649] hover:to-blue-700 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                    >
                      <Send className="w-4 h-4 fill-white" />
                      <span>ক্যাশআউট রিকোয়েস্ট পাঠান</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* PAYOUT HISTORY TABLE */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-indigo-500" /> ক্যাশআউট হিস্টোরি ও ট্রানজ্যাকশন
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      পূর্ববর্তী উইথড্রয়াল রেকর্ড ও অনুমোদনের অবস্থা
                    </p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                    মোট {payoutsList.length}টি
                  </span>
                </div>

                {/* Mobile Cards */}
                <div className="block sm:hidden space-y-2.5">
                  {payoutsList.map(item => (
                    <div
                      key={`mob-t-${item.id}`}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black bg-blue-500/10 text-[#38BDF8] border border-blue-500/30">
                          <CheckCircle className="w-3 h-3 fill-sky-400 text-slate-950" />
                          {item.status === 'Approved' ? 'অনুমোদিত' : 'প্রক্রিয়াধীন'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                          <span>{item.method}</span>
                          <span className="block text-[11px] text-slate-400 font-normal">{item.date}</span>
                        </div>
                        <span className="text-base font-black text-[#38BDF8] font-mono">
                          ৳{item.amount.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">আইডি</th>
                        <th className="py-2.5 px-3">তারিখ</th>
                        <th className="py-2.5 px-3">পরিমাণ</th>
                        <th className="py-2.5 px-3">মেথড ও নম্বর</th>
                        <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                      {payoutsList.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                          <td className="py-3 px-3 font-mono text-slate-500">{item.id}</td>
                          <td className="py-3 px-3 text-slate-500">{item.date}</td>
                          <td className="py-3 px-3 text-[#38BDF8] font-black font-mono">৳{item.amount.toLocaleString('bn-BD')}</td>
                          <td className="py-3 px-3 font-mono">{item.method}</td>
                          <td className="py-3 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-black bg-blue-500/10 text-[#38BDF8] border border-blue-500/30">
                              <CheckCircle className="w-3 h-3 fill-sky-400 text-slate-950" />
                              {item.status === 'Approved' ? 'অনুমোদিত' : 'প্রক্রিয়াধীন'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#38BDF8]" /> টিচার প্রোফাইল এডিট
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                সরাসরি ডিভাইস থেকে ছবি আপলোড করে ইনস্ট্রাক্টর তথ্য আপডেট করুন।
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-blue-500/20 border border-blue-500/40 text-[#38BDF8] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>টিচার প্রোফাইল সফলভাবে আপডেট হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={profileAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md shrink-0"
                />

                <div className="space-y-1.5 flex-1 w-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    প্রোফাইল ছবি পরিবর্তন (ফাইল আপলোড)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, setProfileAvatar)}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#006A4E] file:text-white hover:file:bg-[#047857] cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">গ্যালারি থেকে সরাসরি যেকোনো JPG/PNG ছবি আপলোড দিন।</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পদবী / টাইটেল</label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={e => setProfileTitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রতিষ্ঠান / একাডেমি</label>
                  <input
                    type="text"
                    value={profileInstitution}
                    onChange={e => setProfileInstitution(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত বায়ো (Bio)</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                প্রোফাইল পরিবর্তন সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}

        {/* COURSE VIDEO & MODULE MANAGER MODAL */}
        {selectedManageCourseId && (() => {
          const course = courses.find(c => c.id === selectedManageCourseId);
          if (!course) return null;

          const totalLessonsInCourse = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
          const totalModulesInCourse = course.modules?.length || 0;

          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
              <div className="bg-[#0F1E36] text-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-slate-700/80 shadow-2xl space-y-3.5 sm:space-y-4 font-bengali my-auto max-h-[94vh] flex flex-col">
                {/* Header with Course Info */}
                <div className="flex justify-between items-start border-b border-slate-700/80 pb-3">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-[10px] font-bold">
                        {course.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        মোট অগ্রগতি: {totalLessonsInCourse}/{course.targetLessons || 12} লেসন • {totalModulesInCourse}টি মডিউল
                      </span>
                    </div>
                    <h3 className="text-sm sm:base font-black text-white mt-1 truncate flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span className="truncate">{course.title}</span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedManageCourseId(null);
                      setPreviewVideoUrl(null);
                    }}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer shrink-0"
                    title="বন্ধ করুন"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile-Friendly Navigation Tabs */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl sm:rounded-2xl border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setManageModalTab('upload')}
                    className={`py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    manageModalTab === 'upload'
                        ? 'bg-[#006A4E] text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">নতুন লেসন আপলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManageModalTab('curriculum')}
                    className={`py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      manageModalTab === 'curriculum'
                        ? 'bg-[#006A4E] text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">কারিকুলাম ({totalLessonsInCourse}/{course.targetLessons || 12})</span>
                  </button>
                </div>

                {lessonSuccessMsg && (
                  <div className="p-2.5 sm:p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-sky-300 text-xs font-bold flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span>{lessonSuccessMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setManageModalTab('curriculum')}
                      className="text-[11px] underline text-blue-200 font-bold shrink-0 cursor-pointer"
                    >
                      তালিকায় দেখুন →
                    </button>
                  </div>
                )}

                {/* Scrollable Content Body */}
                <div className="overflow-y-auto flex-1 pr-0.5 space-y-3.5">
                  {/* TAB 1: EASY UPLOAD FORM */}
                  {manageModalTab === 'upload' && (() => {
                    const selectedMod = course.modules?.find(m => m.id === lessonModuleId);
                    const selectedModIdx = course.modules?.findIndex(m => m.id === lessonModuleId);
                    const completedInMod = selectedMod?.lessons?.length || 0;
                    const targetPerMod = Math.max(1, Math.ceil((course.targetLessons || 12) / (course.modules?.length || 1)));
                    const nextClassNumInMod = completedInMod + 1;
                    const padClassNum = nextClassNumInMod < 10 ? `০${nextClassNumInMod}` : `${nextClassNumInMod}`;
                    const dynamicTitlePlaceholder = lessonModuleId && lessonModuleId !== 'new'
                      ? `উদা: লেসন ${padClassNum}: টাইটেল বা বিষয়বস্তু লিখুন`
                      : 'উদা: লেসন ০১: ভূমিকা ও প্রয়োজনীয় টুলস সেটআপ';

                    // Dynamic Module and Lesson Name for Automatic Task Hint & Placeholders
                    const modNameText = selectedMod
                      ? formatCleanModuleTitle(selectedMod.title, selectedModIdx !== undefined && selectedModIdx >= 0 ? selectedModIdx : undefined)
                      : (newModuleName.trim() || `মডিউল ${totalModulesInCourse + 1}`);
                    const lessonNumText = `লেসন ${padClassNum}`;
                    const lessonCleanTitle = lessonTitle.trim()
                      ? formatCleanLessonTitle(lessonTitle.trim(), completedInMod)
                      : lessonNumText;
                    const dynamicTaskTitleHint = `উদা: ${modNameText} • ${lessonCleanTitle} - অনুশীলন টাস্ক`;
                    const dynamicTaskDescHint = `উদা: ${modNameText}-এর ${lessonCleanTitle} ভিডিও টিউটোরিয়াল দেখে প্রয়োজনীয় প্র্যাকটিস সম্পন্ন করে কোড/প্রজেক্ট ফাইল বা সমাধান নোট জমা দিন...`;

                    return (
                      <form onSubmit={handleAddVideoLesson} className="bg-slate-900/80 p-3.5 sm:p-5 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
                        {/* Step 1: Module Select with Clean Bengali Titles */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <label className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
                              <span className="w-4 h-4 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-[10px] flex items-center justify-center font-bold">১</span>
                              মডিউল নির্বাচন করুন *
                            </label>
                            {course.modules && course.modules.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setLessonModuleId(lessonModuleId === 'new' ? '' : 'new')}
                                className="text-[11px] text-[#38BDF8] hover:underline font-bold cursor-pointer"
                              >
                                {lessonModuleId === 'new' ? '← বিদ্যমান মডিউল বাছুন' : '+ নতুন মডিউল তৈরি'}
                              </button>
                            )}
                          </div>

                          {lessonModuleId === 'new' || !course.modules || course.modules.length === 0 ? (
                            <input
                              type="text"
                              required
                              value={newModuleName}
                              onChange={e => setNewModuleName(e.target.value)}
                              placeholder={`উদা: মডিউল ${totalModulesInCourse + 1}: নতুন মডিউলের নাম`}
                              className="w-full p-2.5 sm:p-3 bg-slate-950 border border-blue-500/50 rounded-xl text-white font-medium focus:outline-none focus:border-[#006A4E] text-xs sm:text-sm"
                            />
                          ) : (
                            <select
                              required
                              value={lessonModuleId}
                              onChange={e => setLessonModuleId(e.target.value)}
                              className="w-full p-2.5 sm:p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E] cursor-pointer text-xs sm:text-sm"
                            >
                              <option value="" disabled>-- মডিউল নির্বাচন করুন --</option>
                              {course.modules.map((mod, idx) => {
                                const modTarget = Math.max(1, Math.ceil((course.targetLessons || 12) / (course.modules.length || 1)));
                                const currentCount = mod.lessons?.length || 0;
                                return (
                                  <option key={mod.id} value={mod.id}>
                                    {formatCleanModuleTitle(mod.title, idx)} ({currentCount}/{modTarget} লেসন সম্পন্ন)
                                  </option>
                                );
                              })}
                            </select>
                          )}

                          {selectedMod && (
                            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800">
                              <span>নির্বাচিত: <strong className="text-sky-400">{formatCleanModuleTitle(selectedMod.title)}</strong></span>
                              <span className="font-bold text-slate-300">অগ্রগতি: {completedInMod}/{targetPerMod} লেসন</span>
                            </div>
                          )}
                        </div>

                        {/* Step 2: Lesson Title with Dynamic Bengali Auto-Hint */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <label className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
                              <span className="w-4 h-4 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-[10px] flex items-center justify-center font-bold">২</span>
                              লেসন ভিডিওর নাম / শিরোনাম *
                            </label>
                            {selectedMod && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!lessonTitle) {
                                    setLessonTitle(`লেসন ${padClassNum}: `);
                                  }
                                }}
                                className="text-[11px] text-sky-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer"
                                title="অটো প্রিফিক্স বসান"
                              >
                                <span>পরবর্তী: লেসন {padClassNum} ({completedInMod}টি শেষ)</span>
                                <span className="underline text-[10px] text-sky-300">অটো বসান ✎</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            value={lessonTitle}
                            onChange={e => setLessonTitle(e.target.value)}
                            placeholder={dynamicTitlePlaceholder}
                            className="w-full p-2.5 sm:p-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E] text-xs sm:text-sm"
                          />
                        </div>

                        {/* Step 3: Video Source Switch & Input */}
                        <div className="space-y-2">
                          <label className="block font-bold text-slate-300 flex items-center gap-1.5 text-xs">
                            <span className="w-4 h-4 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-[10px] flex items-center justify-center font-bold">৩</span>
                            ভিডিও ফাইল বা লিংক যুক্ত করুন *
                          </label>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setLessonVideoType('url')}
                              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition ${
                                lessonVideoType === 'url'
                                  ? 'bg-[#006A4E]/20 text-[#38BDF8] border-blue-600/50'
                                  : 'bg-slate-950 text-slate-400 border-slate-800'
                              }`}
                            >
                              <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">YouTube / ভিডিও লিংক</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setLessonVideoType('file')}
                              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border transition ${
                                lessonVideoType === 'file'
                                  ? 'bg-[#006A4E]/20 text-[#38BDF8] border-blue-600/50'
                                  : 'bg-slate-950 text-slate-400 border-slate-800'
                              }`}
                            >
                              <Upload className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">ফোন / ডিভাইস ফাইল</span>
                            </button>
                          </div>

                          {lessonVideoType === 'url' ? (
                            <input
                              type="text"
                              value={lessonVideoUrl}
                              onChange={e => {
                                setLessonVideoUrl(e.target.value);
                                if (e.target.value.trim() && (!lessonDuration || lessonDuration === '15:00 min')) {
                                  setLessonDuration('১৫:০০ মিনিট');
                                }
                              }}
                              placeholder="https://www.youtube.com/watch?v=... অথবা ভিডিও লিংক পেস্ট করুন"
                              className="w-full p-2.5 sm:p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E] text-xs sm:text-sm"
                            />
                          ) : (
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 space-y-1.5">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileUpload}
                                className="block w-full text-xs text-slate-400 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#006A4E]/20 file:text-[#38BDF8] cursor-pointer"
                              />
                              {lessonVideoFileName && (
                                <p className="text-[11px] text-[#38BDF8] font-bold">✓ নির্বাচিত ভিডিও: {lessonVideoFileName}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Step 4: Duration & Resource Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <label className="font-bold text-slate-300 text-xs">ভিডিওর সময় / ডিউরেশন</label>
                              <span className="text-[10px] text-sky-400">স্বয়ংক্রিয়/পরিবর্তনযোগ্য</span>
                            </div>
                            <input
                              type="text"
                              value={lessonDuration}
                              onChange={e => setLessonDuration(e.target.value)}
                              placeholder="উদা: ১৫:০০ মিনিট"
                              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E] text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1 text-xs">নোটস / PDF ফাইল (ঐচ্ছিক)</label>
                            <input
                              type="file"
                              onChange={e => handleFileUpload(e, setLessonResourceUrl, setLessonResourceName)}
                              className="block w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-800 file:text-white cursor-pointer"
                            />
                            {lessonResourceName && (
                              <span className="text-[10px] text-[#38BDF8] block mt-1">✓ {lessonResourceName}</span>
                            )}
                          </div>
                        </div>

                        {/* Step 5: Compact & Short Collapsible Practice Task Builder */}
                        <div className="bg-slate-950 rounded-xl border border-blue-500/30 overflow-hidden transition">
                          {/* Sleek Compact Toggle Button */}
                          <button
                            type="button"
                            onClick={() => setIsTaskExpanded(!isTaskExpanded)}
                            className="w-full py-2 px-3 flex items-center justify-between gap-2 text-left hover:bg-slate-900 transition cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                              <span className="font-bold text-slate-200 text-xs truncate">
                                অনুশীলন টাস্ক (ঐচ্ছিক)
                              </span>
                              {lessonTaskDesc && (
                                <span className="text-[10px] text-sky-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">✓ রেডি</span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-sky-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/20 shrink-0">
                              {isTaskExpanded ? 'সংকোচন ▴' : '+ টাস্ক দিন ▾'}
                            </span>
                          </button>

                          {/* Expandable Task Form */}
                          {isTaskExpanded && (
                            <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3 animate-fadeIn">
                              {/* Task Title */}
                              <div>
                                <label className="block font-bold text-slate-300 mb-1 text-xs">
                                  টাস্কের নাম (ঐচ্ছিক)
                                </label>
                                <input
                                  type="text"
                                  value={lessonTaskTitle}
                                  onChange={e => setLessonTaskTitle(e.target.value)}
                                  placeholder={dynamicTaskTitleHint}
                                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-[#006A4E]"
                                />
                              </div>

                              {/* Description Textarea */}
                              <div>
                                <label className="block font-bold text-slate-300 mb-1 text-xs">
                                  টাস্ক নির্দেশনা ও রিকোয়ারমেন্টস *
                                </label>
                                <textarea
                                  rows={3}
                                  value={lessonTaskDesc}
                                  onChange={e => setLessonTaskDesc(e.target.value)}
                                  placeholder={dynamicTaskDescHint}
                                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-[#006A4E]"
                                />
                              </div>

                              {/* Task Attachment & Reference Link */}
                              <div>
                                <label className="block font-bold text-slate-300 mb-1 text-xs">
                                  রেফারেন্স ফাইল / লিংক (ঐচ্ছিক)
                                </label>
                                <div className="space-y-2">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1">
                                      <input
                                        type="file"
                                        onChange={e => handleFileUpload(e, setLessonTaskAttachmentUrl, setLessonTaskAttachmentName)}
                                        className="block w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-slate-800 file:text-sky-400 hover:file:bg-slate-700 cursor-pointer"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <input
                                        type="url"
                                        value={lessonTaskReferenceLink}
                                        onChange={e => setLessonTaskReferenceLink(e.target.value)}
                                        placeholder="বা রেফারেন্স লিংক দিন (Drive, GitHub, Docs)"
                                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#006A4E]"
                                      />
                                    </div>
                                  </div>
                                  {(lessonTaskAttachmentName || lessonTaskReferenceLink) && (
                                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                                      {lessonTaskAttachmentName && (
                                        <span className="text-[#38BDF8] font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                          ✓ ফাইল: {lessonTaskAttachmentName}
                                        </span>
                                      )}
                                      {lessonTaskReferenceLink && (
                                        <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 truncate max-w-[200px]">
                                          🔗 লিংক: {lessonTaskReferenceLink}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Due Date and Points */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-bold text-slate-300 mb-1 text-[11px]">জমার শেষ তারিখ</label>
                                  <input
                                    type="date"
                                    value={lessonTaskDueDate}
                                    onChange={e => setLessonTaskDueDate(e.target.value)}
                                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#006A4E]"
                                  />
                                </div>
                                <div>
                                  <label className="block font-bold text-slate-300 mb-1 text-[11px]">মোট নম্বর (Marks)</label>
                                  <input
                                    type="number"
                                    min={1}
                                    value={lessonTaskPoints}
                                    onChange={e => setLessonTaskPoints(e.target.value)}
                                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-bold focus:outline-none focus:border-[#006A4E]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Submit Action Button */}
                        <button
                          type="submit"
                          className="w-full py-3 sm:py-3.5 bg-[#006A4E] hover:bg-[#047857] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>লেসন ভিডিও ও টাস্ক প্রকাশ করুন</span>
                        </button>
                      </form>
                    );
                  })()}

                  {/* TAB 2: CURRICULUM & MODULE DROPDOWN LIST */}
                  {manageModalTab === 'curriculum' && (
                    <div className="space-y-3">
                      {/* Overall Progress Summary Bar - Clean & Centered on Mobile */}
                      <div className="p-2.5 sm:p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-1.5 sm:gap-2 text-xs">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          <span className="text-slate-400 font-medium">কোর্স টার্গেট অগ্রগতি:</span>
                          <span className="font-extrabold text-sky-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                            {totalLessonsInCourse} / {course.targetLessons || 12} লেসন সম্পন্ন
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium text-center">
                          মোট মডিউল: {totalModulesInCourse} / {course.targetModules || 4}
                        </div>
                      </div>

                      {(!course.modules || course.modules.length === 0) ? (
                        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                          <Film className="w-8 h-8 text-slate-500 mx-auto" />
                          <p className="text-xs text-slate-400">এই কোর্সে এখনও কোনো ভিডিও লেসন বা মডিউল যোগ করা হয়নি।</p>
                          <button
                            type="button"
                            onClick={() => setManageModalTab('upload')}
                            className="px-4 py-2 bg-[#006A4E] text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            + প্রথম লেসন আপলোড করুন
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {course.modules.map((module, modIdx) => {
                            const isExpanded = expandedManageModules[module.id] !== undefined
                              ? expandedManageModules[module.id]
                              : modIdx === 0;
                            const targetPerMod = Math.max(1, Math.ceil((course.targetLessons || 12) / (course.modules.length || 1)));
                            const currentCount = module.lessons?.length || 0;

                            return (
                              <div key={module.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedManageModules(prev => ({
                                      ...prev,
                                      [module.id]: !isExpanded
                                    }));
                                  }}
                                  className="w-full p-3 sm:p-3.5 flex items-start sm:items-center justify-between text-left text-xs font-bold text-sky-400 hover:bg-slate-800/60 transition cursor-pointer select-none gap-2.5"
                                >
                                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-[#38BDF8] text-xs flex items-center justify-center font-black shrink-0 mt-0.5">
                                      {modIdx + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-white text-xs sm:text-sm font-extrabold leading-snug break-words">
                                        {formatCleanModuleTitle(module.title, modIdx)}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1 sm:hidden">
                                        <span className="text-[10px] text-sky-300 font-bold px-2 py-0.5 rounded-full bg-slate-950/80 border border-blue-900/50 inline-block">
                                          {currentCount}/{targetPerMod} লেসন সম্পন্ন
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="hidden sm:inline-block text-[10px] text-sky-300 font-bold px-2 py-0.5 rounded-full bg-slate-950/80 border border-blue-900/50">
                                      {currentCount}/{targetPerMod} লেসন সম্পন্ন
                                    </span>
                                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="p-2.5 sm:p-3 space-y-2 border-t border-slate-800/80 animate-fadeIn">
                                    {(!module.lessons || module.lessons.length === 0) ? (
                                      <p className="text-[11px] text-slate-400 italic py-3 text-center">এই মডিউলে এখনও কোনো লেসন যোগ করা হয়নি।</p>
                                    ) : (
                                      module.lessons.map((lesson, lesIdx) => {
                                        const cleanName = lesson.title ? lesson.title.replace(/^(?:Lesson|লেসন|ক্লাস|Class)\s*[\d০-৯]+\s*[:\-–]\s*/i, '').trim() : `লেসন ${lesIdx + 1}`;
                                        const bNum = lesIdx + 1 < 10 ? `০${lesIdx + 1}` : `${lesIdx + 1}`;
                                        return (
                                          <div
                                            key={lesson.id}
                                            className="bg-slate-950/90 p-2.5 sm:p-3 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all flex items-center justify-between text-xs gap-2.5 shadow-sm"
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                              <span className="px-2 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[#38BDF8] text-[11px] font-black shrink-0">
                                                SL {bNum}
                                              </span>
                                              <div className="min-w-0 flex-1">
                                                <span className="font-bold text-slate-200 text-xs sm:text-sm leading-snug break-words block">
                                                  {cleanName || lesson.title}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                                  {lesson.duration && <span>⏱ {lesson.duration}</span>}
                                                  <span className="text-sky-400 font-semibold">✓ টাস্ক সংযুক্ত</span>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                                className="w-8 h-8 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95 text-[#38BDF8] border border-blue-500/30 rounded-lg flex items-center justify-center cursor-pointer transition shadow-sm"
                                                title="ভিডিও প্লে করুন"
                                              >
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteLesson(course.id, module.id, lesson.id)}
                                                className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 active:scale-95 rounded-lg flex items-center justify-center cursor-pointer transition"
                                                title="লেসন মুছুন"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => setManageModalTab('upload')}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-[#38BDF8] text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5 transition"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>আরও নতুন লেসন ও ভিডিও আপলোড করুন</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* In-Modal Video Player Overlay */}
                  {previewVideoUrl && (
                    <div className="p-3 bg-slate-950 rounded-2xl border border-blue-500/40 space-y-2 shrink-0">
                      <div className="flex justify-between items-center text-xs font-bold text-sky-400">
                        <span className="flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5" /> ভিডিও প্লেয়ার প্রিভিউ
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewVideoUrl(null)}
                          className="text-slate-400 hover:text-white text-xs px-2 py-0.5 bg-slate-800 rounded-md cursor-pointer"
                        >
                          বন্ধ করুন ✕
                        </button>
                      </div>
                      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                        {previewVideoUrl.includes('embed') || previewVideoUrl.includes('youtube') || previewVideoUrl.includes('vimeo') ? (
                          <iframe
                            src={previewVideoUrl}
                            title="Video Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <video src={previewVideoUrl} controls className="w-full h-full" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL: CREATE NEW ASSIGNMENT */}
        {showCreateModal && (() => {
          const activeCourse = courses.find(c => c.id === selectedCourseId) || teacherCourses[0] || courses[0];
          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 sm:space-y-5 font-bengali my-auto max-h-[92vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-[#38BDF8]" /> নতুন টাস্ক / অ্যাসাইনমেন্ট দিন
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Direct Course Info Display - No Select Dropdown Needed */}
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#006A4E]/20 flex items-center justify-center text-[#38BDF8] shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">নির্ধারিত কোর্স:</span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {activeCourse?.title || 'নির্বাচিত কোর্স'}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-[10px] font-bold shrink-0">
                    {activeCourse?.category || 'কোর্স'}
                  </span>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-3.5 sm:space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">টাস্ক / অ্যাসাইনমেন্টের শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      value={asgnTitle}
                      onChange={e => setAsgnTitle(e.target.value)}
                      placeholder="উদা: PTE Speaking Describe Image Task Practice"
                      className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">বিস্তারিত নির্দেশনা / বিবরণ *</label>
                    <textarea
                      required
                      rows={3}
                      value={asgnDesc}
                      onChange={e => setAsgnDesc(e.target.value)}
                      placeholder="শিক্ষার্থীদের কী করতে হবে তার বিস্তারিত বিবরণ..."
                      className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">জমার শেষ সময় (Due Date)</label>
                      <input
                        type="date"
                        value={asgnDueDate}
                        onChange={e => setAsgnDueDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">মোট পয়েন্ট / নম্বর</label>
                      <input
                        type="number"
                        min={1}
                        value={asgnPoints}
                        onChange={e => setAsgnPoints(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">রেফারেন্স ফাইল / লিংক (ঐচ্ছিক)</label>
                    <input
                      type="file"
                      onChange={e => handleFileUpload(e, setAsgnAttachmentUrl, setAsgnAttachmentName)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#006A4E]/20 file:text-[#38BDF8] cursor-pointer"
                    />
                    {asgnAttachmentName && (
                      <p className="text-[11px] text-[#38BDF8] font-bold mt-1">✓ সংযুক্ত ফাইল: {asgnAttachmentName}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 sm:py-3.5 bg-[#006A4E] hover:bg-[#047857] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>টাস্ক / অ্যাসাইনমেন্ট প্রকাশ করুন</span>
                  </button>
                </form>
              </div>
            </div>
          );
        })()}

        {/* MODAL: VIEW & GRADE / EDIT SUBMISSION */}
        {selectedSubmission && (() => {
          const asgn = assignments.find(a => a.id === selectedSubmission.assignmentId);
          const lessonInfo = getAssignmentLessonInfo(asgn);
          const progress = getStudentCourseProgress(selectedSubmission.studentId, selectedSubmission.studentEmail, selectedSubmission.assignmentId);
          const links = getSubmissionLinks(selectedSubmission);

          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-bengali">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#38BDF8] text-[10px] font-extrabold border border-blue-500/20">
                      শিক্ষার্থীর উত্তরপত্র মূল্যায়ন ও এডিট
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#38BDF8]" />
                      {selectedSubmission.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedSubmission.studentEmail} • কোর্স: <span className="text-indigo-600 dark:text-sky-400 font-bold">{asgn?.courseTitle || 'কোর্স প্রজেক্ট'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Assigned Lesson & Task Information Box */}
                <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[11px] font-black flex items-center gap-1 shadow-2xs">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{lessonInfo.lessonNo}</span>
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {asgn?.title || lessonInfo.taskTitle}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      মোট পয়েন্ট: {asgn?.totalPoints || 50}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 text-xs leading-relaxed">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-0.5 text-[11px]">
                      📋 যে কাজটি করতে দেওয়া হয়েছে (টাস্ক নির্দেশনা):
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {asgn?.description || lessonInfo.taskDesc}
                    </p>
                  </div>
                </div>

                {/* Course Tasks Progress Tracker */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>শিক্ষার্থীর কোর্সের টাস্ক অগ্রগতি:</span>
                      <span className="font-mono font-black text-indigo-600 dark:text-sky-400">
                        {progress.completedTasks} / {progress.totalTasks} টাস্ক সম্পন্ন
                      </span>
                    </span>
                    <span className={`text-[11px] font-black ${
                      progress.isAllCompleted ? 'text-[#38BDF8]' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {progress.isAllCompleted ? '🎉 সব টাস্ক সম্পন্ন (সাকসেস)' : `⏳ আরও ${progress.remainingTasks}টি টাস্ক বাকি`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress.isAllCompleted ? 'bg-[#006A4E]' : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                      }`}
                      style={{ width: `${progress.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    💡 টিচারের দেখার পর যদি টাস্ক বাকি থাকে তাহলে 'রিভিউ' তালিকায় থাকবে, আর সব টাস্ক সম্পন্ন হলে স্বয়ংক্রিয়ভাবে 'সাকসেস' তালিকায় যাবে।
                  </p>
                </div>

                {/* Student Response Content Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#38BDF8]" /> শিক্ষার্থীর লিখিত উত্তর / বিবরণ:
                  </h4>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedSubmission.submissionText || 'কোনো লিখিত নোট প্রদান করা হয়নি।'}
                  </div>

                  {/* Submitted File / Audio / Document Section */}
                  {selectedSubmission.fileName || selectedSubmission.fileUrl ? (
                    <div className="p-4 bg-blue-500/10 dark:bg-slate-800 rounded-2xl border border-blue-500/30 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="w-4 h-4 text-[#38BDF8] shrink-0" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {selectedSubmission.fileName || 'সংযুক্ত ফাইল/নোট'}
                          </span>
                        </div>
                        {selectedSubmission.fileUrl && (
                          <a
                            href={selectedSubmission.fileUrl}
                            download={selectedSubmission.fileName || 'submission_file'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>ডাউনলোড / দেখুন</span>
                          </a>
                        )}
                      </div>

                      {/* Audio Preview if audio data */}
                      {selectedSubmission.fileUrl && (selectedSubmission.fileUrl.startsWith('data:audio') || selectedSubmission.fileName?.match(/\.(mp3|wav|m4a|ogg)$/i)) && (
                        <div className="pt-2">
                          <audio src={selectedSubmission.fileUrl} controls className="w-full h-9 rounded-lg" />
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Live / External links */}
                  {links.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-indigo-500" /> সংযুক্ত প্রজেক্ট লিংকসমূহ:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {links.map((lnk, i) => (
                          <a
                            key={i}
                            href={lnk.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-sky-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{lnk.title}</span>
                            <ExternalLink className="w-3 h-3 ml-1 text-sky-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grading & Edit Form */}
                <form onSubmit={handleGradeSubmit} className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> পয়েন্ট প্রদান ও ইনস্ট্রাক্টর মার্কস
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        প্রাপ্ত নম্বর (পয়েন্ট) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={asgn?.totalPoints || 100}
                        required
                        value={gradePoints}
                        onChange={e => setGradePoints(Number(e.target.value))}
                        className="w-full p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ফাইল / লাইভ প্রজেক্ট লিংক (ঐচ্ছিক)
                      </label>
                      <input
                        type="url"
                        value={gradeLinkUrl}
                        onChange={e => setGradeLinkUrl(e.target.value)}
                        placeholder="https://github.com/... বা লিংক"
                        className="w-full p-2.5 sm:p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ইনস্ট্রাক্টর মন্তব্য / ফিডব্যাক
                    </label>
                    <textarea
                      rows={3}
                      value={gradeFeedback}
                      onChange={e => setGradeFeedback(e.target.value)}
                      placeholder="শিক্ষার্থীর মূল্যায়নের ওপর শিক্ষক হিসেবে আপনার মন্তব্য বা পরামর্শ লিখুন..."
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                        className="py-2.5 sm:py-3 px-3 sm:px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>ডিলিট</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const subToAgain = selectedSubmission;
                          setSelectedSubmission(null);
                          setAgainModalSub(subToAgain);
                          const defaultLesson = asgn?.lessonNo || asgn?.title?.match(/লেসন\s*\d+|Lesson\s*\d+/i)?.[0] || 'লেসন নং ১';
                          setAgainLessonNo(defaultLesson);
                          setAgainReason('');
                        }}
                        className="py-2.5 sm:py-3 px-3 sm:px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>এগেইন পাঠান</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(null)}
                        className="py-2.5 sm:py-3 px-3 sm:px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 sm:py-3 px-4 sm:px-5 bg-[#006A4E] hover:bg-[#047857] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>মূল্যায়ন সংরক্ষণ</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

        {/* AGAIN / REDO LESSON MODAL (স্বয়ংক্রিয়ভাবে বর্তমান লেসনে এগেইন পাঠানো) */}
        {againModalSub && (() => {
          const asgn = assignments.find(a => a.id === againModalSub.assignmentId);
          const lessonInfo = getAssignmentLessonInfo(asgn);

          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-bengali">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-7 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        এগেইন পাঠান
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        শিক্ষার্থী: <span className="font-bold text-slate-800 dark:text-slate-200">{againModalSub.studentName}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAgainModalSub(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSendAgainRequest} className="space-y-3.5">
                  {/* Target Course & Assignment Banner */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-1 text-slate-500 dark:text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span>চলতি লেসন ও টাস্ক:</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black">
                        {lessonInfo.lessonNo}
                      </span>
                    </div>
                    <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">{asgn?.courseTitle || 'কোর্স'}</div>
                    <div className="text-indigo-600 dark:text-sky-400 font-semibold">{asgn?.title || lessonInfo.taskTitle}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">টাস্ক নির্দেশনা:</span>
                      {asgn?.description || lessonInfo.taskDesc}
                    </div>
                  </div>

                  {/* Quick Preset Reasons */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                      কুইক কারণ সিলেক্ট করুন:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'অডিও ফ্লুয়েন্সি ও প্রোনাউন্সিয়েশন সঠিক হয়নি',
                        'কোডে সিনট্যাক্স এরর ও রেসপনসিভনেস মিসিং',
                        'রিকোয়ারমেন্ট অনুযায়ী সম্পূর্ণ ফাইল যুক্ত হয়নি',
                        'ফাইল করাপ্ট বা ওপেন হচ্ছে না'
                      ].map((reasonText, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => setAgainReason(reasonText)}
                          className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-600 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer"
                        >
                          + {reasonText}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason / Custom Notes */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 mb-1">
                      সংশোধনের বিবরণ / মন্তব্য *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={againReason}
                      onChange={e => setAgainReason(e.target.value)}
                      placeholder="শিক্ষার্থী কোন বিষয়টি সংশোধন করে আবার জমা দেবে লিখুন..."
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAgainModalSub(null)}
                      className="py-2 px-3.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>এগেইন পাঠান</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}



        {/* TARGET CONFIGURATION MODAL */}
        {isTargetModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn font-bengali">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-7 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">কোর্স টার্গেট কনফিগার করুন</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">কোর্সের কাঙ্ক্ষিত লক্ষ্যমাত্রা সেট করুন</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTargetModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (targetConfigCourseId) {
                    updateCourse(targetConfigCourseId, {
                      targetModules: Number(targetConfigModules) || 4,
                      targetLessons: Number(targetConfigLessons) || 16,
                      targetAssignments: Number(targetConfigAssignments) || 4,
                    });
                    setOfferToastMsg('🎯 কোর্সের আপলোড ও অ্যাসাইনমেন্ট টার্গেট সফলভাবে সংরক্ষিত হয়েছে!');
                    setTimeout(() => setOfferToastMsg(null), 3500);
                  }
                  setIsTargetModalOpen(false);
                }}
                className="space-y-4 text-xs"
              >
                {teacherCourses.length > 1 && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">কোর্স নির্বাচন করুন *</label>
                    <select
                      value={targetConfigCourseId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        setTargetConfigCourseId(cid);
                        const c = teacherCourses.find(tc => tc.id === cid);
                        if (c) {
                          setTargetConfigModules(c.targetModules || 4);
                          setTargetConfigLessons(c.targetLessons || 16);
                          setTargetConfigAssignments(c.targetAssignments || 4);
                        }
                      }}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                    >
                      {teacherCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    মডিউল টার্গেট (মোট কতটি মডিউল হবে)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={targetConfigModules}
                      onChange={(e) => setTargetConfigModules(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">টি মডিউল</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    লেসন / ভিডিও টার্গেট (মোট কতটি লেসন ভিডিও থাকবে)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={300}
                      required
                      value={targetConfigLessons}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTargetConfigLessons(val);
                        setTargetConfigAssignments(val);
                      }}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">টি লেসন</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      অ্যাসাইনমেন্ট টার্গেট (লেসন/ভিডিও টার্গেটের সমান)
                    </label>
                    <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full">প্রতি লেসনে ১টি টাস্ক</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={300}
                      required
                      value={targetConfigAssignments}
                      onChange={(e) => setTargetConfigAssignments(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">টি টাস্ক</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsTargetModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-blue-500 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>টার্গেট সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: COURSE STUDENT & SYLLABUS PREVIEW */}
        {selectedPreviewCourse && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-bengali">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-7 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-[#38BDF8] flex items-center justify-center font-black">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#38BDF8] text-[10px] font-bold">
                      {selectedPreviewCourse.category} • স্টুডেন্ট কারিকুলাম প্রিভিউ
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {selectedPreviewCourse.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewCourse(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Banner & Quick Specs */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-48 border border-slate-200 dark:border-slate-800">
                <img
                  src={selectedPreviewCourse.thumbnail}
                  alt={selectedPreviewCourse.title}
                  className="w-full h-44 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex items-end p-4">
                  <div className="flex flex-wrap items-center gap-2 text-white text-xs">
                    <span className="px-2.5 py-1 bg-blue-500 rounded-full font-bold">
                      ৳{selectedPreviewCourse.price?.toLocaleString()}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800/80 rounded-full font-medium">
                      👥 {selectedPreviewCourse.students?.toLocaleString() || 240} শিক্ষার্থী
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800/80 rounded-full font-medium">
                      ⭐ {selectedPreviewCourse.rating || 4.9} রেটিং
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800/80 rounded-full font-medium">
                      📚 {selectedPreviewCourse.modules?.length || 0} মডিউল • {selectedPreviewCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} লেসন
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Action Buttons - Single clean button, no separate task button needed */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const cId = selectedPreviewCourse.id;
                    setSelectedPreviewCourse(null);
                    setSelectedManageCourseId(cId);
                    if (selectedPreviewCourse.modules && selectedPreviewCourse.modules.length > 0) {
                      setLessonModuleId(selectedPreviewCourse.modules[0].id);
                    } else {
                      setLessonModuleId('new');
                    }
                  }}
                  className="w-full py-2.5 sm:py-3 px-3 bg-[#006A4E] hover:bg-[#047857] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4 text-white" />
                  <span>লেসন ভিডিও ও মডিউল আপলোড করুন</span>
                </button>
              </div>

              {/* Description */}
              {selectedPreviewCourse.description && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#38BDF8]" /> কোর্স বিবরণ
                  </h4>
                  <p className="leading-relaxed">{selectedPreviewCourse.description}</p>
                </div>
              )}

              {/* Curriculum Breakdown with Accordion / Dropdown Modules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#38BDF8]" /> কারিকুলাম ও আপলোডকৃত লেসন তালিকা
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    মোট {selectedPreviewCourse.modules?.length || 0}টি মডিউল • {selectedPreviewCourse.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}টি লেসন ও টাস্ক
                  </span>
                </div>

                {(!selectedPreviewCourse.modules || selectedPreviewCourse.modules.length === 0) ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">এই কোর্সে এখনো কোনো মডিউল বা ভিডিও যুক্ত করা হয়নি।</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedPreviewCourse.modules.map((mod, modIdx) => {
                      const isExpanded = expandedPreviewModules[mod.id] !== undefined
                        ? expandedPreviewModules[mod.id]
                        : modIdx === 0; // Default first module open

                      return (
                        <div
                          key={mod.id || modIdx}
                          className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden transition-all duration-200"
                        >
                          {/* Module Dropdown Accordion Header Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedPreviewModules(prev => ({
                                ...prev,
                                [mod.id]: !isExpanded
                              }));
                            }}
                            className="w-full p-3 sm:p-4 flex items-start sm:items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer select-none gap-2.5"
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span className="w-6 h-6 rounded-full bg-[#006A4E]/20 text-[#38BDF8] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {modIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
                                  {formatCleanModuleTitle(mod.title, modIdx)}
                                </h5>
                                <div className="flex items-center gap-2 mt-1 sm:hidden">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 inline-block">
                                    {mod.lessons?.length || 0} টি লেসন
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                {mod.lessons?.length || 0} টি লেসন
                              </span>
                              <div className="w-6 h-6 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          </button>

                          {/* Dropdown Lessons List */}
                          {isExpanded && (
                            <div className="p-3 sm:p-3.5 space-y-2 border-t border-slate-200/80 dark:border-slate-700/80 animate-fadeIn bg-slate-50/50 dark:bg-slate-900/50">
                              {mod.lessons && mod.lessons.length > 0 ? (
                                <div className="space-y-2">
                                  {mod.lessons.map((les, lesIdx) => {
                                    const cleanName = les.title ? les.title.replace(/^(?:Lesson|লেসন|ক্লাস|Class)\s*[\d০-৯]+\s*[:\-–]\s*/i, '').trim() : `লেসন ${lesIdx + 1}`;
                                    const bNum = lesIdx + 1 < 10 ? `০${lesIdx + 1}` : `${lesIdx + 1}`;
                                    return (
                                      <div
                                        key={les.id || lesIdx}
                                        className="bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between text-xs gap-2.5 shadow-sm"
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[#38BDF8] text-[11px] font-black shrink-0">
                                            SL {bNum}
                                          </span>
                                          <div className="min-w-0 flex-1">
                                            <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug break-words block text-xs sm:text-sm">
                                              {cleanName || les.title}
                                            </span>
                                            {les.duration && (
                                              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                                                ⏱ সময়: {les.duration}
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          {les.videoUrl && (
                                            <button
                                              type="button"
                                              onClick={() => setPreviewVideoUrl(les.videoUrl)}
                                              className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 active:scale-95 text-[#38BDF8] flex items-center justify-center transition cursor-pointer shadow-sm"
                                              title="ভিডিও প্লে করুন"
                                            >
                                              <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic py-3 text-center">
                                  এই মডিউলে এখনও কোনো লেসন যোগ করা হয়নি।
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewCourse(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  প্রিভিউ বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POLICY & ADMIN DIRECTIVES MODAL */}
        {showDirectivesModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-bengali animate-fadeIn">
            <div className="bg-slate-900 border border-indigo-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-left relative space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-sky-300 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">টিচার নীতি ও এডমিন নির্দেশিকা হাব</h3>
                    <p className="text-[10px] text-sky-400">PTENit IT Training Academy • অফিশিয়াল টিচার নীতিমালা</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDirectivesModal(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {/* Admin Notice Directive */}
                <div className="p-4 bg-slate-800/80 border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা
                    </span>
                    <span className="text-[10px] text-slate-400">2026-08-01 09:00</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।
                  </p>
                  <span className="text-[10px] text-slate-400 block text-right font-bold">প্রেরক: PTENit Admin (মেইন এডমিন)</span>
                </div>

                {/* Policy Notice Card */}
                <div className="p-4 bg-slate-800/80 border border-blue-500/40 rounded-2xl space-y-2">
                  <span className="font-black text-sky-400 text-xs flex items-center gap-1.5">
                    📌 কোর্স দায়িত্ব নীতি
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    মেইন এডমিন কোর্স অফার পাঠালে <strong>'দায়িত্ব গ্রহণ (Accept Offer)'</strong> করার পরেই শুধুমাত্র এতে মডিউল ও ভিডিও কনটেন্ট আপলোড করতে পারবেন। দায়িত্ব গ্রহণের আগে কোনো কন্টেন্ট যোগ করার সুযোগ থাকবে না।
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowDirectivesModal(false)}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  ঠিক আছে, বুঝেছি
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER SETTINGS MODAL */}
        {showTeacherSettingsModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 font-bengali animate-fadeIn overflow-y-auto">
            <div className="bg-slate-900 border border-blue-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-left relative space-y-6 my-auto max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-[#38BDF8] flex items-center justify-center font-black">
                    <Settings className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">টিচার সেটিংস হাব</h3>
                    <p className="text-xs text-slate-400">প্রোফাইল আপডেট, পাসওয়ার্ড, পেমেন্ট মেথড ও সেটিংস সেটআপ করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTeacherSettingsModal(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Sub Tab Navigation */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none text-xs font-bold">
                <button
                  onClick={() => setSettingsSubTab('profile')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'profile' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>প্রোফাইল আপডেট</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('payout')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'payout' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>পেমেন্ট ও ক্যাশআউট নাম্বার</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('security')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'security' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('preferences')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'preferences' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>সিস্টেম প্রেফারেন্স</span>
                </button>
              </div>

              {/* SUBTAB 1: PROFILE UPDATE */}
              {settingsSubTab === 'profile' && (
                <form
                  onSubmit={(e) => {
                    handleProfileSave(e);
                  }}
                  className="space-y-4 text-xs"
                >
                  {profileSaved && (
                    <div className="p-3 bg-blue-500/20 border border-blue-500/40 text-sky-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                      <span>টিচার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <img
                      src={profileAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 w-full">
                      <label className="block font-bold text-slate-300">
                        প্রোফাইল ছবি পরিবর্তন (ডিভাইস থেকে ফাইল আপলোড)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, setProfileAvatar)}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#006A4E] file:text-white hover:file:bg-[#047857] cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 block">গ্যালারি থেকে আপনার পাসপোর্ট/প্রোফাইল ছবি নির্বাচন করুন।</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">আপনার পূর্ণ নাম *</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পদবী / টাইটেল</label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={e => setProfileTitle(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">প্রতিষ্ঠান / ট্রেইনিং একাডেমি</label>
                      <input
                        type="text"
                        value={profileInstitution}
                        onChange={e => setProfileInstitution(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত বায়ো (Bio)</label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={e => setProfileBio(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </form>
              )}

              {/* SUBTAB 2: PAYOUT PAYMENT SETUP */}
              {settingsSubTab === 'payout' && (
                <div className="space-y-4 text-xs">
                  {settingsPayoutSaved && (
                    <div className="p-3 bg-blue-500/20 border border-blue-500/40 text-sky-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                      <span>পেমেন্ট ও ক্যাশআউট তথ্য আপডেট হয়েছে!</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#38BDF8]" /> ক্যাশআউট ও উইথড্রয়াল ওয়ালেট
                    </h4>
                    <p className="text-slate-400 text-xs">
                      কোর্স বিক্রয়ের আয় বিকাশে অথবা ব্যাংকে ক্যাশআউট করার জন্য তথ্য দিন।
                    </p>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পেমেন্ট মেথড নির্বাচন করুন</label>
                      <select
                        value={settingsPayoutMethod}
                        onChange={e => setSettingsPayoutMethod(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-[#006A4E]"
                      >
                        <option value="bkash">{t('বিকাশ পার্সোনাল', 'bKash Personal')}</option>
                        <option value="nagad">{t('নগদ পার্সোনাল', 'Nagad Personal')}</option>
                        <option value="rocket">{t('রকেট পার্সোনাল', 'Rocket Personal')}</option>
                        <option value="bank">{t('ব্যাংক একাউন্ট', 'Bank Wire')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">একাউন্ট / মোবাইল নম্বর *</label>
                      <input
                        type="text"
                        value={settingsPayoutNumber}
                        onChange={e => setSettingsPayoutNumber(e.target.value)}
                        placeholder="উদা: 01700000000"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsPayoutSaved(true);
                        setTimeout(() => setSettingsPayoutSaved(false), 3000);
                      }}
                      className="w-full py-3 bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>পেমেন্ট তথ্য সেভ করুন</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: PASSWORD & SECURITY */}
              {settingsSubTab === 'security' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (settingsPassword.new !== settingsPassword.confirm) {
                      alert('নতুন পাসওয়ার্ড দুটি মিলছে না!');
                      return;
                    }
                    setSettingsPasswordSaved(true);
                    setSettingsPassword({ old: '', new: '', confirm: '' });
                    setTimeout(() => setSettingsPasswordSaved(false), 3000);
                  }}
                  className="space-y-4 text-xs"
                >
                  {settingsPasswordSaved && (
                    <div className="p-3 bg-blue-500/20 border border-blue-500/40 text-sky-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                      <span>পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" /> অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বর্তমান পাসওয়ার্ড</label>
                      <input
                        type="password"
                        required
                        value={settingsPassword.old}
                        onChange={e => setSettingsPassword({ ...settingsPassword, old: e.target.value })}
                        placeholder="••••••••"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">নতুন পাসওয়ার্ড</label>
                        <input
                          type="password"
                          required
                          value={settingsPassword.new}
                          onChange={e => setSettingsPassword({ ...settingsPassword, new: e.target.value })}
                          placeholder="••••••••"
                          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                        <input
                          type="password"
                          required
                          value={settingsPassword.confirm}
                          onChange={e => setSettingsPassword({ ...settingsPassword, confirm: e.target.value })}
                          placeholder="••••••••"
                          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>পাসওয়ার্ড সিকিউর আপডেট করুন</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SUBTAB 4: PREFERENCES & LOGOUT */}
              {settingsSubTab === 'preferences' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-400" /> সিস্টেম অপশন ও একাউন্ট কন্ট্রোল
                    </h4>

                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-bold text-white">ড্যাশবোর্ড সাউন্ড নোটিফিকেশন</p>
                        <p className="text-[10px] text-slate-400">নতুন মেসেজ বা নোটিফিকেশনে সাউন্ড প্লেইং</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-500/20 text-[#38BDF8] font-bold text-[11px] rounded-lg">চালু রয়েছে ✓</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-bold text-white">ড্যাশবোর্ড মোড</p>
                        <p className="text-[10px] text-slate-400">হাই কনট্রাস্ট ডার্ক মোড ইন্টারফেস</p>
                      </div>
                      <span className="px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-[11px] rounded-lg flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5" /> ডার্ক মোড
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeacherSettingsModal(false);
                          setActiveTab?.('home');
                        }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm rounded-xl border border-slate-700 shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Globe className="w-4 h-4 text-sky-400" />
                        <span>মূল ওয়েবসাইটে ফিরে যান</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTeacherSettingsModal(false);
                          logout?.();
                        }}
                        className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>টিচার অ্যাকাউন্ট থেকে লগ আউট করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Modal Action */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTeacherSettingsModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

        {/* EDIT PENDING PAYOUT MODAL */}
        {isEditPayoutModalOpen && editingPayoutItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
            <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">ক্যাশআউট রিকোয়েস্ট পরিবর্তন</h3>
                    <p className="text-[11px] text-slate-400 font-mono">আইডি: {editingPayoutItem.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditPayoutModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editPayoutAmount || editPayoutAmount <= 0) {
                    alert('সঠিক টাকার পরিমাণ দিন!');
                    return;
                  }
                  if (!editPayoutAccount) {
                    alert('সঠিক অ্যাকাউন্ট নম্বর দিন!');
                    return;
                  }
                  setPayoutsList(prev => prev.map(item => {
                    if (item.id === editingPayoutItem.id) {
                      const methodLabel = editPayoutMethod === 'bkash' ? 'bKash' : editPayoutMethod === 'nagad' ? 'Nagad' : 'Bank Transfer';
                      return {
                        ...item,
                        amount: editPayoutAmount,
                        method: `${methodLabel} (${editPayoutAccount})`,
                        paymentMethod: methodLabel,
                        accountNumber: editPayoutAccount
                      };
                    }
                    return item;
                  }));
                  setIsEditPayoutModalOpen(false);
                  alert('আপনার ক্যাশআউট রিকোয়েস্ট সফলভাবে আপডেট করা হয়েছে!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-300 mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={editPayoutMethod}
                    onChange={(e) => setEditPayoutMethod(e.target.value as any)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#006A4E]"
                  >
                    <option value="bkash">{t('বিকাশ পার্সোনাল', 'bKash Personal')}</option>
                    <option value="nagad">{t('নগদ পার্সোনাল', 'Nagad Personal')}</option>
                    <option value="bank">{t('ব্যাংক একাউন্ট', 'Bank Transfer')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">একাউন্ট/মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={editPayoutAccount}
                    onChange={(e) => setEditPayoutAccount(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#006A4E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ক্যাশআউট পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={editPayoutAmount}
                    onChange={(e) => setEditPayoutAmount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#006A4E]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditPayoutModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#006A4E] to-sky-400 text-white font-black hover:opacity-95 transition cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    আপডেট সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COURSE DETAILS POPUP MODAL */}
        {selectedDetailCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5 relative">
              <button
                onClick={() => setSelectedDetailCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={selectedDetailCourse.thumbnail}
                  alt={selectedDetailCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg shadow">
                    {selectedDetailCourse.category}
                  </span>
                  <span className="px-3 py-1 bg-[#006A4E] text-white font-black text-xs rounded-lg shadow">
                    কমিশন: {selectedDetailCourse.teacherCommissionRate || 35}% ফি
                  </span>
                </div>
              </div>

              {/* Details Body */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedDetailCourse.title}
                </h2>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-500 dark:text-amber-400 block uppercase tracking-wider">
                    কোর্স পরিচিতি ও ওভারভিউ:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedDetailCourse.description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block uppercase">মডিউল টার্গেট</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{selectedDetailCourse.targetModules || 4}টি</span>
                  </div>
                  <div className="border-x border-slate-300 dark:border-slate-700 px-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block uppercase">লেসন টার্গেট</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{selectedDetailCourse.targetLessons || 16}টি</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block uppercase">শিক্ষক কমিশন</span>
                    <span className="text-sm sm:text-base font-black text-[#38BDF8]">{selectedDetailCourse.teacherCommissionRate || 35}%</span>
                  </div>
                </div>

                {/* What You Will Learn */}
                {selectedDetailCourse.whatYouWillLearn && selectedDetailCourse.whatYouWillLearn.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">এই কোর্সের সিলেবাস টার্গেটসমূহ:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {selectedDetailCourse.whatYouWillLearn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    acceptCourseOffer(selectedDetailCourse.id, currentUser?.id, currentUser?.name);
                    playChimeSound('accept');
                    setOfferToastMsg(`🎉 '${selectedDetailCourse.title}' অফার রিসিভ করা হয়েছে • ৳${(selectedDetailCourse.price || 4500).toLocaleString()}`);
                    setTimeout(() => setOfferToastMsg(null), 4000);
                    setSelectedDetailCourse(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#006A4E] to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>কোর্স অফার রিসিভ করুন</span>
                </button>

                <button
                  onClick={() => {
                    declineCourseOffer(selectedDetailCourse.id);
                    playChimeSound('decline');
                    setSelectedDetailCourse(null);
                  }}
                  className="py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs sm:text-sm rounded-xl transition border border-rose-500/30 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>প্রত্যাখ্যান</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FLOATING ACTION/SUCCESS TOAST (নিচে শর্ট ফ্লোটিং নোটিফিকেশন) */}
        {/* ========================================================================= */}
        {offerToastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp font-bengali max-w-[95vw] sm:max-w-md">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/95 backdrop-blur-xl border border-blue-600/50/60 text-white shadow-2xl shadow-black/90 rounded-2xl text-xs sm:text-sm font-black ring-1 ring-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 animate-pulse" />
              <span className="truncate flex-1">{offerToastMsg}</span>
              <button
                type="button"
                onClick={() => setOfferToastMsg(null)}
                className="ml-1.5 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer text-xs"
                title="বন্ধ করুন"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
