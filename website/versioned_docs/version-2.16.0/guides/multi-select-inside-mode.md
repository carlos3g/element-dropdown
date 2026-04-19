---
id: multi-select-inside-mode
title: Chip row inside the trigger
sidebar_position: 6
description: Render MultiSelect's selected chips inline in the trigger instead of below it.
---

# How do I render the chips inside the trigger?

Set `inside={true}`.

```tsx
import { MultiSelect } from '@carlos3g/element-dropdown';

<MultiSelect
  inside
  data={data}
  labelField="label"
  valueField="value"
  placeholder="Pick fruits"
  value={selected}
  onChange={setSelected}
/>;
```

By default, `MultiSelect` renders its selected items as a chip row
**below** the trigger. `inside={true}` moves that row **inline**
inside the trigger's own `View`, which is useful when the component
needs to look like a single form input.

## Also useful

- `visibleSelectedItem={false}` — hide the chip row entirely.
- `alwaysRenderSelectedItem={true}` — keep chips visible while the
  list is open (default is hide-while-open).
- `renderSelectedItem` — fully custom chip rendering.

```tsx
<MultiSelect
  inside
  renderSelectedItem={(item, unSelect) => (
    <Pressable onPress={() => unSelect?.(item)} style={styles.chip}>
      <Text>{item.label} ×</Text>
    </Pressable>
  )}
  {/* … */}
/>
```
