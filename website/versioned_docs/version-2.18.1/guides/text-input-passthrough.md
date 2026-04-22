---
id: text-input-passthrough
title: Customizing the search input
sidebar_position: 12
description: Use any React Native TextInput prop — selectionColor, cursorColor, keyboardType — on the built-in search input.
---

# How do I change the cursor or selection color on the search input?

The component forwards unknown props straight to the underlying
`TextInput`, so every standard RN prop works.

```tsx
<Dropdown
  search
  selectionColor="#0088ff"
  cursorColor="#0088ff"  // Android only
  data={data}
  labelField="label"
  valueField="value"
  onChange={(item) => setValue(item.value)}
/>
```

Other props that work the same way:

- `keyboardType` / `inputMode`
- `autoCapitalize`
- `returnKeyType`
- `clearButtonMode` (iOS)
- `onSubmitEditing`

## Fully custom search input

When per-prop passthrough isn't enough, use `renderInputSearch`
for full control:

```tsx
<Dropdown
  search
  renderInputSearch={(onSearch) => (
    <TextInput
      placeholder="Search…"
      onChangeText={onSearch}
      style={styles.search}
      keyboardType="email-address"
    />
  )}
  {/* … */}
/>
```

You're responsible for wiring the `onSearch` callback yourself.
