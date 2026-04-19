import { Stack } from 'expo-router';

import MultiSelectAll from '../src/dropdown/MultiSelectAll';
import { DemoScreen } from './_shared';

export default function MultiSelectAllRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'MultiSelect — all features' }} />
      <MultiSelectAll />
    </DemoScreen>
  );
}
