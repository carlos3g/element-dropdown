---
id: quick-start
title: Quick start
sidebar_position: 3
description: Render your first React Native Dropdown and MultiSelect — a minimal working example, plus how to enable search.
keywords:
  - react native dropdown example
  - react native multiselect example
  - react native dropdown tutorial
  - searchable dropdown react native
---

# Quick start

## A single-select `Dropdown`

```tsx
import { useState } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
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

What you get out of the box:

- A styled trigger that displays the placeholder or the selected
  label.
- A modal-backed list that opens on tap and closes on outside press.
- Automatic positioning above or below the trigger (set
  [`dropdownPosition`](./components/dropdown#behavior) to lock it).

## A `MultiSelect`

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

`MultiSelect` is controlled by `value`. Tapping an item toggles it
on or off; `onChange` fires with the new array.

## With a search input

Set `search={true}` and the component renders a `TextInput` above
the list. By default the search matches against the label field.

```tsx
<Dropdown
  search
  searchPlaceholder="Search fruits…"
  data={data}
  labelField="label"
  valueField="value"
  value={value}
  onChange={(item) => setValue(item.value)}
/>
```

See the [custom search](./guides/custom-search-field) and
[custom matcher](./guides/custom-search-matcher) guides for more
control.

## Next steps

- **[Components](./components/dropdown)** — the full prop reference.
- **Guides** — recipes for programmatic open/close, disabled items,
  nesting inside a Modal, and more.
