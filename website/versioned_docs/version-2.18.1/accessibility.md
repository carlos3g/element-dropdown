---
id: accessibility
title: Accessibility
sidebar_position: 1
description: Accessibility in @carlos3g/element-dropdown — combobox role, expanded and disabled states, selected items, font scaling, hit slop, reduce motion, and screen-reader live regions.
keywords:
  - react native dropdown accessibility
  - react native combobox a11y
  - VoiceOver react native dropdown
  - TalkBack dropdown
  - accessibilityRole combobox
  - reduce motion react native
---

# Accessibility

`@carlos3g/element-dropdown` ships sensible a11y defaults: every
touchable surface is exposed to screen readers, items announce
their selection state, the modal traps VoiceOver focus, and the
component honours the user's reduce-motion preference. Nothing
on this page requires any code change to benefit from — it's all
on by default.

## Trigger

Both `Dropdown` and `MultiSelect` triggers expose:

- `accessibilityRole="combobox"` — screen readers announce it as a
  dropdown.
- `accessibilityState.expanded` — `true` when the list is open.
- `accessibilityState.disabled` — `true` when the `disable` prop
  is set.

Set `accessibilityLabel` on the component to give the trigger a
descriptive label, and `accessibilityHint` for an action
description:

```tsx
<Dropdown
  accessibilityLabel="Country selector"
  accessibilityHint="Opens a list of countries"
  // …
/>
```

The label is also propagated to the search input
(as `{label} input`) and the list (as `{label} flatlist`), so
tests and assistive tech can address each surface.

## List items

Every list row exposes:

- `accessibilityRole="button"` — TalkBack / VoiceOver announces
  rows as actionable.
- `accessibilityState.selected` — `true` when this item matches
  the current value.
- `accessibilityState.disabled` — `true` when `disabledField` is
  set and the item's value at that field is truthy.

By default, the row's `accessibilityLabel` is `item[labelField]`.
To use a different field, set `itemAccessibilityLabelField`:

```tsx
<Dropdown
  data={data}
  labelField="name"
  valueField="id"
  itemAccessibilityLabelField="fullDescription"
  onChange={(item) => setValue(item.id)}
/>
```

Items are accessible regardless of whether you pass a
component-level `accessibilityLabel`. (Earlier upstream versions
silently set `accessible={false}` when the component label was
missing — that gate has been removed.)

## Section headers

When you use the `sections` prop, the default section header
carries `accessibilityRole="header"` so VoiceOver / TalkBack's
"next heading" gesture surfaces group titles:

```tsx
<Dropdown
  sections={[
    { title: 'Berries',  data: [/* … */] },
    { title: 'Citrus',   data: [/* … */] },
  ]}
  // …
/>
```

If you supply your own `renderSectionHeader`, set the role
yourself.

## MultiSelect chips

Each chip in the selection row exposes:

- `accessibilityRole="button"`
- `accessibilityHint="Double tap to remove from selection"`

The decorative `ⓧ` glyph is hidden from the accessibility tree
(`accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"`)
so screen readers don't read out "circled x" after the label.

The chip-row container is an
`accessibilityLiveRegion="polite"` region — toggling a row
announces the new chip without forcing the user to navigate back
to the row.

## Modal isolation

The dropdown opens inside a React Native `<Modal>` whose root
view sets `accessibilityViewIsModal`. On iOS, this scopes
VoiceOver focus to the modal contents; users can't accidentally
swipe back into the screen behind the open list.

## Reduce motion

Both components subscribe to the OS-level "Reduce Motion"
preference via `AccessibilityInfo`. When enabled, the modal
opens / closes with `animationType="none"` instead of the
default platform animation. The change happens live — toggling
the OS setting while a dropdown is open propagates without a
remount.

## Tap target size

Use [`hitSlop`](./guides/hit-slop) to expand the trigger's tap
area without changing its visual layout. WCAG 2.5.5 recommends
at least 44 × 44 pt; if your trigger sits in tight UI, set
`hitSlop` to widen the touch target.

## Font scaling

Labels and the search input respect the system font-scale setting
by default. Use [`allowFontScaling`](./guides/font-scaling) to
override per-component when you need to lock a fixed size for
layout reasons.

## Search input

The built-in search input inherits an accessibility label
derived from the component's `accessibilityLabel` (`{label}
input`). To set a more user-friendly label, override via
`searchInputProps`:

```tsx
<Dropdown
  search
  accessibilityLabel="Country picker"
  searchInputProps={{
    accessibilityLabel: 'Search countries',
    selectionColor: '#007AFF',
  }}
  // …
/>
```

`searchInputProps` is also where to set `selectionColor`,
`returnKeyType`, `autoCapitalize`, `autoFocus`, etc. for
keyboard / cursor a11y. See
[Search input passthrough](./guides/search-input-props).

## Known gaps

- **Hardware keyboard navigation** (arrow keys, Home/End, Escape,
  typeahead) is not yet implemented. The component relies on
  touch. Tracking upstream `#228` as a follow-up; needs an
  active-descendant focus model that doesn't exist yet in the
  codebase.
- **Programmatic focus management** — opening the dropdown does
  not auto-focus the search input, and closing does not return
  focus to the trigger. Adding this without device-level testing
  would risk regressions on Android, so it's deferred until we
  have a Fabric / web harness.

If you hit an accessibility bug or gap not listed here, open an
issue at
[`carlos3g/element-dropdown`](https://github.com/carlos3g/element-dropdown/issues).
