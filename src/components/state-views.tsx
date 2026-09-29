import { ActivityIndicator, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function LoadingView() {
  return (
    <ThemedView style={styles.center}>
      <ActivityIndicator accessibilityLabel="Loading" />
    </ThemedView>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <ThemedView style={styles.center}>
      <ThemedText style={styles.text}>{message}</ThemedText>
      <Button label="Try again" onPress={onRetry} />
    </ThemedView>
  );
}

export function EmptyView({ message }: { message: string }) {
  return (
    <ThemedView style={styles.center}>
      <ThemedText themeColor="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  text: {
    textAlign: 'center',
  },
});
