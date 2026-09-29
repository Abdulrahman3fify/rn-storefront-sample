import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EmptyView, ErrorView, LoadingView } from '@/components/state-views';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/hooks/use-theme';

import { ProductCard } from './product-card';
import { useProducts } from './queries';

export function CatalogScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const query = useDebouncedValue(search.trim());
  const products = useProducts(query);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel="Search products"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={[styles.search, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />
      </View>
      {products.isPending ? (
        <LoadingView />
      ) : products.isError ? (
        <ErrorView message="We couldn't load products." onRetry={() => products.refetch()} />
      ) : (
        <FlatList
          data={products.data}
          keyExtractor={(p) => String(p.id)}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (products.hasNextPage && !products.isFetchingNextPage) products.fetchNextPage();
          }}
          refreshing={products.isRefetching && !products.isFetchingNextPage}
          onRefresh={() => products.refetch()}
          ListEmptyComponent={<EmptyView message={`No products match “${query}”.`} />}
          ListFooterComponent={products.isFetchingNextPage ? <ActivityIndicator /> : null}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  search: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    fontSize: 16,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
