/**
 * Runs after `vite build`. Turns the single app shell into one HTML file per route so that
 *  - every page has its own <title>, description, canonical URL, Open Graph tags and structured data
 *    before any JavaScript runs (search engines and link previews read this), and
 *  - unknown URLs get a real 404 status via dist/404.html.
 * Also writes sitemap.xml, robots.txt and llms.txt from the same route list.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { siteConfig } from '../src/config/site';
import { allRoutes, canonicalUrl, documentTitle } from '../src/seo/meta';
import { headModel, headTags } from '../src/seo/head';
import { services } from '../src/data/services';

const DIST = join(process.cwd(), 'dist');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
for (const marker of ['<!--seo-head-->', '<!--noscript-->', '<!--font-preload-->']) {
  if (!shell.includes(marker)) throw new Error(`dist/index.html is missing the ${marker} marker`);
}

// Preload the Latin font files so text renders in the right font immediately.
const assets = readdirSync(join(DIST, 'assets'));
const fontFiles = assets.filter((f) => /^(inter|playfair-display)-latin-wght-normal-.*\.woff2$/.test(f));
const preload = fontFiles
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ');

function noscript(title: string, description: string): string {
  const { contact } = siteConfig;
  const nav = [
    ['/', 'Home'], ['/salon', "Women's Salon"], ['/barber', "Men's Barbering"], ['/services', 'All services'],
    ['/pricing', 'Prices'], ['/gallery', 'Style gallery'], ['/booking', 'Request an appointment'], ['/contact', 'Contact'], ['/location', 'Location'],
  ];
  return `<noscript>
      <main>
        <h1>${esc(title)}</h1>
        <p>${esc(description)}</p>
        <p>This website needs JavaScript to show service details and to send appointment requests.${contact.telephone ? ` You can call us on ${esc(contact.telephone)}.` : ''}${contact.email ? ` You can email ${esc(contact.email)}.` : ''}</p>
        <nav aria-label="Main">
          <ul>${nav.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
        </nav>
      </main>
    </noscript>`;
}

function render(path: string, title: string, description: string, tags: string): string {
  return shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace('<!--font-preload-->', preload)
    .replace('<!--seo-head-->', tags)
    .replace('<!--noscript-->', noscript(title.replace(/ \| xBraan1$/, ''), description));
}

function fileFor(path: string): string {
  return path === '/' ? join(DIST, 'index.html') : join(DIST, `${path.slice(1)}.html`);
}

const routes = allRoutes();
for (const { path, meta } of routes) {
  const model = headModel(meta, path);
  const html = render(path, model.title, model.description, headTags(model));
  const file = fileFor(path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// 404 page: the app shell (so the router can show its Not Found screen) with noindex and no canonical.
{
  const title = `Page not found | ${siteConfig.name}`;
  const description = 'This page could not be found.';
  const tags = `<meta data-rh="true" name="robots" content="noindex, nofollow">\n    <meta data-rh="true" name="description" content="${esc(description)}">`;
  writeFileSync(join(DIST, '404.html'), render('/404', title, description, tags));
}

// Sitemap (only indexable pages). lastmod is the date of the commit being deployed, when git can tell us.
let lastmod = '';
try {
  lastmod = execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
} catch {
  /* not a git checkout: omit lastmod rather than guess */
}
const urls = routes.filter((r) => !r.meta.noindex).map((r) => `  <url><loc>${canonicalUrl(r.path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /booking/confirmation\nDisallow: /contact/thank-you\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`,
);

// llms.txt: a plain-text summary for AI assistants, generated from the same data as the site.
const byCategory = (cat: string) => services.filter((s) => s.category === cat || s.category === 'both');
const list = (items: typeof services) => items.map((s) => `- [${s.name}](${canonicalUrl(`/services/${s.slug}`)})`).join('\n');
writeFileSync(
  join(DIST, 'llms.txt'),
  `# ${siteConfig.name}\n\n> ${siteConfig.description}\n\nWebsite: ${siteConfig.url}\n\n## Notes\n- Prices on the site are guide ("from") prices in GBP; the final price is confirmed at consultation.\n- The appointment form sends a request; it is not a confirmed booking.\n- Photos in the gallery are reference images, not photographs of the salon's clients.\n\n## Main pages\n${routes.filter((r) => !r.meta.noindex && r.path.split('/').length <= 2).map((r) => `- [${documentTitle(r.meta)}](${canonicalUrl(r.path)}): ${r.meta.description}`).join('\n')}\n\n## Women's salon services\n${list(byCategory('salon'))}\n\n## Barbering services\n${list(byCategory('barber'))}\n`,
);

console.log(`postbuild: ${routes.length} pages, 404.html, sitemap.xml (${urls.length} URLs), robots.txt, llms.txt, ${fontFiles.length} font preloads`);
