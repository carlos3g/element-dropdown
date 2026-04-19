---
id: empty-state
title: Empty state (no results)
sidebar_position: 7
description: Render a custom message when the data array is empty or the search returns nothing.
---

# How do I show an empty state?

Pass `ListEmptyComponent` through `flatListProps`. The dropdown
forwards it to the underlying `FlatList`, which renders it when
the current (possibly filtered) list is empty.

```tsx
import { Text, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

<Dropdown
  search
  data={data}
  labelField="label"
  valueField="value"
  flatListProps={{
    ListEmptyComponent: () => (
      <View style={{ padding: 16 }}>
        <Text>No matches.</Text>
      </View>
    ),
  }}
  onChange={(item) => setValue(item.value)}
/>;
```

Works for both "data is empty to begin with" and "search filtered
everything out".

Every other `FlatList` prop is available the same way —
`ListHeaderComponent`, `ItemSeparatorComponent`,
`initialNumToRender`, etc.
