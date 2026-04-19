import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: '@carlos3g/element-dropdown' }}
        />
      </Stack>
    </>
  );
}
