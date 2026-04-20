---
id: dropdown
title: Dropdown
sidebar_position: 1
description: React Native Dropdown component API — props, imperative ref, search, keyboard avoidance, Modal positioning, accessibility.
keywords:
  - react native dropdown
  - react native dropdown props
  - react native combobox
  - react native select component
  - searchable dropdown
  - IDropdownRef
---

# `Dropdown`

Single-select dropdown. The user taps the trigger, picks one item
from a list, and the list closes.

## Minimal example

```tsx
import { useState } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

export function FruitPicker() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick a fruit"
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}
```

## Props

### Required

| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Flat array of items. Pass `sections` instead for grouped rendering. |
| `labelField` | `keyof T` | Field on each item to use as the visible label. |
| `valueField` | `keyof T` | Field on each item that identifies it uniquely. |
| `onChange` | `(item: T) => void` | Fires with the selected item when the user picks from the list. |

### Sections (optional — alternative to `data`)

| Prop | Type | Description |
|---|---|---|
| `sections` | `{ title: string; data: T[] }[]` | Groups of items rendered under section headers. When provided, `data` is ignored. See [Sectioned lists](../guides/sectioned-lists). |
| `renderSectionHeader` | `(section) => ReactElement \| null` | Fully custom header renderer. |
| `sectionHeaderStyle` | `ViewStyle` | Style for the default header container. |
| `sectionHeaderTextStyle` | `TextStyle` | Style for the default header `<Text>`. |

### Value and display

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `T \| string \| null` | `undefined` | Currently selected value. Can be the full item or just the `valueField` value. |
| `placeholder` | `string` | `'Select item'` | Shown when no value is selected. |
| `placeholderStyle` | `TextStyle` | — | Style for the placeholder text. |
| `selectedTextStyle` | `TextStyle` | — | Style for the label when an item is selected. |
| `selectedTextProps` | `TextProps` | `{}` | Extra props spread onto the selected-label `<Text>` (e.g. `numberOfLines`). |

### Container and layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | `ViewStyle` | — | Style for the outer wrapper. |
| `containerStyle` | `ViewStyle` | — | Style for the floating list container. |
| `backgroundColor` | `string` | — | Color of the scrim behind the modal in full-screen modes. |
| `maxHeight` | `number` | `340` | Max height of the list. |
| `minHeight` | `number` | `0` | Min height of the list. |
| `mode` | `'default' \| 'modal' \| 'auto'` | `'default'` | `'modal'` centers the list on screen; `'auto'` measures trigger position. |
| `dropdownPosition` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | Force the list to open above or below the trigger. |
| `inverted` | `boolean` | `true` | Reverses scroll direction when positioned above the trigger. |
| `isInsideModal` | `boolean` | `false` | Set to `true` when the Dropdown is rendered inside a React Native `<Modal>` so the status-bar offset isn't double-counted. See [Nest inside a Modal](../guides/nested-in-modal). |

### Items

| Prop | Type | Default | Description |
|---|---|---|---|
| `itemContainerStyle` | `ViewStyle` | — | Style merged on top of the built-in row style. Use this to change padding. |
| `itemTextStyle` | `TextStyle` | — | Style for the default item label text. |
| `activeItemTextStyle` | `TextStyle` | — | Extra text style applied only to the currently-selected row. |
| `activeColor` | `string` | `'#F6F7F8'` | Background color of the currently selected row in the list. |
| `renderItem` | `(item: T, selected?: boolean) => ReactElement` | — | Fully custom row renderer. Overrides the default label. |
| `disabledField` | `keyof T` | — | When set, items whose value at this field is truthy are non-interactive. |
| `hideSelectedFromList` | `boolean` | `false` | When `true`, the currently selected item is removed from the rendered list. |

### Search

| Prop | Type | Default | Description |
|---|---|---|---|
| `search` | `boolean` | `false` | Show the search input above the list. |
| `searchField` | `keyof T \| (keyof T)[]` | `labelField` | Which field(s) to match against. Pass an array to search several at once. See [Custom search field](../guides/custom-search-field). |
| `searchQuery` | `(keyword: string, labelValue: string) => boolean` | — | Fully custom matcher. See [Custom matcher](../guides/custom-search-matcher). |
| `searchKeyboardType` | `KeyboardTypeOptions` | — | `keyboardType` for the search input (e.g. `'numeric'`, `'email-address'`). |
| `searchInputProps` | `TextInputProps` | — | Extra props spread onto the underlying search `<TextInput>` (`selectionColor`, `returnKeyType`, `autoCapitalize`, etc.). See [Search input passthrough](../guides/search-input-props). |
| `persistSearch` | `boolean` | `false` | Keep the search text across opens / selections instead of clearing it. |
| `searchDebounce` | `number` | `0` | Debounce the filter pass by this many ms. The text input stays responsive; only the filter is throttled. Useful for lists in the thousands. |
| `inputSearchStyle` | `ViewStyle` | — | Style for the search input. |
| `searchPlaceholder` | `string` | — | Placeholder text for the search input. |
| `searchPlaceholderTextColor` | `string` | `'gray'` | Placeholder color for the search input. |
| `renderInputSearch` | `(onSearch: (text: string) => void) => ReactElement` | — | Fully custom search input. |
| `onChangeText` | `(text: string) => void` | — | Fires whenever the search text changes (including when the dropdown closes). |

### Icons & trigger

| Prop | Type | Default | Description |
|---|---|---|---|
| `iconStyle` | `ImageStyle` | — | Style for the default right-side chevron. |
| `iconColor` | `string` | `'gray'` | Tint for the default right-side chevron. |
| `renderLeftIcon` | `(visible?: boolean) => ReactElement \| null` | — | Custom left icon; receives whether the list is open. |
| `renderRightIcon` | `(visible?: boolean) => ReactElement \| null` | — | Custom right icon; receives whether the list is open. See [Icons per state](../guides/icon-per-state). |
| `renderSelectedItem` | `(visible?: boolean) => ReactElement \| null` | — | Replace the entire trigger body (left icon, label, right icon) with a custom layout. See [Custom trigger](../guides/custom-trigger). |
| `renderModalHeader` | `(close: () => void) => ReactElement \| null` | — | Renders a header view above the list inside the modal. Receives a `close()` to dismiss. See [Modal header](../guides/modal-header). |

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `disable` | `boolean` | `false` | When `true`, tapping the trigger does nothing. |
| `autoScroll` | `boolean` | `true` | On open, scroll the list to the currently-selected row. Ignored while the list is filtered. |
| `keyboardAvoiding` | `boolean` | `true` | Lift the list when the search input raises the keyboard. |
| `confirmSelectItem` | `boolean` | `false` | When `true`, selecting an item calls `onConfirmSelectItem` instead of `onChange`. |
| `onConfirmSelectItem` | `(item: T) => void` | — | Called when `confirmSelectItem` is `true`. |
| `closeModalWhenSelectedItem` | `boolean` | `true` | When `false`, the list stays open after a selection. |
| `showsVerticalScrollIndicator` | `boolean` | `true` | Shows the vertical scroll indicator on the list. |
| `flatListProps` | `Omit<FlatListProps<T>, 'renderItem' \| 'data'>` | — | Passthrough to the underlying `FlatList`. |
| `renderEmpty` | `(searchText: string) => ReactElement \| null` | — | Custom view rendered when the list has no rows — either empty `data` / `sections` or a search that filters everything out. The callback receives the current search query so you can switch between "no data" and "no results for X" copy. |
| `onEndReached` | `() => void` | — | Fires when the list scrolls within `onEndReachedThreshold` of the bottom. See [Pagination](../guides/end-reached-pagination). |
| `onEndReachedThreshold` | `number` | `0.5` | Distance from the end (in viewport units) at which `onEndReached` fires. |
| `excludeItems` | `T[]` | `[]` | Items to hide from the rendered list. |
| `excludeSearchItems` | `T[]` | `[]` | Items that show in the list but are excluded from search matches. |

### Callbacks

| Prop | Type | Description |
|---|---|---|
| `onFocus` | `() => void` | Fires when the list opens. |
| `onBlur` | `() => void` | Fires when the list closes. |

### Text rendering

| Prop | Type | Default | Description |
|---|---|---|---|
| `fontFamily` | `string` | — | Applied to trigger label, item labels, and the search input. |
| `allowFontScaling` | `boolean` | RN default | Propagated to every `Text` and `TextInput` the component renders. |

### Accessibility

| Prop | Type | Description |
|---|---|---|
| `accessibilityLabel` | `string` | Label for the trigger. Propagated as `{label} input` to the search field and `{label} flatlist` to the list. |
| `accessibilityHint` | `string` | Hint for the trigger, announced after the label and role. |
| `itemAccessibilityLabelField` | `string` | Field on each item to use for per-item `accessibilityLabel`. Defaults to `labelField`. |
| `testID` | `string` | testID for the trigger. Propagated as `{testID} input` / `{testID} flatlist`. |
| `itemTestIDField` | `string` | Field on each item to use as its `testID`. Defaults to `labelField`. |
| `hitSlop` | `Insets \| number` | Expand the trigger's tap target. |

Triggers expose `accessibilityRole="combobox"` and
`accessibilityState.expanded` / `.disabled`. Items expose
`accessibilityRole="button"` plus `accessibilityState.selected`
and `.disabled`. The open modal is scoped with
`accessibilityViewIsModal`, and the OS-level "Reduce Motion"
preference disables the modal animation automatically. See
[Accessibility](../accessibility).

## Imperative ref

```tsx
import { useRef } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';
import type { IDropdownRef } from '@carlos3g/element-dropdown';

const ref = useRef<IDropdownRef>(null);

<Dropdown ref={ref} {/* … */} />
<Button title="Open" onPress={() => ref.current?.open()} />
<Button title="Close" onPress={() => ref.current?.close()} />
```

See [Open and close programmatically](../guides/imperative-open-close).

## Related guides

- [Custom search field](../guides/custom-search-field)
- [Custom search matcher](../guides/custom-search-matcher)
- [Search input passthrough](../guides/search-input-props)
- [Sectioned lists](../guides/sectioned-lists)
- [Pagination with `onEndReached`](../guides/end-reached-pagination)
- [Custom trigger](../guides/custom-trigger)
- [Modal header](../guides/modal-header)
- [Disabled items](../guides/disabled-items)
- [Nest inside a Modal](../guides/nested-in-modal)
- [Icons per open state](../guides/icon-per-state)
- [Bigger tap targets](../guides/hit-slop)
