import { services } from '../../src/data/services';
import { galleryItems } from '../../src/data/gallery';
import { caseStudies } from '../../src/data/caseStudies';
import { teamMembers } from '../../src/data/team';
import { siteConfig } from '../../src/config/site';
import { allRoutes, documentTitle } from '../../src/seo/meta';

/** Returns a list of human-readable problems. An empty list means the content is consistent. */
export function contentProblems(): string[] {
  const problems: string[] = [];
  const dups = (items: string[]) => items.filter((v, i) => items.indexOf(v) !== i);

  const slugs = services.map((s) => s.slug);
  for (const d of dups(slugs)) problems.push(`duplicate service slug: ${d}`);
  const known = new Set(slugs);

  for (const s of services) {
    for (const r of s.relatedServices) if (!known.has(r)) problems.push(`service ${s.slug}: unknown related service "${r}"`);
    if (!s.image || !s.imageAlt) problems.push(`service ${s.slug}: missing image or alt text`);
    if (s.priceFrom !== null && s.priceFrom < 0) problems.push(`service ${s.slug}: negative price`);
  }
  for (const t of teamMembers) for (const x of t.services) if (!known.has(x)) problems.push(`team ${t.slug}: unknown service "${x}"`);
  for (const c of caseStudies) for (const x of c.services) if (!known.has(x)) problems.push(`case study ${c.slug}: unknown service "${x}"`);
  for (const d of dups(galleryItems.map((g) => g.slug))) problems.push(`duplicate gallery slug: ${d}`);
  for (const g of galleryItems) if (!g.imageAlt) problems.push(`gallery ${g.slug}: missing alt text`);

  if (!siteConfig.url.startsWith('https://') || siteConfig.url.includes('example.')) problems.push(`siteConfig.url looks wrong: ${siteConfig.url}`);

  const routes = allRoutes();
  for (const d of dups(routes.map((r) => r.path))) problems.push(`duplicate route: ${d}`);
  const titles = new Map<string, string>();
  for (const { path, meta } of routes) {
    const title = documentTitle(meta);
    if (title.length > 70) problems.push(`${path}: title is ${title.length} characters (max 70)`);
    if (meta.description.length < 40 || meta.description.length > 200) problems.push(`${path}: description is ${meta.description.length} characters (want 40-200)`);
    const clash = titles.get(title);
    if (clash && !meta.noindex) problems.push(`${path}: same title as ${clash}`);
    titles.set(title, path);
  }
  return problems;
}

/** Owner-supplied business details that are still missing. These are hidden from the site, never invented. */
export function launchGaps(): string[] {
  const gaps: string[] = [];
  const { contact, location, openingHours, features } = siteConfig;
  if (!contact.email) gaps.push('contact.email (public contact email address)');
  if (!contact.telephone) gaps.push('contact.telephone (public phone number)');
  if (!location.streetAddress || !location.locality || !location.postcode) gaps.push('location address (street, town/city, postcode)');
  if (!openingHours) gaps.push('openingHours (verified opening hours)');
  if (!location.mapEmbedUrl) gaps.push('location.mapEmbedUrl (optional: Google Maps embed link)');
  if (!siteConfig.legalName) gaps.push('legalName (registered business name, for the privacy notice)');
  if (!features.team) gaps.push('features.team (real staff names, photos and bios; currently hidden)');
  if (!features.testimonials) gaps.push('features.testimonials (real, sourced customer reviews; currently hidden)');
  if (!features.promotions) gaps.push('features.promotions (real offers; currently hidden)');
  if (!siteConfig.turnstileSiteKey) gaps.push('turnstileSiteKey (optional: stronger spam protection on the forms)');
  return gaps;
}
