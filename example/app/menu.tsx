import { Stack } from 'expo-router';

import Menu from '../src/dropdown/Menu';
import { DemoScreen } from './_shared';

export default function MenuRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Menu' }} />
      <Menu />
    </DemoScreen>
  );
}
