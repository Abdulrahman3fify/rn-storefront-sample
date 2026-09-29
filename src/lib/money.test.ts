import { formatMoney, toCents } from './money';

describe('money', () => {
  it('converts to integer cents without float drift', () => {
    expect(toCents(0.1) + toCents(0.2)).toBe(toCents(0.3));
    expect(toCents(19.99)).toBe(1999);
  });

  it('formats cents as USD', () => {
    expect(formatMoney(123456)).toBe('$1,234.56');
    expect(formatMoney(0)).toBe('$0.00');
  });
});
