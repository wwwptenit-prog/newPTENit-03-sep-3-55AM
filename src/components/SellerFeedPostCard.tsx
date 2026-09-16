import React, { useState } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { MarketplaceGig, User as UserType } from '../types';

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
  const sellerName = currentUser?.name || gig.sellerName || 'Mds Kazi Sohag';
  const sellerAvatar = currentUser?.avatar || gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const salesCount = gig.salesCount ?? 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 font-bengali">
      {/* 1. Header (Poster Info + 3-Dot Menu) */}
      <div className="p-3 sm:p-3.5 pb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#006A4E]/20 border border-slate-200 dark:border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006A4E] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {sellerName}
              </span>
              <CheckCircle2
                className="w-4 h-4 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                title="Verified Profile"
              />
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap overflow-hidden">
              <span className="shrink-0">18h</span>
              <span>•</span>
              <span className="text-[#006A4E] font-semibold shrink-0">সক্রিয় গিগ</span>
              <span>•</span>
              <span className="truncate">{gig.category}</span>
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                    onDelete();
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

      {/* 2. Post Caption / Title */}
      <div className="px-3.5 pt-1 pb-2.5">
        <p
          onClick={onPreview}
          className="text-[15px] sm:text-base font-normal text-slate-800 dark:text-slate-200 leading-relaxed cursor-pointer hover:text-[#006A4E] dark:hover:text-emerald-400 transition"
        >
          {gig.title}
        </p>
      </div>

      {/* 3. Media / Thumbnail */}
      <div
        onClick={onPreview}
        className="relative w-full overflow-hidden select-none bg-slate-950 cursor-pointer group"
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={gig.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        </div>

        {/* Card Bottom: Start Work First + Starts at ৳2,000 */}
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[#E31E24] flex items-center gap-1.5">
            Start Work First
          </span>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-normal">Starts at</span>
            <span className="font-bold text-base text-[#006A4E] dark:text-emerald-400">
              ৳{Number(basicPrice).toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Reactions & Engagement Bar (Unified: Exact same on Phone & PC) */}
      <div className="px-3 sm:px-3.5 py-2 flex items-center justify-between gap-1 text-xs sm:text-[13.5px] text-slate-600 dark:text-slate-300">
        {/* Left: Votes Summary */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-1 items-center">
            <span className="w-4.5 h-4.5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsUp className="w-2.5 h-2.5 fill-white text-white" />
            </span>
            <span className="w-4.5 h-4.5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsDown className="w-2.5 h-2.5 fill-slate-600 text-slate-600" />
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-[13.5px]">
            মোট {upCount + downCount} জন ভোট দিয়েছেন
          </span>
        </div>

        {/* Right: Views Counter & Orders */}
        <div className="flex items-center gap-2 text-xs sm:text-[13.5px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400" />
            <span className="font-medium text-slate-500 dark:text-slate-400">
              {reachFormatted} ভিউ
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

      {/* 5. Action Bar (Unified for Both Phone & PC: Up, Down, Details) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 items-center px-2.5 sm:px-3.5 py-2 sm:py-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* 1. আপ বাটন */}
        <button
          type="button"
          onClick={handleUpvoteToggle}
          className={`py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-[14px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 cursor-pointer border ${
            isUpvoted
              ? 'text-[#006A4E] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-2xs'
              : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/70 dark:border-slate-700'
          }`}
          title="আপভোট"
        >
          <ThumbsUp
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform ${
              isUpvoted ? 'fill-[#006A4E] text-[#006A4E] scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>আপ</span>
        </button>

        {/* 2. ডাউন বাটন */}
        <button
          type="button"
          onClick={handleDownvoteToggle}
          className={`py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-[14px] font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 cursor-pointer border ${
            isDownvoted
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-2xs'
              : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/70 dark:border-slate-700'
          }`}
          title="ডাউনভোট"
        >
          <ThumbsDown
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform ${
              isDownvoted ? 'fill-rose-600 text-rose-600 scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>ডাউন</span>
        </button>

        {/* 3. বিস্তারিত বাটন (Details) */}
        <button
          type="button"
          onClick={onPreview}
          className="py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-[14px] font-bold text-white bg-[#006A4E] hover:bg-[#00543e] flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs group/btn"
          title="বিস্তারিত দেখুন"
        >
          <span>বিস্তারিত দেখুন</span>
          <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
