const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return gbp.format(amount);
}

/** "From £45", "Free", or "Price on consultation". */
export function formatPriceFrom(amount: number | null): string {
  if (amount === null) return 'Price on consultation';
  if (amount === 0) return 'Free';
  return `From ${formatPrice(amount)}`;
}

/** "£45+" style, for compact lists. */
export function formatPriceCompact(amount: number | null): string {
  if (amount === null) return 'Ask us';
  if (amount === 0) return 'Free';
  return `${formatPrice(amount)}+`;
}

/** '2026-11-07' -> 'Saturday 7 November 2026' (local date, no timezone shifting). */
export function formatLongDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // Compose from parts so the result is identical in every browser ("Saturday 7 November 2026", no comma).
  const parts = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(d);
  const get = (type: string) => parts.find((x) => x.type === type)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')} ${get('year')}`;
}

/** '14:30' -> '2:30 pm' */
export function formatTime(hhmm: string): string {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return hhmm;
  const d = new Date(2000, 0, 1, Number(m[1]), Number(m[2]));
  return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d).replace(' ', '\u00a0');
}

/** Today's date as YYYY-MM-DD in the visitor's local time zone. */
export function todayIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
