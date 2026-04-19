---
id: disabled-items
title: Disabling individual items
sidebar_position: 4
description: Mark specific items in the data array as non-interactive using the disabledField prop.
---

# How do I disable specific items?

Mark items with a truthy value at a shared field, then point
`disabledField` at that field.

```tsx
const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', locked: true },
  { label: 'Cherry', value: 'cherry' },
];

<Dropdown
  data={data}
  labelField="label"
  valueField="value"
  disabledField="locked"
  onChange={(item) => setValue(item.value)}
/>
```

Disabled items:

- render at reduced opacity (`0.4` by default);
- don't fire `onChange` on press;
- expose `accessibilityState.disabled` to screen readers.

The rest of the list stays interactive.

Works on both `Dropdown` and `MultiSelect`.

## Custom look for disabled rows

Use `renderItem` for full control:

```tsx
<Dropdown
  data={data}
  labelField="label"
  valueField="value"
  disabledField="locked"
  renderItem={(item, selected) => (
    <View
      style={[
        styles.row,
        item.locked && styles.rowLocked,
        selected && styles.rowActive,
      ]}
    >
      <Text style={item.locked && styles.labelLocked}>{item.label}</Text>
    </View>
  )}
/>
```

`disabledField` still governs interactivity — `renderItem` is
purely visual.
