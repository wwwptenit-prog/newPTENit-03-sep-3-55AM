import React, { useState, useEffect, useMemo } from 'react';
import {
  Headphones,
  Users,
  MessageSquare,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  Check,
  Zap,
  Sparkles,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export interface SupportTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerRole: 'student' | 'buyer' | 'seller' | 'visitor';
  department: 'Finance' | 'Academy' | 'Marketplace' | 'Operations' | 'Administration';
  subject: string;
  assignedStaffId: string;
  assignedStaffName: string;
  originalStaffName?: string;
  isAutoRerouted?: boolean;
  rerouteReason?: string;
  status: 'open' | 'in_progress' | 'auto_rerouted' | 'resolved';
  priority: 'urgent' | 'high' | 'normal';
  createdAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'staff' | 'system';
    senderName: string;
    text: string;
    time: string;
  }[];
}

export interface SupportAgent {
  id: string;
  name: string;
  designation: string;
  department: 'Finance' | 'Academy' | 'Marketplace' | 'Operations' | 'Administration';
  phone: string;
  email: string;
  dutyStatus: 'available' | 'busy' | 'offline';
  activeTickets: number;
  backupStaffId: string;
  backupStaffName: string;
  responsibilities: string[];
}

const DEFAULT_AGENTS: SupportAgent[] = [
  {
    id: 'staff-01',
    name: 'কাজী মিজানুর রহমান',
    designation: 'চিফ এক্সিকিউটিভ / সুপার এডমিন',
    department: 'Administration',
    phone: '01886221191',
    email: 'mdskazi2016@gmail.com',
    dutyStatus: 'available',
    activeTickets: 1,
    backupStaffId: 'staff-02',
    backupStaffName: 'ফারহানা ইয়াসমিন',
    responsibilities: ['সার্বিক প্ল্যাটফর্ম সুপারভিশন', 'জরুরি ডিসপুট মীমাংসা', 'পলিসি সাপোর্ট']
  },
  {
    id: 'staff-02',
    name: 'ফারহানা ইয়াসমিন',
    designation: 'সিনিয়র অপারেশনস ডিরেক্টর',
    department: 'Operations',
    phone: '01711223344',
    email: 'farhana.ops@ptenit.com',
    dutyStatus: 'available',
    activeTickets: 2,
    backupStaffId: 'staff-01',
    backupStaffName: 'কাজী মিজানুর রহমান',
    responsibilities: ['অ্যাকাউন্ট ভেরিফিকেশন', 'লগইন সমস্যা', 'সাধারণ ও টেকনিক্যাল হেল্পডেস্ক']
  },
  {
    id: 'staff-03',
    name: 'শফিকুল ইসলাম চৌধুরী',
    designation: 'হেড অব একাউন্টস ও ফাইন্যান্স',
    department: 'Finance',
    phone: '01912334455',
    email: 'shafiq.finance@ptenit.com',
    dutyStatus: 'busy', // Marked busy to demonstrate auto-reroute
    activeTickets: 3,
    backupStaffId: 'staff-02',
    backupStaffName: 'ফারহানা ইয়াসমিন',
    responsibilities: ['বিকাশ/নগদ/রকেট পেমেন্ট ভেরিফাই', 'উত্তোলন ও ক্যাশআউট', 'রিফান্ড রিকোয়েস্ট']
  },
  {
    id: 'staff-04',
    name: 'তানভীর হাসান',
    designation: 'মার্কেটপ্লেস লিড মডারেটর',
    department: 'Marketplace',
    phone: '01688997766',
    email: 'tanvir.market@ptenit.com',
    dutyStatus: 'available',
    activeTickets: 1,
    backupStaffId: 'staff-02',
    backupStaffName: 'ফারহানা ইয়াসমিন',
    responsibilities: ['মার্কেটপ্লেস গিগ অর্ডার', 'বায়ার ও সেলার মেসেজিং', 'এসক্রো সুরক্ষা ও ডেলিভারি']
  },
  {
    id: 'staff-05',
    name: 'রাফিয়া সুলতানা',
    designation: 'একাডেমিক কোর্স কো-অর্ডিনেটর',
    department: 'Academy',
    phone: '01555443322',
    email: 'rafia.academy@ptenit.com',
    dutyStatus: 'available',
    activeTickets: 1,
    backupStaffId: 'staff-02',
    backupStaffName: 'ফারহানা ইয়াসমিন',
    responsibilities: ['কোর্স কারিকুলাম ও লাইভ ক্লাস', 'শিক্ষার্থী ভর্তি', 'টিচার ও মেন্টর সমন্বয়']
  }
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-9901',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '01712998877',
    customerEmail: 'tanvir.std@gmail.com',
    customerRole: 'student',
    department: 'Finance',
    subject: 'বিকাশে কোর্স ফি পাঠিয়েছি কিন্তু ভেরিফিকেশন পেন্ডিং দেখাচ্ছে',
    assignedStaffId: 'staff-02', // Rerouted from Shafiqul because Shafiqul was busy!
    assignedStaffName: 'ফারহানা ইয়াসমিন',
    originalStaffName: 'শফিকুল ইসলাম চৌধুরী',
    isAutoRerouted: true,
    rerouteReason: 'শফিকুল ইসলাম চৌধুরী (ফাইন্যান্স) বর্তমানে অন্য গ্রাহকের কলে ব্যস্ত থাকায় সিস্টেম স্বয়ংক্রিয়ভাবে ফারহানা ইয়াসমিনের কাছে স্থানান্তর করেছে।',
    status: 'auto_rerouted',
    priority: 'urgent',
    createdAt: '১০ মিনিট আগে',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'তানভীর আহমেদ',
        text: 'আসসালামু আলাইকুম, আমি পূর্ণাঙ্গ ওয়েব ডেভেলপমেন্ট কোর্সের জন্য বিকাশে ৩,৫০০ টাকা পাঠিয়েছি (TrxID: 9J32KL89)। এখনও এপ্রুভ হয়নি, আজকের ওরিয়েন্টেশন ক্লাসে যোগ দিতে পারছি না।',
        time: '১০ মিনিট আগে'
      },
      {
        id: 'm2',
        sender: 'system',
        senderName: 'সিস্টেম অটো-ডেসপ্যাচ',
        text: '⚡ শফিকুল ইসলাম চৌধুরী বর্তমানে একাধিক গ্রাহকের কাজে ব্যস্ত থাকায় টিকিটটি ফারহানা ইয়াসমিন-এর ডেস্কে স্বয়ংক্রিয়ভাবে স্থানান্তর করা হয়েছে।',
        time: '৮ মিনিট আগে'
      },
      {
        id: 'm3',
        sender: 'staff',
        senderName: 'ফারহানা ইয়াসমিন',
        text: 'ওয়ালাইকুম আসসালাম তানভীর ভাই। আপনার ট্রানজেকশন আইডি পেয়েছি, আমি একাউন্টস থেকে ম্যানুয়ালি এখনই ভেরিফাই করে ক্লাস অ্যাক্টিভ করে দিচ্ছি। অনুগ্রহ করে ২ মিনিট অপেক্ষা করুন।',
        time: '৫ মিনিট আগে'
      }
    ]
  },
  {
    id: 'TCK-9902',
    customerName: 'মাহমুদুল হক (বায়ার)',
    customerPhone: '01823456789',
    customerEmail: 'mahmud.agency@gmail.com',
    customerRole: 'buyer',
    department: 'Marketplace',
    subject: 'গিগ অর্ডার #ORD-4421 এর রিভিশন জমা দেওয়া হয়েছে কি না জানতে চাই',
    assignedStaffId: 'staff-04',
    assignedStaffName: 'তানভীর হাসান',
    status: 'in_progress',
    priority: 'high',
    createdAt: '২৫ মিনিট আগে',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'মাহমুদুল হক',
        text: 'আমি লোগো ডিজাইনের জন্য সেলারকে রিভিশন দিয়েছিলাম। সেলার মেসেজের উত্তর দিচ্ছে না। অর্ডার কাউন্টডাউন শেষ হওয়ার আগে একটু আপডেট দরকার।',
        time: '২৫ মিনিট আগে'
      },
      {
        id: 'm2',
        sender: 'staff',
        senderName: 'তানভীর হাসান',
        text: 'আসসালামু আলাইকুম স্যার। আমি সেলারের সাথে যোগাযোগ করেছি, সে রাত ৮টার মধ্যে ফাইনাল ভেক্টর ফাইলসহ রিভিশন ফাইল সাবমিট করবে বলে নিশ্চিত করেছে। আমি পার্সোনালি অর্ডারটি মনিটর করছি।',
        time: '১৫ মিনিট আগে'
      }
    ]
  },
  {
    id: 'TCK-9903',
    customerName: 'নুসরাত জাহান',
    customerPhone: '01511223344',
    customerEmail: 'nusrat.ux@gmail.com',
    customerRole: 'student',
    department: 'Academy',
    subject: 'ইউআই/ইউএক্স ব্যাচ-০৪ এর জুম ক্লাস রেকর্ডিং পাচ্ছি না',
    assignedStaffId: 'staff-05',
    assignedStaffName: 'রাফিয়া সুলতানা',
    status: 'open',
    priority: 'normal',
    createdAt: '৩৫ মিনিট আগে',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'নুসরাত জাহান',
        text: 'গতকালের ক্লাস নম্বর ০৭ এর লাইভ রেকর্ডিং এবং প্র্যাকটিস ফিগমা ফাইলটি স্টুডেন্ট পোর্টালে আপলোড হয়েছে কি? ড্রাইভে এক্সেস চাচ্ছে।',
        time: '৩৫ মিনিট আগে'
      }
    ]
  },
  {
    id: 'TCK-9904',
    customerName: 'রাশেদুল করিম (সেলার)',
    customerPhone: '01999887766',
    customerEmail: 'rashed.dev@gmail.com',
    customerRole: 'seller',
    department: 'Operations',
    subject: 'প্রোফাইল ২-স্টেপ ভেরিফিকেশনে ওটিপি আসছে না',
    assignedStaffId: 'staff-02',
    assignedStaffName: 'ফারহানা ইয়াসমিন',
    status: 'resolved',
    priority: 'normal',
    createdAt: '২ ঘণ্টা আগে',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'রাশেদুল করিম',
        text: 'আমি সেলার প্রোফাইলে ফোন নাম্বার আপডেট করার সময় এসএমএস ওটিপি পাচ্ছিলাম না।',
        time: '২ ঘণ্টা আগে'
      },
      {
        id: 'm2',
        sender: 'staff',
        senderName: 'ফারহানা ইয়াসমিন',
        text: 'আমরা এসএমএস গেটওয়ে রিসেট করেছি এবং সরাসরি ফোন দিয়ে ওটিপি নিশ্চিত করেছি। আপনার প্রোফাইল এখন সম্পূর্ণ ভেরিফাইড।',
        time: '১ ঘণ্টা আগে'
      }
    ]
  }
];

export const CustomerCareDispatcher: React.FC = () => {
  const { currentUser, playAppSound, sendCentralNotification } = useData();

  // Load persistent agents and tickets or defaults
  const [agents, setAgents] = useState<SupportAgent[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_support_agents');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_AGENTS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_support_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TICKETS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Save to localStorage
  const saveAgents = (newAgents: SupportAgent[]) => {
    setAgents(newAgents);
    try {
      localStorage.setItem('ptenit_support_agents', JSON.stringify(newAgents));
    } catch (e) {
      console.error(e);
    }
  };

  const saveTickets = (newTickets: SupportTicket[]) => {
    setTickets(newTickets);
    try {
      localStorage.setItem('ptenit_support_tickets', JSON.stringify(newTickets));
    } catch (e) {
      console.error(e);
    }
  };

  // Selected ticket
  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;
  }, [tickets, selectedTicketId]);

  // Current logged in user as support staff
  const currentStaffProfile = useMemo(() => {
    if (currentUser?.staffMember) {
      return agents.find(a => a.email === currentUser.email || a.id === currentUser.staffMember.id) || agents[0];
    }
    // Super admin default
    return agents[0];
  }, [currentUser, agents]);

  // Toggle agent duty status (available vs busy)
  const toggleAgentDutyStatus = (agentId: string) => {
    const updated = agents.map(a => {
      if (a.id === agentId) {
        const nextStatus: SupportAgent['dutyStatus'] =
          a.dutyStatus === 'available' ? 'busy' : a.dutyStatus === 'busy' ? 'offline' : 'available';
        return { ...a, dutyStatus: nextStatus };
      }
      return a;
    });
    saveAgents(updated);
    playAppSound('notification');

    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      sendCentralNotification({
        title: '🎧 সাপোর্ট স্ট্যাটাস আপডেট',
        message: `${agent.name}-এর সাপোর্ট স্ট্যাটাস পরিবর্তন করা হয়েছে।`,
        type: 'info',
        category: 'system'
      });
    }
  };

  // Send reply to current ticket
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'staff' as const,
      senderName: currentStaffProfile?.name || currentUser?.name || 'সাপোর্ট টিম',
      text: replyText.trim(),
      time: 'এইমাত্র'
    };

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'in_progress' as const,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    saveTickets(updated);
    setReplyText('');
    playAppSound('message');
  };

  // Mark ticket as resolved
  const handleResolveTicket = (ticketId: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'resolved' as const,
          messages: [
            ...t.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'system' as const,
              senderName: 'সিস্টেম নোটিশ',
              text: `✅ টিকিটটি ${currentStaffProfile?.name || 'এডমিন'} দ্বারা সফলভাবে সমাধান (Resolved) হিসেবে চিহ্নিত হয়েছে।`,
              time: 'এইমাত্র'
            }
          ]
        };
      }
      return t;
    });
    saveTickets(updated);
    playAppSound('success');
  };

  // Manual Transfer ticket to another staff
  const handleTransferTicket = () => {
    if (!selectedTicket || !transferTargetId) return;
    const targetAgent = agents.find(a => a.id === transferTargetId);
    if (!targetAgent) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          assignedStaffId: targetAgent.id,
          assignedStaffName: targetAgent.name,
          originalStaffName: t.assignedStaffName,
          isAutoRerouted: true,
          rerouteReason: `${currentStaffProfile?.name || 'এডমিন'} ম্যানুয়ালি টিকিটটি ${targetAgent.name}-এর কাছে হস্তান্তর করেছেন।`,
          status: 'auto_rerouted' as const,
          messages: [
            ...t.messages,
            {
              id: `sys-${Date.now()}`,
              sender: 'system' as const,
              senderName: 'সিস্টেম ট্রান্সফার',
              text: `🔄 টিকিটটি ${targetAgent.name} (${targetAgent.department})-এর নিকট সফলভাবে হস্তান্তর করা হয়েছে।`,
              time: 'এইমাত্র'
            }
          ]
        };
      }
      return t;
    });

    saveTickets(updated);
    setShowTransferModal(false);
    playAppSound('notification');
    alert(`টিকিটটি সফলভাবে ${targetAgent.name}-এর কাছে স্থানান্তর করা হয়েছে!`);
  };

  // Simulate an incoming customer message to test Auto-Routing Failover
  const handleSimulateIncomingMessage = (dept: 'Finance' | 'Academy' | 'Marketplace') => {
    // Find designated agent for this department
    const designated = agents.find(a => a.department === dept);
    let assigned = designated || agents[0];
    let isRerouted = false;
    let rerouteNote = '';

    // If designated agent is busy or offline, auto-route to their backup!
    if (designated && (designated.dutyStatus === 'busy' || designated.dutyStatus === 'offline')) {
      const backup = agents.find(a => a.id === designated.backupStaffId) || agents[0];
      assigned = backup;
      isRerouted = true;
      rerouteNote = `সিস্টেম স্মার্ট অ্যালগরিদম: ${designated.name} (${designated.department}) বর্তমানে ${
        designated.dutyStatus === 'busy' ? 'ব্যস্ত (Busy)' : 'অফলাইন'
      } থাকায় কাস্টমার কেয়ার পলিসি অনুযায়ী মেসেজটি স্বয়ংক্রিয়ভাবে ${backup.name}-এর নিকট রি-রুট হয়েছে।`;
    }

    const newTicketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const sampleSubjects = {
      Finance: 'আমার বিকাশ অ্যাকাউন্টের মাধ্যমে ফি প্রদান করেছি, ক্যাশআউট ভেরিফাই প্রয়োজন',
      Academy: 'আগামীকালের প্রজেক্ট রিভিউ ক্লাসের শিডিউল ও অ্যাসাইনমেন্ট লিংক পাচ্ছি না',
      Marketplace: 'বায়ার কাস্টম অফার পাঠিয়েছে, এসক্রো ডিপোজিট কনফার্মেশন চাই'
    };

    const newTicket: SupportTicket = {
      id: newTicketId,
      customerName: 'আরিফুল ইসলাম (টেস্ট ইউজার)',
      customerPhone: '01811223344',
      customerEmail: 'ariful.user@gmail.com',
      customerRole: dept === 'Academy' ? 'student' : dept === 'Marketplace' ? 'buyer' : 'seller',
      department: dept,
      subject: sampleSubjects[dept],
      assignedStaffId: assigned.id,
      assignedStaffName: assigned.name,
      originalStaffName: isRerouted ? designated?.name : undefined,
      isAutoRerouted: isRerouted,
      rerouteReason: rerouteNote,
      status: isRerouted ? 'auto_rerouted' : 'open',
      priority: 'high',
      createdAt: 'এইমাত্র',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'customer',
          senderName: 'আরিফুল ইসলাম',
          text: `আসসালামু আলাইকুম। ${sampleSubjects[dept]}। অনুগ্রহ করে দ্রুত রেসপন্স করবেন।`,
          time: 'এইমাত্র'
        },
        ...(isRerouted ? [{
          id: `sys-reroute-${Date.now()}`,
          sender: 'system' as const,
          senderName: 'অটো-রাউটিং রোবট',
          text: `⚡ ${rerouteNote}`,
          time: 'এইমাত্র'
        }] : [])
      ]
    };

    saveTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicketId);
    playAppSound('notification');

    sendCentralNotification({
      title: isRerouted ? '⚡ টিকিট অটো-রি-রুট হয়েছে!' : '🎧 নতুন কাস্টমার কেয়ার মেসেজ',
      message: isRerouted
        ? `${designated?.name} ব্যস্ত থাকায় মেসেজটি ${assigned.name}-এর কাছে অটো-ট্রান্সফার হয়েছে!`
        : `${newTicket.customerName}-এর নতুন সাপোর্ট মেসেজ এসেছে।`,
      type: isRerouted ? 'warning' : 'info',
      category: 'system'
    });
  };

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch = !searchQuery.trim() ||
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerPhone.includes(searchQuery) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = deptFilter === 'all' || t.department === deptFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [tickets, searchQuery, deptFilter, statusFilter]);

  return (
    <div className="space-y-5 font-bengali">
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white">
              কাস্টমার কেয়ার ও স্মার্ট অটো-ডেসপ্যাচ সাপোর্ট কনসোল
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-normal max-w-2xl">
            সকল এডমিন ও সাব-এডমিন নিজ নিজ দায়িত্ব অনুসারে সাপোর্ট প্রদান করতে পারেন। কোনো সাব-এডমিন ব্যস্ত (Busy) থাকলে ইনকামিং মেসেজ স্বয়ংক্রিয়ভাবে পরবর্তী সক্রিয় এডমিনের নিকট অটো-ট্রান্সফার হয়।
          </p>
        </div>

        {/* Quick Simulation Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSimulateIncomingMessage('Finance')}
            className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            title="ফাইন্যান্স ডিপার্টমেন্টে টেস্ট মেসেজ পাঠিয়ে অটো-রাউটিং পরীক্ষা করুন"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ ফাইন্যান্স মেসেজ টেস্ট (অটো-রাউটিং)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateIncomingMessage('Marketplace')}
            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>+ মার্কেটপ্লেস মেসেজ টেস্ট</span>
          </button>
        </div>
      </div>

      {/* Sub-Admins Duty & Capacity Matrix */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>সাব-এডমিন দায়িত্ব ও সাপোর্ট রোস্টার (ক্লিক করে ব্যস্ত/ফ্রি টগল করুন)</span>
          </h3>
          <span className="text-[11px] text-amber-400 font-normal">
            ব্যস্ত থাকলে মেসেজ সরাসরি ব্যাকআপ অফিসারের নিকট রি-রুট হবে
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {agents.map(agent => {
            const isBusy = agent.dutyStatus === 'busy';
            const isAvailable = agent.dutyStatus === 'available';
            return (
              <div
                key={agent.id}
                className={`p-3 rounded-xl border transition ${
                  isBusy
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : isAvailable
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-950/30 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">{agent.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleAgentDutyStatus(agent.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer shrink-0 ${
                      isBusy
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                  >
                    {isBusy ? '🔴 ব্যস্ত (Busy)' : isAvailable ? '🟢 অন-ডিউটি' : '⚪ অফলাইন'}
                  </button>
                </div>

                <p className="text-[11px] text-amber-400 font-medium mt-1 truncate">{agent.designation}</p>
                <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                  <p>বিভাগ: <span className="text-slate-200 font-bold">{agent.department}</span></p>
                  <p>ব্যাকআপ: <span className="text-sky-300 font-medium">{agent.backupStaffName}</span></p>
                </div>

                {isBusy && (
                  <p className="text-[9px] text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded mt-2 font-normal">
                    ⚠️ ব্যস্ত থাকায় ইনকামিং মেসেজ {agent.backupStaffName}-এ রি-রুট হবে
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Support Workspace: Left Ticket List, Right Active Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: TICKETS INBOX (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters and Search */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="গ্রাহকের নাম, ফোন, বিষয় বা টিকিট আইডি খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="all">সকল বিভাগ ({tickets.length})</option>
                <option value="Finance">ফাইন্যান্স ও পেমেন্ট</option>
                <option value="Academy">একাডেমি ও কোর্স</option>
                <option value="Marketplace">মার্কেটপ্লেস ও গিগ</option>
                <option value="Operations">অপারেশনস ও অ্যাকাউন্ট</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="open">নতুন আগত</option>
                <option value="auto_rerouted">অটো-রি-রুটকৃত</option>
                <option value="in_progress">চলমান চ্যাট</option>
                <option value="resolved">সমাধানকৃত</option>
              </select>
            </div>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-2">
                <Headphones className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">কোনো সাপোর্ট টিকিট খুঁজে পাওয়া যায়নি।</p>
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = selectedTicket?.id === ticket.id;
                const isAutoRerouted = ticket.isAutoRerouted;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500/40 shadow-md'
                        : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] text-amber-400 font-bold">{ticket.id}</span>
                        <span className="text-xs font-bold text-white truncate">{ticket.customerName}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : ticket.status === 'auto_rerouted'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      }`}>
                        {ticket.status === 'resolved' ? 'সমাধানকৃত' : ticket.status === 'auto_rerouted' ? 'অটো-ট্রান্সফারকৃত' : 'অ্যাক্টিভ চ্যাট'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{ticket.subject}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                          {ticket.department}
                        </span>
                        <span>অ্যাসাইন: <strong className="text-sky-300">{ticket.assignedStaffName}</strong></span>
                      </div>
                      <span className="shrink-0">{ticket.createdAt}</span>
                    </div>

                    {isAutoRerouted && (
                      <div className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg p-1.5 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{ticket.rerouteReason || 'ব্যস্ত থাকায় অটো-ট্রান্সফারকৃত'}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CONVERSATION CONSOLE (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-amber-400">{selectedTicket.id}</span>
                    <h3 className="text-sm font-bold text-white">{selectedTicket.customerName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {selectedTicket.customerPhone}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-medium">{selectedTicket.subject}</p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* WhatsApp Connect */}
                  <a
                    href={`https://wa.me/${selectedTicket.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `আসসালামু আলাইকুম ${selectedTicket.customerName}, PTENit কাস্টমার সাপোর্ট থেকে আমি ${currentStaffProfile?.name} আপনার টিকিট (${selectedTicket.id}) সংক্রান্ত বিষয়ে যোগাযোগ করছি।`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
                    title="কাস্টমারের সাথে WhatsApp-এ কথা বলুন"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Transfer to another staff */}
                  <button
                    type="button"
                    onClick={() => {
                      setTransferTargetId(agents[0].id);
                      setShowTransferModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1"
                    title="অন্য কর্মকর্তার কাছে টিকিট ট্রান্সফার করুন"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>হস্তান্তর</span>
                  </button>

                  {/* Mark as Resolved */}
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleResolveTicket(selectedTicket.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সমাধানকৃত</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notice Banner if Auto-Rerouted */}
              {selectedTicket.isAutoRerouted && (
                <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{selectedTicket.rerouteReason}</span>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                {selectedTicket.messages.map(msg => {
                  const isStaff = msg.sender === 'staff';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-amber-300">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs font-normal leading-relaxed ${
                          isStaff
                            ? 'bg-sky-600 text-white rounded-tr-xs'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/90 flex gap-1.5 overflow-x-auto">
                {[
                  'আপনার পেমেন্ট ভেরিফাই করা হয়েছে।',
                  'লাইভ ক্লাস লিংকে জয়েন করতে পারেন।',
                  'অর্ডারটি রিভিশনে পাঠানো হয়েছে।',
                  'আপনার তথ্য আপডেট সম্পন্ন হয়েছে।'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(chip)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="গ্রাহকের কাছে মেসেজ বা নির্দেশনা লিখুন..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>উত্তর দিন</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[700px] flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <Headphones className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">কোনো টিকিট সিলেক্ট করা নেই</h3>
                <p className="text-xs text-slate-400">বাম পাশের তালিকা থেকে যেকোনো ইনকোয়ারি ওপেন করুন।</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Transfer Modal */}
      {showTransferModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full space-y-4 font-bengali">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>অন্য কর্মকর্তার কাছে টিকিট হস্তান্তর</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              টিকিট <strong>{selectedTicket.id}</strong> ({selectedTicket.customerName}) কার কাছে স্থানান্তর করতে চান সিলেক্ট করুন:
            </p>

            <select
              value={transferTargetId}
              onChange={e => setTransferTargetId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.designation} ({a.department}) [{a.dutyStatus === 'busy' ? 'ব্যস্ত' : 'ফ্রি'}]
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleTransferTicket}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                স্থানান্তর নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
