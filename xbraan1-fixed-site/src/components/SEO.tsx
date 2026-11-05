import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/site';
import { RouteMeta } from '../seo/meta';
import { headModel } from '../seo/head';

interface SEOProps {
  meta: RouteMeta;
  path: string;
}

/** Keeps <title>, description, canonical, Open Graph and structured data in step with the current route. */
export default function SEO({ meta, path }: SEOProps) {
  const m = headModel(meta, path);
  return (
    <Helmet>
      <html lang={siteConfig.locale} />
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={m.canonical} />
      <meta name="robots" content={m.noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={m.canonical} />
      <meta property="og:image" content={m.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
      <meta name="twitter:image" content={m.image} />
      {m.jsonLd && <script type="application/ld+json">{JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>}
    </Helmet>
  );
}
