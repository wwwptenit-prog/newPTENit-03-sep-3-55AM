import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatLocalizedNumber } from '../utils/localization';

interface PromotionalOfferBannerProps {
  setActiveTab: (tab: string) => void;
}

export const PromotionalOfferBanner: React.FC<PromotionalOfferBannerProps> = ({ setActiveTab }) => {
  const { offers, t, lang } = useData();
  const activeOffer = offers.find(o => o.active);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!activeOffer?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(activeOffer.endDate).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  if (!activeOffer) return null;

  const displayTitle = lang === 'en'
    ? (activeOffer.titleEn || (activeOffer.title === "ঈদ মেগা অফার!" ? "Special Mega Offer!" : activeOffer.title))
    : activeOffer.title;

  const displaySubtitle = lang === 'en'
    ? (activeOffer.subtitleEn || "Up to 50% discount & cashback on all premium courses and agency services")
    : (activeOffer.subtitle || t("আপনার পছন্দের সার্ভিস বা কোর্সটি আজই অর্ডার/এনরোল করুন", "Enroll or order your desired service/course today"));

  const displayCta = lang === 'en'
    ? (activeOffer.ctaTextEn || "Claim Offer Now")
    : (activeOffer.ctaText || "অফারটি গ্রহণ করুন");

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-[#1DB954] to-teal-700 text-white py-6 sm:py-8 lg:py-10 px-4 relative overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
        
        {/* Left Offer Text */}
        <div className="space-y-1.5 sm:space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? (activeOffer.discountBadgeEn || 'Special Deal') : (activeOffer.discountBadge || 'বিশেষ অফার')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-bengali leading-snug">
            {displayTitle}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100 font-bengali max-w-2xl leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Right Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
            <div className="bg-slate-900/85 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[46px] sm:min-w-[55px] border border-white/20 shadow-md">
              <span className="text-lg sm:text-xl font-bold block">{formatLocalizedNumber(timeLeft.days, lang)}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 uppercase font-sans">{t('দিন', 'Days')}</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold">:</span>
            <div className="bg-slate-900/85 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[46px] sm:min-w-[55px] border border-white/20 shadow-md">
              <span className="text-lg sm:text-xl font-bold block">{formatLocalizedNumber(timeLeft.hours, lang)}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 uppercase font-sans">{t('ঘণ্টা', 'Hours')}</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold">:</span>
            <div className="bg-slate-900/85 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[46px] sm:min-w-[55px] border border-white/20 shadow-md">
              <span className="text-lg sm:text-xl font-bold block">{formatLocalizedNumber(timeLeft.minutes, lang)}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 uppercase font-sans">{t('মিনিট', 'Mins')}</span>
            </div>
            <span className="text-lg sm:text-2xl font-bold">:</span>
            <div className="bg-slate-900/85 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[46px] sm:min-w-[55px] border border-white/20 shadow-md">
              <span className="text-lg sm:text-xl font-bold block">{formatLocalizedNumber(timeLeft.seconds, lang)}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 uppercase font-sans">{t('সেকেন্ড', 'Secs')}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-[#142B4D] bg-white hover:bg-emerald-50 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-xs sm:text-sm shrink-0"
          >
            {displayCta}
            <ArrowRight className="w-4 h-4 text-[#1DB954]" />
          </button>
        </div>

      </div>
    </div>
  );
};
