export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Where the review came from, e.g. 'Google review, March 2026'. Required: no unsourced reviews. */
  source: string;
}

/**
 * OWNER: only add real reviews from real customers, with their permission and the original source.
 * Invented or edited-for-effect reviews are unlawful in the UK (Digital Markets, Competition and
 * Consumers Act 2024). Then set `features.testimonials` to true in src/config/site.ts.
 */
export const testimonials: Testimonial[] = [];
