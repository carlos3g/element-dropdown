import { Stack } from 'expo-router';

import DropdownWithConfirm from '../src/dropdown/DropdownWithConfirm';
import { DemoScreen } from './_shared';

export default function DropdownWithConfirmRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Dropdown — confirm selection' }} />
      <DropdownWithConfirm />
    </DemoScreen>
  );
}
