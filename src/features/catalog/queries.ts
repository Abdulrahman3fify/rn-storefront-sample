import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchProduct, fetchProducts, nextSkip } from './api';

export const catalogKeys = {
  list: (query: string) => ['products', 'list', query] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
};

export function useProducts(query: string) {
  return useInfiniteQuery({
    queryKey: catalogKeys.list(query),
    queryFn: ({ pageParam, signal }) => fetchProducts({ query, skip: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: nextSkip,
    select: (data) => data.pages.flatMap((page) => page.products),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: ({ signal }) => fetchProduct(id, signal),
    enabled: Number.isInteger(id),
  });
}
