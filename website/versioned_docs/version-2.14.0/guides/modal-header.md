---
id: modal-header
title: Modal header
sidebar_position: 16
description: Render a sticky header (title + close button) above the dropdown list using renderModalHeader.
---

# How do I add a header above the list?

Set `renderModalHeader` to render any view at the top of the
modal — above the search input, above the list. The function
receives a `close()` callback so you can wire a close/back button.

```tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

export function CategoryPicker({ value, onChange, data }) {
  return (
    <Dropdown
      mode="modal"
      search
      data={data}
      labelField="name"
      valueField="id"
      value={value}
      onChange={onChange}
      placeholder="Pick a category"
      renderModalHeader={(close) => (
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Pressable onPress={close} hitSlop={8}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD',
  },
  title: { fontSize: 17, fontWeight: '600' },
  close: { color: '#007AFF', fontSize: 16 },
});
```

The header sticks to the top of the list container and is
unaffected by `inverted` / `dropdownPosition="top"` — it always
renders at the top of the rendered modal section.

## Use cases

- Title + close button on `mode="modal"` (full-screen) selectors.
- "Apply" / "Reset" actions for `MultiSelect`.
- Brand / logo above a long list.
- Live counter (`"3 of 8 selected"`) for `MultiSelect`.

## See also

- [Custom trigger](./custom-trigger) — replace the trigger body.
- [Disabled items](./disabled-items) — combine with `disabledField`
  to communicate why some rows are non-interactive.
