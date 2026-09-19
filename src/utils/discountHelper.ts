/**
 * Utility functions to dynamically extract, calculate, and format discounts for gigs & services.
 * Ensures discounts are calculated accurately and prevents hardcoded fallback percentages (e.g. 30%).
 */

/**
 * Extracts numeric discount percentage from badge text.
 * Supports Bengali numerals (০-৯) and English numerals (0-9).
 * Examples:
 * - "🎁 ৩০% ছাড়" -> 30
 * - "৩০% ছাড়" -> 30
 * - "২০% ছাড়" -> 20
 * - "10% Off" -> 10
 * - "৫০% ছাড়" -> 50
 * - "৫% ছাড়" -> 5
 * - "⚡ আগে কাজ শুরু" -> null
 * - "👑 প্রিমিয়াম" -> null
 * - "রেগুলার" / "রেগুলার সার্ভিস" -> null
 */
export const extractDiscountPercent = (badge?: string | null): number | null => {
  if (!badge || typeof badge !== 'string') return null;
  const str = badge.trim();
  if (!str) return null;

  // Convert Bengali numerals to English numerals
  const normalized = str.replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());

  // Match 1-2 digits followed by optional whitespace and %
  const match = normalized.match(/(\d{1,2})\s*%/);
  if (match) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val > 0 && val < 100) {
      return val;
    }
  }

  return null;
};

/**
 * Calculates the original (pre-discount) regular price given the discounted price and discount percentage.
 * Formula: originalPrice = Math.round(discountedPrice / (1 - discountPercent / 100))
 * Example:
 * If discountedPrice = 3500 and discountPercent = 30:
 * originalPrice = Math.round(3500 / 0.70) = 5000.
 */
export const calculateOriginalPrice = (
  discountedPrice: number,
  discountPercent?: number | null
): number => {
  if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) {
    return discountedPrice;
  }
  return Math.round(discountedPrice / (1 - discountPercent / 100));
};

/**
 * Calculates the total discount amount (savings).
 */
export const calculateDiscountSavings = (
  discountedPrice: number,
  discountPercent?: number | null
): number => {
  if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) {
    return 0;
  }
  const original = calculateOriginalPrice(discountedPrice, discountPercent);
  return Math.max(0, original - discountedPrice);
};
