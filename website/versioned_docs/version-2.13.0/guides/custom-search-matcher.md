---
id: custom-search-matcher
title: Custom search matcher
sidebar_position: 3
description: Replace the default search predicate with your own logic — locale-aware comparison, multi-field match, fuzzy search.
---

# How do I use a custom matcher?

Pass a `searchQuery` callback. The component calls it for each
item, with the current search keyword and the item's label as
resolved by `labelField`. Return `true` to keep the item in the
filtered list.

```tsx
<Dropdown
  search
  data={items}
  labelField="name"
  valueField="id"
  searchQuery={(keyword, labelValue) =>
    labelValue
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .includes(keyword.toLocaleLowerCase())
  }
  onChange={(item) => setItem(item)}
/>
```

The example strips diacritics before comparing, so `"sao"`
matches `"São Paulo"`.

## Matching across multiple fields

`searchQuery` only receives the label. To match against other
fields, access the underlying item through your data closure:

```tsx
<Dropdown
  search
  data={items}
  labelField="name"
  valueField="id"
  searchQuery={(keyword, labelValue) => {
    const needle = keyword.toLowerCase();
    const item = items.find((i) => i.name === labelValue);
    return (
      labelValue.toLowerCase().includes(needle) ||
      item?.email?.toLowerCase().includes(needle) ||
      item?.handle?.toLowerCase().includes(needle) ||
      false
    );
  }}
  onChange={(item) => setItem(item)}
/>
```
