/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Dropdown } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
];

function Chevron({ visible }: { visible?: boolean }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(visible ? '180deg' : '0deg') }],
  }));
  return (
    <Animated.Text style={[{ fontSize: 18, color: '#334155' }, style]}>
      ▾
    </Animated.Text>
  );
}

export default function AnimatedChevronDemo() {
  const [value, setValue] = useState<string>();

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        Custom chevron rotates 180° on open using Reanimated 4. The
        library passes the current `visible` flag to
        `renderRightIcon`.
      </Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder="Pick an option"
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        onChange={(item) => setValue(item.value)}
        renderRightIcon={(visible) => <Chevron visible={visible} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  caption: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  dropdown: {
    height: 50,
    borderColor: '#cbd5e1',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: { fontSize: 16, color: '#94a3b8' },
  selectedTextStyle: { fontSize: 16, color: '#0f172a' },
});
