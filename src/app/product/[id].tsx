import { useLocalSearchParams } from 'expo-router';

import { ProductScreen } from '@/features/catalog/product-screen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductScreen id={Number(id)} />;
}
