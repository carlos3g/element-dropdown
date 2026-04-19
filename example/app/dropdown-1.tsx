import { Stack } from 'expo-router';

import Dropdown1 from '../src/dropdown/Dropdown1';
import { DemoScreen } from './_shared';

export default function Dropdown1Route() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Dropdown — basic' }} />
      <Dropdown1 />
    </DemoScreen>
  );
}
