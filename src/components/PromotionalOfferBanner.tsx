import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

interface PromotionalOfferBannerProps {
  setActiveTab: (tab: string) => void;
}

export const PromotionalOfferBanner: React.FC<PromotionalOfferBannerProps> = ({ setActiveTab }) => {
  const { offers, t } = useData();
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

  return (
    <div className="relative bg-gradient-to-r from-[#005a42]/95 via-[#006A4E]/90 to-[#0284c7]/90 backdrop-blur-2xl text-white py-8 px-4 overflow-hidden border-b border-cyan-400/20 shadow-lg liquid-specular-top">
      {/* Luminous Ambient Background Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Offer Text */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
            <Tag className="w-3.5 h-3.5" />
            {t('অফার চলমান রয়েছে...', 'Limited Time Offer...')}
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-bold font-bengali drop-shadow-xs">
            {activeOffer.title}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-50 font-bengali max-w-2xl font-medium">
            {activeOffer.subtitle || t("আপনার পছন্দের সার্ভিস বা কোর্সটি আজই অর্ডার/এনরোল করুন", "Enroll or order your desired service/course today")}
          </p>
        </div>

        {/* Right Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Countdown Clock - Floating Glass Boxes */}
          <div className="flex items-center gap-2 font-mono text-white">
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white border border-white/95 dark:border-white/20 px-3.5 py-2 rounded-xl text-center min-w-[54px] shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-transform">
              <span className="text-lg font-black text-[#006A4E] dark:text-cyan-400 block">{timeLeft.days}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">{t('দিন', 'Days')}</span>
            </div>
            <span className="text-xl font-bold text-white/80">:</span>
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white border border-white/95 dark:border-white/20 px-3.5 py-2 rounded-xl text-center min-w-[54px] shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-transform">
              <span className="text-lg font-black text-[#006A4E] dark:text-cyan-400 block">{timeLeft.hours}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">{t('ঘণ্টা', 'Hours')}</span>
            </div>
            <span className="text-xl font-bold text-white/80">:</span>
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white border border-white/95 dark:border-white/20 px-3.5 py-2 rounded-xl text-center min-w-[54px] shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-transform">
              <span className="text-lg font-black text-[#006A4E] dark:text-cyan-400 block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">{t('মিনিট', 'Mins')}</span>
            </div>
            <span className="text-xl font-bold text-white/80">:</span>
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white border border-white/95 dark:border-white/20 px-3.5 py-2 rounded-xl text-center min-w-[54px] shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-transform">
              <span className="text-lg font-black text-[#006A4E] dark:text-cyan-400 block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">{t('সেকেন্ড', 'Secs')}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#E31E24] to-[#BE123C] border border-rose-300/40 shadow-xl shadow-rose-950/30 hover:shadow-rose-900/40 active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-sm shrink-0"
          >
            {activeOffer.ctaText || t("অফারটি গ্রহণ করুন", "Claim Offer Now")}
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
