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
| `data` | `T[]` | Array of items to render. |
| `labelField` | `keyof T` | Field on each item used as the visible label. |
| `valueField` | `keyof T` | Field on each item that identifies it uniquely. |
| `value` | `string[] \| null` | Currently selected `valueField` values. |
| `onChange` | `(value: string[]) => void` | Fires with the new selection array. |

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

### Items

| Prop | Type | Default | Description |
|---|---|---|---|
| `itemContainerStyle` | `ViewStyle` | — | Style merged on top of the built-in row style. |
| `itemTextStyle` | `TextStyle` | — | Style for the default item label. |
| `activeColor` | `string` | `'#F6F7F8'` | Background of the row for already-selected items. |
| `renderItem` | `(item: T, selected?: boolean) => ReactElement` | — | Fully custom row renderer. |
| `disabledField` | `keyof T` | — | Marks individual items as non-interactive. |

### Search

Same props as Dropdown: `search`, `searchField`, `searchQuery`,
`inputSearchStyle`, `searchPlaceholder`,
`searchPlaceholderTextColor`, `renderInputSearch`, `onChangeText`.

### Icons

Same as Dropdown: `iconStyle`, `iconColor`, `renderLeftIcon`,
`renderRightIcon`.

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `disable` | `boolean` | `false` | Disable the trigger. |
| `keyboardAvoiding` | `boolean` | `true` | Lift the list when the keyboard opens. |
| `confirmSelectItem` | `boolean` | `false` | Call `onConfirmSelectItem` on toggles instead of immediately mutating `value`. |
| `confirmUnSelectItem` | `boolean` | `false` | Same but for un-toggling. |
| `onConfirmSelectItem` | `(item: T) => void` | — | Confirm handler. |
| `showsVerticalScrollIndicator` | `boolean` | `true` | Scroll indicator on the list. |
| `flatListProps` | `Omit<FlatListProps<T>, 'renderItem' \| 'data'>` | — | Passthrough to the underlying `FlatList`. |
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

Same props as Dropdown: `accessibilityLabel`,
`itemAccessibilityLabelField`, `testID`, `itemTestIDField`,
`hitSlop`. Trigger announces as `combobox`; items expose
`selected` / `disabled` state.

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
- [Disabled items](../guides/disabled-items)
- [Chip row inside the trigger](../guides/multi-select-inside-mode)
- [Nest inside a Modal](../guides/nested-in-modal)
