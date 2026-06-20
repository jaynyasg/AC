/**
 * Curated, REAL customer testimonials. Site-only content. Empty until John
 * supplies real, permission-to-publish quotes — until then the page shows an
 * honest empty-state. Never invent testimonials (hard rule: no fabricated
 * social proof). Live ratings are funneled to Google via the review CTA.
 */
export type Testimonial = {
  quote: string;
  name: string;
  location?: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [];
