# Audit findings and what was done

IDs match the audit document (F-01 to F-48). "Needs you" means the code is ready but only the owner can supply the facts (see `OWNER_TODO.md`).
Everything marked Fixed was checked by the automated tests (38 unit tests), a 34-test browser suite run against the real Workers runtime, and a sweep of 149 page visits (see "How it was checked").

## Critical and high

- **F-01 Forms discarded everything** - **Fixed.** `/api/contact` and `/api/booking` (Worker) validate, rate-limit, store in D1 and return a reference. The browser shows success only after the server confirms; failures show an error and keep the visitor's text. Stored data was inspected: the IP address is kept only as a one-way hash.
- **F-02 Service catalogue collapsed** - **Fixed.** 90 services restored from the earlier version. The "500+ syntax errors" claimed in the old notes were wrong: that file compiled cleanly. It did contain 3 duplicate entries and 2 dangling references; both removed. `npm run validate` now fails the build on broken references. *Needs you:* check prices and descriptions.
- **F-03 Placeholder identity** - **Fixed in code; needs you.** Fake address, phone, email, map, hours and New York coordinates removed. Details come from `src/config/site.ts` and are hidden while empty.
- **F-04 Invented testimonials/staff/claims** - **Fixed in code; needs you.** Removed or switched off: three testimonials, the six staff profiles, "12+ years", "only professional-grade products", "satisfaction guaranteed - no questions asked", the 15% offer, and (found while fixing; not in the first audit) the statistics "10+ years", "5000+ happy clients" and "4.9 average rating".
- **F-05 Hash routing** - **Fixed.** Clean URLs. Every page is prerendered to its own HTML file with its own title, description, canonical and social tags; unknown URLs return a real 404.
- **F-06 example.com everywhere** - **Fixed.** One `siteConfig.url`; sitemap (178 URLs), robots.txt and llms.txt are generated at build; a 1200x630 share image and app icons were added.
- **F-07 Service worker froze the site** - **Fixed.** Replaced by a self-removing worker. Tested end to end: a returning visitor with the old cache-first worker and cache is cleaned up within seconds of the new deployment and then gets the new site.
- **F-08 Privacy/Terms placeholders** - **Improved; needs legal review.** Rewritten to match what the site actually does (forms, Cloudflare, hashed IP, Unsplash images, 12-month retention, no analytics, rights, ICO complaint route). Not legal advice.

## Medium

- **F-09 Fake payment options** - Fixed. Removed; the form says no payment is taken online.
- **F-10 Error boundary crashed** - Fixed. The fallback no longer depends on the router; a second boundary inside the layout keeps header/footer; recovers when you navigate. Tested by forcing a render error.
- **F-11 Blocked localStorage blanked the site** - Fixed. All storage access is guarded. Tested with storage throwing.
- **F-12 Image CSS bug** - Fixed. The two unlayered `img` rules were removed. 0 of 1,673 images now fail to fill their frame (was 100% of images tested).
- **F-13 Map blocked / wrong place** - Fixed. The map appears only when you supply an embed link; the CSP allows Google Maps embeds.
- **F-14 Weak CSP** - Fixed in config. `unsafe-eval` and inline scripts removed; `object-src`, `base-uri`, `form-action` added. *Verify the live header after deploying.*
- **F-15 COEP blocking images** - Fixed. COEP removed (it was not needed).
- **F-16 "Code protection"** - Fixed. Removed (right-click, shortcut and text-selection blocking).
- **F-17 Contrast** - Fixed. axe-core: 0 violations on all 27 page states tested, light and dark.
- **F-18 Payment option focus** - Fixed (field removed; global focus style now uses a theme-aware colour).
- **F-19 Form accessibility** - Fixed. Autocomplete, required/invalid/described-by wiring, focus moves to the first error, date minimum, length limits.
- **F-20 Search** - Fixed. Works on phones; arrow keys, Enter and Escape work; proper dialog; focus returns to the button.
- **F-21 Titles/metadata/announcements** - Fixed. 24 unique titles for 24 pages; page changes are announced and focus moves to the content.
- **F-22 Structured data** - Fixed. Only configured details are included.
- **F-23 Contradictions** - Fixed. Guarantee/offer/response-time claims removed.
- **F-24 US currency and wording** - Fixed. GBP formatting everywhere, `en-GB`, British spelling, US phrases removed. *Needs you:* the price numbers themselves are unchanged template values.
- **F-25 Cookie banner** - Fixed. Removed; the site sets no cookies (checked); the Cookies page describes the one local-storage item.
- **F-26 Bundle** - Fixed. framer-motion removed (CSS animation that respects reduced motion), routes load on demand, vendor chunks. First load of the home page is about 117 KB gzipped including CSS (was about 153 KB), with no third-party font requests.
- **F-27 Deployment confusion** - Fixed. One model (Worker + static assets + D1), one config, accurate docs; the 25 conflicting AI status reports were deleted.
- **F-28 No tests/lint/CI** - Fixed. ESLint (with accessibility rules), 38 unit tests, content validation, GitHub Actions workflow, Dependabot.
- **F-29 Third-party requests** - Partly. Fonts are now self-hosted (no Google requests). Photos still load from Unsplash and this is disclosed; replace with your own photos.

## Low and informational

- **F-30/F-31 Dependencies** - Fixed. Production dependencies: 0 known advisories (`npm audit --omit=dev`). React Router upgraded to v7, Vite patched, unused packages removed. Remaining advisories are in dev-only linting tools and do not ship to visitors.
- **F-32 Back-to-top covered** - Fixed (banner gone; tested).
- **F-33 Scroll restoration** - Fixed (tested: Back returns to the same scroll position).
- **F-34 Menu/nav semantics** - Fixed (aria-expanded/controls, Escape, current page, skip link; tested).
- **F-35 Admin/Account pages** - Fixed. Removed (they did nothing).
- **F-36 Visible developer copy** - Fixed.
- **F-37/F-38 Dead code and CSS hazards** - Fixed. Foldable code, analytics component, duplicate theme/SW code, `font-family !important` rules and console noise removed.
- **F-39 Reduced motion** - Fixed. The only animation is a CSS one that is switched off under reduced motion.
- **F-40 Accessibility statement** - Fixed. Rewritten to claim only what was tested.
- **F-41 Heading order/landmarks** - Fixed (axe: 0).
- **F-42 Footer focus ring** - Fixed by construction (white ring on the dark footer); not separately measured.
- **F-43 Booking details** - Fixed. UK date and time formats; service pre-selected from service pages.
- **F-44 Overflow at narrow widths** - Fixed at 320 px and up (tested). Not re-tested at 280 px.
- **F-45 Tooltip target size** - Fixed (24 px).
- **F-46 Repository hygiene** - Fixed. Package renamed, sandbox dev-server settings removed, README, SECURITY.md, `.nvmrc`. *Needs you:* licence and default-branch rename.
- **F-47 Empty HTML shell** - Fixed. Per-page head tags, `<noscript>` content, manifest, touch icon, theme colours for light and dark.
- **F-48 Header hygiene** - Fixed. Obsolete headers removed, HSTS without `preload`, asset caching rules, compatibility date updated.

## Also found and fixed while testing

- The Worker's first version would have rejected real visitors' form posts in browsers that omit the `Origin` header on same-origin posts. It now also accepts the browser's unforgeable `Sec-Fetch-Site: same-origin`.
- `Intl` date formatting differs between engines ("Saturday, 7 November" vs "Saturday 7 November"); dates are now composed explicitly so they look the same everywhere.

## How it was checked

- `npm run lint`, `npm run typecheck`, `npm test` (38 tests), `npm run validate`, `npm run build`, `npm audit --omit=dev`: all pass.
- 34 browser tests against the site running on the real Cloudflare Workers runtime with a real (local) D1 database: headers, SEO output, forms to the database, rate limiting, error states, keyboard and screen-reader behaviour, error recovery, blocked storage, theme, scroll restoration, no cookies, no placeholder text anywhere in the built output.
- 149 page visits (27 routes at 320, 375, 768, 1280 and 1920 px, plus dark mode): 0 horizontal overflow, 0 console errors, 0 CSP violations, 0 axe violations, 24 unique page titles.
- The upgrade path from the old cache-first service worker.

## Not checked (could not be, from here)

The live headers, the live Cloudflare dashboard settings, real third-party behaviour (Unsplash, Google Maps), other browsers than Chromium, real screen readers and phones, email notification delivery, Turnstile.
