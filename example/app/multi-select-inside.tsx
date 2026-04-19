import { Stack } from 'expo-router';

import MultiSelectInside from '../src/dropdown/MultiSelectInside';
import { DemoScreen } from './_shared';

export default function MultiSelectInsideRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'MultiSelect — inside mode' }} />
      <MultiSelectInside />
    </DemoScreen>
  );
}
