export interface Promotion {
  id: string;
  title: string;
  description: string;
  terms: string;
  /** ISO date (YYYY-MM-DD). Offers are hidden after this date. */
  validUntil?: string;
}

/**
 * OWNER: add real offers here, then set `features.promotions` to true in src/config/site.ts.
 * Only list an offer you will honour, with its real terms and end date.
 */
export const promotions: Promotion[] = [];
