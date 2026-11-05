import { beforeEach, describe, expect, it, vi } from 'vitest';
import worker, { Env, originAllowed } from '../worker/index';
import { services } from '../src/data/services';

interface Row { id: string; kind: string; created_at: string; name: string; email: string; details: string | null; ip_hash: string; message: string | null }

/** Minimal in-memory stand-in for the three statements the Worker runs against D1. */
class FakeDB {
  rows: Row[] = [];
  failing = false;
  prepare = (sql: string) => {
    const make = (args: unknown[]): { bind: (...a: unknown[]) => unknown; first: <T>() => Promise<T>; run: () => Promise<{ success: boolean }> } => ({
      bind: (...a: unknown[]) => make(a),
      first: async <T,>() => {
        if (this.failing) throw new Error('D1 down');
        const [ipHash, since] = args as [string, string];
        return { n: this.rows.filter((r) => r.ip_hash === ipHash && r.created_at > since).length } as T;
      },
      run: async () => {
        if (this.failing) throw new Error('D1 down');
        if (sql.startsWith('INSERT')) {
          const [id, kind, created_at, name, email, , message, details, ip_hash] = args as string[];
          this.rows.push({ id, kind, created_at, name, email, message, details, ip_hash });
        } else if (sql.startsWith('DELETE')) {
          const [cutoff] = args as string[];
          this.rows = this.rows.filter((r) => r.created_at >= cutoff);
        }
        return { success: true };
      },
    });
    return make([]);
  };
}

const ORIGIN = 'https://xbraan1.co.uk';
let db: FakeDB;
let env: Env;
const ctx = { waitUntil: (p: Promise<unknown>) => void p.catch(() => undefined) } as unknown as ExecutionContext;
const assets = vi.fn(async () => new Response('static asset'));

function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'CF-Connecting-IP': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
const longAgo = Date.now() - 60_000;
const contact = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '', message: 'Do you offer silk presses?', startedAt: longAgo };
const tomorrow = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
const booking = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '', service: services[0].slug, date: tomorrow, time: '14:30', notes: '', startedAt: longAgo };

beforeEach(() => {
  db = new FakeDB();
  env = { ASSETS: { fetch: assets } as unknown as Fetcher, DB: db as unknown as D1Database, ALLOWED_ORIGINS: ORIGIN };
  assets.mockClear();
});

describe('routing', () => {
  it('passes non-API requests to the static assets', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/services`), env, ctx);
    expect(await res.text()).toBe('static asset');
    expect(assets).toHaveBeenCalledOnce();
  });
  it('404s unknown API paths and 405s wrong methods', async () => {
    expect((await worker.fetch(new Request(`${ORIGIN}/api/nope`, { method: 'POST' }), env, ctx)).status).toBe(404);
    const res = await worker.fetch(new Request(`${ORIGIN}/api/contact`), env, ctx);
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST');
  });
});

describe('POST /api/contact', () => {
  it('stores a valid enquiry and returns a reference', async () => {
    const res = await worker.fetch(post('/api/contact', contact), env, ctx);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean; reference: string };
    expect(data.ok).toBe(true);
    expect(data.reference).toMatch(/^XB-[0-9A-F]{8}$/);
    expect(db.rows).toHaveLength(1);
    expect(db.rows[0]).toMatchObject({ kind: 'contact', email: 'ada@example.com' });
    expect(db.rows[0].ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('rejects foreign origins, missing origins and wrong content types', async () => {
    expect((await worker.fetch(post('/api/contact', contact, { Origin: 'https://evil.example' }), env, ctx)).status).toBe(403);
    const noOrigin = new Request(`${ORIGIN}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) });
    expect((await worker.fetch(noOrigin, env, ctx)).status).toBe(403);
    expect((await worker.fetch(post('/api/contact', contact, { 'Content-Type': 'text/plain' }), env, ctx)).status).toBe(400);
    expect(db.rows).toHaveLength(0);
  });

  it('returns field errors for invalid input and does not store it', async () => {
    const res = await worker.fetch(post('/api/contact', { ...contact, email: 'nope', message: 'x' }), env, ctx);
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error: string; fieldErrors: Record<string, string> };
    expect(data.error).toBe('validation');
    expect(Object.keys(data.fieldErrors)).toEqual(expect.arrayContaining(['email', 'message']));
    expect(db.rows).toHaveLength(0);
  });

  it('rejects malformed and oversized bodies', async () => {
    expect((await worker.fetch(post('/api/contact', '{not json'), env, ctx)).status).toBe(400);
    expect((await worker.fetch(post('/api/contact', '[]'), env, ctx)).status).toBe(400);
    expect((await worker.fetch(post('/api/contact', JSON.stringify({ ...contact, message: 'x'.repeat(20_000) })), env, ctx)).status).toBe(400);
  });

  it('silently drops honeypot submissions and refuses implausibly fast ones', async () => {
    const trap = await worker.fetch(post('/api/contact', { ...contact, website: 'http://spam.example' }), env, ctx);
    expect(trap.status).toBe(200);
    expect(db.rows).toHaveLength(0);
    const fast = await worker.fetch(post('/api/contact', { ...contact, startedAt: Date.now() }), env, ctx);
    expect(fast.status).toBe(400);
    expect(((await fast.json()) as { error: string }).error).toBe('too_fast');
  });

  it('rate-limits repeated submissions from one address', async () => {
    for (let i = 0; i < 5; i++) expect((await worker.fetch(post('/api/contact', contact), env, ctx)).status).toBe(200);
    const res = await worker.fetch(post('/api/contact', contact), env, ctx);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('600');
    expect(db.rows).toHaveLength(5);
    // a different address is unaffected
    expect((await worker.fetch(post('/api/contact', contact, { 'CF-Connecting-IP': '198.51.100.9' }), env, ctx)).status).toBe(200);
  });

  it('never reports success when the database fails', async () => {
    db.failing = true;
    const res = await worker.fetch(post('/api/contact', contact), env, ctx);
    expect(res.status).toBe(503);
    expect(((await res.json()) as { ok: boolean }).ok).toBe(false);
  });
});

describe('POST /api/booking', () => {
  it('stores a valid request with its details', async () => {
    const res = await worker.fetch(post('/api/booking', booking), env, ctx);
    expect(res.status).toBe(200);
    expect(JSON.parse(db.rows[0].details as string)).toEqual({ service: booking.service, date: tomorrow, time: '14:30' });
  });
  it('rejects unknown services and past dates', async () => {
    expect((await worker.fetch(post('/api/booking', { ...booking, service: 'nonsense' }), env, ctx)).status).toBe(400);
    expect((await worker.fetch(post('/api/booking', { ...booking, date: '2020-01-01' }), env, ctx)).status).toBe(400);
    expect(db.rows).toHaveLength(0);
  });
});

describe('scheduled clean-up', () => {
  it('deletes submissions older than the retention period', async () => {
    const old = new Date(Date.now() - 400 * 86_400_000).toISOString();
    db.rows.push({ id: 'old', kind: 'contact', created_at: old, name: 'x', email: 'x@y.co', details: null, ip_hash: 'h', message: 'm' });
    db.rows.push({ id: 'new', kind: 'contact', created_at: new Date().toISOString(), name: 'x', email: 'x@y.co', details: null, ip_hash: 'h', message: 'm' });
    await worker.scheduled({} as ScheduledController, env);
    expect(db.rows.map((r) => r.id)).toEqual(['new']);
  });
});

describe('originAllowed', () => {
  it('allows the request host and listed origins only', () => {
    const req = (origin: string | null, extra: Record<string, string> = {}) =>
      new Request(`${ORIGIN}/api/contact`, { method: 'POST', headers: { ...(origin ? { Origin: origin } : {}), ...extra } });
    expect(originAllowed(req(ORIGIN), {})).toBe(true);
    expect(originAllowed(req('https://www.xbraan1.co.uk'), { ALLOWED_ORIGINS: 'https://www.xbraan1.co.uk' })).toBe(true);
    expect(originAllowed(req('https://evil.example'), {})).toBe(false);
    expect(originAllowed(req(null), {})).toBe(false);
  });
  it('accepts a missing Origin only when the browser says the request is same-origin', () => {
    const req = (sfs?: string) => new Request(`${ORIGIN}/api/contact`, { method: 'POST', headers: sfs ? { 'Sec-Fetch-Site': sfs } : {} });
    expect(originAllowed(req('same-origin'), {})).toBe(true);
    expect(originAllowed(req('cross-site'), {})).toBe(false);
    expect(originAllowed(req('same-site'), {})).toBe(false);
    expect(originAllowed(req(), {})).toBe(false);
  });
});
