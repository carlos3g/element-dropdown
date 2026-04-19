import { Stack } from 'expo-router';

import CountrySelect2 from '../src/dropdown/CountrySelect2';
import { DemoScreen } from './_shared';

export default function CountrySelect2Route() {
  return (
    <DemoScreen>
      <Stack.Screen options={{ title: 'SelectCountry — styled' }} />
      <CountrySelect2 />
    </DemoScreen>
  );
}
