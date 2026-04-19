import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MultiSelect } from '@carlos3g/element-dropdown';

// `inside={true}` renders the selected chip row inline in the trigger
// instead of below it. Good for form-style UIs where the component
// should look like a single input.

const data = [
  { label: 'TypeScript', value: 'ts' },
  { label: 'React Native', value: 'rn' },
  { label: 'Expo', value: 'expo' },
  { label: 'Next.js', value: 'next' },
  { label: 'Node.js', value: 'node' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Python', value: 'py' },
];

export default function MultiSelectInside() {
  const [value, setValue] = useState<string[]>(['ts', 'rn']);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your stack</Text>
      <MultiSelect
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick your tools"
        search
        searchPlaceholder="Search technologies…"
        value={value}
        onChange={setValue}
        inside
        renderSelectedItem={(item, unSelect) => (
          <Pressable
            onPress={() => unSelect?.(item)}
            style={styles.chip}
            hitSlop={6}
          >
            <Text style={styles.chipLabel}>{item.label}</Text>
            <Text style={styles.chipClose}>×</Text>
          </Pressable>
        )}
        style={styles.trigger}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
        inputSearchStyle={styles.searchInput}
      />
      <Text style={styles.caption}>
        Selected items render inline. `renderSelectedItem` gives full
        control over each chip — tap to remove.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  trigger: {
    minHeight: 50,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  selected: {
    color: '#0f172a',
    fontSize: 14,
  },
  searchInput: {
    height: 42,
    fontSize: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginVertical: 4,
    gap: 6,
  },
  chipLabel: {
    color: '#3730a3',
    fontSize: 12,
    fontWeight: '600',
  },
  chipClose: {
    color: '#3730a3',
    fontSize: 16,
    lineHeight: 16,
  },
  caption: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
});
