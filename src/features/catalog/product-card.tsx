import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatMoney } from '@/lib/money';

import type { Product } from './api';

// Memoized: FlatList re-renders rows on every page append otherwise.
export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel={product.title}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <Image
            source={product.thumbnail}
            style={styles.image}
            contentFit="cover"
            transition={150}
            recyclingKey={String(product.id)}
          />
          <View style={styles.body}>
            <ThemedText numberOfLines={2}>{product.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {product.category} · ★ {product.rating.toFixed(1)}
            </ThemedText>
            <ThemedText type="smallBold">{formatMoney(product.priceCents)}</ThemedText>
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: Spacing.two,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
    justifyContent: 'center',
  },
});
