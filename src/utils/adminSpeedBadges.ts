import { syncDocToFirestore } from '../services/firestoreSync';

export interface AdminSpeedBadge {
  level: 'ultra' | 'fast' | 'active' | 'steady';
  title: string;
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextCol: string;
  speedScore: number; // 0-100%
  avgResponseTime: string;
  completedActions: number;
  icon: string;
  description: string;
}

/**
 * Automatically calculates dynamic speed and performance badges
 * for admins and staff based on verified actions, processed bills,
 * resolved tickets, and total workload velocity.
 */
export function computeAdminSpeedBadge(
  adminEmail: string = '',
  actionsCount: number = 0,
  additionalMetrics?: {
    verifiedBills?: number;
    resolvedTickets?: number;
    processedOrders?: number;
  }
): AdminSpeedBadge {
  const verified = additionalMetrics?.verifiedBills || 0;
  const tickets = additionalMetrics?.resolvedTickets || 0;
  const orders = additionalMetrics?.processedOrders || 0;

  // Weighted activity score calculation
  const totalScore = actionsCount + (verified * 6) + (tickets * 4) + (orders * 3);

  if (totalScore >= 900) {
    return {
      level: 'ultra',
      title: 'সুপারফাস্ট এক্সিকিউটর',
      badgeText: '⚡ লাইটনিং ফাস্ট (গতি: ৯৯%)',
      badgeBg: 'bg-emerald-500/15',
      badgeBorder: 'border-emerald-500/40',
      badgeTextCol: 'text-emerald-300',
      speedScore: 99,
      avgResponseTime: '< ১ মিনিট',
      completedActions: Math.max(totalScore, 1200),
      icon: '⚡',
      description: 'অনতিবিলম্বে সকল কাজ ও বিল ভেরিফিকেশন সম্পন্নকারী'
    };
  } else if (totalScore >= 400) {
    return {
      level: 'fast',
      title: 'উচ্চ গতিশীল এডমিন',
      badgeText: '🚀 উচ্চ গতিশীল (গতি: ৯৪%)',
      badgeBg: 'bg-sky-500/15',
      badgeBorder: 'border-sky-500/40',
      badgeTextCol: 'text-sky-300',
      speedScore: 94,
      avgResponseTime: '< ৩ মিনিট',
      completedActions: Math.max(totalScore, 580),
      icon: '🚀',
      description: 'অত্যন্ত দ্রুত সময়ের মধ্যে দায়িত্ব পালন ও অর্ডার প্রসেসিং'
    };
  } else if (totalScore >= 120) {
    return {
      level: 'active',
      title: 'সক্রিয় ও নির্ভরযোগ্য',
      badgeText: '⭐ নির্ভরযোগ্য ও দ্রুত (গতি: ৮৮%)',
      badgeBg: 'bg-amber-500/15',
      badgeBorder: 'border-amber-500/40',
      badgeTextCol: 'text-amber-300',
      speedScore: 88,
      avgResponseTime: '< ৭ মিনিট',
      completedActions: Math.max(totalScore, 180),
      icon: '⭐',
      description: 'নিয়মিত ও নির্ভরযোগ্যভাবে প্ল্যাটফর্ম পরিচালনা'
    };
  } else {
    return {
      level: 'steady',
      title: 'স্ট্যান্ডার্ড পারফর্মার',
      badgeText: '🎯 স্ট্যান্ডার্ড গতি (গতি: ৮০%)',
      badgeBg: 'bg-purple-500/15',
      badgeBorder: 'border-purple-500/40',
      badgeTextCol: 'text-purple-300',
      speedScore: 80,
      avgResponseTime: '< ১৫ মিনিট',
      completedActions: Math.max(totalScore, 45),
      icon: '🎯',
      description: 'ধীরস্থির ও নিখুঁতভাবে কার্যসম্পাদনকারী'
    };
  }
}

/**
 * Persist admin activity & speed metric to Firebase Firestore
 */
export async function syncAdminSpeedToFirebase(
  adminEmail: string,
  badge: AdminSpeedBadge,
  actionsTakenCount: number
) {
  if (!adminEmail) return;
  const safeDocId = adminEmail.replace(/[@.]/g, '_');
  await syncDocToFirestore('admin_speed_records', safeDocId, {
    adminEmail,
    badgeLevel: badge.level,
    badgeTitle: badge.title,
    speedScore: badge.speedScore,
    avgResponseTime: badge.avgResponseTime,
    actionsTakenCount,
    updatedAt: new Date().toISOString()
  });
}
