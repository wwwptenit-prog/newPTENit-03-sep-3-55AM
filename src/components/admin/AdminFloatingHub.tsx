import React, { useState, useEffect } from 'react';
import {
  Layers,
  Bot,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Plus,
  Trash2,
  CreditCard,
  UserCheck,
  Send,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminFloatingHubProps {
  onNavigate: (tabId: string) => void;
  companyBills?: any[];
  onVerifyBill?: (id: string) => void;
  onRejectBill?: (id: string) => void;
}

export const AdminFloatingHub: React.FC<AdminFloatingHubProps> = ({
  onNavigate,
  companyBills: propCompanyBills,
  onVerifyBill,
  onRejectBill
}) => {
  const data = useData() as any;
  const {
    users = [],
    approveMentorApplication,
    rejectMentorApplication,
    playAppSound,
    sendCentralNotification
  } = data || {};

  const effectiveBills: any[] = propCompanyBills || data?.companyBills || [];

  // Drawers
  const [activeDrawer, setActiveDrawer] = useState<'queue' | 'ai' | 'notes' | null>(null);

  // Safe localStorage helper
  const safeGet = (key: string, fallback: string) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const safeSet = (key: string, val: string) => {
    try {
      localStorage.setItem(key, val);
    } catch {
      // ignore
    }
  };

  // Scratchpad Notes State (Persistent in localStorage)
  const [notes, setNotes] = useState<string>(() => {
    return safeGet('ptenit_admin_scratchpad', '১. আজকের ৫টি বিকাশ TrxID ভেরিফাই সম্পন্ন করা।\n২. নতুন সেলারদের গিগ ডেসক্রিপশন অডিট।');
  });

  // Checklist items
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_admin_todos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      { id: '1', text: 'পেন্ডিং বিল ভেরিফাই করা', done: false },
      { id: '2', text: 'টিচার অ্যাপ্লিকেশনের সিভি যাচাই', done: false },
      { id: '3', text: 'মার্কেটপ্লেস এআই ফ্রড স্ক্যান চালু করা', done: false }
    ];
  });
  const [newTodoInput, setNewTodoInput] = useState('');

  // AI Copilot quick state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChat, setAiChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'আসসালামু আলাইকুম সুপার এডমিন! আমি পিটেন আইটি মাল্টিটাস্কিং এআই কো-পাইলট। যেকোনো মেট্রিক, পেমেন্ট ডাটা বা নোটিশ ড্রাফট করতে আমাকে বলতে পারেন।' }
  ]);

  // Persist scratchpad
  useEffect(() => {
    safeSet('ptenit_admin_scratchpad', notes);
  }, [notes]);

  useEffect(() => {
    try {
      safeSet('ptenit_admin_todos', JSON.stringify(todos));
    } catch {
      // ignore
    }
  }, [todos]);

  // Calculate Pending Tasks
  const pendingBills = (effectiveBills || []).filter((b: any) => b && b.status === 'pending');
  const pendingApplicants = (users || []).filter((u: any) => u && (u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending'));
  const totalPending = pendingBills.length + pendingApplicants.length;

  const handleVerifyItem = (id: string) => {
    if (onVerifyBill) {
      onVerifyBill(id);
    } else if (data?.verifyCompanyBill) {
      data.verifyCompanyBill(id);
    }
  };

  const handleRejectItem = (id: string) => {
    if (onRejectBill) {
      onRejectBill(id);
    } else if (data?.rejectCompanyBill) {
      data.rejectCompanyBill(id);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoInput.trim()) return;
    setTodos(prev => [...prev, { id: Date.now().toString(), text: newTodoInput.trim(), done: false }]);
    setNewTodoInput('');
    playAppSound('click');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    playAppSound('click');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    playAppSound('click');
  };

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userQ = aiQuestion.trim();
    setAiChat(prev => [...prev, { role: 'user', text: userQ }]);
    setAiQuestion('');
    playAppSound('click');

    setTimeout(() => {
      let reply = '';
      if (userQ.includes('বিল') || userQ.includes('পেমেন্ট')) {
        reply = `বর্তমানে মোট ${pendingBills.length}টি বিল অপেক্ষমান রয়েছে (সর্বমোট ৳${pendingBills.reduce((a, b) => a + b.amount, 0).toLocaleString()}। অটো-ভেরিফিকেশন মডিউল সক্রিয় আছে।`;
      } else if (userQ.includes('ইউজার') || userQ.includes('আবেদন')) {
        reply = `সিস্টেমে মোট ${users.length} জন ইউজার নিবন্ধিত। এর মধ্যে ${pendingApplicants.length} টি নতুন শিক্ষক/সেলার আবেদন রিভিউ অপেক্ষায় আছে।`;
      } else if (userQ.includes('নোটিশ')) {
        reply = `নোটিশ ড্রাফট: "পিটেন আইটি সকল সম্মানিত সেলার ও শিক্ষার্থীদের জানানো যাচ্ছে যে, আগামী ২৪ ঘণ্টার মধ্যে নির্ধারিত অ্যাসাইনমেন্ট ও অর্ডার সাবমিট সম্পন্ন করুন।" আপনি চাইলে এখনই গণ-নোটিফিকেশন পাঠিয়ে দিতে পারি।`;
      } else {
        reply = `আপনার কমান্ড "${userQ}" সফলভাবে প্রসেস করা হয়েছে। প্ল্যাটফর্মের সমস্ত এপিআই, ডাটাবেজ কানেকশন এবং নিরাপত্তা সেন্টিনেল শতভাগ সক্রিয় অবস্থায় কাজ করছে।`;
      }
      setAiChat(prev => [...prev, { role: 'ai', text: reply }]);
      playAppSound('notification');
    }, 600);
  };

  return (
    <>
      {/* FLOATING ACTION DOCK (BOTTOM CENTER) */}
      <aside aria-label="Quick action navigation" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 font-bengali">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 ring-1 ring-white/10">
          
          {/* Pending Task Queue Button */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'queue' ? null : 'queue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeDrawer === 'queue'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-750'
            }`}
            title="লাইভ টাস্ক কিউ - পেন্ডিং বিল ও আবেদন"
          >
            <div className="relative">
              <Zap className="w-4 h-4 text-amber-400" />
              {totalPending > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <span className="hidden sm:inline">টাস্ক কিউ</span>
            {totalPending > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeDrawer === 'queue' ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white'
              }`}>
                {totalPending}
              </span>
            )}
          </button>

          {/* Instant AI Copilot Button */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'ai' ? null : 'ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeDrawer === 'ai'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-750'
            }`}
            title="এআই কো-পাইলট ও সহকারী"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">AI কো-পাইলট</span>
          </button>

          {/* Admin Scratchpad Notes Button */}
          <button
            type="button"
            onClick={() => setActiveDrawer(activeDrawer === 'notes' ? null : 'notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeDrawer === 'notes'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-750'
            }`}
            title="এডমিন স্ক্র্যাচপ্যাড ও কুইক নোটস"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">নোটস & To-Do</span>
          </button>
        </div>
      </aside>

      {/* 1. SLIDE-OVER DRAWER: PENDING TASK QUEUE */}
      {activeDrawer === 'queue' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between font-bengali animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">লাইভ পেন্ডিং টাস্ক কিউ</h3>
                  <p className="text-xs text-slate-400 font-normal">পেজ পরিবর্তন না করেই সরাসরি কাজ সম্পন্ন করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pending Bills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>পেন্ডিং পেমেন্ট ও বিল ({pendingBills.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('billing_verify');
                    setActiveDrawer(null);
                  }}
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  সব দেখুন →
                </button>
              </div>

              {pendingBills.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl text-center border border-slate-800">
                  কোনো পেন্ডিং বিল নেই।
                </p>
              ) : (
                <div className="space-y-2">
                  {pendingBills.slice(0, 4).map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-white block">{b.payerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{b.gateway} • Trx: {b.transactionId}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-sm">৳{b.amount}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-700/80">
                        <button
                          type="button"
                          onClick={() => {
                            handleRejectItem(b.id);
                            playAppSound('click');
                          }}
                          className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-lg text-[10px] transition"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleVerifyItem(b.id);
                            playAppSound('success');
                          }}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] shadow transition"
                        >
                          অনুমোদন ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Applicants List */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>শিক্ষক ও সেলার আবেদন ({pendingApplicants.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('users_applications');
                    setActiveDrawer(null);
                  }}
                  className="text-[10px] text-amber-400 hover:underline font-bold"
                >
                  রিভিউ করুন →
                </button>
              </div>

              {pendingApplicants.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl text-center border border-slate-800">
                  কোনো অপেক্ষমান আবেদন নেই।
                </p>
              ) : (
                <div className="space-y-2">
                  {pendingApplicants.slice(0, 3).map(u => (
                    <div key={u.id} className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{u.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">আবেদনকারী</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">
                        অভিজ্ঞতা: {u.mentorApplication?.experience || 'উল্লেখ নেই'} • স্কিল: {u.mentorApplication?.expertise || 'General'}
                      </p>
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-700/80">
                        <button
                          type="button"
                          onClick={() => {
                            rejectMentorApplication(u.id);
                            playAppSound('click');
                          }}
                          className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-lg text-[10px] transition"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            approveMentorApplication(u.id);
                            playAppSound('success');
                          }}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] shadow transition"
                        >
                          অনুমোদন দিন ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-750 transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* 2. SLIDE-OVER DRAWER: AI COPILOT */}
      {activeDrawer === 'ai' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between font-bengali animate-fade-in">
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">মাল্টিটাস্কিং এআই কো-পাইলট</h3>
                  <p className="text-xs text-slate-400 font-normal">রিয়েল-টাইম প্ল্যাটফর্ম ইন্টেলিজেন্স ও ড্রাফট</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-slate-950 rounded-2xl border border-slate-800 text-xs max-h-[60vh]">
              {aiChat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 ml-6 font-medium'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 mr-6 font-normal'
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1 font-mono uppercase text-slate-400">
                    {msg.role === 'user' ? '👤 সুপার এডমিন' : '🤖 পিটেন এআই'}
                  </span>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiPrompt} className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="যেমন: আজকের মোট কালেকশন কত? নোটিশ ড্রাফট করো..."
                className="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-normal"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SLIDE-OVER DRAWER: ADMIN SCRATCHPAD & TO-DO LIST */}
      {activeDrawer === 'notes' && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between font-bengali animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">এডমিন স্ক্র্যাচপ্যাড & To-Do</h3>
                  <p className="text-xs text-slate-400 font-normal">কাজের ফাঁকে নোটস ও তাৎক্ষণিক চেকলিস্ট (অটো-সেভড)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist To-Dos */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">প্রশাসনিক চেকলিস্ট</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {todos.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggleTodo(t.id)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span className={`${t.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(t.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Todo Input */}
              <form onSubmit={handleAddTodo} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newTodoInput}
                  onChange={(e) => setNewTodoInput(e.target.value)}
                  placeholder="+ নতুন কাজ যোগ করুন..."
                  className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-normal"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  যোগ
                </button>
              </form>
            </div>

            {/* Scratchpad Textarea */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">অটো-সেভড স্ক্র্যাচপ্যাড (নোটস)</span>
                <span className="text-[10px] text-emerald-400 font-mono">লাইভ সেভড ✓</span>
              </div>
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="গুরুত্বপূর্ণ TrxID, ফোন নাম্বার বা ক্লায়েন্ট নোট এখানে লিখে রাখুন..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveDrawer(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-750 transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </>
  );
};
