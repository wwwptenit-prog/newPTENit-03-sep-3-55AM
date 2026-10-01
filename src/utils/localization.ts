import { Service, Testimonial } from '../types';

export function getLocalizedService(service: Service, _lang?: string): Service {
  return service;
}

export function getLocalizedTestimonial(testimonial: Testimonial, _lang?: string): Testimonial {
  return testimonial;
}

export function toEnglishDigits(str: number | string | undefined | null): string {
  if (str === undefined || str === null) return '';
  const banglaDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  return String(str).replace(/[০-৯]/g, (d) => banglaDigits[d] || d);
}

export function parseBengaliOrEnglishNumber(val: any): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  if (!str) return 0;
  const normalized = toEnglishDigits(str).replace(/[^\d.-]/g, '');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

export function toBengaliDigits(num: number | string): string {
  if (num === undefined || num === null) return '০';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
}
