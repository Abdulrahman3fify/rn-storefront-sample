import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = {
  label: string;
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
};

export function QuantityStepper({ label, quantity, max, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Button
        variant="secondary"
        label="−"
        accessibilityLabel={`Decrease ${label}`}
        onPress={() => onChange(quantity - 1)}
      />
      <ThemedText accessibilityLabel={`${label} quantity`} style={styles.value}>
        {quantity}
      </ThemedText>
      <Button
        variant="secondary"
        label="+"
        accessibilityLabel={`Increase ${label}`}
        disabled={quantity >= max}
        onPress={() => onChange(quantity + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  value: {
    minWidth: 24,
    textAlign: 'center',
  },
});
