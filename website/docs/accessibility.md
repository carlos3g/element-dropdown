---
id: accessibility
title: Accessibility
sidebar_position: 1
description: Accessibility in @carlos3g/element-dropdown — combobox role, expanded and disabled states, selected items, font scaling, hit slop.
keywords:
  - react native dropdown accessibility
  - react native combobox a11y
  - VoiceOver react native dropdown
  - TalkBack dropdown
  - accessibilityRole combobox
---

# Accessibility

`@carlos3g/element-dropdown` exposes a small, consistent set of
accessibility metadata on both components. The defaults are
reasonable; overrides are available per-item.

## What the trigger announces

Both `Dropdown` and `MultiSelect` triggers expose:

- `accessibilityRole="combobox"` — screen readers announce it as a
  dropdown.
- `accessibilityState.expanded` — `true` when the list is open.
- `accessibilityState.disabled` — `true` when the `disable` prop
  is set.

Set `accessibilityLabel` on the component to give the trigger a
descriptive label:

```tsx
<Dropdown accessibilityLabel="Country selector" {/* … */} />
```

The same label is propagated to the search input
(as `{label} input`) and the list (as `{label} flatlist`), so
tests and assistive tech can address each surface.

## What list items announce

Each item row exposes:

- `accessibilityState.selected` — `true` when this item matches
  the current value.
- `accessibilityState.disabled` — `true` when `disabledField` is
  set and the item's value at that field is truthy.

By default, item's `accessibilityLabel` is `item[labelField]`. To
use a different field:

```tsx
<Dropdown
  data={data}
  labelField="name"
  valueField="id"
  itemAccessibilityLabelField="fullDescription"
  onChange={(item) => setValue(item.id)}
/>
```

## Tap target size

Use [`hitSlop`](./guides/hit-slop) to expand the trigger's tap
area without changing its visual layout.

## Font scaling

Labels and the search input respect the system font-scale setting
by default. Use [`allowFontScaling`](./guides/font-scaling) to
override per-component.

## Known gaps

- **Hardware keyboard navigation** (arrow keys, Home/End, Escape,
  typeahead) is not yet implemented. The component relies on
  touch. Tracking upstream `#228` as a follow-up.
- On iOS, assistive-tech focus can skip some individual rows
  inside the `Modal`. Tracking upstream `#297` / `#303` as
  follow-ups that need device-level reproduction.

If you hit an accessibility bug or gap not listed here, open an
issue at
[`carlos3g/element-dropdown`](https://github.com/carlos3g/element-dropdown/issues).
