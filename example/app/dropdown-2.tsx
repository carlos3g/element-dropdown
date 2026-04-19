import { Stack } from 'expo-router';

import Dropdown2 from '../src/dropdown/Dropdown2';
import { DemoScreen } from './_shared';

export default function Dropdown2Route() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Dropdown — imperative ref' }} />
      <Dropdown2 />
    </DemoScreen>
  );
}
