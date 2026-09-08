import { Service, Testimonial } from '../types';

export function getLocalizedService(service: Service, _lang?: string): Service {
  return service;
}

export function getLocalizedTestimonial(testimonial: Testimonial, _lang?: string): Testimonial {
  return testimonial;
}
