import type { Product } from '@/features/catalog/api';

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Desk Lamp',
    description: 'A lamp.',
    category: 'home',
    priceCents: 1999,
    rating: 4.5,
    stock: 3,
    thumbnail: 'https://example.com/lamp.webp',
    ...overrides,
  };
}
