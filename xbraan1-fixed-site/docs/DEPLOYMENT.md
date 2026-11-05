# Deployment

The live site is the Cloudflare **Worker `xbraan1`** with static assets. This repository is the only source of truth.

## How a release works

1. Push to the branch Cloudflare is watching (Workers & Pages > xbraan1 > Settings > Build > Git repository).
2. Cloudflare runs the **build command** `npm run build` and the **deploy command** `npx wrangler deploy`.
3. `wrangler deploy` uploads `dist/` (the site) and `worker/index.ts` (the forms API) and applies the bindings in `wrangler.toml`
   (D1 database `DB`, daily clean-up schedule, variables).

If your Cloudflare build settings are different (for example an empty build command), set them as above once.

## One-time setup (already done for you where noted)

- D1 database `xbraan1-submissions` **created**, and the `submissions` table **created** (`migrations/0001_init.sql`). Its id is in `wrangler.toml`.
- For future schema changes: add a new numbered file in `migrations/`, then run `npm run db:migrate:remote`.

## Rolling back

Cloudflare dashboard > Workers & Pages > xbraan1 > Deployments > choose a previous version > Rollback.
Visitors never receive a stale copy of the site: the old caching service worker has been replaced by a self-removing one (`public/sw.js`).

## Check a release

```bash
curl -sI https://xbraan1.co.uk/ | grep -iE "content-security-policy|strict-transport|x-frame|cross-origin"
curl -s https://xbraan1.co.uk/sitemap.xml | head
curl -s -o /dev/null -w "%{http_code}\n" https://xbraan1.co.uk/definitely-not-a-page   # expect 404
```

Then submit the contact form once and look for the row in the D1 console (Storage & Databases > D1 > xbraan1-submissions > Explore data).

## Secrets and variables

| Name | Where | Purpose |
| --- | --- | --- |
| `ALLOWED_ORIGINS`, `RETENTION_DAYS` | `wrangler.toml` `[vars]` | Sites allowed to post the forms; days to keep submissions (365) |
| `TURNSTILE_SECRET_KEY` | Worker **secret** (`npx wrangler secret put TURNSTILE_SECRET_KEY`) | Optional spam protection |
| `IP_HASH_SALT` | Worker **secret** | Optional: salt for the hashed IP used for rate limiting |
| `NOTIFY_TO`, `NOTIFY_FROM`, `SEND_EMAIL` binding | `wrangler.toml` | Optional email notification for each submission |

Never put secrets in the repository.
