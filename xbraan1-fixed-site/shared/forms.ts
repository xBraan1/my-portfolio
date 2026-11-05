// Validation shared by the browser (instant feedback) and the Worker (the authoritative check).
// Pure TypeScript, no DOM or Workers APIs, so it runs in both places and in tests.

export const LIMITS = { name: 100, email: 254, phone: 20, message: 2000, notes: 1000 } as const;

export type FieldErrors = Record<string, string>;

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string;
}

export type Validation<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9 +()\-.]{7,20}$/;
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function checkName(name: string, errors: FieldErrors) {
  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;
  else if (CONTROL.test(name)) errors.name = 'Your name contains characters we cannot accept.';
}

function checkEmail(email: string, errors: FieldErrors) {
  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Please enter a valid email address, like name@example.com.';
}

function checkPhone(phone: string, errors: FieldErrors) {
  if (phone && !PHONE.test(phone)) errors.phone = 'Please enter a valid phone number, or leave it blank.';
}

export function validateContact(input: unknown): Validation<ContactInput> {
  const o = (input ?? {}) as Record<string, unknown>;
  const value: ContactInput = { name: str(o.name), email: str(o.email), phone: str(o.phone), message: str(o.message) };
  const errors: FieldErrors = {};
  checkName(value.name, errors);
  checkEmail(value.email, errors);
  checkPhone(value.phone, errors);
  if (value.message.length < 10) errors.message = 'Please write a short message (at least 10 characters).';
  else if (value.message.length > LIMITS.message) errors.message = `Please keep your message under ${LIMITS.message} characters.`;
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

function isRealDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

/** Today's calendar date in the UK, as YYYY-MM-DD (the salon's local date, whatever the server/browser time zone). */
export function ukToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export interface BookingOptions {
  knownServices: ReadonlySet<string>;
  now?: Date;
  maxDaysAhead?: number;
}

export function validateBooking(input: unknown, opts: BookingOptions): Validation<BookingInput> {
  const o = (input ?? {}) as Record<string, unknown>;
  const value: BookingInput = {
    name: str(o.name),
    email: str(o.email),
    phone: str(o.phone),
    service: str(o.service),
    date: str(o.date),
    time: str(o.time),
    notes: str(o.notes),
  };
  const errors: FieldErrors = {};
  checkName(value.name, errors);
  checkEmail(value.email, errors);
  checkPhone(value.phone, errors);

  if (!value.service) errors.service = 'Please choose a service.';
  else if (!opts.knownServices.has(value.service)) errors.service = 'Please choose a service from the list.';

  const today = ukToday(opts.now);
  if (!value.date) errors.date = 'Please choose a preferred date.';
  else if (!isRealDate(value.date)) errors.date = 'Please enter a valid date.';
  else if (value.date < today) errors.date = 'Please choose today or a future date.';
  else {
    const limit = new Date(`${today}T00:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + (opts.maxDaysAhead ?? 365));
    if (value.date > limit.toISOString().slice(0, 10)) errors.date = 'Please choose a date within the next year.';
  }

  if (!value.time) errors.time = 'Please choose a preferred time.';
  else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value.time)) errors.time = 'Please enter a valid time.';

  if (value.notes.length > LIMITS.notes) errors.notes = `Please keep your notes under ${LIMITS.notes} characters.`;
  else if (CONTROL.test(value.notes)) errors.notes = 'Your notes contain characters we cannot accept.';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export interface ApiSuccess {
  ok: true;
  reference: string;
}
export interface ApiFailure {
  ok: false;
  error: 'validation' | 'rate_limited' | 'forbidden' | 'too_fast' | 'unavailable' | 'bad_request';
  message: string;
  fieldErrors?: FieldErrors;
}
export type ApiResponse = ApiSuccess | ApiFailure;
