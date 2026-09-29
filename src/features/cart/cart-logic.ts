import type { Product } from '@/features/catalog/api';
import type { Cents } from '@/lib/money';

/**
 * A snapshot of the product at the time it was added, so the cart renders
 * offline and survives the product disappearing from the catalog.
 */
export type CartLine = {
  productId: number;
  title: string;
  thumbnail: string;
  unitPriceCents: Cents;
  stock: number;
  quantity: number;
};

export type Cart = Record<number, CartLine>;

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(0, Math.min(Math.floor(quantity), stock));
}

export function addProduct(cart: Cart, product: Product, quantity = 1): Cart {
  const current = cart[product.id]?.quantity ?? 0;
  return setQuantity(
    {
      ...cart,
      [product.id]: {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        unitPriceCents: product.priceCents,
        stock: product.stock,
        quantity: current,
      },
    },
    product.id,
    current + quantity,
  );
}

/** Quantity is clamped to stock; zero removes the line. */
export function setQuantity(cart: Cart, productId: number, quantity: number): Cart {
  const line = cart[productId];
  if (!line) return cart;
  const next = clampQuantity(quantity, line.stock);
  const { [productId]: _removed, ...rest } = cart;
  return next === 0 ? rest : { ...rest, [productId]: { ...line, quantity: next } };
}

export function removeProduct(cart: Cart, productId: number): Cart {
  return setQuantity(cart, productId, 0);
}

export function cartSummary(cart: Cart): { itemCount: number; subtotalCents: Cents } {
  return Object.values(cart).reduce(
    (acc, line) => ({
      itemCount: acc.itemCount + line.quantity,
      subtotalCents: acc.subtotalCents + line.quantity * line.unitPriceCents,
    }),
    { itemCount: 0, subtotalCents: 0 },
  );
}
