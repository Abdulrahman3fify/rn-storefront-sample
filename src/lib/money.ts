/**
 * Prices are handled as integer cents so totals never drift
 * (0.1 + 0.2 !== 0.3 in floating point).
 */
export type Cents = number;

export function toCents(amount: number): Cents {
  return Math.round(amount * 100);
}

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(cents: Cents): string {
  return formatter.format(cents / 100);
}
