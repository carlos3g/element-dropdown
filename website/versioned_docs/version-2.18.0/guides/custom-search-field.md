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

## Search across multiple fields

Pass `searchField` an array of keys — a row matches if **any** of
the listed fields contains the keyword (after the same accent /
whitespace normalization the single-field path uses):

```tsx
<Dropdown
  search
  data={users}
  labelField="name"
  valueField="id"
  searchField={['name', 'email', 'phone']}
  searchPlaceholder="Search name, email or phone…"
  onChange={setUser}
/>
```

The visible label stays as `user.name`; the search just widens its
net.

## Even more control

If you need locale-aware matching, fuzzy matching, scoring, or
anything else the multi-field path can't express, fall back to a
custom matcher — see
[Custom search matcher](./custom-search-matcher).
