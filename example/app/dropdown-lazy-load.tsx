import { Stack } from 'expo-router';

import DropdownLazyLoad from '../src/dropdown/DropdownLazyLoad';
import { DemoScreen } from './_shared';

export default function DropdownLazyLoadRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Dropdown — lazy load' }} />
      <DropdownLazyLoad />
    </DemoScreen>
  );
}
