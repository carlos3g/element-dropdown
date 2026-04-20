/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { MultiSelect } from '@carlos3g/element-dropdown';

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Rust', value: 'rust' },
  { label: 'Go', value: 'go' },
  { label: 'Python', value: 'python' },
];

export default function AnimatedChipsDemo() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        Each chip enters/exits with FadeIn / FadeOut and reflows with
        LinearTransition — Reanimated handles the layout animation
        through the `renderSelectedItem` slot.
      </Text>
      <MultiSelect
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder="Pick languages"
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        maxHeight={320}
        onChange={setValue}
        renderSelectedItem={(item, unSelect) => (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(180)}
            layout={LinearTransition.duration(180)}
            style={styles.chip}
          >
            <Text style={styles.chipLabel}>{item.label}</Text>
            <Text
              onPress={() => unSelect?.(item)}
              style={styles.chipRemove}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.label}`}
            >
              ×
            </Text>
          </Animated.View>
        )}
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginRight: 8,
    marginBottom: 8,
  },
  chipLabel: {
    fontSize: 14,
    color: '#3730A3',
    fontWeight: '500',
  },
  chipRemove: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
});
