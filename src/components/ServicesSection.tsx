import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  Star,
  Clock,
  Check,
  BadgeCheck,
  Briefcase,
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ImageIcon,
  ExternalLink,
  Crown,
  Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { ServiceDetailModal } from './ServiceDetailModal';
import { DigitalProductsSection } from './DigitalProductsSection';
import { getLocalizedService } from '../utils/localization';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award
};

interface ServicesSectionProps {
  setActiveTab?: (tab: string, category?: string) => void;
  openAuthModal?: () => void;
  isStandalonePage?: boolean;
  onBack?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  openAuthModal,
  isStandalonePage = false,
  onBack
}) => {
  const { currentUser, services, gigs, siteSettings, t, lang, createDirectGigOrder } = useData();

  // Selected Service for Dedicated Service Detail Modal (Matching DigitalProductDetailModal!)
  const [selectedService, setSelectedService] = useState<Service | MarketplaceGig | null>(null);

  const savedServiceScrollPosRef = useRef<number>(0);

  // Open Service Details in Dedicated Service Detail Modal
  const handleOpenServiceDetail = (service: Service) => {
    savedServiceScrollPosRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const gigObj = mapServiceToGig(service);
    setSelectedService(gigObj as any);
  };

  const handleCloseServiceDetail = () => {
    const targetY = savedServiceScrollPosRef.current;
    setSelectedService(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      }, 40);
    });
  };

  // Helper to map an Agency Service into a Marketplace Gig format for detailed package ordering in ServiceDetailModal
  const mapServiceToGig = (service: Service): MarketplaceGig => {
    const locService = getLocalizedService(service, lang);

    const matchedGig = gigs.find(
      g => g.id === service.id || g.title.toLowerCase() === service.title.toLowerCase()
    );
    if (matchedGig) {
      return {
        ...matchedGig,
        title: locService.title,
        category: locService.category,
        description: locService.shortDescription,
        sellerName: 'PTENit Official Agency',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        sellerLevel: 'Official Top Rated Agency',
        isAgencyStaff: true,
        demoImages: service.demoImages || (service.galleryImages ? service.galleryImages : matchedGig.demoImages),
        demoUrl: service.demoUrl || matchedGig.demoUrl,
        offerBadge: matchedGig.offerBadge || (lang === 'en' ? 'Official Guarantee' : 'অফিশিয়াল গ্যারান্টি')
      };
    }

    const defaultFeatures = locService.features && locService.features.length > 0
      ? locService.features
      : (lang === 'en'
        ? ['Custom Responsive Design', 'SEO Friendly Structure', 'Technical Support', 'Source Code Delivery']
        : ['কাস্টম রেসপন্সিভ ডিজাইন', 'এসইও ফ্রেন্ডলি স্ট্রাকচার', 'টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি']);

    return {
      id: service.id,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerLevel: 'Official Top Rated Agency',
      isAgencyStaff: true,
      title: locService.title,
      category: locService.category,
      description: locService.fullDescription || locService.shortDescription,
      thumbnail: service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      demoImages: service.demoImages || (service.galleryImages ? service.galleryImages : undefined),
      demoUrl: service.demoUrl,
      rating: service.rating || 5.0,
      reviewsCount: service.reviewsCount || 48,
      salesCount: 150,
      packages: {
        basic: {
          name: service.packages?.basic?.name || (lang === 'en' ? 'Basic Package' : 'বেসিক প্যাকেজ'),
          price: service.packages?.basic?.price ?? 5000,
          deliveryDays: service.packages?.basic?.deliveryDays ?? 3,
          revisions: (service.packages?.basic?.revisions as any) || '3',
          features: service.packages?.basic?.features || defaultFeatures.slice(0, 3)
        },
        standard: {
          name: service.packages?.standard?.name || (lang === 'en' ? 'Standard Package' : 'স্ট্যান্ডার্ড প্যাকেজ'),
          price: service.packages?.standard?.price ?? 12000,
          deliveryDays: service.packages?.standard?.deliveryDays ?? 5,
          revisions: (service.packages?.standard?.revisions as any) || '5',
          features: service.packages?.standard?.features || defaultFeatures.slice(0, 4)
        },
        premium: {
          name: service.packages?.premium?.name || (lang === 'en' ? 'Premium Package' : 'প্রিমিয়াম প্যাকেজ'),
          price: service.packages?.premium?.price ?? 25000,
          deliveryDays: service.packages?.premium?.deliveryDays ?? 7,
          revisions: (service.packages?.premium?.revisions as any) || 'Unlimited',
          features: service.packages?.premium?.features || defaultFeatures
        }
      },
      tags: ['Official Agency', 'PTENit Guarantee', locService.category],
      status: 'active' as const,
      offerBadge: lang === 'en' ? 'Official Agency' : 'অফিশিয়াল এজেন্সি'
    };
  };

  // Render Official Agency Package Card - Exactly Styled Like Digital Products (Clean product card, no Facebook post UI)
  const renderServiceCard = (service: Service) => {
    const locService = getLocalizedService(service, lang);
    const price =
      service.packages?.basic?.price ??
      (service.priceText ? parseInt(service.priceText.replace(/[^0-9]/g, '')) || 5000 : 5000);

    const thumbnail =
      locService.thumbnail ||
      service.thumbnail ||
      service.galleryImages?.[0] ||
      service.demoImages?.[0] ||
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

    const rating = service.rating || 5.0;
    const reviewsCount = service.reviewsCount || 48;

    // Determine badge: 'আগে কাজ শুরু' অথবা 'প্রিমিয়াম'
    const isPremium =
      service.badge === 'প্রিমিয়াম' ||
      service.badge === 'Premium' ||
      service.offerBadge === 'premium' ||
      (service.badge !== 'আগে কাজ শুরু' && ['web-dev', 'branding', 'software-dev', 'app-development'].includes(service.id));

    const badgeLabel = isPremium ? t('প্রিমিয়াম', 'Premium') : t('আগে কাজ শুরু', 'Start Work First');

    return (
      <div
        key={service.id}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 hover:border-emerald-600/50 dark:hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          {/* Clean Cover Thumbnail - purely the image without text overlays */}
          <div
            onClick={() => handleOpenServiceDetail(service)}
            className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer"
          >
            <img
              src={thumbnail}
              alt={locService.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>

          {/* Card Body */}
          <div className="p-2.5 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
            {/* Title & Name */}
            <div>
              <h3
                onClick={() => handleOpenServiceDetail(service)}
                className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-3 sm:line-clamp-2 leading-snug group-hover:text-[#006A4E] transition-colors cursor-pointer min-h-[3rem] sm:min-h-[2.5rem]"
                title={locService.title}
              >
                {locService.title}
              </h3>
            </div>

            {/* Type (আগে কাজ শুরু / প্রিমিয়াম) & Verified Info */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
              {isPremium ? (
                <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[10px] sm:text-[11px]">
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span>{badgeLabel}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-[#006A4E] dark:text-emerald-400 text-[10px] sm:text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006A4E] dark:text-emerald-400 shrink-0" />
                  <span>{badgeLabel}</span>
                </span>
              )}
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold tracking-wide">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Harmonized Price & Action Button */}
        <div className="p-2.5 sm:p-3.5 bg-slate-50/90 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 rounded-b-2xl">
          <div className="min-w-0">
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-none mb-1 uppercase tracking-wider">
                {t('শুরু', 'Starts at')}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-[#006A4E] dark:text-emerald-400 tracking-tight leading-none">
                ৳{price.toLocaleString('bn-BD')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenServiceDetail(service)}
            className="py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 bg-[#006A4E] hover:bg-[#00543e] text-white group/btn"
          >
            <span>{t('বিস্তারিত', 'Details')}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    );
  };

  const allPublishedServices = services.filter(s => s.published);

  // STANDALONE FULL-PAGE VIEW FOR OFFICIAL AGENCY PACKAGES
  if (isStandalonePage) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 font-bengali text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          {/* Top Header Bar - Centered on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 text-center sm:text-left">
            <div className="space-y-1.5 flex flex-col items-center sm:items-start">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('আমাদের সার্ভিসসমূহ', 'Our Services')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {t('সরাসরি আমাদের এক্সপার্ট টিম থেকে প্রফেশনাল ওয়েব, মোবাইল অ্যাপ, এআই সফটওয়্যার ও সার্ভিস গ্রহণ করুন।', 'Get professional web, mobile app, AI software, and custom digital services directly from our expert team.')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
                  title={t('পূর্ববর্তী স্থানে ফিরে যান', 'Go back to previous page')}
                >
                  <ArrowLeft className="w-4 h-4 text-[#38BDF8]" />
                  <span>{t('ফিরে যান', 'Back')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Agency Services - All services shown directly on PC & Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {allPublishedServices.map(renderServiceCard)}
          </div>

        </div>

        {/* IN-PLACE SERVICE DETAIL MODAL */}
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={handleCloseServiceDetail}
            setActiveTab={setActiveTab}
            openAuthModal={openAuthModal}
          />
        )}
      </div>
    );
  }

  // HOME PAGE SECTION VIEW - Show official agency packages (4 on PC for 1 row of 4)
  const visibleAgencyServices = allPublishedServices.slice(0, 4);

  return (
    <div className="w-full">
      {/* SECTION 1: Official Agency Packages - হালকা শেড / অফ-হোয়াইট (Soft Light Shade, not full white) */}
      <section className="py-10 sm:py-14 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 sm:mb-6">
            <div className="space-y-0.5 sm:space-y-1 text-left min-w-0">
              <h2 className="text-sm sm:text-lg md:text-2xl font-bold font-bengali text-slate-900 dark:text-white leading-tight">
                {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
              </h2>
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium font-bengali">
                {t('PTENit এর গ্যারান্টিযুক্ত সার্ভিস প্যাকেজ।', 'Guaranteed official IT service packages.')}
              </p>
            </div>

            {!isStandalonePage && setActiveTab && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-[#006A4E] font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Agency Services Grid: Desktop shows 4 in 1 row; Mobile shows 4 cards */}
          <div className="space-y-4">
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>

            {/* Mobile (Visible only on mobile): 4 items */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Digital Products Section - একদুম সাদা (Completely Pure White) */}
      <section className="py-10 sm:py-14 bg-white text-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DigitalProductsSection setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* IN-PLACE SERVICE DETAIL MODAL (Matching DigitalProductDetailModal!) */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={handleCloseServiceDetail}
          setActiveTab={setActiveTab}
          openAuthModal={openAuthModal}
        />
      )}
    </div>
  );
};
