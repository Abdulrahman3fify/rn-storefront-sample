import { z } from 'zod';

import { getJson } from '@/lib/http';
import { toCents } from '@/lib/money';

const BASE_URL = 'https://dummyjson.com';
export const PAGE_SIZE = 20;

const productSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().default(''),
    category: z.string(),
    price: z.number().nonnegative(),
    rating: z.number(),
    stock: z.number().int().nonnegative(),
    thumbnail: z.url(),
  })
  .transform(({ price, ...rest }) => ({ ...rest, priceCents: toCents(price) }));

export type Product = z.infer<typeof productSchema>;

const productPageSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type ProductPage = z.infer<typeof productPageSchema>;

const FIELDS = 'id,title,description,category,price,rating,stock,thumbnail';

export function fetchProducts(
  { query, skip }: { query: string; skip: number },
  signal?: AbortSignal,
): Promise<ProductPage> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String(skip),
    select: FIELDS,
  });
  const path = query ? `/products/search?q=${encodeURIComponent(query)}&` : '/products?';
  return getJson(`${BASE_URL}${path}${params}`, productPageSchema, { signal });
}

export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return getJson(`${BASE_URL}/products/${id}?select=${FIELDS}`, productSchema, { signal });
}

/** Offset of the next page, or undefined when every product is loaded. */
export function nextSkip(page: ProductPage): number | undefined {
  const next = page.skip + page.products.length;
  return next < page.total ? next : undefined;
}
