import { Stack } from 'expo-router';

import DisabledItems from '../src/dropdown/DisabledItems';
import { DemoScreen } from './_shared';

export default function DisabledItemsRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Disabled items' }} />
      <DisabledItems />
    </DemoScreen>
  );
}
