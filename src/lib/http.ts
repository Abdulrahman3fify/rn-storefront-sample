import type { z } from 'zod';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`Request to ${url} failed with ${status}`);
    this.name = 'HttpError';
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Fetches JSON and validates it against a schema, so a backend contract
 * change fails loudly at the boundary instead of deep inside a screen.
 */
export async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
  { signal, timeoutMs = DEFAULT_TIMEOUT_MS }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const res = await fetch(url, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new HttpError(res.status, url);
  return schema.parse(await res.json());
}
