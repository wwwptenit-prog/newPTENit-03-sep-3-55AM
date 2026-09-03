import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Play, Code2, LineChart, Award, Users, Bot, BadgeCheck, GraduationCap, Headphones, ShoppingBag } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const { siteSettings, t, lang } = useData();

  const heroHeading = lang === 'en'
    ? (siteSettings.heroHeadingEn || "Build Your Career & Business Digitally")
    : (siteSettings.heroHeading || "ডিজিটাল ক্যারিয়ার ও বিজনেস গড়ুন");

  const heroSubtext = lang === 'en'
    ? (siteSettings.heroSubtextEn || "Modern IT services, custom software, digital marketing, and professional IT training with lifetime support.")
    : (siteSettings.heroSubtext || "আধুনিক IT সেবাসমূহ, কাস্টম সফটওয়্যার, ডিজিটাল মার্কেটিং ও প্রফেশনাল ট্রেনিং।");

  return (
    <div className="relative bg-gradient-to-b from-[#142B4D] via-[#10223E] to-[#142B4D] text-white py-8 sm:py-12 lg:py-16 overflow-hidden border-b border-slate-800">
      {/* Abstract Glowing Background Orbs */}
      <div className="absolute top-1/4 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#1DB954]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-bengali leading-snug sm:leading-tight lg:leading-tight text-white tracking-tight"
            >
              {heroHeading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm md:text-base text-slate-300 font-bengali max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {heroSubtext}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3"
            >
              <button
                onClick={() => setActiveTab('services')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-[#1DB954] hover:bg-emerald-500 shadow-lg shadow-[#1DB954]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 group text-xs sm:text-sm md:text-base font-bengali"
              >
                {t('সার্ভিস দেখুন', 'Explore Services')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-slate-100 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 hover:border-[#1DB954] transition-all cursor-pointer text-xs sm:text-sm md:text-base flex items-center gap-1.5 font-bengali"
              >
                {t('মার্কেটপ্লেস', 'Marketplace')}
                <Play className="w-3.5 h-3.5 text-[#1DB954] fill-[#1DB954]" />
              </button>
            </motion.div>

            {/* Micro Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-3 sm:pt-4 border-t border-slate-800/80 max-w-md lg:max-w-xl mx-auto lg:mx-0"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 justify-start pl-1 sm:pl-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-200 font-bengali truncate">{t('AI সাপোর্ট', 'AI Support')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 justify-start pl-1 sm:pl-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-200 font-bengali truncate">{t('সার্টিফিকেট', 'Certificate')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 justify-start pl-1 sm:pl-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-200 font-bengali truncate">{t('বিশ্বস্ত ট্রেনিং', 'Trusted Training')}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 justify-start pl-1 sm:pl-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-200 font-bengali truncate">{t('লাইফটাইম সাপোর্ট', 'Lifetime Support')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Interactive Tech Graphics */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Glass Computer Mockup Container */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-3 sm:p-4 shadow-2xl shadow-emerald-950/50 backdrop-blur-md relative overflow-hidden">
                {/* Browser Top Header */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md">
                    https://ptenit.com/platform
                  </span>
                </div>

                {/* Dashboard / Analytics Graphic Simulation */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-700 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 bg-[#1DB954]/20 rounded-lg text-[#1DB954] shrink-0">
                        <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t('এক্টিভ কোড স্ট্যাক', 'Active Code Stack')}</p>
                        <p className="text-xs sm:text-sm font-bold text-white truncate">React + Next.js</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-700 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
                        <LineChart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{t('এসইও ও মার্কেটিং', 'SEO & Marketing')}</p>
                        <p className="text-xs sm:text-sm font-bold text-white truncate">+245% ROI</p>
                      </div>
                    </div>
                  </div>

                  {/* Code / Visual Preview Box or Custom Uploaded Hero Banner */}
                  {siteSettings.heroBannerUrl ? (
                    <div className="rounded-xl overflow-hidden border border-slate-800 shadow-lg max-h-48">
                      <img src={siteSettings.heroBannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 text-left font-mono text-[11px] sm:text-xs text-slate-300 space-y-1.5 sm:space-y-2 relative">
                      <div className="text-slate-500">// PTENit Digital Core Engine</div>
                      <div className="text-emerald-400">
                        const <span className="text-sky-300">ptenItPlatform</span> = &#123;
                      </div>
                      <div className="pl-3 sm:pl-4 text-amber-300">
                        services: <span className="text-slate-200">['Web', 'SEO', 'Marketing', 'Graphics']</span>,
                      </div>
                      <div className="pl-3 sm:pl-4 text-emerald-300">
                        trainingStatus: <span className="text-[#1DB954]">{t("'ভর্তি চলছে'", "'Enrollment Open'")}</span>
                      </div>
                      <div className="text-emerald-400">&#125;;</div>
                    </div>
                  )}

                  {/* Floating Action Badge */}
                  <div className="bg-gradient-to-r from-[#1DB954] to-emerald-600 p-2.5 sm:p-3.5 rounded-xl text-white font-bold text-[11px] sm:text-xs flex items-center justify-between shadow-lg">
                    <span className="font-bengali truncate pr-2">{t('লাইভ ক্লাস ও ফ্রিল্যান্সিং গাইডলাইন', 'Live Classes & Freelancing Guidance')}</span>
                    <span className="bg-white/20 px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] shrink-0 font-sans uppercase">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-slate-800/95 border border-[#1DB954]/50 text-white p-2.5 sm:p-3 rounded-xl shadow-xl hidden sm:flex items-center gap-2.5 sm:gap-3"
              >
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1DB954] animate-ping shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#1DB954]">{t('নতুন ব্যাচ শুরু', 'New Batch Admission')}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-bengali">{t('ক্যানভা ও ইউটিউব এসইও', 'Canva & YouTube SEO')}</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};
