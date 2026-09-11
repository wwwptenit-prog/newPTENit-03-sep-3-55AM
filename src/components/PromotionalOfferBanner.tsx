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
    <div className="bg-[#16A34A] text-white py-8 px-4 relative overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Offer Text */}
        <div className="space-y-1.5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            {t('অফার চলমান রয়েছে...', 'Limited Time Offer...')}
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-bold font-bengali">
            {activeOffer.title}
          </h2>
          <p className="text-xs sm:text-sm text-green-50 font-bengali max-w-2xl">
            {activeOffer.subtitle || t("আপনার পছন্দের সার্ভিস বা কোর্সটি আজই অর্ডার/এনরোল করুন", "Enroll or order your desired service/course today")}
          </p>
        </div>

        {/* Right Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Countdown Clock - Clean White Boxes */}
          <div className="flex items-center gap-1.5 font-mono text-white">
            <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-center min-w-[50px] shadow-xs">
              <span className="text-lg font-bold text-[#16A34A] block">{timeLeft.days}</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">{t('দিন', 'Days')}</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-center min-w-[50px] shadow-xs">
              <span className="text-lg font-bold text-[#16A34A] block">{timeLeft.hours}</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">{t('ঘণ্টা', 'Hours')}</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-center min-w-[50px] shadow-xs">
              <span className="text-lg font-bold text-[#16A34A] block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">{t('মিনিট', 'Mins')}</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-center min-w-[50px] shadow-xs">
              <span className="text-lg font-bold text-[#16A34A] block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-slate-500 uppercase font-sans font-semibold">{t('সেকেন্ড', 'Secs')}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-5 py-2.5 rounded-lg font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2 text-sm shrink-0"
          >
            {activeOffer.ctaText || t("অফারটি গ্রহণ করুন", "Claim Offer Now")}
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
