---
id: on-change-text
title: Reacting to the cleared search
sidebar_position: 8
description: Detect when the user clears the search input (including via the X button or by closing the dropdown).
---

# How do I detect when the search is cleared?

`onChangeText` fires on every change to the search input. When
the field is cleared — by the user, by the "X" clear button, or
automatically when the list closes — `onChangeText` fires with
`""`.

```tsx
<Dropdown
  search
  data={data}
  labelField="label"
  valueField="value"
  onChangeText={(text) => {
    if (text === '') {
      // user cleared, or the dropdown closed
    } else {
      // user typed
    }
  }}
  onChange={(item) => setValue(item.value)}
/>
```

## When does the search clear automatically?

The component clears `searchText` (and thus calls
`onChangeText('')`) whenever the list closes, to avoid the
search-input state leaking into the next open. If you want to
persist the query across opens, capture it in parent state inside
`onChangeText` and re-apply it after open via `onFocus`.
