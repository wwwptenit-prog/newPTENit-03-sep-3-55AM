import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Share2,
  Heart,
  ShoppingBag,
  GraduationCap,
  Star,
  Download,
  Clock,
  BookOpen,
  UserCheck,
  MoreHorizontal,
  Tag,
  Gift
} from 'lucide-react';

export interface DigitalProductFeedCardProps {
  product: any;
  onSelectProduct: (product: any) => void;
}

export const DigitalProductFeedCard: React.FC<DigitalProductFeedCardProps> = ({
  product,
  onSelectProduct
}) => {
  const [upCount, setUpCount] = useState<number>(() => Math.floor(Math.random() * 25) + 18);
  const [downCount, setDownCount] = useState<number>(() => Math.floor(Math.random() * 4) + 1);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [isDownvoted, setIsDownvoted] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isFree = Boolean(
    product.isFree ||
    product.price === 0 ||
    product.offerBadge === "সম্পূর্ণ ফ্রি" ||
    product.offerBadge === "ফ্রি" ||
    (typeof product.price === 'string' && (product.price.includes('ফ্রি') || product.price.toLowerCase().includes('free')))
  );
  const price = typeof product.price === 'number' ? product.price : (isFree ? 0 : 450);
  const originalPrice = product.originalPrice && product.originalPrice > price
    ? product.originalPrice
    : Math.round(price * 1.5);
  const discountPct = isFree ? 0 : (originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0);

  const viewsCount = product.salesCount ? (product.salesCount * 14 + 320) : 1850;
  const viewsFormatted = viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : `${viewsCount}`;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) {
      setIsUpvoted(false);
      setUpCount(prev => prev - 1);
    } else {
      setIsUpvoted(true);
      setUpCount(prev => prev + 1);
      if (isDownvoted) {
        setIsDownvoted(false);
        setDownCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownvoted) {
      setIsDownvoted(false);
      setDownCount(prev => prev - 1);
    } else {
      setIsDownvoted(true);
      setDownCount(prev => prev + 1);
      if (isUpvoted) {
        setIsUpvoted(false);
        setUpCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product.rawProduct || product)}
      className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#006A4E]/50 transition-all duration-300 cursor-pointer font-bengali w-full"
    >
      {/* 1. Header (Facebook Feed Post Style) */}
      <div className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80"
              alt="PTENit Digital Studio"
              className="w-10 h-10 rounded-full object-cover ring-1.5 ring-[#006A4E]/20 border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006A4E] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Line 1: Name + Verified Green Tick (Larger on PC) */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[14px] sm:text-[17px] md:text-[18px] font-semibold text-slate-900 dark:text-white truncate">
                PTENit Digital Studio
              </span>
              <span title="Verified Studio">
                <CheckCircle2
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                />
              </span>
            </div>

            {/* Line 2: Meta Info (Middle-aligned dots: 1 Mar · Verified · Escrow Shield) */}
            <div className="flex items-center text-[10.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 whitespace-nowrap overflow-hidden leading-tight">
              <span className="shrink-0">1 Mar</span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              <span className="text-[#006A4E] dark:text-emerald-400 font-medium shrink-0">Verified</span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              <span title="১০০% নিরাপদ এসক্রো গ্যারান্টি"><ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006A4E] dark:text-emerald-400 shrink-0" aria-label="১০০% নিরাপদ এসক্রো গ্যারান্টি" /></span>
            </div>
          </div>
        </div>

        {/* Right Header Options (Favorite + Share) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
              isFavorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="পছন্দের তালিকায় রাখুন"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={copied ? 'লিঙ্ক কপি হয়েছে' : 'শেয়ার করুন'}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Post Caption / Title (Facebook Desktop: larger on PC view) */}
      <div className="px-3.5 sm:px-4.5 pt-1 pb-2.5">
        <p className="text-[14px] sm:text-[17px] md:text-[18px] font-normal text-slate-900 dark:text-slate-100 leading-[1.5] line-clamp-3">
          {product.title}
        </p>
      </div>

      {/* 3. Media Image Frame - ছবির উপর কোন টেক্সট থাকবে না */}
      <div className="relative w-full select-none bg-slate-950 overflow-hidden group/media">
        <div className="aspect-[16/10] sm:aspect-[16/9] min-h-[230px] sm:min-h-[290px] md:min-h-[330px] max-h-[320px] sm:max-h-[380px] md:max-h-[440px] w-full overflow-hidden relative cursor-pointer">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-102"
          />
        </div>

        {/* Strip: এক পাশে ছাড় বা সম্পূর্ন ফ্রি - অপর পাশে প্রাইজ */}
        <div className="px-3 sm:px-4.5 py-2 sm:py-2.5 bg-slate-50/95 dark:bg-slate-850/95 backdrop-blur-xs border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Left: ছাড় বা সম্পূর্ণ ফ্রি (বিস্তারিত বাটনের মতো সবুজ কালার, কোনো বর্ডার ছাড়া) */}
          <div className="flex items-center gap-1.5">
            {isFree ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>সম্পূর্ণ ফ্রি</span>
              </span>
            ) : discountPct > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>{discountPct}% ছাড়</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                <span>ডিজিটাল প্রোডাক্ট</span>
              </span>
            )}
          </div>

          {/* Right: প্রাইজ */}
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm md:text-base">
            {isFree ? (
              <span className="font-black text-sm sm:text-base md:text-lg text-[#006A4E] dark:text-emerald-400">
                ফ্রি
              </span>
            ) : (
              <>
                <span className="font-black text-sm sm:text-base md:text-lg text-[#006A4E] dark:text-emerald-400">
                  ৳{price.toLocaleString('bn-BD')}
                </span>
                {originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through font-bold">
                    ৳{originalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Reactions & Engagement Counter Bar (Clean: No middle divider line) */}
      <div className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 flex items-center justify-between gap-1 text-[12.5px] sm:text-[13.5px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex -space-x-1 items-center">
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsUp className="w-2.5 h-2.5 fill-white text-white" />
            </span>
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsDown className="w-2.5 h-2.5 fill-slate-600 text-slate-600" />
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[12.5px] sm:text-[13.5px]">
            মোট {upCount + downCount} জন ভোট দিয়েছেন
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13.5px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span className="font-medium">{viewsFormatted} views</span>
          </div>
        </div>
      </div>

      {/* 5. Action Bar (Unified: Up, Down, Buy - No middle divider line) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 items-center px-2.5 sm:px-4 pb-2.5 sm:pb-3 pt-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
        <button
          type="button"
          onClick={handleUpvote}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/80 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="আপভোট"
        >
          <ThumbsUp
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform shrink-0 ${
              isUpvoted ? 'fill-[#006A4E] text-[#006A4E] scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>আপ {upCount}</span>
        </button>

        <button
          type="button"
          onClick={handleDownvote}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/80 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="ডাউনভোট"
        >
          <ThumbsDown
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform shrink-0 ${
              isDownvoted ? 'fill-rose-600 text-rose-600 scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>ডাউন {downCount}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product.rawProduct || product);
          }}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-[#006A4E] hover:bg-[#047857] text-white shadow-xs whitespace-nowrap"
          title="বিস্তারিত দেখুন ও কিনুন"
        >
          <ShoppingBag className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 text-white" />
          <span>কিনুন</span>
        </button>
      </div>
    </div>
  );
};

export interface CourseFeedCardProps {
  course: any;
  onSelectCourse: (courseId: string) => void;
}

export const CourseFeedCard: React.FC<CourseFeedCardProps> = ({
  course,
  onSelectCourse
}) => {
  const [upCount, setUpCount] = useState<number>(() => Math.floor(Math.random() * 30) + 24);
  const [downCount, setDownCount] = useState<number>(() => Math.floor(Math.random() * 3) + 1);
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [isDownvoted, setIsDownvoted] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isFree = Boolean(
    course.isFree ||
    course.price === 0 ||
    course.offerBadge === "সম্পূর্ণ ফ্রি" ||
    course.offerBadge === "ফ্রি" ||
    (typeof course.price === 'string' && (course.price.includes('ফ্রি') || course.price.toLowerCase().includes('free')))
  );
  const price = typeof course.price === 'number' ? course.price : (isFree ? 0 : 1999);
  const originalPrice = course.originalPrice && course.originalPrice > price
    ? course.originalPrice
    : Math.round(price * 1.8);
  const discountPct = isFree ? 0 : (originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0);

  const viewsCount = course.enrolledCount ? (course.enrolledCount * 8 + 450) : 2300;
  const viewsFormatted = viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(1)}k` : `${viewsCount}`;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) {
      setIsUpvoted(false);
      setUpCount(prev => prev - 1);
    } else {
      setIsUpvoted(true);
      setUpCount(prev => prev + 1);
      if (isDownvoted) {
        setIsDownvoted(false);
        setDownCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownvoted) {
      setIsDownvoted(false);
      setDownCount(prev => prev - 1);
    } else {
      setIsDownvoted(true);
      setDownCount(prev => prev + 1);
      if (isUpvoted) {
        setIsUpvoted(false);
        setUpCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelectCourse(course.id)}
      className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-[#006A4E]/50 transition-all duration-300 cursor-pointer font-bengali w-full"
    >
      {/* 1. Header (Facebook Feed Post Style) */}
      <div className="p-3 sm:p-4 pb-1.5 sm:pb-2 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="PTENit Academy"
              className="w-10 h-10 rounded-full object-cover ring-1.5 ring-[#006A4E]/20 border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006A4E] rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Line 1: Name + Verified Green Tick (Larger on PC) */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[14px] sm:text-[17px] md:text-[18px] font-semibold text-slate-900 dark:text-white truncate">
                PTENit Academy
              </span>
              <span title="Verified Academy">
                <CheckCircle2
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                />
              </span>
            </div>

            {/* Line 2: Meta Info (Middle-aligned dots: 1 Mar · Masterclass · Escrow Shield) */}
            <div className="flex items-center text-[10.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 whitespace-nowrap overflow-hidden leading-tight">
              <span className="shrink-0">1 Mar</span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              <span className="text-[#006A4E] dark:text-emerald-400 font-medium shrink-0">Masterclass</span>
              <span className="text-slate-400 dark:text-slate-500 select-none leading-none inline-flex items-center justify-center px-0.5 font-bold">·</span>
              <span title="১০০% নিরাপদ এসক্রো গ্যারান্টি"><ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006A4E] dark:text-emerald-400 shrink-0" aria-label="১০০% নিরাপদ এসক্রো গ্যারান্টি" /></span>
            </div>
          </div>
        </div>

        {/* Right Header Options (Favorite + Share) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
              isFavorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="পছন্দের তালিকায় রাখুন"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={copied ? 'লিঙ্ক কপি হয়েছে' : 'শেয়ার করুন'}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Post Caption / Title (Facebook Desktop: larger on PC view) */}
      <div className="px-3.5 sm:px-4.5 pt-1 pb-2.5">
        <p className="text-[14px] sm:text-[17px] md:text-[18px] font-normal text-slate-900 dark:text-slate-100 leading-[1.5] line-clamp-3">
          {course.title}
        </p>
      </div>

      {/* 3. Media Image Frame - ছবির উপর কোন টেক্সট থাকবে না */}
      <div className="relative w-full select-none bg-slate-950 overflow-hidden group/media">
        <div className="aspect-[16/10] sm:aspect-[16/9] min-h-[230px] sm:min-h-[290px] md:min-h-[330px] max-h-[320px] sm:max-h-[380px] md:max-h-[440px] w-full overflow-hidden relative cursor-pointer">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-102"
          />
        </div>

        {/* Strip: এক পাশে ছাড় বা সম্পূর্ন ফ্রি - অপর পাশে প্রাইজ */}
        <div className="px-3 sm:px-4.5 py-2 sm:py-2.5 bg-slate-50/95 dark:bg-slate-850/95 backdrop-blur-xs border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Left: ছাড় বা সম্পূর্ণ ফ্রি (বিস্তারিত বাটনের মতো সবুজ কালার, কোনো বর্ডার ছাড়া) */}
          <div className="flex items-center gap-1.5">
            {isFree ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>সম্পূর্ণ ফ্রি</span>
              </span>
            ) : discountPct > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>{discountPct}% ছাড়</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-white shrink-0" />
                <span>একাডেমি কোর্স</span>
              </span>
            )}
          </div>

          {/* Right: প্রাইজ */}
          <div className="flex items-baseline gap-1.5 text-xs sm:text-sm md:text-base">
            {isFree ? (
              <span className="font-black text-sm sm:text-base md:text-lg text-[#006A4E] dark:text-emerald-400">
                ফ্রি
              </span>
            ) : (
              <>
                <span className="font-black text-sm sm:text-base md:text-lg text-[#006A4E] dark:text-emerald-400">
                  ৳{price.toLocaleString('bn-BD')}
                </span>
                {originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through font-bold">
                    ৳{originalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Reactions & Engagement Counter Bar (Clean: No middle divider line) */}
      <div className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 flex items-center justify-between gap-1 text-[12.5px] sm:text-[13.5px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex -space-x-1 items-center">
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsUp className="w-2.5 h-2.5 fill-white text-white" />
            </span>
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[9px] sm:text-[10px] shadow-xs ring-1 ring-white">
              <ThumbsDown className="w-2.5 h-2.5 fill-slate-600 text-slate-600" />
            </span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[12.5px] sm:text-[13.5px]">
            মোট {upCount + downCount} জন ভোট দিয়েছেন
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13.5px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span className="font-medium">{viewsFormatted} views</span>
          </div>
        </div>
      </div>

      {/* 5. Action Bar (Unified: Up, Down, Details - No middle divider line) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 items-center px-2.5 sm:px-4 pb-2.5 sm:pb-3 pt-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
        <button
          type="button"
          onClick={handleUpvote}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/80 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="আপভোট"
        >
          <ThumbsUp
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform shrink-0 ${
              isUpvoted ? 'fill-[#006A4E] text-[#006A4E] scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>আপ {upCount}</span>
        </button>

        <button
          type="button"
          onClick={handleDownvote}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/80 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          title="ডাউনভোট"
        >
          <ThumbsDown
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform shrink-0 ${
              isDownvoted ? 'fill-rose-600 text-rose-600 scale-110' : 'text-slate-600 dark:text-slate-400'
            }`}
          />
          <span>ডাউন {downCount}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCourse(course.id);
          }}
          className="py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-[#006A4E] hover:bg-[#047857] text-white shadow-xs whitespace-nowrap"
          title="কোর্স বিস্তারিত দেখুন ও এনরোল করুন"
        >
          <GraduationCap className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 text-white" />
          <span>বিস্তারিত</span>
        </button>
      </div>
    </div>
  );
};
