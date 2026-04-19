---
id: search-input-props
title: Search input passthrough
sidebar_position: 18
description: Forward keyboardType, selectionColor, returnKeyType and other TextInputProps to the built-in dropdown search input.
---

# How do I customize the search keyboard, selection color, etc.?

The built-in search input is a regular React Native `<TextInput>`.
Two props let you reach it without writing your own
`renderInputSearch`:

## `searchKeyboardType`

Quick shorthand for the `keyboardType` of the search input — the
single most common thing people want to change.

```tsx
<Dropdown
  search
  searchKeyboardType="email-address"
  data={users}
  labelField="email"
  valueField="id"
  onChange={setUser}
/>
```

Accepts every `KeyboardTypeOptions` value RN supports (`'numeric'`,
`'phone-pad'`, `'decimal-pad'`, `'email-address'`,
`'number-pad'`, etc.).

## `searchInputProps`

Pass any other `TextInputProps` straight through. Useful for
selection color, return-key type, autocapitalization, secure
entry, autofocus — anything `<TextInput>` accepts.

```tsx
<Dropdown
  search
  searchInputProps={{
    selectionColor: '#007AFF',
    returnKeyType: 'search',
    autoCapitalize: 'none',
    autoCorrect: false,
    autoFocus: true,
  }}
  data={users}
  labelField="name"
  valueField="id"
  onChange={setUser}
/>
```

The handful of props the dropdown manages internally (`value`,
`onChangeText`, `placeholder`, `placeholderTextColor`,
`allowFontScaling`, `keyboardType`) are excluded from the
`searchInputProps` type so you can't accidentally fight the
component for control of them. Use `searchPlaceholder`,
`searchPlaceholderTextColor`, `searchKeyboardType`,
`allowFontScaling`, and the existing `inputSearchStyle` for those.

## When to drop down to `renderInputSearch`

If you need a totally different search affordance — a microphone
button, an inline filter chip row, a debounced controlled input
managed elsewhere — `renderInputSearch` still gives you the full
escape hatch.

## See also

- [Custom search field](./custom-search-field) — pick which field(s)
  to match against.
- [Custom search matcher](./custom-search-matcher) — bring your own
  matching function.
