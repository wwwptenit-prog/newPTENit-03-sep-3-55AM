import { Course, Service, Testimonial } from '../types';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toBengaliNumber(num: number | string): string {
  const str = String(num);
  return str.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

export function toEnglishNumber(num: number | string): string {
  let res = String(num);
  bengaliDigits.forEach((bDigit, idx) => {
    res = res.replaceAll(bDigit, englishDigits[idx]);
  });
  return res;
}

export function formatLocalizedNumber(num: number | string, lang: 'bn' | 'en'): string {
  if (lang === 'en') {
    return toEnglishNumber(num);
  }
  return toBengaliNumber(toEnglishNumber(num));
}

export function formatLocalizedPrice(amount: number, lang: 'bn' | 'en'): string {
  if (lang === 'en') {
    return `৳${amount.toLocaleString('en-US')}`;
  }
  return `৳${amount.toLocaleString('bn-BD')}`;
}

export const CATEGORY_TRANSLATIONS: Record<string, { bn: string; en: string }> = {
  'All': { bn: 'সকল ক্যাটাগরি', en: 'All Categories' },
  'Graphic Design': { bn: 'গ্রাফিক ডিজাইন', en: 'Graphic Design' },
  'Design': { bn: 'গ্রাফিক ও ডিজাইন', en: 'Design & Graphics' },
  'Marketing': { bn: 'ডিজিটাল মার্কেটিং', en: 'Digital Marketing' },
  'Development': { bn: 'ওয়েব ও সফটওয়্যার', en: 'Web & Software' },
  'Language & Test Prep': { bn: 'ল্যাংগুয়েজ ও টেস্ট প্রিপ', en: 'Language & Test Prep' },
  'Technology': { bn: 'টেকনোলজি ও সিকিউরিটি', en: 'Technology & Security' }
};

export function getLocalizedCategory(category: string, lang: 'bn' | 'en'): string {
  const item = CATEGORY_TRANSLATIONS[category];
  if (item) {
    return lang === 'en' ? item.en : item.bn;
  }
  return category;
}

// Comprehensive Course Translations
interface CourseI18n {
  titleBn: string;
  titleEn: string;
  instructorBn: string;
  instructorEn: string;
  durationBn: string;
  durationEn: string;
  descriptionBn: string;
  descriptionEn: string;
}

export const COURSE_TRANSLATIONS: Record<string, CourseI18n> = {
  'course-canva': {
    titleBn: 'ক্যানভা ডিজাইন ও ফ্রিল্যান্সিং মাস্টারক্লাস',
    titleEn: 'Canva Design & Freelancing Masterclass',
    instructorBn: 'তানভীর আহমেদ',
    instructorEn: 'Tanvir Ahmed',
    durationBn: '৪ সপ্তাহ (১২ ঘণ্টা)',
    durationEn: '4 Weeks (12 Hours)',
    descriptionBn: 'ক্যানভা (Canva Pro) দিয়ে কোনো কোডিং বা কঠিন সফটওয়্যার ছাড়া প্রফেশনাল সোশ্যাল মিডিয়া গ্রাফিক্স, ইউটিউব থাম্বনেইল, ব্যানার, লোগো এবং প্রেসেন্টেশন তৈরি শিখুন।',
    descriptionEn: 'Learn to design professional social media graphics, YouTube thumbnails, banners, logos, and presentations with Canva Pro without complex tools.'
  },
  'course-yt-seo': {
    titleBn: 'ইউটিউব এসইও ও চ্যানেল গ্রোথ সিক্রেটস',
    titleEn: 'YouTube SEO & Channel Growth Secrets',
    instructorBn: 'কাজী সোহাগ',
    instructorEn: 'Kazi Sohag',
    durationBn: '৩ সপ্তাহ (১০ ঘণ্টা)',
    durationEn: '3 Weeks (10 Hours)',
    descriptionBn: 'ইউটিউব অ্যালগরিদম ক্র্যাক করে ভিডিও র‍্যাঙ্কিং, কি-ওয়ার্ড রিসার্চ, ট্যাগ অপ্টিমাইজেশন ও মনিটাইজেশন স্ট্র্যাটেজি।',
    descriptionEn: 'Crack YouTube algorithm with proven video ranking, keyword research, tag optimization, and monetization strategy.'
  },
  'course-fb-marketing': {
    titleBn: 'ফেসবুক এডস ও মেটা মার্কেটিং ব্লুপ্রিন্ট',
    titleEn: 'Facebook Ads & Meta Marketing Blueprint',
    instructorBn: 'কাজী সোহাগ',
    instructorEn: 'Kazi Sohag',
    durationBn: '৬ সপ্তাহ (২০ ঘণ্টা)',
    durationEn: '6 Weeks (20 Hours)',
    descriptionBn: 'টার্গেটেড ফেসবুক ও ইনস্টাগ্রাম এড ক্যাম্পেইন রান, পিক্সেল সেটআপ, সেলস ফানেল এবং লিড জেনারেশনের প্র্যাকটিক্যাল গাইড।',
    descriptionEn: 'Run targeted Facebook & Instagram ad campaigns, pixel tracking, sales funnels, and practical lead generation.'
  },
  'course-wp-dev': {
    titleBn: 'ওয়ার্ডপ্রেস ও ইকমার্স ওয়েবসাইট ডেভেলপমেন্ট',
    titleEn: 'WordPress & WooCommerce Masterclass',
    instructorBn: 'মাহমুদুল হাসান',
    instructorEn: 'Mahmudul Hasan',
    durationBn: '৮ সপ্তাহ (২৪ ঘণ্টা)',
    durationEn: '8 Weeks (24 Hours)',
    descriptionBn: 'কোনো কোডিং ছাড়াই ড্র্যাগ অ্যান্ড ড্রপ এলিমেন্টর ও উকমার্স দিয়ে বিজনেস ওয়েবসাইট এবং অনলাইন শপ তৈরির পরিপূর্ণ কোর্স।',
    descriptionEn: 'Build high-converting business websites and online stores using Elementor and WooCommerce without coding.'
  },
  'course-pte-basic-2026': {
    titleBn: 'পিটিই একাডেমিক - বেসিক লেভেল (ফাউন্ডেশন ব্যাচ)',
    titleEn: 'PTE Academic - Basic Level (Foundation Batch)',
    instructorBn: 'তানভীর আহমেদ',
    instructorEn: 'Tanvir Ahmed',
    durationBn: '৪ সপ্তাহ (১৬ ক্লাস)',
    durationEn: '4 Weeks (16 Classes)',
    descriptionBn: 'পিটিই পরীক্ষার বেসিক স্ট্রাকচার, স্পিকিং, রাইটিং, রিডিং এবং লিসেনিং সেকশনের নিয়মাবলী ও টেস্ট প্রস্তুতি।',
    descriptionEn: 'Master PTE Academic structure across Speaking, Writing, Reading, and Listening modules with computerized mock tests.'
  },
  'course-pte-masterclass-2026': {
    titleBn: 'পিটিই একাডেমিক - মাস্টারক্লাস (টার্গেট ৬৫+ / ৭৯+)',
    titleEn: 'PTE Academic - Masterclass (Target 65+ / 79+)',
    instructorBn: 'তানভীর আহমেদ',
    instructorEn: 'Tanvir Ahmed',
    durationBn: '৮ সপ্তাহ (৩২ ক্লাস)',
    durationEn: '8 Weeks (32 Classes)',
    descriptionBn: 'অস্ট্রেলিয়া ও কানাডা ইমিগ্রেশনের জন্য ৬৫+ এবং ৭৯+ স্কোর অর্জনের অ্যাডভান্সড টেমপ্লেট ও স্ট্র্যাটেজি।',
    descriptionEn: 'Proven templates and AI scoring strategies to achieve 65+ and 79+ for Australia and Canada immigration.'
  },
  'course-pte-pro-2026': {
    titleBn: 'পিটিই একাডেমিক - প্রফেশনাল (ফাস্ট ট্র্যাক ক্র্যাশ কোর্স)',
    titleEn: 'PTE Academic - Professional (Fast Track Crash Course)',
    instructorBn: 'তানভীর আহমেদ',
    instructorEn: 'Tanvir Ahmed',
    durationBn: '২ সপ্তাহ (১২ ক্লাস)',
    durationEn: '2 Weeks (12 Classes)',
    descriptionBn: 'জরুরি পরীক্ষার জন্য রিডিং ট্রিকস, স্পিকিং ফ্লুয়েন্সি এবং লাইভ স্পিচ ফিডব্যাক নিয়ে ফাস্ট-ট্র্যাক ক্র্যাশ কোর্স।',
    descriptionEn: 'Fast-track crash course for urgent test takers with reading shortcuts, speaking fluency techniques, and live scoring.'
  },
  'course-web-basic-2026': {
    titleBn: 'ওয়েব ডিজাইন ও ফ্রন্টএন্ড ফান্ডামেন্টালস (HTML, CSS, JS)',
    titleEn: 'Web Design & Frontend Development (HTML, CSS, JS)',
    instructorBn: 'শাহরিয়ার হাসান',
    instructorEn: 'Shahriar Hasan',
    durationBn: '৬ সপ্তাহ (২০ ক্লাস)',
    durationEn: '6 Weeks (20 Classes)',
    descriptionBn: 'এইচটিএমএল৫, সিএসএস৩, টেলউইন্ড সিএসএস ও জাভাস্ক্রিপ্ট দিয়ে আধুনিক রেসপন্সিভ ওয়েবসাইট ডিজাইন শিখুন।',
    descriptionEn: 'Learn modern responsive web design using HTML5, CSS3, Tailwind CSS, and core JavaScript.'
  },
  'course-web-pro-2026': {
    titleBn: 'ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট (MERN & Next.js)',
    titleEn: 'Full-Stack Web Development (MERN & Next.js)',
    instructorBn: 'শাহরিয়ার হাসান',
    instructorEn: 'Shahriar Hasan',
    durationBn: '১২ সপ্তাহ (৪০ ক্লাস)',
    durationEn: '12 Weeks (40 Classes)',
    descriptionBn: 'React.js, Next.js, Node.js, Express, MongoDB এবং TypeScript দিয়ে প্রফেশনাল ফুলস্ট্যাক প্রজেক্ট তৈরি করুন।',
    descriptionEn: 'Build high-performance full-stack web applications with React.js, Next.js, Node.js, Express, MongoDB, and TypeScript.'
  },
  'course-uiux-figma': {
    titleBn: 'ইউআই/ইউএক্স ডিজাইন মাস্টারক্লাস (Figma & Adobe XD)',
    titleEn: 'UI/UX Design Masterclass (Figma & Adobe XD)',
    instructorBn: 'তানভীর আহমেদ',
    instructorEn: 'Tanvir Ahmed',
    durationBn: '৬ সপ্তাহ (১৮ ক্লাস)',
    durationEn: '6 Weeks (18 Classes)',
    descriptionBn: 'ফিগুমা দিয়ে মোবাইল অ্যাপ ও ওয়েবসাইটের ওয়্যারফ্রেম, ইন্টারেক্টিভ প্রোটোটাইপিং এবং মডার্ন ইউআই ডিজাইন শিখুন।',
    descriptionEn: 'Master wireframing, interactive prototyping, design systems, and modern UI design using Figma.'
  },
  'course-python-django': {
    titleBn: 'পাইথন ও জ্যাঙ্গো ব্যাকএন্ড ডেভেলপমেন্ট',
    titleEn: 'Python & Django Backend Development',
    instructorBn: 'নাজমুল হুদা',
    instructorEn: 'Nazmul Huda',
    durationBn: '১০ সপ্তাহ (৩০ ক্লাস)',
    durationEn: '10 Weeks (30 Classes)',
    descriptionBn: 'পাইথন প্রোগ্রামিং দিয়ে সিকিউর রেস্ট এপিআই ও এন্টারপ্রাইজ ব্যাকএন্ড অ্যাপ্লিকেশন ডেভেলপমেন্ট।',
    descriptionEn: 'Master Python programming, PostgreSQL database integration, and secure REST API backends with Django.'
  },
  'course-english-spoken': {
    titleBn: 'ফ্রিল্যান্সারদের জন্য স্পোকেন ইংলিশ ও কমিউনিকেশন',
    titleEn: 'Spoken English & Communication for Freelancers',
    instructorBn: 'সাবরিনা সুলতানা',
    instructorEn: 'Sabrina Sultana',
    durationBn: '৪ সপ্তাহ (১৬ ক্লাস)',
    durationEn: '4 Weeks (16 Classes)',
    descriptionBn: 'আন্তর্জাতিক বায়ারদের সাথে আত্মবিশ্বাসের সাথে ইংরেজি চ্যাট, ভিডিও মিটিং এবং অর্ডার ডিল ক্লোজ করার স্পেশাল কোর্স।',
    descriptionEn: 'Build English speaking fluency for client video interviews, chat proposals, and closing overseas freelance deals.'
  },
  'course-flutter-app': {
    titleBn: 'ফ্লাটার ও ডার্ট ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ',
    titleEn: 'Flutter & Dart Mobile App Development',
    instructorBn: 'আরিফুর রহমান',
    instructorEn: 'Arifur Rahman',
    durationBn: '১০ সপ্তাহ (২৮ ক্লাস)',
    durationEn: '10 Weeks (28 Classes)',
    descriptionBn: 'একই কোডবেস দিয়ে অ্যান্ড্রয়েড ও আইওএস প্ল্যাটফর্মের জন্য আকর্ষণীয় নেটিভ মোবাইল অ্যাপ তৈরি করুন।',
    descriptionEn: 'Build high-performance native iOS and Android apps from a single codebase using Flutter and Dart.'
  },
  'course-seo-content': {
    titleBn: 'এসইও, ব্লগিং ও কন্টেন্ট মার্কেটিং',
    titleEn: 'SEO, Blogging & Content Marketing',
    instructorBn: 'কাজী সোহাগ',
    instructorEn: 'Kazi Sohag',
    durationBn: '৫ সপ্তাহ (১৫ ক্লাস)',
    durationEn: '5 Weeks (15 Classes)',
    descriptionBn: 'গুগল টপ র‍্যাঙ্কিংয়ের জন্য অন-পেজ, অফ-পেজ ও টেকনিক্যাল এসইও এবং কন্টেন্ট রাইটিং কৌশল।',
    descriptionEn: 'Master Google search ranking with on-page, off-page, technical SEO, and high-converting content marketing.'
  },
  'course-cybersecurity': {
    titleBn: 'সাইবার সিকিউরিটি ফান্ডামেন্টালস ও এথিক্যাল হ্যাকিং',
    titleEn: 'Cybersecurity Fundamentals & Ethical Hacking',
    instructorBn: 'নাজমুল হুদা',
    instructorEn: 'Nazmul Huda',
    durationBn: '৮ সপ্তাহ (২৪ ক্লাস)',
    durationEn: '8 Weeks (24 Classes)',
    descriptionBn: 'নেটওয়ার্ক সিকিউরিটি, ওয়েব ভালনারেবিলিটি স্ক্যানিং এবং সিস্টেম প্রোটেকশনের বাস্তবমুখী গাইডলাইন।',
    descriptionEn: 'Learn network penetration testing, web vulnerability scanning, threat defense, and ethical hacking fundamentals.'
  }
};

export function getLocalizedCourse(course: Course, lang: 'bn' | 'en') {
  const trans = COURSE_TRANSLATIONS[course.id];
  if (!trans) {
    return {
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      description: course.description,
      category: getLocalizedCategory(course.category, lang)
    };
  }

  return {
    title: lang === 'en' ? trans.titleEn : trans.titleBn,
    instructor: lang === 'en' ? trans.instructorEn : trans.instructorBn,
    duration: lang === 'en' ? trans.durationEn : trans.durationBn,
    description: lang === 'en' ? trans.descriptionEn : trans.descriptionBn,
    category: getLocalizedCategory(course.category, lang)
  };
}

// Comprehensive Service Translations
interface ServiceI18n {
  titleBn: string;
  titleEn: string;
  shortDescBn: string;
  shortDescEn: string;
  priceTextBn: string;
  priceTextEn: string;
}

export const SERVICE_TRANSLATIONS: Record<string, ServiceI18n> = {
  'web-dev': {
    titleBn: 'ওয়েব ডিজাইন ও ডেভেলপমেন্ট',
    titleEn: 'Web Design & Development',
    shortDescBn: 'প্রফেশনাল রেসপন্সিভ ওয়েবসাইট, ল্যান্ডিং পেজ, কর্পোরেট সাইট, ইকমার্স স্টোর এবং কাস্টম CMS সলিউশন।',
    shortDescEn: 'Professional responsive websites, landing pages, business websites, e-commerce stores, and custom CMS solutions.',
    priceTextBn: '৳১৫,০০০ থেকে শুরু',
    priceTextEn: 'Starting from ৳15,000'
  },
  'digital-marketing': {
    titleBn: 'ডিজিটাল মার্কেটিং সলিউশন',
    titleEn: 'Digital Marketing Solutions',
    shortDescBn: 'টার্গেটেড ফেসবুক, গুগল, ইউটিউব ও সোশ্যাল মিডিয়ায় সেলস ফানেল এবং ব্র্যান্ড গ্রোথ সার্ভিস।',
    shortDescEn: 'Targeted Facebook, Google, YouTube ads, sales funnels, and high-ROI digital marketing solutions.',
    priceTextBn: '৳৮,০০০ / মাস',
    priceTextEn: '৳8,000 / month'
  },
  'graphic-design': {
    titleBn: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং',
    titleEn: 'Graphic Design & Branding',
    shortDescBn: 'প্রফেশনাল ব্র্যান্ড লোগো, সোশ্যাল ব্যানার, ব্রোশিউর, প্যাকেজিং ও ডিজিটাল মার্কেটিং ক্রিয়েটিভস।',
    shortDescEn: 'Professional branding, social media design, banner, poster, brochure, business card, and marketing creatives.',
    priceTextBn: '৳৫,০০০ থেকে শুরু',
    priceTextEn: 'Starting from ৳5,000'
  },
  'video-editing': {
    titleBn: 'ভিডিও এডিটিং ও মোশন গ্রাফিক্স',
    titleEn: 'Video Editing & Motion Graphics',
    shortDescBn: 'ইউটিউব ভিডিও, সোশ্যাল রিলস, কালার গ্রেডিং এবং কর্পোরেট কমার্শিয়াল ভিডিও প্রোডাকশন।',
    shortDescEn: 'YouTube videos, social media reels, color grading, and corporate commercial video production.',
    priceTextBn: '৳১০,০০০ প্যাকেজ',
    priceTextEn: '৳10,000 Package'
  },
  'seo-service': {
    titleBn: 'সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)',
    titleEn: 'Search Engine Optimization (SEO)',
    shortDescBn: 'গুগল ফার্স্ট পেজ র‍্যাঙ্কিং, কি-ওয়ার্ড রিসার্চ, অন-পেজ ও টেকনিক্যাল এসইও অডিট।',
    shortDescEn: 'Google first page ranking, keyword optimization, technical audits, and local SEO services.',
    priceTextBn: '৳১২,০০০ / মাস',
    priceTextEn: '৳12,000 / month'
  },
  'social-media': {
    titleBn: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    titleEn: 'Social Media Management',
    shortDescBn: 'ফেসবুক, ইনস্টাগ্রাম, লিঙ্কডইন পেজের অর্গানিক কন্টেন্ট প্ল্যানিং, পোস্টিং ও এনগেজমেন্ট।',
    shortDescEn: 'Facebook, Instagram, LinkedIn cross-platform regular post planning, publishing, and engagement.',
    priceTextBn: '৳৭,০০০ / মাস',
    priceTextEn: '৳7,000 / month'
  },
  'wordpress': {
    titleBn: 'ওয়ার্ডপ্রেস ও ইকমার্স ডেভেলপমেন্ট',
    titleEn: 'WordPress Development',
    shortDescBn: 'সহজে পরিচালনাযোগ্য ওয়ার্ডপ্রেস ওয়েবসাইট, এলিমেন্টর প্রো ডিজাইন এবং উকমার্স স্টোর সেটআপ।',
    shortDescEn: 'Easy-to-manage WordPress websites, Elementor Pro design, and WooCommerce e-commerce setup.',
    priceTextBn: '৳১২,০০০ থেকে শুরু',
    priceTextEn: 'Starting from ৳12,000'
  },
  'branding': {
    titleBn: 'কমপ্লিট ডিজিটাল ব্র্যান্ডিং',
    titleEn: 'Complete Digital Branding',
    shortDescBn: 'স্টার্টআপ ও প্রতিষ্ঠিত ব্যবসার জন্য সম্পূর্ণ ব্র্যান্ড গাইডলাইন, স্টেশনারি ও ভিজ্যুয়াল আইডেন্টিটি।',
    shortDescEn: 'Complete digital branding, brand style guide, stationery, and corporate visual identity.',
    priceTextBn: '৳২০,০০০ প্যাকেজ',
    priceTextEn: '৳20,000 Package'
  }
};

export function getLocalizedService(service: Service, lang: 'bn' | 'en'): Service {
  const trans = SERVICE_TRANSLATIONS[service.id];
  if (!trans) {
    return {
      ...service,
      category: getLocalizedCategory(service.category, lang)
    };
  }

  return {
    ...service,
    title: lang === 'en' ? trans.titleEn : trans.titleBn,
    shortDescription: lang === 'en' ? trans.shortDescEn : trans.shortDescBn,
    priceText: lang === 'en' ? trans.priceTextEn : trans.priceTextBn,
    category: getLocalizedCategory(service.category, lang)
  };
}

export const TESTIMONIAL_TRANSLATIONS: Record<string, { roleBn: string; roleEn: string; textBn: string; textEn: string }> = {
  'test-1': {
    roleBn: 'ই-কমার্স উদ্যোক্তা',
    roleEn: 'E-Commerce Entrepreneur',
    textBn: 'PTENit টিমের সার্ভিস সত্যিই প্রশংসনীয়। ৫ দিনে আমাদের অনলাইন কাপড়ের সাইট বানিয়ে দিয়েছেন এবং পেমেন্ট গেটওয়ে খুব সহজে কাজ করছে।',
    textEn: 'The service from PTENit team is truly commendable. In just 5 days they delivered our online apparel store and the payment gateway works seamlessly.'
  },
  'test-2': {
    roleBn: 'ফ্রিল্যান্সার & ডিজিটাল মার্কেটার',
    roleEn: 'Freelancer & Digital Marketer',
    textBn: 'তানভীর স্যারের PTE ক্লাসের টেকনিকগুলো অসাধারন। প্র্যাকটিস করে আমি একবারে পয়েন্ট ৭৯ পেয়েছি!',
    textEn: "Tanvir Sir's PTE strategies and techniques are outstanding. With targeted practice I achieved a score of 79 on my very first attempt!"
  }
};

export function getLocalizedTestimonial(testimonial: Testimonial, lang: 'bn' | 'en'): Testimonial {
  const trans = TESTIMONIAL_TRANSLATIONS[testimonial.id];
  if (!trans) {
    return testimonial;
  }
  return {
    ...testimonial,
    role: lang === 'en' ? trans.roleEn : trans.roleBn,
    text: lang === 'en' ? trans.textEn : trans.textBn
  };
}
