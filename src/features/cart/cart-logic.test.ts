import { makeProduct } from '@/test/fixtures';

import { addProduct, type Cart, cartSummary, removeProduct, setQuantity } from './cart-logic';

describe('cart logic', () => {
  const lamp = makeProduct({ id: 1, priceCents: 1999, stock: 3 });
  const mug = makeProduct({ id: 2, title: 'Mug', priceCents: 850, stock: 10 });

  it('adds a product and merges repeat adds into one line', () => {
    const cart = addProduct(addProduct({}, lamp), lamp);
    expect(Object.keys(cart)).toEqual(['1']);
    expect(cart[1].quantity).toBe(2);
  });

  it('never exceeds available stock', () => {
    const cart = addProduct({}, lamp, 10);
    expect(cart[1].quantity).toBe(3);
    expect(setQuantity(cart, 1, 99)[1].quantity).toBe(3);
  });

  it('removes the line when quantity drops to zero or below', () => {
    const cart = addProduct({}, lamp);
    expect(setQuantity(cart, 1, 0)).toEqual({});
    expect(setQuantity(cart, 1, -4)).toEqual({});
    expect(removeProduct(cart, 1)).toEqual({});
  });

  it('ignores updates for products not in the cart', () => {
    const cart: Cart = {};
    expect(setQuantity(cart, 42, 2)).toBe(cart);
  });

  it('does not mutate the previous cart', () => {
    const before = addProduct({}, lamp);
    const after = setQuantity(before, 1, 2);
    expect(before[1].quantity).toBe(1);
    expect(after[1].quantity).toBe(2);
  });

  it('refreshes the snapshot when the product is added again, without touching the old cart', () => {
    const cart = addProduct({}, lamp);
    const repriced = addProduct(cart, { ...lamp, priceCents: 2499 });
    expect(repriced[1].unitPriceCents).toBe(2499);
    expect(cart[1].unitPriceCents).toBe(1999);
  });

  it('summarises item count and subtotal in cents', () => {
    const cart = addProduct(addProduct({}, lamp, 2), mug, 3);
    expect(cartSummary(cart)).toEqual({ itemCount: 5, subtotalCents: 2 * 1999 + 3 * 850 });
    expect(cartSummary({})).toEqual({ itemCount: 0, subtotalCents: 0 });
  });
});
