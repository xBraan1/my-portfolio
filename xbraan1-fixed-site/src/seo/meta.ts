import { siteConfig, hasAddress } from '../config/site';
import { services, getServiceBySlug } from '../data/services';
import { galleryItems, getGalleryItemBySlug } from '../data/gallery';
import { caseStudies, getCaseStudyBySlug } from '../data/caseStudies';
import { teamMembers, getTeamMemberBySlug } from '../data/team';

export interface RouteMeta {
  /** Page title without the brand suffix (unless `fullTitle`). */
  title: string;
  description: string;
  noindex?: boolean;
  /** Use `title` exactly as written (home page). */
  fullTitle?: boolean;
}

export const BRAND = siteConfig.name;

export function documentTitle(meta: Pick<RouteMeta, 'title' | 'fullTitle'>): string {
  return meta.fullTitle ? meta.title : `${meta.title} | ${BRAND}`;
}

export function canonicalUrl(path: string): string {
  const clean = path === '/' ? '/' : path.replace(/\/+$/, '');
  return `${siteConfig.url}${clean}`;
}

const trim = (s: string, max = 158) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

function staticMeta(): Record<string, RouteMeta> {
  const located = hasAddress();
  const table: Record<string, RouteMeta> = {
    '/': { title: `${BRAND} — ${siteConfig.tagline}`, fullTitle: true, description: siteConfig.description },
    '/salon': { title: "Women's Salon", description: "Cuts, styling, colour, braiding, extensions and treatments at xBraan1's women's salon. See services and prices, then request an appointment." },
    '/barber': { title: "Men's Barbering", description: 'Fades, tapers, beard trims, shaves and haircuts at xBraan1. See barbering services and prices, then request an appointment.' },
    '/services': { title: 'All Services', description: 'Browse every xBraan1 service, from cuts and colour to braids, extensions, barbering and treatments.' },
    '/pricing': { title: 'Prices', description: 'Guide prices for xBraan1 services. Final prices depend on hair length, density and complexity and are confirmed at your consultation.' },
    '/booking': { title: 'Request an Appointment', description: 'Send an appointment request to xBraan1. Choose a service and a preferred date and time, and we will contact you to confirm.' },
    '/booking/confirmation': { title: 'Appointment request sent', description: 'Your appointment request has been sent to xBraan1.', noindex: true },
    '/gallery': { title: 'Style Gallery', description: 'Style inspiration: fades, braids, colour, natural hair, beards and more. Images are reference examples, not xBraan1 client work.' },
    '/about': { title: 'About', description: 'About xBraan1, a salon and barbershop offering cuts, colour, braids, styling and grooming.' },
    '/case-studies': { title: 'Transformations', description: 'Illustrative transformation stories showing how a consultation, cut, colour or style plan comes together.' },
    '/contact': { title: 'Contact', description: 'Send xBraan1 a message with your question or enquiry.' },
    '/contact/thank-you': { title: 'Message sent', description: 'Your message has been sent to xBraan1. We will reply by email.', noindex: true },
    '/location': { title: 'Location & Opening Hours', description: located ? 'Find xBraan1: address, opening hours and how to get here.' : 'Location and opening hours for xBraan1. Contact us to check before you visit.' },
    '/faq': { title: 'FAQ', description: 'Answers to common questions about appointments, services, preparation and aftercare at xBraan1.' },
    '/preparation': { title: 'Preparation & Aftercare', description: 'How to prepare for your appointment and how to look after your hair afterwards.' },
    '/policies': { title: 'Booking & Cancellation Policy', description: 'xBraan1 booking, cancellation, late-arrival and refund policies.' },
    '/privacy': { title: 'Privacy Policy', description: 'How xBraan1 collects, uses and protects personal data.' },
    '/terms': { title: 'Terms of Service', description: 'Terms for using the xBraan1 website and requesting appointments.' },
    '/cookies': { title: 'Cookies & Local Storage', description: 'What xBraan1 stores on your device, and why.' },
    '/accessibility': { title: 'Accessibility Statement', description: 'How accessible the xBraan1 website is, known limitations and how to ask for help.' },
  };
  if (siteConfig.features.promotions) table['/promotions'] = { title: 'Offers', description: 'Current offers at xBraan1.' };
  if (siteConfig.features.team) table['/team'] = { title: 'Our Team', description: 'Meet the xBraan1 team.' };
  return table;
}

const normalise = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

export function getRouteMeta(pathname: string): RouteMeta | null {
  const path = normalise(pathname);
  const fixed = staticMeta()[path];
  if (fixed) return fixed;

  let m: RegExpExecArray | null;
  if ((m = /^\/services\/([^/]+)$/.exec(path))) {
    const s = getServiceBySlug(m[1]);
    return s ? { title: s.name, description: trim(s.description) } : null;
  }
  if ((m = /^\/gallery\/([^/]+)$/.exec(path))) {
    const g = getGalleryItemBySlug(m[1]);
    return g ? { title: g.title, description: trim(`${g.description} Reference image, not xBraan1 client work.`) } : null;
  }
  if ((m = /^\/case-studies\/([^/]+)$/.exec(path))) {
    const c = getCaseStudyBySlug(m[1]);
    return c ? { title: c.title, description: trim(`${c.subtitle.replace(/\.$/, '')}. An illustrative sample story.`) } : null;
  }
  if (siteConfig.features.team && (m = /^\/team\/([^/]+)$/.exec(path))) {
    const t = getTeamMemberBySlug(m[1]);
    return t ? { title: t.name, description: trim(t.bio) } : null;
  }
  return null;
}

/** Every real route, with metadata. Used by the build to prerender pages, the sitemap and llms.txt. */
export function allRoutes(): { path: string; meta: RouteMeta }[] {
  const paths = [
    ...Object.keys(staticMeta()),
    ...services.map((s) => `/services/${s.slug}`),
    ...galleryItems.map((g) => `/gallery/${g.slug}`),
    ...caseStudies.map((c) => `/case-studies/${c.slug}`),
    ...(siteConfig.features.team ? teamMembers.map((t) => `/team/${t.slug}`) : []),
  ];
  return paths.flatMap((path) => {
    const meta = getRouteMeta(path);
    return meta ? [{ path, meta }] : [];
  });
}
