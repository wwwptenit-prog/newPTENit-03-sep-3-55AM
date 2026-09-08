import React from 'react';
import { Zap, Gift, CheckCircle2, Crown } from 'lucide-react';

export type SingleBadgeType =
  | 'pro_service'
  | 'free_offer'
  | 'work_first'
  | 'premium_service'
  | 'completely_free';

export interface SingleBadgeInfo {
  type: SingleBadgeType;
  label: string;
  iconName: 'Zap' | 'Gift' | 'CheckCircle2' | 'Crown';
  topbarTextClass: string;
  cardClass: string;
}

export interface BadgeItemInput {
  id?: string;
  title?: string;
  offerBadge?: string;
  price?: number;
  isFree?: boolean;
  isAgencyStaff?: boolean;
}

/**
 * Returns exactly ONE badge depending on the product type and pricing:
 *
 * 1. Course (কোর্স):
 *    - ফ্রি হলে: 'সম্পূর্ণ ফ্রি কোর্স' (Completely Free Course)
 *    - প্রাইজ থাকলে (> 0): 'প্রিমিয়াম কোর্স' (Premium Course)
 *
 * 2. Digital Product (ডিজিটাল প্রোডাক্ট):
 *    - ফ্রি হলে: 'সম্পূর্ণ ফ্রি এক্সেস' (Completely Free Access)
 *    - প্রাইজ থাকলে (> 0): 'প্রিমিয়াম এক্সেস' (Premium Access)
 *
 * 3. Gig / Service (গিগ বা সার্ভিস):
 *    - 'আগে কাজ শুরু' (Start Work First) OR 'প্রিমিয়াম সার্ভিস' (Premium Service)
 */
export type BadgeCategoryType = 'digital_product' | 'course' | 'gig' | 'service';

export const getSingleBadgeInfo = (
  item?: BadgeItemInput,
  itemType: BadgeCategoryType | string = 'gig'
): SingleBadgeInfo => {
  const badge = (item?.offerBadge || '').trim().toLowerCase();
  const title = (item?.title || '').trim().toLowerCase();
  const numPrice = item?.price !== undefined && item?.price !== null ? Number(item.price) : undefined;

  // Determine if it is explicitly completely free
  const isFree =
    item?.isFree === true ||
    numPrice === 0 ||
    badge === 'free_offer' ||
    badge === 'completely_free' ||
    badge.includes('সম্পূর্ণ ফ্রি') ||
    badge.includes('free') ||
    badge.includes('ফ্রি') ||
    title.includes('সম্পূর্ণ ফ্রি') ||
    title.includes('free');

  // ==========================================
  // 1. COURSE: সম্পূর্ণ ফ্রি কোর্স বা প্রিমিয়াম কোর্স
  // ==========================================
  if (itemType === 'course') {
    if (isFree) {
      return {
        type: 'completely_free',
        label: 'সম্পূর্ণ ফ্রি কোর্স',
        iconName: 'Gift',
        topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
        cardClass: 'bg-emerald-700 text-white font-bold',
      };
    }

    return {
      type: 'premium_service',
      label: 'প্রিমিয়াম কোর্স',
      iconName: 'Crown',
      topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
      cardClass: 'bg-emerald-800 text-white font-bold',
    };
  }

  // ==========================================
  // 2. DIGITAL PRODUCT: সম্পূর্ণ ফ্রি এক্সেস বা প্রিমিয়াম এক্সেস
  // ==========================================
  if (itemType === 'digital_product') {
    if (isFree) {
      return {
        type: 'completely_free',
        label: 'সম্পূর্ণ ফ্রি এক্সেস',
        iconName: 'Gift',
        topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
        cardClass: 'bg-emerald-700 text-white font-bold',
      };
    }

    return {
      type: 'premium_service',
      label: 'প্রিমিয়াম এক্সেস',
      iconName: 'Crown',
      topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
      cardClass: 'bg-emerald-800 text-white font-bold',
    };
  }

  // ==========================================
  // 3. GIG / SERVICE: আগে কাজ শুরু বা প্রিমিয়াম সার্ভিস
  // ==========================================
  if (isFree) {
    return {
      type: 'completely_free',
      label: 'সম্পূর্ণ ফ্রি',
      iconName: 'Gift',
      topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
      cardClass: 'bg-emerald-700 text-white font-bold',
    };
  }

  // If explicitly 'work_first' or 'আগে কাজ শুরু'
  if (
    badge === 'work_first' ||
    badge.includes('কাজ শুরু') ||
    badge.includes('work_first')
  ) {
    return {
      type: 'work_first',
      label: 'আগে কাজ শুরু',
      iconName: 'CheckCircle2',
      topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
      cardClass: 'bg-emerald-800 text-white font-bold',
    };
  }

  // Default to প্রিমিয়াম সার্ভিস
  return {
    type: 'premium_service',
    label: 'প্রিমিয়াম সার্ভিস',
    iconName: 'Crown',
    topbarTextClass: 'text-emerald-800 dark:text-emerald-400',
    cardClass: 'bg-emerald-800 text-white font-bold',
  };
};

/**
 * Top-bar Badge Component
 * টববার ফিক্সট সহ কালার গাড় সবুজ এবং আইকন টেক্স সহ সাদা কালার
 */
export const SinglePromoBadgeView: React.FC<{
  item?: BadgeItemInput;
  itemType?: BadgeCategoryType | string;
  className?: string;
  textColor?: string;
}> = ({ item, itemType = 'gig', className = '', textColor = 'text-slate-900 dark:text-slate-100' }) => {
  const badgeInfo = getSingleBadgeInfo(item, itemType);
  const colorClass = textColor || 'text-slate-900 dark:text-slate-100';

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-bengali whitespace-nowrap border-0 outline-none ${colorClass} ${className}`}
    >
      {badgeInfo.type === 'pro_service' && (
        <Zap className={`w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current ${colorClass} shrink-0`} />
      )}
      {(badgeInfo.type === 'free_offer' || badgeInfo.type === 'completely_free') && (
        <Gift className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${colorClass} shrink-0`} />
      )}
      {badgeInfo.type === 'work_first' && (
        <CheckCircle2 className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${colorClass} shrink-0`} />
      )}
      {badgeInfo.type === 'premium_service' && (
        <Crown className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${colorClass} shrink-0`} />
      )}
      <span className={colorClass}>{badgeInfo.label}</span>
    </div>
  );
};
