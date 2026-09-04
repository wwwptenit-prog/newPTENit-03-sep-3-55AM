import { Service, Testimonial } from '../types';

export const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function formatLocalizedNumber(num: number | string, lang: 'bn' | 'en'): string {
  const str = String(num).padStart(2, '0');
  if (lang === 'bn') {
    return str.replace(/\d/g, d => bnDigits[parseInt(d, 10)] || d);
  }
  return str;
}

export const serviceTranslations: Record<string, {
  bn: {
    title: string;
    category: string;
    shortDescription: string;
    fullDescription?: string;
    features?: string[];
  };
  en: {
    title: string;
    category: string;
    shortDescription: string;
    fullDescription?: string;
    features?: string[];
  };
}> = {
  'web-dev': {
    bn: {
      title: 'ওয়েব ডিজাইন ও ডেভেলপমেন্ট',
      category: 'ডেভেলপমেন্ট',
      shortDescription: 'প্রফেশনাল রেসপন্সিভ ওয়েবসাইট, ল্যান্ডিং পেজ, বিজনেস ওয়েবসাইট, ই-কমার্স ও সিএমএস সল্যুশন।',
      fullDescription: 'আমরা আধুনিক React, Next.js, WordPress এবং E-Commerce ফ্রেমওয়ার্ক ব্যবহার করে হাই-স্পিড ও রেসপন্সিভ ওয়েবসাইট তৈরি করি। আপনার ব্র্যান্ডের জন্য উপযোগী কাস্টম UI/UX ডিজাইন এবং সিকিউর ব্যাকএন্ড সাপোর্ট অন্তর্ভুক্ত।',
      features: ['মোবাইল রেসপন্সিভ লেআউট', 'এসইও ফ্রেন্ডলি কোড', 'ফ্রি ডোমেইন ও হোস্টিং সেটআপ', 'এডমিন প্যানেল ও সিএমএস', '১ বছর টেকনিক্যাল সাপোর্ট']
    },
    en: {
      title: 'Web Design & Development',
      category: 'Development',
      shortDescription: 'Professional responsive websites, landing pages, business websites, e-commerce websites and CMS solutions.',
      fullDescription: 'We build high-speed, modern responsive websites using React, Next.js, WordPress, and custom e-commerce stacks with tailor-made UI/UX design and secure backend infrastructure.',
      features: ['100% Mobile Responsive Layout', 'SEO Friendly Code Structure', 'Free Domain & Hosting Setup', 'Admin Panel & Content Management', '1 Year Technical Support']
    }
  },
  'digital-marketing': {
    bn: {
      title: 'ডিজিটাল মার্কেটিং',
      category: 'মার্কেটিং',
      shortDescription: 'ফেসবুক, গুগল, ইউটিউব ও সামাজিক যোগাযোগ মাধ্যমে সমন্বিত মার্কেটিং ও ব্র্যান্ডিং সমাধান।',
      fullDescription: 'আপনার ব্যবসার সেলস ও ব্র্যান্ড ভ্যালু বহুগুণ বাড়াতে টার্গেটেড ডিজিটাল মার্কেটিং সেবা। ফেসবুক এডস ক্যাম্পেইন, গুগল পিসি এডস, ডিসপ্লে এডস এবং লিড জেনারেশনের মাধ্যমে সর্বোচ্চ ROI নিশ্চিত করা হয়।',
      features: ['টার্গেটেড অডিয়েন্স রিসার্চ', 'কাস্টম এড ক্রিয়েটিভ ও কপিরাইটিং', 'কনভার্সন ট্র্যাকিং ও পিক্সেল সেটআপ', 'সাপ্তাহিক পারফরম্যান্স রিপোর্ট', 'সেলস ফানেল অপ্টিমাইজেশন']
    },
    en: {
      title: 'Digital Marketing',
      category: 'Marketing',
      shortDescription: 'Facebook, Google, YouTube and other social media marketing solutions.',
      fullDescription: 'Boost your business sales and brand visibility with targeted digital marketing campaigns, Google Ads, Facebook lead funnels, and performance marketing to maximize ROI.',
      features: ['Targeted Audience Research', 'Custom Ad Creatives & Copywriting', 'Conversion Tracking & Pixel Setup', 'Weekly Performance Reporting', 'Sales Funnel Optimization']
    }
  },
  'graphic-design': {
    bn: {
      title: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং',
      category: 'ডিজাইন',
      shortDescription: 'লোগো ডিজাইন, সোশ্যাল মিডিয়া ব্যানার, পোস্টার, ব্রোশিউর ও ব্র্যান্ড আইডেন্টিটি প্যাকেজ।',
      fullDescription: 'ব্র্যান্ডের ভিজ্যুয়াল আইডেন্টিটি প্রতিষ্ঠা করতে চোখ ধাঁধানো গ্রাফিক ডিজাইন সেবা। লোগো ডিজাইন, সোশ্যাল মিডিয়া ব্যানার, ফ্লাইয়ার, ব্রোশিয়ার এবং ব্র্যান্ড বুক প্রিপারেশন।',
      features: ['ভেক্টর লোগো ডিজাইন', 'সোশ্যাল মিডিয়া গ্রাফিক্স প্যাক', 'প্রিন্ট রেডি ফাইলস (CMYK)', 'হাই রেজ্যুলেশন সোর্স ফাইলস', 'আনলিমিটেড রিভিশন সুবিধা']
    },
    en: {
      title: 'Graphic Design',
      category: 'Design',
      shortDescription: 'Professional branding, social media design, banner, poster, brochure, business card and marketing creatives.',
      fullDescription: 'Establish your brand visual identity with striking graphic design services, brand guides, social media banners, vector logo crafting, and print deliverables.',
      features: ['Vector Logo Design', 'Social Media Graphics Pack', 'Print Ready CMYK Formats', 'High-Res Source Files', 'Unlimited Revision Support']
    }
  },
  'video-editing': {
    bn: {
      title: 'ভিডিও এডিটিং ও মোশন গ্রাফিক্স',
      category: 'মিডিয়া',
      shortDescription: 'ইউটিউব ভিডিও, রিলস, টিকটক, কর্পোরেট ভিডিও ও কমার্শিয়াল প্রমোশনাল ভিডিও এডিটিং।',
      fullDescription: 'উচ্চমানের 4K ভিডিও এডিটিং, কালার গ্রেডিং, সাউন্ড ডিজাইন এবং মোশন গ্রাফিক্সের মাধ্যমে আপনার ভিডিও কনটেন্টকে আরও আকর্ষণীয় করে তুলুন।',
      features: ['ইউটিউব ও সোশ্যাল রিলস এডিটিং', 'সিনেমাটিক কালার গ্রেডিং', 'সাউন্ড ইফেক্টস ও ব্যাকগ্রাউন্ড মিউজিক', 'মোশন টাইটেল ও সাবটাইটেল', 'দ্রুত ডেলিভারি ও ফুল এইচডি/৪কে']
    },
    en: {
      title: 'Video Editing & Motion Graphics',
      category: 'Media',
      shortDescription: 'YouTube videos, reels, TikToks, corporate presentations and commercial promotional videos.',
      fullDescription: 'High-end 4K video editing, color grading, sound design, and motion graphics to turn raw footage into captivating social and commercial content.',
      features: ['Social Reels & YouTube Editing', 'Cinematic Color Grading', 'Sound Effects & Mixing', 'Motion Graphics & Subtitles', 'Fast Delivery in 1080p/4K']
    }
  },
  'seo': {
    bn: {
      title: 'সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)',
      category: 'মার্কেটিং',
      shortDescription: 'গুগল টপ র‍্যাংকিং, অন-পেজ ও অফ-পেজ এসইও, টেকনিক্যাল অডিট ও ব্যাকলিংক সার্ভিস।',
      fullDescription: 'আপনার ওয়েবসাইটকে গুগলের প্রথম পাতায় নিয়ে আসতে অর্গানিক এসইও স্ট্র্যাটেজি। কম্প্রিহেনসিভ কি-ওয়ার্ড রিসার্চ, টেকনিক্যাল ফিক্স এবং কোয়ালিটি লিংক বিল্ডিং।',
      features: ['ইন-ডেপথ কি-ওয়ার্ড রিসার্চ', 'অন-পেজ এসইও অপ্টিমাইজেশন', 'টেকনিক্যাল এসইও ও স্পিড ফিক্স', 'হাই অথরিটি ব্যাকলিংকস', 'মাসিক প্রগ্রেস রিপোর্ট']
    },
    en: {
      title: 'Search Engine Optimization (SEO)',
      category: 'Marketing',
      shortDescription: 'Google top rankings, On-page & Off-page SEO, Technical audits and high-authority backlinks.',
      fullDescription: 'Drive organic search traffic and dominate Google rankings with proven white-hat SEO strategies, technical optimizations, and targeted keyword expansion.',
      features: ['In-Depth Keyword Research', 'On-Page SEO Optimization', 'Technical SEO & Speed Fixes', 'High-Authority Backlinks', 'Monthly Progress Analytics']
    }
  },
  'social-media': {
    bn: {
      title: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
      category: 'মার্কেটিং',
      shortDescription: 'ফেসবুক পেজ, ইনস্টাগ্রাম ও লিঙ্কডইন সম্পূর্ণ হ্যান্ডলিং ও অর্গানিক গ্রোথ।',
      fullDescription: 'আপনার সোশ্যাল মিডিয়া পেজগুলোর সম্পূর্ণ দায়িত্ব নিয়ে নিয়মিত পোস্ট পাবলিশিং, গ্রাফিক্স ক্রিয়েশন, মেসেজ রিপ্লাই ও ফলোয়ার বৃদ্ধির সামগ্রিক ব্যবস্থাপনা।',
      features: ['মাসিক ৩০টি কনটেন্ট ক্যালেন্ডার', 'কাস্টম ডিজাইন ও ক্যাপশন', 'ডেইলি পোস্ট শিডিউলিং', 'কমেন্ট ও মেসেজ রেসপন্স', 'গ্রোথ এনালাইসিস']
    },
    en: {
      title: 'Social Media Management',
      category: 'Marketing',
      shortDescription: 'End-to-end Facebook, Instagram and LinkedIn management with active organic engagement.',
      fullDescription: 'Complete social media profile management including monthly content calendars, graphic design, daily publishing, inbox moderation, and organic growth.',
      features: ['30-Day Content Calendar', 'Custom Visuals & Copy', 'Daily Post Scheduling', 'Engagement & Inbox Support', 'Monthly Growth Insights']
    }
  },
  'wordpress': {
    bn: {
      title: 'ওয়ার্ডপ্রেস কাস্টমাইজেশন ও স্পিড আপ',
      category: 'ডেভেলপমেন্ট',
      shortDescription: 'এলিমেন্টর, উকমার্স, প্লাগইন কনফিগারেশন, বাগ ফিক্স ও স্পিড অপ্টিমাইজেশন।',
      fullDescription: 'ওয়ার্ডপ্রেস সাইট কাস্টমাইজেশন, থিম সেটআপ, প্লাগইন ডেভেলপমেন্ট, সাইটের স্পিড ৯০+ স্কোর এ উন্নীতকরণ এবং ভাইরাস বা ম্যালওয়্যার ক্লিনআপ।',
      features: ['এলিমেন্টর প্রো কাস্টমাইজেশন', 'উকমার্স শপ সেটআপ', 'গুগল পেজস্পিড ৯০+ অপ্টিমাইজেশন', 'সিকিউরিটি হার্ডেনিং', 'অটোমেটিক ব্যাকআপ কনফিগ']
    },
    en: {
      title: 'WordPress Customization & Speed Up',
      category: 'Development',
      shortDescription: 'Elementor, WooCommerce, plugin configurations, bug fixes and speed optimization.',
      fullDescription: 'Complete WordPress site setup, custom Elementor designing, WooCommerce configuration, 90+ Google PageSpeed score tuning, and malware removal.',
      features: ['Elementor Pro Customization', 'WooCommerce Store Setup', 'PageSpeed 90+ Score Tuning', 'Security Hardening', 'Automated Daily Backups']
    }
  },
  'branding': {
    bn: {
      title: 'সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি প্যাকেজ',
      category: 'ডিজাইন',
      shortDescription: 'লোগো, ভিজিটিং কার্ড, লেটারহেড, ব্র্যান্ড গাইডলাইন ও ফুল স্টেশনারি সেট।',
      fullDescription: 'একটি প্রতিষ্ঠিত কোম্পানির রূপ দিতে লোগো, কালার প্যালেট, টাইপোগ্রাফি রুলস, ভিজিটিং কার্ড, ইনভয়েস এবং ব্র্যান্ড আইডেন্টিটি গাইডলাইন প্রস্তুতকরণ।',
      features: ['মাস্টার ব্র্যান্ড লোগো', 'কমপ্লিট স্টেশনারি ডিজাইন', 'ব্র্যান্ড কালার ও ফন্ট গাইডলাইন', 'প্রেজেন্টেশন ডেক টেমপ্লেট', 'কপিরাইট ও ভেক্টর ফাইলস']
    },
    en: {
      title: 'Complete Brand Identity Suite',
      category: 'Design',
      shortDescription: 'Logo, business cards, letterhead, brand style guide and full corporate stationery set.',
      fullDescription: 'A cohesive brand foundation covering logos, color palette rules, corporate stationery, slide decks, and comprehensive brand identity guidelines.',
      features: ['Master Brand Logo Suite', 'Corporate Stationery Set', 'Brand Color & Typography Guide', 'Presentation Deck Template', 'Full Vector & Copyright Assets']
    }
  }
};

export function getLocalizedService(service: Service, lang: 'bn' | 'en'): Service {
  const trans = serviceTranslations[service.id];
  if (!trans) {
    return service;
  }
  const localized = trans[lang] || trans['en'] || trans['bn'];
  return {
    ...service,
    title: localized.title || service.title,
    category: localized.category || service.category,
    shortDescription: localized.shortDescription || service.shortDescription,
    fullDescription: localized.fullDescription || service.fullDescription,
    features: localized.features && localized.features.length > 0 ? localized.features : service.features
  };
}

export const testimonialTranslations: Record<string, {
  bn: { name: string; role: string; text: string; courseOrService?: string };
  en: { name: string; role: string; text: string; courseOrService?: string };
}> = {
  'test-1': {
    bn: {
      name: 'মেহেদী হাসান',
      role: 'ই-কমার্স উদ্যোক্তা',
      text: 'PTENit টিমের সার্ভিস সত্যিই প্রশংসনীয়। ৫ দিনে আমাদের অনলাইন কাপড়ের সাইট বানিয়ে দিয়েছেন এবং পেমেন্ট গেটওয়ে খুব সহজে কাজ করছে।',
      courseOrService: 'ওয়েব ডিজাইন ও ডেভেলপমেন্ট'
    },
    en: {
      name: 'Mehedi Hasan',
      role: 'E-commerce Entrepreneur',
      text: 'The PTENit agency team delivered an outstanding online apparel storefront within 5 days with seamless bKash and card payment integration.',
      courseOrService: 'Web Design & Development'
    }
  },
  'test-2': {
    bn: {
      name: 'সাবরিনা সুলতানা',
      role: 'ফ্রিল্যান্সার & ডিজিটাল মার্কেটার',
      text: 'তানভীর স্যারের PTE ক্লাসের টেকনিকগুলো অসাধারন। প্র্যাকটিস করে আমি একবারে পয়েন্ট ৭৯ পেয়েছি!',
      courseOrService: 'PTE Academic - Basic Level'
    },
    en: {
      name: 'Sabrina Sultana',
      role: 'Freelancer & Digital Marketer',
      text: 'Tanvir Sir\'s PTE preparation techniques were phenomenal. Practicing the mock questions helped me score 79 on my first try!',
      courseOrService: 'PTE Academic - Basic Level'
    }
  }
};

export function getLocalizedTestimonial(item: Testimonial, lang: 'bn' | 'en'): Testimonial {
  const trans = testimonialTranslations[item.id];
  if (!trans) {
    return item;
  }
  const localized = trans[lang] || trans['en'] || trans['bn'];
  return {
    ...item,
    name: localized.name || item.name,
    role: localized.role || item.role,
    text: localized.text || item.text,
    courseOrService: localized.courseOrService || item.courseOrService
  };
}
