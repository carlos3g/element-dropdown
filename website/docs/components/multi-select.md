---
id: multi-select
title: MultiSelect
sidebar_position: 2
description: React Native MultiSelect component API — controlled selection, chip row, optional search, disabled items, imperative ref.
keywords:
  - react native multiselect
  - react native multi select
  - multi select dropdown
  - chip selector react native
  - IMultiSelectRef
---

# `MultiSelect`

Multi-select variant. The user taps the trigger, toggles one or
more items, and the selection renders as a row of chips either
below or inside the trigger.

## Minimal example

```tsx
import { useState } from 'react';
import { MultiSelect } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export function FruitBasket() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick fruits"
      value={value}
      onChange={setValue}
    />
  );
}
```

`MultiSelect` is controlled. `value` is the array of selected
`valueField` values; `onChange` fires with the new array every
time an item is toggled.

## Props

### Required

| Prop | Type | Description |
|---|---|---|
| `data` | `T[]` | Flat array of items. Pass `sections` instead for grouped rendering. |
| `labelField` | `keyof T` | Field on each item used as the visible label. |
| `valueField` | `keyof T` | Field on each item that identifies it uniquely. |
| `value` | `string[] \| null` | Currently selected `valueField` values. |
| `onChange` | `(value: string[]) => void` | Fires with the new selection array. |

### Sections (optional — alternative to `data`)

| Prop | Type | Description |
|---|---|---|
| `sections` | `{ title: string; data: T[] }[]` | Groups of items rendered under section headers. When provided, `data` is ignored. See [Sectioned lists](../guides/sectioned-lists). |
| `renderSectionHeader` | `(section) => ReactElement \| null` | Fully custom header renderer. |
| `sectionHeaderStyle` | `ViewStyle` | Style for the default header container. |
| `sectionHeaderTextStyle` | `TextStyle` | Style for the default header `<Text>`. |

### Display

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Select item'` | Trigger label when nothing is selected. |
| `placeholderStyle` | `TextStyle` | — | Style for the placeholder text. |
| `selectedTextStyle` | `TextStyle` | — | Style for the trigger label when the selection is non-empty. |
| `selectedTextProps` | `TextProps` | `{}` | Extra props for the trigger `<Text>`. |
| `maxSelect` | `number` | — | Cap on how many items can be selected. |
| `visibleSelectedItem` | `boolean` | `true` | When `false`, hides the chip row below the trigger. |
| `alwaysRenderSelectedItem` | `boolean` | `false` | When `true`, the chip row stays visible while the list is open. |
| `inside` | `boolean` | `false` | Render selected chips inside the trigger instead of below it. See [Inside mode](../guides/multi-select-inside-mode). |

### Container and layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | `ViewStyle` | — | Style for the outer wrapper. |
| `containerStyle` | `ViewStyle` | — | Style for the floating list container. |
| `backgroundColor` | `string` | — | Scrim color behind the modal in full-screen modes. |
| `maxHeight` | `number` | `340` | Max list height. |
| `minHeight` | `number` | `0` | Min list height. |
| `mode` | `'default' \| 'modal' \| 'auto'` | `'default'` | See the matching Dropdown prop. |
| `dropdownPosition` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | Force list above or below. |
| `inverted` | `boolean` | `true` | Reverses scroll when list opens above. |
| `isInsideModal` | `boolean` | `false` | Set when inside a React Native `<Modal>`. |

### Selected chips

| Prop | Type | Description |
|---|---|---|
| `selectedStyle` | `ViewStyle` | Style for each chip container. |
| `renderSelectedItem` | `(item: T, unSelect?: (item: T) => void) => ReactElement` | Fully custom chip renderer. |
| `renderChipRemoveIcon` | `(item: T) => ReactElement` | Replace the built-in `ⓧ` glyph on the default chip without reimplementing the whole chip. Ignored when `renderSelectedItem` is passed. |

### Items

| Prop | Type | Default | Description |
|---|---|---|---|
| `itemContainerStyle` | `ViewStyle` | — | Style merged on top of the built-in row style. |
| `itemTextStyle` | `TextStyle` | — | Style for the default item label. |
| `activeItemTextStyle` | `TextStyle` | — | Extra text style applied only to selected rows. |
| `activeColor` | `string` | `'#F6F7F8'` | Background of the row for already-selected items. |
| `renderItem` | `(item: T, selected?: boolean) => ReactElement` | — | Fully custom row renderer. |
| `disabledField` | `keyof T` | — | Marks individual items as non-interactive. |
| `hideSelectedFromList` | `boolean` | `false` | Hide already-selected items from the rendered list. |
| `selectedToTop` | `boolean` | `false` | Sort selected items to the top of the list (no-op when `hideSelectedFromList` is `true`). See [Selected-item ordering](../guides/selected-ordering). |

### Search

Same props as [Dropdown](./dropdown#search): `search`, `searchField`
(supports `keyof T` or `(keyof T)[]`), `searchQuery`,
`searchKeyboardType`, `searchInputProps`, `persistSearch`,
`searchDebounce`, `inputSearchStyle`, `searchPlaceholder`,
`searchPlaceholderTextColor`, `renderInputSearch`, `onChangeText`.

### Icons & modal header

Same as Dropdown: `iconStyle`, `iconColor`, `renderLeftIcon`,
`renderRightIcon`. MultiSelect also accepts:

| Prop | Type | Description |
|---|---|---|
| `renderModalHeader` | `(close: () => void) => ReactElement \| null` | Renders a header view above the list inside the modal. See [Modal header](../guides/modal-header). |

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `disable` | `boolean` | `false` | Disable the trigger. |
| `keyboardAvoiding` | `boolean` | `true` | Lift the list when the keyboard opens. |
| `confirmSelectItem` | `boolean` | `false` | Call `onConfirmSelectItem` on toggles instead of immediately mutating `value`. |
| `confirmUnSelectItem` | `boolean` | `false` | Same but for un-toggling. |
| `onConfirmSelectItem` | `(item: T) => void` | — | Confirm handler. |
| `closeModalWhenSelectedItem` | `boolean` | `false` | When `true`, the list closes after each toggle. Defaults to `false` to match typical multi-select UX (keep selecting). |
| `showsVerticalScrollIndicator` | `boolean` | `true` | Scroll indicator on the list. |
| `flatListProps` | `Omit<FlatListProps<T>, 'renderItem' \| 'data'>` | — | Passthrough to the underlying `FlatList`. |
| `onEndReached` | `() => void` | — | Fires when the list scrolls within `onEndReachedThreshold` of the bottom. See [Pagination](../guides/end-reached-pagination). |
| `onEndReachedThreshold` | `number` | `0.5` | Distance from the end (in viewport units) at which `onEndReached` fires. |
| `excludeItems` | `T[]` | `[]` | Items to hide from the list. |
| `excludeSearchItems` | `T[]` | `[]` | Items shown in the list but excluded from search. |

### Callbacks

| Prop | Type | Description |
|---|---|---|
| `onFocus` | `() => void` | Fires when the list opens. |
| `onBlur` | `() => void` | Fires when the list closes. |

### Text rendering

| Prop | Type | Description |
|---|---|---|
| `fontFamily` | `string` | Propagated to all text. |
| `allowFontScaling` | `boolean` | Propagated to every `Text`/`TextInput`. |

### Accessibility

Same props as Dropdown: `accessibilityLabel`, `accessibilityHint`,
`itemAccessibilityLabelField`, `testID`, `itemTestIDField`,
`hitSlop`. Trigger announces as `combobox`; items expose
`role="button"` and `selected` / `disabled` state. Chips in the
selection row carry `role="button"` plus a "remove from selection"
hint, and the chip row is an
`accessibilityLiveRegion="polite"` region so screen readers
announce newly-added chips without the user navigating back. See
[Accessibility](../accessibility) for the full picture.

## Imperative ref

```tsx
import { useRef } from 'react';
import { MultiSelect } from '@carlos3g/element-dropdown';
import type { IMultiSelectRef } from '@carlos3g/element-dropdown';

const ref = useRef<IMultiSelectRef>(null);

<MultiSelect ref={ref} {/* … */} />
```

`ref.current?.open()` and `ref.current?.close()` mirror the
Dropdown API.

## Related guides

- [Custom search field](../guides/custom-search-field)
- [Search input passthrough](../guides/search-input-props)
- [Sectioned lists](../guides/sectioned-lists)
- [Selected-item ordering](../guides/selected-ordering)
- [Pagination with `onEndReached`](../guides/end-reached-pagination)
- [Modal header](../guides/modal-header)
- [Disabled items](../guides/disabled-items)
- [Chip row inside the trigger](../guides/multi-select-inside-mode)
- [Nest inside a Modal](../guides/nested-in-modal)
