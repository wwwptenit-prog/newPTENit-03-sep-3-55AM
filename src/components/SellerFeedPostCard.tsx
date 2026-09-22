import React, { useState, useMemo } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  ShoppingBag,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { MarketplaceGig, User as UserType } from '../types';
import { formatFeedTime, cleanFeedSellerLevel } from '../utils/badgeHelper';

interface SellerFeedPostCardProps {
  gig: MarketplaceGig;
  currentUser?: UserType | null;
  onOpenEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

export const SellerFeedPostCard: React.FC<SellerFeedPostCardProps> = ({
  gig,
  currentUser,
  onOpenEdit,
  onDelete,
  onPreview,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?tab=marketplace&gig=${gig.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        triggerToast("✓ পোস্টের লিংক ক্লিপবোর্ডে কপি হয়েছে!");
        setTimeout(() => setCopiedLink(false), 2200);
      }).catch(() => {
        setCopiedLink(true);
        triggerToast("✓ পোস্টের লিংক কপি হয়েছে!");
        setTimeout(() => setCopiedLink(false), 2200);
      });
    } else {
      setCopiedLink(true);
      triggerToast("✓ পোস্টের লিংক কপি হয়েছে!");
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Upvote / Downvote state
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [upCount, setUpCount] = useState<number>(() => {
    return 18 + ((gig.id.charCodeAt(0) || 1) % 15);
  });
  const [downCount, setDownCount] = useState<number>(() => {
    return 2 + ((gig.id.charCodeAt(gig.id.length - 1) || 1) % 3);
  });

  const handleUpvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) {
      setIsUpvoted(false);
      setUpCount(prev => Math.max(0, prev - 1));
    } else {
      setIsUpvoted(true);
      setUpCount(prev => prev + 1);
      if (isDownvoted) {
        setIsDownvoted(false);
        setDownCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleDownvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownvoted) {
      setIsDownvoted(false);
      setDownCount(prev => Math.max(0, prev - 1));
    } else {
      setIsDownvoted(true);
      setDownCount(prev => prev + 1);
      if (isUpvoted) {
        setIsUpvoted(false);
        setUpCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  // Reach calculation
  const reachFormatted = (() => {
    const c1 = gig.id.charCodeAt(0) || 1;
    const c2 = gig.id.charCodeAt(gig.id.length - 1) || 2;
    const val = 1.2 + ((c1 * 7 + c2 * 5) % 25) / 10;
    return `${val.toFixed(1)}K`;
  })();

  const basicPrice = gig.packages?.basic?.price || (gig as any).price || 2500;
  const isFree =
    basicPrice === 0 ||
    gig.packages?.basic?.price === 0 ||
    gig.offerBadge === "সম্পূর্ণ ফ্রি" ||
    gig.offerBadge === "ফ্রি" ||
    (gig as any).isFree === true ||
    gig.tags?.some((t) => t.includes("ফ্রি") || t.toLowerCase().includes("free")) ||
    gig.category?.toLowerCase().includes("free");
  const isAgency = gig.sellerId === "ptenit-agency" || gig.isAgencyStaff;
  const postTime = useMemo(() => {
    return formatFeedTime((gig as any).createdAt);
  }, [gig]);
  const sellerName = currentUser?.name || gig.sellerName || 'Mds Kazi Sohag';
  const sellerAvatar = currentUser?.avatar || gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const salesCount = gig.salesCount ?? 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 font-bengali">
      {/* 1. Header (Poster Info + 3-Dot Menu) */}
      <div className="p-2.5 sm:p-3 pb-1 sm:pb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1.5 ring-[#006A4E]/20 border border-slate-200 dark:border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#006A4E] rounded-full ring-1.5 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                {sellerName}
              </span>
              <CheckCircle2
                className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                title="Verified Profile"
              />
            </div>
            <div className="flex items-center text-[10.5px] sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap overflow-hidden">
              <span className="shrink-0">{postTime}</span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              <span className="text-[#006A4E] dark:text-emerald-400 font-semibold shrink-0">
                {cleanFeedSellerLevel(gig.sellerLevel)}
              </span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              {isAgency ? (
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006A4E] dark:text-emerald-400 shrink-0" aria-label="Verified Agency" title="১০০% ভেরিফাইড এজেন্সি" />
              ) : (
                <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" aria-label="Public" title="Public" />
              )}
            </div>
          </div>
        </div>

        {/* 3-Dot Menu Button & Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="মেনু"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100 font-bengali"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    handleShareLink(e);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer transition"
                >
                  <Copy className="w-3.5 h-3.5 text-[#006A4E] dark:text-emerald-400" />
                  <span>{copiedLink ? "লিংক কপি হয়েছে!" : "লিংক কপি করুন"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenEdit();
                  }}
                  className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-[#E11D48] font-bold cursor-pointer transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>এডিট করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onPreview();
                  }}
                  className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer transition"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>প্রিভিউ দেখুন</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-0.5" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-600 font-bold cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Post Caption / Title (Larger on PC view) */}
      <div className="px-2.5 sm:px-3 pt-0 pb-1.5">
        <p
          onClick={onPreview}
          className="text-[12.5px] sm:text-[16px] md:text-[17px] font-normal text-slate-800 dark:text-slate-200 leading-snug line-clamp-2 cursor-pointer hover:text-[#006A4E] dark:hover:text-emerald-400 transition"
        >
          {gig.title}
        </p>
      </div>

      {/* 3. Media / Thumbnail */}
      <div
        onClick={onPreview}
        className="relative w-full overflow-hidden select-none bg-slate-950 cursor-pointer group"
      >
        <div className="aspect-[16/10] sm:aspect-[16/9] max-h-[220px] sm:max-h-[260px] md:max-h-[285px] w-full overflow-hidden">
          <img
            src={gig.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
          />
        </div>

        {/* Card Bottom: Start Work First + Starts at ৳2,000 */}
        <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[11px] sm:text-[13px] font-semibold text-[#E31E24] flex items-center gap-1">
            Start Work First
          </span>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {isFree ? (
              <div className="text-right leading-tight">
                <span className="font-black text-xs sm:text-sm text-[#006A4E] dark:text-emerald-400 block">
                  সম্পূর্ণ
                </span>
                <span className="font-black text-xs sm:text-sm text-[#006A4E] dark:text-emerald-400 block">
                  ফ্রি
                </span>
              </div>
            ) : (
              <>
                <span className="text-slate-500 dark:text-slate-400 font-normal">Starts at</span>
                <span className="font-bold text-sm sm:text-base text-[#006A4E] dark:text-emerald-400">
                  ৳{Number(basicPrice).toLocaleString('en-US')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Reactions & Engagement Bar (Unified: Exact same on Phone & PC) */}
      <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between gap-1 text-[10px] sm:text-[11.5px] text-slate-600 dark:text-slate-300">
        {/* Left: Votes Summary */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex -space-x-1 items-center">
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsUp className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-white text-white" />
            </span>
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsDown className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-slate-600 text-slate-600" />
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px] sm:text-[13.5px]">
            মোট {upCount + downCount} জন ভোট দিয়েছেন
          </span>
        </div>

        {/* Right: Views Counter & Orders */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13.5px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
            <span className="font-medium text-slate-500 dark:text-slate-400">
              {reachFormatted} views
            </span>
          </div>
          {salesCount > 0 && (
            <>
              <span>•</span>
              <span className="text-[#006A4E] dark:text-emerald-400 font-bold">
                {salesCount}টি অর্ডার
              </span>
            </>
          )}
        </div>
      </div>

      {/* 5. Action Bar (Unified for Both Phone & PC: Up, Down, Details - No middle divider) */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center px-2 sm:px-3 pb-1.5 sm:pb-2 pt-0.5 bg-white dark:bg-slate-900">
        {/* 1. আপ বাটন */}
        <button
          type="button"
          onClick={handleUpvoteToggle}
          className="py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs md:text-[12.5px] font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="আপভোট"
        >
          <ThumbsUp
            className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform shrink-0 ${
              isUpvoted ? 'fill-[#006A4E] text-[#006A4E] scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>আপ {upCount}</span>
        </button>

        {/* 2. ডাউন বাটন */}
        <button
          type="button"
          onClick={handleDownvoteToggle}
          className="py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs md:text-[12.5px] font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="ডাউনভোট"
        >
          <ThumbsDown
            className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform shrink-0 ${
              isDownvoted ? 'fill-rose-600 text-rose-600 scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>ডাউন {downCount}</span>
        </button>

        {/* 3. বিস্তারিত বাটন (Details - No Icon) */}
        <button
          type="button"
          onClick={onPreview}
          className="py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-[10.5px] sm:text-xs md:text-[12.5px] font-bold text-white bg-[#006A4E] hover:bg-[#00543e] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
          title="বিস্তারিত"
        >
          <span>বিস্তারিত</span>
        </button>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-300 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 font-bengali pointer-events-none">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bengali"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-4 sm:p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              পোস্টটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              "{gig.title}" পোস্টটি স্থায়ীভাবে মুছে ফেলা হবে।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  onDelete();
                  triggerToast("✓ পোস্টটি মুছে ফেলা হয়েছে।");
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
