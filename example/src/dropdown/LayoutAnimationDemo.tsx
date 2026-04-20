/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { MultiSelect } from '@carlos3g/element-dropdown';

// Android opt-in for LayoutAnimation — iOS has it enabled by default.
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'Coffee', value: 'coffee' },
  { label: 'Tea', value: 'tea' },
  { label: 'Matcha', value: 'matcha' },
  { label: 'Cocoa', value: 'cocoa' },
  { label: 'Juice', value: 'juice' },
];

export default function LayoutAnimationDemo() {
  const [value, setValue] = useState<string[]>([]);

  // Prime the next layout pass right after state changes so that the
  // chip row reflows with a native ease-in-out instead of jumping.
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        Zero peer-dependency option: React Native's built-in
        `LayoutAnimation.configureNext()` runs right before the next
        layout pass. No Reanimated, no Moti — just the RN native
        driver. Try adding and removing drinks.
      </Text>
      <MultiSelect
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder="Pick drinks"
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        onChange={setValue}
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
