import { validateBooking, validateContact, ApiFailure, ApiResponse } from '../shared/forms';
import { services } from '../src/data/services';

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  /** Comma-separated list of origins allowed to POST (defaults to the request's own origin). */
  ALLOWED_ORIGINS?: string;
  /** Days to keep submissions (default 365). */
  RETENTION_DAYS?: string;
  /** Optional: Cloudflare Turnstile secret. When set, a valid token is required. */
  TURNSTILE_SECRET_KEY?: string;
  /** Optional: secret salt for hashing IP addresses used for rate limiting. */
  IP_HASH_SALT?: string;
  /** Optional email notification (Cloudflare Email Routing `send_email` binding). */
  SEND_EMAIL?: SendEmail;
  NOTIFY_TO?: string;
  NOTIFY_FROM?: string;
}

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 1500;
const knownServices: ReadonlySet<string> = new Set(services.map((s) => s.slug));

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function json(body: ApiResponse | { ok: false; error: string }, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extra } });
}

function fail(status: number, error: ApiFailure['error'], message: string, fieldErrors?: ApiFailure['fieldErrors'], extra?: Record<string, string>) {
  return json({ ok: false, error, message, ...(fieldErrors ? { fieldErrors } : {}) }, status, extra);
}

export function originAllowed(request: Request, env: Pick<Env, 'ALLOWED_ORIGINS'>): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) {
    // Some browsers leave Origin off same-origin POSTs. Sec-Fetch-Site is set by the browser itself and
    // cannot be forged by page scripts, so "same-origin" is equally good proof. With neither header: refuse.
    return request.headers.get('Sec-Fetch-Site') === 'same-origin';
  }
  const list = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (list.includes(origin)) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(secret: string, token: unknown, ip: string): Promise<boolean> {
  if (typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function notify(env: Env, kind: string, reference: string, fields: Record<string, string>): Promise<void> {
  if (!env.SEND_EMAIL || !env.NOTIFY_TO || !env.NOTIFY_FROM) return;
  try {
    const { EmailMessage } = await import('cloudflare:email');
    const lines = Object.entries(fields).filter(([, v]) => v).map(([k, v]) => `${k}: ${v.replace(/[\r\n]+/g, ' ')}`);
    const raw = [
      `From: xBraan1 website <${env.NOTIFY_FROM}>`,
      `To: ${env.NOTIFY_TO}`,
      `Reply-To: ${fields.email}`,
      `Subject: New ${kind} ${reference}`,
      `Message-ID: <${crypto.randomUUID()}@xbraan1.co.uk>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      `New ${kind} received (${reference}).`,
      '',
      ...lines,
    ].join('\r\n');
    await env.SEND_EMAIL.send(new EmailMessage(env.NOTIFY_FROM, env.NOTIFY_TO, raw));
  } catch (err) {
    console.error('Notification email failed', err);
  }
}

export async function handleSubmission(request: Request, env: Env, ctx: Pick<ExecutionContext, 'waitUntil'>, kind: 'contact' | 'booking'): Promise<Response> {
  if (!originAllowed(request, env)) return fail(403, 'forbidden', 'This request was not accepted.');
  if (!(request.headers.get('Content-Type') ?? '').toLowerCase().includes('application/json')) {
    return fail(400, 'bad_request', 'Unsupported content type.');
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return fail(400, 'bad_request', 'That message is too large.');
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) as Record<string, unknown>;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
  } catch {
    return fail(400, 'bad_request', 'We could not read that request.');
  }

  // Bot traps: a filled honeypot is silently accepted (nothing is stored); an implausibly fast submit is refused.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true, reference: 'XB-00000000' });
  }
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return fail(400, 'too_fast', 'Please check your details and press send again.');
  }

  const result = kind === 'contact' ? validateContact(body) : validateBooking(body, { knownServices });
  if (!result.ok) return fail(400, 'validation', 'Please check the highlighted fields.', result.errors);

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  if (env.TURNSTILE_SECRET_KEY && !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, body.turnstileToken, ip))) {
    return fail(400, 'forbidden', 'We could not verify that you are human. Please try again.');
  }

  const ipHash = (await sha256Hex(`${env.IP_HASH_SALT ?? 'xbraan1'}|${ip}`)).slice(0, 32);
  const now = new Date();
  try {
    const since = new Date(now.getTime() - RATE_WINDOW_MINUTES * 60_000).toISOString();
    const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM submissions WHERE ip_hash = ? AND created_at > ?').bind(ipHash, since).first<{ n: number }>();
    if ((recent?.n ?? 0) >= RATE_MAX_PER_WINDOW) {
      return fail(429, 'rate_limited', 'Too many requests from your connection. Please wait a few minutes and try again.', undefined, { 'Retry-After': String(RATE_WINDOW_MINUTES * 60) });
    }

    const id = crypto.randomUUID();
    const v = result.value;
    const isBooking = kind === 'booking';
    const details = isBooking
      ? JSON.stringify({ service: (v as { service: string }).service, date: (v as { date: string }).date, time: (v as { time: string }).time })
      : null;
    const message = isBooking ? (v as { notes: string }).notes || null : (v as { message: string }).message;

    await env.DB.prepare(
      'INSERT INTO submissions (id, kind, created_at, name, email, phone, message, details, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(id, kind, now.toISOString(), v.name, v.email, v.phone || null, message, details, ipHash, (request.headers.get('User-Agent') ?? '').slice(0, 200) || null)
      .run();

    const reference = `XB-${id.slice(0, 8).toUpperCase()}`;
    ctx.waitUntil(
      notify(env, kind === 'booking' ? 'booking request' : 'enquiry', reference, {
        name: v.name,
        email: v.email,
        phone: v.phone,
        ...(isBooking ? JSON.parse(details as string) : {}),
        message: message ?? '',
      }),
    );
    return json({ ok: true, reference });
  } catch (err) {
    console.error('Submission failed', err);
    return fail(503, 'unavailable', 'We could not save your request just now. Please try again shortly.');
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    const kind = pathname === '/api/contact' ? 'contact' : pathname === '/api/booking' ? 'booking' : null;
    if (!kind) return json({ ok: false, error: 'not_found' }, 404);
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
    return handleSubmission(request, env, ctx, kind);
  },

  /** Daily clean-up: delete submissions older than the retention period. */
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    const days = Math.max(30, Number(env.RETENTION_DAYS) || 365);
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
    await env.DB.prepare('DELETE FROM submissions WHERE created_at < ?').bind(cutoff).run();
  },
} satisfies ExportedHandler<Env>;
