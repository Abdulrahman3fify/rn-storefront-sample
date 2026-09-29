import { Link } from 'expo-router';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { cartSummary } from './cart-logic';
import { useCartStore } from './cart-store';

export function CartBadgeButton() {
  const itemCount = useCartStore((s) => cartSummary(s.lines).itemCount);

  return (
    <Link href="/cart" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Cart, ${itemCount} items`}
        hitSlop={8}
        style={styles.button}>
        <ThemedText type="smallBold">Cart ({itemCount})</ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  // Native headers inset their buttons; the web header does not.
  button: Platform.select({ web: { paddingHorizontal: Spacing.three }, default: {} }),
});
