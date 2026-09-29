import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCartStore } from '@/features/cart/cart-store';
import { formatMoney } from '@/lib/money';

import { useProduct } from './queries';

export function ProductScreen({ id }: { id: number }) {
  const product = useProduct(id);
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.lines[id]?.quantity ?? 0);

  // A malformed deep link (/product/abc) disables the query, which would otherwise stay pending forever.
  if (!Number.isInteger(id)) return <EmptyView message="Product not found." />;
  if (product.isPending) return <LoadingView />;
  if (product.isError) {
    return <ErrorView message="We couldn't load this product." onRetry={() => product.refetch()} />;
  }

  const { data } = product;
  const soldOut = inCart >= data.stock;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: data.title }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={data.thumbnail} style={styles.image} contentFit="contain" />
        <ThemedText type="subtitle">{data.title}</ThemedText>
        <ThemedText type="smallBold">{formatMoney(data.priceCents)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {data.category} · ★ {data.rating.toFixed(1)} · {data.stock} in stock
        </ThemedText>
        <ThemedText>{data.description}</ThemedText>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button
          label={
            soldOut
              ? 'No more stock'
              : inCart > 0
                ? `Add another (${inCart} in cart)`
                : 'Add to cart'
          }
          disabled={soldOut}
          onPress={() => add(data)}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 360,
    alignSelf: 'center',
    borderRadius: Spacing.three,
  },
  footer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
  },
});
