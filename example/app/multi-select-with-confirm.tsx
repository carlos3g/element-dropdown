import { Stack } from 'expo-router';

import MultiSelectWithConfirm from '../src/dropdown/MultiSelectWithConfirm';
import { DemoScreen } from './_shared';

export default function MultiSelectWithConfirmRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'MultiSelect — confirm' }} />
      <MultiSelectWithConfirm />
    </DemoScreen>
  );
}
