---
id: sectioned-lists
title: Sectioned lists
sidebar_position: 19
description: Group dropdown items under headings using the sections prop — swaps FlatList for SectionList internally while keeping the rest of the API unchanged.
---

# How do I group dropdown items under headings?

Pass `sections` instead of `data`. Both `Dropdown` and
`MultiSelect` accept it. When present, the component renders a
`SectionList` with sticky headers; all other behavior (search,
selection, `onChange`, `disabledField`, etc.) is unchanged.

```tsx
import { Dropdown } from '@carlos3g/element-dropdown';

type Fruit = { label: string; value: string };

const sections = [
  {
    title: 'Berries',
    data: [
      { label: 'Strawberry', value: 'str' },
      { label: 'Blueberry', value: 'blu' },
      { label: 'Raspberry', value: 'ras' },
    ],
  },
  {
    title: 'Citrus',
    data: [
      { label: 'Lemon', value: 'lem' },
      { label: 'Orange', value: 'ora' },
      { label: 'Grapefruit', value: 'gra' },
    ],
  },
];

export function FruitPicker({ value, onChange }) {
  return (
    <Dropdown
      sections={sections}
      labelField="label"
      valueField="value"
      value={value}
      onChange={(item) => onChange(item.value)}
      search
      placeholder="Pick a fruit"
    />
  );
}
```

## `data` vs `sections`

- Use **`data`** when your list is a flat array.
- Use **`sections`** when items logically group under a title.

The two are mutually exclusive. If you pass `sections`, `data` is
ignored. If you pass neither, the list is empty.

## Search filters per-section

When `search` is enabled, typing filters items **inside each
section**. Sections that lose all their matches are hidden — you
won't see a lonely header with no rows underneath.

## Default header styling

The built-in section header is an uppercase label on a light gray
background:

- `backgroundColor: '#F5F5F5'`
- `fontSize: 12`, `fontWeight: 600`, `textTransform: 'uppercase'`
- `hairline` bottom border

Tweak it without writing a full renderer:

```tsx
<Dropdown
  sections={sections}
  sectionHeaderStyle={{ backgroundColor: '#EEF2FF' }}
  sectionHeaderTextStyle={{ color: '#4338CA', fontWeight: '700' }}
  // …
/>
```

## Fully custom header

For anything beyond styling tweaks, return your own JSX from
`renderSectionHeader`. The callback receives the full section:

```tsx
import { View, Text } from 'react-native';

<Dropdown
  sections={sections}
  renderSectionHeader={(section) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#0f172a',
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600' }}>
        {section.title}
      </Text>
      <Text style={{ color: '#94a3b8' }}>{section.data.length}</Text>
    </View>
  )}
  // …
/>;
```

Typical uses:

- Counter chips (`"3 items"`) per group
- Collapsible headers driven by local state
- Brand-colored dividers

## Interaction with other props

| Prop | How it interacts with sections |
|---|---|
| `search` / `searchField` / `searchQuery` | Matching runs per-section; sections with no remaining matches are hidden. |
| `disabledField` | Works per-row exactly like in flat mode. |
| `activeColor` / `activeItemTextStyle` | Applied to the selected row wherever it lives. |
| `excludeItems` / `excludeSearchItems` | Applied to each section's `data`. |
| `hideSelectedFromList` | Drops the current selection (or, for MultiSelect, every current selection) from all sections. |
| `selectedToTop` (MultiSelect) | Sorts **within** each section, not across. |
| `renderItem` | Still controls how each row renders. Sections only affect grouping + headers. |
| `autoScroll` | Skipped in sectioned mode — section headers shift offsets, so we don't try to restore scroll to a specific row. |
| `flatListProps` | Ignored — the inner list is a `SectionList`. Use `renderSectionHeader` and the style props for customization. |

## See also

- [Custom search field](./custom-search-field) — works identically
  when sections are used; pass `searchField` or an array of fields.
- [Pagination with `onEndReached`](./end-reached-pagination) —
  fires at the end of the full sectioned list.
