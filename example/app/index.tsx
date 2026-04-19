import { Link } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Demo = {
  href:
    | '/menu'
    | '/dropdown-1'
    | '/dropdown-2'
    | '/dropdown-with-confirm'
    | '/dropdown-lazy-load'
    | '/country-select-1'
    | '/country-select-2'
    | '/multi-select-all'
    | '/multi-select-with-confirm'
    | '/disabled-items'
    | '/inside-modal'
    | '/custom-search-matcher'
    | '/multi-select-inside';
  title: string;
  description: string;
  section: 'Dropdown' | 'MultiSelect' | 'SelectCountry' | 'Fork-only';
};

const demos: Demo[] = [
  // Dropdown
  {
    href: '/menu',
    title: 'Menu',
    description: 'Dropdown used as a menu trigger.',
    section: 'Dropdown',
  },
  {
    href: '/dropdown-1',
    title: 'Dropdown — basic',
    description: 'Simple single-select with label.',
    section: 'Dropdown',
  },
  {
    href: '/dropdown-2',
    title: 'Dropdown — imperative ref',
    description: 'Open and close the list from outside the component.',
    section: 'Dropdown',
  },
  {
    href: '/dropdown-with-confirm',
    title: 'Dropdown — confirm selection',
    description: 'Defer selection until the user confirms.',
    section: 'Dropdown',
  },
  {
    href: '/dropdown-lazy-load',
    title: 'Dropdown — lazy load',
    description: 'Fetch list items on open.',
    section: 'Dropdown',
  },
  {
    href: '/custom-search-matcher',
    title: 'Dropdown — custom search matcher',
    description:
      'Accent-insensitive filtering with a custom `searchQuery`.',
    section: 'Dropdown',
  },
  // MultiSelect
  {
    href: '/multi-select-all',
    title: 'MultiSelect — all features',
    description: 'Chip row, search, custom render.',
    section: 'MultiSelect',
  },
  {
    href: '/multi-select-with-confirm',
    title: 'MultiSelect — confirm',
    description: 'Confirm each toggle before committing.',
    section: 'MultiSelect',
  },
  {
    href: '/multi-select-inside',
    title: 'MultiSelect — inside mode',
    description:
      'Selected chips render inline in the trigger with custom chips.',
    section: 'MultiSelect',
  },
  // SelectCountry
  {
    href: '/country-select-1',
    title: 'SelectCountry — basic',
    description: 'A dropdown variant that renders an image per item.',
    section: 'SelectCountry',
  },
  {
    href: '/country-select-2',
    title: 'SelectCountry — styled',
    description: 'Customized flag picker.',
    section: 'SelectCountry',
  },
  // Fork-only
  {
    href: '/disabled-items',
    title: 'Disabled items (disabledField)',
    description:
      'Mark individual items as non-interactive without forking renderItem.',
    section: 'Fork-only',
  },
  {
    href: '/inside-modal',
    title: 'Nested inside a Modal (isInsideModal)',
    description:
      'Correct positioning when the dropdown lives inside a native Modal.',
    section: 'Fork-only',
  },
];

const sections: Demo['section'][] = [
  'Dropdown',
  'MultiSelect',
  'SelectCountry',
  'Fork-only',
];

export default function Home() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>
        Hands-on examples of every component. Tap a card to open the
        corresponding route.
      </Text>
      {sections.map((section) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionHeader}>{section}</Text>
          {demos
            .filter((demo) => demo.section === section)
            .map((demo) => (
              <Link key={demo.href} href={demo.href} asChild>
                <TouchableOpacity
                  accessibilityRole="link"
                  activeOpacity={0.7}
                  style={styles.card}
                >
                  <Text style={styles.title}>{demo.title}</Text>
                  <Text style={styles.description}>{demo.description}</Text>
                </TouchableOpacity>
              </Link>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  intro: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
