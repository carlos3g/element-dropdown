---
id: end-reached-pagination
title: Pagination with onEndReached
sidebar_position: 14
description: Load more items when the user scrolls to the bottom of the dropdown list using onEndReached.
---

# How do I paginate a long dropdown list?

Both `Dropdown` and `MultiSelect` expose `onEndReached` and
`onEndReachedThreshold` first-class, so you can append a page of
data when the user scrolls near the bottom — same shape as
`FlatList`.

```tsx
import { useCallback, useEffect, useState } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';

type User = { id: string; name: string };

export function PaginatedUsers() {
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const loadPage = useCallback(async (p: number) => {
    if (loading || done) return;
    setLoading(true);
    const next = await fetchUsers({ page: p, pageSize: 50 });
    setData((prev) => [...prev, ...next]);
    setDone(next.length < 50);
    setLoading(false);
  }, [loading, done]);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  return (
    <Dropdown
      data={data}
      labelField="name"
      valueField="id"
      placeholder="Pick a user"
      onChange={(u) => /* … */ undefined}
      onEndReached={() => setPage((p) => p + 1)}
      onEndReachedThreshold={0.4}
    />
  );
}
```

## Notes

- `onEndReachedThreshold` defaults to `0.5` (half a viewport from
  the bottom). Lower it to fire later (closer to the end), raise
  it to prefetch earlier.
- The same props go on `MultiSelect`.
- If you'd rather manage the FlatList behavior yourself, you can
  still pass `flatListProps={{ onEndReached, onEndReachedThreshold,
  ListFooterComponent }}` — the explicit props are just a thinner
  surface for the common case.
- `autoScroll` is ignored while the list is filtered (search
  active), so pagination plays nicely with search out of the box.
