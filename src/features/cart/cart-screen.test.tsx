import { render, screen, userEvent } from '@testing-library/react-native';

import { makeProduct } from '@/test/fixtures';

import { CartScreen } from './cart-screen';
import { useCartStore } from './cart-store';

describe('CartScreen', () => {
  beforeEach(() => {
    useCartStore.setState({ lines: {} });
  });

  it('shows an empty state', async () => {
    await render(<CartScreen />);
    expect(screen.getByText('Your cart is empty.')).toBeOnTheScreen();
  });

  it('updates the subtotal as quantities change and caps at stock', async () => {
    const user = userEvent.setup();
    useCartStore.getState().add(makeProduct({ title: 'Desk Lamp', priceCents: 1999, stock: 2 }));
    await render(<CartScreen />);

    expect(screen.getByLabelText('Subtotal')).toHaveTextContent('$19.99');

    await user.press(screen.getByLabelText('Increase Desk Lamp'));
    expect(screen.getByLabelText('Subtotal')).toHaveTextContent('$39.98');
    expect(screen.getByLabelText('Increase Desk Lamp')).toBeDisabled();

    await user.press(screen.getByLabelText('Decrease Desk Lamp'));
    await user.press(screen.getByLabelText('Decrease Desk Lamp'));
    expect(screen.getByText('Your cart is empty.')).toBeOnTheScreen();
  });
});
