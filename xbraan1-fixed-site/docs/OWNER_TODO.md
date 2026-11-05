# Owner checklist

Things only you can do. Nothing here has been invented for you: until you fill it in, the site simply hides that information.
Run `npm run check:launch` at any time to see what is still missing.

## 1. Get the code live

- [ ] Put this branch on GitHub and merge it (see "How this was delivered" in the audit document).
- [ ] In Cloudflare (Workers & Pages > xbraan1 > Settings > Build): build command `npm run build`, deploy command `npx wrangler deploy`.
- [ ] After the deploy, open the site on your phone, send yourself a test enquiry and a test appointment request, and check they appear in
      Cloudflare > Storage & Databases > D1 > `xbraan1-submissions` > Explore data > `submissions`.
- [ ] **Decide who checks that table, and how often.** Until email notifications are on (section 4), nobody is told when a request arrives.

## 2. Your business details (edit `src/config/site.ts`)

- [ ] `contact.email` and `contact.telephone`
- [ ] Address (`streetAddress`, `locality`, `postcode`), opening hours, and optionally a Google Maps embed link (`mapEmbedUrl`), directions, parking and accessibility notes
- [ ] `legalName` (your registered business name) for the privacy notice
- [ ] Social links, if you want them (they are not shown until set)

## 3. Content only you can vouch for

- [ ] **Services and prices** (`src/data/services.ts`): all 90 services and their prices, durations and descriptions were restored from the earlier version of the site. They look like template content, not your real menu. Check every one.
- [ ] **Team** (`src/data/team.ts`): the six people there are placeholders with stock photos. Replace them with your real staff, photos and bios, then set `features.team` to `true`.
- [ ] **Reviews** (`src/data/testimonials.ts`): add only real reviews with their source and the customer's permission, then set `features.testimonials` to `true`. Made-up reviews are against the law in the UK.
- [ ] **Offers** (`src/data/promotions.ts`): add only offers you will honour, then set `features.promotions` to `true`.
- [ ] **Photos:** the gallery and service images are stock photos from Unsplash. Replace them with your own work when you can (the privacy page mentions Unsplash; update it if you change this).
- [ ] **Policies page** (`src/pages/Policies.tsx`): check the cancellation, deposit and refund wording matches how you really work.

## 4. Optional but recommended

- [ ] **Email notifications:** Cloudflare dashboard > Email > Email Routing: turn it on for xbraan1.co.uk and verify your own address. Then uncomment the `[[send_email]]` block in `wrangler.toml` and set `NOTIFY_TO` (your address) and `NOTIFY_FROM` (for example `forms@xbraan1.co.uk`) in `[vars]`.
- [ ] **Spam protection:** Cloudflare dashboard > Turnstile > add a widget for xbraan1.co.uk. Put the site key in `src/config/site.ts` (`turnstileSiteKey`) and store the secret with `npx wrangler secret put TURNSTILE_SECRET_KEY`.
- [ ] **A proper inbox for the data:** consider Cloudflare Access in front of the D1 console, or exporting requests to a spreadsheet each week.

## 5. Legal and compliance (get a qualified adviser to check)

- [ ] Privacy Policy, Terms and Cookies pages describe what the site really does today, but they are not legal advice. Have them reviewed.
- [ ] Check whether your business must pay the **ICO data protection fee** (most UK businesses that handle customers' details do): https://ico.org.uk/for-organisations/data-protection-fee/
- [ ] If you turn on analytics, advertising or anything that sets cookies, the cookies page and a consent banner must change first.

## 6. GitHub housekeeping

- [ ] Rename the default branch from `grid-hustle-salon-website-c9261` to `main` (Settings > Branches), and update the branch in the Cloudflare build settings.
- [ ] Turn on branch protection for `main`, Dependabot alerts, secret scanning and push protection (Settings > Code security).
- [ ] Turn on two-factor authentication for GitHub and Cloudflare.
- [ ] Add a licence file if you want others to be allowed to reuse the code.

## 7. After launch, verify these live (I could not check them from my side)

- [ ] `curl -sI https://xbraan1.co.uk/` shows the Content-Security-Policy, Strict-Transport-Security and X-Frame-Options headers.
- [ ] Images load on every page (the old build blocked cross-origin images in some setups).
- [ ] Run https://pagespeed.web.dev and https://securityheaders.com against the live site.
- [ ] Submit the sitemap (https://xbraan1.co.uk/sitemap.xml) in Google Search Console.
