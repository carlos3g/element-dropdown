---
id: installation
title: Installation
sidebar_position: 2
description: Install @carlos3g/element-dropdown in React Native, Expo, or React Native Web. No native modules, no rebuild required.
keywords:
  - install react native dropdown
  - expo dropdown install
  - '@carlos3g/element-dropdown'
  - react native dropdown setup
---

# Installation

## Install the package

```sh
npm install @carlos3g/element-dropdown
```

```sh
yarn add @carlos3g/element-dropdown
```

## Peer dependencies

`@carlos3g/element-dropdown` declares `react` and `react-native` as
`peerDependencies: "*"` — the package does not pin them. Use the
`react` and `react-native` versions your app is already on. The
library itself runs on everything from `react-native@0.71`+ and any
matching React version.

There are no native modules, no pods to link, no Gradle files to
touch. Expo Managed and bare React Native both work as-is.

## Supported platforms

- iOS
- Android
- React Native Web (via `react-native-web`)

## TypeScript

TypeScript support is first-class — the package ships both the
type definitions and the TypeScript source. Consumer types are
re-exported from the package root:

```tsx
import type {
  DropdownProps,
  IDropdownRef,
  MultiSelectProps,
  IMultiSelectRef,
  SelectCountryProps,
  ISelectCountryRef,
} from '@carlos3g/element-dropdown';
```

## Verifying the install

The fastest smoke test is rendering a minimal `Dropdown` — head to
[Quick start](./quick-start).
