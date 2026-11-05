import { describe, expect, it } from 'vitest';
import { LIMITS, ukToday, validateBooking, validateContact } from '../shared/forms';

const known = new Set(['womens-cut', 'mens-cut']);
const now = new Date('2026-11-02T12:00:00Z');
const goodBooking = { name: 'Ada Lovelace', email: 'ada@example.com', phone: '+44 20 7946 0958', service: 'womens-cut', date: '2026-11-10', time: '14:30', notes: '' };

describe('validateContact', () => {
  it('accepts a valid enquiry and trims whitespace', () => {
    const r = validateContact({ name: '  Ada  ', email: 'ada@example.com', phone: '', message: 'Do you offer silk presses?' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe('Ada');
  });

  it('rejects bad input field by field', () => {
    const r = validateContact({ name: '', email: 'nope', phone: 'abc', message: 'hi' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['email', 'message', 'name', 'phone']);
  });

  it('rejects over-long messages and non-object input', () => {
    expect(validateContact({ name: 'Ada', email: 'a@b.co', message: 'x'.repeat(LIMITS.message + 1) }).ok).toBe(false);
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact('string').ok).toBe(false);
  });

  it('rejects control characters in names', () => {
    expect(validateContact({ name: 'Ada\u0000', email: 'a@b.co', message: 'A valid message here' }).ok).toBe(false);
  });
});

describe('validateBooking', () => {
  it('accepts a valid request', () => {
    expect(validateBooking(goodBooking, { knownServices: known, now }).ok).toBe(true);
  });

  it('accepts today but not yesterday (UK date)', () => {
    expect(ukToday(now)).toBe('2026-11-02');
    expect(validateBooking({ ...goodBooking, date: '2026-11-02' }, { knownServices: known, now }).ok).toBe(true);
    expect(validateBooking({ ...goodBooking, date: '2026-11-01' }, { knownServices: known, now }).ok).toBe(false);
  });

  it('rejects impossible dates, odd times and far-future dates', () => {
    for (const bad of [{ date: '2026-02-30' }, { date: 'tomorrow' }, { time: '25:00' }, { time: '9am' }, { date: '2028-01-01' }]) {
      expect(validateBooking({ ...goodBooking, ...bad }, { knownServices: known, now }).ok).toBe(false);
    }
  });

  it('rejects unknown services', () => {
    const r = validateBooking({ ...goodBooking, service: 'free-everything' }, { knownServices: known, now });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.service).toBeTruthy();
  });

  it('treats phone and notes as optional but bounded', () => {
    expect(validateBooking({ ...goodBooking, phone: '' }, { knownServices: known, now }).ok).toBe(true);
    expect(validateBooking({ ...goodBooking, notes: 'x'.repeat(LIMITS.notes + 1) }, { knownServices: known, now }).ok).toBe(false);
  });
});
