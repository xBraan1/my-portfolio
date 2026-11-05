import { describe, expect, it } from 'vitest';
import { allRoutes, canonicalUrl, documentTitle, getRouteMeta } from '../src/seo/meta';
import { headModel, headTags } from '../src/seo/head';
import { localBusinessSchema, parseHours } from '../src/seo/jsonld';
import { siteConfig } from '../src/config/site';

describe('route metadata', () => {
  const routes = allRoutes();

  it('covers every static page and every data-driven detail page', () => {
    const paths = new Set(routes.map((r) => r.path));
    for (const p of ['/', '/salon', '/barber', '/services', '/pricing', '/booking', '/gallery', '/contact', '/location', '/privacy', '/terms', '/cookies', '/accessibility']) {
      expect(paths.has(p), p).toBe(true);
    }
    expect(routes.filter((r) => r.path.startsWith('/services/')).length).toBeGreaterThan(80);
  });

  it('hides features that are switched off', () => {
    expect(siteConfig.features.team).toBe(false);
    expect(getRouteMeta('/team')).toBeNull();
    expect(routes.some((r) => r.path.startsWith('/team'))).toBe(false);
    expect(getRouteMeta('/promotions')).toBeNull();
  });

  it('normalises trailing slashes and rejects unknown paths', () => {
    expect(getRouteMeta('/services/')?.title).toBe('All Services');
    expect(getRouteMeta('/not-a-page')).toBeNull();
    expect(getRouteMeta('/services/not-a-service')).toBeNull();
  });

  it('builds canonical URLs on the real domain', () => {
    expect(canonicalUrl('/')).toBe('https://xbraan1.co.uk/');
    expect(canonicalUrl('/services/')).toBe('https://xbraan1.co.uk/services');
    expect(JSON.stringify(routes)).not.toContain('example.com');
  });

  it('does not repeat the brand on the home page title', () => {
    expect(documentTitle(getRouteMeta('/')!)).toBe('xBraan1 — Premium Salon & Barbershop');
    expect(documentTitle(getRouteMeta('/pricing')!)).toBe('Prices | xBraan1');
  });

  it('marks utility pages noindex', () => {
    expect(getRouteMeta('/booking/confirmation')?.noindex).toBe(true);
    expect(getRouteMeta('/contact/thank-you')?.noindex).toBe(true);
    expect(getRouteMeta('/pricing')?.noindex).toBeFalsy();
  });
});

describe('static head tags', () => {
  it('include canonical, robots, Open Graph and data-rh markers', () => {
    const meta = getRouteMeta('/pricing')!;
    const tags = headTags(headModel(meta, '/pricing'));
    expect(tags).toContain('rel="canonical" href="https://xbraan1.co.uk/pricing"');
    expect(tags).toContain('content="index, follow"');
    expect(tags).toContain('property="og:image" content="https://xbraan1.co.uk/og-image.png"');
    expect(tags.match(/data-rh="true"/g)!.length).toBeGreaterThan(10);
  });
  it('escape HTML in descriptions', () => {
    const tags = headTags(headModel({ title: 'T', description: 'A "quoted" <b>bold</b> & more' }, '/x'));
    expect(tags).toContain('&quot;quoted&quot; &lt;b&gt;bold&lt;/b&gt; &amp; more');
  });
});

describe('structured data', () => {
  it('only contains details that have been configured', () => {
    const schema = localBusinessSchema();
    expect(schema['@type']).toBe('HairSalon');
    expect(schema.url).toBe('https://xbraan1.co.uk');
    expect(schema).not.toHaveProperty('telephone');
    expect(schema).not.toHaveProperty('address');
    expect(JSON.stringify(schema)).not.toMatch(/null|Your City|555/);
  });
  it('parses opening hours', () => {
    expect(parseHours('09:00 - 18:00')).toEqual({ opens: '09:00', closes: '18:00' });
    expect(parseHours('9:00–17:30')).toEqual({ opens: '09:00', closes: '17:30' });
    expect(parseHours('Closed')).toBeNull();
  });
});
