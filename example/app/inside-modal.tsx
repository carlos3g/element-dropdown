import { Stack } from 'expo-router';

import InsideModal from '../src/dropdown/InsideModal';
import { DemoScreen } from './_shared';

export default function InsideModalRoute() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'Inside a Modal' }} />
      <InsideModal />
    </DemoScreen>
  );
}
