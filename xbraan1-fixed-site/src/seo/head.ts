import { siteConfig } from '../config/site';
import { RouteMeta, canonicalUrl, documentTitle } from './meta';
import { localBusinessSchema } from './jsonld';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface HeadModel {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex: boolean;
  jsonLd: Record<string, unknown> | null;
}

export function headModel(meta: RouteMeta, path: string): HeadModel {
  return {
    title: documentTitle(meta),
    description: meta.description,
    canonical: canonicalUrl(path),
    image: `${siteConfig.url}/og-image.png`,
    noindex: Boolean(meta.noindex),
    jsonLd: path === '/' ? localBusinessSchema() : null,
  };
}

/** Static-HTML equivalent of <SEO/>. Tags carry data-rh so react-helmet-async replaces them instead of duplicating. */
export function headTags(model: HeadModel): string {
  const t = [
    `<meta data-rh="true" name="description" content="${esc(model.description)}">`,
    `<link data-rh="true" rel="canonical" href="${esc(model.canonical)}">`,
    `<meta data-rh="true" name="robots" content="${model.noindex ? 'noindex, nofollow' : 'index, follow'}">`,
    `<meta data-rh="true" property="og:type" content="website">`,
    `<meta data-rh="true" property="og:site_name" content="${esc(siteConfig.name)}">`,
    `<meta data-rh="true" property="og:locale" content="en_GB">`,
    `<meta data-rh="true" property="og:title" content="${esc(model.title)}">`,
    `<meta data-rh="true" property="og:description" content="${esc(model.description)}">`,
    `<meta data-rh="true" property="og:url" content="${esc(model.canonical)}">`,
    `<meta data-rh="true" property="og:image" content="${esc(model.image)}">`,
    `<meta data-rh="true" property="og:image:width" content="1200">`,
    `<meta data-rh="true" property="og:image:height" content="630">`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image">`,
    `<meta data-rh="true" name="twitter:title" content="${esc(model.title)}">`,
    `<meta data-rh="true" name="twitter:description" content="${esc(model.description)}">`,
    `<meta data-rh="true" name="twitter:image" content="${esc(model.image)}">`,
  ];
  if (model.jsonLd) t.push(`<script data-rh="true" type="application/ld+json">${JSON.stringify(model.jsonLd).replace(/</g, '\\u003c')}</script>`);
  return t.join('\n    ');
}
