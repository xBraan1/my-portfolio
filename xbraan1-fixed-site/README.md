# xBraan1 website

Website for xBraan1, a salon and barbershop: https://xbraan1.co.uk

- **Front end:** React 18, TypeScript (strict), Vite, Tailwind CSS v4, React Router (clean URLs).
- **Back end:** one Cloudflare Worker (`worker/index.ts`) that serves the built site and handles the two forms at `/api/contact` and `/api/booking`.
- **Storage:** Cloudflare D1 database `xbraan1-submissions` (table `submissions`). Entries are deleted automatically after 12 months.
- **Hosting:** Cloudflare Workers with static assets (config in `wrangler.toml`).

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install exact dependency versions |
| `npm run dev` | Start the site locally (forms will not work here; they need the Worker) |
| `npm run dev:worker` | Build, then run the site **and** the forms API locally on the real Workers runtime (`npm run db:migrate:local` once first) |
| `npm run lint` / `npm run typecheck` / `npm test` | Code quality checks |
| `npm run validate` | Checks that services, gallery, team and case studies reference each other correctly |
| `npm run check:launch` | Lists business details still missing from `src/config/site.ts` |
| `npm run build` | Typecheck, build, then generate one HTML file per page, `sitemap.xml`, `robots.txt`, `llms.txt` and `404.html` |
| `npm run deploy` | Build and deploy with Wrangler (normally Cloudflare deploys from GitHub for you) |

## Where things live

- `src/config/site.ts` is the **single place for business details** (address, phone, email, hours, whether the team/offers/reviews sections are shown). Anything left `null` is hidden, never invented.
- `src/data/` holds services, gallery, case studies, team, testimonials and promotions.
- `src/seo/` generates titles, descriptions, canonical URLs, Open Graph tags and structured data for every page (used by the browser and by the build).
- `shared/forms.ts` is the form validation used by both the browser and the Worker.
- `public/_headers` sets the security headers (CSP and friends).
- `docs/OWNER_TODO.md` is the checklist of things only the owner can do. `docs/DEPLOYMENT.md` explains releases. `docs/AUDIT_FIXES.md` maps each audit finding to its fix.

All rights reserved unless a licence file says otherwise.
