import { Stack } from 'expo-router';

import AnimatedChevron from '../src/dropdown/AnimatedChevron';
import { DemoScreen } from './_shared';

export default function AnimatedChevronRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Animated chevron' }} />
      <AnimatedChevron />
    </DemoScreen>
  );
}
