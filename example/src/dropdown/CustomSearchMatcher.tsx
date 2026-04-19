import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

// `searchQuery` lets you replace the default substring match entirely.
// This demo strips diacritics and lowercases both sides before comparing,
// so searching "sao" matches "São Paulo".

const data = [
  { label: 'São Paulo', value: 'sp' },
  { label: 'Rio de Janeiro', value: 'rj' },
  { label: 'Brasília', value: 'bsb' },
  { label: 'Belo Horizonte', value: 'bh' },
  { label: 'Curitiba', value: 'cwb' },
  { label: 'Porto Alegre', value: 'poa' },
  { label: 'Fortaleza', value: 'for' },
  { label: 'Recife', value: 'rec' },
  { label: 'Salvador', value: 'ssa' },
  { label: 'Manaus', value: 'mao' },
];

const normalize = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export default function CustomSearchMatcher() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pick a Brazilian capital</Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Search (try typing 'sao' or 'bsb')"
        search
        searchPlaceholder="Search…"
        value={value}
        onChange={(item) => setValue(item.value)}
        searchQuery={(keyword, labelValue) =>
          normalize(labelValue).includes(normalize(keyword))
        }
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
        inputSearchStyle={styles.searchInput}
      />
      <Text style={styles.caption}>
        The matcher normalises both sides (lowercase + strip diacritics),
        so search is accent-insensitive. Extend it to match by
        non-label fields or do fuzzy matching.
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
  searchInput: {
    height: 42,
    fontSize: 14,
  },
  caption: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
});
