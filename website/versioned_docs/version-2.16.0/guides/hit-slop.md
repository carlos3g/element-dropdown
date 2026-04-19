---
id: hit-slop
title: Enlarging the tap target
sidebar_position: 10
description: Use hitSlop to expand the tappable area of the trigger without affecting layout.
---

# How do I make the trigger easier to tap?

Pass `hitSlop`. The prop is forwarded directly to the trigger's
`TouchableWithoutFeedback`.

```tsx
<Dropdown
  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
  data={data}
  labelField="label"
  valueField="value"
  onChange={(item) => setValue(item.value)}
/>
```

`hitSlop` also accepts a number for symmetrical expansion:

```tsx
<Dropdown hitSlop={12} {/* … */} />
```

Useful when the trigger is small — a narrow chip, an icon-only
selector, or a table row — and you want a forgiving tap area
without changing the visual size.
