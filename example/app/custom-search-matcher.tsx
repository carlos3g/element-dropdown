import { Stack } from 'expo-router';

import CustomSearchMatcher from '../src/dropdown/CustomSearchMatcher';
import { DemoScreen } from './_shared';

export default function CustomSearchMatcherRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Custom search matcher' }} />
      <CustomSearchMatcher />
    </DemoScreen>
  );
}
