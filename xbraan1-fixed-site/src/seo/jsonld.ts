import { siteConfig, weekdays, hasAddress } from '../config/site';

const DAY_NAMES: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

/** "09:00 - 18:00" -> { opens, closes }. Returns null for "Closed" or unparseable values. */
export function parseHours(value: string): { opens: string; closes: string } | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*$/.exec(value);
  if (!m) return null;
  const pad = (n: string) => n.padStart(2, '0');
  return { opens: `${pad(m[1])}:${m[2]}`, closes: `${pad(m[3])}:${m[4]}` };
}

/** Business structured data. Only includes details that have actually been configured. */
export function localBusinessSchema(): Record<string, unknown> {
  const { contact, location, openingHours, social } = siteConfig;
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.png`,
  };
  if (contact.telephone) data.telephone = contact.telephone;
  if (contact.email) data.email = contact.email;
  if (hasAddress()) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: location.streetAddress,
      addressLocality: location.locality,
      postalCode: location.postcode,
      addressCountry: 'GB',
    };
  }
  if (location.coordinates) {
    data.geo = { '@type': 'GeoCoordinates', latitude: location.coordinates.lat, longitude: location.coordinates.lng };
  }
  if (openingHours) {
    const spec = weekdays.flatMap((day) => {
      const h = parseHours(openingHours[day]);
      return h ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DAY_NAMES[day], opens: h.opens, closes: h.closes }] : [];
    });
    if (spec.length) data.openingHoursSpecification = spec;
  }
  const sameAs = Object.values(social).filter((v): v is string => Boolean(v));
  if (sameAs.length) data.sameAs = sameAs;
  return data;
}

export function breadcrumbSchema(items: { label: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteConfig.url}/` },
      ...items.map((item, i) => ({ '@type': 'ListItem', position: i + 2, name: item.label, item: `${siteConfig.url}${item.path}` })),
    ],
  };
}
