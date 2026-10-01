import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  Course,
  Service,
  GalleryItem,
  Testimonial,
  Offer,
  SiteSettings,
  Enrollment,
  Certificate,
  PaymentOrder,
  ContactMessage,
  NotificationItem,
  DirectMessageItem,
  ActiveChatWindow,
  ChatMessage,
  Assignment,
  AssignmentSubmission,
  CustomerProject,
  TeacherPayout,
  TeacherNotice,
  MarketplaceGig,
  MarketplaceJob,
  MarketplaceProposal,
  MarketplaceOrder,
  DigitalProduct,
  LiveClassSession,
  CompanyBillItem,
  DirectOfferMeta
} from '../types';
import {
  initialSiteSettings,
  initialOffers,
  initialServices,
  initialCourses,
  initialGallery,
  initialTestimonials,
  initialUsers,
  initialEnrollments,
  initialCertificates,
  initialGigs,
  initialJobs,
  initialProposals,
  initialMarketplaceOrders,
  initialDigitalProducts,
  initialLiveSessions
} from '../data/initialData';
import { auth, db } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, getDocs, collection } from 'firebase/firestore';
import { 
  syncDocToFirestore, 
  deleteDocFromFirestore, 
  subscribeToCollection, 
  syncCollectionToFirestore,
  fetchServerCollection
} from '../services/firestoreSync';

interface DataContextType {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  t: (bn: string, en: string) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  ptenitUser: User | null;
  marketplaceUser: User | null;
  setPtenitUser: (user: User | null) => void;
  setMarketplaceUser: (user: User | null) => void;
  loginMarketplace: (emailOrPhone: string, pass: string) => boolean;
  signupMarketplace: (userData: Omit<User, 'id' | 'createdAt'>, pass: string) => boolean;
  logoutMarketplace: () => void;
  demoLoginMarketplace: (role: 'customer' | 'instructor') => void;
  updateMarketplaceProfile: (data: Partial<User>) => void;
  users: User[];
  courses: Course[];
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  offers: Offer[];
  siteSettings: SiteSettings;
  orders: PaymentOrder[];
  contactMessages: ContactMessage[];
  notifications: NotificationItem[];
  directMessages: DirectMessageItem[];
  activeChatWindows: ActiveChatWindow[];
  activeMessengerConversationId: string | null;
  setActiveMessengerConversationId: (id: string | null) => void;
  activeMessengerOrderId: string | null;
  setActiveMessengerOrderId: (id: string | null) => void;
  isMessengerInboxOpen: boolean;
  setIsMessengerInboxOpen: (open: boolean) => void;
  initialMessengerTab: 'messages' | 'notifications' | 'courses';
  openMessengerInbox: (conversationId?: string, initialTab?: 'messages' | 'notifications' | 'courses', orderId?: string) => void;
  closeMessengerInbox: () => void;
  marketplaceMode: 'buying' | 'selling';
  setMarketplaceMode: (mode: 'buying' | 'selling') => void;
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  customerProjects: CustomerProject[];
  payouts: TeacherPayout[];
  teacherNotices: TeacherNotice[];
  
  // Marketplace & Agency Dispatch State
  gigs: MarketplaceGig[];
  jobs: MarketplaceJob[];
  proposals: MarketplaceProposal[];
  marketplaceOrders: MarketplaceOrder[];
  digitalProducts: DigitalProduct[];
  
  // Digital Products Actions
  addDigitalProduct: (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount'>) => void;
  updateDigitalProduct: (id: string, product: Partial<DigitalProduct>) => void;
  deleteDigitalProduct: (id: string) => void;
  
  // Live Classes & Scheduled Sessions
  liveSessions: LiveClassSession[];
  addLiveSession: (session: Omit<LiveClassSession, 'id' | 'createdAt'>) => void;
  updateLiveSession: (id: string, session: Partial<LiveClassSession>) => void;
  deleteLiveSession: (id: string) => void;
  
  // Marketplace & Agency Dispatch Actions
  createGig: (gig: Omit<MarketplaceGig, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => void;
  updateGig: (id: string, gig: Partial<MarketplaceGig>) => void;
  deleteGig: (id: string) => void;
  
  createJob: (job: Omit<MarketplaceJob, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => void;
  updateJobStatus: (id: string, status: MarketplaceJob['status'], assignedStaffId?: string, assignedStaffName?: string) => void;
  
  submitProposal: (proposal: Omit<MarketplaceProposal, 'id' | 'createdAt' | 'status'>) => void;
  acceptProposalAndCreateOrder: (jobId: string, proposalId: string) => void;
  
  createDirectGigOrder: (
    gigId: string,
    packageType: 'basic' | 'standard' | 'premium',
    customNote?: string,
    buyerDetails?: { name?: string; email?: string; phone?: string; paymentMethod?: string; transactionId?: string }
  ) => MarketplaceOrder | null;
  deliverMarketplaceOrder: (orderId: string, note: string, fileUrl?: string, fileName?: string) => void;
  requestOrderRevision: (orderId: string, note: string) => void;
  approveOrderAndReleaseEscrow: (
    orderId: string,
    rating?: number,
    reviewComment?: string,
    paymentInfo?: { method?: string; transactionId?: string; senderPhone?: string }
  ) => void;
  cancelMarketplaceOrder: (orderId: string, reason?: string) => void;
  updateMarketplaceOrderStatus: (orderId: string, status: MarketplaceOrder['status'], updateNote?: string) => void;
  addMarketplaceOrder: (order: MarketplaceOrder) => void;
  dispatchJobToStaff: (jobId: string, staffId: string, staffName: string) => void;
  
  // Auth & Profile
  login: (emailOrPhone: string, pass: string) => boolean;
  loginWithGoogle: (preferredRole?: 'customer' | 'specialist' | 'both') => Promise<boolean>;
  loginWithGoogleDirect: (email: string, displayName: string, preferredRole?: 'customer' | 'specialist' | 'both') => boolean;
  signup: (userData: Omit<User, 'id' | 'createdAt'>, pass: string) => boolean;
  logout: () => void;
  demoLogin: (role: 'student' | 'instructor' | 'customer' | 'admin') => void;
  switchRole: (newRole: 'customer' | 'specialist' | 'instructor' | 'admin' | 'student') => void;
  updateProfile: (data: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  
  // Teacher Payouts & Notices
  requestTeacherPayout: (payout: Omit<TeacherPayout, 'id' | 'requestedAt' | 'status'>) => void;
  updatePayoutStatus: (payoutId: string, status: TeacherPayout['status'], txId?: string) => void;
  sendTeacherNotice: (notice: Omit<TeacherNotice, 'id' | 'sentAt'>) => void;
  
  // Assignments (Teachers & Students)
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeSubmission: (submissionId: string, points: number, feedback: string) => void;
  updateSubmissionStatus: (submissionId: string, status: AssignmentSubmission['status']) => void;
  deleteSubmission: (submissionId: string) => void;
  updateSubmission: (submissionId: string, updates: Partial<AssignmentSubmission>) => void;
  
  // Customer Projects & Service Requests
  createCustomerProject: (project: Omit<CustomerProject, 'id' | 'createdAt' | 'status'>) => void;
  updateCustomerProjectStatus: (id: string, status: CustomerProject['status'], priceEstimate?: number) => void;
  
  // Courses
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'enrolledCount' | 'rating'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  acceptCourseOffer: (courseId: string, teacherId?: string, teacherName?: string) => void;
  declineCourseOffer: (courseId: string) => void;
  
  // Enrollments & Learning
  enrollCourse: (courseId: string, paymentDetails?: { method: PaymentOrder['paymentMethod']; phone: string; txId: string; amount: number; studentName?: string; studentEmail?: string; studentPhone?: string; isAutomated?: boolean }) => Promise<boolean>;
  updateLessonProgress: (courseId: string, lessonId: string) => void;
  
  // Services
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  // Testimonials
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Offers & Settings
  updateOffers: (offers: Offer[]) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  
  // Certificates
  issueCertificate: (studentId: string, courseId: string) => Certificate;
  getCertificateByCode: (code: string) => Certificate | undefined;
  
  // Orders
  updateOrderStatus: (orderId: string, status: PaymentOrder['status']) => void;
  
  // Contact & Inquiries
  sendContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  
  // Notifications
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendCentralNotification: (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  
  // Shared Audio Synthesizer for Distinct Alerts
  playAppSound: (type?: 'notification' | 'message' | 'order' | 'success' | 'click') => void;
  isOfferSoundEnabled: boolean;
  toggleOfferSound: () => void;

  // Mentorship Application & Role Actions
  applyForMentorship: (data: { name?: string; email?: string; expertise: string[]; experienceYears: string; bio: string; portfolioUrl?: string; proposedCourseTopic?: string; phone?: string }) => void;
  approveMentorApplication: (userId?: string) => void;
  rejectMentorApplication: (userId?: string, reason?: string) => void;
  
  // Direct Messages & Popovers
  rightColumnView: 'default' | 'messages' | 'notifications';
  setRightColumnView: React.Dispatch<React.SetStateAction<'default' | 'messages' | 'notifications'>>;
  readConversationIds: string[];
  markConversationRead: (id: string) => void;
  markAllConversationsRead: () => void;
  markDirectMessageRead: (id: string) => void;
  markAllDirectMessagesRead: () => void;
  sendDirectMessage: (msg: Omit<DirectMessageItem, 'id' | 'read'>) => void;
  openChatWindow: (contact: { id?: string; senderName: string; senderRole?: string; senderAvatar?: string; initialMessage?: string }) => void;
  closeChatWindow: (id: string) => void;
  toggleMinimizeChatWindow: (id: string) => void;
  sendChatMessage: (windowId: string, text: string, meetLink?: string, directOffer?: DirectOfferMeta) => void;
  createGoogleMeetCall: (windowId: string, customMeetLink?: string) => void;
  inAppMeetState: {
    isOpen: boolean;
    roomTitle?: string;
    targetName?: string;
    targetAvatar?: string;
    targetRole?: string;
    courseTitle?: string;
    windowId?: string;
    initialType?: 'video' | 'audio' | 'screen';
  };
  openInAppMeet: (params?: {
    roomTitle?: string;
    targetName?: string;
    targetAvatar?: string;
    targetRole?: string;
    courseTitle?: string;
    windowId?: string;
    initialType?: 'video' | 'audio' | 'screen';
  }) => void;
  closeInAppMeet: () => void;
  googleMeetModalState: {
    isOpen: boolean;
    windowId?: string;
    targetName?: string;
    existingLink?: string;
  };
  openGoogleMeetModal: (windowId: string, targetName?: string, existingLink?: string) => void;
  closeGoogleMeetModal: () => void;
  
  // Delete Operations
  deleteUser: (id: string) => void;
  deleteOrder: (id: string) => void;
  deleteJob: (id: string) => void;
  deleteMarketplaceOrder: (id: string) => void;
  updateMarketplaceOrder: (id: string, updates: Partial<MarketplaceOrder>) => void;
  acceptDirectOffer: (orderIdOrProjectId: string) => void;
  declineDirectOffer: (orderIdOrProjectId: string, reason?: string) => void;
  updateDirectOffer: (orderIdOrProjectId: string, updates: {
    title?: string;
    budget?: number;
    budgetRange?: string;
    deliveryDays?: number;
    description?: string;
  }) => void;
  publishDirectProjectToPublicFeed: (orderIdOrProjectId: string) => void;
  resendDirectOffer24h: (orderIdOrProjectId: string) => void;
  deleteTeacherPayout: (id: string) => void;
  deleteTeacherNotice: (id: string) => void;

  // Students & Users Management (Admin)
  toggleUserBlock: (userId: string, reason?: string) => void;
  restrictUser: (userId: string, reason?: string) => void;
  unrestrictUser: (userId: string) => void;

  // Company Billing & Ledger
  companyBills: CompanyBillItem[];
  addCompanyBill: (bill: CompanyBillItem) => void;
  verifyCompanyBill: (billId: string, verifiedBy?: string) => void;
  rejectCompanyBill: (billId: string, reason?: string) => void;
  deleteCompanyBill: (billId: string) => void;
  clearSampleVouchers: () => void;
}

export const checkAndAutoCancelOverdueOrders = (orders: MarketplaceOrder[]): { updatedOrders: MarketplaceOrder[]; hasChanges: boolean } => {
  const now = Date.now();
  let hasChanges = false;
  const updatedOrders = (orders || []).map(ord => {
    // If order is completed or already cancelled
    if (ord.status === 'completed' || ord.status === 'cancelled') {
      if (ord.isAutoCancelledOverdue && !ord.overdueDelayText) {
        const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
        const deliveryDays = ord.deliveryDays || 3;
        const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime ? createdTime + deliveryDays * 24 * 3600 * 1000 : 0);
        const cancelledTime = ord.cancelledAt ? new Date(ord.cancelledAt).getTime() : now;
        const delayMs = Math.max(0, cancelledTime - deadline);
        const totalSecs = Math.floor(delayMs / 1000);
        const d = Math.floor(totalSecs / 86400);
        const h = Math.floor((totalSecs % 86400) / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const delayText = d > 0 ? `${d.toLocaleString('bn-BD')}দিন ${h.toLocaleString('bn-BD')}ঘণ্টা` : h > 0 ? `${h.toLocaleString('bn-BD')}ঘণ্টা ${m.toLocaleString('bn-BD')}মিনিট` : `${m.toLocaleString('bn-BD')} মিনিট`;
        return { ...ord, overdueDelayText: delayText };
      }
      return ord;
    }

    // 24-Hour Direct Private Offer check (If direct offer to specific seller/admin is not accepted within 24 hours, auto-return to buyer)
    if (ord.isDirectOffer && (ord.status === 'pending' || ord.status === 'pending_approval')) {
      const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
      const expiresAtMs = ord.expiresAt ? new Date(ord.expiresAt).getTime() : (createdTime ? createdTime + 24 * 3600 * 1000 : 0);
      if (expiresAtMs > 0 && now > expiresAtMs) {
        hasChanges = true;
        return {
          ...ord,
          status: 'cancelled' as const,
          isExpiredReturned: true,
          cancelledReason: 'সেলার ২৪ ঘণ্টার মধ্যে অফারটি রিসিভ না করায় স্বয়ংক্রিয়ভাবে ফেরত এসেছে (Auto-Returned)',
          cancelledAt: new Date().toISOString()
        };
      }
    }

    // If order is in_review or revision_requested (Buyer 24h review grace + 48h penalty cycle)
    if (ord.status === 'in_review' || ord.status === 'revision_requested') {
      const deliveredTime = ord.deliveredAt ? new Date(ord.deliveredAt).getTime() : (ord.createdAt ? new Date(ord.createdAt).getTime() : now);
      const gracePeriodMs = 24 * 3600 * 1000;
      const reviewDeadline = deliveredTime + gracePeriodMs;

      if (now > reviewDeadline) {
        const overdueReviewMs = now - reviewDeadline;
        const intervals = Math.floor(overdueReviewMs / (48 * 3600 * 1000)) + 1;
        const buyerReviewPenalty = Math.round((ord.amount || 0) * 0.05 * intervals);
        const sellerReviewBonus = Math.round((ord.amount || 0) * 0.02 * intervals);
        const revTotalSecs = Math.floor(overdueReviewMs / 1000);
        const revD = Math.floor(revTotalSecs / 86400);
        const revH = Math.floor((revTotalSecs % 86400) / 3600);
        const revM = Math.floor((revTotalSecs % 3600) / 60);
        const revDuration = revD > 0 ? `${revD.toLocaleString('bn-BD')}দিন ${revH.toLocaleString('bn-BD')}ঘ` : `${revH.toLocaleString('bn-BD')}ঘ ${revM.toLocaleString('bn-BD')}মি`;

        if (ord.buyerReviewPenalty !== buyerReviewPenalty || ord.sellerReviewBonus !== sellerReviewBonus || ord.reviewOverdueDuration !== revDuration) {
          hasChanges = true;
          return {
            ...ord,
            buyerReviewPenalty,
            sellerReviewBonus,
            reviewOverdueDuration: revDuration
          };
        }
      }
      return ord;
    }

    // Determine deadline for in_progress / pending / pending_approval
    const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
    const deliveryDays = ord.deliveryDays || 3;
    const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime ? createdTime + deliveryDays * 24 * 3600 * 1000 : 0);

    // If deadline has passed and order is in_progress, pending, or pending_approval
    if (deadline > 0 && now > deadline) {
      hasChanges = true;
      const penaltyAmount = ord.penaltyAmount || Math.round((ord.amount || 0) * 0.05);
      const buyerBonus = ord.buyerBonus || Math.round((ord.amount || 0) * 0.03);
      const delayMs = Math.max(0, now - deadline);
      const totalSecs = Math.floor(delayMs / 1000);
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const delayText = d > 0 ? `${d.toLocaleString('bn-BD')}দিন ${h.toLocaleString('bn-BD')}ঘণ্টা` : h > 0 ? `${h.toLocaleString('bn-BD')}ঘণ্টা ${m.toLocaleString('bn-BD')}মিনিট` : `${m.toLocaleString('bn-BD')} মিনিট`;

      return {
        ...ord,
        status: 'cancelled' as const,
        cancelledReason: 'সময়োত্তীর্ণ (অটো সিস্টেম ৫% জরিমানা কর্তন ও বায়ার ৩% ক্ষতিপূরণ বোনাস কার্যকর)',
        isAutoCancelledOverdue: true,
        penaltyAmount,
        buyerBonus,
        overdueDelayText: delayText,
        cancelledAt: new Date().toISOString()
      };
    }
    return ord;
  });

  return { updatedOrders, hasChanges };
};

// One-time cleanup of stale test data from previous storage versions
try {
  if (typeof window !== 'undefined' && localStorage.getItem('ptenit_v3_migrated') !== 'true') {
    const keysToPurge = [
      'ptenit_database_v2_notifications',
      'ptenit_database_v2_direct_messages',
      'ptenit_database_v2_marketplace_orders',
      'ptenit_database_v2_orders',
      'ptenit_database_v2_customer_projects',
      'ptenit_database_v2_messages',
      'ptenit_data_notifications',
      'ptenit_data_direct_messages',
      'ptenit_data_marketplace_orders',
      'ptenit_data_orders',
      'ptenit_my_buyer_post_ids',
      'ptenit_company_bills'
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
    localStorage.setItem('ptenit_v3_migrated', 'true');
  }
} catch {}

export const STORAGE_KEY = 'ptenit_database_v3';

// Clear user session cache, active orders, and notifications from browser storage on logout or new signup
export const clearUserSessionStorage = (storageKey: string = STORAGE_KEY) => {
  try {
    if (typeof window === 'undefined') return;
    const keysToPurge = [
      `${storageKey}_current_user`,
      `${storageKey}_ptenit_user`,
      `${storageKey}_marketplace_user`,
      `${storageKey}_read_convo_ids`,
      `${storageKey}_orders`,
      `${storageKey}_marketplace_orders`,
      `${storageKey}_customer_projects`,
      `${storageKey}_notifications`,
      `${storageKey}_direct_messages`,
      `${storageKey}_messages`,
      'ptenit_my_buyer_post_ids',
      'ptenit_active_chat_windows',
      'marketplace_mode'
    ];
    keysToPurge.forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
  } catch {}
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLang = (newLang: 'bn' | 'en') => {
    setLangState(newLang);
    localStorage.setItem(`${STORAGE_KEY}_lang`, newLang);
  };

  const t = (bnText: string, enText: string) => {
    return lang === 'en' ? enText : bnText;
  };

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_dark_mode`) === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_KEY}_dark_mode`, String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState(prev => !prev);
  };

  // Shared Global Web Audio API Synthesizer for Distinct Alerts & Chimes
  const playAppSound = (type: 'notification' | 'message' | 'order' | 'success' | 'click' = 'notification') => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();

      const playNotes = () => {
        const now = ctx.currentTime;

        if (type === 'notification') {
          // Distinct crisp double bell chime (587.33 Hz [D5] -> 880 Hz [A5])
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          const gain2 = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, now);
          gain1.gain.setValueAtTime(0.25, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.22);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(880, now + 0.09);
          gain2.gain.setValueAtTime(0.22, now + 0.09);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.09);
          osc2.stop(now + 0.38);

        } else if (type === 'message') {
          // Distinct warm bubble/pop chime (440Hz -> 659Hz -> 554Hz)
          const freqs = [440, 659.25, 554.37];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.07;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.18, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.18);
          });

        } else if (type === 'order') {
          // Joyful triumphant cash register & success chime (523Hz -> 659Hz -> 784Hz -> 1046.5Hz)
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.06;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.24, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.25);
          });

        } else if (type === 'click') {
          // Subtle crisp UI micro-tick (1200Hz sine decayed in 25ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.025);
        } else {
          // General smooth success ping
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playNotes()).catch(() => {});
      } else {
        playNotes();
      }
    } catch (e) {
      // Audio autoplay restriction fallback
    }
  };

  // Offer & Alert Sound Enablement State (Persisted in localStorage)
  const [isOfferSoundEnabled, setIsOfferSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ptenit_offer_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleOfferSound = useCallback(() => {
    setIsOfferSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ptenit_offer_sound_enabled', JSON.stringify(next));
      } catch {}
      if (next) {
        // Provide immediate audible feedback that sound is enabled
        try {
          playAppSound('notification');
        } catch {}
      }
      return next;
    });
  }, [playAppSound]);

  // Safe JSON parser to protect against corrupted localStorage crashing on load
  function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
    if (!jsonString) return fallback;
    try {
      const val = JSON.parse(jsonString);
      return val !== null && val !== undefined ? val : fallback;
    } catch {
      return fallback;
    }
  }

  // Load state from localStorage or initialData
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return safeJsonParse(saved, initialSiteSettings);
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
    if (saved) {
      try {
        const parsed: Course[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) return parsed;
        const map = new Map<string, Course>();
        initialCourses.forEach(c => map.set(c.id, c));
        if (Array.isArray(parsed)) {
          parsed.forEach(c => map.set(c.id, { ...map.get(c.id), ...c }));
        }
        return Array.from(map.values());
      } catch {}
    }
    return initialCourses;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
    if (saved) {
      try {
        const parsed: Service[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(s => {
            const init = initialServices.find(i => i.id === s.id);
            return {
              ...s,
              badge: s.badge || init?.badge || (['web-dev', 'branding'].includes(s.id) ? 'প্রিমিয়াম' : 'আগে কাজ শুরু')
            };
          });
        }
      } catch {}
    }
    return initialServices;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
    return safeJsonParse(saved, initialGallery);
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_testimonials`);
    return safeJsonParse(saved, initialTestimonials);
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
    return safeJsonParse(saved, initialOffers);
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return safeJsonParse(saved, initialUsers);
  });

  // PTENit IT Academy / Services User Account
  const [ptenitUser, setPtenitUser] = useState<User | null>(() => {
    const isLoggedOut = localStorage.getItem(`${STORAGE_KEY}_logged_out`) === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`) || localStorage.getItem(`${STORAGE_KEY}_ptenit_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Marketplace Freelancing Platform User Account (Buyer or Seller) - Unified with ptenitUser
  const [marketplaceUser, setMarketplaceUser] = useState<User | null>(() => {
    const isLoggedOut = localStorage.getItem(`${STORAGE_KEY}_logged_out`) === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`) || localStorage.getItem(`${STORAGE_KEY}_marketplace_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Unified currentUser across PTENit and Marketplace
  const currentUser = ptenitUser || marketplaceUser;
  const setCurrentUser = (u: User | null) => {
    setPtenitUser(u);
    setMarketplaceUser(u);
    if (u) {
      localStorage.removeItem(`${STORAGE_KEY}_logged_out`);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(u));
      localStorage.setItem(`${STORAGE_KEY}_ptenit_user`, JSON.stringify(u));
      localStorage.setItem(`${STORAGE_KEY}_marketplace_user`, JSON.stringify(u));
    } else {
      localStorage.setItem(`${STORAGE_KEY}_logged_out`, 'true');
      localStorage.removeItem(`${STORAGE_KEY}_current_user`);
      localStorage.removeItem(`${STORAGE_KEY}_ptenit_user`);
      localStorage.removeItem(`${STORAGE_KEY}_marketplace_user`);
    }
  };

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_enrollments`);
    if (saved) {
      try {
        const parsed: Enrollment[] = JSON.parse(saved);
        const map = new Map<string, Enrollment>();
        initialEnrollments.forEach(e => map.set(e.courseId, e));
        parsed.forEach(e => map.set(e.courseId, e));
        return Array.from(map.values());
      } catch {}
    }
    return initialEnrollments;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certificates`);
    return safeJsonParse(saved, initialCertificates);
  });

  const [orders, setOrders] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(o => o.id !== 'ord-101');
      } catch {}
    }
    return [];
  });

  const [companyBills, setCompanyBills] = useState<CompanyBillItem[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_company_bills');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return safeJsonParse(saved, []);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(n => n.recipientId || n.recipientEmail || n.isBroadcast);
        }
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [directMessages, setDirectMessages] = useState<DirectMessageItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_direct_messages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [activeChatWindows, setActiveChatWindows] = useState<ActiveChatWindow[]>([]);
  const [activeMessengerConversationId, setActiveMessengerConversationId] = useState<string | null>(null);
  const [activeMessengerOrderId, setActiveMessengerOrderId] = useState<string | null>(null);
  const [isMessengerInboxOpen, setIsMessengerInboxOpen] = useState(false);
  const [initialMessengerTab, setInitialMessengerTab] = useState<'messages' | 'notifications' | 'courses'>('messages');
  const [rightColumnView, setRightColumnView] = useState<'default' | 'messages' | 'notifications'>('default');

  const [readConversationIds, setReadConversationIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_read_convo_ids`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "asgn-1",
        courseId: "course-1",
        courseTitle: "PTE Academic Masterclass 2026",
        lessonNo: "লেসন নং ১",
        title: "PTE Speaking Describe Image Task Practice",
        description: "প্রদত্ত ছবি পর্যবেক্ষণ করে ৪০ সেকেন্ডের মৌখিক বিবরণ ও নোট ফাইল জমা দিন।",
        dueDate: "2026-08-15",
        totalPoints: 50,
        createdAt: "2026-08-01"
      },
      {
        id: "asgn-2",
        courseId: "course-2",
        courseTitle: "Full-Stack Web Development Bootcamp",
        lessonNo: "লেসন নং ১",
        title: "React Components & Tailwind Layout Project",
        description: "Tailwind CSS ব্যবহার করে একটি সুন্দর ই-কমার্স কার্ড ল্যান্ডিং পেজ ডিজাইন করে ফাইল আপলোড করুন।",
        dueDate: "2026-08-20",
        totalPoints: 100,
        createdAt: "2026-08-01"
      },
      {
        id: "asgn-3",
        courseId: "course-1",
        courseTitle: "PTE Academic Masterclass 2026",
        lessonNo: "লেসন নং ২",
        title: "PTE Retell Lecture & Note Taking",
        description: "অডিও লেকচার শুনে কি-পয়েন্টস সাজিয়ে স্পিকিং রেকর্ড সাবমিট করুন।",
        dueDate: "2026-08-22",
        totalPoints: 50,
        createdAt: "2026-08-05"
      },
      {
        id: "asgn-4",
        courseId: "course-2",
        courseTitle: "Full-Stack Web Development Bootcamp",
        lessonNo: "লেসন নং ২",
        title: "Node.js REST API & JWT Authentication",
        description: "ইউজার অথেনটিকেশন ও টোকেন ভ্যালিডেশনের কোড ফাইল সাবমিট করুন।",
        dueDate: "2026-08-25",
        totalPoints: 100,
        createdAt: "2026-08-10"
      },
      {
        id: "asgn-5",
        courseId: "course-2",
        courseTitle: "Full-Stack Web Development Bootcamp",
        lessonNo: "লেসন নং ৩",
        title: "Responsive Dashboard UI & Dark Mode",
        description: "টেইলউইন্ড সিএসএস দিয়ে ফুল রেসপনসিভ ড্যাশবোর্ড স্ক্রিন সম্পন্ন করে গিটহাব লিঙ্ক বা ফাইল দিন।",
        dueDate: "2026-08-28",
        totalPoints: 100,
        createdAt: "2026-08-12"
      }
    ];
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length >= 5) {
          // Normalize so initial test data aligns with 0 new and 7 review items if still default
          return parsed;
        }
      } catch {}
    }
    return [
      {
        id: "sub-1",
        assignmentId: "asgn-1",
        studentId: "user-student-1",
        studentName: "আরিফ হোসেন",
        studentEmail: "arif.pte@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        submissionText: "আমার ডেসক্রাইব ইমেজ টাস্কের ফাইল ও প্র্যাকটিস নোট সংযোজন করা হলো। সম্পূর্ণ কোর্স অ্যাসাইনমেন্ট ফাইনাল সাবমিশন।",
        fileName: "PTE_Describe_Image_Arif.mp3",
        fileUrl: "https://example.com/files/arif_speaking.mp3",
        linkUrl: "https://drive.google.com/drive/folders/arif-pte-final-batch",
        linkTitle: "Google Drive Portfolio",
        submittedAt: "২০২৬-০৮-০১ ০২:৩০ PM",
        points: 48,
        feedback: "অসাধারণ পারফরম্যান্স! কোর্সের সব কয়টি টাস্কে দারুণ স্কোর অর্জন করেছেন। সার্টিফিকেট প্রস্তুত হয়েছে।",
        status: "graded"
      },
      {
        id: "sub-1-b",
        assignmentId: "asgn-3",
        studentId: "user-student-1",
        studentName: "আরিফ হোসেন",
        studentEmail: "arif.pte@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        submissionText: "PTE রিটেল লেকচার অডিও রেকর্ড ও ট্রান্সক্রিপ্ট নোট ফাইল।",
        fileName: "Retell_Lecture_Arif.mp3",
        fileUrl: "https://example.com/files/arif_retell.mp3",
        linkUrl: "https://drive.google.com/drive/folders/arif-pte-recordings",
        linkTitle: "PTE Lecture Audio Folder",
        submittedAt: "২০২৬-০৮-০৫ ১১:১৫ AM",
        points: 50,
        feedback: "পারফেক্ট কি-নোটস এবং চমৎকার ফ্লুয়েন্সি।",
        status: "graded"
      },
      {
        id: "sub-2",
        assignmentId: "asgn-1",
        studentId: "user-student-2",
        studentName: "তানভীর আহমেদ",
        studentEmail: "tanvir.pte@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        submissionText: "স্যার, ৩টি ডেসক্রাইব ইমেজ টেমপ্লেট রেকর্ড করে ফাইল এটাচ করেছি। প্রোনাউন্সিয়েশন ও অ্যাকসেন্ট রিভিউ করবেন প্লিজ।",
        fileName: "Describe_Image_Task_Tanvir.mp3",
        fileUrl: "https://example.com/files/tanvir_speaking.mp3",
        linkUrl: "https://drive.google.com/drive/folders/tanvir-pte-audio",
        linkTitle: "Google Drive Audio Link",
        submittedAt: "আজ দুপুর ১২:৪৫ PM",
        status: "under_review"
      },
      {
        id: "sub-3",
        assignmentId: "asgn-2",
        studentId: "user-student-3",
        studentName: "নুসরাত জাহান",
        studentEmail: "nusrat.dev@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        submissionText: "টাস্কের রিকোয়ারমেন্ট অনুযায়ী রেসপনসিভ প্রোডাক্ট গ্রিড এবং কার্ট ড্রয়ার কম্পোনেন্ট তৈরি করেছি। সোর্স কোড ও প্রিভিউ জিপ ফাইল এটাচ করলাম। লাইভ ডেমো: https://nusrat-shop.vercel.app",
        fileName: "Ecommerce_Tailwind_Nusrat.zip",
        fileUrl: "https://example.com/files/nusrat_project.zip",
        linkUrl: "https://github.com/nusrat-dev/ecommerce-tailwind-ui",
        linkTitle: "GitHub Repository",
        submittedAt: "আজ দুপুর ০১:১৫ PM",
        status: "under_review"
      },
      {
        id: "sub-4",
        assignmentId: "asgn-3",
        studentId: "user-student-4",
        studentName: "সাকিব আল হাসান",
        studentEmail: "sakib.dev@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        submissionText: "স্যার, লেকচার কি-পয়েন্টস রেকর্ড করে আপলোড দিয়েছি। ফ্লুয়েন্সি স্কোর কেমন হতে পারে ফিডব্যাক দিলে উপকৃত হব।",
        fileName: "Retell_Lecture_Sakib.mp3",
        fileUrl: "https://example.com/files/sakib_retell.mp3",
        linkUrl: "https://drive.google.com/drive/folders/sakib-pte-tasks",
        linkTitle: "Google Drive Task",
        submittedAt: "আজ দুপুর ০২:০০ PM",
        status: "under_review"
      },
      {
        id: "sub-5",
        assignmentId: "asgn-4",
        studentId: "user-student-5",
        studentName: "মাহিনুর রহমান",
        studentEmail: "mahinur.ui@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        submissionText: "Node.js এবং JWT দিয়ে ফুল অথেনটিকেশন মিডলওয়্যার সম্পন্ন করে কোড সাবমিট করেছি। গিটহাব লিঙ্ক ও পোস্টম্যান কালেকশন যুক্ত আছে।",
        fileName: "JWT_Auth_Backend_Mahinur.zip",
        fileUrl: "https://example.com/files/mahinur_jwt.zip",
        linkUrl: "https://github.com/mahinur-ui/auth-jwt-express-api",
        linkTitle: "GitHub Backend Repo",
        submittedAt: "আজ দুপুর ০২:৩০ PM",
        status: "under_review"
      },
      {
        id: "sub-6",
        assignmentId: "asgn-5",
        studentId: "user-student-6",
        studentName: "রোকসানা আক্তার",
        studentEmail: "roksana.design@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
        submissionText: "ড্যাশবোর্ডের ডার্ক মোড টগল ও রেসপনসিভ সাইডবার সম্পন্ন করা হয়েছে। ফিগমা ডিজাইন সিস্টেম লিঙ্ক সংযুক্ত।",
        fileName: "Dashboard_DarkMode_Roksana.zip",
        fileUrl: "https://example.com/files/roksana_dashboard.zip",
        linkUrl: "https://figma.com/file/roksana-dashboard-design-system",
        linkTitle: "Figma Design File",
        submittedAt: "আজ বিকাল ০৩:১০ PM",
        status: "under_review"
      },
      {
        id: "sub-7",
        assignmentId: "asgn-2",
        studentId: "user-student-7",
        studentName: "ফারহান সাদিক",
        studentEmail: "farhan.mern@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        submissionText: "React Context API ব্যবহার করে সম্পূর্ণ স্টেট ম্যানেজমেন্ট ও কার্ট ক্যালকুলেশন সম্পন্ন করেছি। লাইভ প্রজেক্ট লিংক সংযুক্ত করা হয়েছে।",
        fileName: "React_State_Farhan.zip",
        fileUrl: "https://example.com/files/farhan_cart.zip",
        linkUrl: "https://farhan-cart-state.vercel.app",
        linkTitle: "লাইভ ওয়েব ডেমো",
        submittedAt: "আজ দুপুর ১২:০০ PM",
        status: "under_review"
      },
      {
        id: "sub-8",
        assignmentId: "asgn-4",
        studentId: "user-student-7",
        studentName: "ফারহান সাদিক",
        studentEmail: "farhan.mern@ptenit.com",
        studentAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        submissionText: "Node.js ব্যাকএন্ড ও মনগোডিবি ডাটাবেস ইন্টিগ্রেশন সম্পন্ন।",
        fileName: "Node_MongoDB_Farhan.zip",
        fileUrl: "https://example.com/files/farhan_backend.zip",
        linkUrl: "https://github.com/farhan-mern/node-auth-api",
        linkTitle: "GitHub Repo",
        submittedAt: "গতকাল বিকাল ০৫:০০ PM",
        points: 92,
        feedback: "কোড স্ট্রাকচার খুব পরিষ্কার। এরর হ্যান্ডলিং আরও একটু গুছিয়ে নিলে চমৎকার হবে।",
        status: "under_review"
      }
    ];
  });

  const [customerProjects, setCustomerProjects] = useState<CustomerProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customer_projects`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => p.id !== 'proj-1' && p.customerId !== 'user-cust-1');
        }
      } catch {}
    }
    return [];
  });

  const [payouts, setPayouts] = useState<TeacherPayout[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payouts`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "pay-101",
        teacherId: "teacher-1",
        teacherName: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
        teacherEmail: "teacher@ptenit.com",
        amount: 8500,
        paymentMethod: "bKash",
        accountNumber: "01711122233",
        note: "জুলাই মাসের কোর্স কমিশন ও মডিউল অ্যাসেসড বোনাস",
        status: "Pending",
        requestedAt: "2026-07-31 16:20"
      },
      {
        id: "pay-102",
        teacherId: "teacher-1",
        teacherName: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
        teacherEmail: "teacher@ptenit.com",
        amount: 5000,
        paymentMethod: "Nagad",
        accountNumber: "01711122233",
        note: "জুন মাসের ইনস্ট্রাকশন পেমেন্ট",
        status: "Paid",
        transactionId: "NG7721X90",
        requestedAt: "2026-06-30 11:00",
        processedAt: "2026-07-01 10:30"
      }
    ];
  });

  const [teacherNotices, setTeacherNotices] = useState<TeacherNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teacher_notices`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "tnotice-1",
        senderName: "PTENit Admin",
        recipientTeacherId: "all",
        subject: "নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা",
        message: "সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।",
        sentAt: "2026-08-01 09:00",
        read: false
      }
    ];
  });

  // Marketplace & Agency Dispatch States
  const [gigs, setGigs] = useState<MarketplaceGig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gigs`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return initialGigs;
  });

  const [jobs, setJobs] = useState<MarketplaceJob[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialJobs;
  });

  const [proposals, setProposals] = useState<MarketplaceProposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_proposals`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialProposals;
  });

  const [digitalProducts, setDigitalProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_digital_products`);
    if (saved) {
      try {
        const parsed: DigitalProduct[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If dp-4 or dp-5 exist, ensure updated free price if not custom modified
          return parsed.map(p => {
            const initial = initialDigitalProducts.find(init => init.id === p.id);
            if (initial && (p.id === 'dp-4' || p.id === 'dp-5') && p.price > 0) {
              return { ...p, price: 0, originalPrice: initial.originalPrice };
            }
            return p;
          });
        }
      } catch {}
    }
    return initialDigitalProducts;
  });

  const [liveSessions, setLiveSessions] = useState<LiveClassSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_live_sessions`);
    if (saved) {
      try {
        const parsed: LiveClassSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return initialLiveSessions;
  });



  const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketplace_orders`);
    if (saved) {
      try {
        const parsed: MarketplaceOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(o => 
            o.id !== 'ord-mkt-4' && 
            o.id !== 'ord-ptenit-1789742851626' &&
            o.id !== 'live-ord-101' &&
            o.id !== 'live-ord-102' &&
            o.id !== 'live-ord-103' &&
            o.id !== 'live-ord-104' &&
            o.id !== 'proj-1' &&
            o.id !== 'ord-101'
          );
          return checkAndAutoCancelOverdueOrders(cleaned).updatedOrders;
        }
      } catch {}
    }
    return [];
  });

  // Periodically check and auto-cancel any overdue orders and 24h direct offers in real-time
  useEffect(() => {
    const checkOverdueInterval = setInterval(() => {
      const now = Date.now();

      // 1. Marketplace orders overdue and 24h auto-return
      setMarketplaceOrders(prev => {
        const { updatedOrders, hasChanges } = checkAndAutoCancelOverdueOrders(prev);
        if (hasChanges) {
          return updatedOrders;
        }
        return prev;
      });

      // 2. Customer Projects 24h direct offer auto-return
      setCustomerProjects(prev => {
        let cpChanged = false;
        const updated = prev.map(cp => {
          if (cp.isDirectOffer && !cp.isExpiredReturned && (cp.status === 'Pending Review' || (cp.status as string) === 'pending')) {
            const expiresAtMs = cp.expiresAt ? new Date(cp.expiresAt).getTime() : (cp.createdAt ? new Date(cp.createdAt).getTime() + 24 * 3600 * 1000 : 0);
            if (expiresAtMs > 0 && now > expiresAtMs) {
              cpChanged = true;
              return {
                ...cp,
                isExpiredReturned: true,
                status: 'Cancelled' as const,
                updatedAt: new Date().toISOString()
              };
            }
          }
          return cp;
        });
        if (cpChanged) {
          localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });

      // 3. Jobs 24h direct offer auto-return
      setJobs(prev => {
        let jobsChanged = false;
        const updated = prev.map(j => {
          if (j.isDirectOffer && !j.isExpiredReturned && j.status === 'open') {
            const expiresAtMs = j.expiresAt ? new Date(j.expiresAt).getTime() : 0;
            if (expiresAtMs > 0 && now > expiresAtMs) {
              jobsChanged = true;
              return {
                ...j,
                isExpiredReturned: true,
                status: 'cancelled' as const
              };
            }
          }
          return j;
        });
        if (jobsChanged) {
          localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(checkOverdueInterval);
  }, []);

  // Real-time Firestore synchronization with onSnapshot and Session Persistence
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Real-time Auth State Persistence
    try {
      const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(userDocRef);
            const isSuperAdminEmail = fbUser.email === 'mdskazisohag@gmail.com' || fbUser.email === 'admin@ptenit.com';
            
            if (snap.exists()) {
              const existingUser = snap.data() as User;
              if (isSuperAdminEmail) {
                existingUser.role = 'admin';
                existingUser.activeRole = 'admin';
                existingUser.roles = ['admin'];
              }
              setCurrentUser(existingUser);
              setPtenitUser(existingUser);
              setMarketplaceUser(existingUser);
            } else {
              const newUser: User = {
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email || '',
                mobile: fbUser.phoneNumber || '',
                role: isSuperAdminEmail ? 'admin' : 'customer',
                roles: isSuperAdminEmail ? ['admin'] : ['customer'],
                activeRole: isSuperAdminEmail ? 'admin' : 'customer',
                avatar: fbUser.photoURL || undefined,
                createdAt: new Date().toISOString().split('T')[0]
              };
              await syncDocToFirestore('users', fbUser.uid, newUser);
              setCurrentUser(newUser);
              setPtenitUser(newUser);
              setMarketplaceUser(newUser);
            }
          } catch (authDocErr) {
            console.warn('[Firestore Auth Profile]', authDocErr);
          }
        }
      });
      unsubs.push(unsubAuth);
    } catch (e) {
      console.warn('[Firebase Auth listener]', e);
    }

    // Real-time Collection Listeners
    unsubs.push(subscribeToCollection<PaymentOrder>('orders', (items) => {
      if (items && items.length > 0) {
        setOrders(prev => {
          const map = new Map<string, PaymentOrder>();
          prev.forEach(p => map.set(p.id, p));
          items.forEach(i => map.set(i.id, i));
          const merged = Array.from(map.values());
          localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(merged));
          return merged;
        });
      }
    }));

    unsubs.push(subscribeToCollection<MarketplaceOrder>('marketplaceOrders', (items) => {
      if (items && items.length > 0) {
        setMarketplaceOrders(prev => {
          const map = new Map<string, MarketplaceOrder>();
          prev.forEach(m => map.set(m.id, m));
          items.forEach(i => map.set(i.id, i));
          const merged = Array.from(map.values());
          localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(merged));
          return merged;
        });
      }
    }));

    unsubs.push(subscribeToCollection<CompanyBillItem>('companyBills', (items) => {
      if (items && items.length > 0) {
        setCompanyBills(prev => {
          const map = new Map<string, CompanyBillItem>();
          prev.forEach(b => map.set(b.id, b));
          items.forEach(i => map.set(i.id, i));
          const merged = Array.from(map.values());
          localStorage.setItem('ptenit_company_bills', JSON.stringify(merged));
          return merged;
        });
      }
    }));

    unsubs.push(subscribeToCollection<Course>('courses', (items) => {
      if (items && items.length > 0) {
        setCourses(items);
        localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<Service>('services', (items) => {
      if (items && items.length > 0) {
        setServices(items);
        localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<GalleryItem>('gallery', (items) => {
      if (items && items.length > 0) {
        setGallery(items);
        localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<Testimonial>('testimonials', (items) => {
      if (items && items.length > 0) {
        setTestimonials(items);
        localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<MarketplaceGig>('gigs', (items) => {
      if (items && items.length > 0) {
        setGigs(prev => {
          const map = new Map<string, MarketplaceGig>();
          prev.forEach(g => map.set(g.id, g));
          items.forEach(i => map.set(i.id, i));
          const merged = Array.from(map.values());
          localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(merged));
          return merged;
        });
      }
    }));

    unsubs.push(subscribeToCollection<MarketplaceJob>('jobs', (items) => {
      if (items && items.length > 0) {
        setJobs(prev => {
          const map = new Map<string, MarketplaceJob>();
          prev.forEach(j => map.set(j.id, j));
          items.forEach(i => map.set(i.id, i));
          const merged = Array.from(map.values());
          localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(merged));
          return merged;
        });
      }
    }));

    unsubs.push(subscribeToCollection<MarketplaceProposal>('proposals', (items) => {
      if (items && items.length > 0) {
        setProposals(items);
        localStorage.setItem(`${STORAGE_KEY}_proposals`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<DigitalProduct>('digitalProducts', (items) => {
      if (items && items.length > 0) {
        setDigitalProducts(items);
        localStorage.setItem(`${STORAGE_KEY}_digital_products`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<ContactMessage>('contactMessages', (items) => {
      if (items && items.length > 0) {
        setContactMessages(items);
        localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<NotificationItem>('notifications', (items) => {
      if (items && items.length > 0) {
        setNotifications(items);
        localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<DirectMessageItem>('directMessages', (items) => {
      if (items && items.length > 0) {
        setDirectMessages(items);
        localStorage.setItem(`${STORAGE_KEY}_direct_messages`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<User>('users', (items) => {
      if (items && items.length > 0) {
        setUsers(items);
        localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<CustomerProject>('customerProjects', (items) => {
      if (items && items.length > 0) {
        setCustomerProjects(items);
        localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<Assignment>('assignments', (items) => {
      if (items && items.length > 0) {
        setAssignments(items);
        localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<AssignmentSubmission>('submissions', (items) => {
      if (items && items.length > 0) {
        setSubmissions(items);
        localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<TeacherPayout>('payouts', (items) => {
      if (items && items.length > 0) {
        setPayouts(items);
        localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<TeacherNotice>('teacherNotices', (items) => {
      if (items && items.length > 0) {
        setTeacherNotices(items);
        localStorage.setItem(`${STORAGE_KEY}_teacher_notices`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<Enrollment>('enrollments', (items) => {
      if (items && items.length > 0) {
        setEnrollments(items);
        localStorage.setItem(`${STORAGE_KEY}_enrollments`, JSON.stringify(items));
      }
    }));

    unsubs.push(subscribeToCollection<LiveClassSession>('liveSessions', (items) => {
      if (items && items.length > 0) {
        setLiveSessions(items);
        localStorage.setItem(`${STORAGE_KEY}_live_sessions`, JSON.stringify(items));
      }
    }));

    // Site settings real-time listener
    try {
      const settingsDocRef = doc(db, 'siteSettings', 'default');
      const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
        if (snap.exists()) {
          const remoteSettings = snap.data() as SiteSettings;
          setSiteSettings(remoteSettings);
          localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(remoteSettings));
        }
      }, () => {});
      unsubs.push(unsubSettings);
    } catch {}

    // Immediate Server Storage fetch (instant load for mobile & cPanel environments)
    const loadServerBackups = async () => {
      try {
        const [srvSettings, srvOrders, srvUsers, srvMktOrders, srvCourses, srvNotifs, srvGigs] = await Promise.all([
          fetchServerCollection<SiteSettings>('siteSettings'),
          fetchServerCollection<PaymentOrder>('orders'),
          fetchServerCollection<User>('users'),
          fetchServerCollection<MarketplaceOrder>('marketplaceOrders'),
          fetchServerCollection<Course>('courses'),
          fetchServerCollection<NotificationItem>('notifications'),
          fetchServerCollection<MarketplaceGig>('gigs'),
        ]);

        if (srvSettings && srvSettings.length > 0) {
          const defaultSettings = (srvSettings as any).find((s: any) => s.id === 'default') || srvSettings[0];
          if (defaultSettings) setSiteSettings(prev => ({ ...prev, ...defaultSettings }));
        }
        if (srvOrders && srvOrders.length > 0) {
          setOrders(prev => {
            const map = new Map<string, PaymentOrder>();
            prev.forEach(p => map.set(p.id, p));
            srvOrders.forEach(o => map.set(o.id, o));
            return Array.from(map.values());
          });
        }
        if (srvUsers && srvUsers.length > 0) {
          setUsers(prev => {
            const map = new Map<string, User>();
            prev.forEach(u => map.set(u.id, u));
            srvUsers.forEach(u => map.set(u.id, u));
            return Array.from(map.values());
          });
        }
        if (srvGigs && srvGigs.length > 0) {
          setGigs(prev => {
            const map = new Map<string, MarketplaceGig>();
            initialGigs.forEach(g => map.set(g.id, g));
            prev.forEach(g => map.set(g.id, g));
            srvGigs.forEach(g => map.set(g.id, g));
            const merged = Array.from(map.values());
            localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(merged));
            return merged;
          });
        }
        if (srvNotifs && srvNotifs.length > 0) {
          setNotifications(prev => {
            const map = new Map<string, NotificationItem>();
            prev.forEach(n => map.set(n.id, n));
            srvNotifs.forEach(n => map.set(n.id, n));
            return Array.from(map.values());
          });
        }
        if (srvMktOrders && srvMktOrders.length > 0) {
          setMarketplaceOrders(prev => {
            const map = new Map<string, MarketplaceOrder>();
            prev.forEach(m => map.set(m.id, m));
            srvMktOrders.forEach(m => map.set(m.id, m));
            return Array.from(map.values());
          });
        }
        if (srvCourses && srvCourses.length > 0) {
          setCourses(prev => {
            const map = new Map<string, Course>();
            prev.forEach(c => map.set(c.id, c));
            srvCourses.forEach(c => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        // Non-blocking fallback
      }
    };
    loadServerBackups();

    // Auto sync server backup data every 10 seconds for real-time sync across devices/cPanel
    const autoSyncInterval = setInterval(() => {
      loadServerBackups();
    }, 10000);
    unsubs.push(() => clearInterval(autoSyncInterval));

    // First-run database initialization (seeds Firestore & server storage if empty)
    const seedDatabaseIfNeeded = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'siteSettings', 'default'));
        if (!settingsSnap.exists()) {
          console.log('[Firestore] Seeding initial database collections...');
          await syncDocToFirestore('siteSettings', 'default', initialSiteSettings);
          await syncCollectionToFirestore('courses', initialCourses);
          await syncCollectionToFirestore('services', initialServices);
          await syncCollectionToFirestore('gallery', initialGallery);
          await syncCollectionToFirestore('testimonials', initialTestimonials);
          await syncCollectionToFirestore('jobs', initialJobs);
          await syncCollectionToFirestore('digitalProducts', initialDigitalProducts);
          await syncCollectionToFirestore('users', initialUsers);
        }
        // Ensure gigs collection is synced to Firestore so mobile and web all have real gigs
        try {
          const gigsSnap = await getDocs(collection(db, 'gigs'));
          if (gigsSnap.empty) {
            console.log('[Firestore] Seeding initial gigs...');
            await syncCollectionToFirestore('gigs', initialGigs);
          }
        } catch {}
      } catch (e) {
        console.warn('[Firestore] Seed skipped or already initialized:', e);
      }
    };
    seedDatabaseIfNeeded();

    return () => {
      unsubs.forEach(unsub => {
        try { unsub(); } catch {}
      });
    };
  }, []);

  // Auth Functions with Firebase Integration
  const login = (emailOrPhone: string, pass: string): boolean => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    
    // If email provided, attempt real Firebase Auth sign in
    if (cleanInput.includes('@')) {
      signInWithEmailAndPassword(auth, cleanInput, pass)
        .then((cred) => {
          console.log('[Firebase Auth] User signed in:', cred.user.email);
        })
        .catch((err) => {
          console.warn('[Firebase Auth] Email sign-in check:', err.code);
        });
    }

    let user = users.find(
      u => u.email.toLowerCase() === cleanInput || u.mobile === emailOrPhone
    );

    // If typing teacher or alamin credentials
    if (!user && (cleanInput === 'alamin@ptenit.com' || cleanInput === 'teacher@ptenit.com' || cleanInput.includes('alamin') || cleanInput.includes('teacher'))) {
      user = users.find(u => u.role === 'instructor') || initialUsers.find(u => u.role === 'instructor') || initialUsers[0];
    }

    if (!user && cleanInput.includes("customer")) {
      user = users.find(u => u.role === 'customer') || initialUsers.find(u => u.role === 'customer') || initialUsers[0];
    }

    // If typing admin credentials
    if (!user && (cleanInput === 'mdskazisohag@gmail.com' || cleanInput === 'admin@ptenit.com' || cleanInput.includes("admin") || cleanInput.includes("sohag"))) {
      user = users.find(u => u.role === 'admin') || initialUsers[0];
    }

    // RBAC Staff Member Authentication
    if (!user) {
      let enterpriseStaff: any[] = [];
      try {
        const savedStaff = localStorage.getItem('ptenit_enterprise_staff_list');
        if (savedStaff) enterpriseStaff = JSON.parse(savedStaff);
      } catch (e) {
        console.error(e);
      }

      // Hardcoded fallback staff
      const defaultStaffFallbacks = [
        {
          id: 'staff-02',
          name: 'ফারহানা ইয়াসমিন',
          email: 'farhana.ops@ptenit.com',
          phone: '01711223344',
          password: '123456',
          designation: 'অপারেশনস ডিরেক্টর ও টিম কো-অর্ডিনেটর',
          department: 'Operations',
          status: 'active',
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
          password: '123456',
          designation: 'হেড অব একাউন্টস ও ফাইন্যান্স',
          department: 'Finance',
          status: 'active',
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
          password: '123456',
          designation: 'মার্কেটপ্লেস লিড মডারেটর',
          department: 'Marketplace',
          status: 'active',
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
          password: '123456',
          designation: 'একাডেমিক কোর্স কো-অর্ডিনেটর',
          department: 'Academy',
          status: 'active',
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

      const allStaffCandidates = [...enterpriseStaff, ...defaultStaffFallbacks];
      const matchedStaff = allStaffCandidates.find(
        s => (s.email && s.email.toLowerCase() === cleanInput) ||
             (s.phone && s.phone === emailOrPhone) ||
             (cleanInput.includes('farhana') && s.email.includes('farhana')) ||
             (cleanInput.includes('shafiq') && s.email.includes('shafiq')) ||
             (cleanInput.includes('tanvir') && s.email.includes('tanvir')) ||
             (cleanInput.includes('rafia') && s.email.includes('rafia'))
      );

      if (matchedStaff) {
        if (matchedStaff.status === 'inactive') {
          alert(`দুঃখিত! স্টাফ সদস্য "${matchedStaff.name}"-এর অ্যাকাউন্ট বর্তমানে নিষ্ক্রিয় রয়েছে। অনুগ্রহ করে সুপার এডমিনের সাথে যোগাযোগ করুন।`);
          return false;
        }

        const expectedPassword = matchedStaff.password || '123456';
        if (pass && pass.trim() !== expectedPassword.trim()) {
          alert(`ভুল পাসওয়ার্ড! সাব-এডমিন "${matchedStaff.name}"-এর জন্য সঠিক পাসওয়ার্ড প্রদান করুন।`);
          return false;
        }

        user = {
          id: matchedStaff.id || `staff-${Date.now()}`,
          name: matchedStaff.name,
          email: matchedStaff.email,
          mobile: matchedStaff.phone || '01700000000',
          role: 'admin',
          activeRole: 'admin',
          title: matchedStaff.designation,
          institution: 'PTENit Technologies Ltd.',
          createdAt: matchedStaff.joinedDate || '২০২৪-০১-০১',
          staffPermissions: matchedStaff.permissions,
          staffDepartment: matchedStaff.department,
          staffMember: matchedStaff
        };
      }
    }

    if (user) {
      if (user.blocked) {
        alert("আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
        return false;
      }
      setActiveChatWindows([]);
      setActiveMessengerConversationId(null);
      setActiveMessengerOrderId(null);
      setCurrentUser(user);
      setPtenitUser(user);
      setMarketplaceUser(user);
      syncDocToFirestore('users', user.id, user);
      return true;
    }

    // Auto-create student fallback if no match
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || "Student",
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@ptenit.com`,
      mobile: emailOrPhone,
      role: 'student',
      roles: ['student'],
      activeRole: 'student',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setActiveChatWindows([]);
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setPtenitUser(newUser);
    setMarketplaceUser(newUser);
    syncDocToFirestore('users', newUser.id, newUser);
    return true;
  };

  // Common handler for registering or logging in a Google user (from popup or direct fallback)
  const handleRegisterOrLoginGoogleUser = (
    email: string,
    displayName: string,
    photoURL?: string,
    uid?: string,
    phoneNumber?: string,
    preferredRole: 'customer' | 'specialist' | 'both' = 'customer'
  ): boolean => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (displayName || '').trim() || cleanEmail.split('@')[0] || 'Google User';
    const avatar = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0284c7&color=fff`;

    // 1. If user already exists, log them in immediately!
    let existing = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.blocked) {
        alert("আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
        return false;
      }
      setActiveChatWindows([]);
      setActiveMessengerConversationId(null);
      setActiveMessengerOrderId(null);
      const updatedUser: User = {
        ...existing,
        avatar: existing.avatar || avatar,
      };
      setCurrentUser(updatedUser);
      setPtenitUser(updatedUser);
      setMarketplaceUser(updatedUser);
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(updatedUser));
      syncDocToFirestore('users', updatedUser.id, updatedUser);
      return true;
    }

    // 2. New Google user registration
    const isAdminUser = cleanEmail === 'mdskazisohag@gmail.com' || cleanEmail === 'admin@ptenit.com';
    const isSpec = preferredRole === 'specialist' || preferredRole === 'both';
    const assignedRole = isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'instructor' : 'customer');
    const assignedRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = isAdminUser
      ? ['admin', 'customer', 'specialist', 'instructor']
      : preferredRole === 'specialist'
      ? ['specialist', 'instructor']
      : preferredRole === 'both'
      ? ['customer', 'specialist', 'instructor']
      : ['customer'];

    const newId = uid || `usr-g-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: cleanName,
      email: cleanEmail,
      mobile: phoneNumber || '',
      role: assignedRole as any,
      roles: assignedRoles,
      activeRole: isAdminUser ? 'admin' : (preferredRole === 'specialist' ? 'specialist' : 'customer'),
      isSpecialist: isSpec,
      specialistStatus: isSpec ? 'pending' : 'not_applied',
      avatar,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Thoroughly purge previous session cache and storage keys
    clearUserSessionStorage();
    localStorage.removeItem(`${STORAGE_KEY}_logged_out`);

    // Store instantly in users list (put at very beginning so admin sees it instantly!)
    setUsers(prev => {
      const next = [newUser, ...prev.filter(u => u.id !== newUser.id && (newUser.email ? u.email?.toLowerCase() !== newUser.email.toLowerCase() : true))];
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    setCurrentUser(newUser);
    setPtenitUser(newUser);
    setMarketplaceUser(newUser);
    setActiveChatWindows([]);
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));

    // Persist to server_data/users.json and Firebase
    syncDocToFirestore('users', newUser.id, newUser);

    // Notify admin
    const adminNotif: NotificationItem = {
      id: `notif-user-${Date.now()}`,
      title: `নতুন গুগল ইউজার রেজিস্ট্রেশন: ${newUser.name}`,
      message: `${newUser.name} (${newUser.email}) গুগল দিয়ে সাইন-ইন করে সফলভাবে যোগ দিয়েছেন। রোল: ${newUser.role === 'admin' ? 'এডমিন' : newUser.role === 'instructor' ? 'টিচার/মেন্টর' : newUser.isSpecialist ? 'সেলার/স্পেশালিস্ট' : 'ক্লায়েন্ট/বায়ার'}`,
      time: 'এইমাত্র',
      read: false,
      type: 'info',
      recipientRole: 'admin',
      recipientId: 'admin',
      targetTab: 'admin'
    };

    // Personalized Welcome notification specifically for this user
    const userWelcomeNotif: NotificationItem = {
      id: `notif-welcome-${Date.now()}`,
      title: `স্বাগতম ${newUser.name}! 🎉`,
      message: 'PTENit প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে সক্রিয় হয়েছে।',
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientId: newUser.id,
      recipientEmail: newUser.email,
      targetTab: 'profile'
    };

    setNotifications(prev => [userWelcomeNotif, adminNotif, ...prev]);
    syncDocToFirestore('notifications', adminNotif.id, adminNotif);

    return true;
  };

  const signup = (userData: Omit<User, 'id' | 'createdAt'>, pass: string): boolean => {
    const newId = `usr-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const notifyAdminNewUser = (userCreated: User) => {
      const adminNotif: NotificationItem = {
        id: `notif-user-${Date.now()}`,
        title: `নতুন ইউজার রেজিস্ট্রেশন: ${userCreated.name}`,
        message: `${userCreated.name} (${userCreated.email || userCreated.mobile}) সফলভাবে ${userCreated.role === 'admin' ? 'এডমিন' : userCreated.role === 'instructor' ? 'টিচার/মেন্টর' : userCreated.isSpecialist ? 'সেলার/স্পেশালিস্ট' : 'ক্লায়েন্ট/শিক্ষার্থী'} হিসেবে যোগ দিয়েছেন।`,
        time: 'এইমাত্র',
        read: false,
        type: 'info',
        recipientRole: 'admin',
        recipientId: 'admin',
        targetTab: 'admin'
      };
      setNotifications(prev => [adminNotif, ...prev]);
      syncDocToFirestore('notifications', adminNotif.id, adminNotif);
    };

    // Thoroughly purge previous session cache and storage keys so new user gets a completely clean slate
    clearUserSessionStorage();
    localStorage.removeItem(`${STORAGE_KEY}_logged_out`);

    // Personalized Welcome notification specifically for this user
    const userWelcomeNotif: NotificationItem = {
      id: `notif-welcome-${Date.now()}`,
      title: `স্বাগতম ${newUser.name}! 🎉`,
      message: 'PTENit প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে সক্রিয় হয়েছে।',
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientId: newUser.id,
      recipientEmail: newUser.email,
      targetTab: 'profile'
    };

    // 1. Immediately store in users state and localStorage so admin and user have instant access
    setUsers(prev => {
      const exists = prev.some(u => u.id === newId || (newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase()));
      const next = exists
        ? prev.map(u => (u.id === newId || (newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase()) ? newUser : u))
        : [newUser, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    setCurrentUser(newUser);
    setPtenitUser(newUser);
    setMarketplaceUser(newUser);
    setActiveChatWindows([]);
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(newUser));

    // 2. Synchronize to cPanel server_data/users.json AND Firebase Firestore
    syncDocToFirestore('users', newId, newUser);
    notifyAdminNewUser(newUser);
    setNotifications(prev => [userWelcomeNotif, ...prev]);

    // 3. Connect to Firebase Auth if email provided
    if (userData.email && userData.email.includes('@')) {
      createUserWithEmailAndPassword(auth, userData.email, pass)
        .then((cred) => {
          const fbUser = { ...newUser, id: cred.user.uid };
          syncDocToFirestore('users', cred.user.uid, fbUser);
          setUsers(prev => {
            const next = prev.map(u => (u.id === newId ? fbUser : u));
            localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
            return next;
          });
          setCurrentUser(fbUser);
          setPtenitUser(fbUser);
          setMarketplaceUser(fbUser);
          localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(fbUser));
        })
        .catch((err) => {
          console.warn('[Firebase Auth Signup]', err.code);
        });
    }

    return true;
  };

  // Google Sign-In with Firebase Auth & Firestore Persistence
  const loginWithGoogle = async (preferredRole: 'customer' | 'specialist' | 'both' = 'customer'): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      if (!fbUser) return false;

      return handleRegisterOrLoginGoogleUser(
        fbUser.email || '',
        fbUser.displayName || '',
        fbUser.photoURL || undefined,
        fbUser.uid,
        fbUser.phoneNumber || '',
        preferredRole
      );
    } catch (err: any) {
      console.warn('[Firebase Auth Google Sign-in error]', err?.code, err?.message);
      throw err;
    }
  };

  // Direct Google Sign-In Fallback (when popup is blocked by browser or domain not whitelisted yet in Firebase)
  const loginWithGoogleDirect = (
    email: string,
    displayName: string,
    preferredRole: 'customer' | 'specialist' | 'both' = 'customer'
  ): boolean => {
    return handleRegisterOrLoginGoogleUser(email, displayName, undefined, undefined, '', preferredRole);
  };

  // Marketplace Auth Functions - Fully unified with PTENit
  const loginMarketplace = (emailOrPhone: string, pass: string): boolean => {
    return login(emailOrPhone, pass);
  };

  const signupMarketplace = (userData: Omit<User, 'id' | 'createdAt'>, pass: string): boolean => {
    return signup(userData, pass);
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    clearUserSessionStorage();
    localStorage.setItem(`${STORAGE_KEY}_logged_out`, 'true');
    setCurrentUser(null);
    setPtenitUser(null);
    setMarketplaceUser(null);
    setActiveChatWindows([]);
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    setIsMessengerInboxOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const logoutMarketplace = () => {
    logout();
  };

  const demoLoginMarketplace = (role: 'customer' | 'instructor') => {
    if (role === 'instructor') {
      const seller = users.find(u => u.role === 'instructor' || u.isSeller) || initialUsers[0];
      setCurrentUser(seller);
    } else {
      const buyer = users.find(u => u.role === 'customer') || initialUsers[0];
      setCurrentUser(buyer);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    const active = ptenitUser || marketplaceUser;
    if (!active) return;
    const updated = { ...active, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const updateMarketplaceProfile = (data: Partial<User>) => {
    updateProfile(data);
  };

  const demoLogin = (role: 'student' | 'instructor' | 'customer' | 'admin') => {
    let target = users.find(u => u.role === role);
    if (!target) {
      target = initialUsers.find(u => u.role === role) || initialUsers[0];
    }
    setCurrentUser(target);
  };

  const switchRole = (newRole: 'customer' | 'specialist' | 'instructor' | 'admin' | 'student') => {
    const activeUser = currentUser || marketplaceUser;
    if (!activeUser) return;

    const targetRole = (newRole === 'specialist' ? 'instructor' : newRole) as any;
    const updatedUser: User = {
      ...activeUser,
      role: targetRole,
      activeRole: newRole as any
    };

    setPtenitUser(updatedUser);
    setMarketplaceUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Course Management
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledCount' | 'rating'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => {
      const next = [newCourse, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('courses', newCourse.id, newCourse);
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    setCourses(prev => {
      const next = prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, ...updatedFields };
          syncDocToFirestore('courses', id, updated);
          return updated;
        }
        return c;
      });
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(next));
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('courses', id);
  };

  const acceptCourseOffer = (courseId: string, teacherId?: string, teacherName?: string) => {
    let exists = false;
    setCourses(prev => {
      const isFound = prev.some(c => c.id === courseId);
      if (isFound) {
        exists = true;
        return prev.map(c => {
          if (c.id === courseId) {
            return {
              ...c,
              offerStatus: 'accepted',
              assignedInstructorId: teacherId || c.assignedInstructorId || currentUser?.id,
              instructor: teacherName || (currentUser ? currentUser.name : c.instructor),
              isPublicOffer: false,
              acceptedAt: new Date().toISOString().split('T')[0]
            };
          }
          return c;
        });
      } else {
        // Create new course if not found
        const newCourse: Course = {
          id: courseId.startsWith('course') ? courseId : `course-${Date.now()}`,
          title: 'প্রফেশনাল লাইভ কোর্স এনরোলমেন্ট (অফিশিয়াল অফার)',
          category: 'Full-Stack Development',
          instructor: teacherName || currentUser?.name || 'তানভীর আহমেদ',
          assignedInstructorId: teacherId || currentUser?.id || 'teacher-1',
          level: 'professional',
          duration: '4 Weeks',
          lessonsCount: 16,
          isFree: false,
          price: 8500,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
          description: 'PTENit একাডেমি কর্তৃক নির্ধারিত লাইভ প্রফেশনাল কোর্স ও মেন্টরিং ব্যাচ।',
          whatYouWillLearn: ['২৪টি প্রফেশনাল লাইভ ক্লাস লেকচার', '৪টি রিয়েল-টাইম অ্যাসাইনমেন্ট ও কোড রিভিউ', 'প্রজেক্ট ফিডব্যাক ও সার্টিফিকেট প্রদান'],
          requirements: ['কম্পিউটার বা ইন্টারনেট সংযোগ'],
          tags: ['#PTENit', '#LiveCourse'],
          modules: [],
          published: true,
          targetModules: 4,
          targetLessons: 16,
          teacherCommissionRate: 35,
          offerStatus: 'accepted',
          isPublicOffer: false,
          enrolledCount: 1,
          rating: 5.0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return [newCourse, ...prev];
      }
    });

    const targetCourse = courses.find(c => c.id === courseId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🎉 কোর্স রিসিভড & মেন্টর সার্ভিস অ্যাক্টিভ!',
      message: `আপনি সফলভাবে "${targetCourse?.title || 'লাইভ কোর্স'}" কোর্সটি রিসিভ করেছেন। মেন্টর সার্ভিস (Mentor Service) অটোমেটিক্যালি অ্যাক্টিভ করা হয়েছে।`,
      time: 'এইমাত্র',
      read: false,
      type: 'success',
      recipientId: currentUser?.id,
      recipientEmail: currentUser?.email
    };
    setNotifications(prev => [notif, ...prev]);

    // Automatically enable & approve Mentor Status for currentUser when receiving a course offer
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: currentUser.mentorApplication ? {
          ...currentUser.mentorApplication,
          status: 'approved'
        } : {
          expertise: ['কোর্স ইন্সট্রাক্টর & মেন্টর'],
          experienceYears: '৩+ বছর',
          bio: 'পিটেন আইটি অনুমোদিত ভেরিফায়েড কোর্স মেন্টর',
          appliedAt: new Date().toISOString().split('T')[0],
          status: 'approved'
        }
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const declineCourseOffer = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          offerStatus: 'declined'
        };
      }
      return c;
    }));
  };

  // Enrollments & Learning
  const enrollCourse = async (
    courseId: string,
    paymentDetails?: {
      method: PaymentOrder['paymentMethod'];
      phone: string;
      txId: string;
      amount: number;
      studentName?: string;
      studentEmail?: string;
      studentPhone?: string;
      isAutomated?: boolean;
    }
  ): Promise<boolean> => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    // Resolve or auto-create student user account
    let studentUser = currentUser;
    if (!studentUser) {
      const studentName = paymentDetails?.studentName?.trim() || 'সম্মানিত শিক্ষার্থী';
      const studentEmail = paymentDetails?.studentEmail?.trim() || `student-${Date.now()}@ptenit.com`;
      const studentMobile = paymentDetails?.studentPhone?.trim() || paymentDetails?.phone?.trim() || '01700000000';

      const existingUser = users.find(u =>
        (paymentDetails?.studentEmail && u.email.toLowerCase() === paymentDetails.studentEmail.toLowerCase()) ||
        (studentMobile && u.mobile === studentMobile)
      );

      if (existingUser) {
        studentUser = existingUser;
      } else {
        studentUser = {
          id: `usr-${Date.now()}`,
          name: studentName,
          email: studentEmail,
          mobile: studentMobile,
          role: 'student',
          roles: ['student'],
          activeRole: 'student',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => {
          const next = [studentUser!, ...prev];
          localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
          return next;
        });
        syncDocToFirestore('users', studentUser.id, studentUser);
      }
      setCurrentUser(studentUser);
    }

    // Check if already enrolled
    const existing = enrollments.find(e => e.userId === studentUser!.id && e.courseId === courseId);
    if (existing) return true;

    if (!course.isFree && paymentDetails) {
      // Create Order
      const newOrder: PaymentOrder = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        userId: studentUser!.id,
        userName: studentUser!.name,
        userEmail: studentUser!.email,
        userMobile: studentUser!.mobile,
        courseId: course.id,
        courseTitle: course.title,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.txId,
        senderPhone: paymentDetails.phone,
        status: 'Paid', // Instantly activate for great user experience
        createdAt: new Date().toLocaleString('bn-BD', { hour12: true })
      };
      setOrders(prev => {
        const next = [newOrder, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('orders', newOrder.id, newOrder);

      // Central Notification for Admin
      const notifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `🎓 নতুন কোর্স এনরোলমেন্ট ও পেমেন্ট #${newOrder.id}`,
        message: `${newOrder.userName} (${newOrder.senderPhone}) "${newOrder.courseTitle}" কোর্সের জন্য ৳${newOrder.amount} (${newOrder.paymentMethod}, Trx: ${newOrder.transactionId}) পরিশোধ করেছেন।`,
        time: 'এখনই',
        read: false,
        type: 'success',
        recipientRole: 'admin',
        recipientId: 'admin',
        targetTab: 'admin',
        targetId: newOrder.id
      };

      // Confirmation Notification for Enrolled Student
      const studentConfirmationNotif: NotificationItem = {
        id: `notif-student-${Date.now()}`,
        title: '🎓 কোর্স এনরোলমেন্ট সফল!',
        message: `অভিনন্দন! "${newOrder.courseTitle}" কোর্সে আপনার এনরোলমেন্ট সফল হয়েছে।`,
        time: 'এখনই',
        read: false,
        type: 'success',
        recipientId: newOrder.userId,
        recipientEmail: newOrder.userEmail,
        targetTab: 'my-courses'
      };

      setNotifications(prev => {
        const next = [studentConfirmationNotif, notifItem, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('notifications', notifItem.id, notifItem);
      syncDocToFirestore('notifications', studentConfirmationNotif.id, studentConfirmationNotif);
      playAppSound('order');

      // Auto-feed into Company Bills ledger for Admin verification & financial tracking
      const companyBillItem: CompanyBillItem = {
        id: `BILL-${newOrder.id.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6)}`,
        payerName: newOrder.userName,
        payerPhone: newOrder.senderPhone || newOrder.userMobile,
        gateway: (newOrder.paymentMethod === 'bKash' ? 'bKash' : newOrder.paymentMethod === 'Nagad' ? 'Nagad' : newOrder.paymentMethod === 'Rocket' ? 'Rocket' : 'Bank'),
        transactionId: newOrder.transactionId,
        amount: newOrder.amount,
        category: `কোর্স ফি: ${newOrder.courseTitle}`,
        status: 'verified',
        verifiedAt: new Date().toLocaleString('bn-BD', { hour12: true }),
        date: new Date().toLocaleString('bn-BD', { hour12: true }),
        note: `কোর্স এনরোলমেন্ট অর্ডার #${newOrder.id} - TrxID: ${newOrder.transactionId}`
      };
      setCompanyBills(prev => {
        const next = [companyBillItem, ...prev.filter(b => b.id !== companyBillItem.id)];
        localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('companyBills', companyBillItem.id, companyBillItem);
    }

    // Add Enrollment
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId: studentUser!.id,
      courseId: course.id,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
      certificateIssued: false
    };

    setEnrollments(prev => {
      const next = [...prev, newEnrollment];
      localStorage.setItem(`${STORAGE_KEY}_enrollments`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('enrollments', newEnrollment.id, newEnrollment);

    setCourses(prev => {
      const next = prev.map(c => {
        if (c.id === courseId) {
          const updated = { ...c, enrolledCount: (c.enrolledCount || 0) + 1 };
          syncDocToFirestore('courses', courseId, updated);
          return updated;
        }
        return c;
      });
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(next));
      return next;
    });

    return true;
  };

  const updateLessonProgress = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    const enrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!enrollment) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Total lessons
    let totalLessonsCount = 0;
    course.modules?.forEach(m => {
      totalLessonsCount += m.lessons.length;
    });
    if (totalLessonsCount === 0) totalLessonsCount = course.lessonsCount || 1;

    const completed = enrollment.completedLessons.includes(lessonId)
      ? enrollment.completedLessons
      : [...enrollment.completedLessons, lessonId];

    const progress = Math.min(100, Math.round((completed.length / totalLessonsCount) * 100));
    const isCompleted = progress === 100;

    let certificateId = enrollment.certificateId;
    if (isCompleted && !enrollment.certificateIssued) {
      const cert = issueCertificate(currentUser.id, courseId);
      certificateId = cert.certificateCode;

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: '🎓 অফিসিয়াল সার্টিফিকেট তৈরি হয়েছে!',
        message: `অভিনন্দন! "${course.title}" কোর্সের ১০০% ক্লাস ও টাস্ক সম্পন্ন করায় আপনার সনদপত্র স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।`,
        time: 'এইমাত্র',
        read: false,
        type: 'success',
        recipientId: currentUser.id,
        recipientEmail: currentUser.email,
        targetTab: 'certificates'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    setEnrollments(prev => prev.map(e => e.id === enrollment.id ? {
      ...e,
      completedLessons: completed,
      progress: progress,
      status: isCompleted ? 'completed' : 'active',
      certificateIssued: isCompleted || e.certificateIssued,
      certificateId: certificateId || e.certificateId
    } : e));
  };

  // Certificate Issuance
  const issueCertificate = (studentId: string, courseId: string): Certificate => {
    const student = users.find(u => u.id === studentId) || currentUser;
    const course = courses.find(c => c.id === courseId);
    const code = `CERT-PTEN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateCode: code,
      studentId: studentId,
      studentName: student ? student.name : "Student",
      courseId: courseId,
      courseName: course ? course.title : "PTENit Course",
      issueDate: new Date().toISOString().split('T')[0],
      instructorName: course ? course.instructor : "PTENit Academic Team",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`
    };

    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const getCertificateByCode = (code: string) => {
    return certificates.find(c => c.certificateCode.toLowerCase() === code.toLowerCase());
  };

  // Services
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = { ...serviceData, id: `srv-${Date.now()}` };
    setServices(prev => {
      const next = [...prev, newService];
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('services', newService.id, newService);
  };

  const updateService = (id: string, fields: Partial<Service>) => {
    setServices(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...fields };
          syncDocToFirestore('services', id, updated);
          return updated;
        }
        return s;
      });
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(next));
      return next;
    });
  };

  const deleteService = (id: string) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('services', id);
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGallery(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('gallery', newItem.id, newItem);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('gallery', id);
  };

  // Testimonials
  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = { ...item, id: `test-${Date.now()}` };
    setTestimonials(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('testimonials', newItem.id, newItem);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('testimonials', id);
  };

  // Offers & Settings
  const updateOffers = (newOffers: Offer[]) => {
    setOffers(newOffers);
    syncDocToFirestore('offers', 'default', { list: newOffers });
  };

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(newSettings));
    syncDocToFirestore('siteSettings', 'default', newSettings);
  };

  // Orders
  const updateOrderStatus = (orderId: string, status: PaymentOrder['status']) => {
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderId) {
          const updated = { ...o, status };
          syncDocToFirestore('orders', orderId, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(next));
      return next;
    });
  };

  // Contact
  const sendContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      read: false
    };
    setContactMessages(prev => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setDirectMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const sendCentralNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'এখনই',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    playAppSound('notification');
  };

  const applyForMentorship = (data: {
    name?: string;
    email?: string;
    expertise: string[];
    experienceYears: string;
    bio: string;
    portfolioUrl?: string;
    proposedCourseTopic?: string;
    phone?: string;
  }) => {
    let targetUser = currentUser || marketplaceUser;

    // If no user is logged in, look up existing user or create a new applicant User
    if (!targetUser) {
      const applicantName = data.name?.trim() || 'নতুন ইনস্ট্রাক্টর আবেদনকারী';
      const applicantEmail = data.email?.trim() || `teacher-${Date.now()}@ptenit.com`;
      const applicantPhone = data.phone?.trim() || '01700000000';

      const existingUser = users.find(u => 
        (data.email && u.email.toLowerCase() === data.email.toLowerCase()) || 
        (data.phone && u.mobile === data.phone)
      );

      if (existingUser) {
        targetUser = existingUser;
      } else {
        const newApplicantUser: User = {
          id: `teacher-applicant-${Date.now()}`,
          name: applicantName,
          email: applicantEmail,
          mobile: applicantPhone,
          role: 'instructor',
          roles: ['instructor'],
          createdAt: new Date().toISOString().split('T')[0],
          isMentor: false,
          mentorStatus: 'pending',
          mentorApplication: {
            expertise: data.expertise,
            experienceYears: data.experienceYears,
            bio: data.bio,
            portfolioUrl: data.portfolioUrl,
            proposedCourseTopic: data.proposedCourseTopic,
            phone: applicantPhone,
            appliedAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
            status: 'pending'
          }
        };

        setUsers(prev => [newApplicantUser, ...prev]);
        sendCentralNotification({
          title: '📋 নতুন টিচার ও মেন্টরশিপ আবেদন জমা হয়েছে',
          message: `${newApplicantUser.name} ইনস্ট্রাক্টর ও কোর্স পরিচালনার জন্য আবেদন করেছেন। এডমিন প্যানেল থেকে পর্যালোচনা করুন।`,
          type: 'info',
          category: 'mentor',
          targetTab: 'admin',
        });
        playAppSound('notification');
        return;
      }
    }

    const updatedUser: User = {
      ...targetUser,
      name: data.name?.trim() || targetUser.name,
      email: data.email?.trim() || targetUser.email,
      mobile: data.phone?.trim() || targetUser.mobile,
      mentorStatus: 'pending',
      mentorApplication: {
        expertise: data.expertise,
        experienceYears: data.experienceYears,
        bio: data.bio,
        portfolioUrl: data.portfolioUrl,
        proposedCourseTopic: data.proposedCourseTopic,
        phone: data.phone || targetUser.mobile,
        appliedAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'pending'
      }
    };

    if (currentUser) setPtenitUser(updatedUser);
    if (marketplaceUser) setMarketplaceUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === targetUser!.id ? updatedUser : u));

    sendCentralNotification({
      title: '📋 মেন্টরশিপ আবেদন সফলভাবে জমা হয়েছে',
      message: `আপনার মেন্টরশিপ আবেদন পর্যালোচনা করা হচ্ছে। এডমিন প্যানেল থেকে খুব শীঘ্রই অনুমোদন দেওয়া হবে।`,
      type: 'info',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'আবেদন স্ট্যাটাস দেখুন',
      details: {
        badgeText: 'অপেক্ষমান (Pending Review)',
        note: `এক্সপার্টিজ: ${data.expertise.join(', ')} • অভিজ্ঞতা: ${data.experienceYears}`
      }
    });
    playAppSound('notification');
  };

  const approveMentorApplication = (userId?: string) => {
    const targetId = userId || currentUser?.id || marketplaceUser?.id;
    if (!targetId) return;

    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        return {
          ...u,
          role: 'instructor',
          isMentor: true,
          mentorStatus: 'approved',
          mentorApplication: u.mentorApplication ? { ...u.mentorApplication, status: 'approved' } : undefined
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === targetId) {
      setPtenitUser({
        ...currentUser,
        role: 'instructor',
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: currentUser.mentorApplication ? { ...currentUser.mentorApplication, status: 'approved' } : undefined
      });
    }

    if (marketplaceUser && marketplaceUser.id === targetId) {
      setMarketplaceUser({
        ...marketplaceUser,
        role: 'instructor',
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: marketplaceUser.mentorApplication ? { ...marketplaceUser.mentorApplication, status: 'approved' } : undefined
      });
    }

    sendCentralNotification({
      title: '🎉 অভিনন্দন! আপনার মেন্টরশিপ আবেদন অনুমোদিত হয়েছে',
      message: 'আপনি এখন PTENit ভেরিফায়েড মেন্টর। আপনার কোর্স তৈরি, অ্যাসাইনমেন্ট প্রদান ও স্টুডেন্টদের মেন্টরিং করার সকল ফিচার আনলক করা হয়েছে!',
      type: 'success',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'মেন্টর প্যানেলে যান',
      details: {
        badgeText: 'ভেরিফায়েড মেন্টর (Approved)',
        note: 'কোর্স ও লাইভ ক্লাস ম্যানেজমেন্ট শুরু করুন।'
      }
    });
  };

  const rejectMentorApplication = (userId?: string, reason?: string) => {
    const targetId = userId || currentUser?.id || marketplaceUser?.id;
    if (!targetId) return;

    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        return {
          ...u,
          mentorStatus: 'rejected',
          mentorApplication: u.mentorApplication ? { ...u.mentorApplication, status: 'rejected', rejectionReason: reason } : undefined
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === targetId) {
      setPtenitUser({
        ...currentUser,
        mentorStatus: 'rejected',
        mentorApplication: currentUser.mentorApplication ? { ...currentUser.mentorApplication, status: 'rejected', rejectionReason: reason } : undefined
      });
    }

    sendCentralNotification({
      title: '⚠️ মেন্টরশিপ আবেদন সংক্রান্ত আপডেট',
      message: `আপনার মেন্টরশিপ আবেদনটি এই মুহূর্তে অনুমোদন করা সম্ভব হয়নি। কারণ: ${reason || 'প্রয়োজনীয় অভিজ্ঞতার ঘাটতি'}`,
      type: 'warning',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'পুনরায় আবেদন করুন',
      details: {
        badgeText: 'প্রত্যাখ্যাত (Rejected)',
        note: reason || 'প্রয়োজনীয় তথ্যাবলি হালনাগাদ করে পুনরায় আবেদন করুন।'
      }
    });
  };

  const markDirectMessageRead = useCallback((id: string) => {
    setDirectMessages(prev => {
      const target = prev.find(m => m.id === id);
      if (!target || target.read) return prev;
      return prev.map(m => m.id === id ? { ...m, read: true } : m);
    });
    setReadConversationIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(`${STORAGE_KEY}_read_convo_ids`, JSON.stringify(next));
      return next;
    });
  }, []);

  const markConversationRead = useCallback((convoId: string) => {
    setReadConversationIds(prev => {
      if (prev.includes(convoId)) return prev;
      const next = [...prev, convoId];
      localStorage.setItem(`${STORAGE_KEY}_read_convo_ids`, JSON.stringify(next));
      return next;
    });
    setDirectMessages(prev => {
      let changed = false;
      const next = prev.map(m => {
        const isMatch =
          m.id === convoId ||
          m.senderId === convoId ||
          convoId.includes(m.id) ||
          (m.senderName && convoId.toLowerCase().includes(m.senderName.toLowerCase())) ||
          (m.senderName && m.senderName.toLowerCase().includes(convoId.toLowerCase()));
        if (isMatch && (!m.read || m.unreadCount !== 0)) {
          changed = true;
          return { ...m, read: true, unreadCount: 0 };
        }
        return m;
      });
      return changed ? next : prev;
    });
  }, []);

  const markAllConversationsRead = useCallback(() => {
    setDirectMessages(prev => {
      const anyUnread = prev.some(m => !m.read || m.unreadCount !== 0);
      if (!anyUnread) return prev;
      return prev.map(m => ({ ...m, read: true, unreadCount: 0 }));
    });
    setReadConversationIds(prev => {
      const allIds = Array.from(new Set([
        ...prev,
        'chat-client-sohag',
        'chat-client-tanjim',
        'chat-client-sumaiya',
        'chat-tanvir-ahmed',
        'chat-creative-pixels',
        'chat-piten-support'
      ]));
      if (allIds.length === prev.length) return prev;
      localStorage.setItem(`${STORAGE_KEY}_read_convo_ids`, JSON.stringify(allIds));
      return allIds;
    });
  }, []);

  const markAllDirectMessagesRead = useCallback(() => {
    setDirectMessages(prev => {
      const anyUnread = prev.some(m => !m.read);
      if (!anyUnread) return prev;
      return prev.map(m => ({ ...m, read: true }));
    });
  }, []);

  const sendDirectMessage = (msg: Omit<DirectMessageItem, 'id' | 'read'>) => {
    const newMsg: DirectMessageItem = {
      ...msg,
      id: `dmsg-${Date.now()}`,
      senderId: msg.senderId || currentUser?.id,
      senderEmail: msg.senderEmail || currentUser?.email,
      read: false
    };
    setDirectMessages(prev => [newMsg, ...prev]);
    playAppSound('message');
  };

  const openChatWindow = (contact: { id?: string; orderId?: string; senderName: string; senderRole?: string; senderAvatar?: string; initialMessage?: string }) => {
    const windowId = contact.id || `chat-${contact.senderName.replace(/\s+/g, '-').toLowerCase()}`;
    setActiveMessengerConversationId(windowId);
    
    setActiveChatWindows(prev => {
      const existing = prev.find(w => w.id === windowId || w.senderName === contact.senderName);
      if (existing) {
        return [...prev.filter(w => w.id !== existing.id), { ...existing, minimized: false, orderId: contact.orderId || existing.orderId }];
      }
      
      const newWin: ActiveChatWindow = {
        id: windowId,
        orderId: contact.orderId,
        senderName: contact.senderName,
        senderRole: contact.senderRole || 'customer',
        senderAvatar: contact.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        minimized: false,
        messages: contact.initialMessage ? [
          {
            id: `msg-${Date.now()}-1`,
            senderName: contact.senderName,
            senderAvatar: contact.senderAvatar,
            isSelf: false,
            text: contact.initialMessage,
            time: 'এখন'
          }
        ] : [
          {
            id: `msg-${Date.now()}-1`,
            senderName: contact.senderName,
            senderAvatar: contact.senderAvatar,
            isSelf: false,
            text: `হ্যালো! আমি ${contact.senderName}। কাজ বা প্রজেক্ট সম্পর্কিত যেকোনো তথ্যের জন্য ইনবক্সে মেসেজ করুন।`,
            time: '১০ মিনিট আগে'
          }
        ]
      };
      return [...prev, newWin];
    });

    // Floating mini chat popup window opens on screen directly over the current view
    // (User can view their orders and close popup with 'X' button)
  };

  const closeChatWindow = (id: string) => {
    setActiveChatWindows(prev => prev.filter(w => w.id !== id));
  };

  const openMessengerInbox = (conversationId?: string, initialTab: 'messages' | 'notifications' | 'courses' = 'messages', orderId?: string) => {
    setInitialMessengerTab(initialTab);
    if (conversationId) {
      setActiveMessengerConversationId(conversationId);
      setActiveMessengerOrderId(orderId || null);
      // If an orderId or active chat needs to be registered, sync it
      if (orderId) {
        setActiveChatWindows(prev => {
          const existing = prev.find(w => w.id === conversationId);
          if (existing) {
            return prev.map(w => w.id === conversationId ? { ...w, orderId, minimized: false } : w);
          }
          return prev;
        });
      }
    } else {
      setActiveMessengerConversationId(null);
      setActiveMessengerOrderId(null);
    }
    // Clear floating popup windows so full messenger is focused
    setActiveChatWindows([]);
    setIsNotificationCenterOpen(false);
    setIsMessengerInboxOpen(true);
  };

  const closeMessengerInbox = () => {
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    setIsMessengerInboxOpen(false);
    setIsNotificationCenterOpen(false);
    setRightColumnView('default');
  };

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const openNotificationCenter = () => {
    openMessengerInbox(undefined, 'notifications');
  };

  const closeNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
    setIsMessengerInboxOpen(false);
    setRightColumnView('default');
  };

  const [marketplaceMode, setMarketplaceModeState] = useState<'buying' | 'selling'>(() => {
    try {
      const saved = localStorage.getItem('marketplace_mode');
      if (saved === 'selling' || saved === 'buying') return saved;
    } catch {}
    return 'buying';
  });

  const setMarketplaceMode = useCallback((mode: 'buying' | 'selling') => {
    setMarketplaceModeState(prev => (prev === mode ? prev : mode));
    try {
      localStorage.setItem('marketplace_mode', mode);
    } catch {}
  }, []);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleMinimizeChatWindow = (id: string) => {
    setActiveChatWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w));
  };

  const sendChatMessage = (windowId: string, text: string, meetLink?: string, directOffer?: DirectOfferMeta) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser?.name || 'আমি',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      isSelf: true,
      text,
      time: 'এখন',
      meetLink,
      directOffer
    };

    // Find the target chat window to associate with order and decrement unread counter on reply
    const currentWindows = activeChatWindows;
    const targetWin = currentWindows.find(w => w.id === windowId);
    const targetOrderId = targetWin?.orderId;
    const targetSenderName = targetWin?.senderName;

    // Decrement unread message count for this order upon sending a reply
    setMarketplaceOrders(prev => prev.map(o => {
      const isMatched = (targetOrderId && o.id === targetOrderId) ||
        (targetSenderName && (o.buyerName === targetSenderName || o.sellerName === targetSenderName));
      if (isMatched) {
        const currentCount = o.unreadMessageCount ?? 0;
        return {
          ...o,
          unreadMessageCount: Math.max(0, currentCount - 1)
        };
      }
      return o;
    }));

    setActiveChatWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        return {
          ...w,
          messages: [...w.messages, userMsg]
        };
      }
      return w;
    }));
    playAppSound('message');

    // Auto response for ongoing active messaging thread (only if not a direct offer or meet call)
    if (!meetLink && !directOffer) {
      setTimeout(() => {
        setActiveChatWindows(prev => prev.map(w => {
          if (w.id === windowId) {
            const autoReplies = [
              "ধন্যবাদ ভাইয়া! আপনার মেসেজটি পেয়েছি, কাজ দ্রুত এগিয়ে নিচ্ছি।",
              "জি অবশ্যই! আমি বিষয়টি ড্যাশবোর্ডে ফাইলসহ আপডেট করে দেবো।",
              "কোনো সংশোধনী থাকলে বলুন, আমরা এখনই গুগল মিটে লাইভ ডিসকাশন করতে পারি!"
            ];
            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
            const autoReply: ChatMessage = {
              id: `msg-reply-${Date.now()}`,
              senderName: w.senderName,
              senderAvatar: w.senderAvatar,
              isSelf: false,
              text: randomReply,
              time: 'এখন'
            };
            return {
              ...w,
              messages: [...w.messages, autoReply]
            };
          }
          return w;
        }));
        playAppSound('message');
      }, 1200);
    } else {
      // Immediate acknowledgment from receiver when Google Meet link is shared
      setTimeout(() => {
        setActiveChatWindows(prev => prev.map(w => {
          if (w.id === windowId) {
            const autoReply: ChatMessage = {
              id: `msg-reply-${Date.now()}`,
              senderName: w.senderName,
              senderAvatar: w.senderAvatar,
              isSelf: false,
              text: "ধন্যবাদ! আমি গুগল মিট (Google Meet) আমন্ত্রণটি পেয়েছি, এখনই লিংকে ক্লিক করে মিটিংয়ে যুক্ত হচ্ছি।",
              time: 'এখন'
            };
            return {
              ...w,
              messages: [...w.messages, autoReply]
            };
          }
          return w;
        }));
        playAppSound('message');
      }, 1200);
    }
  };

  // In-App Video/Audio/Screen Meet Studio State (Our site's native conference engine)
  const [inAppMeetState, setInAppMeetState] = useState<{
    isOpen: boolean;
    roomTitle?: string;
    targetName?: string;
    targetAvatar?: string;
    targetRole?: string;
    courseTitle?: string;
    windowId?: string;
    initialType?: 'video' | 'audio' | 'screen';
  }>({
    isOpen: false
  });

  const openInAppMeet = useCallback((params?: {
    roomTitle?: string;
    targetName?: string;
    targetAvatar?: string;
    targetRole?: string;
    courseTitle?: string;
    windowId?: string;
    initialType?: 'video' | 'audio' | 'screen';
  }) => {
    setInAppMeetState({
      isOpen: true,
      roomTitle: params?.roomTitle || 'PTENit লাইভ ভিডিও ও অডিও কনফারেন্স',
      targetName: params?.targetName || 'সম্মানিত ক্লায়েন্ট / শিক্ষার্থী',
      targetAvatar: params?.targetAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      targetRole: params?.targetRole || 'অনলাইন অংশগ্রহণকারী',
      courseTitle: params?.courseTitle,
      windowId: params?.windowId,
      initialType: params?.initialType || 'video'
    });
  }, []);

  const closeInAppMeet = useCallback(() => {
    setInAppMeetState(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
  }, []);

  // Google Meet Modal State & Handlers
  const [googleMeetModalState, setGoogleMeetModalState] = useState<{
    isOpen: boolean;
    windowId?: string;
    targetName?: string;
    existingLink?: string;
  }>({
    isOpen: false
  });

  const openGoogleMeetModal = useCallback((windowId: string, targetName?: string, existingLink?: string) => {
    setGoogleMeetModalState({
      isOpen: true,
      windowId,
      targetName,
      existingLink
    });
  }, []);

  const closeGoogleMeetModal = useCallback(() => {
    setGoogleMeetModalState(prev => (prev.isOpen ? { isOpen: false } : prev));
  }, []);

  const createGoogleMeetCall = (windowId: string, customMeetLink?: string) => {
    // If it's a course live class or a direct link shortcut
    if (windowId === 'course-live' || windowId.startsWith('meet-')) {
      openInAppMeet({
        roomTitle: 'PTENit লাইভ ক্লাস ও মেন্টরিং স্টুডিও',
        targetName: 'কোর্স শিক্ষক ও মেন্টর',
        courseTitle: 'অনলাইন লাইভ ক্লাস',
        initialType: 'video'
      });
      return;
    }

    // Direct URL link passed
    if (customMeetLink && customMeetLink.trim()) {
      let finalUrl = customMeetLink.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }
      sendChatMessage(
        windowId,
        `📹 গুগুল মিট (Google Meet) ভিডিও কনফারেন্স কল আমন্ত্রণ পাঠানো হয়েছে। সরাসরি লিংকে জয়েন করুন!`,
        finalUrl
      );
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default: Launch our platform's own In-App Video & Audio Meet Studio directly inside our site!
    const targetWin = activeChatWindows.find(w => w.id === windowId);
    openInAppMeet({
      windowId,
      roomTitle: `${targetWin?.senderName || 'সম্মানিত ক্লায়েন্ট'} এর সাথে লাইভ কল`,
      targetName: targetWin?.senderName || 'সম্মানিত ক্লায়েন্ট',
      targetAvatar: targetWin?.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      targetRole: targetWin?.senderRole || 'অনলাইন ক্লায়েন্ট',
      initialType: 'video'
    });

    // Send notification in conversation
    sendChatMessage(
      windowId,
      `📹 ভিডিও কল শুরু করা হয়েছে। কলে যুক্ত হতে ক্লিক করুন।`,
      '#in-app-meet'
    );
  };

  const toggleUserBlock = (userId: string, reason?: string) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          const nextBlocked = !u.blocked;
          const updated = {
            ...u,
            blocked: nextBlocked,
            isRestricted: nextBlocked,
            restrictionReason: nextBlocked ? (reason || 'প্রশাসনিক পর্যালোচনা ও নীতিমালার কারণে অ্যাকাউন্ট সাময়িক স্থগিত / রেস্ট্রিক্ট করা হয়েছে।') : undefined,
            restrictedAt: nextBlocked ? new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined,
          };
          syncDocToFirestore('users', userId, updated);
          return updated;
        }
        return u;
      });
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
  };

  const restrictUser = (userId: string, reason?: string) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          const updated = {
            ...u,
            blocked: true,
            isRestricted: true,
            restrictionReason: reason || 'প্রশাসনিক পর্যালোচনা ও নীতিমালার কারণে অ্যাকাউন্ট স্থগিত / রেস্ট্রিক্ট করা হয়েছে।',
            restrictedAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
          };
          syncDocToFirestore('users', userId, updated);
          return updated;
        }
        return u;
      });
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    playAppSound('notification');
  };

  const unrestrictUser = (userId: string) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === userId) {
          const updated = {
            ...u,
            blocked: false,
            isRestricted: false,
            restrictionReason: undefined,
            restrictedAt: undefined,
          };
          syncDocToFirestore('users', userId, updated);
          return updated;
        }
        return u;
      });
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    playAppSound('success');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => {
      const next = [newUser, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('users', newUser.id, newUser);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          syncDocToFirestore('users', id, updated);
          if (currentUser?.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      });
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
  };

  const requestTeacherPayout = (payoutData: Omit<TeacherPayout, 'id' | 'requestedAt' | 'status'>) => {
    const newPayout: TeacherPayout = {
      ...payoutData,
      id: `pay-${Date.now()}`,
      status: 'Pending',
      requestedAt: new Date().toLocaleString('bn-BD', { hour12: true })
    };
    setPayouts(prev => {
      const next = [newPayout, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('payouts', newPayout.id, newPayout);
  };

  const updatePayoutStatus = (payoutId: string, status: TeacherPayout['status'], txId?: string) => {
    setPayouts(prev => {
      const next = prev.map(p => {
        if (p.id === payoutId) {
          const updated = {
            ...p,
            status,
            transactionId: txId || p.transactionId,
            processedAt: new Date().toLocaleString('bn-BD', { hour12: true })
          };
          syncDocToFirestore('payouts', payoutId, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(next));
      return next;
    });
  };

  const sendTeacherNotice = (noticeData: Omit<TeacherNotice, 'id' | 'sentAt'>) => {
    const newNotice: TeacherNotice = {
      ...noticeData,
      id: `tnotice-${Date.now()}`,
      sentAt: new Date().toLocaleString('bn-BD', { hour12: true }),
      read: false
    };
    setTeacherNotices(prev => {
      const next = [newNotice, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_teacher_notices`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('teacherNotices', newNotice.id, newNotice);

    // Also add to global notifications for visibility
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📢 সাপোর্ট নোটিশ: ${noticeData.subject}`,
        message: noticeData.message,
        time: "এখনই",
        read: false,
        type: "info"
      },
      ...prev
    ]);
  };

  // Assignment Functions
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsgn: Assignment = {
      ...assignmentData,
      id: `asgn-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => {
      const next = [newAsgn, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('assignments', newAsgn.id, newAsgn);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => {
      const next = prev.filter(a => a.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('assignments', id);
  };

  const submitAssignment = (subData: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: AssignmentSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleString('bn-BD', { hour12: true }),
      status: 'submitted'
    };
    setSubmissions(prev => {
      const next = [newSub, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('submissions', newSub.id, newSub);
  };

  const gradeSubmission = (submissionId: string, points: number, feedback: string) => {
    setSubmissions(prev => {
      const next = prev.map(s => {
        if (s.id === submissionId) {
          const updated = {
            ...s,
            points,
            feedback,
            status: 'graded' as const
          };
          syncDocToFirestore('submissions', submissionId, updated);
          return updated;
        }
        return s;
      });
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(next));
      return next;
    });
  };

  const updateSubmissionStatus = (submissionId: string, status: AssignmentSubmission['status']) => {
    setSubmissions(prev => {
      const next = prev.map(s => {
        if (s.id === submissionId) {
          const updated = { ...s, status };
          syncDocToFirestore('submissions', submissionId, updated);
          return updated;
        }
        return s;
      });
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(next));
      return next;
    });
  };

  const deleteSubmission = (submissionId: string) => {
    setSubmissions(prev => {
      const next = prev.filter(s => s.id !== submissionId);
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('submissions', submissionId);
  };

  const updateSubmission = (submissionId: string, updates: Partial<AssignmentSubmission>) => {
    setSubmissions(prev => {
      const next = prev.map(s => {
        if (s.id === submissionId) {
          const updated = { ...s, ...updates };
          syncDocToFirestore('submissions', submissionId, updated);
          return updated;
        }
        return s;
      });
      localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(next));
      return next;
    });
  };

  // Customer Project Functions
  const createCustomerProject = (projData: Omit<CustomerProject, 'id' | 'createdAt' | 'status'> & { id?: string; orderId?: string }) => {
    const createdAtIso = new Date().toISOString();
    const projId = projData.id || `proj-${Date.now()}`;
    const newProj: CustomerProject = {
      ...projData,
      id: projId,
      status: 'Pending Review',
      createdAt: createdAtIso.split('T')[0]
    };
    setCustomerProjects(prev => {
      const next = [newProj, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('customerProjects', newProj.id, newProj);

    // Also automatically create a MarketplaceOrder for PTEN IT Agency Service or Direct Order
    const orderAmount = projData.priceEstimate || 5000;
    const isDirect = !!projData.isDirectOffer;
    const directExpiresAt = isDirect ? (projData.expiresAt || new Date(Date.now() + 24 * 3600 * 1000).toISOString()) : undefined;

    const agencyOrderId = projData.orderId || `ord-ptenit-${projId.replace('proj-', '')}`;
    const agencyOrder: MarketplaceOrder = {
      id: agencyOrderId,
      jobId: newProj.id,
      type: isDirect ? 'direct_offer' : 'custom_agency_order',
      title: projData.serviceTitle || (isDirect ? 'ডিরেক্ট পার্সোনাল প্রজেক্ট অফার' : 'PTEN IT এজেন্সির কাস্টম প্রজেক্ট'),
      category: projData.category || 'PTEN IT Agency',
      buyerId: projData.customerId || currentUser?.id || `guest-${Date.now()}`,
      buyerName: projData.customerName || currentUser?.name || 'সম্মানিত ক্লায়েন্ট',
      buyerEmail: projData.customerEmail || currentUser?.email || 'client@ptenit.com',
      buyerPhone: projData.customerPhone || currentUser?.mobile || '01700000000',
      sellerId: isDirect && projData.targetSellerId ? projData.targetSellerId : 'pending_expert',
      sellerName: isDirect && projData.targetSellerName ? projData.targetSellerName : 'এক্সপার্ট রিসিভড অপেক্ষমান',
      sellerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      isInternalStaff: !isDirect,
      packageType: 'Custom',
      amount: orderAmount,
      adminCommission: Math.round(orderAmount * 0.1),
      sellerPayout: Math.round(orderAmount * 0.9),
      paymentMethod: 'PTEN IT Official Escrow',
      transactionId: `TRX-${isDirect ? 'DIRECT' : 'PTENIT'}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: isDirect ? 'pending' : 'pending_approval',
      isPublicOffer: !isDirect,
      isDirectOffer: isDirect,
      targetSellerId: isDirect ? projData.targetSellerId : undefined,
      expiresAt: directExpiresAt,
      reachCount: Math.floor(Math.random() * 40) + 20,
      likesCount: Math.floor(Math.random() * 10) + 2,
      budgetRange: projData.budgetRange || `৳${orderAmount.toLocaleString('bn-BD')}`,
      deliveryNote: projData.description,
      createdAt: createdAtIso,
      deadlineDate: projData.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => {
      const next = [agencyOrder, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('marketplaceOrders', agencyOrder.id, agencyOrder);

    // Ensure buyer user is recorded in users collection
    const buyerId = agencyOrder.buyerId;
    const existingUser = users.find(u => u.id === buyerId || (agencyOrder.buyerEmail && u.email.toLowerCase() === agencyOrder.buyerEmail.toLowerCase()));
    if (!existingUser) {
      const newBuyerUser: User = {
        id: buyerId,
        name: agencyOrder.buyerName,
        email: agencyOrder.buyerEmail,
        mobile: agencyOrder.buyerPhone,
        role: 'customer',
        roles: ['customer'],
        activeRole: 'customer',
        marketplaceMode: 'buying',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => {
        const next = [newBuyerUser, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('users', buyerId, newBuyerUser);
    }

    // Notification handling (Direct vs. Public)
    if (isDirect && projData.targetSellerId) {
      const directNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `🔒 নতুন ডিরেক্ট পার্সোনাল প্রজেক্ট অফার (২৪ ঘণ্টা)`,
        message: `${newProj.customerName} আপনাকে সরাসরি "৳${orderAmount}" বাজেটের "${newProj.serviceTitle}" পাঠিয়েছেন। ২৪ ঘণ্টার মধ্যে রিসিভ করুন।`,
        time: 'এখনই',
        read: false,
        type: 'info',
        recipientId: projData.targetSellerId,
        recipientRole: 'seller',
        mode: 'selling',
        targetTab: 'orders',
        targetId: agencyOrder.id
      };
      setNotifications(prev => {
        const next = [directNotif, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('notifications', directNotif.id, directNotif);
    } else {
      const adminNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `💼 নতুন কাস্টম প্রজেক্ট অর্ডার #${newProj.id}`,
        message: `${newProj.customerName} "${newProj.serviceTitle}" জমা দিয়েছেন।`,
        time: 'এখনই',
        read: false,
        type: 'info',
        recipientRole: 'admin',
        recipientId: 'admin',
        targetTab: 'admin',
        targetId: newProj.id
      };
      const buyerConfirmationNotif: NotificationItem = {
        id: `notif-buyer-${Date.now()}`,
        title: `💼 আপনার প্রজেক্ট অর্ডার #${newProj.id} সফলভাবে জমা হয়েছে`,
        message: `আপনার "${newProj.serviceTitle}" প্রজেক্ট অর্ডারটি রিসিভ করা হয়েছে।`,
        time: 'এখনই',
        read: false,
        type: 'success',
        recipientId: buyerId,
        recipientEmail: agencyOrder.buyerEmail,
        targetTab: 'my-orders',
        targetId: newProj.id
      };
      setNotifications(prev => {
        const next = [buyerConfirmationNotif, adminNotif, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('notifications', adminNotif.id, adminNotif);
      syncDocToFirestore('notifications', buyerConfirmationNotif.id, buyerConfirmationNotif);
    }
    playAppSound('order');
  };

  const updateCustomerProjectStatus = (id: string, status: CustomerProject['status'], priceEstimate?: number) => {
    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const updated = {
            ...p,
            status,
            ...(priceEstimate !== undefined ? { priceEstimate } : {}),
            updatedAt: new Date().toISOString().split('T')[0]
          };
          syncDocToFirestore('customerProjects', id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });
  };

  // Marketplace & Agency Dispatch Functions
  const createGig = (newGig: Omit<MarketplaceGig, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => {
    const isAgencyAdmin = newGig.sellerId === 'ptenit-official' || newGig.sellerId === 'ptenit-agency' || newGig.isAgencyStaff;
    
    // Enforce maximum 6 gigs limit per regular seller (not agency admin)
    if (!isAgencyAdmin) {
      const userGigCount = gigs.filter(g =>
        (newGig.sellerId && g.sellerId === newGig.sellerId) ||
        (newGig.sellerName && g.sellerName.toLowerCase() === newGig.sellerName.toLowerCase())
      ).length;

      if (userGigCount >= 6) {
        console.warn("Gig limit reached: A seller cannot create more than 6 gigs.");
        return;
      }
    }

    const defaultFeatures = ['কাস্টম ডিজাইন ও ডেভেলপমেন্ট', 'রেসপন্সিভ লেআউট', 'ফুল টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি'];

    const packages = newGig.packages || {
      basic: {
        name: 'বেসিক প্যাকেজ',
        price: 5000,
        deliveryDays: 3,
        revisions: '3',
        features: defaultFeatures.slice(0, 2)
      },
      standard: {
        name: 'স্ট্যান্ডার্ড প্যাকেজ',
        price: 12000,
        deliveryDays: 5,
        revisions: '5',
        features: defaultFeatures.slice(0, 3)
      },
      premium: {
        name: 'প্রিমিয়াম প্যাকেজ',
        price: 25000,
        deliveryDays: 7,
        revisions: 'Unlimited',
        features: defaultFeatures
      }
    };

    const created: MarketplaceGig = {
      ...newGig,
      packages,
      id: `gig-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGigs(prev => {
      const next = [created, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('gigs', created.id, created);
  };

  const updateGig = (id: string, updated: Partial<MarketplaceGig>) => {
    setGigs(prev => {
      const next = prev.map(g => {
        if (g.id === id) {
          const item = { ...g, ...updated };
          syncDocToFirestore('gigs', id, item);
          return item;
        }
        return g;
      });
      localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(next));
      return next;
    });
  };

  const deleteGig = (id: string) => {
    setGigs(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('gigs', id);
  };

  const createJob = (newJob: Omit<MarketplaceJob, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => {
    const created: MarketplaceJob = {
      ...newJob,
      id: `job-${Date.now()}`,
      proposalsCount: 0,
      status: newJob.assignedStaffId ? 'assigned' : 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => {
      const next = [created, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('jobs', created.id, created);

    // If custom assigned or internal staff only, also create an agency order
    if (newJob.assignedStaffId) {
      const order: MarketplaceOrder = {
        id: `ord-mkt-${Date.now()}`,
        type: 'custom_agency_order',
        jobId: created.id,
        title: newJob.title,
        category: newJob.category,
        buyerId: newJob.buyerId,
        buyerName: newJob.buyerName,
        buyerEmail: newJob.buyerEmail,
        buyerPhone: newJob.buyerPhone,
        sellerId: newJob.assignedStaffId,
        sellerName: newJob.assignedStaffName || 'PTENit Staff',
        isInternalStaff: true,
        packageType: 'Custom',
        amount: newJob.budget,
        adminCommission: Math.round(newJob.budget * 0.1),
        sellerPayout: Math.round(newJob.budget * 0.9),
        status: 'in_progress',
        createdAt: new Date().toISOString().split('T')[0],
        deadlineDate: new Date(Date.now() + (newJob.deadlineDays || 7) * 86400000).toISOString().split('T')[0]
      };
      setMarketplaceOrders(prev => {
        const next = [order, ...prev];
        localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
        return next;
      });
      syncDocToFirestore('marketplaceOrders', order.id, order);
    }
  };

  const updateJobStatus = (id: string, status: MarketplaceJob['status'], assignedStaffId?: string, assignedStaffName?: string) => {
    setJobs(prev => {
      const next = prev.map(j => {
        if (j.id === id) {
          const item = {
            ...j,
            status,
            ...(assignedStaffId ? { assignedStaffId, assignedStaffName } : {})
          };
          syncDocToFirestore('jobs', id, item);
          return item;
        }
        return j;
      });
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });
  };

  const submitProposal = (newProp: Omit<MarketplaceProposal, 'id' | 'createdAt' | 'status'>) => {
    const created: MarketplaceProposal = {
      ...newProp,
      id: `prop-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProposals(prev => {
      const next = [created, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_proposals`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('proposals', created.id, created);
    setJobs(prev => {
      const next = prev.map(j => {
        if (j.id === newProp.jobId) {
          const updated = { ...j, proposalsCount: (j.proposalsCount || 0) + 1 };
          syncDocToFirestore('jobs', j.id, updated);
          return updated;
        }
        return j;
      });
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });
  };

  const acceptProposalAndCreateOrder = (jobId: string, proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    const job = jobs.find(j => j.id === jobId);
    if (!prop || !job) return;

    setProposals(prev => prev.map(p => {
      if (p.jobId === jobId) {
        const item = { ...p, status: p.id === proposalId ? 'accepted' as const : 'rejected' as const };
        syncDocToFirestore('proposals', p.id, item);
        return item;
      }
      return p;
    }));
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const item = { ...j, status: 'in_progress' as const, assignedStaffId: prop.freelancerId, assignedStaffName: prop.freelancerName };
        syncDocToFirestore('jobs', j.id, item);
        return item;
      }
      return j;
    }));

    const order: MarketplaceOrder = {
      id: `ord-mkt-${Date.now()}`,
      type: 'job_order',
      jobId: job.id,
      title: job.title,
      category: job.category,
      buyerId: job.buyerId,
      buyerName: job.buyerName,
      buyerEmail: job.buyerEmail,
      buyerPhone: job.buyerPhone,
      sellerId: prop.freelancerId,
      sellerName: prop.freelancerName,
      sellerAvatar: prop.freelancerAvatar,
      isInternalStaff: prop.isAgencyStaff,
      packageType: 'Custom',
      amount: prop.bidAmount,
      adminCommission: Math.round(prop.bidAmount * 0.1),
      sellerPayout: Math.round(prop.bidAmount * 0.9),
      paymentMethod: 'Escrow (bKash/Nagad)',
      transactionId: `TRX-MKT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'in_progress',
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + prop.deliveryDays * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => [order, ...prev]);
    syncDocToFirestore('marketplaceOrders', order.id, order);
  };

  const createDirectGigOrder = (
    gigId: string,
    packageType: 'basic' | 'standard' | 'premium',
    customNote?: string,
    buyerDetails?: { name?: string; email?: string; phone?: string; paymentMethod?: string; transactionId?: string }
  ) => {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return null;

    const pkg = gig.packages[packageType] || gig.packages.standard || gig.packages.basic;
    const buyerName = buyerDetails?.name || currentUser?.name || 'সম্মানিত ক্লায়েন্ট';
    const buyerEmail = buyerDetails?.email || currentUser?.email || 'client@ptenit.com';
    const buyerPhone = buyerDetails?.phone || currentUser?.mobile || currentUser?.phone || '01700000000';
    const buyerId = currentUser?.id || `guest-${Date.now()}`;

    const order: MarketplaceOrder = {
      id: `ord-mkt-${Date.now()}`,
      type: 'gig_order',
      gigId: gig.id,
      title: gig.title,
      category: gig.category,
      buyerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      sellerId: gig.sellerId,
      sellerName: gig.sellerName,
      sellerAvatar: gig.sellerAvatar,
      isInternalStaff: gig.isAgencyStaff,
      packageType: packageType === 'basic' ? 'Basic' : packageType === 'standard' ? 'Standard' : 'Premium',
      amount: pkg.price,
      adminCommission: Math.round(pkg.price * 0.1),
      sellerPayout: Math.round(pkg.price * 0.9),
      paymentMethod: buyerDetails?.paymentMethod || 'Escrow (bKash/Nagad)',
      transactionId: buyerDetails?.transactionId || `TRX-GIG-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      deliveryNote: customNote,
      createdAt: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + pkg.deliveryDays * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => {
      const next = [order, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('marketplaceOrders', order.id, order);
    setGigs(prev => {
      const next = prev.map(g => {
        if (g.id === gigId) {
          const item = { ...g, salesCount: (g.salesCount || 0) + 1 };
          syncDocToFirestore('gigs', gigId, item);
          return item;
        }
        return g;
      });
      localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(next));
      return next;
    });

    // Auto-feed into Company Bills ledger for Admin financial tracking
    const mktBillItem: CompanyBillItem = {
      id: `BILL-MKT-${order.id.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6)}`,
      payerName: buyerName,
      payerPhone: buyerPhone,
      gateway: (buyerDetails?.paymentMethod?.includes('Nagad') ? 'Nagad' : buyerDetails?.paymentMethod?.includes('Rocket') ? 'Rocket' : 'bKash') as any,
      transactionId: order.transactionId,
      amount: pkg.price,
      category: `গিগ অর্ডার ডিপোজিট: ${gig.title}`,
      status: 'pending',
      date: new Date().toLocaleString('bn-BD', { hour12: true }),
      note: `মার্কেটপ্লেস অর্ডার #${order.id} (সেলার: ${gig.sellerName})`
    };
    setCompanyBills(prev => {
      const next = [mktBillItem, ...prev.filter(b => b.id !== mktBillItem.id)];
      localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('companyBills', mktBillItem.id, mktBillItem);

    // Send notifications & direct messages targeted to Marketplace & Admin
    const sellerNotif: NotificationItem = {
      id: `notif-${Date.now()}-seller`,
      title: '🛒 নতুন মার্কেটপ্লেস গিগ অর্ডার!',
      message: `আপনার "${gig.title}" গিগটির একটি নতুন অর্ডার (৳${pkg.price}) প্লেস হয়েছে। (অর্ডার আইডি: #${order.id})`,
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientId: gig.instructorId || (gig as any).sellerId,
      recipientEmail: gig.instructorEmail || (gig as any).sellerEmail,
      recipientRole: 'seller',
      mode: 'selling',
      targetTab: 'marketplace',
      targetId: order.id
    };

    const buyerNotif: NotificationItem = {
      id: `notif-${Date.now()}-buyer`,
      title: '🎉 অর্ডার নিশ্চিত করা হয়েছে!',
      message: `${gig.sellerName}-এর "${gig.title}" গিগে আপনার অর্ডার #${order.id} প্লেস হয়েছে। সেলারের সাথে চ্যাট করুন।`,
      time: 'এখনই',
      read: false,
      type: 'info',
      recipientId: currentUser?.id || order.buyerId,
      recipientEmail: currentUser?.email || order.buyerEmail,
      recipientRole: 'buyer',
      mode: 'buying',
      targetTab: 'marketplace',
      targetId: order.id
    };

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-admin`,
      title: '🛒 নতুন গিগ অর্ডার প্রাপ্তি (এডমিন)!',
      message: `${buyerName} (${buyerPhone}) "${gig.title}" গিগে ৳${pkg.price} মূল্যের নতুন অর্ডার #${order.id} প্লেস করেছেন।`,
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientRole: 'admin',
      recipientId: 'admin',
      targetTab: 'admin',
      targetId: order.id
    };

    setNotifications(prev => {
      const next = [adminNotif, sellerNotif, buyerNotif, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('notifications', sellerNotif.id, sellerNotif);
    syncDocToFirestore('notifications', buyerNotif.id, buyerNotif);
    syncDocToFirestore('notifications', adminNotif.id, adminNotif);

    setDirectMessages(prev => [
      {
        id: `dmsg-${Date.now()}`,
        senderId: currentUser?.id || `user-cust-${Date.now()}`,
        senderEmail: currentUser?.email,
        senderName: `${buyerName} (বায়ার)`,
        senderRole: 'customer',
        senderAvatar: currentUser?.avatar,
        recipientId: gig.instructorId || (gig as any).sellerId || 'seller-1',
        recipientEmail: gig.instructorEmail || (gig as any).sellerEmail,
        recipientRole: 'instructor',
        text: `সালাম! আমি "${gig.title}" এর ${pkg.name || packageType} প্যাকেজটি (৳${pkg.price}) প্লেস করেছি। (অর্ডার আইডি: #${order.id})।`,
        time: 'এখনই',
        read: false,
        orderId: order.id,
        targetTab: 'marketplace'
      },
      ...prev
    ]);

    return order;
  };

  const deliverMarketplaceOrder = (orderId: string, note: string, fileUrl?: string, fileName?: string) => {
    let targetBuyerId = '';
    let targetBuyerEmail = '';
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        targetBuyerId = o.buyerId || '';
        targetBuyerEmail = o.buyerEmail || '';
        const item = {
          ...o,
          status: 'in_review' as const,
          deliveryNote: note,
          deliveryFileUrl: fileUrl,
          deliveryFileName: fileName,
          deliveredAt: new Date().toISOString().split('T')[0]
        };
        syncDocToFirestore('marketplaceOrders', orderId, item);
        return item;
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '📦 অর্ডার ডেলিভারি সম্পন্ন হয়েছে!',
        message: `অর্ডার ID #${orderId} সফলভাবে ডেলিভারি করা হয়েছে। রিভিউ চেক করুন।`,
        time: 'এখনই',
        read: false,
        type: 'info',
        recipientId: targetBuyerId,
        recipientEmail: targetBuyerEmail,
        recipientRole: 'buyer',
        mode: 'buying',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const requestOrderRevision = (orderId: string, note: string) => {
    let targetSellerId = '';
    let targetSellerEmail = '';
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        targetSellerId = o.sellerId || '';
        targetSellerEmail = o.sellerEmail || '';
        const item = { ...o, status: 'revision_requested' as const, revisionNote: note };
        syncDocToFirestore('marketplaceOrders', orderId, item);
        return item;
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🔄 রিভিশন রিকোয়েস্ট জমা পড়েছে',
        message: `অর্ডার ID #${orderId} এর রিভিশন রিকোয়েস্ট এসেছে: "${note}"`,
        time: 'এখনই',
        read: false,
        type: 'warning',
        recipientId: targetSellerId,
        recipientEmail: targetSellerEmail,
        recipientRole: 'seller',
        mode: 'selling',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const approveOrderAndReleaseEscrow = (
    orderId: string,
    rating = 5,
    reviewComment?: string,
    paymentInfo?: { method?: string; transactionId?: string; senderPhone?: string }
  ) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const bonus = o.sellerReviewBonus || 0;
        const currentPayout = o.sellerPayout || Math.round((o.amount || 0) * 0.9);
        const finalPayout = currentPayout + bonus;
        const item = {
          ...o,
          status: 'completed' as const,
          rating,
          reviewComment,
          sellerPayout: finalPayout,
          ...(paymentInfo?.method ? { paymentMethod: paymentInfo.method } : {}),
          ...(paymentInfo?.transactionId ? { transactionId: paymentInfo.transactionId } : {}),
          ...(paymentInfo?.senderPhone ? { buyerPhone: paymentInfo.senderPhone } : {}),
          isWorkFirstPaid: true,
          paidAt: new Date().toISOString()
        };
        syncDocToFirestore('marketplaceOrders', orderId, item);
        return item;
      }
      return o;
    }));

    const matchedOrd = marketplaceOrders.find(o => o.id === orderId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: paymentInfo?.transactionId ? '🎉 প্রজেক্ট কমপ্লিট & বকেয়া বিল পরিশোধ সম্পন্ন!' : '🎉 প্রজেক্ট কমপ্লিট & এস্ক্রো পেমেন্ট রিলিজ!',
        message: paymentInfo?.transactionId
          ? `অর্ডার ID #${orderId} এর বকেয়া বিল (TrxID: ${paymentInfo.transactionId}) সফলভাবে পরিশোধ ও ফান্ড রিলিজ করা হয়েছে। সেলার তার ওয়ালেটে পেআউট পেয়েছেন। (রেটিং: ${rating}★)`
          : `অর্ডার ID #${orderId} সফলভাবে সম্পন্ন হয়েছে এবং ফান্ড রিলিজ করা হয়েছে। (রেটিং: ${rating}★)`,
        time: 'এখনই',
        read: false,
        type: 'success',
        recipientId: matchedOrd?.sellerId,
        recipientEmail: matchedOrd?.sellerEmail,
        recipientRole: 'seller',
        mode: 'selling',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const cancelMarketplaceOrder = (orderId: string, reason?: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const item = { ...o, status: 'cancelled' as const, revisionNote: reason };
        syncDocToFirestore('marketplaceOrders', orderId, item);
        return item;
      }
      return o;
    }));

    const matchedOrd = marketplaceOrders.find(o => o.id === orderId);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '❌ প্রজেক্ট অর্ডার বাতিল করা হয়েছে',
        message: `অর্ডার ID #${orderId} বাতিল করা হয়েছে। কারণ: ${reason || 'পারস্পরিক সম্মতি'}`,
        time: 'এখনই',
        read: false,
        type: 'warning',
        recipientId: matchedOrd?.buyerId || matchedOrd?.sellerId,
        recipientEmail: matchedOrd?.buyerEmail || matchedOrd?.sellerEmail,
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const updateMarketplaceOrderStatus = (orderId: string, status: MarketplaceOrder['status'], updateNote?: string) => {
    let targetBuyerId = '';
    let targetBuyerEmail = '';
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderId) {
          targetBuyerId = o.buyerId || '';
          targetBuyerEmail = o.buyerEmail || '';
          const newUpdates = updateNote ? [
            ...(o.updates || []),
            { id: `upd-${Date.now()}`, date: new Date().toLocaleString('bn-BD', { hour12: true }), note: updateNote, sender: currentUser?.name || 'Seller' }
          ] : (o.updates || []);
          const item = {
            ...o,
            status,
            updates: newUpdates
          };
          syncDocToFirestore('marketplaceOrders', orderId, item);
          return item;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📦 অর্ডার স্ট্যাটাস আপডেট: ${status === 'in_progress' ? 'কাজ শুরু করা হয়েছে' : status}`,
        message: `অর্ডার ID #${orderId} এর স্ট্যাটাস আপডেট করা হয়েছে। ${updateNote ? `নোট: ${updateNote}` : ''}`,
        time: 'এখনই',
        read: false,
        type: 'info',
        recipientId: targetBuyerId,
        recipientEmail: targetBuyerEmail,
        recipientRole: 'buyer',
        mode: 'buying',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const addMarketplaceOrder = (order: MarketplaceOrder) => {
    setMarketplaceOrders(prev => {
      const next = [order, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('marketplaceOrders', order.id, order);

    // Ensure buyer user is recorded in users collection
    if (order.buyerEmail || order.buyerPhone || order.buyerName) {
      const buyerId = order.buyerId || `buyer-${Date.now()}`;
      const existingUser = users.find(u => u.id === buyerId || (order.buyerEmail && u.email.toLowerCase() === order.buyerEmail.toLowerCase()));
      if (!existingUser) {
        const newBuyer: User = {
          id: buyerId,
          name: order.buyerName || 'সম্মানিত ক্লায়েন্ট',
          email: order.buyerEmail || `client-${Date.now()}@ptenit.com`,
          mobile: order.buyerPhone || '01700000000',
          role: 'customer',
          roles: ['customer'],
          activeRole: 'customer',
          marketplaceMode: 'buying',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => {
          const next = [newBuyer, ...prev];
          localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
          return next;
        });
        syncDocToFirestore('users', buyerId, newBuyer);
      }
    }

    // Central Notification for Admin
    const adminNotifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🛍️ নতুন ডিজিটাল/মার্কেটপ্লেস অর্ডার #${order.id}`,
      message: `${order.buyerName} (${order.buyerPhone || ''}) "${order.title}" অর্ডার করেছেন (৳${order.amount})।`,
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientRole: 'admin',
      recipientId: 'admin',
      targetTab: 'admin',
      targetId: order.id
    };

    // Confirmation Notification for Buyer
    const buyerNotifItem: NotificationItem = {
      id: `notif-buyer-${Date.now()}`,
      title: `🛍️ অর্ডার সম্পন্ন #${order.id}`,
      message: `আপনার "${order.title}" অর্ডারটি সফল হয়েছে (৳${order.amount})।`,
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientId: order.buyerId,
      recipientEmail: order.buyerEmail,
      recipientRole: 'buyer',
      mode: 'buying',
      targetTab: 'marketplace',
      targetId: order.id
    };

    setNotifications(prev => {
      const next = [buyerNotifItem, adminNotifItem, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('notifications', adminNotifItem.id, adminNotifItem);
    syncDocToFirestore('notifications', buyerNotifItem.id, buyerNotifItem);
    playAppSound('order');
  };

  const dispatchJobToStaff = (jobId: string, staffId: string, staffName: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const item = { ...j, status: 'assigned' as const, visibility: 'custom_assigned' as const, assignedStaffId: staffId, assignedStaffName: staffName };
        syncDocToFirestore('jobs', j.id, item);
        return item;
      }
      return j;
    }));

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const order: MarketplaceOrder = {
        id: `ord-mkt-${Date.now()}`,
        type: 'custom_agency_order',
        jobId: job.id,
        title: job.title,
        category: job.category,
        buyerId: job.buyerId,
        buyerName: job.buyerName,
        buyerEmail: job.buyerEmail,
        buyerPhone: job.buyerPhone,
        sellerId: staffId,
        sellerName: staffName,
        isInternalStaff: true,
        packageType: 'Custom',
        amount: job.budget,
        adminCommission: Math.round(job.budget * 0.1),
        sellerPayout: Math.round(job.budget * 0.9),
        status: 'in_progress',
        createdAt: new Date().toISOString().split('T')[0],
        deadlineDate: new Date(Date.now() + (job.deadlineDays || 7) * 86400000).toISOString().split('T')[0]
      };
      setMarketplaceOrders(prev => [order, ...prev]);
      syncDocToFirestore('marketplaceOrders', order.id, order);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => {
      const next = prev.filter(u => u.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('users', id);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('orders', id);
  };

  const deleteJob = (id: string) => {
    setJobs(prev => {
      const next = prev.filter(j => j.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('jobs', id);
  };

  const deleteMarketplaceOrder = (id: string) => {
    setMarketplaceOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });
    setCustomerProjects(prev => {
      const next = prev.filter(p => p.id !== id && `ord-${p.id}` !== id && `ord-ptenit-${p.id}` !== id);
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('marketplaceOrders', id);
  };

  const updateMarketplaceOrder = (id: string, updates: Partial<MarketplaceOrder>) => {
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === id) {
          const item = { ...o, ...updates };
          syncDocToFirestore('marketplaceOrders', id, item);
          return item;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });
  };

  const acceptDirectOffer = (orderIdOrProjectId: string) => {
    // 1. Update marketplaceOrders
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId || (orderIdOrProjectId.startsWith('proj-') && o.id.includes(orderIdOrProjectId.replace('proj-', '')))) {
          const updated = {
            ...o,
            status: 'in_progress' as const,
            isAccepted: true
          };
          syncDocToFirestore('marketplaceOrders', o.id, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    // 2. Update customerProjects
    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === orderIdOrProjectId || (orderIdOrProjectId.startsWith('ord-') && orderIdOrProjectId.includes(p.id.replace('proj-', '')))) {
          const updated = {
            ...p,
            status: 'In Progress' as const,
            updatedAt: new Date().toISOString()
          };
          syncDocToFirestore('customerProjects', p.id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });

    // 3. Update jobs if any
    setJobs(prev => {
      const next = prev.map(j => {
        if (j.id === orderIdOrProjectId) {
          const updated = {
            ...j,
            status: 'in_progress' as const
          };
          syncDocToFirestore('jobs', j.id, updated);
          return updated;
        }
        return j;
      });
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });

    // Notify buyer
    const targetOrder = marketplaceOrders.find(o => o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId);
    const notif: NotificationItem = {
      id: `notif-acc-${Date.now()}`,
      title: '🎉 ডিরেক্ট প্রজেক্ট অফার গৃহীত হয়েছে!',
      message: 'সেলার আপনার পাঠানো ২৪ ঘণ্টার ব্যক্তিগত অফারটি গ্রহণ করেছেন এবং কাজ শুরু করেছেন। ফান্ড এস্ক্রোতে সুরক্ষিত।',
      time: 'এখনই',
      read: false,
      type: 'success',
      recipientId: targetOrder?.buyerId,
      recipientEmail: targetOrder?.buyerEmail,
      recipientRole: 'buyer',
      mode: 'buying',
      targetTab: 'my-orders'
    };
    setNotifications(prev => [notif, ...prev]);
    syncDocToFirestore('notifications', notif.id, notif);
    playAppSound('order');
  };

  const declineDirectOffer = (orderIdOrProjectId: string, reason?: string) => {
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId || (orderIdOrProjectId.startsWith('proj-') && o.id.includes(orderIdOrProjectId.replace('proj-', '')))) {
          const updated = {
            ...o,
            status: 'cancelled' as const,
            isExpiredReturned: true,
            cancelledReason: reason || 'সেলার অফারটি প্রত্যাখ্যান করেছেন (Declined)',
            cancelledAt: new Date().toISOString()
          };
          syncDocToFirestore('marketplaceOrders', o.id, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === orderIdOrProjectId || (orderIdOrProjectId.startsWith('ord-') && orderIdOrProjectId.includes(p.id.replace('proj-', '')))) {
          const updated = {
            ...p,
            status: 'Cancelled' as const,
            isExpiredReturned: true,
            updatedAt: new Date().toISOString()
          };
          syncDocToFirestore('customerProjects', p.id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });

    playAppSound('notification');
  };

  const updateDirectOffer = (orderIdOrProjectId: string, updates: {
    title?: string;
    budget?: number;
    budgetRange?: string;
    deliveryDays?: number;
    description?: string;
  }) => {
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId || (orderIdOrProjectId.startsWith('proj-') && o.id.includes(orderIdOrProjectId.replace('proj-', '')))) {
          const updated = {
            ...o,
            title: updates.title || o.title,
            amount: updates.budget || o.amount,
            budgetRange: updates.budgetRange || o.budgetRange,
            deliveryDays: updates.deliveryDays || o.deliveryDays,
            deliveryNote: updates.description || o.deliveryNote,
            updatedAt: new Date().toISOString()
          };
          syncDocToFirestore('marketplaceOrders', o.id, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === orderIdOrProjectId || (orderIdOrProjectId.startsWith('ord-') && orderIdOrProjectId.includes(p.id.replace('proj-', '')))) {
          const updated = {
            ...p,
            serviceTitle: updates.title || p.serviceTitle,
            priceEstimate: updates.budget || p.priceEstimate,
            budgetRange: updates.budgetRange || p.budgetRange,
            description: updates.description || p.description,
            updatedAt: new Date().toISOString()
          };
          syncDocToFirestore('customerProjects', p.id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });

    playAppSound('notification');
  };

  const publishDirectProjectToPublicFeed = (orderIdOrProjectId: string) => {
    // 1. Update customerProjects: remove targetSellerId, set isDirectOffer: false, isPublicOffer: true, isExpiredReturned: false, status: 'Pending Review'
    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === orderIdOrProjectId || (orderIdOrProjectId.startsWith('ord-') && orderIdOrProjectId.includes(p.id.replace('proj-', '')))) {
          const updated = {
            ...p,
            isDirectOffer: false,
            isPublicOffer: true,
            isExpiredReturned: false,
            status: 'Pending Review' as const,
            targetSellerId: undefined,
            targetSellerName: undefined,
            updatedAt: new Date().toISOString()
          };
          syncDocToFirestore('customerProjects', p.id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });

    // 2. Update marketplaceOrders: set isDirectOffer: false, isPublicOffer: true, isExpiredReturned: false, status: 'pending_approval'
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId || (orderIdOrProjectId.startsWith('proj-') && o.id.includes(orderIdOrProjectId.replace('proj-', '')))) {
          const updated = {
            ...o,
            isDirectOffer: false,
            isPublicOffer: true,
            isExpiredReturned: false,
            status: 'pending_approval' as const,
            targetSellerId: undefined,
            targetSellerName: undefined,
            cancelledReason: undefined,
            cancelledAt: undefined
          };
          syncDocToFirestore('marketplaceOrders', o.id, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    // 3. Update jobs if any
    setJobs(prev => {
      const next = prev.map(j => {
        if (j.id === orderIdOrProjectId) {
          const updated = {
            ...j,
            isDirectOffer: false,
            visibility: 'public' as const,
            isExpiredReturned: false,
            status: 'open' as const,
            targetSellerId: undefined,
            targetSellerName: undefined
          };
          syncDocToFirestore('jobs', j.id, updated);
          return updated;
        }
        return j;
      });
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(next));
      return next;
    });

    // 4. Create public broadcast notification for all sellers
    const publicNotif: NotificationItem = {
      id: `notif-pub-${Date.now()}`,
      title: '📢 নতুন পাবলিক অফার পোস্ট লাইভ',
      message: 'একজন বায়ারের প্রজেক্ট পাবলিক নিউজ ফিডে এবং লাইভ অফার রাডারে উন্মুক্ত হয়েছে!',
      time: 'এখনই',
      read: false,
      type: 'info',
      recipientRole: 'seller',
      mode: 'selling',
      targetTab: 'seller_feed'
    };
    setNotifications(prev => [publicNotif, ...prev]);
    playAppSound('order');
  };

  const resendDirectOffer24h = (orderIdOrProjectId: string) => {
    const newExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    setMarketplaceOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderIdOrProjectId || o.jobId === orderIdOrProjectId || (orderIdOrProjectId.startsWith('proj-') && o.id.includes(orderIdOrProjectId.replace('proj-', '')))) {
          const updated = {
            ...o,
            status: 'pending_approval' as const,
            expiresAt: newExpiresAt,
            isExpiredReturned: false,
            createdAt: new Date().toISOString(),
            cancelledReason: undefined,
            cancelledAt: undefined
          };
          syncDocToFirestore('marketplaceOrders', o.id, updated);
          return updated;
        }
        return o;
      });
      localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(next));
      return next;
    });

    setCustomerProjects(prev => {
      const next = prev.map(p => {
        if (p.id === orderIdOrProjectId || (orderIdOrProjectId.startsWith('ord-') && orderIdOrProjectId.includes(p.id.replace('proj-', '')))) {
          const updated = {
            ...p,
            status: 'Pending Review' as const,
            expiresAt: newExpiresAt,
            isExpiredReturned: false,
            createdAt: new Date().toISOString().split('T')[0]
          };
          syncDocToFirestore('customerProjects', p.id, updated);
          return updated;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(next));
      return next;
    });

    playAppSound('order');
  };

  const addDigitalProduct = (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount'>) => {
    const newProd: DigitalProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDigitalProducts(prev => {
      const next = [newProd, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_digital_products`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('digitalProducts', newProd.id, newProd);
  };

  const updateDigitalProduct = (id: string, updatedFields: Partial<DigitalProduct>) => {
    setDigitalProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          const item = { ...p, ...updatedFields };
          syncDocToFirestore('digitalProducts', id, item);
          return item;
        }
        return p;
      });
      localStorage.setItem(`${STORAGE_KEY}_digital_products`, JSON.stringify(next));
      return next;
    });
  };

  const deleteDigitalProduct = (id: string) => {
    setDigitalProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_digital_products`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('digitalProducts', id);
  };

  const deleteTeacherPayout = (id: string) => {
    setPayouts(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('payouts', id);
  };

  const deleteTeacherNotice = (id: string) => {
    setTeacherNotices(prev => {
      const next = prev.filter(n => n.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_teacher_notices`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('teacherNotices', id);
  };

  const addLiveSession = (session: Omit<LiveClassSession, 'id' | 'createdAt'>) => {
    const newSession: LiveClassSession = {
      ...session,
      id: `live-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setLiveSessions(prev => {
      const next = [newSession, ...prev];
      localStorage.setItem(`${STORAGE_KEY}_live_sessions`, JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('liveSessions', newSession.id, newSession);
  };

  const updateLiveSession = (id: string, updatedFields: Partial<LiveClassSession>) => {
    setLiveSessions(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          const item = { ...s, ...updatedFields };
          syncDocToFirestore('liveSessions', id, item);
          return item;
        }
        return s;
      });
      localStorage.setItem(`${STORAGE_KEY}_live_sessions`, JSON.stringify(next));
      return next;
    });
  };

  const deleteLiveSession = (id: string) => {
    setLiveSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(`${STORAGE_KEY}_live_sessions`, JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('liveSessions', id);
  };

  const addCompanyBill = (bill: CompanyBillItem) => {
    setCompanyBills(prev => {
      const filtered = prev.filter(b => b.id !== bill.id && b.transactionId !== bill.transactionId);
      const next = [bill, ...filtered];
      localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
      return next;
    });
    syncDocToFirestore('companyBills', bill.id, bill);
  };

  const verifyCompanyBill = (billId: string, verifiedBy?: string) => {
    setCompanyBills(prev => {
      const next = prev.map(b => {
        if (b.id === billId) {
          const item: CompanyBillItem = {
            ...b,
            status: 'verified' as const,
            verifiedAt: new Date().toLocaleString('bn-BD', { hour12: true })
          };
          syncDocToFirestore('companyBills', billId, item);
          return item;
        }
        return b;
      });
      localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
      return next;
    });
  };

  const rejectCompanyBill = (billId: string, reason?: string) => {
    setCompanyBills(prev => {
      const next = prev.map(b => {
        if (b.id === billId) {
          const item: CompanyBillItem = {
            ...b,
            status: 'rejected' as const,
            note: reason ? `${b.note || ''} [বাতিলের কারণ: ${reason}]` : b.note
          };
          syncDocToFirestore('companyBills', billId, item);
          return item;
        }
        return b;
      });
      localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
      return next;
    });
  };

  const deleteCompanyBill = (billId: string) => {
    setCompanyBills(prev => {
      const next = prev.filter(b => b.id !== billId);
      localStorage.setItem('ptenit_company_bills', JSON.stringify(next));
      return next;
    });
    deleteDocFromFirestore('companyBills', billId);
  };

  const clearSampleVouchers = () => {
    setCompanyBills(prev => {
      // Keep only live non-sample items
      const liveOnly = prev.filter(b => !b.id.startsWith('BILL-1001') && !b.id.startsWith('BILL-1002') && !b.id.startsWith('BILL-1003') && !b.id.startsWith('BILL-1004'));
      localStorage.setItem('ptenit_company_bills', JSON.stringify(liveOnly));
      return liveOnly;
    });
  };

  // User Data Isolation & Strict Scoping:
  // Admin sees all records across the platform.
  // Regular users (students, clients, sellers) ONLY see their own records.
  // New accounts or unauthenticated users see 0 orders/projects/notifs.
  const isAdmin = currentUser?.role === 'admin' || Boolean(currentUser?.roles?.includes('admin'));

  const scopedOrders = useMemo(() => {
    if (isAdmin) return orders;
    if (!currentUser) return [];
    return orders.filter(o => 
      o.userId === currentUser.id ||
      (currentUser.email && (o as any).userEmail && (o as any).userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && (o as any).senderPhone && (o as any).senderPhone.trim() === currentUser.mobile.trim())
    );
  }, [orders, currentUser, isAdmin]);

  const scopedMarketplaceOrders = useMemo(() => {
    if (isAdmin) return marketplaceOrders;
    if (!currentUser) return [];
    return marketplaceOrders.filter(o => 
      o.buyerId === currentUser.id ||
      o.sellerId === currentUser.id ||
      (o as any).customerId === currentUser.id ||
      (currentUser.email && o.buyerEmail && o.buyerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.email && o.sellerEmail && o.sellerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && (o as any).buyerPhone && (o as any).buyerPhone.trim() === currentUser.mobile.trim()) ||
      (currentUser.name && o.assignedExpert && o.assignedExpert.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    );
  }, [marketplaceOrders, currentUser, isAdmin]);

  const scopedNotifications = useMemo(() => {
    if (isAdmin) return notifications;
    if (!currentUser) return [];
    return notifications.filter(n => {
      // Exclude admin alerts from non-admins
      if (n.recipientRole === 'admin' || n.targetTab === 'admin' || n.recipientId === 'admin') return false;
      // Scoped to this user
      if (n.recipientId && n.recipientId === currentUser.id) return true;
      if (currentUser.email && n.recipientEmail && n.recipientEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
      // General official broadcast announcement
      if (n.isBroadcast && n.recipientId === 'broadcast') return true;
      return false;
    });
  }, [notifications, currentUser, isAdmin]);

  const scopedDirectMessages = useMemo(() => {
    if (isAdmin) return directMessages;
    if (!currentUser) return [];
    return directMessages.filter(dm => 
      dm.recipientId === currentUser.id ||
      dm.senderId === currentUser.id ||
      (currentUser.email && dm.recipientEmail && dm.recipientEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.email && dm.senderEmail && dm.senderEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    );
  }, [directMessages, currentUser, isAdmin]);

  const scopedContactMessages = useMemo(() => {
    if (isAdmin) return contactMessages;
    if (!currentUser) return [];
    return contactMessages.filter(m => 
      (m as any).userId === currentUser.id ||
      (currentUser.email && m.email && m.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && m.phone && m.phone.trim() === currentUser.mobile.trim())
    );
  }, [contactMessages, currentUser, isAdmin]);

  const scopedCustomerProjects = useMemo(() => {
    if (isAdmin) return customerProjects;
    if (!currentUser) return [];
    return customerProjects.filter(p => 
      p.customerId === currentUser.id ||
      (currentUser.email && p.customerEmail && p.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.mobile && p.customerPhone && p.customerPhone.trim() === currentUser.mobile.trim())
    );
  }, [customerProjects, currentUser, isAdmin]);

  const scopedEnrollments = useMemo(() => {
    if (isAdmin) return enrollments;
    if (!currentUser) return [];
    return enrollments.filter(e => 
      e.userId === currentUser.id ||
      e.studentId === currentUser.id ||
      (currentUser.email && (e as any).userEmail && (e as any).userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    );
  }, [enrollments, currentUser, isAdmin]);

  const scopedCertificates = useMemo(() => {
    if (isAdmin) return certificates;
    if (!currentUser) return [];
    return certificates.filter(c => 
      c.studentId === currentUser.id ||
      (currentUser.email && (c as any).studentEmail && (c as any).studentEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    );
  }, [certificates, currentUser, isAdmin]);

  return (
    <DataContext.Provider
      value={{
        lang,
        setLang,
        t,
        darkMode,
        toggleDarkMode,
        currentUser,
        ptenitUser,
        marketplaceUser,
        setPtenitUser,
        setMarketplaceUser,
        loginMarketplace,
        signupMarketplace,
        logoutMarketplace,
        demoLoginMarketplace,
        updateMarketplaceProfile,
        users,
        courses,
        services,
        gallery,
        testimonials,
        enrollments: scopedEnrollments,
        certificates: scopedCertificates,
        offers,
        siteSettings,
        orders: scopedOrders,
        contactMessages: scopedContactMessages,
        notifications: scopedNotifications,
        directMessages: scopedDirectMessages,
        activeChatWindows,
        activeMessengerConversationId,
        setActiveMessengerConversationId,
        activeMessengerOrderId,
        setActiveMessengerOrderId,
        isMessengerInboxOpen,
        setIsMessengerInboxOpen,
        initialMessengerTab,
        openMessengerInbox,
        closeMessengerInbox,
        marketplaceMode,
        setMarketplaceMode,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        clearAllNotifications,
        deleteNotification,
        assignments,
        submissions,
        customerProjects: scopedCustomerProjects,
        payouts,
        teacherNotices,
        gigs,
        jobs,
        proposals,
        marketplaceOrders: scopedMarketplaceOrders,
        digitalProducts,
        addDigitalProduct,
        updateDigitalProduct,
        deleteDigitalProduct,
        liveSessions,
        addLiveSession,
        updateLiveSession,
        deleteLiveSession,
        createGig,
        updateGig,
        deleteGig,
        createJob,
        updateJobStatus,
        submitProposal,
        acceptProposalAndCreateOrder,
        createDirectGigOrder,
        deliverMarketplaceOrder,
        requestOrderRevision,
        approveOrderAndReleaseEscrow,
        cancelMarketplaceOrder,
        updateMarketplaceOrderStatus,
        addMarketplaceOrder,
        dispatchJobToStaff,
        login,
        loginWithGoogle,
        loginWithGoogleDirect,
        signup,
        logout,
        demoLogin,
        switchRole,
        updateProfile,
        addUser,
        updateUser,
        deleteUser,
        deleteOrder,
        deleteJob,
        deleteMarketplaceOrder,
        updateMarketplaceOrder,
        acceptDirectOffer,
        declineDirectOffer,
        updateDirectOffer,
        publishDirectProjectToPublicFeed,
        resendDirectOffer24h,
        deleteTeacherPayout,
        deleteTeacherNotice,
        requestTeacherPayout,
        updatePayoutStatus,
        sendTeacherNotice,
        addAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        updateSubmissionStatus,
        deleteSubmission,
        updateSubmission,
        createCustomerProject,
        updateCustomerProjectStatus,
        addCourse,
        updateCourse,
        deleteCourse,
        acceptCourseOffer,
        declineCourseOffer,
        enrollCourse,
        updateLessonProgress,
        addService,
        updateService,
        deleteService,
        addGalleryItem,
        deleteGalleryItem,
        addTestimonial,
        deleteTestimonial,
        updateOffers,
        updateSiteSettings,
        issueCertificate,
        getCertificateByCode,
        updateOrderStatus,
        sendContactMessage,
        markMessageRead,
        markNotificationRead,
        markAllNotificationsRead,
        sendCentralNotification,
        applyForMentorship,
        approveMentorApplication,
        rejectMentorApplication,
        rightColumnView,
        setRightColumnView,
        readConversationIds,
        markConversationRead,
        markAllConversationsRead,
        markDirectMessageRead,
        markAllDirectMessagesRead,
        sendDirectMessage,
        openChatWindow,
        closeChatWindow,
        toggleMinimizeChatWindow,
        sendChatMessage,
        createGoogleMeetCall,
        inAppMeetState,
        openInAppMeet,
        closeInAppMeet,
        googleMeetModalState,
        openGoogleMeetModal,
        closeGoogleMeetModal,
        toggleUserBlock,
        restrictUser,
        unrestrictUser,
        playAppSound,
        isOfferSoundEnabled,
        toggleOfferSound,
        companyBills,
        addCompanyBill,
        verifyCompanyBill,
        rejectCompanyBill,
        deleteCompanyBill,
        clearSampleVouchers
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
