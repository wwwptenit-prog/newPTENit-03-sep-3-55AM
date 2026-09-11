import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { siteSettings, services, courses, t } = useData();

  return (
    <footer className="bg-white text-slate-600 pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            {(() => {
              const logoMode = siteSettings?.logoMode || (siteSettings?.logoUrl ? 'image' : (siteSettings?.showLogoBox === false ? 'text_only' : 'box_text'));
              const isImageMode = logoMode === 'image' && !!siteSettings?.logoUrl;
              const showBox = !isImageMode && logoMode !== 'text_only' && siteSettings?.showLogoBox !== false;
              const boxLetter = siteSettings?.logoBoxLetter || 'P';
              const textMain = siteSettings?.logoTextMain !== undefined && siteSettings?.logoTextMain !== '' ? siteSettings.logoTextMain : 'PTEN';
              const textHighlight = siteSettings?.logoTextHighlight !== undefined ? siteSettings.logoTextHighlight : 'it';

              return (
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setActiveTab('home')}
                >
                  {isImageMode ? (
                    <img
                      src={siteSettings?.logoUrl}
                      alt={textMain || 'Logo'}
                      className="h-10 w-auto max-w-[170px] object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      {showBox && (
                        <div className="w-10 h-10 rounded-xl bg-[#006A4E] flex items-center justify-center font-bold text-2xl text-white shadow-xs shrink-0 relative">
                          {boxLetter}
                          {/* Crimson Red Sun Disc Beacon */}
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E11D48] border-2 border-white" />
                        </div>
                      )}
                      <span className="font-heading text-2xl font-black text-slate-900 flex items-center gap-0.5">
                        {textMain}
                        {textHighlight && <span className="text-[#006A4E]">{textHighlight}</span>}
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] ml-1 inline-block" title="লাল-সবুজের অহংকার" />
                      </span>
                    </>
                  )}
                </div>
              );
            })()}

            <p className="text-sm text-slate-500 leading-relaxed font-bengali">
              {t('PTENit আপনার ব্যবসা ও ক্যারিয়ারের জন্য আধুনিক IT Services, Digital Marketing, Web Development এবং Professional Training Solutions প্রদান করে।', 'PTENit provides modern IT Services, Digital Marketing, Web Development, and Professional Training Solutions for your business and career.')}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#006A4E] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E11D48] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#E11D48] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#006A4E] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#006A4E] hover:bg-[#047857] text-white flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2-Column Group: Quick Links & Popular Courses */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:col-span-2 lg:col-span-2">
            {/* Sub-Column 1: Quick Links */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-3 sm:mb-4 font-heading border-l-4 border-[#006A4E] pl-2.5">
                {t('কুইক লিংকস', 'Quick Links')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-bengali">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('হোম', 'Home')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('marketplace')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 font-bold text-[#006A4E]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('মার্কেটপ্লেস', 'Marketplace')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('আমাদের আইটি সার্ভিস', 'IT Services')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('courses')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('কোর্সসমূহ', 'Courses')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('about')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('আমাদের সম্পর্কে', 'About Us')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('gallery')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('ছবি গ্যালারি', 'Photo Gallery')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contact')} className="hover:text-[#006A4E] transition-colors flex items-center gap-1.5 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5 text-[#006A4E] shrink-0" /> {t('যোগাযোগ', 'Contact')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-[#E11D48] text-slate-500 font-bold transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48] shrink-0" /> {t('এডমিন প্যানেল', 'Admin Portal')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-Column 2: Top Courses & Escrow Guarantee */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-3 sm:mb-4 font-heading border-l-4 border-[#006A4E] pl-2.5">
                {t('জনপ্রিয় কোর্সসমূহ', 'Popular Courses')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-bengali">
                {courses.slice(0, 5).map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="hover:text-[#006A4E] text-slate-600 transition-colors flex items-center gap-1.5 text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] shrink-0" />
                      <span className="line-clamp-1">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Escrow Guarantee Box */}
              <div className="mt-4 p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bengali space-y-1">
                <span className="text-[10px] sm:text-[11px] font-black text-[#006A4E] block">
                  🛡️ শতভাগ নিরাপদ লেনদেন
                </span>
                <p className="text-[9px] sm:text-[10px] text-slate-600 leading-tight sm:leading-normal">
                  সকল লেনদেন এবং সার্ভিস ডেলিভারির দায়ভার প্রতিষ্ঠান কর্তৃক সরাসরি পরিচালিত।
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-slate-900 font-bold text-base mb-4 font-heading border-l-4 border-[#006A4E] pl-3">
              {t('যোগাযোগ ঠিকানা', 'Contact Info')}
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#006A4E] shrink-0 mt-0.5" />
                <span className="text-slate-600 text-xs leading-relaxed font-bengali">{siteSettings.officeAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span className="text-slate-600 text-xs font-semibold">{siteSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span className="text-slate-600 text-xs">{siteSettings.email}</span>
              </li>
              <li className="pt-1">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#006A4E] hover:bg-[#047857] text-white font-bold text-xs shadow-xs transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t('হোয়াটসঅ্যাপে চ্যাট করুন', 'Chat on WhatsApp')}
                </a>
              </li>
            </ul>

            {/* Compact Map Embed - Phone View Only */}
            <div className="lg:hidden mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
              <div className="bg-slate-100 px-3 py-2 flex items-center text-xs text-slate-700 font-bengali">
                <span className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#006A4E]" />
                  গুগল ম্যাপ লোকেশন
                </span>
              </div>
              <div className="w-full h-32 bg-slate-100 relative">
                <iframe
                  title="PTENit Footer Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.423087289569!2d90.3956!3d23.8759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzMzLjIiTiA5MMKwMjMnNDQuMiJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  className="opacity-95"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Official Payment Methods Logo Showcase */}
        <div className="py-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 font-bengali">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="text-[#006A4E] flex items-center gap-1.5 font-black text-xs sm:text-sm">
              💳 {t('অফিশিয়াল পেমেন্ট মেথড ও সিকিউর গেটওয়ে:', 'Official Payment Methods & Secure Gateways:')}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-2.5">
            {((siteSettings.paymentLogos && siteSettings.paymentLogos.length > 0)
              ? siteSettings.paymentLogos.filter(p => p.isActive !== false)
              : [
                  { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png' },
                  { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png' },
                  { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png' },
                  { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png' },
                  { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png' },
                  { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png' },
                  { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png' },
                  { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png' }
                ]
            ).map(item => (
              <div
                key={item.id}
                title={item.name}
                className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-xs hover:border-[#006A4E] transition-all flex items-center justify-center h-8 sm:h-9 min-w-[50px] sm:min-w-[58px]"
              >
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="max-h-5 sm:max-h-6 max-w-[42px] sm:max-w-[52px] object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const span = document.createElement('span');
                      span.className = 'text-[10px] sm:text-[11px] font-bold text-slate-800 px-1';
                      span.innerText = item.name;
                      target.parentElement.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PTENit. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="text-slate-500 hover:text-[#E11D48] font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>{t('এডমিন কন্ট্রোল সেন্টার', 'Admin Control')}</span>
            </button>
            <span className="text-slate-300">|</span>
            <p className="text-slate-500 font-bengali">
              {t('"আপনার ডিজিটাল প্ল্যাটফর্ম এখানে তৈরি করুন"', '"Build Your Digital Platform Here"')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
