import { Stack } from 'expo-router';

import LayoutAnimationDemo from '../src/dropdown/LayoutAnimationDemo';
import { DemoScreen } from './_shared';

export default function LayoutAnimationRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'LayoutAnimation (zero-dep)' }} />
      <LayoutAnimationDemo />
    </DemoScreen>
  );
}
