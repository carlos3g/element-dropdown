---
id: nested-in-modal
title: Nesting inside a React Native Modal
sidebar_position: 5
description: Use isInsideModal so the Dropdown positions correctly when rendered inside a native Modal.
---

# How do I use a Dropdown inside a Modal?

Set `isInsideModal={true}`.

```tsx
import { Modal } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

<Modal visible={visible} onRequestClose={close}>
  <Dropdown
    isInsideModal
    data={data}
    labelField="label"
    valueField="value"
    onChange={(item) => setValue(item.value)}
  />
</Modal>;
```

## Why this prop exists

React Native reports `measureInWindow` coordinates relative to the
outermost native view. Inside a `<Modal>`, that's the Modal's own
root — the status bar is already gone from that frame of reference.
Without the flag, the component adds its internal status-bar
offset (`~24–44 px` on Android) a second time and the list opens
below the trigger by that amount.

Set `isInsideModal={true}` whenever the component renders inside:

- React Native's `<Modal>`
- Libraries that use a native modal underneath (e.g. `react-native-modal`)
- Navigation screens configured as modals (e.g. React Navigation's
  `presentation: 'modal'` — only matters for iOS form sheets)

Default is `false`. Leave it off for normal rendering.
