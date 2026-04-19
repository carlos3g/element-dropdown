---
id: select-country
title: SelectCountry
sidebar_position: 3
description: React Native country picker with flag images — a Dropdown variant that renders an image next to each item's label.
keywords:
  - react native country picker
  - react native flag dropdown
  - country select react native
  - SelectCountry react native
  - ISelectCountryRef
---

# `SelectCountry`

A thin specialization of `Dropdown` that renders an image (usually
a country flag) next to each item's label. Every `Dropdown` prop
is supported — `SelectCountry` adds two of its own.

## Minimal example

```tsx
import { useState } from 'react';
import { SelectCountry } from '@carlos3g/element-dropdown';

const local_data = [
  {
    value: '1',
    lable: 'Country 1',
    image: {
      uri: 'https://www.vigcenter.com/upload/images/flag/GB.png',
    },
  },
  {
    value: '2',
    lable: 'Country 2',
    image: {
      uri: 'https://www.vigcenter.com/upload/images/flag/FR.png',
    },
  },
];

export function CountryPicker() {
  const [country, setCountry] = useState('1');

  return (
    <SelectCountry
      data={local_data}
      value={country}
      valueField="value"
      labelField="lable"
      imageField="image"
      placeholder="Select country"
      onChange={(e) => setCountry(e.value)}
    />
  );
}
```

## Props

`SelectCountry` accepts every prop that [Dropdown](./dropdown)
does, plus:

| Prop | Type | Required | Description |
|---|---|---|---|
| `imageField` | `string` | Yes | Field on each item whose value is an `ImageSourcePropType` (e.g. a `{ uri }` object or a `require(...)`). |
| `imageStyle` | `ImageStyle` | No | Style applied to the image rendered next to each item label in the list. |
| `selectedImageStyle` | `ImageStyle` | No | Extra style applied only to the image rendered inside the trigger when an item is selected. Merged on top of `imageStyle`. |

Items also render their image in the trigger when selected.

## Imperative ref

Same as `Dropdown`:

```tsx
import type { ISelectCountryRef } from '@carlos3g/element-dropdown';

const ref = useRef<ISelectCountryRef>(null);
```

## See also

- [Dropdown](./dropdown) — the base component.
