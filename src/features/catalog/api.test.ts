import { HttpError } from '@/lib/http';

import { fetchProducts, nextSkip } from './api';

const apiProduct = {
  id: 7,
  title: 'Mug',
  description: 'Ceramic',
  category: 'kitchen',
  price: 8.5,
  rating: 4.2,
  stock: 12,
  thumbnail: 'https://example.com/mug.webp',
};

function mockFetch(body: unknown, status = 200) {
  const fetchMock = jest
    .fn()
    .mockResolvedValue({ ok: status < 400, status, json: async () => body });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('catalog api', () => {
  it('parses products and converts prices to cents', async () => {
    mockFetch({ products: [apiProduct], total: 1, skip: 0, limit: 20 });
    const page = await fetchProducts({ query: '', skip: 0 });
    expect(page.products[0]).toMatchObject({ id: 7, priceCents: 850 });
    expect(page.products[0]).not.toHaveProperty('price');
  });

  it('uses the search endpoint and encodes the query', async () => {
    const fetchMock = mockFetch({ products: [], total: 0, skip: 0, limit: 20 });
    await fetchProducts({ query: 'desk & lamp', skip: 20 });
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/products/search?q=desk%20%26%20lamp&');
    expect(url).toContain('skip=20');
  });

  it('rejects responses that break the contract', async () => {
    mockFetch({ products: [{ ...apiProduct, price: 'free' }], total: 1, skip: 0, limit: 20 });
    await expect(fetchProducts({ query: '', skip: 0 })).rejects.toThrow();
  });

  it('surfaces HTTP failures as HttpError with the status', async () => {
    mockFetch({}, 503);
    await expect(fetchProducts({ query: '', skip: 0 })).rejects.toMatchObject({
      name: 'HttpError',
      status: 503,
    });
    await expect(fetchProducts({ query: '', skip: 0 })).rejects.toBeInstanceOf(HttpError);
  });

  it('computes the next page offset and stops at the end', () => {
    const page = (skip: number, count: number, total: number) => ({
      products: Array(count).fill(null),
      skip,
      total,
      limit: 20,
    });
    expect(nextSkip(page(0, 20, 45) as never)).toBe(20);
    expect(nextSkip(page(40, 5, 45) as never)).toBeUndefined();
  });
});
