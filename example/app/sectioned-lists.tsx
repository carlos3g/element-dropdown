import { Stack } from 'expo-router';

import SectionedLists from '../src/dropdown/SectionedLists';
import { DemoScreen } from './_shared';

export default function SectionedListsRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Sectioned lists' }} />
      <SectionedLists />
    </DemoScreen>
  );
}
