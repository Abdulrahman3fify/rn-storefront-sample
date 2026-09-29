import { QueryClient } from '@tanstack/react-query';

import { HttpError } from '@/lib/http';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        // Retrying a 4xx never helps; retry transient failures only.
        retry: (failureCount, error) =>
          !(error instanceof HttpError && error.status < 500) && failureCount < 2,
      },
    },
  });
}
