import { describe, expect, it } from 'vitest';
import { contentProblems, launchGaps } from '../scripts/lib/content-checks';
import { services } from '../src/data/services';

describe('content integrity', () => {
  it('has no broken references, duplicates or missing alt text', () => {
    expect(contentProblems()).toEqual([]);
  });

  it('keeps the full catalogue, including barbering', () => {
    expect(services.length).toBeGreaterThanOrEqual(90);
    expect(services.filter((s) => s.category === 'barber').length).toBeGreaterThanOrEqual(20);
    expect(services.some((s) => s.slug === 'mens-cut')).toBe(true);
  });

  it('reports owner details that are still missing instead of inventing them', () => {
    const gaps = launchGaps().join(' ');
    expect(gaps).toContain('contact.email');
    expect(gaps).toContain('openingHours');
  });
});
