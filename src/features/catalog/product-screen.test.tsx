import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';

import { ProductScreen } from './product-screen';

describe('ProductScreen', () => {
  it('shows not found for a malformed id instead of loading forever', async () => {
    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await render(
      <QueryClientProvider client={new QueryClient()}>
        <ProductScreen id={Number('abc')} />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Product not found.')).toBeOnTheScreen();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
