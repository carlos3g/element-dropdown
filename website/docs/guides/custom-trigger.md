---
id: custom-trigger
title: Custom trigger
sidebar_position: 15
description: Replace the default Dropdown trigger (left icon + label + right icon) with your own layout using renderSelectedItem.
---

# How do I render a fully custom trigger?

The default `Dropdown` trigger is `renderLeftIcon` + label +
`renderRightIcon`. If you need a different layout — e.g. a chip
group, an avatar with subtitle, or a button-shaped control —
return your own JSX from `renderSelectedItem`.

```tsx
import { Image, Text, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

type Country = { code: string; name: string; flag: string };

export function CountryTrigger({ value, data, onChange }) {
  const selected = data.find((c: Country) => c.code === value);

  return (
    <Dropdown
      data={data}
      labelField="name"
      valueField="code"
      value={value}
      onChange={(c) => onChange(c.code)}
      renderSelectedItem={(visible) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 8,
            backgroundColor: visible ? '#EEF2FF' : '#F5F5F5',
          }}
        >
          {selected ? (
            <>
              <Image source={{ uri: selected.flag }} style={{ width: 20, height: 14 }} />
              <Text>{selected.name}</Text>
            </>
          ) : (
            <Text style={{ color: '#888' }}>Pick a country</Text>
          )}
          <Text style={{ marginLeft: 'auto' }}>{visible ? '▴' : '▾'}</Text>
        </View>
      )}
    />
  );
}
```

The function receives one argument:

- `visible: boolean` — whether the dropdown list is currently open.
  Use it to flip caret direction or change the trigger background
  while the list is showing.

## What about `renderLeftIcon` / `renderRightIcon`?

When `renderSelectedItem` is provided it **replaces** the entire
default trigger body — `renderLeftIcon`, the label `<Text>`, and
`renderRightIcon` are not rendered. Compose them inside your
custom JSX if you still want them.

## Trigger versus list rows

- `renderSelectedItem` controls the **trigger** (the always-visible
  control).
- `renderItem` controls each **row inside the list**.

They're independent — you can use both, either, or neither.
