import React, { useState, useMemo, useRef } from "react";
import {
  Heart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Copy,
  Check,
  Bookmark,
  ShoppingBag,
  Sparkles,
  Crown,
  Flag,
  Ban,
  Eye,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { MarketplaceGig, User as UserType } from "../types";
import { useData } from "../context/DataContext";
import { formatFeedTime, cleanFeedSellerLevel } from "../utils/badgeHelper";
import { extractDiscountPercent, calculateOriginalPrice } from "../utils/discountHelper";

// Bengali numeral converter helper
export const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

interface GigCardProps {
  gig: MarketplaceGig;
  onClick: () => void;
  currentUser?: UserType | null;
  savedGigIds?: string[];
  toggleFavorite?: (gigId: string, e: React.MouseEvent) => void;
  deleteGig?: (gigId: string) => void;
  onEdit?: (gig: MarketplaceGig) => void;
  badgeTag?: string;
  className?: string;
  layoutMode?: 'feed' | 'grid' | 'auto';
  openAuthModal?: () => void;
  isBuyerPost?: boolean;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  onClick,
  currentUser,
  savedGigIds = [],
  toggleFavorite,
  deleteGig,
  onEdit,
  badgeTag,
  className = "",
  layoutMode = 'auto',
  openAuthModal,
  isBuyerPost = false,
}) => {
  const { marketplaceOrders, currentUser: contextUser, openMessengerInbox } = useData();
  const effectiveUser = currentUser || contextUser;

  // Check if current user has an active/completed order for this gig
  const userOrder = marketplaceOrders?.find((o) => {
    if (o.gigId !== gig.id && o.title !== gig.title) return false;
    if (o.status === "cancelled") return false;
    if (!effectiveUser) return true;
    return (
      o.buyerId === effectiveUser.id ||
      (effectiveUser.email && o.buyerEmail === effectiveUser.email) ||
      (effectiveUser.name && o.buyerName === effectiveUser.name) ||
      (effectiveUser.phone && o.buyerPhone === effectiveUser.phone)
    );
  });

  const isFavorite = savedGigIds.includes(gig.id);
  const isOwnerOrAdmin =
    effectiveUser &&
    (effectiveUser.role === "admin" ||
      effectiveUser.id === gig.sellerId ||
      (effectiveUser.name &&
        gig.sellerName.toLowerCase().includes(effectiveUser.name.toLowerCase())));

  const price = gig.packages?.basic?.price ?? 2000;
  const isFree =
    price === 0 ||
    gig.packages?.basic?.price === 0 ||
    gig.offerBadge === "সম্পূর্ণ ফ্রি" ||
    gig.offerBadge === "ফ্রি" ||
    (gig as any).isFree === true ||
    gig.tags?.some((t) => t.includes("ফ্রি") || t.toLowerCase().includes("free")) ||
    gig.category?.toLowerCase().includes("free");
  const isAgency = gig.sellerId === "ptenit-agency" || gig.isAgencyStaff;
  const isPremium = gig.offerBadge === "premium" || gig.offerBadge === "প্রিমিয়াম" || gig.offerBadge === "প্রিমিয়াম গিগ" || gig.offerBadge?.includes("প্রিমিয়াম") || gig.offerBadge === "অফিশিয়াল গ্যারান্টি" || gig.category === "Digital Products" || gig.tags?.includes("প্রিমিয়াম");
  const isWorkFirst = !isPremium && (gig.offerBadge === "work_first" || gig.offerBadge === "আগে কাজ শুরু" || gig.offerBadge?.includes("আগে কাজ শুরু"));
  const discountPercent = !isWorkFirst && !isPremium ? extractDiscountPercent(gig.offerBadge) : null;

  // Facebook post interactive states
  const [isLiked, setIsLiked] = useState<boolean>(isFavorite);
  const [likeCount, setLikeCount] = useState<number>(() => {
    const base = gig.sellerRating && gig.sellerRating > 4.5 ? 24 : 16;
    return isFavorite ? base + 1 : base;
  });
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upCount, setUpCount] = useState<number>(() => {
    return 18 + ((gig.id.charCodeAt(0) || 1) % 15);
  });
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [downCount, setDownCount] = useState<number>(() => {
    return 2 + ((gig.id.charCodeAt(gig.id.length - 1) || 1) % 3);
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const isOwner = isBuyerPost ? (
    !effectiveUser ||
    !gig.sellerId ||
    gig.sellerId === effectiveUser.id ||
    gig.sellerId === 'buyer-self' ||
    (effectiveUser.name && gig.sellerName && gig.sellerName.toLowerCase().trim() === effectiveUser.name.toLowerCase().trim())
  ) : !!(
    effectiveUser && (
      (gig.sellerId && gig.sellerId === effectiveUser.id) ||
      (effectiveUser.name && gig.sellerName && gig.sellerName.toLowerCase().trim() === effectiveUser.name.toLowerCase().trim())
    )
  );
  const [shareCount, setShareCount] = useState<number>(() => {
    return 5 + ((gig.id.charCodeAt(gig.id.length - 1) || 1) % 8);
  });
  const [viewCount] = useState<number>(() => {
    return 148 + (((gig.id.charCodeAt(1) || 2) * 7) % 240);
  });

  // Views in thousands (e.g. "1.8K views" - English clean format)
  const viewCountInK = useMemo(() => {
    const charCode1 = gig.id.charCodeAt(0) || 1;
    const charCode2 = gig.id.charCodeAt(gig.id.length - 1) || 2;
    const rawNum = 1.2 + ((charCode1 * 11 + charCode2 * 7) % 36) / 10;
    const formatted = rawNum % 1 === 0 ? rawNum.toFixed(0) : rawNum.toFixed(1);
    return `${formatted}K views`;
  }, [gig.id]);

  // Multi-image list for gig card gallery - supports single image card or Facebook-style carousel
  const imageList = useMemo(() => {
    const list: string[] = [];
    if (gig.thumbnail) list.push(gig.thumbnail);
    if (gig.galleryImages && Array.isArray(gig.galleryImages)) {
      gig.galleryImages.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if ((gig as any).images && Array.isArray((gig as any).images)) {
      (gig as any).images.forEach((img: string) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (gig.portfolioWork && gig.portfolioWork.length > 0) {
      gig.portfolioWork.forEach((p) => {
        if (p.images && Array.isArray(p.images)) {
          p.images.forEach((im) => {
            if (im && !list.includes(im)) list.push(im);
          });
        }
      });
    }

    // Showcase carousel for multi-image gigs (e.g. gig-2, gig-4, gig-6, gig-8, gig-12) or if gallery has >1 images
    const isCarouselShowcase =
      (gig.galleryImages && gig.galleryImages.length > 1) ||
      gig.id === "gig-2" ||
      gig.id === "gig-4" ||
      gig.id === "gig-6" ||
      gig.id === "gig-8" ||
      gig.id === "gig-12" ||
      (gig as any).isCarousel;

    if (list.length === 1 && isCarouselShowcase) {
      const cat = (gig.category || "").toLowerCase();
      const tit = (gig.title || "").toLowerCase();

      const additionalPool: string[] = [];
      if (cat.includes("design") || tit.includes("logo") || tit.includes("গ্রাফিক") || tit.includes("ui")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
        );
      } else if (cat.includes("web") || cat.includes("code") || tit.includes("ওয়েব") || tit.includes("mern") || tit.includes("react")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        );
      } else if (cat.includes("video") || tit.includes("ভিডিও") || tit.includes("animation")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"
        );
      } else {
        additionalPool.push(
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80"
        );
      }

      additionalPool.forEach((img) => {
        if (list.length < 4 && !list.includes(img)) {
          list.push(img);
        }
      });
    }

    if (list.length === 0) {
      list.push(
        "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"
      );
    }
    return list;
  }, [gig]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);

  // Facebook post relative time (e.g. 15মি / 5 ঘন্টা / 2 দিন / 1 Mar)
  const postTime = useMemo(() => {
    return formatFeedTime((gig as any).createdAt);
  }, [gig]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 35) {
      setCurrentImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    } else if (diff < -35) {
      setCurrentImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    }
    touchStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    if (Math.abs(e.clientX - startX.current) > 6) {
      dragMoved.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging.current && dragMoved.current) {
      const diff = startX.current - e.clientX;
      if (diff > 35) {
        setCurrentImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
      } else if (diff < -35) {
        setCurrentImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
      }
    }
    isDragging.current = false;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const activeImage = imageList[currentImgIndex] || imageList[0];

  // Handle Facebook Like Toggle
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(gig.id, e);
    }
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  // Handle Upvote Reaction Toggle
  const handleUpvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpvoted((prev) => {
      const next = !prev;
      setUpCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      if (next && isDownvoted) {
        setIsDownvoted(false);
        setDownCount((c) => Math.max(0, c - 1));
      }
      return next;
    });
  };

  // Handle Downvote Reaction Toggle
  const handleDownvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownvoted((prev) => {
      const next = !prev;
      setDownCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      if (next && isUpvoted) {
        setIsUpvoted(false);
        setUpCount((c) => Math.max(0, c - 1));
      }
      return next;
    });
  };

  // Handle Send Message to Seller (Facebook Messenger Style)
  const handleMessageSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!effectiveUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    if (openMessengerInbox) {
      openMessengerInbox(undefined, 'messages');
    }
  };

  // Handle Share / Copy Link
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

  // Check if we should render Facebook Mobile Card
  const isFeedMode = layoutMode === 'feed' || layoutMode === 'auto';

  if (isBlocked) {
    return (
      <div className="p-3.5 sm:p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center font-bengali space-y-2 my-2">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          🚫 <strong>{gig.sellerName}</strong>-কে ব্লক করা হয়েছে। এই পোস্ট লুকানো রয়েছে।
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBlocked(false);
            triggerToast("✓ ব্যবহারকারীকে আনব্লক করা হয়েছে।");
          }}
          className="px-3.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-50 text-xs font-bold text-[#006A4E] dark:text-emerald-400 rounded-lg shadow-2xs border border-slate-200 dark:border-slate-600 cursor-pointer active:scale-95 transition"
        >
          আনব্লক করুন
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FACEBOOK POST & MARKETPLACE CARD (SHOWN IN FEED MODE ACROSS MOBILE & PC) */}
      {/* ========================================================================= */}
      <div
        onClick={onClick}
        className={`${
          isFeedMode ? "flex" : "hidden"
        } flex-col bg-white dark:bg-slate-900 border ${
          userOrder
            ? "border-[#006A4E] ring-1 ring-[#006A4E]/20 shadow-md"
            : "border-slate-200 dark:border-slate-800"
        } rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer font-bengali w-full ${className}`}
      >
        {/* --- Facebook Post Header --- */}
        <div className="p-2.5 sm:p-3 pb-1 sm:pb-1.5 flex items-center justify-between gap-2">
          {/* Seller Avatar & Meta */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={
                  gig.sellerAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={gig.sellerName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-1.5 ring-[#006A4E]/20 border border-slate-200 dark:border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#006A4E] rounded-full ring-1.5 ring-white dark:ring-slate-900 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Line 1: Name + Verified Green Tick */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[12.5px] sm:text-[14px] font-bold text-slate-900 dark:text-white truncate">
                  {gig.sellerName}
                </span>
                <CheckCircle2
                  className="w-3.5 h-3.5 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                  title="Verified Profile"
                />
              </div>

              {/* Line 2: Meta Info (Time · Top Rated · Agency/Public) */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap flex-nowrap overflow-hidden">
                <span className="shrink-0">{postTime}</span>
                <span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold select-none leading-none">·</span>
                <span className={`font-semibold shrink-0 ${isBuyerPost ? 'text-blue-600 dark:text-blue-400' : 'text-[#006A4E] dark:text-emerald-400'}`}>
                  {cleanFeedSellerLevel(gig.sellerLevel, isBuyerPost)}
                </span>
                <span className="text-slate-400 dark:text-slate-500 shrink-0 font-bold select-none leading-none">·</span>
                {isAgency ? (
                  <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">Agency</span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400 shrink-0">
                    Public
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" aria-label="Public" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Options (Favorite + 3-dots Menu) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
            {/* Favorite Button (Directly next to 3-dots on Seller Offers) */}
            {!isBuyerPost && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (toggleFavorite) {
                    toggleFavorite(gig.id, e);
                  }
                  triggerToast(
                    !isFavorite
                      ? "✓ পছন্দের তালিকায় যোগ করা হয়েছে!"
                      : "পছন্দের তালিকা থেকে সরানো হয়েছে"
                  );
                }}
                className={`p-1.5 rounded-full transition cursor-pointer active:scale-90 ${
                  isFavorite
                    ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                    : "text-slate-400 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={isFavorite ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় যুক্ত করুন"}
                aria-label={isFavorite ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় যুক্ত করুন"}
              >
                <Heart
                  className={`w-4.5 h-4.5 transition-all duration-200 ${
                    isFavorite ? "fill-rose-500 text-rose-500 scale-105" : "stroke-[1.8]"
                  }`}
                />
              </button>
            )}

            {/* 3-dots More Menu */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
              title="মেনু"
            >
              <MoreHorizontal className="w-4.5 h-4.5" />
            </button>

            {/* Quick 3-Dots Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-9 z-30 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 text-xs space-y-0.5 animate-fadeIn font-bengali"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onClick();
                    }}
                    className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#006A4E] dark:text-emerald-400" />
                    <span>বিস্তারিত</span>
                  </button>

                  {isOwner ? (
                    <>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            onEdit(gig);
                          }}
                          className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium cursor-pointer transition"
                        >
                          <Pencil className="w-3.5 h-3.5 text-blue-500" />
                          <span>এডিট করুন</span>
                        </button>
                      )}
                      {deleteGig && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>মুছে ফেলুন</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          if (toggleFavorite) {
                            toggleFavorite(gig.id, e);
                          }
                          triggerToast(!isFavorite ? "✓ পোস্টটি পছন্দের তালিকায় যোগ করা হয়েছে!" : "পোস্টটি পছন্দের তালিকা থেকে সরানো হয়েছে।");
                        }}
                        className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer transition"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{isFavorite ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় রাখুন"}</span>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      {/* Report Option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          setIsReportModalOpen(true);
                        }}
                        className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium cursor-pointer transition"
                      >
                        <Flag className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isReported ? "রিপোর্ট গৃহীত হয়েছে" : "রিপোর্ট করুন"}</span>
                      </button>

                      {/* Block Option */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          setIsBlockModalOpen(true);
                        }}
                        className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-600 font-medium cursor-pointer transition"
                      >
                        <Ban className="w-3.5 h-3.5 text-red-500" />
                        <span>ব্লক করুন</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- Facebook Post Caption / Title --- */}
        <div className="px-2.5 sm:px-3 pt-0 pb-1.5">
          <p className="text-[12.5px] sm:text-[14px] font-normal text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
            {gig.title}
          </p>
        </div>

        {/* --- Facebook Media: Single Image OR Full-Slide Carousel (Shows 1 image at a time on PC) --- */}
        <div className="relative w-full select-none bg-slate-950 overflow-hidden group/media">
          {/* Main Media Image Frame - Compact on PC to ensure full post fits within screen */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { isDragging.current = false; }}
            className="aspect-[16/10] sm:aspect-[16/9] max-h-[220px] sm:max-h-[260px] md:max-h-[285px] w-full overflow-hidden relative cursor-pointer"
          >
            <img
              src={activeImage}
              alt={`${gig.title} - ${currentImgIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/media:scale-101 pointer-events-none"
            />

            {/* If Carousel: Navigation Arrows, Slide Counter Pill & Dots (Shows ONLY 1 image at a time) */}
            {imageList.length > 1 && (
              <>
                {/* Left Navigation Arrow */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all active:scale-90 cursor-pointer"
                  title="পূর্ববর্তী ছবি"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all active:scale-90 cursor-pointer"
                  title="পরবর্তী ছবি"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* Image Counter Badge */}
                <div className="absolute top-2 right-2 z-20 bg-black/65 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs pointer-events-none">
                  <span>{currentImgIndex + 1}</span>
                  <span>/</span>
                  <span>{imageList.length}</span>
                </div>

                {/* Indicator Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs pointer-events-auto">
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIndex(idx);
                      }}
                      className={`transition-all rounded-full cursor-pointer ${
                        idx === currentImgIndex
                          ? "w-3.5 sm:w-4.5 h-1 sm:h-1.5 bg-white"
                          : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/60 hover:bg-white/90"
                      }`}
                      title={`ছবি ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Card Bottom: Start Work First / Premium / Public Offer + Price */}
          <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className={`text-[11px] sm:text-[13px] ${isBuyerPost ? 'font-normal text-slate-600 dark:text-slate-400' : 'font-semibold'} flex items-center gap-1 ${isWorkFirst ? 'text-[#E31E24]' : isPremium ? 'text-amber-600 dark:text-amber-400' : 'text-[#006A4E] dark:text-emerald-400'}`}>
              {isBuyerPost ? (
                "পাবলিক অফার"
              ) : isWorkFirst ? (
                "⚡ আগে কাজ শুরু"
              ) : isPremium ? (
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span>প্রিমিয়াম</span>
                </span>
              ) : discountPercent ? (
                <span>🎁 {discountPercent.toLocaleString('bn-BD')}% ছাড়</span>
              ) : (
                gig.offerBadge && gig.offerBadge !== 'রেগুলার' && gig.offerBadge !== 'রেগুলার সার্ভিস' ? gig.offerBadge : "স্পেশাল গিগ"
              )}
            </span>
            <div className="flex items-center gap-1 text-[11px] sm:text-[13px]">
              {isFree ? (
                <div className="text-right leading-tight">
                  <span className="font-black text-[10.5px] sm:text-xs text-[#006A4E] dark:text-emerald-400 block">
                    সম্পূর্ণ
                  </span>
                  <span className="font-black text-[10.5px] sm:text-xs text-[#006A4E] dark:text-emerald-400 block">
                    ফ্রি
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">{isBuyerPost ? "বাজেট:" : isPremium ? "বিল:" : "Starts at"}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xs sm:text-sm md:text-base text-[#006A4E] dark:text-emerald-400">
                      ৳{price.toLocaleString("en-US")}
                    </span>
                    {discountPercent ? (
                      <span className="text-[10px] text-slate-400 line-through font-bold">
                        ৳{calculateOriginalPrice(price, discountPercent).toLocaleString("en-US")}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- Reactions & Engagement Counter Bar (Unified: Exact same on Phone & PC) --- */}
        <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between gap-1 text-[10px] sm:text-[11.5px] text-slate-600 dark:text-slate-400">
          {/* 1. Left: Votes Summary */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex -space-x-1 items-center">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#006A4E] text-white flex items-center justify-center text-[8px] sm:text-[9px] shadow-xs ring-1 ring-white">
                <ThumbsUp className="w-2 h-2 fill-white text-white" />
              </span>
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[8px] sm:text-[9px] shadow-xs ring-1 ring-white">
                <ThumbsDown className="w-2 h-2 fill-slate-600 text-slate-600" />
              </span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-[10.5px] sm:text-[12px]">
              মোট {upCount + downCount} জন ভোট দিয়েছেন
            </span>
          </div>

          {/* 2. Right: Views Counter */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span className="font-medium">
                {viewCountInK}
              </span>
            </div>
          </div>
        </div>

        {/* --- Action Bar (Unified for Both Phone & PC: Up, Down, Details) --- */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center px-2 sm:px-3 py-1 sm:py-1.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {/* 1. আপ বাটন (Upvote - সাথে সংখ্যা, ফুল বর্ডার কালার ছাড়া শুধু আইকন কালার) */}
          <button
            type="button"
            onClick={handleUpvoteToggle}
            className="py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs md:text-[12.5px] font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
            title="আপভোট"
          >
            <ThumbsUp
              className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform shrink-0 ${
                isUpvoted ? "fill-[#006A4E] text-[#006A4E] scale-110" : "text-slate-600 dark:text-slate-400"
              }`}
            />
            <span>আপ {upCount}</span>
          </button>

          {/* 2. ডাউন বাটন (Downvote - সাথে সংখ্যা, ফুল বর্ডার কালার ছাড়া শুধু আইকন কালার) */}
          <button
            type="button"
            onClick={handleDownvoteToggle}
            className="py-1 sm:py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs md:text-[12.5px] font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer border border-slate-200/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap"
            title="ডাউনভোট"
          >
            <ThumbsDown
              className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform shrink-0 ${
                isDownvoted ? "fill-rose-600 text-rose-600 scale-110" : "text-slate-600 dark:text-slate-400"
              }`}
            />
            <span>ডাউন {downCount}</span>
          </button>

          {/* 3. বিস্তারিত বাটন (Details - Short Text, No Icon as requested) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-[10.5px] sm:text-xs md:text-[12.5px] font-bold text-white bg-[#006A4E] hover:bg-[#00543e] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
            title="বিস্তারিত"
          >
            <span>বিস্তারিত</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP & COMPACT GRID CARD (SHOWN WHEN IN GRID MODE)                  */}
      {/* ========================================================================= */}
      <div
        onClick={onClick}
        className={`${
          isFeedMode ? "hidden" : "flex"
        } group relative bg-white border ${
          userOrder
            ? "border-[#006A4E] ring-1 ring-[#006A4E]/20 shadow-md"
            : "border-slate-200"
        } rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#006A4E] transition-all duration-300 cursor-pointer flex flex-col justify-between font-bengali ${className}`}
      >
        <div>
          {/* Thumbnail Header with Left/Right Image Navigation */}
          <div className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-950 select-none">
            <img
              src={activeImage}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Soft Bottom Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent pointer-events-none" />

            {/* Top Floating Badges Section */}
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex items-center gap-1 sm:gap-1.5 flex-wrap max-w-[70%] pointer-events-none">
              {isWorkFirst ? (
                <span className="bg-[#E31E24] text-white text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 sm:px-2 rounded shadow-xs flex items-center gap-1">
                  <span>⚡ আগে কাজ শুরু</span>
                </span>
              ) : isPremium ? (
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2 rounded shadow-xs flex items-center gap-1 border border-amber-300/30">
                  <Crown className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white text-white shrink-0" />
                  <span>প্রিমিয়াম</span>
                </span>
              ) : discountPercent ? (
                <span className="bg-[#006A4E] text-white text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                  {discountPercent.toLocaleString('bn-BD')}% ছাড়
                </span>
              ) : gig.offerBadge && gig.offerBadge !== "রেগুলার" && gig.offerBadge !== "রেগুলার সার্ভিস" ? (
                <span className="bg-[#006A4E] text-white text-[9px] sm:text-[11px] font-medium px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                  {gig.offerBadge}
                </span>
              ) : null}

              {userOrder && (
                <span className="bg-[#006A4E] text-white text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                  <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white shrink-0" />
                  <span>Ordered</span>
                </span>
              )}

              {badgeTag && (
                <span className="bg-[#E31E24] text-white text-[8px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded shadow-xs">
                  {badgeTag}
                </span>
              )}
            </div>

            {/* Top Right Action Icons */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 sm:gap-1.5">
              {toggleFavorite && (
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(gig.id, e)}
                  className={`p-1 sm:p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                    isFavorite
                      ? "bg-red-600 text-white shadow-lg scale-105"
                      : "bg-slate-950/70 text-white hover:text-red-400 hover:bg-slate-950 shadow-md"
                  }`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart
                    className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                      isFavorite ? "fill-current" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Clean Navigation < & > */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 z-20 p-1 text-white/90 hover:text-white hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer active:scale-90"
                  title="Previous Image"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 z-20 p-1 text-white/90 hover:text-white hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer active:scale-90"
                  title="Next Image"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Content Body */}
          <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3">
            {/* Seller Identity Bar */}
            <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5 sm:pb-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={
                      gig.sellerAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={gig.sellerName}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#006A4E] rounded-full ring-1 ring-white animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 truncate hover:text-[#006A4E] transition-colors">
                      {gig.sellerName}
                    </span>
                    <CheckCircle2
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006A4E] fill-[#006A4E] text-white shrink-0"
                      title="Verified Profile"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 block truncate font-medium">
                    {isBuyerPost ? "ভেরিফায়েড বায়ার" : (gig.sellerLevel || "টপ রেটেড")}
                  </span>
                </div>
              </div>

              {isBuyerPost ? (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold border border-blue-200 shrink-0">
                  বায়ার
                </span>
              ) : isAgency ? (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-green-50 text-[#006A4E] text-[10px] sm:text-xs font-bold border border-green-200 shrink-0">
                  Agency
                </span>
              ) : (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-semibold border border-slate-200 shrink-0">
                  Pro
                </span>
              )}
            </div>

            {/* Gig Title */}
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 line-clamp-2 leading-snug hover:text-[#006A4E] transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
              {gig.title}
            </h3>

            {/* Key Feature Chips */}
            {gig.tags && gig.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {gig.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[110px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Price & Action Ribbon */}
        <div className="p-2 sm:p-3 sm:p-3.5 md:p-4 border-t border-slate-100 flex items-center justify-between gap-1 bg-slate-50 rounded-b-2xl sm:rounded-b-3xl">
          <div className="min-w-0">
            {isFree ? (
              <div className="leading-tight">
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-[#006A4E] block">
                  সম্পূর্ণ
                </span>
                <span className="text-[11px] sm:text-xs md:text-sm font-black text-[#006A4E] block">
                  ফ্রি
                </span>
              </div>
            ) : (
              <>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium block leading-tight">
                  {isBuyerPost ? "বাজেট:" : isPremium ? "বিল প্রদেয়" : isWorkFirst ? "০ টাকা অগ্রিম" : "Starts at"}
                </span>
                <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-[#006A4E] block leading-tight">
                    ৳{price.toLocaleString("en-US")}
                  </span>
                  {discountPercent ? (
                    <span className="text-[10px] sm:text-xs text-slate-400 line-through font-bold">
                      ৳{calculateOriginalPrice(price, discountPercent).toLocaleString("en-US")}
                    </span>
                  ) : null}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00543e] shadow-xs transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
          >
            <span>{isBuyerPost ? "বিস্তারিত" : isPremium ? "কিনুন" : isWorkFirst ? "কাজ শুরু" : "বিস্তারিত"}</span>
          </button>
        </div>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-300 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 font-bengali pointer-events-none">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bengali"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Flag className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  পোস্ট রিপোর্ট করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
              পোস্ট: <strong>"{gig.title}"</strong> ({gig.sellerName})
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200 block">
                রিপোর্টের কারণ নির্বাচন করুন:
              </label>
              {[
                { id: 'spam', label: 'স্প্যাম বা ভুয়া অফার' },
                { id: 'misleading', label: 'বিভ্রান্তিকর বা অসত্য বিবরণ' },
                { id: 'inappropriate', label: 'অনুপযুক্ত বা আপত্তিকর কন্টেন্ট' },
                { id: 'copyright', label: 'কপিরাইট বা বুদ্ধিবৃত্তিক সম্পদ লঙ্ঘন' },
                { id: 'other', label: 'অন্যান্য কারণ' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name={`report-reason-${gig.id}`}
                    value={item.id}
                    checked={reportReason === item.id}
                    onChange={() => setReportReason(item.id)}
                    className="accent-[#006A4E]"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                অতিরিক্ত তথ্য (ঐচ্ছিক):
              </label>
              <textarea
                rows={2}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="বিস্তারিত বিবরণ লিখুন..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-[#006A4E]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReported(true);
                  setIsReportModalOpen(false);
                  triggerToast("✓ আপনার রিপোর্টটি জমা হয়েছে। টিম এটি পর্যালোচনা করবে।");
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
              >
                রিপোর্ট জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {isBlockModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bengali"
          onClick={() => setIsBlockModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-4 sm:p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {gig.sellerName}-কে ব্লক করতে চান?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              এই ব্যবহারকারীর সমস্ত পোস্ট ও সার্ভিস আপনার ফিড থেকে লুকিয়ে রাখা হবে। পরবর্তীতে যেকোনো সময় আনব্লক করতে পারবেন।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBlockModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                না, ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBlocked(true);
                  setIsBlockModalOpen(false);
                  triggerToast("🚫 ব্যবহারকারীকে ব্লক করা হয়েছে।");
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
              >
                হ্যাঁ, ব্লক করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Owner Only) */}
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
              "{gig.title}" পোস্টটি সম্পূর্ণভাবে মুছে ফেলা হবে।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  if (deleteGig) deleteGig(gig.id);
                  triggerToast("✓ পোস্টটি সফলভাবে মুছে ফেলা হয়েছে।");
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
