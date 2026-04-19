---
id: custom-search-field
title: Searching a different field
sidebar_position: 2
description: Point the built-in search at a data field other than the visible label.
---

# How do I search by a field other than the label?

By default, `search` matches against `labelField`. To search a
different field, set `searchField`.

```tsx
<Dropdown
  search
  data={users}
  labelField="name"
  valueField="id"
  searchField="email"
  placeholder="Pick a user"
  searchPlaceholder="Search by email…"
  onChange={(user) => setUser(user)}
/>
```

Now typing in the search box filters the list by `user.email`
while the visible label stays as `user.name`.

## Multiple fields?

If you need to match across several fields, or apply normalization
(accents, locale, trimming), use the custom matcher — see
[Custom search matcher](./custom-search-matcher).
