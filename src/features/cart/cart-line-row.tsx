import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatMoney } from '@/lib/money';

import type { CartLine } from './cart-logic';
import { useCartStore } from './cart-store';
import { QuantityStepper } from './quantity-stepper';

export function CartLineRow({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((s) => s.setQuantity);

  return (
    <View style={styles.row}>
      <Image source={line.thumbnail} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <ThemedText numberOfLines={1}>{line.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatMoney(line.unitPriceCents)} each
        </ThemedText>
        <QuantityStepper
          label={line.title}
          quantity={line.quantity}
          max={line.stock}
          onChange={(q) => setQuantity(line.productId, q)}
        />
      </View>
      <ThemedText type="smallBold">{formatMoney(line.unitPriceCents * line.quantity)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: Spacing.two,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
  },
});
