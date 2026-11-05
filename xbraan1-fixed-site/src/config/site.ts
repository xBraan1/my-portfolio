export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type OpeningHours = Record<Weekday, string>;

/**
 * Single source of truth for business details.
 *
 * OWNER: anything left as `null` is hidden from the site, so nothing is invented.
 * Fill these in once you have confirmed them (see docs/OWNER_TODO.md), then run
 * `npm run check:launch` to see what is still missing.
 */
export const siteConfig = {
  name: 'xBraan1',
  /** Registered business name, if different (used in the privacy notice). */
  legalName: null as string | null,
  tagline: 'Premium Salon & Barbershop',
  description:
    'Haircuts, styling, colour, braiding and barbering at xBraan1. Browse services and prices, then send an appointment request online.',
  url: 'https://xbraan1.co.uk',
  locale: 'en-GB',
  currency: 'GBP',

  contact: {
    email: null as string | null,
    telephone: null as string | null, // e.g. '+44 1234 567890'
  },

  location: {
    streetAddress: null as string | null,
    locality: null as string | null,
    postcode: null as string | null,
    coordinates: null as { lat: number; lng: number } | null,
    /** Full https://www.google.com/maps/embed?pb=... URL from Google Maps > Share > Embed a map. */
    mapEmbedUrl: null as string | null,
    directions: null as string | null,
    parking: null as string | null,
    accessibility: null as string | null,
  },

  /** e.g. { monday: '09:00 - 18:00', ... 'sunday': 'Closed' }. Leave null until confirmed. */
  openingHours: null as OpeningHours | null,

  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },

  policies: {
    cancellationWindowHours: 24,
  },

  /** Sections that need verified, real content before they are shown. */
  features: {
    team: false,
    testimonials: false,
    promotions: false,
  },

  /** Cloudflare Turnstile site key (public). Leave null to use honeypot + rate limiting only. */
  turnstileSiteKey: null as string | null,
};

export const weekdays: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function hasAddress(): boolean {
  const l = siteConfig.location;
  return Boolean(l.streetAddress && l.locality && l.postcode);
}

export function formattedAddress(): string | null {
  const l = siteConfig.location;
  if (!hasAddress()) return null;
  return [l.streetAddress, l.locality, l.postcode].filter(Boolean).join(', ');
}
