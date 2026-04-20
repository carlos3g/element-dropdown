---
id: why-this-fork
title: Why this fork
sidebar_position: 2
description: Why @carlos3g/element-dropdown exists as a maintained fork of react-native-element-dropdown — what it fixes, what it commits to, and what it deliberately doesn't try to be.
keywords:
  - react-native-element-dropdown unmaintained
  - react-native-element-dropdown abandoned
  - react-native-element-dropdown alternative
  - maintained fork react native dropdown
---

# Why this fork

`react-native-element-dropdown` has been a good library. At the
time of writing this fork was created, the upstream had **1.3k
GitHub stars, 210 forks, and roughly 1.2 million weekly npm
downloads**. People rely on it.

It's also effectively unmaintained. The last meaningful upstream
activity was mid-2024. The issue tracker has a large backlog, and
the PR queue has clean, small community fixes that have been
waiting years to merge.

Rather than re-architect a new dropdown library, this fork keeps
what worked and fixes what didn't.

## What this fork commits to

- **Same public API.** Migration is two lines: the install name
  and the import path. See
  [Migration from upstream](./migration-from-upstream).
- **Bugs get fixed.** Upstream issues get triaged and landed
  release by release. See the
  [release notes](https://github.com/carlos3g/element-dropdown/releases)
  for what's in each version, and
  [`docs/upstream-triage.md`](https://github.com/carlos3g/element-dropdown/blob/master/docs/upstream-triage.md)
  for the roadmap.
- **The toolchain stays current.** TypeScript, React Native,
  ESLint, Prettier, Jest — they get upgraded so this library can
  keep up with its consumers rather than hold them back.
- **Releases are signed.** Every version is published via npm
  Trusted Publishing (OIDC) with provenance attestation. Anyone
  can verify a given tarball came from this repository's CI.

## What this fork does not try to be

- A rewrite. The public API is intentionally unchanged; do not
  expect breaking redesigns.
- A new dependency-free implementation. The same FlatList +
  Modal approach the upstream used is still used here.
- An enterprise-supported product. This is a maintained
  open-source fork — no SLA, no commercial tier, no email
  support. Issues and pull requests are the interface.

## Open questions and follow-ups

Some upstream issues are deferred because they need device-level
reproduction:

- Keyboard-avoidance math on iOS and Android 0.76+ (upstream
  `#180`, `#357`, `#339`, `#288`, `#328`).
- Android 14+ `dropdownPosition="top"` behavior (`#355`).
- Realme OEM positioning quirks (`#350`).

These are tracked in
[`docs/upstream-triage.md`](https://github.com/carlos3g/element-dropdown/blob/master/docs/upstream-triage.md).
Pull requests with repro projects are welcome.

## How to help

- File issues with minimal repros.
- Send pull requests — ideally with a test.
- Port clean upstream PRs (see the upstream-triage doc for the
  prioritized list).
- Star the repo; it makes the fork easier to find for people who
  are currently on the abandoned upstream.
