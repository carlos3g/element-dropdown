---
id: imperative-open-close
title: Open and close programmatically
sidebar_position: 1
description: Open or close a Dropdown or MultiSelect from outside the component using its imperative ref.
---

# How do I open or close the dropdown from outside?

Use the component's imperative ref. Both `Dropdown` and
`MultiSelect` expose `open()` and `close()`.

```tsx
import { useRef } from 'react';
import { Button, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';
import type { IDropdownRef } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

export function FruitPicker() {
  const ref = useRef<IDropdownRef>(null);

  return (
    <View>
      <Button title="Pick a fruit" onPress={() => ref.current?.open()} />
      <Dropdown
        ref={ref}
        data={data}
        labelField="label"
        valueField="value"
        onChange={() => {}}
      />
    </View>
  );
}
```

Common uses: opening from a bottom-tab press, closing on navigation
events, deep-linking into a selector, or triggering the picker
from a keyboard shortcut on web.

## Watch out

- The ref is only defined **after** mount. Calling `open()` during
  the first render is a no-op. Open from a user gesture, or from
  a `useEffect`:

  ```tsx
  useEffect(() => {
    ref.current?.open();
  }, []);
  ```

- `open()` and `close()` are safe to call when the dropdown is
  disabled — they simply do nothing.
