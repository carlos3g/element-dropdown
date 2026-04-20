---
id: icon-per-state
title: Different icons for open and closed
sidebar_position: 13
description: Use the visible argument in renderLeftIcon and renderRightIcon to swap icons based on open state.
---

# How do I swap the chevron icon when the dropdown opens?

Both `renderLeftIcon` and `renderRightIcon` receive the current
visibility as their argument.

```tsx
import Icon from '@expo/vector-icons/Feather';

<Dropdown
  data={data}
  labelField="label"
  valueField="value"
  renderRightIcon={(visible) => (
    <Icon
      name={visible ? 'chevron-up' : 'chevron-down'}
      size={20}
      color="gray"
    />
  )}
  onChange={(item) => setValue(item.value)}
/>;
```

Same pattern on `renderLeftIcon`. Both arguments are typed as
`visible?: boolean` — the optional `?` just reflects that the
render function is called before the first open with `undefined`;
treat `undefined` the same as `false`.

Works on `Dropdown`, `MultiSelect`, and `SelectCountry`.
