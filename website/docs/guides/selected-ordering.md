---
id: selected-ordering
title: Selected-item ordering & visibility
sidebar_position: 17
description: Hide already-selected items, sort them to the top, or close the list after each toggle in MultiSelect.
---

# How do I control where selected items appear in the list?

Three small props let you tune how the dropdown list reacts to
the current selection. They're independent — mix and match.

## Hide selected items

`hideSelectedFromList` removes selected items from the rendered
list entirely. Available on **both** `Dropdown` (single-select)
and `MultiSelect` (multi-select).

```tsx
<MultiSelect
  data={tags}
  value={chosen}
  onChange={setChosen}
  labelField="label"
  valueField="value"
  hideSelectedFromList
/>
```

Useful when the chip row already shows what's selected, so the
list only ever has "things you can still pick".

## Push selected items to the top (MultiSelect)

`selectedToTop` keeps the full list visible but reorders it so
already-selected items come first. No-op when
`hideSelectedFromList` is `true` — they'd be hidden anyway.

```tsx
<MultiSelect
  data={tags}
  value={chosen}
  onChange={setChosen}
  labelField="label"
  valueField="value"
  selectedToTop
/>
```

Helpful for long, sparsely-selected lists where users want to
double-check their selection without scrolling.

## Close the modal on each toggle (MultiSelect)

By default `MultiSelect` keeps the list open after a toggle so
users can keep selecting. Set `closeModalWhenSelectedItem` to
`true` to flip that — useful for "checkbox-style" selectors where
you want the user to think about each pick.

```tsx
<MultiSelect
  data={options}
  value={chosen}
  onChange={setChosen}
  labelField="label"
  valueField="value"
  closeModalWhenSelectedItem
/>
```

`Dropdown` already had this prop with the opposite default
(`true`), since closing on selection is the natural single-select
behavior.

## See also

- [Disabled items](./disabled-items) — gray out specific rows.
- [Exclude items](./exclusion) — drop items from the list /
  search independently of selection state.
