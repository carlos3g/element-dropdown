---
id: exclusion
title: Excluding items from the list or from search
sidebar_position: 9
description: Hide items entirely, or keep them visible while removing them from search results.
---

# How do I exclude items?

Two props, two different jobs.

## `excludeItems`: hide them completely

Items whose `valueField` matches anything in `excludeItems` do not
render at all.

```tsx
<Dropdown
  data={all}
  excludeItems={archived}
  labelField="label"
  valueField="value"
  onChange={(item) => setValue(item.value)}
/>
```

## `excludeSearchItems`: keep visible, skip in search

Items in `excludeSearchItems` stay in the list but are never
returned by search matches.

```tsx
<Dropdown
  search
  data={all}
  excludeSearchItems={pinned}
  labelField="label"
  valueField="value"
  onChange={(item) => setValue(item.value)}
/>
```

Typical use: pinned or "featured" items that should always be
visible but shouldn't clutter search results when the user types.
