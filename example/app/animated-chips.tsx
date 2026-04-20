import { Stack } from 'expo-router';

import AnimatedChips from '../src/dropdown/AnimatedChips';
import { DemoScreen } from './_shared';

export default function AnimatedChipsRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Animated chips' }} />
      <AnimatedChips />
    </DemoScreen>
  );
}
