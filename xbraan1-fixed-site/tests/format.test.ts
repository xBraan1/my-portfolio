import { describe, expect, it } from 'vitest';
import { formatLongDate, formatPrice, formatPriceCompact, formatPriceFrom, formatTime } from '../src/lib/format';

describe('formatting', () => {
  it('formats prices in pounds', () => {
    expect(formatPrice(45)).toBe('£45');
    expect(formatPriceFrom(45)).toBe('From £45');
    expect(formatPriceFrom(0)).toBe('Free');
    expect(formatPriceFrom(null)).toBe('Price on consultation');
    expect(formatPriceCompact(120)).toBe('£120+');
  });
  it('formats dates and times for a UK reader', () => {
    expect(formatLongDate('2026-11-07')).toBe('Saturday 7 November 2026');
    expect(formatLongDate('garbage')).toBe('garbage');
    expect(formatTime('14:30').replace('\u00a0', ' ').toLowerCase()).toBe('2:30 pm');
    expect(formatTime('09:05').replace('\u00a0', ' ').toLowerCase()).toBe('9:05 am');
  });
});
