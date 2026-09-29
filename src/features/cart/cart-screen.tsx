import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { EmptyView } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { formatMoney } from '@/lib/money';

import { CartLineRow } from './cart-line-row';
import { cartSummary } from './cart-logic';
import { useCartStore } from './cart-store';

export function CartScreen() {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const { itemCount, subtotalCents } = cartSummary(lines);
  const data = Object.values(lines);

  if (data.length === 0) return <EmptyView message="Your cart is empty." />;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(line) => String(line.productId)}
        renderItem={({ item }) => <CartLineRow line={item} />}
        contentContainerStyle={styles.list}
      />
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.totalRow}>
          <ThemedText themeColor="textSecondary">
            Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </ThemedText>
          <ThemedText type="smallBold" accessibilityLabel="Subtotal">
            {formatMoney(subtotalCents)}
          </ThemedText>
        </View>
        <Button label="Clear cart" variant="secondary" onPress={clear} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
