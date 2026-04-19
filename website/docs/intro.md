---
id: intro
title: Introduction
slug: /intro
sidebar_position: 1
description: Maintained React Native dropdown, multi-select, and country picker for iOS, Android, and Web. Drop-in fork of react-native-element-dropdown with long-standing bugs fixed.
keywords:
  - react native dropdown
  - react native multiselect
  - react native picker
  - react native combobox
  - react-native-element-dropdown
  - expo dropdown
---

# `react-native-element-dropdown`, maintained.

`@carlos3g/element-dropdown` is a drop-in fork of
[`react-native-element-dropdown`](https://github.com/hoaphantn7604/react-native-element-dropdown).
Bugs get fixed, the toolchain stays current, and every release is
signed. Same API, same three components (`Dropdown`,
`MultiSelect`, `SelectCountry`), same props — change two lines and
keep shipping.

```sh
npm install @carlos3g/element-dropdown
```

```diff
- import { Dropdown } from 'react-native-element-dropdown';
+ import { Dropdown } from '@carlos3g/element-dropdown';
```

## Why this fork exists

The original package is unmaintained. A large open-issue backlog,
plus clean community pull requests sitting untouched for years. If
you're already on `react-native-element-dropdown`, you've likely
hit one of these:

- `Invariant Violation: scrollToIndex out of range` when searching
  long lists
- The list flashes at the wrong position for a frame when you
  reopen it
- `IDropdownRef` / `IMultiSelectRef` aren't importable when you
  build for web or Expo
- Every item has a non-overridable `padding: 17` —
  `itemContainerStyle` can't shrink it
- `MultiSelect` trigger uses `placeholderStyle` even after you've
  selected something

All fixed in this fork — along with plenty more. The
[release notes](https://github.com/carlos3g/element-dropdown/releases)
have the per-version detail.

## Where to go next

- **[Installation](./installation)** — add the package to your
  project.
- **[Quick start](./quick-start)** — render your first `Dropdown`
  and `MultiSelect`.
- **[Migration from upstream](./migration-from-upstream)** — what
  changes (and what doesn't) when moving from
  `react-native-element-dropdown`.
- **Components** — full prop reference for
  [`Dropdown`](./components/dropdown),
  [`MultiSelect`](./components/multi-select), and
  [`SelectCountry`](./components/select-country).
- **Guides** — copy-paste recipes for common patterns.
- **[Why this fork](./why-this-fork)** — the longer version.
