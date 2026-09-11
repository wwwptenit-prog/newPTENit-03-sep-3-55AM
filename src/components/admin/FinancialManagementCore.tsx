import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Download,
  Copy,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Smartphone,
  Zap,
  RefreshCw,
  FileText,
  Check,
  ExternalLink,
  Eye,
  AlertCircle,
  TrendingUp,
  Send,
  Calendar,
  Users,
  BookOpen,
  ShoppingBag,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export interface CompanyBillItem {
  id: string;
  payerName: string;
  payerPhone: string;
  gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card' | 'Cash';
  transactionId: string;
  amount: number;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  date: string;
  note?: string;
  memoUrl?: string;
}

export interface UnifiedTransaction {
  id: string;
  invoiceNo: string;
  type: 'course' | 'gig' | 'digital' | 'company_bill' | 'payout';
  typeName: string;
  title: string;
  partyName: string;
  partyPhone?: string;
  partyEmail?: string;
  partyRole?: string;
  amount: number;
  flow: 'inflow' | 'outflow';
  gateway: string;
  accountNumber?: string;
  transactionId: string;
  date: string;
  status: 'verified' | 'pending' | 'rejected' | 'in_progress';
  statusLabel: string;
  adminCommission?: number;
  sellerPayout?: number;
  escrowHold?: boolean;
  note?: string;
  memoUrl?: string;
  rawItem?: any;
}

interface FinancialManagementCoreProps {
  initialTab?: 'all_transactions' | 'invoices_bills' | 'payout_requests' | 'mfs_accounts';
  companyBills?: any[];
  setCompanyBills?: React.Dispatch<React.SetStateAction<any[]>>;
  onVerifySingleBill?: (id: string) => void;
  onVerifyAllBills?: () => void;
  onCreateBill?: (bill: any) => void;
  onRejectBill?: (id: string) => void;
  onApproveAllMentors?: () => void;
}

export const FinancialManagementCore: React.FC<FinancialManagementCoreProps> = ({
  initialTab,
  companyBills: propCompanyBills,
  setCompanyBills: propSetCompanyBills,
  onVerifySingleBill,
  onVerifyAllBills,
  onCreateBill,
  onRejectBill
}) => {
  const data = useData() as any;
  const {
    orders = [],
    marketplaceOrders = [],
    digitalProducts = [],
    payouts = [],
    updatePayoutStatus,
    users = [],
    courses = [],
    siteSettings = {},
    playAppSound,
    sendCentralNotification
  } = data || {};

  // Local fallback for company bills
  const [localBills, setLocalBills] = useState<CompanyBillItem[]>([
    {
      id: 'BILL-1001',
      payerName: 'মোঃ শফিকুল ইসলাম',
      payerPhone: '01712345678',
      gateway: 'bKash',
      transactionId: '8N7X9K2P',
      amount: 4750,
      category: 'এডভান্স পেমেন্ট - React Web App',
      status: 'pending',
      date: '2026-08-05 10:30 AM',
      note: 'মার্কেটপ্লেস কাস্টম অর্ডারের ৫০% এডভান্স বিল'
    },
    {
      id: 'BILL-1002',
      payerName: 'আরিফ উল্লাহ',
      payerPhone: '01898765432',
      gateway: 'Nagad',
      transactionId: 'NGD982310',
      amount: 999,
      category: 'কোর্স ফি - Digital Marketing Masterclass',
      status: 'verified',
      verifiedAt: '2026-08-05 09:15 AM',
      date: '2026-08-05 09:00 AM',
      note: 'পরিশোধিত কোর্স এনরোলমেন্ট বিল'
    },
    {
      id: 'BILL-1003',
      payerName: 'ক্লাউড ভিপিএস ও এডব্লিউএস হোস্টিং (Amazon Web Services)',
      payerPhone: '01911223344',
      gateway: 'Bank',
      transactionId: 'DBBL-AWS-9921',
      amount: 14500,
      category: 'ক্লাউড সার্ভার ও ডেটাবেজ অবকাঠামো',
      status: 'verified',
      verifiedAt: '2026-08-04 11:30 AM',
      date: '2026-08-04 11:00 AM',
      note: 'মাসিক ডেডিকেটেড ক্লাউড নোড হোস্টিং বিল'
    },
    {
      id: 'BILL-1004',
      payerName: 'প্যাক্সন ফাইবার ব্রডব্যান্ড (অফিস ইন্টারনেট)',
      payerPhone: '01722334455',
      gateway: 'bKash',
      transactionId: 'BK-NET-4421',
      amount: 3500,
      category: 'অফিস ইন্টারনেট ও ব্যান্ডউইথ',
      status: 'verified',
      verifiedAt: '2026-08-02 02:00 PM',
      date: '2026-08-02 01:30 PM',
      note: 'হেড অফিস ও লাইভ ক্লাস স্টুডিও ১৫০ এমবিপিএস সংযোগ'
    },
    {
      id: 'BILL-1005',
      payerName: 'কামরুল হাসান',
      payerPhone: '01655443322',
      gateway: 'Rocket',
      transactionId: 'RKT445566',
      amount: 2500,
      category: 'মার্কেটপ্লেস গিগ - UI/UX Design Token',
      status: 'pending',
      date: '2026-08-05 11:05 AM',
      note: 'এমএফএস রকেট এডভান্স বিল'
    }
  ]);

  const effectiveBills: CompanyBillItem[] = propCompanyBills || localBills;

  // Active Core Sub-Tab
  const [activeCoreTab, setActiveCoreTab] = useState<'all_transactions' | 'invoices_bills' | 'payout_requests' | 'mfs_accounts'>(initialTab || 'all_transactions');

  useEffect(() => {
    if (initialTab) {
      setActiveCoreTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'course' | 'gig' | 'digital' | 'company_bill' | 'payout'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Sub-filters for Bill Verification Tab
  const [billScope, setBillScope] = useState<'company_bills' | 'all_invoices'>('company_bills');
  const [billStatusSubFilter, setBillStatusSubFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [billSubSearch, setBillSubSearch] = useState('');

  // Modal States
  const [selectedVoucher, setSelectedVoucher] = useState<UnifiedTransaction | null>(null);
  const [addBillModalOpen, setAddBillModalOpen] = useState(false);
  const [payoutActionModal, setPayoutActionModal] = useState<{
    isOpen: boolean;
    payout: any | null;
    actionType: 'approve' | 'reject';
    trxIdInput: string;
    debitAccount: string;
    rejectionReason: string;
  }>({
    isOpen: false,
    payout: null,
    actionType: 'approve',
    trxIdInput: '',
    debitAccount: 'bKash-merchant',
    rejectionReason: 'ভুল পেমেন্ট একাউন্ট নম্বর'
  });

  // New Bill Form State
  const [newBillForm, setNewBillForm] = useState<{
    title: string;
    category: string;
    payerName: string;
    payerPhone: string;
    gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
    transactionId: string;
    amount: number;
    status: 'pending' | 'verified';
    note: string;
    memoUrl: string;
  }>({
    title: '',
    category: 'অফিস ভাড়া ও ইউটিলিটি',
    payerName: '',
    payerPhone: '',
    gateway: 'bKash',
    transactionId: '',
    amount: 1500,
    status: 'verified',
    note: '',
    memoUrl: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Convert and Aggregate All Transactions from DataContext into Unified Ledger
  const unifiedTransactions: UnifiedTransaction[] = useMemo(() => {
    const list: UnifiedTransaction[] = [];

    // 1. Course Enrollment Payment Orders
    (orders || []).forEach((o: any) => {
      const isPaid = o.status === 'Paid' || o.status === 'Approved';
      const isPending = o.status === 'Pending';
      list.push({
        id: o.id || `ORD-${Math.floor(Math.random() * 90000)}`,
        invoiceNo: `PTEN-EDU-${(o.id || '101').replace(/\D/g, '').padStart(4, '0')}`,
        type: 'course',
        typeName: 'কোর্স এনরোলমেন্ট ফি',
        title: o.courseTitle || 'প্রফেশনাল আইটি কোর্স',
        partyName: o.userName || 'শিক্ষার্থী',
        partyPhone: o.senderPhone || o.userMobile || '01700000000',
        partyEmail: o.userEmail || 'student@ptenit.com',
        partyRole: 'শিক্ষার্থী',
        amount: Number(o.amount) || 0,
        flow: 'inflow',
        gateway: o.paymentMethod || 'bKash',
        accountNumber: o.senderPhone || o.userMobile,
        transactionId: o.transactionId || 'TXN-EDU-AUTO',
        date: o.createdAt || '2026-02-15 12:00 PM',
        status: isPaid ? 'verified' : isPending ? 'pending' : 'rejected',
        statusLabel: isPaid ? 'পরিশোধিত' : isPending ? 'অপেক্ষমাণ' : 'বাতিল',
        adminCommission: Number(o.amount) || 0,
        sellerPayout: 0,
        escrowHold: false,
        note: `কোর্স এনরোলমেন্ট আইডি: ${o.courseId || ''}`,
        rawItem: o
      });
    });

    // 2. Marketplace Gig & Agency Orders
    (marketplaceOrders || []).forEach((m: any) => {
      const isDone = m.status === 'completed';
      const isProgress = m.status === 'in_progress' || m.status === 'delivered';
      const isPending = m.status === 'pending' || m.status === 'pending_approval';
      const amt = Number(m.amount) || Number(m.price) || 0;
      const commission = Number(m.adminCommission) || Math.round(amt * 0.1);
      const sellerPayout = Number(m.sellerPayout) || Math.round(amt * 0.9);

      list.push({
        id: m.id || `MKT-${Math.floor(Math.random() * 90000)}`,
        invoiceNo: `PTEN-MKT-${(m.id || '201').replace(/\D/g, '').padStart(4, '0')}`,
        type: 'gig',
        typeName: m.type === 'custom_agency_order' ? 'এজেন্সি আইটি প্রজেক্ট' : 'মার্কেটপ্লেস গিগ অর্ডার',
        title: m.title || 'মার্কেটপ্লেস সার্ভিস অর্ডার',
        partyName: m.buyerName || 'বায়ার ক্লায়েন্ট',
        partyPhone: m.buyerPhone || '01800000000',
        partyEmail: m.buyerEmail || 'client@ptenit.com',
        partyRole: 'বায়ার ও ক্লায়েন্ট',
        amount: amt,
        flow: 'inflow',
        gateway: m.paymentMethod || 'bKash',
        transactionId: m.transactionId || `MKT-ESCROW-${(m.id || '0').slice(-4)}`,
        date: m.createdAt || '2026-02-20 03:30 PM',
        status: isDone ? 'verified' : isProgress ? 'in_progress' : isPending ? 'pending' : 'rejected',
        statusLabel: isDone ? 'সম্পন্ন ও রিলিজড' : isProgress ? 'এস্ক্রো সুরক্ষিত' : isPending ? 'অপেক্ষমাণ' : 'বাতিল',
        adminCommission: commission,
        sellerPayout: sellerPayout,
        escrowHold: isProgress,
        note: `সেলার: ${m.sellerName || 'স্পেশালিস্ট'} (পেমেন্ট শেয়ার ৳${sellerPayout.toLocaleString('bn-BD')})`,
        rawItem: m
      });
    });

    // 3. Digital Products Sales
    (digitalProducts || []).forEach((d: any) => {
      if (d.salesCount && d.salesCount > 0) {
        const amt = Number(d.price) || 0;
        const totalSalesAmt = amt * d.salesCount;
        list.push({
          id: `DIG-${d.id}`,
          invoiceNo: `PTEN-DIG-${(d.id || '301').replace(/\D/g, '').padStart(4, '0')}`,
          type: 'digital',
          typeName: 'ডিজিটাল প্রোডাক্ট সেল',
          title: d.title || 'সফটওয়্যার / অ্যাসেট বিক্রি',
          partyName: 'ডিজিটাল কাস্টমারস',
          partyRole: 'সফটওয়্যার ক্রেতা',
          amount: totalSalesAmt,
          flow: 'inflow',
          gateway: 'SSLCommerz / bKash',
          transactionId: `DIG-TX-${d.id.slice(0, 6)}`,
          date: d.createdAt || '2026-02-18 10:00 AM',
          status: 'verified',
          statusLabel: 'পরিশোধিত',
          adminCommission: Math.round(totalSalesAmt * 0.15),
          sellerPayout: Math.round(totalSalesAmt * 0.85),
          escrowHold: false,
          note: `মোট বিক্রি: ${d.salesCount} টি ডাউনলোড | মূল্য ৳${amt}`,
          rawItem: d
        });
      }
    });

    // 4. Company Operational Bills & Expenses
    effectiveBills.forEach((b: CompanyBillItem) => {
      const isVerified = b.status === 'verified';
      const isPending = b.status === 'pending';
      const isExpense = b.category.includes('ভাড়া') || b.category.includes('হোস্টিং') || b.category.includes('ইন্টারনেট') || b.category.includes('খরচ') || b.category.includes('স্যালারি') || b.category.includes('সার্ভার');

      list.push({
        id: b.id,
        invoiceNo: `PTEN-BILL-${b.id.replace(/\D/g, '').padStart(4, '0')}`,
        type: 'company_bill',
        typeName: isExpense ? 'কোম্পানি পরিচালনা খরচ' : 'প্রাতিষ্ঠানিক পেমেন্ট বিল',
        title: b.category || 'অফিস বিল ভাউচার',
        partyName: b.payerName || 'ভেন্ডর / ক্লায়েন্ট',
        partyPhone: b.payerPhone || '01700000000',
        partyRole: isExpense ? 'ভেন্ডর / সেবাদাতা' : 'ক্লায়েন্ট',
        amount: Number(b.amount) || 0,
        flow: isExpense ? 'outflow' : 'inflow',
        gateway: b.gateway || 'bKash',
        transactionId: b.transactionId,
        date: b.date,
        status: isVerified ? 'verified' : isPending ? 'pending' : 'rejected',
        statusLabel: isVerified ? 'অনুমোদিত ও সংরক্ষিত' : isPending ? 'যাচাই অপেক্ষমাণ' : 'প্রত্যাখ্যাত',
        adminCommission: 0,
        sellerPayout: 0,
        escrowHold: false,
        note: b.note || '',
        memoUrl: b.memoUrl,
        rawItem: b
      });
    });

    // 5. Teacher & Seller Payout Requests (অনুরোধ)
    (payouts || []).forEach((p: any) => {
      const isPaid = p.status === 'Paid' || p.status === 'Approved';
      const isPending = p.status === 'Pending';
      list.push({
        id: p.id || `PAY-${Math.floor(Math.random() * 90000)}`,
        invoiceNo: `PTEN-PAY-${(p.id || '401').replace(/\D/g, '').padStart(4, '0')}`,
        type: 'payout',
        typeName: 'শিক্ষক / সেলার উত্তোলন',
        title: `সম্মানী ও রয়্যালটি পেআউট - ${p.teacherName || 'ইনস্ট্রাক্টর'}`,
        partyName: p.teacherName || 'ইনস্ট্রাক্টর',
        partyEmail: p.teacherEmail,
        partyPhone: p.accountNumber,
        partyRole: 'সম্মানিত ইনস্ট্রাক্টর',
        amount: Number(p.amount) || 0,
        flow: 'outflow',
        gateway: p.paymentMethod || 'bKash',
        accountNumber: p.accountNumber,
        transactionId: p.transactionId || (isPaid ? `TXN-PAY-${p.id}` : 'অপেক্ষমাণ'),
        date: p.requestedAt || '2026-02-28 05:00 PM',
        status: isPaid ? 'verified' : isPending ? 'pending' : 'rejected',
        statusLabel: isPaid ? 'পরিশোধ সম্পন্ন' : isPending ? 'অনুমোদনের অপেক্ষায়' : 'বাতিলকৃত',
        adminCommission: 0,
        sellerPayout: Number(p.amount) || 0,
        escrowHold: false,
        note: p.note || 'মাসিক কমিশন উত্তোলন অনুরোধ',
        rawItem: p
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, marketplaceOrders, digitalProducts, effectiveBills, payouts]);

  // Financial Calculations ("সকল হিসাব")
  const stats = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalCommission = 0;
    let escrowHeld = 0;
    let pendingPayoutsAmt = 0;
    let pendingBillsAmt = 0;
    let verifiedExpensesAmt = 0;

    // Gateways balances
    let bkashIn = 0, bkashOut = 0;
    let nagadIn = 0, nagadOut = 0;
    let rocketIn = 0, rocketOut = 0;
    let bankIn = 0, bankOut = 0;

    unifiedTransactions.forEach(t => {
      const isVerified = t.status === 'verified';
      const isPending = t.status === 'pending';
      const isInProgress = t.status === 'in_progress';

      if (t.flow === 'inflow') {
        if (isVerified || isInProgress) {
          totalInflow += t.amount;
        }
        if (t.escrowHold) {
          escrowHeld += t.amount;
        }
        if (t.adminCommission) {
          totalCommission += t.adminCommission;
        }

        // gateway grouping
        if (t.gateway.toLowerCase().includes('bkash')) bkashIn += t.amount;
        else if (t.gateway.toLowerCase().includes('nagad')) nagadIn += t.amount;
        else if (t.gateway.toLowerCase().includes('rocket')) rocketIn += t.amount;
        else if (t.gateway.toLowerCase().includes('bank')) bankIn += t.amount;
      } else {
        // Outflow
        if (isVerified) {
          totalOutflow += t.amount;
          if (t.type === 'company_bill') verifiedExpensesAmt += t.amount;
        }
        if (isPending) {
          if (t.type === 'payout') pendingPayoutsAmt += t.amount;
          else pendingBillsAmt += t.amount;
        }

        // gateway grouping
        if (t.gateway.toLowerCase().includes('bkash')) bkashOut += t.amount;
        else if (t.gateway.toLowerCase().includes('nagad')) nagadOut += t.amount;
        else if (t.gateway.toLowerCase().includes('rocket')) rocketOut += t.amount;
        else if (t.gateway.toLowerCase().includes('bank')) bankOut += t.amount;
      }
    });

    const netTreasury = totalInflow - totalOutflow;

    return {
      totalInflow,
      totalOutflow,
      netTreasury,
      totalCommission,
      escrowHeld,
      pendingPayoutsAmt,
      pendingBillsAmt,
      verifiedExpensesAmt,
      pendingCount: unifiedTransactions.filter(t => t.status === 'pending').length,
      gateways: {
        bkash: { in: bkashIn, out: bkashOut, net: bkashIn - bkashOut },
        nagad: { in: nagadIn, out: nagadOut, net: nagadIn - nagadOut },
        rocket: { in: rocketIn, out: rocketOut, net: rocketIn - rocketOut },
        bank: { in: bankIn, out: bankOut, net: bankIn - bankOut }
      }
    };
  }, [unifiedTransactions]);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return unifiedTransactions.filter(t => {
      // search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchParty = t.partyName.toLowerCase().includes(q);
        const matchTrx = t.transactionId.toLowerCase().includes(q);
        const matchInv = t.invoiceNo.toLowerCase().includes(q);
        const matchPhone = (t.partyPhone || '').toLowerCase().includes(q);
        if (!matchTitle && !matchParty && !matchTrx && !matchInv && !matchPhone) return false;
      }

      // type
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      // status
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // gateway
      if (gatewayFilter !== 'all' && !t.gateway.toLowerCase().includes(gatewayFilter.toLowerCase())) return false;

      return true;
    });
  }, [unifiedTransactions, searchTerm, typeFilter, statusFilter, gatewayFilter]);

  // Payout Requests List
  const payoutRequestsList = useMemo(() => {
    return unifiedTransactions.filter(t => t.type === 'payout');
  }, [unifiedTransactions]);

  // Invoices & Bills List
  const billsAndInvoicesList = useMemo(() => {
    return unifiedTransactions.filter(t => t.type === 'company_bill' || t.type === 'course' || t.type === 'gig');
  }, [unifiedTransactions]);

  // Filtered Bills for the Dedicated Bill Verification Tab
  const displayedBills = useMemo(() => {
    const source = billScope === 'company_bills' 
      ? unifiedTransactions.filter(t => t.type === 'company_bill')
      : billsAndInvoicesList;

    return source.filter(b => {
      if (billStatusSubFilter !== 'all' && b.status !== billStatusSubFilter) return false;
      if (billSubSearch.trim()) {
        const q = billSubSearch.toLowerCase();
        const matches = (b.title || '').toLowerCase().includes(q) ||
          (b.partyName || '').toLowerCase().includes(q) ||
          (b.transactionId || '').toLowerCase().includes(q) ||
          (b.invoiceNo || '').toLowerCase().includes(q) ||
          (b.partyPhone || '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [billScope, unifiedTransactions, billsAndInvoicesList, billStatusSubFilter, billSubSearch]);

  const pendingBillsCount = useMemo(() => {
    return (billScope === 'company_bills' 
      ? unifiedTransactions.filter(t => t.type === 'company_bill')
      : billsAndInvoicesList
    ).filter(b => b.status === 'pending').length;
  }, [billScope, unifiedTransactions, billsAndInvoicesList]);

  // Handlers
  const handleVerifyBill = (billId: string) => {
    if (onVerifySingleBill) {
      onVerifySingleBill(billId);
    } else if (propSetCompanyBills) {
      propSetCompanyBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'verified', verifiedAt: new Date().toLocaleTimeString('bn-BD') } : b));
    } else {
      setLocalBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'verified', verifiedAt: new Date().toLocaleTimeString('bn-BD') } : b));
    }
    playAppSound?.('click');
    showToast(`বিল ${billId} সফলভাবে ভেরিফাই ও অনুমোদন করা হয়েছে!`);
  };

  const handleRejectBillAction = (billId: string) => {
    if (onRejectBill) {
      onRejectBill(billId);
    } else if (propSetCompanyBills) {
      propSetCompanyBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'rejected' } : b));
    } else {
      setLocalBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'rejected' } : b));
    }
    playAppSound?.('click');
    showToast(`বিল ${billId} বাতিল করা হয়েছে।`);
  };

  const handleVerifyAllBillsAction = () => {
    if (onVerifyAllBills) {
      onVerifyAllBills();
    } else if (propSetCompanyBills) {
      propSetCompanyBills(prev => prev.map(b => b.status === 'pending' ? { ...b, status: 'verified', verifiedAt: new Date().toLocaleTimeString('bn-BD') } : b));
    } else {
      setLocalBills(prev => prev.map(b => b.status === 'pending' ? { ...b, status: 'verified', verifiedAt: new Date().toLocaleTimeString('bn-BD') } : b));
    }
    playAppSound?.('success');
    showToast('সকল অপেক্ষমাণ বিল সফলভাবে যাচাই ও অনুমোদন করা হয়েছে!');
  };

  const handleCreateNewBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillForm.title.trim() || !newBillForm.payerName.trim() || !newBillForm.transactionId.trim()) {
      alert('অনুগ্রহ করে বিলের বিবরণ, প্রাপক/ভেন্ডরের নাম এবং TrxID প্রদান করুন।');
      return;
    }

    const created: CompanyBillItem = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      payerName: newBillForm.payerName,
      payerPhone: newBillForm.payerPhone || '01700000000',
      gateway: newBillForm.gateway,
      transactionId: newBillForm.transactionId.trim().toUpperCase(),
      amount: Number(newBillForm.amount) || 0,
      category: `${newBillForm.category} - ${newBillForm.title}`,
      status: newBillForm.status,
      date: new Date().toLocaleString('bn-BD'),
      note: newBillForm.note || 'ম্যানুয়ালি যুক্ত প্রাতিষ্ঠানিক বিল',
      memoUrl: newBillForm.memoUrl
    };

    if (onCreateBill) {
      onCreateBill(created);
    } else if (propSetCompanyBills) {
      propSetCompanyBills(prev => [created, ...prev]);
    } else {
      setLocalBills(prev => [created, ...prev]);
    }

    setAddBillModalOpen(false);
    setNewBillForm({
      title: '',
      category: 'অফিস ভাড়া ও ইউটিলিটি',
      payerName: '',
      payerPhone: '',
      gateway: 'bKash',
      transactionId: '',
      amount: 1500,
      status: 'verified',
      note: '',
      memoUrl: ''
    });

    playAppSound?.('success');
    showToast(`নতুন বিল ${created.id} সফলভাবে লেজারে যুক্ত হয়েছে!`);
  };

  const handleOpenPayoutModal = (payoutItem: any, action: 'approve' | 'reject') => {
    setPayoutActionModal({
      isOpen: true,
      payout: payoutItem,
      actionType: action,
      trxIdInput: action === 'approve' ? `TXN-PAY-${Math.floor(100000 + Math.random() * 900000)}` : '',
      debitAccount: 'bKash-merchant',
      rejectionReason: 'ভুল পেমেন্ট একাউন্ট নম্বর'
    });
  };

  const handleConfirmPayoutAction = () => {
    const { payout, actionType, trxIdInput, rejectionReason } = payoutActionModal;
    if (!payout) return;

    if (actionType === 'approve') {
      if (updatePayoutStatus) {
        updatePayoutStatus(payout.id, 'Paid', trxIdInput);
      }
      playAppSound?.('success');
      showToast(`৳${payout.amount} পেআউট অনুমোদন করা হয়েছে (TrxID: ${trxIdInput})!`);
    } else {
      if (updatePayoutStatus) {
        updatePayoutStatus(payout.id, 'Rejected');
      }
      playAppSound?.('click');
      showToast(`পেআউট অনুরোধ প্রত্যাখ্যান করা হয়েছে (${rejectionReason})।`);
    }

    setPayoutActionModal({
      isOpen: false,
      payout: null,
      actionType: 'approve',
      trxIdInput: '',
      debitAccount: 'bKash-merchant',
      rejectionReason: ''
    });
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  const handleCopyVoucherText = (item: UnifiedTransaction) => {
    const text = `PTEN IT SOLUTIONS - OFFICIAL MONEY RECEIPT\nInvoice: ${item.invoiceNo}\nTitle: ${item.title}\nParty: ${item.partyName} (${item.partyPhone || 'N/A'})\nAmount: ৳${item.amount}\nGateway: ${item.gateway}\nTrxID: ${item.transactionId}\nDate: ${item.date}\nStatus: ${item.statusLabel}\nVerified by PTEN IT Financial Ledger.`;
    navigator.clipboard?.writeText(text);
    showToast('ইনভয়েস বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  const handleExportCSV = () => {
    const headers = 'InvoiceNo,Type,Title,Party,Amount,Flow,Gateway,TrxID,Date,Status\n';
    const rows = filteredTransactions.map(t => 
      `"${t.invoiceNo}","${t.typeName}","${t.title}","${t.partyName}",${t.amount},"${t.flow}","${t.gateway}","${t.transactionId}","${t.date}","${t.statusLabel}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PTENIT-Financial-Ledger-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('সম্পূর্ণ ফাইন্যান্সিয়াল লেজার CSV ফরম্যাটে ডাউনলোড হয়েছে!');
  };

  return (
    <div className="space-y-4 font-bengali">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HERO HEADER */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 bg-blue-500/10 text-sky-400 border border-blue-500/20 rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>ফাইন্যান্সিয়াল অ্যাকাউন্টিং ও অল-ইন-ওয়ান পেমেন্ট কোর</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-sky-400 border border-blue-500/30 text-[10px] font-black rounded-full uppercase">
                    Live Accounting
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  সকল কোর্স ফি, মার্কেটপ্লেস এস্ক্রো, ডিজিটাল প্রোডাক্ট সেল, উত্তোলন অনুরোধ (Payout) এবং প্রাতিষ্ঠানিক বিলের সমন্বিত কেন্দ্রীয় হিসাব।
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setAddBillModalOpen(true)}
              className="px-3.5 py-2 bg-[#047857] hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ নতুন বিল / ভাউচার তৈরি</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>এক্সপোর্ট লেজার (CSV)</span>
            </button>
          </div>
        </div>

        {/* FINANCIAL SUMMARY METRIC CARDS ("সকল হিসাব") */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Total Inflow */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">মোট প্ল্যাটফর্ম আদায়</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <p className="text-base sm:text-xl font-black text-sky-400">
              ৳{stats.totalInflow.toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">কোর্স + গিগ + ডিজিটাল সেল</p>
          </div>

          {/* Card 2: Net Treasury Balance */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">নেট নগদ তহবিল</span>
              <Wallet className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <p className="text-base sm:text-xl font-black text-sky-400">
              ৳{stats.netTreasury.toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">আদায় - পেআউট - খরচ</p>
          </div>

          {/* Card 3: Escrow Held */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">এস্ক্রো সিকিউরড হোল্ড</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-base sm:text-xl font-black text-amber-400">
              ৳{stats.escrowHeld.toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">চলমান অর্ডারের গ্রাহক আমানত</p>
          </div>

          {/* Card 4: Platform Profit / Commission */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">প্ল্যাটফর্ম কমিশন ও লাভ</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-base sm:text-xl font-black text-purple-400">
              ৳{stats.totalCommission.toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">গিগ ১০% ফি ও মার্জিন</p>
          </div>

          {/* Card 5: Pending Requests (অনুরোধ) */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-400">অপেক্ষমাণ অনুরোধ</span>
              <Clock className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-base sm:text-xl font-black text-rose-400">
              ৳{(stats.pendingPayoutsAmt + stats.pendingBillsAmt).toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">{stats.pendingCount} টি রিকোয়েস্ট পেন্ডিং</p>
          </div>

          {/* Card 6: Total Expenses */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">পরিশোধিত খরচ ও পেআউট</span>
              <ArrowDownLeft className="w-3.5 h-3.5 text-rose-300" />
            </div>
            <p className="text-base sm:text-xl font-black text-rose-300">
              ৳{stats.totalOutflow.toLocaleString('bn-BD')}
            </p>
            <p className="text-[9px] text-slate-500">টিচার পেআউট + অফিস ব্যয়</p>
          </div>
        </div>
      </div>

      {/* CORE SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveCoreTab('all_transactions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCoreTab === 'all_transactions'
              ? 'bg-blue-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>সকল পেমেন্ট লেজার ({unifiedTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveCoreTab('invoices_bills')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap relative ${
            activeCoreTab === 'invoices_bills'
              ? 'bg-blue-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>বিল জমা ও ভেরিফাই ({effectiveBills.length})</span>
          {effectiveBills.filter(b => b.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shadow-xs">
              {effectiveBills.filter(b => b.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveCoreTab('payout_requests')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap relative ${
            activeCoreTab === 'payout_requests'
              ? 'bg-blue-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>উত্তোলন ও পেআউট অনুরোধ ({payoutRequestsList.length})</span>
          {payoutRequestsList.filter(p => p.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-black rounded-full animate-pulse">
              {payoutRequestsList.filter(p => p.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveCoreTab('mfs_accounts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCoreTab === 'mfs_accounts'
              ? 'bg-blue-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>গেটওয়ে ও ব্যাংক স্থিতি (MFS)</span>
        </button>
      </div>

      {/* FILTER CONTROLS BAR (Shown on Transactions & Invoices) */}
      {(activeCoreTab === 'all_transactions' || activeCoreTab === 'invoices_bills') && (
        <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="TrxID, ইনভয়েস নম্বর, পেয়ার নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Filter Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Selector */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">সকল ধরন</option>
              <option value="course">🎓 কোর্স ফি</option>
              <option value="gig">💼 গিগ অর্ডার</option>
              <option value="digital">📦 ডিজিটাল এসেট</option>
              <option value="company_bill">🏢 অফিস/কোম্পানি বিল</option>
              <option value="payout">📤 পেআউট উত্তোলন</option>
            </select>

            {/* Status Selector */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="verified">✓ ভেরিফাইড / পরিশোধিত</option>
              <option value="pending">⏳ অপেক্ষমাণ (Pending)</option>
              <option value="rejected">✕ বাতিলকৃত</option>
            </select>

            {/* Gateway Selector */}
            <select
              value={gatewayFilter}
              onChange={e => setGatewayFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">সকল পেমেন্ট চ্যানেল</option>
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="rocket">রকেট (Rocket)</option>
              <option value="bank">ব্যাংক ট্রান্সফার</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 1: ALL PAYMENTS & TRANSACTIONS LEDGER */}
      {activeCoreTab === 'all_transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white">
                সর্বমোট লেনদেন রেকর্ডস ({filteredTransactions.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              যেকোনো রেকর্ডের সম্পূর্ণ ইনভয়েস দেখতে "বিল দেখুন" বাটনে ক্লিক করুন
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="p-3">ইনভয়েস / ট্রানজেকশন</th>
                  <th className="p-3">বিবরণ ও আইটেম</th>
                  <th className="p-3">পেয়ার / প্রাপক</th>
                  <th className="p-3">পরিমাণ</th>
                  <th className="p-3">পেমেন্ট মেথড ও TrxID</th>
                  <th className="p-3">তারিখ ও সময়</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      কোনো ট্রানজেকশন রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3">
                        <div className="font-mono text-sky-400 font-bold text-[11px]">
                          {item.invoiceNo}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {item.id}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-white text-xs max-w-xs truncate" title={item.title}>
                          {item.title}
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                          {item.typeName}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200">{item.partyName}</div>
                        <div className="text-[10px] text-slate-400">{item.partyPhone || item.partyEmail || '-'}</div>
                      </td>

                      <td className="p-3">
                        <div className={`font-black text-sm ${item.flow === 'inflow' ? 'text-sky-400' : 'text-rose-400'}`}>
                          {item.flow === 'inflow' ? '+' : '-'}৳{item.amount.toLocaleString('bn-BD')}
                        </div>
                        {item.escrowHold && (
                          <span className="text-[9px] text-amber-400">এস্ক্রো সুরক্ষিত</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                            {item.gateway}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.transactionId}
                        </span>
                      </td>

                      <td className="p-3 text-[11px] text-slate-400 whitespace-nowrap">
                        {item.date}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                          item.status === 'verified'
                            ? 'bg-blue-500/20 text-sky-400 border border-blue-500/30'
                            : item.status === 'in_progress'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : item.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.status === 'verified' && <Check className="w-2.5 h-2.5" />}
                          {item.status === 'pending' && <Clock className="w-2.5 h-2.5" />}
                          {item.statusLabel}
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVoucher(item)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>বিল দেখুন</span>
                          </button>

                          {item.status === 'pending' && item.type === 'company_bill' && (
                            <button
                              onClick={() => handleVerifyBill(item.id)}
                              className="p-1 bg-[#047857] hover:bg-blue-500 text-white rounded-lg transition cursor-pointer"
                              title="অনুমোদন করুন"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {item.status === 'pending' && item.type === 'payout' && (
                            <button
                              onClick={() => handleOpenPayoutModal(item.rawItem || item, 'approve')}
                              className="px-2 py-1 bg-[#047857] hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              অনুমোদন
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & BILLS VAULT ("বিল জমা ও ভেরিফাই - সব কিছুর বিল পাব, দেখব ও অনুমোদন করব") */}
      {activeCoreTab === 'invoices_bills' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>বিল জমা ও ভেরিফিকেশন রিপোজিটরি</span>
                    {pendingBillsCount > 0 && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black rounded-full animate-pulse">
                        {pendingBillsCount} টি অপেক্ষমাণ
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    কোম্পানি বিল, ভেন্ডর ইনভয়েস ও সার্ভিস রিসিট জমা দিন, TrxID যাচাই করুন এবং অনুমোদন করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {pendingBillsCount > 0 && (
                <button
                  onClick={handleVerifyAllBillsAction}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-95"
                  title="এক ক্লিকে সব অপেক্ষমাণ বিল যাচাই ও অনুমোদন করুন"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>সব অনুমোদন করুন ({pendingBillsCount})</span>
                </button>
              )}

              <button
                onClick={() => setAddBillModalOpen(true)}
                className="px-4 py-2 bg-[#047857] hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন বিল জমা দিন</span>
              </button>
            </div>
          </div>

          {/* Scope and Filter Tabs */}
          <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Scope Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBillScope('company_bills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    billScope === 'company_bills'
                      ? 'bg-blue-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  কোম্পানি ও ভেন্ডর বিল ({unifiedTransactions.filter(t => t.type === 'company_bill').length})
                </button>
                <button
                  type="button"
                  onClick={() => setBillScope('all_invoices')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    billScope === 'all_invoices'
                      ? 'bg-blue-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  সকল ইনভয়েস ও রিসিট ({billsAndInvoicesList.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="বিল নং, TrxID বা নাম খুঁজুন..."
                  value={billSubSearch}
                  onChange={(e) => setBillSubSearch(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {[
                { key: 'all', label: 'সকল বিল' },
                { key: 'pending', label: 'অপেক্ষমাণ ভেরিফিকেশন' },
                { key: 'verified', label: 'অনুমোদিত ও ভেরিফাইড' },
                { key: 'rejected', label: 'বাতিলকৃত' }
              ].map(st => {
                const count = (billScope === 'company_bills'
                  ? unifiedTransactions.filter(t => t.type === 'company_bill')
                  : billsAndInvoicesList
                ).filter(b => st.key === 'all' || b.status === st.key).length;

                return (
                  <button
                    key={st.key}
                    onClick={() => setBillStatusSubFilter(st.key as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      billStatusSubFilter === st.key
                        ? st.key === 'pending'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : st.key === 'verified'
                          ? 'bg-blue-500 text-slate-950 font-black'
                          : 'bg-slate-700 text-white font-black'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      billStatusSubFilter === st.key
                        ? 'bg-black/20 text-current'
                        : st.key === 'pending' && count > 0
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-900 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bills Grid / Cards */}
          {displayedBills.length === 0 ? (
            <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">কোনো বিল বা ইনভয়েস পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500">ফিল্টার বা সার্চ পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedBills.map(b => {
                const isPending = b.status === 'pending';
                const isVerified = b.status === 'verified';

                return (
                  <div
                    key={b.id}
                    className={`bg-slate-900 rounded-2xl shadow transition space-y-3 flex flex-col justify-between border ${
                      isPending
                        ? 'border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-500/20 bg-gradient-to-b from-slate-900 to-amber-950/10'
                        : isVerified
                        ? 'border-slate-800 hover:border-slate-700'
                        : 'border-rose-900/40 opacity-75'
                    } p-4`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-sky-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                          {b.invoiceNo || b.id}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full flex items-center gap-1 ${
                          isVerified
                            ? 'bg-blue-500/20 text-sky-400 border border-blue-500/30'
                            : isPending
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isPending && <Clock className="w-2.5 h-2.5" />}
                          {isVerified && <CheckCircle2 className="w-2.5 h-2.5" />}
                          <span>{b.statusLabel || (isPending ? 'অপেক্ষমাণ' : isVerified ? 'অনুমোদিত' : 'বাতিল')}</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm line-clamp-1">{b.title}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          প্রাপক/ভেন্ডর: <strong className="text-slate-300 font-semibold">{b.partyName}</strong>
                          {b.partyPhone && <span className="font-mono ml-1 text-slate-500">({b.partyPhone})</span>}
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-xl flex items-center justify-between text-xs border border-slate-800/80">
                        <span className="text-slate-400 text-[11px] font-medium">বিলের পরিমাণ:</span>
                        <span className="font-black text-sm text-sky-400">৳{b.amount.toLocaleString('bn-BD')}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono bg-slate-950/40 px-2 py-1 rounded-lg">
                        <span className="flex items-center gap-1">
                          <span className="font-bold text-slate-300">{b.gateway}</span>
                          <span>•</span>
                          <span className="text-sky-400 font-semibold">{b.transactionId}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">{b.date.slice(0, 10)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      {isPending && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerifyBill(b.id)}
                            className="w-full py-1.5 px-2 bg-[#047857] hover:bg-blue-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন করুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectBillAction(b.id)}
                            className="w-full py-1.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucher(b)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>বিল দেখুন ও প্রিন্ট</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyVoucherText(b)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition cursor-pointer"
                          title="TrxID ও বিল কপি করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYOUT & WITHDRAWAL REQUESTS ("অনুরোদ সহ সকল হিসাব") */}
      {activeCoreTab === 'payout_requests' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-amber-400" />
                <span>শিক্ষক ও ফ্রিল্যান্স সেলারদের উত্তোলন অনুরোধ ({payoutRequestsList.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                ইন্সট্রাক্টর এবং ফ্রিল্যান্সারদের উপার্জিত সম্মানী ভেরিফাই করে বিকাশ, নগদ বা ব্যাংক একাউন্টে প্রেরণ করুন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold">
                অপেক্ষমাণ: {payoutRequestsList.filter(p => p.status === 'pending').length} টি
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="p-3">রিকোয়েস্ট আইডি</th>
                    <th className="p-3">আবেদনকারী শিক্ষক/সেলার</th>
                    <th className="p-3">দাবীকৃত উত্তোলনের পরিমাণ</th>
                    <th className="p-3">পেমেন্ট মেথড ও একাউন্ট</th>
                    <th className="p-3">আবেদনের তারিখ</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3">ট্রানজেকশন রেফারেন্স (TrxID)</th>
                    <th className="p-3 text-right">অ্যাডমিন অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {payoutRequestsList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500">
                        কোনো পেআউট অনুরোধ পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    payoutRequestsList.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-mono text-sky-400 font-bold">
                          {p.invoiceNo}
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-white">{p.partyName}</div>
                          <div className="text-[10px] text-slate-400">{p.partyEmail || p.partyPhone}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-black text-sm text-rose-400">
                            ৳{p.amount.toLocaleString('bn-BD')}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-200">{p.gateway}</div>
                          <div className="font-mono text-[10px] text-slate-400">{p.accountNumber || p.partyPhone}</div>
                        </td>

                        <td className="p-3 text-[11px] text-slate-400 whitespace-nowrap">
                          {p.date}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'verified'
                              ? 'bg-blue-500/20 text-sky-400'
                              : p.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {p.statusLabel}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {p.transactionId}
                        </td>

                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedVoucher(p)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition cursor-pointer"
                            >
                              রিসিট
                            </button>

                            {p.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleOpenPayoutModal(p.rawItem || p, 'approve')}
                                  className="px-2.5 py-1 bg-[#047857] hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow"
                                >
                                  অনুমোদন করুন
                                </button>
                                <button
                                  onClick={() => handleOpenPayoutModal(p.rawItem || p, 'reject')}
                                  className="px-2 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                  বাতিল
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MFS & BANK ACCOUNTS BREAKDOWN ("সকল হিসাব") */}
      {activeCoreTab === 'mfs_accounts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* bKash */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E2136E]/20 text-[#E2136E] font-black flex items-center justify-center text-xs">
                    bK
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">বিকাশ মার্চেন্ট ও পার্সোনাল</h3>
                    <p className="text-[10px] text-slate-400 font-mono">01712345678</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">মোট আদায়:</span>
                  <span className="font-bold text-sky-400">৳{stats.gateways.bkash.in.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">উত্তোলন/খরচ:</span>
                  <span className="font-bold text-rose-400">৳{stats.gateways.bkash.out.toLocaleString('bn-BD')}</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between text-xs font-black">
                  <span className="text-slate-200">বর্তমান স্থিতি:</span>
                  <span className="text-sky-400">৳{stats.gateways.bkash.net.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>

            {/* Nagad */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F7941D]/20 text-[#F7941D] font-black flex items-center justify-center text-xs">
                    NG
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">নগদ একাউন্ট</h3>
                    <p className="text-[10px] text-slate-400 font-mono">01700000000</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">মোট আদায়:</span>
                  <span className="font-bold text-sky-400">৳{stats.gateways.nagad.in.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">উত্তোলন/খরচ:</span>
                  <span className="font-bold text-rose-400">৳{stats.gateways.nagad.out.toLocaleString('bn-BD')}</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between text-xs font-black">
                  <span className="text-slate-200">বর্তমান স্থিতি:</span>
                  <span className="text-sky-400">৳{stats.gateways.nagad.net.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>

            {/* Rocket */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8C3494]/20 text-[#8C3494] font-black flex items-center justify-center text-xs">
                    RK
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">ডাচ-বাংলা রকেট</h3>
                    <p className="text-[10px] text-slate-400 font-mono">01900000000</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">মোট আদায়:</span>
                  <span className="font-bold text-sky-400">৳{stats.gateways.rocket.in.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">উত্তোলন/খরচ:</span>
                  <span className="font-bold text-rose-400">৳{stats.gateways.rocket.out.toLocaleString('bn-BD')}</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between text-xs font-black">
                  <span className="text-slate-200">বর্তমান স্থিতি:</span>
                  <span className="text-sky-400">৳{stats.gateways.rocket.net.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>

            {/* Dutch-Bangla Corporate Bank */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-sky-400 font-black flex items-center justify-center text-xs">
                    BK
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">ডাচ-বাংলা ব্যাংক PLC</h3>
                    <p className="text-[10px] text-slate-400 font-mono">2181100098765</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">মোট আদায়:</span>
                  <span className="font-bold text-sky-400">৳{stats.gateways.bank.in.toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">উত্তোলন/খরচ:</span>
                  <span className="font-bold text-rose-400">৳{stats.gateways.bank.out.toLocaleString('bn-BD')}</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between text-xs font-black">
                  <span className="text-slate-200">বর্তমান স্থিতি:</span>
                  <span className="text-sky-400">৳{stats.gateways.bank.net.toLocaleString('bn-BD')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: UNIVERSAL INVOICE & BILL VOUCHER VIEWER ("সব কিছুর বিল পাব, দেখব") */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-black text-white">অফিসিয়াল ইনভয়েস ও বিলিং ভাউচার</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ইনভয়েস নং: {selectedVoucher.invoiceNo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Printable Voucher Area */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300 bg-slate-900 print:bg-white print:text-black">
              {/* Official Header Pad */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-wide">PTEN IT SOLUTIONS</h2>
                  <p className="text-[11px] text-slate-400">Govt. Registered IT Training, Software & Freelance Hub</p>
                  <p className="text-[10px] text-slate-500">Dhaka, Bangladesh • Hotline: 01712345678 • web: ptenit.com</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    selectedVoucher.status === 'verified'
                      ? 'bg-blue-500/20 text-sky-400 border-blue-500/40'
                      : selectedVoucher.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {selectedVoucher.status === 'verified' ? '✓ PAID / পরিশোধিত' : '⏳ PENDING / অপেক্ষমাণ'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{selectedVoucher.date}</p>
                </div>
              </div>

              {/* Bill Details Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">বিল প্রাপক / ক্লায়েন্ট:</p>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedVoucher.partyName}</p>
                  <p className="text-slate-400 text-[11px]">{selectedVoucher.partyPhone || selectedVoucher.partyEmail || 'মোবাইল: সংরক্ষিত'}</p>
                  <p className="text-slate-500 text-[10px]">{selectedVoucher.partyRole || 'সম্মানিত গ্রাহক'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">পেমেন্ট গেটওয়ে বিবরণ:</p>
                  <p className="text-sm font-bold text-sky-400 mt-0.5">{selectedVoucher.gateway}</p>
                  <p className="text-slate-400 text-[11px] font-mono">TrxID: {selectedVoucher.transactionId}</p>
                  <p className="text-slate-500 text-[10px]">লেনদেন ধরন: {selectedVoucher.typeName}</p>
                </div>
              </div>

              {/* Itemized Line Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">বিবরণ / সেবা</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">মূল্য (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="p-3">
                        <p className="font-bold text-white">{selectedVoucher.title}</p>
                        <p className="text-[10px] text-slate-500">{selectedVoucher.note || selectedVoucher.typeName}</p>
                      </td>
                      <td className="p-3 text-center text-slate-300">১ টি</td>
                      <td className="p-3 text-right font-black text-white">৳{selectedVoucher.amount.toLocaleString('bn-BD')}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-950/80 border-t border-slate-800">
                    <tr>
                      <td colSpan={2} className="p-3 text-right font-bold text-slate-400">সর্বমোট প্রদেয় / পরিশোধিত:</td>
                      <td className="p-3 text-right font-black text-base text-sky-400">
                        ৳{selectedVoucher.amount.toLocaleString('bn-BD')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Stamp & Signature */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                <div>
                  <p>ভাউচার জেনারেটেড: {new Date().toLocaleString('bn-BD')}</p>
                  <p>সিস্টেম অনুমোদিত ই-মানি রিসিট।</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-slate-700 pb-1 font-bold text-slate-400">
                    প্রশাসনিক হিসাবরক্ষক
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">PTEN IT Accounts Ledger</p>
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintVoucher}
                  className="px-4 py-2 bg-[#047857] hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট ভাউচার / PDF</span>
                </button>

                <button
                  onClick={() => handleCopyVoucherText(selectedVoucher)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি লিংক/তথ্য</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedVoucher(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW COMPANY BILL / VOUCHER */}
      {addBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-black text-white">নতুন প্রাতিষ্ঠানিক বিল বা খরচ ভাউচার</h3>
              </div>
              <button onClick={() => setAddBillModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewBillSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">বিলের শিরোনাম / বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={newBillForm.title}
                  onChange={e => setNewBillForm({ ...newBillForm, title: e.target.value })}
                  placeholder="যেমন: মাসিক ক্লাউড সার্ভার ও হোস্টিং রিনিউয়াল"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ক্যাটাগরি</label>
                  <select
                    value={newBillForm.category}
                    onChange={e => setNewBillForm({ ...newBillForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="অফিস ভাড়া ও ইউটিলিটি">অফিস ভাড়া ও ইউটিলিটি</option>
                    <option value="ক্লাউড ও ডেডিকেটেড সার্ভার">ক্লাউড ও ডেডিকেটেড সার্ভার</option>
                    <option value="ইন্টারনেট ও সফটওয়্যার লাইসেন্স">ইন্টারনেট ও সফটওয়্যার লাইসেন্স</option>
                    <option value="টিম স্যালারি ও সম্মানী">টিম স্যালারি ও সম্মানী</option>
                    <option value="বিজ্ঞাপন ও প্রমোশন">বিজ্ঞাপন ও প্রমোশন</option>
                    <option value="হার্ডওয়্যার ও অফিস সরঞ্জাম">হার্ডওয়্যার ও অফিস সরঞ্জাম</option>
                    <option value="বিবিধ অফিস ব্যয়">বিবিধ অফিস ব্যয়</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newBillForm.amount}
                    onChange={e => setNewBillForm({ ...newBillForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ভেন্ডর / প্রাপকের নাম *</label>
                  <input
                    type="text"
                    required
                    value={newBillForm.payerName}
                    onChange={e => setNewBillForm({ ...newBillForm, payerName: e.target.value })}
                    placeholder="যেমন: DigitalOcean / বাড়িওয়ালা মোঃ করিম"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">মোবাইল / যোগাযোগের নাম্বার</label>
                  <input
                    type="text"
                    value={newBillForm.payerPhone}
                    onChange={e => setNewBillForm({ ...newBillForm, payerPhone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">পেমেন্ট গেটওয়ে</label>
                  <select
                    value={newBillForm.gateway}
                    onChange={e => setNewBillForm({ ...newBillForm, gateway: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Rocket">রকেট (Rocket)</option>
                    <option value="Bank">ব্যাংক অ্যাকাউন্ট</option>
                    <option value="Cash">ক্যাশ ইন হ্যান্ড</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">ট্রানজেকশন আইডি (TrxID) *</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      required
                      value={newBillForm.transactionId}
                      onChange={e => setNewBillForm({ ...newBillForm, transactionId: e.target.value })}
                      placeholder="যেমন: 8N7X9K2P"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setNewBillForm({ ...newBillForm, transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}` })}
                      className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded-lg hover:text-white cursor-pointer"
                    >
                      জেনারেট
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">নোট / অতিরিক্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={newBillForm.note}
                  onChange={e => setNewBillForm({ ...newBillForm, note: e.target.value })}
                  placeholder="বিলের মেমো বা চেক নম্বর সম্পর্কিত তথ্য..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddBillModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#047857] hover:bg-blue-500 text-white rounded-xl font-black shadow transition cursor-pointer"
                >
                  বিল যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAYOUT ACTION MODAL (APPROVE / REJECT WITH TrxID) */}
      {payoutActionModal.isOpen && payoutActionModal.payout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              {payoutActionModal.actionType === 'approve' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-sky-400" />
                  <span>পেআউট অনুমোদন ও তহবিল ছাড়করণ</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>পেআউট অনুরোধ প্রত্যাখ্যান</span>
                </>
              )}
            </h3>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">আবেদনকারী:</span>
                <span className="font-bold text-white">{payoutActionModal.payout.teacherName || payoutActionModal.payout.partyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">উত্তোলনের পরিমাণ:</span>
                <span className="font-black text-sm text-sky-400">৳{payoutActionModal.payout.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">প্রাপকের একাউন্ট:</span>
                <span className="font-mono text-slate-200">
                  {payoutActionModal.payout.paymentMethod || payoutActionModal.payout.gateway} - {payoutActionModal.payout.accountNumber}
                </span>
              </div>
            </div>

            {payoutActionModal.actionType === 'approve' ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">কোম্পানির প্রেরক একাউন্ট</label>
                  <select
                    value={payoutActionModal.debitAccount}
                    onChange={e => setPayoutActionModal({ ...payoutActionModal, debitAccount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="bKash-merchant">বিকাশ মার্চেন্ট (01712345678)</option>
                    <option value="nagad-corp">নগদ কর্পোরেট (01700000000)</option>
                    <option value="dbbl-bank">ডাচ-বাংলা ব্যাংক (2181100098765)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">অফিসিয়াল ডিসবার্স TrxID *</label>
                  <input
                    type="text"
                    required
                    value={payoutActionModal.trxIdInput}
                    onChange={e => setPayoutActionModal({ ...payoutActionModal, trxIdInput: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-bold">বাতিলের কারণ</label>
                <textarea
                  rows={3}
                  value={payoutActionModal.rejectionReason}
                  onChange={e => setPayoutActionModal({ ...payoutActionModal, rejectionReason: e.target.value })}
                  placeholder="প্রত্যাখ্যানের সঠিক কারণ উল্লেখ করুন..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPayoutActionModal({ ...payoutActionModal, isOpen: false })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmPayoutAction}
                className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow cursor-pointer transition ${
                  payoutActionModal.actionType === 'approve'
                    ? 'bg-[#047857] hover:bg-blue-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {payoutActionModal.actionType === 'approve' ? 'অনুমোদন ও পরিশোধ করুন' : 'প্রত্যাখ্যান নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
