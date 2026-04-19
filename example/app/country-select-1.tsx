import { Stack } from 'expo-router';

import CountrySelect1 from '../src/dropdown/CountrySelect1';
import { DemoScreen } from './_shared';

export default function CountrySelect1Route() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'SelectCountry — basic' }} />
      <CountrySelect1 />
    </DemoScreen>
  );
}
