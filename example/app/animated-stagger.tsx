import { Stack } from 'expo-router';

import AnimatedStagger from '../src/dropdown/AnimatedStagger';
import { DemoScreen } from './_shared';

export default function AnimatedStaggerRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Staggered row enter' }} />
      <AnimatedStagger />
    </DemoScreen>
  );
}
