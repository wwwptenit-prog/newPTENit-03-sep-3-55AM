import React, { useState } from 'react';
import {
  Briefcase,
  ShieldCheck,
  X,
  CheckCircle2,
  RotateCw,
  UploadCloud,
  Trash2,
  Zap,
  Paperclip,
  CreditCard,
  Eye,
  ImageIcon,
  AlertCircle
} from 'lucide-react';

export interface SendDirectOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientRole?: string;
  recipientAvatar?: string;
  onSubmit: (data: {
    title: string;
    category: string;
    budget: number;
    budgetRange?: string;
    budgetMode?: 'range' | 'fixed';
    minBudget?: number;
    maxBudget?: number;
    deliveryDays: number;
    description: string;
    skills?: string;
    requirements?: string[];
    attachmentName?: string;
    attachmentUrl?: string;
    coverImage?: string;
    offerType?: 'work_first' | 'paid';
  }) => void;
}

const CATEGORY_PROJECT_TAGS: Record<string, string[]> = {
  "Web Development": ["React", "WordPress", "Node.js", "Laravel", "Tailwind", "Next.js", "PHP", "HTML/CSS"],
  "Graphic Design": ["Logo", "Photoshop", "Illustrator", "Banner", "Branding", "Flyer", "Vector"],
  "Digital Marketing": ["Facebook Ads", "Google Ads", "SEO", "Lead Gen", "Social Media", "Email Marketing"],
  "App Development": ["Flutter", "React Native", "Android", "iOS", "Firebase", "API"],
  "Video Editing": ["Premiere Pro", "After Effects", "Reels/Shorts", "YouTube", "Animation", "Color Grading"],
  "UI/UX Design": ["Figma", "Mobile UI", "Web UI", "Wireframe", "Prototype", "Design System"],
  "Content Writing": ["SEO Article", "Blog Post", "Copywriting", "Bangla Content", "Product Description"],
  "Cyber Security": ["Web Security", "Penetration Testing", "Bug Bounty", "SSL", "Security Audit"],
};

const getSmartRequirementsSuggestions = (title: string, category: string): string[] => {
  const t = (title + " " + (category || "")).toLowerCase();
  if (t.includes("web") || t.includes("ওয়েব") || t.includes("react") || t.includes("site") || t.includes("সাইট") || t.includes("php") || t.includes("wordpress") || t.includes("frontend") || t.includes("fullstack") || t.includes("html") || t.includes("tailwind")) {
    return [
      "রেসপন্সিভ মোবাইল ও পিসি ফ্রেন্ডলি লেআউট",
      "ক্লিন ও অপ্টিমাইজড সোর্স কোড প্রদান",
      "স্পিড অপ্টিমাইজেশন ও এসইও ফ্রেন্ডলি স্ট্রাকচার",
      "সব ব্রাউজার সাপোর্ট ও লাইভ ডিপ্লয়মেন্ট"
    ];
  }
  if (t.includes("logo") || t.includes("লোগো") || t.includes("graphic") || t.includes("গ্রাফিক") || t.includes("banner") || t.includes("ব্যানার") || t.includes("design") || t.includes("ডিজাইন") || t.includes("vector") || t.includes("branding") || t.includes("ব্র্যান্ডিং") || t.includes("flyer")) {
    return [
      "ভেক্টর মূল সোর্স ফাইল (AI, EPS, SVG, PSD)",
      "হাই-রেজোলিউশন স্বচ্ছ PNG ও প্রিন্ট রেডি PDF",
      "ইউনিক কনসেপ্ট ও আকর্ষণীয় কালার ভ্যারিয়েশন",
      "সীমাহীন রিভিশন ও কপিরাইট ট্রান্সফার"
    ];
  }
  if (t.includes("app") || t.includes("অ্যাপ") || t.includes("flutter") || t.includes("android") || t.includes("ios") || t.includes("mobile")) {
    return [
      "অ্যান্ড্রয়েড ও আইওএস উভয় প্ল্যাটফর্ম সাপোর্ট",
      "স্মুথ ইউজার ইন্টারফেস ও দ্রুত পারফরম্যান্স",
      "ফায়ারবেস / REST API ব্যাকএন্ড ইন্টিগ্রেশন",
      "প্লে-স্টোর ও অ্যাপ স্টোর ডিপ্লয়মেন্ট প্রস্তুত"
    ];
  }
  if (t.includes("video") || t.includes("ভিডিও") || t.includes("editing") || t.includes("reels") || t.includes("youtube") || t.includes("short")) {
    return [
      "১০৮০p / ৪K আল্ট্রা এইচডি এক্সপোর্ট",
      "আকর্ষণীয় সাবটাইটেল, সাউন্ড এফেক্ট ও বি-রোল",
      "ইউটিউব ও সোশ্যাল মিডিয়া কপিরাইট-ফ্রি মিউজিক",
      "কালার গ্রেডিং ও স্মুথ মোশন ট্রানজিশন"
    ];
  }
  if (t.includes("marketing") || t.includes("মার্কেটিং") || t.includes("seo") || t.includes("ads") || t.includes("facebook") || t.includes("বিজ্ঞাপন")) {
    return [
      "টার্গেটেড অডিয়েন্স রিসার্চ ও ক্যাম্পেইন সেটআপ",
      "হাই কনভার্টিং অ্যাড কপি ও ক্রিয়েটিভ ডিজাইন",
      "পিক্সেল সেটআপ ও ট্র্যাকিং ইন্টিগ্রেশন",
      "দৈনিক এনালিটিক্স ও পারফরম্যান্স রিপোর্ট প্রদান"
    ];
  }
  return [
    "প্রজেক্ট স্পেসিফিকেশন ও গাইডলাইন অনুযায়ী নিখুঁত কাজ",
    "নির্ধারিত ডেডলাইনের মধ্যে সম্পূর্ণ ডেলিভারি",
    "প্রয়োজনীয় রিভিশন ও কোয়ালিটি নিশ্চয়তা",
    "কাজের অগ্রগতি নিয়ে নিয়মিত আপডেট প্রদান"
  ];
};

const parseBengaliOrEnglishNumber = (val: string | number): number => {
  if (val === undefined || val === null) return NaN;
  const str = String(val).trim();
  if (!str) return NaN;
  const banglaDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const normalized = str.replace(/[০-৯]/g, (d) => banglaDigits[d] || d).replace(/,/g, '');
  return parseFloat(normalized);
};

export const SendDirectOfferModal: React.FC<SendDirectOfferModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientRole,
  recipientAvatar,
  onSubmit
}) => {
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postCoverImage, setPostCoverImage] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postRequirements, setPostRequirements] = useState<string[]>([]);
  const [newReqInput, setNewReqInput] = useState('');
  const [postAttachmentName, setPostAttachmentName] = useState('');
  const [postAttachmentUrl, setPostAttachmentUrl] = useState('');
  
  // Budget & Timeline
  const [postBudgetMode, setPostBudgetMode] = useState<'range' | 'fixed'>('fixed');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [postBudgetFixed, setPostBudgetFixed] = useState('');
  const [postDeliveryDays, setPostDeliveryDays] = useState('');
  const [postOfferType, setPostOfferType] = useState<'work_first' | 'paid'>('work_first');

  const [error, setError] = useState('');
  const [postSubmittedSuccess, setPostSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      setError('দয়া করে প্রজেক্টের শিরোনাম লিখুন');
      return;
    }

    if (!postCategory) {
      setError('দয়া করে ক্যাটাগরি নির্বাচন করুন');
      return;
    }

    let calculatedBudget = 0;
    let computedBudgetRange = '';
    let minBudgetNum: number | undefined;
    let maxBudgetNum: number | undefined;

    if (postBudgetMode === 'fixed') {
      const fixedNum = parseBengaliOrEnglishNumber(postBudgetFixed);
      if (isNaN(fixedNum) || fixedNum <= 0) {
        setError('দয়া করে বাজেট নির্ধারণ করুন (বাংলা বা ইংরেজি ফন্টে যেকোনো প্রাইজ লিখতে পারবেন)');
        return;
      }
      calculatedBudget = fixedNum;
      computedBudgetRange = `৳${fixedNum.toLocaleString('bn-BD')}`;
    } else {
      const minNum = parseBengaliOrEnglishNumber(minBudget);
      const maxNum = parseBengaliOrEnglishNumber(maxBudget);
      if (isNaN(minNum) || minNum <= 0) {
        setError('দয়া করে সর্বনিম্ন বাজেট প্রদান করুন');
        return;
      }
      if (isNaN(maxNum) || maxNum <= 0) {
        setError('দয়া করে সর্বোচ্চ বাজেট প্রদান করুন');
        return;
      }
      if (maxNum < minNum) {
        setError('সর্বোচ্চ বাজেট সর্বনিম্ন বাজেটের সমান বা বেশি হতে হবে');
        return;
      }
      calculatedBudget = minNum;
      minBudgetNum = minNum;
      maxBudgetNum = maxNum;
      computedBudgetRange = `৳${minNum.toLocaleString('bn-BD')} - ৳${maxNum.toLocaleString('bn-BD')}`;
    }

    const numDays = parseBengaliOrEnglishNumber(postDeliveryDays);
    if (isNaN(numDays) || numDays <= 0) {
      setError('দয়া করে ডেলিভারি সময় (দিন) নির্বাচন করুন বা লিখুন');
      return;
    }

    setError('');
    setPostSubmittedSuccess(true);

    setTimeout(() => {
      onSubmit({
        title: postTitle.trim(),
        category: postCategory,
        budget: calculatedBudget,
        budgetRange: computedBudgetRange,
        budgetMode: postBudgetMode,
        minBudget: minBudgetNum,
        maxBudget: maxBudgetNum,
        deliveryDays: numDays,
        description: postDescription.trim(),
        skills: postTags.trim(),
        requirements: postRequirements,
        attachmentName: postAttachmentName || (postCoverImage ? "কভার ছবি সংযুক্ত" : undefined),
        attachmentUrl: postAttachmentUrl || postCoverImage || undefined,
        coverImage: postCoverImage || undefined,
        offerType: postOfferType
      });

      setPostSubmittedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100000] pointer-events-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-bengali animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden relative"
      >
        {/* SLEEK COMPACT 1-LINE HEADER */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5 shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-[#004D38] text-white z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xs text-[#38BDF8] border border-white/10 flex items-center justify-center font-black shrink-0">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                ডিরেক্ট প্রজেক্ট অফার
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30 shrink-0">
                ২৪ ঘণ্টা ভ্যালিডিটি
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* MODAL BODY */}
        {postSubmittedSuccess ? (
          <div className="p-6 sm:p-10 text-center space-y-3.5 my-auto">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                ডিরেক্ট প্রজেক্ট অফার সফলভাবে পাঠানো হয়েছে!
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {recipientName}-এর ইনবক্সে ২৪ ঘণ্টার রিসিভ কাউন্টডাউন চালু হয়েছে।
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#006A4E]" />
              <span>মেসেজ থ্রেডে কার্ড যুক্ত হচ্ছে...</span>
            </div>
          </div>
        ) : (
          <form id="direct-project-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. BASIC DETAILS */}
            <div className="bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-xs font-black">১</span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  মূল বিবরণ
                </h4>
              </div>

              {/* TITLE */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>প্রজেক্ট শিরোনাম *</span>
                  <span className="text-[11px] text-slate-400">স্পষ্ট ও সংক্ষেপ</span>
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="যেমন: ই-কমার্স ওয়েবসাইটের জন্য ফুল স্ট্যাক ডিজাইন ও ডেভেলপমেন্ট"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>

              {/* CATEGORY & SKILLS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={postCategory}
                    required
                    onChange={(e) => {
                      setPostCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  >
                    <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                    <option value="Web Development">ওয়েব ডেভেলপমেন্ট</option>
                    <option value="Graphic Design">গ্রাফিক ডিজাইন</option>
                    <option value="Digital Marketing">ডিজিটাল মার্কেটিং</option>
                    <option value="App Development">মোবাইল অ্যাপ</option>
                    <option value="Video Editing">ভিডিও এডিটিং</option>
                    <option value="UI/UX Design">ইউআই/ইউএক্স ডিজাইন</option>
                    <option value="Content Writing">কন্টেন্ট রাইটিং</option>
                    <option value="Cyber Security">সাইবার সিকিউরিটি</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300">
                    প্রয়োজনীয় স্কিলস
                  </label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="হিন্ট: React, Tailwind, Figma, SEO ইত্যাদি..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                </div>
              </div>

              {/* DYNAMIC QUICK TAGS BASED ON CATEGORY */}
              {postCategory && CATEGORY_PROJECT_TAGS[postCategory] && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-xs font-bold text-slate-400">কুইক ট্যাগ:</span>
                  {CATEGORY_PROJECT_TAGS[postCategory].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const tagList = postTags ? postTags.split(",").map(s => s.trim()).filter(Boolean) : [];
                        if (!tagList.includes(tag)) {
                          setPostTags(tagList.length > 0 ? `${postTags}, ${tag}` : tag);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#006A4E] text-slate-800 dark:text-white hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* COVER / SAMPLE IMAGE */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#38BDF8]" />
                    <span>স্যাম্পল ছবি (ঐচ্ছিক)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">আপলোড / লিংক</span>
                </label>

                {postCoverImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 h-28 group">
                    <img
                      src={postCoverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPostCoverImage("");
                        setPostAttachmentName("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-md"
                      title="ছবি মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {/* FILE UPLOAD */}
                    <label className="p-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#006A4E] rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white transition text-xs font-bold">
                      <UploadCloud className="w-4 h-4 text-[#006A4E] dark:text-[#38BDF8]" />
                      <span>ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === "string") {
                                setPostCoverImage(reader.result);
                                setPostAttachmentName(file.name);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* URL INPUT */}
                    <input
                      type="url"
                      placeholder="ইমেজ লিংক (URL)"
                      value={postCoverImage}
                      onChange={(e) => setPostCoverImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. DESCRIPTION & REQUIREMENTS */}
            <div className="bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-xs font-black">২</span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    কাজের বিবরণ ও রিকোয়ারমেন্ট
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-slate-400">একক বিবরণ</span>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>কাজের বিবরণ *</span>
                  <span className="text-[11px] text-slate-400">কাজের বিবরণ লিখুন</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="কাজের বিস্তারিত বিবরণ, প্রয়োজনীয় ফিচার বা সুনির্দিষ্ট গাইডলাইন উল্লেখ করুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E] leading-relaxed"
                />
              </div>

              {/* REQUIREMENTS LIST WITH SMART AUTO-SUGGEST */}
              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 block">
                    প্রয়োজনীয় রিকোয়ারমেন্টস তালিকা
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const suggestions = getSmartRequirementsSuggestions(postTitle, postCategory);
                      const newOnes = suggestions.filter(s => !postRequirements.includes(s));
                      if (newOnes.length > 0) {
                        setPostRequirements([...postRequirements, ...newOnes]);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#006A4E] hover:bg-[#047857] text-white text-xs font-black transition cursor-pointer flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ টাইটেল অনুসারে সাজেস্ট</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReqInput}
                    onChange={(e) => setNewReqInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newReqInput.trim()) {
                          setPostRequirements([...postRequirements, newReqInput.trim()]);
                          setNewReqInput("");
                        }
                      }
                    }}
                    placeholder="যেমন: ১ মাসের ফ্রি সাপোর্ট ও অপ্টিমাইজেশন"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newReqInput.trim()) {
                        setPostRequirements([...postRequirements, newReqInput.trim()]);
                        setNewReqInput("");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#006A4E] hover:bg-[#19a34a] text-white text-xs sm:text-sm font-black transition cursor-pointer"
                  >
                    + যোগ
                  </button>
                </div>

                {/* SMART AUTO-SUGGESTION CHIPS */}
                {(() => {
                  const allSuggestions = getSmartRequirementsSuggestions(postTitle, postCategory);
                  const pendingSuggestions = allSuggestions.filter(s => !postRequirements.includes(s));
                  if (pendingSuggestions.length === 0) return null;
                  return (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> ক্লিক করে যোগ করুন:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pendingSuggestions.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPostRequirements([...postRequirements, item])}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#006A4E] text-slate-800 dark:text-white hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <span>+{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {postRequirements.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {postRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#38BDF8] shrink-0" />
                          <span className="truncate">{req}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPostRequirements(postRequirements.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* REFERENCE LINK */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#006A4E] dark:text-[#38BDF8]" />
                  <span>রেফারেন্স ড্রাইভ বা ফাইল লিংক (ঐচ্ছিক)</span>
                </label>
                <input
                  type="text"
                  value={postAttachmentName}
                  onChange={(e) => {
                    setPostAttachmentName(e.target.value);
                    setPostAttachmentUrl(e.target.value);
                  }}
                  placeholder="যেমন: https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                />
              </div>
            </div>

            {/* 3. BUDGET & TIMELINE */}
            <div className="bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-xs font-black">৩</span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    বাজেট ও ডেলিভারি
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPostBudgetMode("range")}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      postBudgetMode === "range"
                        ? "bg-[#006A4E] text-white font-black"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    রেঞ্জ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostBudgetMode("fixed")}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      postBudgetMode === "fixed"
                        ? "bg-[#006A4E] text-white font-black"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    ফিক্সড
                  </button>
                </div>
              </div>

              {/* BUDGET INPUTS */}
              {postBudgetMode === "range" ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">সর্বনিম্ন বাজেট (৳) *</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="যেমন: ৫০০ বা ১০০০"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">সর্বোচ্চ বাজেট (৳) *</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="যেমন: ১৫০০ বা ৩০০০"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">নির্দিষ্ট বাজেট (৳) *</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={postBudgetFixed}
                    onChange={(e) => setPostBudgetFixed(e.target.value)}
                    placeholder="যেমন: ৫০০, ১২০০ বা ৫০০০ (ইচ্ছেমতো প্রাইজ লিখুন)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                </div>
              )}

              {/* QUICK BUDGET CHIPS */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "৳১-৩হাজার", min: "১০০০", max: "৩০০০" },
                  { label: "৳৫-১৫হাজার", min: "৫০০০", max: "১৫০০০" },
                  { label: "৳১৫-৩০হাজার", min: "১৫০০০", max: "৩০০০০" },
                  { label: "৳৩০-৫০হাজার", min: "৩০০০০", max: "৫০০০০" },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => {
                      setPostBudgetMode("range");
                      setMinBudget(b.min);
                      setMaxBudget(b.max);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#006A4E] text-slate-800 dark:text-white hover:text-white text-xs font-bold transition cursor-pointer"
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* DELIVERY TIMELINE */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>ডেলিভারি সময় (দিন) *</span>
                  <span className="text-[11px] text-slate-400">বাছাই করুন বা লিখুন</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {["১", "৩", "৫", "৭", "১৪", "২১", "৩০"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setPostDeliveryDays(day)}
                      className={`py-1.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                        postDeliveryDays === day
                          ? "bg-[#006A4E] text-white font-black shadow-sm"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      {day} দিন
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={postDeliveryDays}
                    onChange={(e) => setPostDeliveryDays(e.target.value)}
                    placeholder="কাস্টম ডেলিভারি দিন লিখুন (যেমন: ২ বা ১০)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#006A4E]"
                  />
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">দিন</span>
                </div>
              </div>

              {/* OFFER TYPE (WORK FIRST VS PAID ESCROW) */}
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                  পেমেন্ট ও কাজের শর্ত নির্বাচন
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostOfferType("work_first")}
                    className={`py-2 px-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-1.5 ${
                      postOfferType === "work_first"
                        ? "border-amber-500 bg-amber-500/15 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500 shadow-xs"
                        : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-black flex items-center gap-1 leading-tight truncate">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        আগে কাজ শুরু
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold block truncate mt-0.5">
                        কাজ দেখে বিল প্রদান
                      </span>
                    </div>
                    {postOfferType === "work_first" && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostOfferType("paid")}
                    className={`py-2 px-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-1.5 ${
                      postOfferType === "paid"
                        ? "border-[#006A4E] bg-emerald-500/15 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-[#006A4E] shadow-xs"
                        : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-black flex items-center gap-1 leading-tight truncate">
                        <CreditCard className="w-3.5 h-3.5 text-[#006A4E] shrink-0" />
                        অগ্রিম জমা
                      </span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block truncate mt-0.5">
                        সিকিউরড এসক্রো
                      </span>
                    </div>
                    {postOfferType === "paid" && (
                      <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. PREVIEW CARD */}
            <div className="bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#006A4E] dark:text-[#38BDF8]" />
                  ডিরেক্ট অফার প্রিভিউ
                </span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold rounded-full">
                  ব্যক্তিগত (২৪h)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#006A4E] dark:text-[#38BDF8] block">
                      {postCategory || "ক্যাটাগরি"} • {recipientName}-কে ডিরেক্ট
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {postTitle || "প্রজেক্টের শিরোনাম..."}
                    </h5>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-black text-[#006A4E] dark:text-emerald-400 shrink-0">
                    {postBudgetMode === "fixed" && postBudgetFixed
                      ? `৳${parseBengaliOrEnglishNumber(postBudgetFixed).toLocaleString("bn-BD")}`
                      : `৳${parseBengaliOrEnglishNumber(minBudget || 0).toLocaleString("bn-BD")} - ৳${parseBengaliOrEnglishNumber(maxBudget || 0).toLocaleString("bn-BD")}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {postDescription || "কাজের বিবরণ..."}
                </p>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] text-[#006A4E] dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#006A4E] dark:text-emerald-400" />
                <span>অফার একসেপ্ট না হওয়া পর্যন্ত এস্ক্রো সুরক্ষায় আপনার ফান্ড সুরক্ষিত থাকবে।</span>
              </div>
            </div>

          </form>
        )}

        {/* STICKY FOOTER */}
        {!postSubmittedSuccess && (
          <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 shrink-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              form="direct-project-form"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#047857] text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95"
            >
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
              <span>২৪ ঘণ্টার ডিরেক্ট অফার পাঠান 🚀</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
