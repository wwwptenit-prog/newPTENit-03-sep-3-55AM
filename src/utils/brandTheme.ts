// Official Brand System (PTENit + Dream71)
export const BRAND = {
  colors: {
    primaryGreen: '#006A4E',
    primaryGreenHover: '#006A4E',
    primaryRed: '#E31E24',
    primaryRedHover: '#E31E24',
    supportBlue: '#1E3A8A',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primaryText: '#111827',
    secondaryText: '#1E3A8A',
    border: '#F8FAFC',
  },
  typography: {
    heroTitle: 'text-5xl font-bold',
    pageTitle: 'text-4xl font-semibold',
    sectionTitle: 'text-3xl font-semibold',
    cardTitle: 'text-2xl font-semibold',
    subtitle: 'text-xl font-normal',
    body: 'text-base font-normal',
    small: 'text-sm font-normal',
    caption: 'text-xs font-normal',
  },
  buttons: {
    primary: 'bg-[#006A4E] text-white hover:bg-[#006A4E] rounded-xl px-6 py-3 font-semibold shadow-sm transition-all',
    cta: 'bg-[#E31E24] text-white hover:bg-[#E31E24] rounded-xl px-6 py-3 font-semibold shadow-sm transition-all',
    secondary: 'bg-white text-[#006A4E] border-2 border-[#006A4E] hover:bg-emerald-50 rounded-xl px-6 py-3 font-semibold transition-all',
  },
  cards: 'bg-white rounded-2xl shadow-sm border border-gray-200 p-6',
  inputs: 'rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#006A4E] focus:outline-none transition-all',
  badges: 'rounded-full px-3 py-1 text-xs font-semibold',
} as const;
