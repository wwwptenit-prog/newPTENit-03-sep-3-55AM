import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Moon,
  Sun,
  Sparkles,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  Globe,
  BadgeCheck,
  Award,
  Home,
  Briefcase,
  ShieldCheck,
  Image,
  GraduationCap,
  ChevronRight,
  User,
  LogOut,
  MessageSquare,
  Zap,
  PlusCircle,
  Wallet,
  Heart
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string, category?: string) => void;
  openAuthModal: () => void;
  openCourseDetail: (courseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openCourseDetail
}) => {
  const {
    lang,
    setLang,
    t,
    darkMode,
    toggleDarkMode,
    courses,
    services,
    siteSettings,
    currentUser,
    marketplaceOrders,
    openMessengerInbox,
    logout,
    logoutMarketplace
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile side drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Inline Search State
  const [inlineSearchOpen, setInlineSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { id: 'home', label: t('হোম', 'Home') },
    { id: 'services', label: t('সার্ভিস', 'Services') },
    { id: 'courses', label: t('কোর্স', 'Courses') },
    { id: 'marketplace', label: t('মার্কেটপ্লেস', 'Marketplace'), highlight: true },
    { id: 'about', label: t('সম্পর্কে', 'About') },
    { id: 'gallery', label: t('গ্যালারি', 'Gallery') },
    { id: 'contact', label: t('যোগাযোগ', 'Contact') },
  ];

  const filteredCourses = searchQuery.trim()
    ? courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredServices = searchQuery.trim()
    ? services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Auto focus search input when search is opened
  useEffect(() => {
    if (inlineSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [inlineSearchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Slim Header Bar - Hidden on mobile/phone screens */}
      <div className="hidden md:block bg-slate-50 text-slate-700 text-[11px] sm:text-xs py-1 sm:py-1.5 px-3 sm:px-4 border-b border-slate-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-slate-600 font-medium text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{siteSettings.phone}</span>
            </span>
            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-block">
              {siteSettings.email}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <button
              onClick={() => {
                setActiveTab('verify');
              }}
              className="hover:text-[#16A34A] text-slate-600 transition-colors text-[11px] sm:text-xs underline cursor-pointer shrink-0 font-bengali"
            >
              {t('সার্টিফিকেট ভেরিফাই', 'Verify Certificate')}
            </button>
            <span className="text-slate-300">|</span>
            {/* Single Official Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all text-xs font-bold cursor-pointer shrink-0"
              title={lang === 'bn' ? 'English - এ পরিবর্তিত করুন' : 'Switch to Bangla'}
            >
              <Globe className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation - Clean White */}
      <nav className="bg-white border-b border-slate-200 text-slate-800 shadow-xs relative">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
            {/* Logo */}
            <div className="md:w-auto flex items-center justify-start shrink-0">
              <div
                className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0"
                onClick={() => setActiveTab('home')}
              >
                {siteSettings?.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={siteSettings?.siteName || "PTENit Logo"}
                    className="h-7 sm:h-9 md:h-10 w-auto max-w-[110px] xs:max-w-[130px] md:max-w-[160px] object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#16A34A] flex items-center justify-center font-bold text-base sm:text-lg text-white shadow-xs transform group-hover:scale-105 transition-transform shrink-0 relative">
                      P
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#DC2626] border-2 border-white"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-base sm:text-xl font-black tracking-wider text-slate-900 flex items-center gap-0.5 leading-tight">
                        PTEN<span className="text-[#16A34A]">it</span>
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#DC2626] ml-1 inline-block" />
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            {!inlineSearchOpen && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-lg text-sm lg:text-[14px] xl:text-[15px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-[#16A34A] text-white shadow-xs font-bold'
                      : item.highlight
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold'
                      : 'text-slate-700 hover:text-[#16A34A] hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* DESKTOP SEARCH BAR */}
          <div className={`relative flex-1 ${inlineSearchOpen ? 'w-full max-w-none ml-2 mr-0' : 'max-w-md mx-2 hidden md:block'}`}>
            {inlineSearchOpen ? (
              <div className="relative flex items-center w-full animate-in fade-in zoom-in-95 duration-200">
                <Search className="w-4 sm:w-5 h-4 sm:h-5 absolute left-3 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setActiveTab('marketplace');
                      setInlineSearchOpen(false);
                    }
                  }}
                  placeholder={t("কোর্স বা সার্ভিস নাম লিখে খুঁজুন...", "Search courses or services...")}
                  className="w-full bg-white border-2 border-[#16A34A] rounded-xl pl-9 sm:pl-10 pr-9 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm font-bengali ring-2 ring-[#16A34A]/10"
                />
                <button
                  onClick={() => {
                    setInlineSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                  title="সার্চ বন্ধ করুন"
                >
                  <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setInlineSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all text-xs cursor-pointer w-full max-w-[180px] lg:max-w-[220px] font-bengali"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{t('সার্চ করুন...', 'Search here...')}</span>
              </button>
            )}

            {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (DESKTOP) */}
            {inlineSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-slate-800 max-h-96 overflow-y-auto">
                {filteredCourses.length > 0 && (
                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 font-bengali">
                      {t('কোর্সসমূহ', 'Courses')} ({filteredCourses.length})
                    </div>
                    <div className="space-y-1.5">
                      {filteredCourses.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            openCourseDetail(c.id);
                            setInlineSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0 font-bengali">
                            <p className="font-semibold text-xs text-slate-900 truncate">{c.title}</p>
                            <p className="text-[11px] text-[#16A34A] font-bold">
                              {c.isFree ? t('ফ্রি', 'Free') : `৳${c.discountPrice || c.price}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServices.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 font-bengali">
                      {t('সার্ভিসসমূহ', 'Services')} ({filteredServices.length})
                    </div>
                    <div className="space-y-1.5">
                      {filteredServices.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveTab('services');
                            setInlineSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors font-bengali"
                        >
                          <p className="font-semibold text-xs text-slate-900">{s.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{s.shortDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCourses.length === 0 && filteredServices.length === 0 && (
                  <p className="text-center text-slate-500 py-3 text-xs font-bengali">
                    {t('কোনো ফলাফল পাওয়া যায়নি।', 'No results found.')}
                  </p>
                )}

                <div className="pt-2 mt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setActiveTab('marketplace');
                      setInlineSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-2 transition font-bengali cursor-pointer shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>সকল ফলাফল দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE INLINE SEARCH BAR (CENTERED) */}
          <div className="flex md:hidden flex-1 min-w-0 px-1 relative items-center justify-center">
            <div className="relative w-full max-w-[210px] sm:max-w-[240px] flex items-center justify-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setActiveTab('marketplace');
                  }
                }}
                placeholder={t("সার্চ করুন...", "Search...")}
                className="w-full text-center pl-7 pr-7 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:border-[#16A34A] font-bengali placeholder:text-center focus:placeholder:text-left focus:text-left"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (MOBILE) */}
            {searchQuery.trim() && (
              <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] max-w-sm top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-slate-800 max-h-80 overflow-y-auto">
                {filteredCourses.length > 0 && (
                  <div className="mb-2.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 border-b border-slate-200 pb-1 font-bengali">
                      {t('কোর্সসমূহ', 'Courses')} ({filteredCourses.length})
                    </div>
                    <div className="space-y-1">
                      {filteredCourses.slice(0, 3).map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            openCourseDetail(c.id);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img src={c.thumbnail} alt={c.title} className="w-8 h-8 rounded-md object-cover shrink-0" />
                          <div className="flex-1 min-w-0 font-bengali">
                            <p className="font-semibold text-xs text-slate-900 truncate">{c.title}</p>
                            <p className="text-[10px] text-[#16A34A] font-bold">
                              {c.isFree ? t('ফ্রি', 'Free') : `৳${c.discountPrice || c.price}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServices.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 border-b border-slate-200 pb-1 font-bengali">
                      {t('সার্ভিসসমূহ', 'Services')} ({filteredServices.length})
                    </div>
                    <div className="space-y-1">
                      {filteredServices.slice(0, 3).map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveTab('services');
                            setSearchQuery('');
                          }}
                          className="p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors font-bengali"
                        >
                          <p className="font-semibold text-xs text-slate-900 truncate">{s.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{s.shortDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCourses.length === 0 && filteredServices.length === 0 && (
                  <p className="text-center text-slate-500 py-2 text-xs font-bengali">
                    {t('কোনো ফলাফল পাওয়া যায়নি।', 'No results found.')}
                  </p>
                )}

                <div className="pt-2 mt-1.5 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setActiveTab('marketplace');
                      setSearchQuery('');
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition font-bengali cursor-pointer shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>সকল ফলাফল দেখুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-2.5 shrink-0">
            {/* Direct Link to Marketplace & Buyer Mode */}
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              title="মার্কেটপ্লেস ও বায়ার মোড"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>মার্কেটপ্লেস</span>
            </button>

            {/* PRIMARY CTA ENROLL BUTTON */}
            <button
              onClick={() => setActiveTab('courses')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 font-bengali"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>কোর্সে জয়েন</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            </button>

            {/* AUTH CONTROLS: LOGIN WHEN LOGGED OUT, DASHBOARD & LOGOUT WHEN LOGGED IN */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'admin') setActiveTab('admin');
                    else if (currentUser.role === 'instructor') setActiveTab('teacher-dashboard');
                    else setActiveTab('customer-dashboard');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer"
                  title="আমার ড্যাশবোর্ড"
                >
                  <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white overflow-hidden flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="max-w-[100px] truncate text-xs">{currentUser.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (logout) logout();
                    else if (logoutMarketplace) logoutMarketplace();
                  }}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-[#DC2626] border border-slate-200 transition cursor-pointer"
                  title="লগআউট"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center gap-1.5 font-bengali active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Mobile Actions: Login/Profile + Menu Drawer Button */}
          <div className="flex md:hidden items-center justify-end gap-1 shrink-0">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (currentUser.role === 'admin') setActiveTab('admin');
                  else if (currentUser.role === 'instructor') setActiveTab('teacher-dashboard');
                  else setActiveTab('customer-dashboard');
                }}
                className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition"
                title={`প্রোফাইল: ${currentUser.name}`}
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] font-black text-[#16A34A]">{currentUser.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-90 transition cursor-pointer"
                title="লগইন করুন"
                aria-label="লগইন"
              >
                <User className="w-5 h-5 text-[#16A34A]" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer active:scale-95 touch-manipulation"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-200" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      </nav>

      {/* Mobile Navigation Side Drawer (Rendered into document.body via createPortal to guarantee it is NEVER trapped or clipped by backdrop-filter) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] md:hidden animate-in fade-in duration-200">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Drawer Panel (Slide-in from Right) - Clean White */}
          <div className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-white text-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 ease-out border-l border-slate-200">
            {/* Drawer Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
              <span className="text-xs font-bold text-slate-500">মেনু</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer active:scale-95"
                aria-label="মেনু বন্ধ করুন"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Compact PTENit Main Menu Body */}
            <div className="flex-1 p-3.5 space-y-2 font-bengali flex flex-col justify-between overflow-y-auto">
              <div className="space-y-1.5">
                {/* Primary Navigation Links */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-[#16A34A]" />
                    <span>হোমপেজ</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('courses');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'courses'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#16A34A]" />
                    <span>কোর্সসমূহ</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-[#16A34A]" />
                    <span>আইটি সার্ভিসসমূহ</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('marketplace', 'buying');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'marketplace'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#16A34A]" />
                    <span>মার্কেটপ্লেস</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('verify');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'verify'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#DC2626]" />
                    <span>সার্টিফিকেট যাচাই</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('contact');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    activeTab === 'contact'
                      ? 'bg-[#16A34A] text-white font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-[#16A34A]" />
                    <span>যোগাযোগ ও সাপোর্ট</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Simple Bottom Action (Login or Logout) */}
              <div className="pt-2 border-t border-slate-200 shrink-0">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (logout) logout();
                      else if (logoutMarketplace) logoutMarketplace();
                    }}
                    className="w-full py-2.5 px-3.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 border border-slate-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="w-full py-2.5 px-3.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shadow-xs"
                  >
                    <User className="w-4 h-4" />
                    <span>লগইন করুন</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
