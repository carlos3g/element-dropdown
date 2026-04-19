import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown, MultiSelect } from '@carlos3g/element-dropdown';
import type { Section } from '@carlos3g/element-dropdown';

// Fork-only feature: pass `sections` instead of `data` to group items
// under sticky headers. Both Dropdown and MultiSelect accept it, and
// search filters per-section — sections that lose every match are
// hidden so a lonely header never renders.

type Fruit = { label: string; value: string };

const sections: Section<Fruit>[] = [
  {
    title: 'Berries',
    data: [
      { label: 'Strawberry', value: 'str' },
      { label: 'Blueberry', value: 'blu' },
      { label: 'Raspberry', value: 'ras' },
      { label: 'Blackberry', value: 'bla' },
    ],
  },
  {
    title: 'Citrus',
    data: [
      { label: 'Lemon', value: 'lem' },
      { label: 'Orange', value: 'ora' },
      { label: 'Grapefruit', value: 'gra' },
      { label: 'Lime', value: 'lim' },
    ],
  },
  {
    title: 'Tropical',
    data: [
      { label: 'Mango', value: 'man' },
      { label: 'Papaya', value: 'pap' },
      { label: 'Pineapple', value: 'pin' },
      { label: 'Passionfruit', value: 'pas' },
    ],
  },
];

export default function SectionedLists() {
  const [single, setSingle] = useState<string | null>(null);
  const [many, setMany] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Single-select with sections</Text>
      <Dropdown
        sections={sections}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        search
        searchPlaceholder="Search (filters within each section)…"
        value={single}
        onChange={(item) => setSingle(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
      />

      <Text style={[styles.heading, styles.headingSpaced]}>
        MultiSelect with a styled header
      </Text>
      <MultiSelect
        sections={sections}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        search
        searchPlaceholder="Type to filter…"
        value={many}
        onChange={setMany}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
        sectionHeaderStyle={styles.headerView}
        sectionHeaderTextStyle={styles.headerText}
      />
      <Text style={styles.caption}>
        Section headers stick to the top while you scroll. Tweak the
        default look with `sectionHeaderStyle` and
        `sectionHeaderTextStyle`, or return your own JSX from
        `renderSectionHeader` for full control.
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
  headingSpaced: {
    marginTop: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  selected: {
    color: '#0f172a',
    fontSize: 14,
  },
  headerView: {
    backgroundColor: '#eef2ff',
    borderBottomColor: '#c7d2fe',
  },
  headerText: {
    color: '#4338ca',
  },
  caption: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
});
