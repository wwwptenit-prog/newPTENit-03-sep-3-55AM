import {
  Course,
  Service,
  GalleryItem,
  Testimonial,
  Offer,
  SiteSettings,
  User,
  Enrollment,
  Certificate,
  MarketplaceGig,
  MarketplaceJob,
  MarketplaceProposal,
  MarketplaceOrder,
  DigitalProduct,
  LiveClassSession
} from '../types';

export const initialSiteSettings: SiteSettings = {
  heroHeading: "ডিজিটাল ক্যারিয়ার ও বিজনেস গড়ুন",
  heroSubtext: "আধুনিক IT সেবাসমূহ, কাস্টম সফটওয়্যার, ডিজিটাল মার্কেটিং ও প্রফেশনাল ট্রেনিং।",
  statsStudents: "500+",
  statsProjects: "100+",
  statsCourses: "50+",
  statsSatisfaction: "95%",
  phone: "+880 1700-000000",
  email: "info@ptenit.com",
  whatsapp: "+8801700000000",
  officeAddress: "House #12, Road #04, Sector #07, Uttara, Dhaka, Bangladesh",
  facebookUrl: "https://facebook.com/ptenit",
  youtubeUrl: "https://youtube.com/ptenit",
  instagramUrl: "https://instagram.com/ptenit",
  linkedinUrl: "https://linkedin.com/company/ptenit",
  bkashNumber: "01712345678",
  bkashLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png",
  bkashAccountType: "Personal",
  nagadNumber: "01700000000",
  nagadLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png",
  nagadAccountType: "Personal",
  rocketNumber: "01900000000",
  rocketLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png",
  rocketAccountType: "Personal",
  upayNumber: "01800000000",
  upayLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png",
  upayAccountType: "Personal",
  bankName: "Dutch-Bangla Bank PLC",
  bankAccountName: "PTENIT IT SOLUTIONS",
  bankAccountNumber: "2181100098765",
  bankBranch: "Uttara Branch, Dhaka",
  paymentLogos: [
    {
      id: "pay-bkash",
      name: "bKash",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png",
      type: "mobile",
      isActive: true
    },
    {
      id: "pay-nagad",
      name: "Nagad",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png",
      type: "mobile",
      isActive: true
    },
    {
      id: "pay-rocket",
      name: "DBBL Rocket",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png",
      type: "mobile",
      isActive: true
    },
    {
      id: "pay-upay",
      name: "Upay",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png",
      type: "mobile",
      isActive: true
    },
    {
      id: "pay-visa",
      name: "Visa",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png",
      type: "card",
      isActive: true
    },
    {
      id: "pay-mastercard",
      name: "MasterCard",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png",
      type: "card",
      isActive: true
    },
    {
      id: "pay-dbbl",
      name: "Dutch-Bangla Bank / Nexus",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png",
      type: "bank",
      isActive: true
    },
    {
      id: "pay-ibbl",
      name: "Islami Bank Bangladesh",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png",
      type: "bank",
      isActive: true
    }
  ],
  enableMoneyBackGuarantee: true,
  moneyBackGuaranteeDays: 10,
  moneyBackGuaranteeText: "১০-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি",
  metaPixelId: "7891234567890",
  googleAnalyticsId: "G-PTENIT8890",
  tiktokPixelId: "C1234567890TIK",
  googleTagManagerId: "GTM-PTENIT1",
  conversionApiToken: "EAAG...CONVERSION_API_TOKEN",
  platformTaxPercent: 5,
  courseVatPercent: 15,
  serviceTaxPercent: 10,
  freelancerTaxDeductionPercent: 5,
  taxRegistrationNumber: "BIN-1928374651029",
  invoiceTaxNote: "সকল মূল্যের সাথে সরকারি ভ্যাট ও ট্যাক্স প্রযোজ্য।",
  defaultCommissionRate: 10,
  defaultTrainerRevShare: 90,
  defaultClientFee: 0,
  defaultWithdrawalFee: 1.5,
  subAdminMembers: [
    {
      id: "sub-1",
      name: "তানভীর আহমেদ (সাপোর্ট হেড)",
      email: "tanvir.support@ptenit.com",
      phone: "01711223344",
      role: "Support Specialist",
      permissions: ["support_chat", "client_tickets", "live_queries"],
      status: "active",
      assignedAt: "2026-01-10"
    },
    {
      id: "sub-2",
      name: "রাফসান জামি (অর্ডার এক্সিকিউটিভ)",
      email: "rafsan.orders@ptenit.com",
      phone: "01822334455",
      role: "Order Manager",
      permissions: ["orders_manage", "client_deliveries", "billing_verify"],
      status: "active",
      assignedAt: "2026-02-01"
    }
  ],
  announcementNoticeText: "📢 ঈদ মেগা ধামাকা অফার! প্রিমিয়াম সার্ভিস ও ডিজিটাল প্রোডাক্ট কোর্সে বিশেষ ছাড় চলছে!",
  aboutUsText: "PTEN IT Solutions হলো বাংলাদেশের শীর্ষস্থানীয় ডিজিটাল সার্ভিস ও আইটি স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম। আমরা ক্লায়েন্টদের বিশ্বমানের সফটওয়্যার, ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং সার্ভিস এবং তরুণদের প্রফেশনাল স্কিল ট্রেনিং প্রদান করি।",
  termsAndConditionsText: "১. আমাদের সকল ডিজিটাল সার্ভিস এবং কোর্স ব্যবহারের ক্ষেত্রে প্রফেশনাল পলিসি প্রযোজ্য। ২. পেমেন্ট সম্পন্ন করার পর অর্ডার স্ট্যাটাস ট্র্যাকিং প্যানেলে দেখা যাবে। ৩. অনৈতিক বা কপিরাইট লঙ্ঘনে সার্ভিস সাময়িক স্থগিত হতে পারে।",
  privacyPolicyText: "আপনার ব্যক্তিগত তথ্য যেমন নাম, ইমেইল, ফোন নম্বর এবং পেমেন্ট ট্রানজ্যাকশন আইডি সম্পূর্ণ সুরক্ষিত রাখা হয়। আমরা কোনো তৃতীয় পক্ষের কাছে আপনার গোপনীয় তথ্য শেয়ার করি না।",
  refundPolicyText: "১০ দিনের মানি ব্যাক গ্যারান্টি শর্ত সাপেক্ষে প্রযোজ্য। যদি সার্ভিস বা কোর্স আপনার প্রত্যাশা অনুযায়ী না হয়, তবে আমাদের সাপোর্ট টিমে যোগাযোগ করে রিফান্ড রিকোয়েস্ট দিতে পারবেন।",
  footerCopyrightText: "© ২০২৬ PTEN IT Solutions. সর্বস্বত্ব সংরক্ষিত।",
  enableFullWidth100Percent: true,
  containerMaxWidth: "100%",
  customScalePercent: 100,
  mobileResponsiveMode: "fluid_100",
  seoTitle: "PTENit – IT Services, Web Development, Digital Marketing & IT Training Academy",
  metaDescription: "PTENit offers professional web design, software development, digital marketing, graphic design, and IT courses with lifetime support in Bangladesh.",
  metaKeywords: "PTENit, IT Services Bangladesh, Web Development, Digital Marketing, SEO Course, Graphic Design, Freelancing, IT Training Uttara",
  ogTitle: "PTENit – Complete IT Solutions & Skill Development Platform",
  ogDescription: "Grow your career & business with PTENit's expert software development, digital marketing services, and IT courses.",
  ogImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterHandle: "@ptenit_bd",
  canonicalUrl: "https://ptenit.com",
  googleSiteVerification: "google-site-verification-ptenit-12345",
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://ptenit.com/sitemap.xml",
  structuredDataJson: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PTENit Solutions",
    "url": "https://ptenit.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+8801700000000",
      "contactType": "customer service",
      "areaServed": "BD",
      "availableLanguage": ["en", "bn"]
    },
    "sameAs": [
      "https://facebook.com/ptenit",
      "https://youtube.com/ptenit",
      "https://linkedin.com/company/ptenit"
    ]
  }, null, 2)
};

export const initialOffers: Offer[] = [
  {
    id: "offer-1",
    title: "ঈদ মেগা অফার!",
    subtitle: "সকল প্রিমিয়াম কোর্সে ৫০% পর্যন্ত বিশেষ ক্যাশব্যাক ছাড়",
    discountBadge: "৫০% ছাড়",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ctaText: "অফারটি গ্রহণ করুন",
    ctaLink: "/courses",
    active: true,
  }
];

export const initialServices: Service[] = [
  {
    id: "web-dev",
    title: "Web Design & Development",
    category: "Development",
    shortDescription: "Professional responsive websites, landing pages, business websites, e-commerce websites and CMS solutions.",
    fullDescription: "আমরা আধুনিক React, Next.js, WordPress এবং E-Commerce ফ্রেমওয়ার্ক ব্যবহার করে হাই-স্পিড ও রেসপন্সিভ ওয়েবসাইট তৈরি করি। আপনার ব্র্যান্ডের জন্য উপযোগী কাস্টম UI/UX ডিজাইন এবং সিকিউর ব্যাকএন্ড সাপোর্ট অন্তর্ভুক্ত।",
    iconName: "Code",
    priceText: "৳15,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 48,
    packages: {
      basic: { name: "Landing Page / Single Page", price: 15000, deliveryDays: 4, revisions: 3, features: ["Mobile Responsive Layout", "Speed Optimization", "Free Hosting Setup"] },
      standard: { name: "Dynamic Business Website", price: 35000, deliveryDays: 7, revisions: 5, features: ["Up to 10 Pages", "Admin CMS Panel", "SEO Structure", "bKash/SSL Integration"] },
      premium: { name: "Custom E-Commerce & Web App", price: 75000, deliveryDays: 15, revisions: "Unlimited", features: ["Full Custom Tech Stack", "Payment Gateways", "1 Year Support", "Source Code Included"] }
    },
    features: [
      "100% Mobile Responsive Layout",
      "SEO Friendly Code Structure",
      "Free Domain & Hosting Setup",
      "Admin Panel & Content Management",
      "1 Year Technical Support"
    ],
    published: true,
    badge: "প্রিমিয়াম",
    order: 1
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    category: "Marketing",
    shortDescription: "Facebook, Google, YouTube and other social media marketing solutions.",
    fullDescription: "আপনার ব্যবসার সেলস ও ব্র্যান্ড ভ্যালু বহুগুণ বাড়াতে টার্গেটেড ডিজিটাল মার্কেটিং সেবা। ফেসবুক এডস ক্যাম্পেইন, গুগল পিসি এডস, ডিসপ্লে এডস এবং লিড জেনারেশনের মাধ্যমে সর্বোচ্চ ROI নিশ্চিত করা হয়।",
    iconName: "TrendingUp",
    priceText: "৳8,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 37,
    packages: {
      basic: { name: "Starter Ad Campaign", price: 8000, deliveryDays: 7, revisions: 2, features: ["Audience Targeting", "Pixel & Event Setup", "Ad Copywriting"] },
      standard: { name: "Growth Sales Funnel", price: 18000, deliveryDays: 15, revisions: 4, features: ["Facebook + Google Ads", "Custom Visual Creatives", "Weekly Performance Report"] },
      premium: { name: "Enterprise Brand Growth", price: 40000, deliveryDays: 30, revisions: "Unlimited", features: ["Full Funnel Strategy", "Lead Gen & Remarketing", "Dedicated Account Manager"] }
    },
    features: [
      "Targeted Audience Research",
      "Custom Ad Creatives & Copywriting",
      "Conversion Tracking & Pixel Setup",
      "Weekly Performance Reporting",
      "Sales Funnel Optimization"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 2
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    category: "Design",
    shortDescription: "Professional branding, social media design, banner, poster, brochure, business card and marketing creatives.",
    fullDescription: "ব্র্যান্ডের ভিজ্যুয়াল আইডেন্টিটি প্রতিষ্ঠা করতে চোখ ধাঁধানো গ্রাফিক ডিজাইন সেবা। লোগো ডিজাইন, সোশ্যাল মিডিয়া ব্যানার, ফ্লাইয়ার, ব্রোশিয়ার এবং ব্র্যান্ড বুক প্রিপারেশন।",
    iconName: "Palette",
    priceText: "৳5,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 52,
    packages: {
      basic: { name: "Vector Logo & Branding Card", price: 5000, deliveryDays: 2, revisions: 3, features: ["2 Logo Concepts", "Vector High Res Files", "3D Mockup"] },
      standard: { name: "Social Media Kit (15 Posts)", price: 12000, deliveryDays: 4, revisions: 5, features: ["15 Custom Posts", "Cover Photo", "Canva Editable Links"] },
      premium: { name: "Complete Brand Identity Manual", price: 28000, deliveryDays: 8, revisions: "Unlimited", features: ["Logo + Brand Guide", "Packaging & Stationery", "Marketing Creatives"] }
    },
    features: [
      "Unique Vector Logo Design",
      "Brand Color Palette & Typography",
      "Social Media Kit (20+ Templates)",
      "Print-Ready High Res Files",
      "Unlimited Revisions"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 3
  },
  {
    id: "video-editing",
    title: "Video Editing",
    category: "Multimedia",
    shortDescription: "Professional social media videos, promotional videos, reels, YouTube videos and motion graphics.",
    fullDescription: "আপনার প্রোডাক্ট বা ইউটিউব চ্যানেলের জন্য হাই-কোয়ালিটি ভিডিও এডিটিং। সাউন্ড ডিজাইন, মোশন গ্রাফিক্স, কালার গ্রেডিং এবং ক্যাচি সাবটাইটেল যোগ করে দর্শকনন্দিত ভিডিও তৈরি।",
    iconName: "Video",
    priceText: "৳1,500 / ভিডিও",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 29,
    packages: {
      basic: { name: "Reels / Shorts Video (60s)", price: 1500, deliveryDays: 1, revisions: 2, features: ["Catchy Subtitles", "Sound Effects", "Trend Editing"] },
      standard: { name: "YouTube Long Video (10m)", price: 4500, deliveryDays: 3, revisions: 4, features: ["4K Output", "Color Grading", "Custom Lower Thirds"] },
      premium: { name: "Commercial Promo & Motion Video", price: 15000, deliveryDays: 5, revisions: "Unlimited", features: ["Voiceover Sync", "Motion Graphics", "3D Title Animations"] }
    },
    features: [
      "4K & Full HD Video Output",
      "Professional Sound Mixing & SFX",
      "Custom Motion Graphics & Lower Thirds",
      "Engaging Subtitles & Transitions",
      "Fast Turnaround Time"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 4
  },
  {
    id: "seo",
    title: "SEO (Search Engine Optimization)",
    category: "Marketing",
    shortDescription: "Google SEO, Local SEO, YouTube SEO and website optimization.",
    fullDescription: "গুগলের প্রথম পেজে আপনার ওয়েবসাইট বা সার্ভিস নিয়ে আসতে রেজাল্ট-ওরিয়েন্টেড SEO সার্ভিস। অন-পেজ, অফ-পেজ, টেকনিক্যাল SEO এবং গুগল ম্যাপস লোকাল SEO গ্যারান্টি।",
    iconName: "Search",
    priceText: "৳10,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 41,
    packages: {
      basic: { name: "Technical & On-Page Audit", price: 10000, deliveryDays: 5, revisions: 3, features: ["Keyword Research", "Meta Optimization", "Speed Fix"] },
      standard: { name: "Google Rank Growth (Monthly)", price: 22000, deliveryDays: 30, revisions: 5, features: ["Full On-Page & Off-Page", "High DA Backlinks", "Rank Tracking"] },
      premium: { name: "Top 3 Guaranteed Organic SEO", price: 50000, deliveryDays: 60, revisions: "Unlimited", features: ["National/Global Target", "Competitor Hijack", "Monthly Guarantee"] }
    },
    features: [
      "Comprehensive Keyword Research",
      "On-Page Title & Meta Tag Optimization",
      "Technical SEO & Speed Boost",
      "High Authority Backlink Building",
      "Google My Business Rank Boost"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 5
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    category: "Marketing",
    shortDescription: "Facebook, Instagram, LinkedIn and other platform marketing.",
    fullDescription: "সোশ্যাল মিডিয়ায় অর্গানিক কন্টেন্ট পোস্টিং, অডিয়েন্স এনগেজমেন্ট এবং পেইড প্রমোশন পরিচালনা। নিয়মিত শিডিউলড পোস্ট ও গ্রাফিক্স কভার সার্ভিস।",
    iconName: "Share2",
    priceText: "৳7,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 31,
    packages: {
      basic: { name: "Weekly Content Mgmt", price: 7000, deliveryDays: 7, revisions: 2, features: ["8 Custom Posts", "Captions", "Hashtag Plan"] },
      standard: { name: "Full Monthly Page Mgmt", price: 16000, deliveryDays: 30, revisions: 4, features: ["20 Posts + 4 Reels", "Comment Inbox Mgmt", "Ad Campaign Setup"] },
      premium: { name: "Cross-Platform Growth Pack", price: 35000, deliveryDays: 30, revisions: "Unlimited", features: ["FB, IG, LinkedIn & TikTok", "Video Reels Production", "Growth Analytics"] }
    },
    features: [
      "Content Calendar Creation",
      "Custom Post Designs & Captions",
      "Community Engagement & Reply Mgmt",
      "Competitor Analysis",
      "Growth Analytics"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 6
  },
  {
    id: "wordpress",
    title: "WordPress Development",
    category: "Development",
    shortDescription: "Business website, landing page, WooCommerce and Elementor solutions.",
    fullDescription: "সহজে পরিচালনাযোগ্য ওয়ার্ডপ্রেস ওয়েবসাইট। এলিমেন্টর প্রক্সি এবং প্রিমিয়াম থিম ব্যবহার করে দ্রুত ডেলিভারি ও কাস্টমাইজেশন।",
    iconName: "Globe",
    priceText: "৳12,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 63,
    packages: {
      basic: { name: "WordPress Landing Page", price: 12000, deliveryDays: 2, revisions: 3, features: ["Elementor Pro Design", "Contact Form", "Mobile Friendly"] },
      standard: { name: "Complete Business Site", price: 25000, deliveryDays: 5, revisions: 5, features: ["Up to 8 Pages", "Blog & Gallery", "Security Hardening"] },
      premium: { name: "WooCommerce E-Commerce Store", price: 45000, deliveryDays: 8, revisions: "Unlimited", features: ["bKash/Nagad Integration", "Inventory Mgmt", "Automated Invoice"] }
    },
    features: [
      "Elementor Pro Setup",
      "WooCommerce Payment Gateway Setup",
      "Fast Loading Speed Optimization",
      "Security & Malware Protection",
      "Video Tutorial for Admin"
    ],
    published: true,
    badge: "আগে কাজ শুরু",
    order: 7
  },
  {
    id: "branding",
    title: "Branding",
    category: "Design",
    shortDescription: "Complete digital branding and visual identity solutions.",
    fullDescription: "আপনার স্টার্টআপ বা রিননড ব্যবসার জন্য থ্রি-সিক্সটি ডিগ্রি ব্র্যান্ডিং সলিউশন। কনসেপ্ট আর্ট থেকে শুরু করে মার্কেটিং ম্যাটেরিয়াল তৈরি।",
    iconName: "Award",
    priceText: "৳20,000 প্যাকেজ",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 22,
    packages: {
      basic: { name: "Corporate Identity Pack", price: 20000, deliveryDays: 5, revisions: 3, features: ["Brand Style Guide", "Stationery Kit", "Social Media Cover"] },
      standard: { name: "Complete Brand Ecosystem", price: 45000, deliveryDays: 10, revisions: 5, features: ["Full Visual Identity", "Packaging Design", "Company Profile PDF"] },
      premium: { name: "360 Growth & Brand Takeover", price: 90000, deliveryDays: 20, revisions: "Unlimited", features: ["Design + Video + Web", "Trademark Prep", "National PR Kit"] }
    },
    features: [
      "Full Brand Guidelines Manual",
      "Stationery & Uniform Mockups",
      "Packaging Design",
      "Digital Presence Strategy",
      "Brand Storytelling"
    ],
    published: true,
    badge: "প্রিমিয়াম",
    order: 8
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "PTENit HQ Office & Lab",
    category: "Office",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    caption: "উত্তরায় আমাদের আধুনিক অফিস ও প্র্যাকটিক্যাল কম্পিউটার ল্যাব"
  },
  {
    id: "gal-2",
    title: "Live Student Workshop",
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    caption: "লাইভ ব্যাচ শিক্ষার্থীদের সাথে হ্যাকথন ও প্র্যাকটিক্যাল সেশন"
  },
  {
    id: "gal-3",
    title: "Certificate Distribution Ceremony",
    category: "Events",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    caption: "সফলভাবে কোর্স সম্পন্নকারীদের সার্টিফিকেট প্রদান অনুষ্ঠান"
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "মেহেদী হাসান",
    role: "ই-কমার্স উদ্যোক্তা",
    courseOrService: "Web Design & Development",
    rating: 5,
    text: "PTENit টিমের সার্ভিস সত্যিই প্রশংসনীয়। ৫ দিনে আমাদের অনলাইন কাপড়ের সাইট বানিয়ে দিয়েছেন এবং পেমেন্ট গেটওয়ে খুব সহজে কাজ করছে।",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-2",
    name: "সাবরিনা সুলতানা",
    role: "ফ্রিল্যান্সার & ডিজিটাল মার্কেটার",
    courseOrService: "PTE Academic - Basic Level",
    rating: 5,
    text: "তানভীর স্যারের PTE ক্লাসের টেকনিকগুলো অসাধারন। প্র্যাকটিস করে আমি একবারে পয়েন্ট ৭৯ পেয়েছি!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  }
];

export const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "Mds Kazi Sohag (Admin)",
    email: "mdskazisohag@gmail.com",
    mobile: "01700000000",
    role: "admin",
    isSeller: true,
    sellerStatus: "approved",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    title: "Founder, CEO & Lead Admin",
    createdAt: "2026-01-01"
  }
];

export const initialEnrollments: Enrollment[] = [];

export const initialCertificates: Certificate[] = [];

export const initialCourses: Course[] = [
  {
    id: "course-canva",
    title: "Canva Design & Freelancing Masterclass",
    instructor: "তানভীর আহমেদ",
    instructorRole: "Senior Graphic Designer & Freelancer",
    category: "Graphic Design",
    duration: "4 Weeks (12 Hours)",
    lessonsCount: 16,
    enrolledCount: 342,
    rating: 4.9,
    reviewsCount: 88,
    isFree: false,
    price: 1200,
    discountPrice: 850,
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    description: "ক্যানভা (Canva Pro) দিয়ে কোনো কোডিং বা কঠিন সফটওয়্যার ছাড়া প্রফেশনাল সোশ্যাল মিডিয়া গ্রাফিক্স, ইউটিউব থাম্বনেইল, ব্যানার, লোগো এবং প্রেসেন্টেশন তৈরি শিখুন। মার্কেটপ্লেসে ইনকাম শুরু করার সম্পূর্ণ ফ্রিল্যান্সিং গাইডলাইন।",
    whatYouWillLearn: [
      "Canva Pro-এর সকল প্রিমিয়াম ফিচারের ব্যবহার",
      "সোশ্যাল মিডিয়া পোস্ট ও কাভার ব্যানার ডিজাইন",
      "হাই-কনভার্টিং ইউটিউব থাম্বনেইল তৈরি",
      "ব্র্যান্ড লোগো, ভিজিটিং কার্ড ও লেটারহেড ডিজাইন",
      "Fiverr ও Upwork-এ ক্যানভা সার্ভিস বিক্রি করার ট্রিকস"
    ],
    requirements: [
      "একটি স্মার্টফোন বা ল্যাপটপ/কম্পিউটার",
      "ইন্টারনেট কানেকশন",
      "ডিজাইনের প্রতি আগ্রহ"
    ],
    tags: ["#CanvaDesign", "#GraphicDesign", "#Freelancing", "#Fiverr"],
    published: true,
    createdAt: "2026-01-10",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    acceptedAt: "2026-01-20",
    targetModules: 4,
    targetLessons: 16,
    teacherCommissionRate: 35,
    liveClassStatus: 'live_now',
    liveClassTopic: 'ক্যানভা প্রো দিয়ে ইনস্টাগ্রাম ও ফেসবুক রিলস/পোস্ট ডিজাইন',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০৩',
    liveClassSerialNo: '০৫',
    liveClassDate: '2026-09-01',
    liveClassTime: '21:00',
    liveClassLink: 'https://meet.google.com/canva-live-pro',
    liveSchedule: 'আজ রাত ৯:০০ টা (🔴 এখন লাইভ চলছে)',
    modules: [
      {
        id: "m1",
        courseId: "course-canva",
        title: "ক্যানভা ফান্ডামেন্টালস ও প্রো টুলস",
        order: 1,
        lessons: [
          {
            id: "l1",
            courseId: "course-canva",
            moduleId: "m1",
            title: "লেসন ০১: ক্যানভা ইন্টারফেস পরিচিতি ও অ্যাকাউন্ট সেটআপ",
            duration: "২৫ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdfResourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            content: "ক্যানভা ইন্টারফেস পরিচিতি এবং প্রফেশনাল ক্যানভা একাউন্ট কনফিগারেশন।",
            isFreePreview: true,
            order: 1
          },
          {
            id: "l2",
            courseId: "course-canva",
            moduleId: "m1",
            title: "লেসন ০২: টাইপোগ্রাফি ও কালার সায়েন্স",
            duration: "৩০ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "ডিজাইনে সঠিক ফন্ট ও কালার নির্বাচন করার নিয়মাবলী।",
            isFreePreview: false,
            order: 2
          }
        ]
      },
      {
        id: "m2",
        courseId: "course-canva",
        title: "প্র্যাক্টিক্যাল প্রজেক্টস ও ফ্রিল্যান্সিং গাইড",
        order: 2,
        lessons: [
          {
            id: "l3",
            courseId: "course-canva",
            moduleId: "m2",
            title: "লেসন ০৩: ভাইরাল ইউটিউব থাম্বনেইল ডিজাইন",
            duration: "৪০ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "উচ্চ সিটিআর (CTR) ইউটিউব থাম্বনেইল তৈরির গোপন টেকনিক।",
            isFreePreview: false,
            order: 3
          }
        ]
      }
    ]
  },
  {
    id: "course-yt-seo",
    title: "YouTube SEO & Channel Growth Blueprint",
    instructor: "কাজী সোহাগ",
    instructorRole: "Digital Marketing Specialist",
    category: "SEO",
    duration: "6 Weeks (20 Hours)",
    lessonsCount: 22,
    enrolledCount: 215,
    rating: 4.8,
    reviewsCount: 54,
    isFree: false,
    price: 5999,
    discountPrice: 3499,
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    description: "আপনার ইউটিউব চ্যানেলের ভিডিও গুগলে ও ইউটিউব সার্চের ১ম স্থানে র‍্যাংক করানোর কমপ্লিট এসইও মাস্টারক্লাস। টাইটেল, ট্যাগ, ডেসক্রিপশন, হ্যাশট্যাগ ও TubeBuddy/vidiQ টুলস ব্যবহার শিখুন।",
    whatYouWillLearn: [
      "YouTube Algorithm & Ranking Factors",
      "High Search Volume Keyword Research",
      "TubeBuddy & VidIQ Keyword Masterclass",
      "Click-Through-Rate (CTR) & Audience Retention Optimization",
      "Channel Monetization & Sponsor Management"
    ],
    requirements: [
      "কম্পিউটার/ল্যাপটপ বা অ্যান্ড্রয়েড ফোন",
      "বেসিক কম্পিউটার জানা থাকা ভালো"
    ],
    tags: ["#SEOExpert", "#YouTubeSEO", "#SearchEngineOptimization", "#Monetization"],
    published: true,
    createdAt: "2026-01-15",
    targetModules: 5,
    targetLessons: 22,
    teacherCommissionRate: 30,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'TubeBuddy ও VidIQ দিয়ে হাই-র‍্যাংক কিওয়ার্ড সিলেকশন',
    liveClassModuleNo: '০৩',
    liveClassLessonNo: '০১',
    liveClassSerialNo: '০৮',
    liveClassDate: '2026-09-02',
    liveClassTime: '21:00',
    liveClassLink: 'https://meet.google.com/yt-seo-live',
    liveSchedule: '০২ সেপ্টেম্বর ২০২৬, রাত ০৯:০০ টা',
    modules: [
      {
        id: "m-yt-1",
        courseId: "course-yt-seo",
        title: "ইউটিউব অ্যালগরিদম ও চ্যানেল সেটআপ",
        order: 1,
        lessons: [
          {
            id: "l-yt-1",
            courseId: "course-yt-seo",
            moduleId: "m-yt-1",
            title: "লেসন ০১: ২০২৬ সালে ইউটিউব অ্যালগরিদম যেভাবে কাজ করে",
            duration: "৩৫ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdfResourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            content: "ইউটিউব এলগরিদম কিভাবে ভিডিও প্রমোট করে তা বিস্তারিত আলোচনা।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-fb-marketing",
    title: "Facebook Marketing & Paid Ads Mastery",
    instructor: "রেজওয়ান করিম",
    instructorRole: "FB Ads Strategist",
    category: "Digital Marketing",
    duration: "3 Weeks (10 Hours)",
    lessonsCount: 14,
    enrolledCount: 1250,
    rating: 4.9,
    reviewsCount: 310,
    isFree: true,
    price: 0,
    discountPrice: 0,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "সম্পূর্ণ বিনামূল্যে ফেসবুক পেজ সেটআপ, অর্গানিক গ্রোথ, বিজনেস ম্যানেজার, মেটা পিক্সেল এবং প্রফেশনাল এডস রান করা শিখুন। সকল ছোট-বড় ব্যবসায়ীদের জন্য অত্যন্ত দরকারি কোর্স।",
    whatYouWillLearn: [
      "Facebook Business Page Professional Setup",
      "Meta Business Suite & Ads Manager Setup",
      "Targeted Audience Custom & Lookalike Audiences",
      "Budgeting & Campaign Bidding Strategies",
      "Ad Creative Writing & High Conversion Tips"
    ],
    requirements: [
      "ইন্টারনেট কানেকশন সহ মোবাইল বা কম্পিউটার",
      "একটি ফেসবুক অ্যাকাউন্ট"
    ],
    tags: ["#Facebook", "#DigitalMarketing", "#Ads", "#Freelancing", "#FreeCourse"],
    published: true,
    createdAt: "2026-02-01",
    liveClassStatus: 'scheduled',
    liveClassTopic: 'টার্গেটেড অডিয়েন্স রিসার্চ ও ফেসবুক পিক্সেল সিটআপ',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০৪',
    liveClassDate: '2026-09-03',
    liveClassTime: '20:00',
    liveClassLink: 'https://meet.google.com/fb-marketing-live',
    liveSchedule: '০৩ সেপ্টেম্বর ২০২৬, রাত ০৮:০০ টা',
    modules: [
      {
        id: "m-fb-1",
        courseId: "course-fb-marketing",
        title: "ফেসবুক পেজ সেটআপ ও মেটা বিজনেস সুইট",
        order: 1,
        lessons: [
          {
            id: "l-fb-1",
            courseId: "course-fb-marketing",
            moduleId: "m-fb-1",
            title: "লেসন ০১: পেজ অপ্টিমাইজেশন ও ব্র্যান্ডিং রুলস",
            duration: "২০ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "পেজের ইউজারনেম, কভার আর্ট ও সিটিএ বাটন সেটআপ।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-wp-dev",
    title: "Complete WordPress & E-Commerce Development",
    instructor: "শাহরিয়ার হাসান",
    instructorRole: "Full Stack Developer",
    category: "Web Development",
    duration: "8 Weeks (28 Hours)",
    lessonsCount: 32,
    enrolledCount: 180,
    rating: 4.9,
    reviewsCount: 42,
    isFree: false,
    price: 4500,
    discountPrice: 2999,
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    description: "কোডিং ছাড়া প্রফেশনাল ই-কমার্স ওয়েবসাইট, ল্যান্ডিং পেজ, ব্লগ ও কর্পোরেট ওয়েবসাইট তৈরি শিখুন। bKash/Nagad পেমেন্ট গেটওয়ে সেটআপ সহ ক্লায়েন্ট হ্যান্ডলিং।",
    whatYouWillLearn: [
      "Domain & Hosting Setup Masterclass",
      "Elementor Pro Page Builder Mastery",
      "WooCommerce Online Shop Development",
      "bKash & Nagad Payment Gateway Setup",
      "Website Security & Backup Systems"
    ],
    requirements: [
      "ল্যাপটপ বা কম্পিউটার (কমপক্ষে ৪জিবি র‍্যাম)",
      "কম্পিউটার চালানোর প্রাথমিক ধারণা"
    ],
    tags: ["#WordPress", "#WooCommerce", "#WebDevelopment", "#Elementor"],
    published: true,
    createdAt: "2026-02-10",
    liveClassStatus: 'scheduled',
    liveClassTopic: 'উ-কমার্স স্টোর সেটআপ ও বিকাশ/নগদ গেটওয়ে ইন্টিগ্রেশন',
    liveClassModuleNo: '০১',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০২',
    liveClassDate: '2026-09-02',
    liveClassTime: '20:30',
    liveClassLink: 'https://meet.google.com/wp-live-ecommerce',
    liveSchedule: '০২ সেপ্টেম্বর ২০২৬, রাত ০৮:৩০ টা',
    modules: [
      {
        id: "m-wp-1",
        courseId: "course-wp-dev",
        title: "ওয়ার্ডপ্রেস ইনস্টলেশন ও থিম কাস্টমাইজেশন",
        order: 1,
        lessons: [
          {
            id: "l-wp-1",
            courseId: "course-wp-dev",
            moduleId: "m-wp-1",
            title: "লেসন ০১: লোকালহোস্ট ও লাইভ সিপ্যানেলে ওয়ার্ডপ্রেস ইনস্টল",
            duration: "৩০ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "XAMPP এবং লাইভ সিপ্যানেলে ওয়ার্ডপ্রেস ইনস্টলেশন।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-pte-basic-2026",
    title: "PTE Academic - Basic Level (Foundation & Fundamentals 2026)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "basic",
    instructorRole: "PTE Certified Trainer",
    category: "PTE Academic",
    duration: "4 Weeks (15 Hours)",
    lessonsCount: 12,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 3500,
    discountPrice: 2200,
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত বেসিক কোর্স। PTE Speaking, Writing, Reading & Listening সেকশনের বেসিক ফরম্যাট, টেমপ্লেট ও ফাউন্ডেশন প্র্যাকটিস।",
    whatYouWillLearn: [
      "PTE 4 Sections Basic Structure & Scoring Rules",
      "Pronunciation & Fluency Foundation",
      "Basic Essay Template & Summarize Text Rules"
    ],
    requirements: ["বেসিক ইংরেজি জানা আবশ্যক"],
    tags: ["#PTEBasic", "#StudyAbroad"],
    published: true,
    createdAt: "2026-02-10",
    targetModules: 4,
    targetLessons: 12,
    teacherCommissionRate: 35,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'PTE Speaking Read Aloud & Repeat Sentence Masterclass',
    liveClassModuleNo: '০১',
    liveClassLessonNo: '০১',
    liveClassSerialNo: '০১',
    liveClassDate: '2026-09-03',
    liveClassTime: '19:00',
    liveClassLink: 'https://meet.google.com/pte-basic-live',
    liveSchedule: '০৩ সেপ্টেম্বর ২০২৬, সন্ধ্যা ০৭:০০ টা',
    modules: []
  },
  {
    id: "course-pte-masterclass-2026",
    title: "PTE Academic - Advanced Level (79+ Target Masterclass 2026)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "advanced",
    instructorRole: "PTE Certified Trainer",
    category: "PTE Academic",
    duration: "5 Weeks (20 Hours)",
    lessonsCount: 16,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 6500,
    discountPrice: 4200,
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত এডভান্সড কোর্স। PTE Speaking, Writing, Reading & Listening সেকশনে 79+ স্কোর তোলার কৌশল ও AI মডেল মক টেস্ট প্র্যাকটিস।",
    whatYouWillLearn: [
      "PTE Speaking Describe Image & Read Aloud Standard",
      "PTE Writing Essay Template & Grammar Rules",
      "PTE Listening Summarize Spoken Text Mastery",
      "Real AI Evaluation & Live Mock Test Practice"
    ],
    requirements: [
      "হেডফোন সহ ল্যাপটপ বা কম্পিউটার",
      "ইংরেজি ইন্টারমিডিয়েট লেভেল"
    ],
    tags: ["#PTEAcademic", "#PTEPreparation", "#StudyAbroad"],
    published: true,
    createdAt: "2026-02-15",
    targetModules: 5,
    targetLessons: 16,
    teacherCommissionRate: 40,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'PTE 79+ Speaking Describe Image & AI Scoring Live Mock',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০৪',
    liveClassDate: '2026-09-03',
    liveClassTime: '21:00',
    liveClassLink: 'https://meet.google.com/pte-79-masterclass',
    liveSchedule: '০৩ সেপ্টেম্বর ২০২৬, রাত ০৯:০০ টা',
    modules: []
  },
  {
    id: "course-pte-pro-2026",
    title: "PTE Academic - Professional Level (Trainer Certification & AI Scoring)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "PTE Master Trainer",
    category: "PTE Academic",
    duration: "8 Weeks (32 Hours)",
    lessonsCount: 24,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 9500,
    discountPrice: 6800,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত প্রফেশনাল কোর্স। PTE ফুল মক টেস্ট, স্পেশাল এআই স্কোরিং এনালাইসিস এবং ট্রেইনার লেভেল মাস্টারি।",
    whatYouWillLearn: [
      "Full Mock Test with AI Band Breakdown",
      "1-on-1 Trainer Evaluation & Accent Training",
      "Advanced Fast Scoring Hacks"
    ],
    requirements: ["PTE Advanced level experience"],
    tags: ["#PTEPro", "#PTEMastery"],
    published: true,
    createdAt: "2026-02-18",
    targetModules: 8,
    targetLessons: 24,
    teacherCommissionRate: 50,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'PTE AI Band Breakdown & 1-on-1 Accent Evaluation',
    liveClassModuleNo: '০৩',
    liveClassLessonNo: '০১',
    liveClassSerialNo: '০৬',
    liveClassDate: '2026-09-04',
    liveClassTime: '20:00',
    liveClassLink: 'https://meet.google.com/pte-pro-mock',
    liveSchedule: '০৪ সেপ্টেম্বর ২০২৬, রাত ০৮:০০ টা',
    modules: []
  },
  {
    id: "course-web-basic-2026",
    title: "Full Stack Web Development - Basic (HTML, CSS & JS Fundamentals)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "basic",
    instructorRole: "Senior Software Engineer",
    category: "Web Development",
    duration: "6 Weeks (24 Hours)",
    lessonsCount: 18,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 4500,
    discountPrice: 2800,
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    description: "ওয়েব ডেভেলপমেন্টের বেসিক ফাউন্ডেশন কোর্স। শূন্য থেকে HTML5, CSS3, Tailwind এবং JavaScript শিখে ওয়েবসাইট তৈরি করুন।",
    whatYouWillLearn: ["HTML5 & Responsive CSS3", "Tailwind CSS Layouts", "JavaScript Essentials & DOM manipulation"],
    requirements: ["কম্পিউটার বা ল্যাপটপ"],
    tags: ["#WebDevBasic", "#HTML", "#CSS"],
    published: true,
    createdAt: "2026-02-12",
    targetModules: 4,
    targetLessons: 18,
    teacherCommissionRate: 35,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Tailwind CSS রেসপনসিভ লেআউট ও ফ্লেক্সবক্স হ্যান্ডস-অন',
    liveClassModuleNo: '০১',
    liveClassLessonNo: '০৩',
    liveClassSerialNo: '০৩',
    liveClassDate: '2026-09-04',
    liveClassTime: '21:30',
    liveClassLink: 'https://meet.google.com/web-basic-live',
    liveSchedule: '০৪ সেপ্টেম্বর ২০২৬, রাত ০৯:৩০ টা',
    modules: []
  },
  {
    id: "course-web-pro-2026",
    title: "Full Stack Web Development - Professional (Enterprise Microservices & Cloud)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "Senior Software Engineer",
    category: "Web Development",
    duration: "10 Weeks (40 Hours)",
    lessonsCount: 30,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 12000,
    discountPrice: 8500,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "প্রফেশনাল লেভেল ওয়েব ডেভেলপমেন্ট কোর্স। React, Node.js, Docker, Kubernetes এবং ক্লাউড মাইক্রোসার্ভিসেস আর্কিটেকচার।",
    whatYouWillLearn: ["Microservices Architecture", "Docker & Kubernetes Deployment", "Advanced Node.js & Cloud Scaling"],
    requirements: ["React & Node.js অভিজ্ঞতা"],
    tags: ["#WebDevPro", "#FullStack", "#Cloud"],
    published: true,
    createdAt: "2026-02-20",
    targetModules: 8,
    targetLessons: 30,
    teacherCommissionRate: 50,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Docker কন্টেইনারাইজেশন ও মাইক্রোসার্ভিসেস আর্কিটেকচার',
    liveClassModuleNo: '০৪',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০৮',
    liveClassDate: '2026-09-05',
    liveClassTime: '21:00',
    liveClassLink: 'https://meet.google.com/web-pro-cloud',
    liveSchedule: '০৫ সেপ্টেম্বর ২০২৬, রাত ০৯:০০ টা',
    modules: []
  },
  {
    id: "course-uiux-figma",
    title: "UI/UX Design & Figma Prototyping Masterclass 2026",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "advanced",
    instructorRole: "Lead Product Designer & UX Researcher",
    category: "Graphic Design",
    duration: "6 Weeks (20 Hours)",
    lessonsCount: 16,
    enrolledCount: 185,
    rating: 4.9,
    reviewsCount: 42,
    isFree: false,
    price: 5500,
    discountPrice: 3800,
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    description: "ফিগমা ব্যবহার করে আধুনিক মোবাইল অ্যাপ এবং ওয়েব অ্যাপ্লিকেশন UI/UX ডিজাইন, ওয়্যারফ্রেম, ইন্টারেক্টিভ প্রোটোটাইপিং ও ডিজাইন সিস্টেম তৈরি।",
    whatYouWillLearn: ["Figma Auto-layout & Components", "Design System & Variables", "Interactive Micro-interactions & Prototyping"],
    requirements: ["কম্পিউটার ও ইন্টারনেট কানেকশন"],
    tags: ["#UIUX", "#Figma", "#ProductDesign"],
    published: true,
    createdAt: "2026-02-15",
    targetModules: 4,
    targetLessons: 16,
    targetAssignments: 16,
    teacherCommissionRate: 40,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Figma Auto-layout, Components ও Design System',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০১',
    liveClassSerialNo: '০৩',
    liveClassDate: '2026-09-06',
    liveClassTime: '20:00',
    liveClassLink: 'https://meet.google.com/figma-uiux-live',
    liveSchedule: '০৬ সেপ্টেম্বর ২০২৬, রাত ০৮:০০ টা',
    modules: [
      {
        id: "m-figma-1",
        courseId: "course-uiux-figma",
        title: "ফিগমা ফান্ডামেন্টালস ও অটো লেআউট",
        order: 1,
        lessons: [
          {
            id: "l-figma-1",
            courseId: "course-uiux-figma",
            moduleId: "m-figma-1",
            title: "লেসন ০১: ফিগমা ইন্টারফেস ও ভেক্টর টুলস পরিচিতি",
            duration: "২৫ মিনিট",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "ফাইল সেটআপ ও বেসিক শেপ আর্কিটেকচার।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-python-django",
    title: "Python & Django Full Stack Web Engineering",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "Backend Engineer & Data Scientist",
    category: "Web Development",
    duration: "8 Weeks (30 Hours)",
    lessonsCount: 24,
    enrolledCount: 120,
    rating: 5.0,
    reviewsCount: 29,
    isFree: false,
    price: 8500,
    discountPrice: 5900,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "পাইথন প্রোগ্রামিং দিয়ে রিয়েল-ওয়ার্ল্ড ব্যাকএন্ড অ্যাপ্লিকেশন, Django REST Framework এবং PostgreSQL ইন্টিগ্রেশন।",
    whatYouWillLearn: ["Python 3 Core & OOP", "Django Framework & ORM", "RESTful APIs & JWT Authentication"],
    requirements: ["প্রোগ্রামিংয়ের মৌলিক ধারণা"],
    tags: ["#Python", "#Django", "#Backend"],
    published: true,
    createdAt: "2026-02-16",
    targetModules: 6,
    targetLessons: 24,
    targetAssignments: 24,
    teacherCommissionRate: 45,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Django REST Framework দিয়ে API তৈরি ও PostgreSQL কানেকশন',
    liveClassModuleNo: '০৩',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০৫',
    liveClassDate: '2026-09-06',
    liveClassTime: '21:30',
    liveClassLink: 'https://meet.google.com/python-django-live',
    liveSchedule: '০৬ সেপ্টেম্বর ২০২৬, রাত ০৯:৩০ টা',
    modules: []
  },
  {
    id: "course-english-spoken",
    title: "Spoken English, Accent Training & Global Communication",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "basic",
    instructorRole: "Corporate Language Coach",
    category: "PTE Academic",
    duration: "4 Weeks (16 Hours)",
    lessonsCount: 16,
    enrolledCount: 260,
    rating: 4.8,
    reviewsCount: 75,
    isFree: false,
    price: 3200,
    discountPrice: 1999,
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    description: "আত্মবিশ্বাসের সাথে ইংরেজিতে কথা বলা, উচ্চারণ ও অ্যাকসেন্ট সংশোধন, ডেইলি কনভারসেশন ও কর্পোরেট প্রেজেন্টেশন টেকনিক।",
    whatYouWillLearn: ["Daily Life Speaking Patterns", "Pronunciation Correction", "Job Interview & Presentation Skills"],
    requirements: ["শেখার তীব্র ইচ্ছা"],
    tags: ["#SpokenEnglish", "#Communication", "#Fluency"],
    published: true,
    createdAt: "2026-02-18",
    targetModules: 4,
    targetLessons: 16,
    targetAssignments: 16,
    teacherCommissionRate: 35,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Fluency Hacks, Daily Conversations & Accent Practice',
    liveClassModuleNo: '০১',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০২',
    liveClassDate: '2026-09-07',
    liveClassTime: '19:30',
    liveClassLink: 'https://meet.google.com/spoken-english-live',
    liveSchedule: '০৭ সেপ্টেম্বর ২০২৬, সন্ধ্যা ০৭:৩০ টা',
    modules: []
  },
  {
    id: "course-flutter-app",
    title: "Flutter & Dart Cross-Platform Mobile App Development",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "advanced",
    instructorRole: "Senior Mobile Application Engineer",
    category: "Web Development",
    duration: "8 Weeks (32 Hours)",
    lessonsCount: 20,
    enrolledCount: 95,
    rating: 4.9,
    reviewsCount: 21,
    isFree: false,
    price: 9000,
    discountPrice: 6500,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    description: "একটি কোডবেস দিয়ে Android ও iOS উভয় প্ল্যাটফর্মের জন্য আকর্ষণীয় নেটিভ পারফর্মেন্সের মোবাইল অ্যাপ তৈরি শিখুন।",
    whatYouWillLearn: ["Dart Fundamentals", "Flutter Widgets & State Management", "Firebase Backend & App Store Deploy"],
    requirements: ["বেসিক প্রোগ্রামিং নলেজ"],
    tags: ["#Flutter", "#Dart", "#MobileApp"],
    published: true,
    createdAt: "2026-02-22",
    targetModules: 6,
    targetLessons: 20,
    targetAssignments: 20,
    teacherCommissionRate: 45,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Flutter State Management ও Firebase Cloud Firestore সংযোগ',
    liveClassModuleNo: '০৩',
    liveClassLessonNo: '০১',
    liveClassSerialNo: '০৪',
    liveClassDate: '2026-09-07',
    liveClassTime: '21:00',
    liveClassLink: 'https://meet.google.com/flutter-app-live',
    liveSchedule: '০৭ সেপ্টেম্বর ২০২৬, রাত ০৯:০০ টা',
    modules: []
  },
  {
    id: "course-seo-content",
    title: "Advanced Technical SEO & AI Content Strategy Masterclass",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "advanced",
    instructorRole: "SEO Specialist & Growth Marketer",
    category: "Digital Marketing",
    duration: "5 Weeks (18 Hours)",
    lessonsCount: 14,
    enrolledCount: 140,
    rating: 4.9,
    reviewsCount: 38,
    isFree: false,
    price: 4500,
    discountPrice: 2900,
    thumbnail: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80",
    description: "গুগল র‍্যাংকিং ফ্যাক্টর, টেকনিক্যাল এসইও অডিট, কিওয়ার্ড রিসার্চ এবং এআই দিয়ে হাই-কনভার্টিং কন্টেন্ট স্ট্র্যাটেজি।",
    whatYouWillLearn: ["Keyword Research & Competitor Gap Analysis", "Technical On-Page & Schema Markup", "Backlinks & Topical Authority"],
    requirements: ["কম্পিউটার ও ব্রাউজার"],
    tags: ["#SEO", "#ContentMarketing", "#GoogleRanking"],
    published: true,
    createdAt: "2026-02-24",
    targetModules: 4,
    targetLessons: 14,
    targetAssignments: 14,
    teacherCommissionRate: 40,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'Technical SEO Audit, Schema Markup ও Google Search Console',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০২',
    liveClassSerialNo: '০৩',
    liveClassDate: '2026-09-08',
    liveClassTime: '20:00',
    liveClassLink: 'https://meet.google.com/seo-live-mastery',
    liveSchedule: '০৮ সেপ্টেম্বর ২০২৬, রাত ০৮:০০ টা',
    modules: []
  },
  {
    id: "course-cybersecurity",
    title: "Cybersecurity Fundamentals & Ethical Hacking Defense",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "Certified Ethical Hacker & InfoSec Specialist",
    category: "Web Development",
    duration: "7 Weeks (25 Hours)",
    lessonsCount: 18,
    enrolledCount: 88,
    rating: 5.0,
    reviewsCount: 19,
    isFree: false,
    price: 9500,
    discountPrice: 6999,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    description: "নেটওয়ার্ক সিকিউরিটি, ওয়েব ভালনারেবিলিটি অ্যাসেসমেন্ট (OWASP Top 10), পেনিট্রেশন টেস্টিং এবং সাইবার ডিফেন্স।",
    whatYouWillLearn: ["Network Scanning & Nmap", "OWASP Web Vulnerabilities Testing", "Security Auditing & Defensive Hardening"],
    requirements: ["বেসিক নেটওয়ার্কিং ও লিনাক্স ধারণা"],
    tags: ["#Cybersecurity", "#EthicalHacking", "#InfoSec"],
    published: true,
    createdAt: "2026-02-25",
    targetModules: 5,
    targetLessons: 18,
    targetAssignments: 18,
    teacherCommissionRate: 50,
    liveClassStatus: 'scheduled',
    liveClassTopic: 'OWASP Top 10 Web Vulnerability Assessment & Defense',
    liveClassModuleNo: '০২',
    liveClassLessonNo: '০৩',
    liveClassSerialNo: '০৫',
    liveClassDate: '2026-09-08',
    liveClassTime: '21:30',
    liveClassLink: 'https://meet.google.com/cybersecurity-live',
    liveSchedule: '০৮ সেপ্টেম্বর ২০২৬, রাত ০৯:৩০ টা',
    modules: []
  }
];

export const initialGigs: MarketplaceGig[] = [
  {
    "id": "gig-1",
    "description": "আপনার স্টার্টআপ বা ব্যবসার জন্য হাই-পারফরম্যান্স স্পিডি ওয়েব অ্যাপ্লিকেশন। রেসপন্সিভ ইউআই, নিরাপদ ব্যাকএন্ড এবং রিয়েলটাইম ডাটাবেস ইন্টিগ্রেশন।",
    "reviewsCount": 42,
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "rating": 4.9,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 58,
    "category": "Web Development",
    "packages": {
      "basic": {
        "features": [
          "১টি ল্যান্ডিং পেজ",
          "Tailwind UI",
          "মোবাইল ফ্রেন্ডলি"
        ],
        "revisions": 3,
        "price": 8500,
        "deliveryDays": 3,
        "name": "Single Page App"
      },
      "premium": {
        "name": "Enterprise Custom SaaS",
        "deliveryDays": 14,
        "price": 45000,
        "revisions": "Unlimited",
        "features": [
          "Full SaaS Engine",
          "Payment Gateway",
          "Deployment",
          "6 Months Support"
        ]
      },
      "standard": {
        "deliveryDays": 7,
        "price": 22000,
        "revisions": 5,
        "name": "Full Dynamic Website",
        "features": [
          "৫টি ডায়নামিক পেজ",
          "Admin Panel",
          "API Setup",
          "Database"
        ]
      }
    },
    "title": "আমি ফুল-স্ট্যাক রিয়েক্ট, নেক্সট-জেএস এবং নোড-জেএস কাস্টম ওয়েব অ্যাপ ডেভেলপ করবো",
    "isAgencyStaff": true,
    "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    "sellerTitle": "Senior Full Stack Architect & Tech Lead",
    "status": "active",
    "sellerId": "teacher-1",
    "createdAt": "2026-01-10",
    "offerBadge": "আগে কাজ শুরু",
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "sellerRating": 5
  },
  {
    "id": "gig-10",
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "reviewsCount": 26,
    "salesCount": 31,
    "sellerName": "আরিফ হোসেন",
    "status": "active",
    "thumbnail": "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=800&q=80",
    "sellerId": "teacher-2",
    "description": "গুগলে ফার্স্ট পেজে র‍্যাংক করার জন্য টেকনিক্যাল ফিক্স, ক্যানোনিকাল ট্যাগ, মেটা টাইটেল, এইচ১ রি-রাইট এবং অন-পেজ SEO।",
    "title": "আমি আপনার ওয়েবসাইটের সম্পূর্ণ অন-পেজ এবং টেকনিক্যাল এসইও র্যাঙ্কিং অডিট করবো",
    "createdAt": "2026-02-03",
    "isAgencyStaff": true,
    "rating": 4.8,
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerRating": 4.8,
    "category": "Digital Marketing",
    "packages": {
      "standard": {
        "features": [
          "১০ পেজ SEO",
          "Sitemap & Indexing",
          "Meta Tags Fix"
        ],
        "revisions": 4,
        "price": 7500,
        "name": "On-Page SEO (10 Pages)",
        "deliveryDays": 4
      },
      "premium": {
        "revisions": "Unlimited",
        "price": 20000,
        "features": [
          "On-page + Technical",
          "High DA Backlinks",
          "Monthly Rank Report"
        ],
        "name": "Full Monthly SEO Service",
        "deliveryDays": 30
      },
      "basic": {
        "name": "Technical Audit Report",
        "price": 2000,
        "revisions": 2,
        "features": [
          "Full Audit PDF",
          "Actionable Plan"
        ],
        "deliveryDays": 1
      }
    },
    "sellerTitle": "SEO & Growth Marketing Lead"
  },
  {
    "id": "gig-12",
    "rating": 5,
    "salesCount": 26,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "sellerId": "teacher-1",
    "isAgencyStaff": true,
    "sellerRating": 5,
    "description": "AWS, DigitalOcean, Hetzner সার্ভারে Ubuntu, Nginx, Docker সেটআপ, জিরো ডাউনটাইম মাইগ্রেশন ও ফ্রি SSL সার্টিফিকেট।",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "status": "active",
    "reviewsCount": 21,
    "thumbnail": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    "title": "আমি লিনাক্স ভিপিএস, সিপ্যানেল, এসএসএল এবং ক্লাউড সার্ভার মাইগ্রেশন সাপোর্ট দেবো",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "category": "Cyber Security & Server",
    "createdAt": "2026-02-05",
    "packages": {
      "basic": {
        "price": 2000,
        "deliveryDays": 1,
        "revisions": 2,
        "name": "SSL & Server Fix",
        "features": [
          "Free SSL Setup",
          "Nginx Configuration"
        ]
      },
      "standard": {
        "price": 6000,
        "features": [
          "Database & File Migration",
          "DNS Setup",
          "Performance Check"
        ],
        "deliveryDays": 2,
        "name": "Zero Downtime Migration",
        "revisions": 3
      },
      "premium": {
        "features": [
          "Dockerization",
          "CI/CD Pipeline",
          "Security Hardening"
        ],
        "deliveryDays": 4,
        "revisions": "Unlimited",
        "price": 15000,
        "name": "Full VPS / Docker Infra"
      }
    },
    "sellerTitle": "DevOps & Cloud Specialist"
  },
  {
    "id": "gig-13",
    "category": "Content Writing",
    "sellerRating": 4.9,
    "packages": {
      "premium": {
        "revisions": "Unlimited",
        "deliveryDays": 6,
        "price": 7500,
        "features": [
          "৫টি পেজের ফুল কন্টেন্ট",
          "High Converting Headlines"
        ],
        "name": "Full Website Copywriting"
      },
      "standard": {
        "features": [
          "৩০০০ শব্দ",
          "Meta Description",
          "Royalty Free Images"
        ],
        "deliveryDays": 3,
        "name": "3000 Words Package",
        "revisions": 5,
        "price": 2800
      },
      "basic": {
        "price": 1000,
        "features": [
          "১০০০ শব্দ কন্টেন্ট",
          "SEO Keyword Placement"
        ],
        "name": "1000 Words Article",
        "deliveryDays": 1,
        "revisions": 3
      }
    },
    "sellerName": "ফারহানা ইয়াসমিন",
    "salesCount": 23,
    "rating": 4.9,
    "description": "প্ল্যাজিয়ারিজম-ফ্রি, গ্রামারটিক্যালি নির্ভুল ও সুন্দর উপস্থাপনায় টেক, বিজনেস, লাইফস্টাইল আর্টিকেল রাইটিং।",
    "isAgencyStaff": false,
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "createdAt": "2026-02-06",
    "title": "আমি এসইও ফ্রেন্ডলি বাংলা ও ইংরেজি ব্লগ পোস্ট, আর্টিকেল এবং ওয়েবসাইট কন্টেন্ট লিখবো",
    "reviewsCount": 18,
    "status": "active",
    "sellerAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    "sellerTitle": "Content Writer & Translator",
    "sellerId": "student-4",
    "thumbnail": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "gig-14",
    "packages": {
      "premium": {
        "revisions": "Unlimited",
        "name": "Turnkey Automated Store",
        "price": 38000,
        "deliveryDays": 10,
        "features": [
          "Winning Products Research",
          "Automated Order System",
          "Marketing Apps"
        ]
      },
      "basic": {
        "name": "Shopify Starter",
        "features": [
          "Basic Theme Setup",
          "৫টি প্রোডাক্ট"
        ],
        "price": 6000,
        "deliveryDays": 2,
        "revisions": 3
      },
      "standard": {
        "revisions": 5,
        "name": "Pro E-Commerce Store",
        "price": 18000,
        "deliveryDays": 5,
        "features": [
          "Premium Theme",
          "২০টি প্রোডাক্ট",
          "Payment & Courier Integration"
        ]
      }
    },
    "sellerRating": 5,
    "category": "Web Development",
    "title": "আমি শপিফাই (Shopify) স্টোর সেটআপ, কাস্টম থিম এবং ড্রপশিপিং কনফিগারেশন করবো",
    "status": "active",
    "description": "প্রফেশনাল শপিফাই ই-কমার্স স্টোর। উইনিং প্রোডাক্ট ইমপোর্ট, পেমেন্ট গেটওয়ে সেটআপ এবং হাই-কনভার্টিং লেআউট।",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 20,
    "createdAt": "2026-02-07",
    "sellerId": "teacher-1",
    "reviewsCount": 15,
    "sellerTitle": "E-Commerce & Shopify Architect",
    "rating": 5,
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "thumbnail": "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    "isAgencyStaff": true
  },
  {
    "id": "gig-15",
    "packages": {
      "basic": {
        "deliveryDays": 3,
        "features": [
          "৩০ সেকেন্ড ভিডিও",
          "Full HD 1080p",
          "Sound Effects"
        ],
        "revisions": 3,
        "name": "30 Second Explainer",
        "price": 5000
      },
      "standard": {
        "price": 11000,
        "deliveryDays": 5,
        "name": "60 Second Explainer",
        "revisions": 5,
        "features": [
          "৬০ সেকেন্ড ভিডিও",
          "Voiceover Sync",
          "Script Assistance"
        ]
      },
      "premium": {
        "revisions": "Unlimited",
        "deliveryDays": 10,
        "price": 22000,
        "features": [
          "১২০ সেকেন্ড ভিডিও",
          "Custom Characters",
          "Commercial Rights"
        ],
        "name": "2 Min Pro Brand Video"
      }
    },
    "sellerRating": 4.8,
    "category": "Video Editing",
    "title": "আমি ব্যবসার প্রচারের জন্য ২ডি এনিমেটেড এক্সপ্লেইনার ভিডিও ও প্রমো তৈরি করবো",
    "status": "active",
    "description": "আকর্ষণীয় ক্যারেক্টার এনিমেশন, ভয়েসওভার ও বিজিএম সহ ২ডি এনিমেটেড প্রোমোশনাল ভিডিও এডিটিং।",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerName": "তামিম ইকবাল",
    "salesCount": 14,
    "createdAt": "2026-02-08",
    "sellerId": "student-3",
    "reviewsCount": 11,
    "sellerAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    "rating": 4.8,
    "sellerTitle": "2D Animator & Motion Designer",
    "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    "isAgencyStaff": false
  },
  {
    "id": "gig-16",
    "title": "আমি আপনার ওয়েবসাইটের সাইবার সিকিউরিটি অডিট ও পেনিট্রেশন টেস্টিং করবো",
    "status": "active",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "category": "Cyber Security & Server",
    "description": "SQL Injection, XSS, CSRF এবং ব্যাকডোর দুর্বলতা খুঁজে প্যাচ করার জন্য প্রফেশনাল সিকিউরিটি অডিট।",
    "reviewsCount": 8,
    "packages": {
      "premium": {
        "revisions": "Unlimited",
        "price": 45000,
        "deliveryDays": 12,
        "name": "Enterprise Security Certification",
        "features": [
          "Deep Source Code Audit",
          "Full Patching",
          "Certificate of Audit"
        ]
      },
      "basic": {
        "name": "Basic Vulnerability Scan",
        "price": 5000,
        "features": [
          "Automated Pentest",
          "Vulnerability Report"
        ],
        "revisions": 2,
        "deliveryDays": 2
      },
      "standard": {
        "deliveryDays": 5,
        "features": [
          "Manual Penetration Test",
          "Patch Assistance",
          "WAF Configuration"
        ],
        "name": "Manual PenTest & Patching",
        "price": 18000,
        "revisions": 4
      }
    },
    "isAgencyStaff": true,
    "sellerRating": 5,
    "sellerId": "teacher-1",
    "_lastSynced": "2026-09-21T13:23:34.272Z",
    "createdAt": "2026-02-09",
    "rating": 5,
    "salesCount": 10,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    "sellerTitle": "Certified Ethical Hacker & Security Engineer"
  },
  {
    "id": "gig-17",
    "_lastSynced": "2026-09-21T13:23:34.272Z",
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 22,
    "reviewsCount": 17,
    "createdAt": "2026-02-10",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "category": "AI & Automation",
    "sellerTitle": "Python Developer & Automation Expert",
    "rating": 5,
    "thumbnail": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "premium": {
        "price": 22000,
        "name": "Enterprise Scraping Pipeline",
        "revisions": "Unlimited",
        "features": [
          "Scheduled Scraping",
          "Database Integration",
          "Proxy Rotation"
        ],
        "deliveryDays": 7
      },
      "standard": {
        "name": "Automated Bot with GUI",
        "deliveryDays": 3,
        "price": 9000,
        "revisions": 4,
        "features": [
          "Complex Scraping",
          "Desktop Interface",
          "Anti-Bot Bypass"
        ]
      },
      "basic": {
        "name": "Simple Scraper Script",
        "deliveryDays": 1,
        "revisions": 2,
        "price": 3000,
        "features": [
          "1 Site Scraper",
          "Excel Output"
        ]
      }
    },
    "isAgencyStaff": true,
    "sellerId": "teacher-1",
    "title": "আমি পাইথন দিয়ে অটোমেশন স্ক্রিপ্ট, ওয়েব স্ক্র্যাপিং ও ডাটা এক্সট্র্যাকশন করবো",
    "status": "active",
    "description": "যেকোনো ওয়েবসাইট থেকে ডাটা স্ক্র্যাপ করে Excel/CSV বা ডাটাবেসে সেভ করার কাস্টম পাইথন অটোমেশন বোট।",
    "sellerRating": 5
  },
  {
    "id": "gig-18",
    "_lastSynced": "2026-09-21T13:23:34.272Z",
    "sellerName": "রাফসান সানি",
    "salesCount": 16,
    "reviewsCount": 13,
    "createdAt": "2026-02-11",
    "sellerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    "category": "Graphic Design",
    "sellerTitle": "Brand Identity Specialist",
    "rating": 4.9,
    "thumbnail": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "basic": {
        "price": 1500,
        "name": "Visiting Card & Letterhead",
        "deliveryDays": 1,
        "revisions": 3,
        "features": [
          "Double Sided Card",
          "Print Ready PDF"
        ]
      },
      "standard": {
        "deliveryDays": 3,
        "price": 5000,
        "revisions": 5,
        "name": "Logo + Stationery Kit",
        "features": [
          "Vector Logo",
          "Business Card",
          "Envelop & Pad"
        ]
      },
      "premium": {
        "price": 14000,
        "name": "Complete Brand Style Guide",
        "revisions": "Unlimited",
        "features": [
          "Full Brand Book",
          "Typography",
          "Usage Rules & Mockups"
        ],
        "deliveryDays": 7
      }
    },
    "isAgencyStaff": false,
    "sellerId": "student-2",
    "title": "আমি আপনার কোম্পানির ব্র্যান্ড আইডেন্টিটি, ভিজিটিং কার্ড ও ব্র্যান্ড গাইডলাইন বানাবো",
    "status": "active",
    "sellerRating": 4.9,
    "description": "একটি প্রফেশনাল ব্র্যান্ডের জন্য ভেক্টর লোগো, ভিজিটিং কার্ড, প্যাড, ইনভয়েস ও কালার প্যালেট তৈরি।"
  },
  {
    "id": "gig-19",
    "salesCount": 30,
    "sellerName": "তানভীর আহমেদ",
    "sellerRating": 5,
    "isAgencyStaff": true,
    "rating": 5,
    "sellerId": "teacher-1",
    "description": "PTE Academic রাইটিং এসে, রাইট ফ্রম ডিকটেশন এবং স্পিকিং রেকর্ডিং ইভালুয়েশন করে স্পেশাল স্কোর ইমপ্রুভমেন্ট টিপস।",
    "_lastSynced": "2026-09-21T13:23:34.272Z",
    "category": "Education & Training",
    "thumbnail": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "premium": {
        "features": [
          "5 Full Mocks",
          "Custom Hacks",
          "Direct WhatsApp Support"
        ],
        "revisions": "Unlimited",
        "name": "5 Mocks + Live Mentorship",
        "price": 9500,
        "deliveryDays": 7
      },
      "basic": {
        "deliveryDays": 1,
        "features": [
          "Detailed Scoring",
          "Grammar & Vocab Edits"
        ],
        "price": 1000,
        "name": "1 Essay Feedback",
        "revisions": 2
      },
      "standard": {
        "revisions": 3,
        "deliveryDays": 2,
        "name": "Full Speaking & Writing Mock",
        "price": 3500,
        "features": [
          "1 Mock Evaluation",
          "1-on-1 20m Zoom Session"
        ]
      }
    },
    "title": "আমি আপনার PTE/IELTS রাইটিং ও স্পিকিং টেস্ট অ্যাসেস করে ব্যান্ড স্কোর ফিডব্যাক দেবো",
    "sellerTitle": "PTE Master Trainer & Lead Assessor",
    "status": "active",
    "reviewsCount": 25,
    "createdAt": "2026-02-12",
    "sellerAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },
  {
    "id": "gig-2",
    "salesCount": 48,
    "sellerName": "আরিফ হোসেন",
    "sellerRating": 4.8,
    "isAgencyStaff": true,
    "rating": 4.8,
    "sellerId": "teacher-2",
    "description": "পিক্সেল সেটআপ, কনভার্সন ট্র্যাকিং, কাস্টম অডিয়েন্স এবং রিটার্গেটিং অ্যাডসের মাধ্যমে সেলস ৫ গুণ বৃদ্ধি করুন।",
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "category": "Digital Marketing",
    "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "basic": {
        "price": 3500,
        "name": "Ad Setup Starter",
        "features": [
          "১টি ক্যাম্পেইন",
          "অডিয়েন্স রিসার্চ"
        ],
        "deliveryDays": 2,
        "revisions": 2
      },
      "standard": {
        "revisions": 3,
        "deliveryDays": 5,
        "price": 8000,
        "features": [
          "৩টি ক্যাম্পেইন",
          "Pixel Setup",
          "A/B Test"
        ],
        "name": "Growth Funnel"
      },
      "premium": {
        "revisions": "Unlimited",
        "deliveryDays": 30,
        "features": [
          "৩০ দিন ফুল এড ম্যানেজমেন্ট",
          "আনলিমিটেড ক্যাম্পেইন"
        ],
        "name": "Monthly Growth Partner",
        "price": 18000
      }
    },
    "offerBadge": "৩০% ছাড়",
    "title": "আমি সেলস বাড়াতে টার্গেটেড ফেসবুক, ইন্সটাগ্রাম ও গুগল অ্যাডস ক্যাম্পেইন সেটআপ করবো",
    "sellerTitle": "Digital Marketing Specialist & Media Buyer",
    "status": "active",
    "reviewsCount": 35,
    "createdAt": "2026-01-12",
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    "id": "gig-20",
    "thumbnail": "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
    "rating": 5,
    "sellerRating": 5,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 13,
    "sellerId": "teacher-1",
    "description": "বিদ্যমান React Native অ্যাপের পারফরম্যান্স ইস্যু, ক্যাশ ক্র্যাশ, থার্ড পার্টি এসডিকে বা ব্যাকএন্ড এপিআই ইস্যু সলভ।",
    "createdAt": "2026-02-13",
    "category": "Mobile App Development",
    "reviewsCount": 10,
    "_lastSynced": "2026-09-21T13:23:34.272Z",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "title": "আমি রিয়েক্ট নেটিভ (React Native) মোবাইল অ্যাপের বাগ ফিক্সিং ও নতুন ফিচার যোগ করবো",
    "isAgencyStaff": true,
    "packages": {
      "premium": {
        "deliveryDays": 7,
        "features": [
          "Full Refactoring",
          "SDK Updates",
          "Play/App Store Update"
        ],
        "name": "App Refactoring & Upgrade",
        "revisions": "Unlimited",
        "price": 20000
      },
      "standard": {
        "deliveryDays": 3,
        "revisions": 4,
        "features": [
          "নতুন ফিচার/স্ক্রিন",
          "API Connection"
        ],
        "name": "Feature Integration",
        "price": 8000
      },
      "basic": {
        "price": 2500,
        "revisions": 2,
        "deliveryDays": 1,
        "name": "Single Bug Fix",
        "features": [
          "১টি বাগ ফিক্স",
          "Performance Check"
        ]
      }
    },
    "status": "active",
    "sellerTitle": "Senior Cross Platform Engineer"
  },
  {
    "id": "gig-21",
    "description": "আপনার পেইজের কমেন্টে অটো রিপ্লাই, ইনবক্সে মেসেজ ফ্লো এবং হোয়াটসঅ্যাপে ক্যাটাগরি দেখিয়ে প্রোডাক্ট অর্ডার কনফার্মেশন।",
    "title": "আমি ফেসবুক মেসেঞ্জার ও হোয়াটসঅ্যাপের জন্য মেনিচ্যাট (ManyChat) অটোমেশন বোট বানাবো",
    "sellerRating": 4.8,
    "status": "active",
    "sellerId": "teacher-2",
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "thumbnail": "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80",
    "category": "AI & Automation",
    "reviewsCount": 19,
    "salesCount": 25,
    "sellerName": "আরিফ হোসেন",
    "sellerTitle": "Automation & Growth Lead",
    "isAgencyStaff": true,
    "packages": {
      "premium": {
        "deliveryDays": 6,
        "features": [
          "WhatsApp Business API Integration",
          "CRM Connection"
        ],
        "price": 15000,
        "revisions": "Unlimited",
        "name": "WhatsApp & Messenger Automation"
      },
      "standard": {
        "features": [
          "Product Catalog Flow",
          "Lead Form Capture",
          "Broadcast Flow"
        ],
        "name": "Full E-Commerce Bot Flow",
        "price": 6500,
        "revisions": 4,
        "deliveryDays": 3
      },
      "basic": {
        "name": "Auto Reply Setup",
        "price": 2000,
        "revisions": 2,
        "features": [
          "Comment to Inbox Bot",
          "Welcome Message"
        ],
        "deliveryDays": 1
      }
    },
    "createdAt": "2026-02-14",
    "rating": 4.8,
    "_lastSynced": "2026-09-21T13:23:34.272Z"
  },
  {
    "id": "gig-22",
    "status": "active",
    "sellerId": "student-1",
    "sellerTitle": "Canva Design Specialist",
    "isAgencyStaff": false,
    "_lastSynced": "2026-09-21T13:23:34.273Z",
    "sellerRating": 4.9,
    "reviewsCount": 15,
    "rating": 4.9,
    "title": "আমি এডিটেবল ক্যানভা প্রফেশনাল টেমপ্লেট ও বিজনেস প্রেজেন্টেশন স্লাইড ডিজাইন করবো",
    "salesCount": 20,
    "sellerName": "সাব্বির রহমান",
    "sellerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "thumbnail": "https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&w=800&q=80",
    "description": "পরবর্তীতে টেক্সট ও ছবি পরিবর্তন করা যায় এমন ইজি-টু-ইউজ Canva প্রফেশনাল স্লাইড, ফ্লায়ার ও সোশ্যাল মিডিয়া কিট।",
    "packages": {
      "standard": {
        "features": [
          "১৫ স্লাইড প্রেজেন্টেশন",
          "Custom Graphics & Charts"
        ],
        "deliveryDays": 3,
        "revisions": 5,
        "name": "Investor Pitch Deck (15 Slides)",
        "price": 4500
      },
      "basic": {
        "name": "10 Canva Templates",
        "revisions": 3,
        "price": 1500,
        "deliveryDays": 1,
        "features": [
          "১০টি এডিটেবল টেমপ্লেট",
          "Canva Share Link"
        ]
      },
      "premium": {
        "deliveryDays": 5,
        "price": 9000,
        "revisions": "Unlimited",
        "name": "30 Days Social Content Pack",
        "features": [
          "৩০টি আলাদা পোস্ট ডিজাইন",
          "Reels Cover + Story Templates"
        ]
      }
    },
    "category": "Graphic Design",
    "createdAt": "2026-02-15"
  },
  {
    "id": "gig-23",
    "category": "AI Services",
    "_lastSynced": "2026-09-21T13:23:34.273Z",
    "packages": {
      "basic": {
        "name": "Basic Web Chatbot",
        "revisions": 3,
        "features": [
          "OpenAI/Gemini Setup",
          "Custom Prompt",
          "Embed Script"
        ],
        "price": 4000,
        "deliveryDays": 2
      },
      "premium": {
        "features": [
          "Full AI App",
          "Stripe/bKash Payment",
          "Admin Dashboard"
        ],
        "name": "Enterprise AI SaaS Portal",
        "deliveryDays": 10,
        "price": 35000,
        "revisions": "Unlimited"
      },
      "standard": {
        "features": [
          "PDF/Doc Knowledge Base",
          "Lead Capture",
          "WhatsApp/Web Widget"
        ],
        "price": 12000,
        "deliveryDays": 4,
        "name": "RAG Smart AI Bot (Custom Data)",
        "revisions": 5
      }
    },
    "reviewsCount": 32,
    "title": "আমি রিয়েলটাইম চ্যাটজিপিটি / জেমিনি এআই চ্যাটবট ও এআই সফটওয়্যার তৈরি করবো",
    "sellerTitle": "Senior Full-Stack & AI Engineer",
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 45,
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "status": "active",
    "isAgencyStaff": true,
    "sellerRating": 5,
    "createdAt": "2026-02-16",
    "thumbnail": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    "description": "আপনার ব্যবসার ওয়েবসাইট বা অ্যাপের জন্য কাস্টম ডাটা ও ডকুমেন্ট ট্রেইন্ড চ্যাট জিপিটি ও জেমিনি এআই বোট সিস্টেম।",
    "rating": 5,
    "sellerId": "teacher-1"
  },
  {
    "id": "gig-24",
    "status": "active",
    "description": "৪কে ক্লিয়ার অডিও, কালার গ্রেডিং, এটেনশন গ্রেবিং ক্যাপশন, সাউন্ড ইফেক্টস এবং মোশন গ্রাফিক্স ওভারলে সহ ভিডিও এডিটিং।",
    "category": "Video & Animation",
    "packages": {
      "basic": {
        "features": [
          "৩০-৬০ সে. এডিটিং",
          "Trendy Captions",
          "Sound FX"
        ],
        "revisions": 2,
        "price": 2000,
        "deliveryDays": 1,
        "name": "3 Short Videos / Reels (60s)"
      },
      "standard": {
        "revisions": 4,
        "name": "1 YouTube Long Video (10 Min)",
        "features": [
          "১০ মিনিট ভিডিও এডিটিং",
          "Color Grading",
          "Thumbnail Free"
        ],
        "price": 5000,
        "deliveryDays": 3
      },
      "premium": {
        "revisions": "Unlimited",
        "name": "4 Long + 10 Short Videos Package",
        "features": [
          "Monthly Content Pack",
          "Custom Motion Graphics",
          "SEO Titles"
        ],
        "price": 18000,
        "deliveryDays": 7
      }
    },
    "reviewsCount": 28,
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "title": "আমি প্রফেশনাল ইউটিউব ভিডিও, রিলস ও শর্টস ভিডিও এডিটিং করবো",
    "rating": 4.9,
    "createdAt": "2026-02-17",
    "sellerTitle": "YouTube & Video Editing Specialist",
    "sellerId": "teacher-2",
    "isAgencyStaff": true,
    "sellerRating": 4.9,
    "thumbnail": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    "_lastSynced": "2026-09-21T13:23:34.273Z",
    "salesCount": 36,
    "sellerName": "আরিফ হোসেন"
  },
  {
    "id": "gig-25",
    "status": "active",
    "title": "আমি সম্পূর্ণ অন-পেজ ও টেকনিক্যাল এসইও (SEO) দিয়ে গুগল ১ নম্বর র‍্যাঙ্কিং এ আনবো",
    "sellerName": "রাফসান সানি",
    "salesCount": 29,
    "reviewsCount": 21,
    "sellerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    "sellerId": "student-2",
    "isAgencyStaff": false,
    "description": "কীওয়ার্ড রিসার্চ, টেকনিক্যাল অডিট, গুগল সার্চ কনসোল সেটআপ, পেজ স্পিড অপটিমাইজেশন এবং হাই অথোরিটি ব্যাকলিংক তৈরি।",
    "packages": {
      "basic": {
        "features": [
          "15 Pages Audit",
          "Meta Tags Fix",
          "Sitemap & Robots.txt"
        ],
        "deliveryDays": 2,
        "name": "Technical SEO Audit & Fix",
        "price": 2500,
        "revisions": 3
      },
      "standard": {
        "features": [
          "Full On-Page Optimization",
          "Competitor Research",
          "Rank Tracking"
        ],
        "name": "Full On-Page + Keyword Plan",
        "price": 7500,
        "deliveryDays": 5,
        "revisions": 5
      },
      "premium": {
        "name": "Monthly Organic Ranking Growth",
        "deliveryDays": 30,
        "revisions": "Unlimited",
        "price": 22000,
        "features": [
          "Complete SEO Strategy",
          "High DA Backlinks",
          "Monthly Report"
        ]
      }
    },
    "rating": 5,
    "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "_lastSynced": "2026-09-21T13:23:34.273Z",
    "category": "SEO & Growth",
    "createdAt": "2026-02-18",
    "sellerTitle": "SEO & Content Marketing Lead",
    "sellerRating": 5
  },
  {
    "id": "gig-3",
    "status": "active",
    "title": "আমি আকর্ষণীয় সোশ্যাল মিডিয়া ব্যানার, লোগো এবং থাম্বনেইল ডিজাইন করবো",
    "sellerName": "সাব্বির রহমান",
    "salesCount": 29,
    "reviewsCount": 22,
    "sellerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "sellerId": "student-1",
    "isAgencyStaff": false,
    "description": "আপনার ব্র্যান্ডিং বাড়াতে প্রফেশনাল লোগো, ফেসবুক কভার, ইউটিউব থাম্বনেইল ও এড কভার ডিজাইন।",
    "packages": {
      "standard": {
        "features": [
          "১টি লোগো",
          "৫টি ব্যানার",
          "Print Ready File"
        ],
        "deliveryDays": 2,
        "name": "Brand Starter Pack",
        "price": 3500,
        "revisions": 5
      },
      "premium": {
        "revisions": "Unlimited",
        "price": 7500,
        "features": [
          "১৫টি কভার/পোস্ট",
          "সোর্স ফাইল (PSD/Canva)"
        ],
        "deliveryDays": 4,
        "name": "Full Social Branding"
      },
      "basic": {
        "revisions": 3,
        "deliveryDays": 1,
        "features": [
          "২টি সোশ্যাল ব্যানার",
          "HD PNG/JPG"
        ],
        "name": "Single Creative",
        "price": 1200
      }
    },
    "rating": 4.9,
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "thumbnail": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    "category": "Graphic Design",
    "sellerTitle": "Professional Canva & Graphic Designer",
    "createdAt": "2026-01-20",
    "sellerRating": 4.9
  },
  {
    "id": "gig-4",
    "sellerTitle": "Mobile App Architect (PTENit Core Team)",
    "reviewsCount": 19,
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "salesCount": 24,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "packages": {
      "basic": {
        "revisions": 3,
        "deliveryDays": 5,
        "features": [
          "৩টি রেসপন্সিভ স্ক্রিন",
          "Firebase Setup"
        ],
        "name": "Basic Flutter UI",
        "price": 15000
      },
      "standard": {
        "name": "Standard App with Backend",
        "price": 35000,
        "deliveryDays": 12,
        "revisions": 5,
        "features": [
          "৮টি স্ক্রিন",
          "REST API",
          "Auth & DB"
        ]
      },
      "premium": {
        "features": [
          "Full App",
          "Play Store & App Store Publish",
          "1 Year Maintenance"
        ],
        "deliveryDays": 25,
        "price": 75000,
        "name": "Complete Enterprise App",
        "revisions": "Unlimited"
      }
    },
    "category": "Mobile App Development",
    "rating": 5,
    "isAgencyStaff": true,
    "sellerId": "teacher-1",
    "description": "সিঙ্গেল কোডবেসে অ্যান্ড্রয়েড ও আইওএস অ্যাপ। রেসপন্সিভ ইউআই, ফায়ারবেস পুশ নোটিফিকেশন ও দ্রুত পারফরম্যান্স।",
    "createdAt": "2026-01-18",
    "thumbnail": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    "title": "আমি এন্ড্রয়েড ও আইওএস এর জন্য ক্রস-প্ল্যাটফর্ম ফ্ল্যাটার মোবাইল অ্যাপ তৈরি করবো",
    "status": "active",
    "sellerRating": 5
  },
  {
    "id": "gig-5",
    "sellerTitle": "SEO & Growth Marketing Lead",
    "offerBadge": "আগে কাজ শুরু",
    "status": "active",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerId": "teacher-2",
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "reviewsCount": 31,
    "thumbnail": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    "category": "Digital Marketing",
    "title": "আমি ইউটিউব চ্যানেল এসইও, ট্যাগ রিচার্জ এবং ভিডিও র্যাঙ্কিং অপটিমাইজেশন করবো",
    "salesCount": 39,
    "sellerName": "আরিফ হোসেন",
    "sellerRating": 4.8,
    "packages": {
      "standard": {
        "deliveryDays": 4,
        "price": 6500,
        "revisions": 4,
        "name": "10 Videos Channel SEO",
        "features": [
          "১০টি ভিডিও SEO",
          "Channel Audit",
          "Competitor Analysis"
        ]
      },
      "basic": {
        "name": "3 Videos SEO",
        "revisions": 2,
        "deliveryDays": 2,
        "features": [
          "৩টি ভিডিও SEO",
          "Keyword Research"
        ],
        "price": 2500
      },
      "premium": {
        "deliveryDays": 15,
        "features": [
          "৩০টি ভিডিও SEO",
          "Thumbnail Strategy",
          "Monthly Strategy Call"
        ],
        "revisions": "Unlimited",
        "price": 15000,
        "name": "Full Channel Growth Pack"
      }
    },
    "description": "অর্গানিক ভিউ এবং সাবস্ক্রাইবার বাড়াতে সঠিক কিওয়ার্ড রিসার্চ, কাস্টম ট্যাগস ও এসইও ফ্রেন্ডলি টাইটেল প্রোভাইড করবো।",
    "rating": 4.8,
    "createdAt": "2026-01-22",
    "isAgencyStaff": true
  },
  {
    "id": "gig-6",
    "sellerAvatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    "sellerId": "student-2",
    "reviewsCount": 16,
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "createdAt": "2026-01-25",
    "rating": 4.9,
    "title": "আমি ফিগমাতে ওয়েবসাইট ও মোবাইল অ্যাপের জন্য মডার্ন ইউআই/ইউএক্স ডিজাইন করবো",
    "thumbnail": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    "sellerTitle": "UI/UX & Product Designer",
    "status": "active",
    "isAgencyStaff": false,
    "packages": {
      "standard": {
        "price": 12000,
        "name": "Full Website UI (5 Pages)",
        "revisions": 5,
        "features": [
          "৫টি পেজ ইউআই",
          "Design System",
          "Interactive Prototype"
        ],
        "deliveryDays": 5
      },
      "basic": {
        "deliveryDays": 2,
        "features": [
          "১টি ল্যান্ডিং পেজ",
          "Figma File",
          "Mobile Version"
        ],
        "name": "Landing Page Figma",
        "price": 4000,
        "revisions": 3
      },
      "premium": {
        "price": 25000,
        "name": "Full Mobile App UX (15 Screens)",
        "features": [
          "১৫টি স্ক্রিন UX",
          "User Flow Chart",
          "Developer Handoff"
        ],
        "revisions": "Unlimited",
        "deliveryDays": 10
      }
    },
    "sellerRating": 4.9,
    "description": "ইউজার ফ্রেন্ডলি এবং নান্দনিক মোবাইল বা ওয়েব ইন্টারফেস ডিজাইন। ফিগমা প্রোটোটাইপ এবং ইউআই কিট হ্যান্ডঅফ।",
    "salesCount": 20,
    "sellerName": "রাফসান সানি",
    "category": "Graphic Design"
  },
  {
    "id": "gig-7",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "reviewsCount": 28,
    "sellerId": "teacher-1",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "rating": 5,
    "createdAt": "2026-01-28",
    "title": "আমি ওয়ার্ডপ্রেস ওয়েবসাইটের স্পিড এবং সিকিউরিটি অপটিমাইজেশন ৯০+ স্কোরে নিয়ে যাবো",
    "sellerTitle": "WordPress & Performance Specialist",
    "thumbnail": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    "isAgencyStaff": true,
    "status": "active",
    "packages": {
      "premium": {
        "revisions": "Unlimited",
        "name": "Full Security & Cloudflare Pro",
        "features": [
          "Full Hardening",
          "Cloudflare CDN Pro",
          "1 Month Monitoring"
        ],
        "deliveryDays": 4,
        "price": 14000
      },
      "standard": {
        "features": [
          "90+ PageSpeed",
          "Malware Removal",
          "SSL & Firewall"
        ],
        "revisions": 4,
        "price": 7000,
        "deliveryDays": 2,
        "name": "Pro Speed & Malware Clean"
      },
      "basic": {
        "features": [
          "Mobile 80+ Speed",
          "Cache Setup"
        ],
        "name": "Basic Speed Boost",
        "price": 3000,
        "deliveryDays": 1,
        "revisions": 2
      }
    },
    "sellerRating": 5,
    "description": "গুগল পেজস্পিড ইনসাইটসে 90+ স্কোর এচিভ করতে ডাটাবেস ক্লিনআপ, ইমেজ কম্প্রেশন এবং সিকিউরিটি ওয়াল সেটআপ।",
    "sellerName": "প্রকৌশলী আল-আমিন",
    "salesCount": 35,
    "category": "Web Development"
  },
  {
    "id": "gig-8",
    "sellerTitle": "Video Editor & Motion Artist",
    "sellerAvatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    "reviewsCount": 14,
    "salesCount": 18,
    "sellerName": "তামিম ইকবাল",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerId": "student-3",
    "rating": 4.7,
    "category": "Video Editing",
    "description": "এলেক্স হরমোজি স্টাইলের ট্রেন্ডি ক্যাপশন, কালার গ্রেডিং, সাউন্ড ইফেক্ট এবং বি-রোল ফুটেজ এড করে ভিডিও এডিট।",
    "createdAt": "2026-02-01",
    "isAgencyStaff": false,
    "packages": {
      "premium": {
        "deliveryDays": 10,
        "price": 16000,
        "features": [
          "১৫টি ভিডিও",
          "Hook Generation",
          "Background Music"
        ],
        "revisions": "Unlimited",
        "name": "15 Shorts Monthly Pack"
      },
      "standard": {
        "name": "5 Shorts Pack",
        "features": [
          "৫টি রিল/শর্টস",
          "Color Grading",
          "Motion Graphics"
        ],
        "price": 6000,
        "deliveryDays": 3,
        "revisions": 4
      },
      "basic": {
        "price": 1500,
        "revisions": 2,
        "name": "1 Short Video (60s)",
        "deliveryDays": 1,
        "features": [
          "১টি রিল/শর্টস",
          "Captions & SFX"
        ]
      }
    },
    "sellerRating": 4.7,
    "thumbnail": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    "title": "আমি ফেসবুক রিলস, টিকটক এবং ইউটিউব শর্টসের জন্য হাই-এনগেজিং ভিডিও এডিটিং করবো",
    "status": "active"
  },
  {
    "id": "gig-9",
    "sellerTitle": "Laravel Backend Engineer (PTENit Core Team)",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "reviewsCount": 12,
    "salesCount": 15,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "_lastSynced": "2026-09-21T13:23:34.271Z",
    "sellerId": "teacher-1",
    "rating": 5,
    "category": "Web Development",
    "createdAt": "2026-02-02",
    "description": "নিরাপদ পিএইচপি লারাভেল আর্কিটেকচার, কাস্টম সিআরএম, ই-কমার্স বা স্কুলের ম্যানেজমেন্ট পোর্টাল ডেভেলপমেন্ট।",
    "isAgencyStaff": true,
    "packages": {
      "basic": {
        "revisions": 2,
        "deliveryDays": 3,
        "price": 6000,
        "features": [
          "REST API Endpoints",
          "JWT Auth"
        ],
        "name": "API Module"
      },
      "standard": {
        "features": [
          "Full CRUD System",
          "Admin Dashboard",
          "bKash Integration"
        ],
        "deliveryDays": 8,
        "price": 25000,
        "revisions": 5,
        "name": "Custom Laravel Web App"
      },
      "premium": {
        "revisions": "Unlimited",
        "features": [
          "Complex CRM/ERP",
          "Payment Gateway",
          "Deployment & Support"
        ],
        "name": "Enterprise Portal & API",
        "price": 55000,
        "deliveryDays": 18
      }
    },
    "thumbnail": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    "sellerRating": 5,
    "title": "আমি লারাভেল (Laravel) পিএইচপি দিয়ে এন্টারপ্রাইজ ওয়েব পোর্টাল ও রেস্ট এপিআই তৈরি করবো",
    "status": "active"
  },
  {
    "id": "gig-premium-ai",
    "reviewsCount": 27,
    "galleryImages": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=800&q=80"
    ],
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "tags": [
      "Gemini AI",
      "AI Chatbot",
      "Automation",
      "প্রিমিয়াম"
    ],
    "createdAt": "2026-03-03",
    "sellerLevel": "Level 2 Seller",
    "salesCount": 39,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "category": "AI Services",
    "title": "প্রিমিয়াম জেমিনি AI চ্যাটবট, বিজনেস অটোমেশন ও স্মার্ট CRM ইন্টিগ্রেশন সার্ভিস",
    "description": "প্রিমিয়াম এআই সলিউশন: আপনার ব্যবসা ও গ্রাহক সেবাকে অটোমেট করতে Google Gemini AI ও ChatGPT চালিত ইন্টেলিজেন্ট চ্যাটবট। ফেসবুক মেসেঞ্জার, হোয়াটসঅ্যাপ ও ওয়েবসাইটে ২৪/৭ সেলস ও লিড জেনারেশন এজেন্ট সেটআপ।",
    "rating": 5,
    "thumbnail": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "premium": {
        "features": [
          "সম্পূর্ণ কাস্টম বিজনেস নলেজবেস",
          "ভয়েস ও টেক্সট AI অ্যাসিস্ট্যান্ট",
          "এপিআই ও ব্যাকএন্ড কানেক্টিভিটি",
          "১ বছর প্রায়োরিটি সাপোর্ট"
        ],
        "price": 35000,
        "name": "এন্টারপ্রাইজ ফুল AI এজেন্ট",
        "deliveryDays": 10,
        "revisions": "Unlimited"
      },
      "standard": {
        "name": "মাল্টি-চ্যানেল AI বোট",
        "price": 15000,
        "deliveryDays": 5,
        "revisions": 5,
        "features": [
          "ওয়েবসাইট + ফেসবুক পেজ",
          "প্রোডাক্ট ক্যাটালগ রিকমেন্ডেশন",
          "অটোমেটেড লিড ক্যাপচার",
          "CRM ডাটাবেস সেভ"
        ]
      },
      "basic": {
        "price": 6000,
        "deliveryDays": 2,
        "revisions": 3,
        "name": "AI চ্যাটবট ইন্টিগ্রেশন",
        "features": [
          "ওয়েবসাইটে AI চ্যাট উইজেট",
          "কাস্টম প্রম্পট টিউনিং",
          "প্রিমিয়াম রেসপন্স কোয়ালিটি",
          "সার্ভিস গ্যারান্টি"
        ]
      }
    },
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "sellerId": "teacher-1",
    "isAgencyStaff": true,
    "sellerTitle": "AI Specialist & Enterprise Architect",
    "sellerRating": 5,
    "offerBadge": "প্রিমিয়াম",
    "status": "active"
  },
  {
    "id": "gig-premium-erp",
    "reviewsCount": 46,
    "galleryImages": [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
    ],
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "tags": [
      "ERP",
      "POS",
      "Software",
      "প্রিমিয়াম",
      "Official Agency"
    ],
    "sellerLevel": "Top Rated Agency",
    "createdAt": "2026-03-01",
    "sellerName": "PTENit Official Agency",
    "salesCount": 89,
    "category": "Software Development",
    "title": "PTENit অফিশিয়াল প্রিমিয়াম এন্টারপ্রাইজ ইআরপি, কাস্টম সফটওয়্যার ও ক্লাউড পজ সিস্টেম",
    "description": "প্রিমিয়াম অফিশিয়াল সার্ভিস: মাঝারি ও বড় ব্যবসা, সুপারশপ এবং কর্পোরেট প্রতিষ্ঠানের জন্য কাস্টম ইআরপি, ইনভেন্টরি, একাউন্টিং ও মাল্টি-ব্রাঞ্চ বিলিং সফটওয়্যার। ক্লাউড ব্যাকআপ, রোল পারমিশন ও ডেডিকেটেড লাইফটাইম সাপোর্ট সহ।",
    "rating": 5,
    "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "basic": {
        "name": "Starter POS & Billing",
        "features": [
          "ইনভয়েস ও বারকোড বিলিং",
          "স্টক ও সেলস ট্র্যাকিং",
          "ক্যাশ ও বাকি রেজিস্টার",
          "লাইফটাইম অফিশিয়াল সাপোর্ট"
        ],
        "revisions": 3,
        "price": 20000,
        "deliveryDays": 5
      },
      "premium": {
        "features": [
          "ফুল কাস্টম বিজনেস সফটওয়্যার",
          "মোবাইল অ্যাপ ইন্টিগ্রেশন",
          "সোর্স কোড ও এপিআই অ্যাক্সেস",
          "১ বছর ২৪/৭ প্রায়োরিটি সাপোর্ট"
        ],
        "revisions": "Unlimited",
        "name": "Enterprise Custom SaaS Engine",
        "price": 130000,
        "deliveryDays": 30
      },
      "standard": {
        "name": "Multi-Branch Cloud ERP",
        "deliveryDays": 14,
        "price": 55000,
        "revisions": 5,
        "features": [
          "মাল্টি-ব্রাঞ্চ সিঙ্ক",
          "অ্যাকাউন্টিং ও পে-রোল",
          "কাস্টমার লেজার ও রিপোর্ট",
          "অনলাইন ক্লাউড হোস্টিং"
        ]
      }
    },
    "_lastSynced": "2026-09-21T13:23:34.269Z",
    "sellerId": "ptenit-agency",
    "isAgencyStaff": true,
    "sellerTitle": "Official IT Solutions & Software Agency",
    "sellerRating": 5,
    "offerBadge": "প্রিমিয়াম",
    "status": "active"
  },
  {
    "id": "gig-premium-mobile",
    "sellerRating": 5,
    "sellerId": "teacher-1",
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "isAgencyStaff": true,
    "tags": [
      "Flutter",
      "React Native",
      "Mobile App",
      "প্রিমিয়াম"
    ],
    "salesCount": 51,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "sellerTitle": "Senior Mobile & Full Stack Architect",
    "status": "active",
    "galleryImages": [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80"
    ],
    "sellerLevel": "Level 2 Seller",
    "createdAt": "2026-03-02",
    "description": "প্রিমিয়াম মোবাইল সলিউশন: এক কোডবেসেই অ্যান্ড্রয়েড এবং আইওএস অ্যাপ। পুশ নোটিফিকেশন, লোকাল পেমেন্ট গেটওয়ে (bKash/Nagad), রিয়েলটাইম ফায়ারবেস ব্যাকএন্ড এবং প্লে-স্টোর পাবলিশিং গাইডেন্স অন্তর্ভুক্ত।",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "packages": {
      "standard": {
        "deliveryDays": 12,
        "revisions": 5,
        "name": "কমপ্লিট ডায়নামিক মোবাইল অ্যাপ",
        "price": 35000,
        "features": [
          "৮টি স্ক্রিন + API কানেকশন",
          "ইউজার লগইন ও পুশ নোটিফিকেশন",
          "Android + iOS বিল্ড",
          "প্লে-স্টোর রেডি"
        ]
      },
      "basic": {
        "deliveryDays": 5,
        "revisions": 3,
        "features": [
          "৩টি মেইন স্ক্রিন",
          "মডার্ন UI কম্পোনেন্ট",
          "Android APK বিল্ড",
          "প্রিমিয়াম কোয়ালিটি কোড"
        ],
        "name": "হাইব্রিড প্রোটোটাইপ অ্যাপ",
        "price": 15000
      },
      "premium": {
        "price": 75000,
        "features": [
          "কমপ্লিট অনলাইন পেমেন্ট ইন্টিগ্রেশন",
          "রিয়েলটাইম ট্র্যাকিং & চ্যাট",
          "অ্যাডমিন ড্যাশবোর্ড প্যানেল",
          "৬ মাস ফ্রি মেইনটেন্যান্স"
        ],
        "deliveryDays": 20,
        "revisions": "Unlimited",
        "name": "ফুল ই-কমার্স / অন-ডিমান্ড অ্যাপ"
      }
    },
    "reviewsCount": 33,
    "category": "Mobile App",
    "thumbnail": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    "title": "প্রিমিয়াম ফ্লাটার ও রিয়্যাক্ট নেটিভ দিয়ে গুগল প্লে-স্টোর ও অ্যাপল অ্যাপ তৈরি করব",
    "rating": 5,
    "offerBadge": "প্রিমিয়াম"
  },
  {
    "id": "gig-workfirst-design",
    "isAgencyStaff": false,
    "packages": {
      "premium": {
        "price": 9500,
        "features": [
          "লোগো + ১৫টি পোস্ট ব্যানার",
          "স্টোরি ও রিলস কাভার",
          "ব্র্যান্ড গাইডলাইন বুকলেট",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "deliveryDays": 5,
        "name": "ফুল সোশ্যাল মিডিয়া ব্র্যান্ডিং",
        "revisions": "Unlimited"
      },
      "basic": {
        "revisions": 3,
        "deliveryDays": 1,
        "name": "স্টার্টার সোশ্যাল প্যাক",
        "features": [
          "৩টি সোশ্যাল ব্যানার",
          "হাই-রেজুলেশন PNG/JPG",
          "কাস্টম ব্র্যান্ড কালার",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "price": 1500
      },
      "standard": {
        "features": [
          "২টি কনসেপ্ট ভেক্টর লোগো",
          "ভিজিটিং কার্ড ডিজাইন",
          "ভেক্টর সোর্স ফাইল (AI/EPS)",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "deliveryDays": 2,
        "price": 4000,
        "name": "কমপ্লিট ব্র্যান্ড লোগো কিট",
        "revisions": 5
      }
    },
    "thumbnail": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    "status": "active",
    "description": "আগে কাজ শুরু স্পেশাল: আপনার ব্যবসার ব্র্যান্ড ভ্যালু বাড়াতে প্রিমিয়াম কোয়ালিটির ভেক্টর লোগো, ফেসবুক কাভার এবং সোশ্যাল মিডিয়া পোস্ট ডিজাইন। ফাইনাল ডিজাইন দেখে সন্তুষ্ট হয়ে বিল পরিশোধের শতভাগ নিশ্চয়তা।",
    "sellerRating": 4.9,
    "category": "Graphic Design",
    "createdAt": "2026-03-03",
    "sellerLevel": "Level 1 Seller",
    "salesCount": 37,
    "sellerName": "সাব্বির রহমান",
    "tags": [
      "Logo Design",
      "Branding",
      "Graphics",
      "আগে কাজ শুরু"
    ],
    "sellerTitle": "Professional Brand Identity & Graphic Designer",
    "rating": 4.9,
    "galleryImages": [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80"
    ],
    "offerBadge": "আগে কাজ শুরু",
    "title": "আমি ইউনিক ভেক্টর লোগো ও আকর্ষণীয় সোশ্যাল মিডিয়া ব্র্যান্ডিং প্যাক ডিজাইন করব (আগে কাজ শুরু)",
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "sellerId": "student-1",
    "reviewsCount": 24,
    "sellerAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    "id": "gig-workfirst-marketing",
    "sellerAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "rating": 4.9,
    "sellerTitle": "Digital Marketing Specialist & Media Buyer",
    "reviewsCount": 31,
    "thumbnail": "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80",
    "packages": {
      "premium": {
        "features": [
          "মাসব্যাপী এড ম্যানেজমেন্ট",
          "উচ্চ ROI স্ট্র্যাটেজি",
          "সাপ্তাহিক প্রগ্রেস রিপোর্ট",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "revisions": "Unlimited",
        "deliveryDays": 30,
        "price": 16000,
        "name": "৩০ দিন ফুল এডস ম্যানেজমেন্ট"
      },
      "standard": {
        "revisions": 5,
        "deliveryDays": 5,
        "name": "গ্রোথ সেলস ফানেল",
        "price": 7500,
        "features": [
          "৩টি ক্যাম্পেইন A/B টেস্ট",
          "কনভার্সন অপটিমাইজেশন",
          "রিটার্গেটিং অডিয়েন্স",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ]
      },
      "basic": {
        "price": 3000,
        "name": "টার্গেটেড এডস সেটআপ",
        "features": [
          "১টি অডিয়েন্স ক্যাম্পেইন",
          "পিক্সেল সেটআপ",
          "এড কপিরাইটিং",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "deliveryDays": 2,
        "revisions": 3
      }
    },
    "sellerName": "আরিফ হোসেন",
    "salesCount": 42,
    "isAgencyStaff": true,
    "_lastSynced": "2026-09-21T13:23:34.270Z",
    "createdAt": "2026-03-02",
    "category": "Digital Marketing",
    "description": "আগে কাজ শুরু সুবিধা: কোনো অগ্রিম পেমেন্ট ছাড়াই আপনার ব্র্যান্ডের জন্য ফেসবুক ও গুগল এডস ক্যাম্পেইন, পিক্সেল ট্র্যাকিং এবং লিড ফানেল সেটআপ করব। ড্রাফট ও প্রাথমিক রেজাল্ট যাচাই করে বিল রিলিজ করবেন।",
    "sellerId": "teacher-2",
    "status": "active",
    "tags": [
      "Facebook Ads",
      "Google Ads",
      "Digital Marketing",
      "আগে কাজ শুরু"
    ],
    "title": "আমি সেলস বহুগুণ বাড়াতে টার্গেটেড ফেসবুক ও গুগল এডস ফানেল সেটআপ করব (আগে কাজ শুরু)",
    "galleryImages": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
    ],
    "sellerLevel": "Top Rated Seller",
    "sellerRating": 4.9,
    "offerBadge": "আগে কাজ শুরু"
  },
  {
    "id": "gig-workfirst-web",
    "description": "আগে কাজ শুরু অফার: আপনার ব্যবসার জন্য প্রফেশনাল ও রেসপন্সিভ ওয়েবসাইট বা ওয়েব অ্যাপ্লিকেশন তৈরি করে দেওয়া হবে সম্পূর্ণ বিনা অগ্রিম বিলে। কাজ সম্পন্ন হওয়ার পর লাইভ রিভিউ দেখে বিল পরিশোধ করবেন। সাথে পাবেন ১ বছর ফ্রি মেইনটেন্যান্স ও টেকনিক্যাল সাপোর্ট।",
    "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "category": "Web Development",
    "tags": [
      "Next.js",
      "React",
      "E-commerce",
      "আগে কাজ শুরু",
      "Web Development"
    ],
    "offerBadge": "আগে কাজ শুরু",
    "packages": {
      "basic": {
        "name": "ল্যান্ডিং পেজ / সিঙ্গেল পেজ",
        "revisions": 3,
        "deliveryDays": 3,
        "price": 6500,
        "features": [
          "১টি রেসপন্সিভ ল্যান্ডিং পেজ",
          "মোবাইল ফ্রেন্ডলি UI",
          "কন্টাক্ট ফর্ম & হোয়াটসঅ্যাপ বাটন",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ]
      },
      "standard": {
        "features": [
          "৮টি ডায়নামিক পেজ",
          "এডমিন প্যানেল CMS",
          "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "name": "ডায়নামিক বিজনেস ওয়েবসাইট",
        "price": 16000,
        "deliveryDays": 6,
        "revisions": 5
      },
      "premium": {
        "features": [
          "সম্পূর্ণ কাস্টম ই-কমার্স শপ",
          "ইনভেন্টরি & অর্ডার ট্র্যাকিং",
          "১ বছর টেকনিক্যাল সাপোর্ট",
          "০ টাকা অগ্রিম (কাজের পর পেমেন্ট)"
        ],
        "name": "ফুল ই-কমার্স / SaaS সলিউশন",
        "deliveryDays": 12,
        "price": 38000,
        "revisions": "Unlimited"
      }
    },
    "isAgencyStaff": true,
    "createdAt": "2026-03-01",
    "sellerLevel": "Level 2 Seller",
    "sellerAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "reviewsCount": 38,
    "salesCount": 54,
    "sellerName": "প্রকৌশলী আল-আমিন",
    "sellerRating": 5,
    "sellerTitle": "Senior Full Stack Architect (PTENit Core Team)",
    "title": "আমি কোনো অগ্রিম বিল ছাড়াই আধুনিক ফুল-স্ট্যাক ও ই-কমার্স ওয়েবসাইট তৈরি করব (আগে কাজ শুরু)",
    "status": "active",
    "sellerId": "teacher-1",
    "_lastSynced": "2026-09-21T13:23:34.269Z",
    "galleryImages": [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

export const initialJobs: MarketplaceJob[] = [];

export const initialProposals: MarketplaceProposal[] = [];

export const initialMarketplaceOrders: MarketplaceOrder[] = [];

export const initialDigitalProducts: DigitalProduct[] = [
  {
    id: "dp-canva-1",
    title: "Canva Pro Lifetime VIP এক্সেস ও ২০,০০০+ প্রিমিয়াম টেমপ্লেট বান্ডেল",
    category: "Canva Templates",
    price: 450,
    originalPrice: 1500,
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    shortDescription: "১ ক্লিকে অটো ক্যানভা ব্র্যান্ড টিম ইনভাইট এক্সেস, প্রিমিয়াম ফন্ট, প্রো এলিমেন্ট ও সোশ্যাল মিডিয়া টেমপ্লেট বান্ডেল।",
    fullDescription: "পেমেন্ট সফল হওয়ার সাথে সাথেই আপনি Thank You / Rules পেজে নিয়ে যাওয়া হবেন এবং সেখানে 'Access Now' বাটনে ক্লিক করে সরাসরি আমাদের সেভড ক্যানভা ইনভাইট লিঙ্কের মাধ্যমে প্রো এক্সেস পাবেন। নিরাপত্তা নিশ্চিতের জন্য লিঙ্কটি একবারই ব্যবহারযোগ্য এবং দ্বিতীয়বার লক থাকবে।",
    deliveryType: "canva_auto",
    canvaInviteLink: "https://www.canva.com/brand/join?token=PTENIT_CANVA_PRO_INVITE_2026",
    canvaRules: "১. আপনার ক্যানভা অ্যাকাউন্টে লগইন থাকা অবস্থায় 'Access Now' বাটনে ক্লিক করুন।\n২. লিংকে ক্লিক করার সাথে সাথে সরাসরি ক্যানভা প্রো ব্র্যান্ড টিমে যুক্ত হবেন।\n৩. এই ইনভাইট লিঙ্কটি শুধুমাত্র আপনার অ্যাকাউন্টের জন্য সংরক্ষিত।\n৪. সতর্কতা: নিরাপত্তা নিশ্চিতের জন্য Access Now বাটনটি একবারই ক্লিক করা যাবে। দ্বিতীয়বার লিঙ্কটি লক দেখাবে।",
    fileFormat: "Canva VIP Link",
    fileSize: "Instant Cloud Access",
    rating: 5.0,
    reviewsCount: 142,
    salesCount: 680,
    features: ["ক্যানভা প্রো আনলিমিটেড লাইফটাইম", "২০,০০০+ সোশ্যাল টেমপ্লেট", "১-ক্লিক অটো ইনভাইট সিস্টেম", "সিঙ্গেল-ইউজ সিকিউর এক্সেস"],
    downloadUrl: "https://www.canva.com/brand/join?token=PTENIT_CANVA_PRO_INVITE_2026",
    licenseKey: "CANVA-VIP-PRO-TEAM-2026"
  },
  {
    id: "dp-1",
    title: "ফুল স্ট্যাক লারাভেল ও রিঅ্যাক্ট মাল্টি-ভেন্ডার ই-কমার্স সোর্স কোড",
    category: "Source Code Script",
    price: 3500,
    originalPrice: 7000,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    shortDescription: "বিকাশ/নগদ পেমেন্ট গেটওয়ে, অ্যাডমিন প্যানেল ও ইনভেন্টরি সহ সম্পূর্ণ প্রস্তুত ই-কমার্স পোর্টাল সোর্স কোড।",
    fullDescription: "এই ডিজিটাল সোর্স কোডটিতে রয়েছে সম্পূর্ণ প্রস্তুত লারাভেল ১০ ব্যাকএন্ড এবং রিঅ্যাক্ট ১৮ ফ্রন্টএন্ড। সাথে মোবাইল ফ্রেন্ডলি রেসপন্সিভ ডিজাইন, অটো বিকাশ ও নগদ পেমেন্ট গেটওয়ে, ইনভয়েস জেনারেটর এবং মাল্টি-ভেন্ডার ড্যাশবোর্ড। নাম, ইমেইল ও হোয়াটসঅ্যাপ নম্বর দিয়ে পেমেন্ট সম্পন্ন করলে ভেরিফিকেশনের পর সিকিউর ডাউনলোড লিংক পাবেন।",
    deliveryType: "file_download",
    fileFormat: "ZIP Script",
    fileSize: "85 MB",
    rating: 5.0,
    reviewsCount: 64,
    salesCount: 182,
    features: ["বিকাশ ও নগদ ইনটিগ্রেশন", "ইনভেন্টরি ও স্টক ম্যানেজমেন্ট", "ইমেইল ইনভয়েস জেনারেটর", "লাইফটাইম আপডেট ও সাপোর্ট"],
    downloadUrl: "https://drive.google.com/file/d/ptenit-ecommerce-source-v2/view?usp=sharing",
    licenseKey: "PTENIT-ECOM-2026-LNK98"
  },
  {
    id: "dp-2",
    title: "SaaS এআই চ্যাটবট ও অ্যাসিস্ট্যান্ট ওয়েব অ্যাপ (Next.js & Gemini API)",
    category: "AI SaaS Script",
    price: 4900,
    originalPrice: 9500,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    shortDescription: "গুগল জেমিনাই এআই দ্বারা চালিত অটোমেটেড এআই রাইটিং, চ্যাটবট ও ইমেজ জেনারেটর SaaS স্কিপ্ট।",
    fullDescription: "Next.js 14 এবং Tailwind CSS দিয়ে তৈরি আল্ট্রা-ফাস্ট এআই চ্যাটবট ও কনটেন্ট রাইটার SaaS ওয়েব অ্যাপ। সাবস্ক্রিপশন প্ল্যান (বিকাশ/স্ট্রাইপ) এবং লাইভ এআই চ্যাট সাপোর্ট ইনক্লুডেড। পেমেন্ট ভেরিফাই হওয়ার পর সুরক্ষিত ফাইল ডাউনলোড টোকেন পাওয়া যাবে।",
    deliveryType: "file_download",
    fileFormat: "ZIP Source",
    fileSize: "32 MB",
    rating: 4.9,
    reviewsCount: 42,
    salesCount: 124,
    features: ["Gemini 1.5 & Flash API", "সাবস্ক্রিপশন ও ক্রেডিট সিস্টেম", "রেসপন্সিভ রিঅ্যাক্ট ইউআই", "অটো সিকিউর ডাউনলোড"],
    downloadUrl: "https://drive.google.com/file/d/ptenit-ai-chatbot-saas/view?usp=sharing",
    licenseKey: "PTENIT-AICHAT-9982-KEY"
  },
  {
    id: "dp-3",
    title: "স্কুল, কলেজ ও হসপিটাল ইআরপি ম্যানেজমেন্ট সফটওয়্যার সোর্স কোড",
    category: "ERP Software",
    price: 7500,
    originalPrice: 15000,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    shortDescription: "স্টুডেন্ট/পেশেন্ট ফি, অনলাইন টিচার ড্যাশবোর্ড, রসিদ ও অটো এসএমএস অ্যালার্ট সহ ফুল সফটওয়্যার।",
    fullDescription: "স্কুল, কলেজ বা হসপিটাল অটোমেশনের জন্য অল-ইন-ওয়ান ক্লাউড ইআরপি সিস্টেম। পেমেন্ট শেষে অ্যাডমিন প্যানেল থেকে কাস্টমারের হোয়াটসঅ্যাপ ও ইমেইলে সরাসরি কাস্টমাইজড মেসেজ সহ এক্সেস লিঙ্ক ও ফাইল ডেলিভারি প্রদান করা হবে।",
    deliveryType: "email_whatsapp",
    fileFormat: "ZIP & MySQL",
    fileSize: "140 MB",
    rating: 5.0,
    reviewsCount: 29,
    salesCount: 88,
    features: ["স্টুডেন্ট ও পেশেন্ট রেকর্ড", "বিকাশ অ্যাকাউন্ট ফি পেমেন্ট", "এসএমএস নোটিফিকেশন গেটওয়ে", "অ্যাডমিন হোয়াটসঅ্যাপ ও ইমেইল ডেলিভারি"],
    downloadUrl: "https://drive.google.com/file/d/ptenit-erp-school-hospital/view?usp=sharing",
    licenseKey: "PTENIT-ERP-OFFICIAL-LICENSE"
  },
  {
    id: "dp-4",
    title: "ডিজিটাল মার্কেটিং বাল্ক এসএমএস ও ইমেইল অটোমেশন টুল (লাইফটাইম)",
    category: "Marketing Automation",
    price: 0,
    originalPrice: 4000,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    shortDescription: "এক ক্লিকে হাজার হাজার বাল্ক এসএমএস ও টার্গেটেড ইমেইল পাঠানোর সিকিউর ডেস্কটপ ও ওয়েব টুল।",
    fullDescription: "ফেসবুক, গুগোল ও কাস্টমার লিড গ্রুপে বাল্ক মেসেজিং অটোমেশন টুল। ১০০% ডেলিভারি রেট, প্রক্সি ফিল্টার এবং লাইফটাইম অফিসিয়াল লাইসেন্স কি ইন্সট্যান্ট বিনামূল্যে দেওয়া হচ্ছে।",
    deliveryType: "auto",
    fileFormat: "EXE Setup & Key",
    fileSize: "18 MB",
    rating: 4.9,
    reviewsCount: 88,
    salesCount: 310,
    features: ["১ ক্লিকে বাল্ক এসএমএস সেন্ডিং", "ইমেইল টেমপ্লেট মেকার", "লাইফটাইম অফিশিয়াল কি", "বিনামূল্যে ইনস্ট্যান্ট ড্রাইভ ফাইল"],
    downloadUrl: "https://drive.google.com/file/d/ptenit-marketing-automation/view?usp=sharing",
    licenseKey: "PTENIT-FREE-AUTO-MARKETING-KEY"
  },
  {
    id: "dp-5",
    title: "১০০+ প্রিমিয়াম অ্যান্ড্রয়েড অ্যাপ ও ওয়েবসাইট UI/UX ডিজাইন বান্ডেল (Figma)",
    category: "UI/UX Assets",
    price: 0,
    originalPrice: 2500,
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    shortDescription: "ই-কমার্স, রাইড শেয়ারিং, কোর্স পোর্টাল ও সোশ্যাল অ্যাপের ১০০+ ফিগমা সোর্স ফাইল ও ভেক্টর কিট।",
    fullDescription: "ডিজাইনার ও ডেভেলপারদের জন্য মেগা ইউআই বান্ডেল। ১০০+ প্রিমিয়াম স্ক্রিন, কাস্টম ইল্যাস্ট্রেশন, ভেক্টর আইকন ও ফিগমা এক্সেস সম্পূর্ণ বিনামূল্যে ডাউনলোডের সুযোগ।",
    deliveryType: "auto",
    fileFormat: "Figma Cloud & Assets",
    fileSize: "120 MB",
    rating: 5.0,
    reviewsCount: 112,
    salesCount: 450,
    features: ["১০০+ কমপ্লিট ইউআই স্ক্রিন", "১০০% কাস্টমাইজেবল ফিগমা", "ভেক্টর ইল্যাস্ট্রেশন ফাইল", "১-ক্লিকে ফ্রি ডাউনলোড"],
    downloadUrl: "https://drive.google.com/file/d/ptenit-figma-uiux-bundle/view?usp=sharing",
    licenseKey: "PTENIT-FREE-FIGMA-UIKIT-ACCESS"
  }
];

export const initialLiveSessions: LiveClassSession[] = [
  {
    id: "live-canva-1",
    courseId: "c-canva",
    courseTitle: "Canva দিয়ে প্রফেশনাল গ্রাফিক্স ডিজাইন",
    instructorName: "শামীম আহমেদ",
    topic: "ক্যানভা সোশ্যাল মিডিয়া পোস্ট ডিজাইন ও ব্রান্ডিং কিট লাইভ প্র্যাকটিস",
    moduleNo: "০১",
    moduleTitle: "ক্যানভা পরিচিতি ও ইন্টারফেস",
    lessonNo: "০৩",
    lessonTitle: "সোশ্যাল মিডিয়া ব্যানার ডিজাইন",
    serialNo: "০৩",
    date: "2026-09-01",
    time: "20:00",
    durationMinutes: 90,
    meetLink: "https://meet.google.com/canva-live-2026",
    platform: "google_meet",
    note: "ক্লাসের জন্য ক্যানভা ফ্রি/প্রো অ্যাকাউন্ট রেডি রাখবেন।",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-01T10:00:00.000Z"
  },
  {
    id: "live-pte-1",
    courseId: "c-pte-basic",
    courseTitle: "PTE Academic Crash Course for Beginners",
    instructorName: "মুহাম্মাদ রেজওয়ান",
    topic: "PTE Speaking Read Aloud & Repeat Sentence Masterclass",
    moduleNo: "০১",
    moduleTitle: "Speaking Section Breakdown",
    lessonNo: "০১",
    lessonTitle: "Read Aloud Scoring Strategy",
    serialNo: "০১",
    date: "2026-09-02",
    time: "20:30",
    durationMinutes: 90,
    meetLink: "https://meet.google.com/pte-live-speaking",
    platform: "google_meet",
    note: "মাইক্রোফোন টেস্ট করে ক্লাসে জয়েন করবেন।",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-01T11:00:00.000Z"
  },
  {
    id: "live-wp-1",
    courseId: "c-wp",
    courseTitle: "WordPress ও WooCommerce ই-কমার্স ডেভেলপমেন্ট",
    instructorName: "শামীম আহমেদ",
    topic: "উ-কমার্স স্টোর সেটআপ ও বিকাশ/নগদ গেটওয়ে ইন্টিগ্রেশন হ্যান্ডস-অন",
    moduleNo: "০২",
    moduleTitle: "WooCommerce Advanced Setup",
    lessonNo: "০২",
    lessonTitle: "Payment Gateway Integration",
    serialNo: "০৪",
    date: "2026-09-03",
    time: "21:00",
    durationMinutes: 90,
    meetLink: "https://meet.google.com/wp-live-ecommerce",
    platform: "google_meet",
    note: "লোকালহোস্ট অথবা সিপ্যানেল ওপেন রাখবেন।",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-09-01T12:00:00.000Z"
  }
];



