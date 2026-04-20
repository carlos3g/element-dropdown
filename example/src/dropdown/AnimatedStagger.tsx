/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import { Dropdown } from '@carlos3g/element-dropdown';

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Blackberry', value: 'blackberry' },
  { label: 'Cranberry', value: 'cranberry' },
  { label: 'Mulberry', value: 'mulberry' },
];

export default function AnimatedStaggerDemo() {
  const [value, setValue] = useState<string>();

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        Each row enters with a staggered fade/slide keyed off the
        `index` that `renderItem(item, selected, index)` now passes.
        Uses Moti (built on Reanimated).
      </Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder="Pick a berry"
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        maxHeight={320}
        onChange={(item) => setValue(item.value)}
        renderItem={(item, selected, index = 0) => (
          <MotiView
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: index * 40 }}
            style={styles.row}
          >
            <Text
              style={[
                styles.rowLabel,
                selected && { fontWeight: '700', color: '#4f46e5' },
              ]}
            >
              {item.label}
            </Text>
          </MotiView>
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
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLabel: { fontSize: 16, color: '#0f172a' },
});
