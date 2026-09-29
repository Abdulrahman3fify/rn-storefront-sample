# Storefront: a React Native / Expo sample

A small shopping app: browse a catalog, search it, open a product, and keep a cart that survives restarts. It runs on iOS, Android and web from one codebase.

I built it to show how I structure a production React Native app. My client work is under NDA, so this repo shows the same patterns on public data from [DummyJSON](https://dummyjson.com).

**Stack:** Expo SDK 57 · React Native 0.86 · TypeScript (strict) · Expo Router · TanStack Query · Zustand · Zod · Jest + React Native Testing Library · GitHub Actions

## Run it

```bash
npm install
npm start          # press i / a / w for iOS, Android or web
npm test           # unit + component tests
npm run typecheck
npm run lint
```

## What's in it

- **Catalog:** infinite scroll, pull to refresh, and debounced search. Each state (loading, error with retry, empty) has its own screen.
- **Product page:** "Add to cart" knows how many are already in the cart and stops at available stock.
- **Cart:** quantity stepper, subtotal, and persistence to AsyncStorage.
- Light and dark themes, accessibility labels and roles on controls, and layouts capped at a readable width on web and tablets.

## How it's organised

```
src/
  app/                 routes only (Expo Router); each file re-exports a screen
  features/
    catalog/           api.ts (fetch + Zod schemas), queries.ts, screens, product card
    cart/              cart-logic.ts (pure), cart-store.ts (Zustand), screen, components
  components/          shared UI: themed text/view, button, loading/error/empty states
  lib/                 http client, money, query client
```

Code is grouped by feature, not by file type, so everything the cart needs lives in `features/cart`. Route files stay thin, which lets tests render screens without a navigator.

## Decisions and trade-offs

**Server state and client state are kept apart.** Products come from the network, so TanStack Query owns them: caching, pagination, retries and refetch. The cart exists only on the device, so it lives in a small persisted Zustand store. Putting both in one global store would mean hand-writing cache invalidation that TanStack Query already handles.

**Cart rules are plain functions.** `cart-logic.ts` holds the rules: merge repeat adds, cap at stock, remove at zero, compute totals. They're pure functions with no React or storage, so they're tested directly and the store is a thin wrapper around them.

**Money is integer cents.** Prices are converted once when the response is parsed. `0.1 + 0.2` never reaches a total, and formatting happens only at the edge with `Intl.NumberFormat`.

**API responses are validated.** `getJson` parses every response with Zod. If the backend changes its contract, the request fails at the boundary with a clear error, not later as `undefined` in a screen. The schema also reshapes the data (`price` becomes `priceCents`), so screens never see the raw API shape.

**Retries depend on the error.** 5xx and network errors are retried twice. 4xx errors are not, because retrying a 404 only delays the error screen. Requests are cancelled when their query is abandoned and time out after 10 seconds.

**Cart lines store a snapshot of the product.** Each line keeps the title, image, price and stock from when it was added. The cart renders offline and survives a product being removed from the catalog. The trade-off is that prices can go stale. A real checkout would re-validate against the server before payment. That step is out of scope here, and it's the first thing I'd add.

**Persisted state is versioned.** The persisted store has `version: 1`, so a future change to its shape can add a `migrate` step instead of crashing on old data.

## Tests

| File | What it covers |
| --- | --- |
| `cart-logic.test.ts` | merging repeat adds, stock cap, removal at zero, immutability, price snapshots, totals |
| `api.test.ts` | parsing and cents conversion, search URL encoding, rejecting a broken contract, `HttpError` on 5xx, pagination end |
| `money.test.ts` | float-safe conversion and formatting |
| `cart-screen.test.tsx` | the cart as a user sees it: subtotal updates, "+" disabled at stock, removal to the empty state |

CI runs typecheck, lint, tests and `expo-doctor` on every push and pull request.

## What I'd add next

- Checkout that re-validates prices and stock with the server, with optimistic UI and rollback
- Detox or Maestro end-to-end tests for the add-to-cart flow on a real simulator
- Offline-first catalog with persisted query cache (`@tanstack/query-async-storage-persister`)
- Sentry for crashes and performance, and EAS Build + Update in CI for store builds and OTA releases

---

Built by [Abdulrahman Afify](https://abdulrahman-afify-portfolio.vercel.app/), Senior Mobile Engineer.
