import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  Globe, 
  AlertTriangle,
  Edit3,
  Trash2,
  Paperclip,
  Check,
  X
} from 'lucide-react';
import { DirectOfferMeta } from '../types';
import { useData } from '../context/DataContext';
import { parseBengaliOrEnglishNumber, toBengaliDigits } from '../utils/localization';

interface DirectProjectOfferChatCardProps {
  offer: DirectOfferMeta;
  isSelf: boolean;
  currentUserId?: string;
  currentUserRole?: string;
  onAccept?: (offer: DirectOfferMeta) => void;
  onDecline?: (offer: DirectOfferMeta) => void;
  onPublishToPublic?: (offer: DirectOfferMeta) => void;
  onResend?: (offer: DirectOfferMeta) => void;
  onUpdate?: (updatedOffer: DirectOfferMeta) => void;
}

export const DirectProjectOfferChatCard: React.FC<DirectProjectOfferChatCardProps> = ({
  offer: initialOffer,
  isSelf,
  currentUserId,
  currentUserRole,
  onAccept,
  onDecline,
  onPublishToPublic,
  onResend,
  onUpdate
}) => {
  const { updateDirectOffer, declineDirectOffer } = useData();
  const [offer, setOffer] = useState<DirectOfferMeta>(initialOffer);
  const [now, setNow] = useState(Date.now());
  const [actionDone, setActionDone] = useState<string | null>(null);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(offer.title || '');
  const [editBudget, setEditBudget] = useState(String(offer.budget || ''));
  const [editDeliveryDays, setEditDeliveryDays] = useState(String(offer.deliveryDays || ''));
  const [editDescription, setEditDescription] = useState(offer.description || '');

  useEffect(() => {
    setOffer(initialOffer);
    setEditTitle(initialOffer.title || '');
    setEditBudget(String(initialOffer.budget || ''));
    setEditDeliveryDays(String(initialOffer.deliveryDays || ''));
    setEditDescription(initialOffer.description || '');
  }, [initialOffer]);

  // Live 1-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const expiresAtMs = offer.expiresAt 
    ? new Date(offer.expiresAt).getTime() 
    : (offer.createdAt ? new Date(offer.createdAt).getTime() + 24 * 3600 * 1000 : 0);
  const remainingMs = Math.max(0, expiresAtMs - now);
  const isExpired = expiresAtMs > 0 && remainingMs <= 0;

  // Determine effective status
  let effectiveStatus = offer.status;
  if (effectiveStatus === 'pending' && isExpired) {
    effectiveStatus = 'expired_returned';
  }
  if (actionDone === 'accepted') effectiveStatus = 'accepted';
  if (actionDone === 'declined') effectiveStatus = 'declined';
  if (actionDone === 'published') effectiveStatus = 'accepted';

  // Calculate remaining hours, minutes, seconds
  const totalSecs = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  // Is current viewer the creator (buyer who sent this) or recipient (seller receiving it)?
  const isCreator = isSelf || (currentUserId && offer.buyerId && currentUserId === offer.buyerId);
  const isRecipient = (!isCreator) || (currentUserId && offer.targetSellerId && currentUserId === offer.targetSellerId) || (currentUserRole === 'seller' && !isCreator);

  const handleAcceptClick = () => {
    setActionDone('accepted');
    if (onAccept) onAccept(offer);
  };

  const handleDeclineClick = () => {
    const isCancelling = isCreator;
    const confirmMsg = isCancelling 
      ? 'আপনি কি নিশ্চিত যে এই অফারটি বাতিল করতে চান?' 
      : 'আপনি কি নিশ্চিত যে এই অফারটি প্রত্যাখ্যান করতে চান?';
    if (!window.confirm(confirmMsg)) return;

    setActionDone('declined');
    if (onDecline) {
      onDecline(offer);
    } else {
      declineDirectOffer(offer.projectId || offer.id, isCancelling ? 'বায়ার অফারটি বাতিল করেছেন' : 'সেলার অফারটি প্রত্যাখ্যান করেছেন');
    }
  };

  const handlePublishClick = () => {
    setActionDone('published');
    if (onPublishToPublic) onPublishToPublic(offer);
  };

  const handleResendClick = () => {
    setActionDone(null);
    if (onResend) onResend(offer);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumBudget = parseBengaliOrEnglishNumber(editBudget);
    const cleanNumDays = parseBengaliOrEnglishNumber(editDeliveryDays);

    const targetBudget = cleanNumBudget > 0 ? cleanNumBudget : (offer.budget || 5000);
    const targetDays = cleanNumDays > 0 ? cleanNumDays : (offer.deliveryDays || 3);
    const targetRange = `৳${targetBudget.toLocaleString('bn-BD')}`;

    const updated: DirectOfferMeta = {
      ...offer,
      title: editTitle.trim() || offer.title,
      budget: targetBudget,
      budgetRange: targetRange,
      deliveryDays: targetDays,
      description: editDescription.trim() || offer.description,
    };

    setOffer(updated);
    setIsEditing(false);

    // Sync to DataContext
    updateDirectOffer(offer.projectId || offer.id, {
      title: updated.title,
      budget: targetBudget,
      budgetRange: targetRange,
      deliveryDays: targetDays,
      description: updated.description,
    });

    if (onUpdate) onUpdate(updated);
  };

  const budgetDisplay = offer.budgetRange || `৳${parseBengaliOrEnglishNumber(offer.budget || 0).toLocaleString('bn-BD')}`;
  const daysDisplay = toBengaliDigits(parseBengaliOrEnglishNumber(offer.deliveryDays || 3));

  return (
    <div className="my-1.5 p-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-2.5 font-bengali w-full max-w-[280px] sm:max-w-[320px] text-xs select-none">
      {/* 1. COMPACT HEADER */}
      <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#006A4E] dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span className="font-black text-slate-900 dark:text-white truncate text-xs sm:text-sm">
            {offer.title || 'কাস্টম প্রজেক্ট প্রস্তাব'}
          </span>
        </div>

        {/* Status Pill */}
        <div className="shrink-0">
          {effectiveStatus === 'accepted' ? (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-[#006A4E] dark:text-emerald-300 text-[10px] font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#006A4E] dark:text-emerald-400" />
              গৃহীত
            </span>
          ) : effectiveStatus === 'declined' ? (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-black flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              বাতিল
            </span>
          ) : effectiveStatus === 'expired_returned' ? (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              অটো ফেরত
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-[10px] font-black flex items-center gap-1 border border-sky-200 dark:border-sky-800">
              <Clock className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400 animate-spin" />
              অপেক্ষমাণ
            </span>
          )}
        </div>
      </div>

      {/* 2. COMPACT META STRIP */}
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-[11px] border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[9px] font-bold">বাজেট</span>
              <span className="font-black text-[#006A4E] dark:text-emerald-400 text-xs">
                {budgetDisplay}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] font-bold">ডেলিভারি</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                {daysDisplay} দিন
              </span>
            </div>
          </div>

          {/* Description snippet if any */}
          {offer.description && (
            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 px-0.5">
              {offer.description}
            </div>
          )}

          {/* Attachment link if present */}
          {offer.attachmentUrl && (
            <a 
              href={offer.attachmentUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-[11px] text-[#006A4E] dark:text-[#38BDF8] hover:underline font-bold px-0.5"
            >
              <Paperclip className="w-3 h-3" />
              <span className="truncate">সংযুক্ত ফাইল দেখুন</span>
            </a>
          )}

          {/* Live Countdown Bar (Pending) */}
          {effectiveStatus === 'pending' && (
            <div className="px-2 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-[10px] text-amber-900 dark:text-amber-200">
              <span className="flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>২৪ঘ ভ্যালিডিটি:</span>
              </span>
              <span className="font-mono font-black">
                {hours > 0 ? `${hours}h ` : ''}{mins}m {secs}s বাকি
              </span>
            </div>
          )}
        </>
      ) : (
        /* INLINE EDIT FORM FOR BUYER */
        <form onSubmit={handleSaveEdit} className="space-y-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">প্রজেক্ট শিরোনাম</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-[#006A4E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">বাজেট (৳)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                placeholder="যেমন: ৫০০ বা ১০০০"
                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-[#006A4E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ডেলিভারি (দিন)</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={editDeliveryDays}
                onChange={(e) => setEditDeliveryDays(e.target.value)}
                placeholder="যেমন: ৩ বা ৭"
                className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-[#006A4E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">বিবরণ</label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#006A4E]"
            />
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-[#006A4E] text-white text-[10px] font-bold transition cursor-pointer shadow-xs active:scale-95"
            >
              সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* 3. EXPIRED / AUTO-RETURNED NOTICE */}
      {effectiveStatus === 'expired_returned' && (
        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
          <div className="flex items-center gap-1 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>২৪ ঘণ্টার মেয়াদ শেষ • অটো ফেরত</span>
          </div>
        </div>
      )}

      {/* 4. ACTION BUTTONS */}
      {!isEditing && (
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
          {/* Case 1: Pending & Recipient (Seller / Target Specialist) */}
          {effectiveStatus === 'pending' && isRecipient && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAcceptClick}
                className="flex-1 py-1.5 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>রিসিভ করুন</span>
              </button>
              <button
                type="button"
                onClick={handleDeclineClick}
                className="py-1.5 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer"
                title="অফার প্রত্যাখ্যান করুন"
              >
                <X className="w-3.5 h-3.5" />
                <span>প্রত্যাখ্যান</span>
              </button>
            </div>
          )}

          {/* Case 2: Pending & Creator (Buyer) - CAN EDIT OR CANCEL */}
          {effectiveStatus === 'pending' && isCreator && (
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-1.5 px-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 text-[#0284C7] dark:text-sky-300 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-2xs"
                title="অফার ইডিট করুন"
              >
                <Edit3 className="w-3 h-3 text-[#0284C7] dark:text-sky-300" />
                <span>ইডিট করুন</span>
              </button>
              <button
                type="button"
                onClick={handleDeclineClick}
                className="py-1.5 px-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
                title="অফার বাতিল / প্রত্যাহার করুন"
              >
                <XCircle className="w-3 h-3" />
                <span>বাতিল করুন</span>
              </button>
            </div>
          )}

          {/* Case 3: Expired / Auto-Returned (Options for Buyer) */}
          {effectiveStatus === 'expired_returned' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePublishClick}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>পাবলিক ফিডে পোস্ট</span>
              </button>
              <button
                type="button"
                onClick={handleResendClick}
                className="py-1.5 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
                title="নতুন করে ২৪ ঘণ্টার জন্য পাঠান"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Case 4: Accepted State */}
          {effectiveStatus === 'accepted' && (
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5 font-bold border border-emerald-200/60 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006A4E] dark:text-emerald-400 shrink-0" />
              <span>অর্ডার গৃহীত ও এস্ক্রোতে কার্যকর।</span>
            </div>
          )}

          {/* Case 5: Declined State */}
          {effectiveStatus === 'declined' && (
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
              <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>অফারটি বাতিল বা প্রত্যাহার করা হয়েছে।</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
