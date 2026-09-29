import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { CartBadgeButton } from '@/features/cart/cart-badge-button';
import { createQueryClient } from '@/lib/query-client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerRight: () => <CartBadgeButton /> }}>
          <Stack.Screen name="index" options={{ title: 'Storefront' }} />
          <Stack.Screen name="product/[id]" options={{ title: '' }} />
          <Stack.Screen
            name="cart"
            options={{ title: 'Cart', presentation: 'modal', headerRight: undefined }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
