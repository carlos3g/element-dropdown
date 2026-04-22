# Changelog

All notable changes to `@carlos3g/element-dropdown` are listed here.
This file is auto-updated on each GitHub Release by
`.github/workflows/changelog.yml`. The canonical source is the
[GitHub Releases page](https://github.com/carlos3g/element-dropdown/releases).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- generated:start -->


## [v2.18.1](https://github.com/carlos3g/element-dropdown/releases/tag/v2.18.1) — 2026-04-22

#### [2.18.1](https://github.com/carlos3g/element-dropdown/compare/v2.18.0...v2.18.1) (2026-04-22)

### Bug Fixes
* **types:** align data and onEndReached types with runtime ([7da1b23](https://github.com/carlos3g/element-dropdown/commit/7da1b2377ef304a7d7800e52397ee0100002c02f))

## [v2.18.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.18.0) — 2026-04-20

Minor bump. Public component types now preserve the `<T>` generic across the export boundary, so every TypeScript consumer gets real inference on `onChange`, `renderItem`, `renderSelectedItem`, and friends. Runtime is unchanged — drop-in compatibility preserved (`compatibility.test.tsx` green).

#### Type inference fix

Before 2.18.0 the three exports were typed as
`React.forwardRef<Ref, Props<any>>` — `React.forwardRef`'s signature only accepts one concrete props type, which silently pinned the generic to `any` at the public boundary. Consumers writing:

```tsx
const users: User[] = [/* ... */];

<Dropdown
  data={users}
  labelField=\"name\"
  valueField=\"id\"
  onChange={(item) => /* item inferred as `any` */}
  renderItem={(item, selected, index) => /* item inferred as `any` */}
/>
```

got `any` in `onChange` and `renderItem` despite `data: User[]`, and `labelField` / `valueField` weren't constrained to `keyof User`.

2.18.0 casts the default exports to `<T>(props: ...Props<T>) => ReactElement`, so the generic flows through. `item` is now inferred as `User`, and `labelField` / `valueField` are compile-time constrained to `keyof User`.

Added `src/__tests__/types.test.tsx` — compile-time guardrails using a strict `Equals<A, B>` helper (function-identity distributive conditional; does not collapse under bivariance) so any future regression to `any` fails `yarn typecheck` immediately.

#### Potentially breaking for one TS pattern

Consumers using `React.ComponentProps<typeof Dropdown>` (or the analogues) now get `DropdownProps<unknown>` instead of `DropdownProps<any>`. If you relied on that utility type anywhere, switch to the direct props type: `DropdownProps<Item>`, `MultiSelectProps<Item>`, `SelectCountryProps<Country>` — all three are already exported and are what you wanted anyway.

Everything else — runtime behaviour, prop signatures, default values, accessibility, imperative refs — is unchanged.

#### Compatibility

Drop-in promise preserved. A 2.12.x `react-native-element-dropdown` consumer can swap the install name and import path and nothing else.

## [v2.17.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.17.0) — 2026-04-20

Minor bump. Six additive public props unlock the customization and animation surface across both components, plus one fix to Dropdown's auto-scroll virtualization. Drop-in compatibility with upstream `react-native-element-dropdown` is preserved — `compatibility.test.tsx` is green.

#### New props

### MultiSelect

- **`renderChipRemoveIcon?: (item: T) => ReactElement`** — replace only the built-in `ⓧ` glyph on the default chip without reimplementing the whole chip via `renderSelectedItem`. Wrapped in an `accessibilityElementsHidden` View so screen readers still announce the chip through its existing role and hint.
- **`chipRemoveAccessibilityHint?: string`** — override the English-only `"Double tap to remove from selection"` hint. Useful for localization (pt-BR, es, etc.) or custom remove gestures. Default behaviour unchanged.

### Dropdown + MultiSelect

- **`renderEmpty?: (searchText: string) => ReactElement | null`** — custom view rendered when the list has no rows, either because `data` / `sections` is empty or because the active search filter drops every row. Receives the current search query so callers can switch between "no data" and "no results for X" copy. Wired through to both `FlatList` and `SectionList` via `ListEmptyComponent`.
- **`renderSearchClearIcon?: () => ReactElement | null`** — replace the hardcoded `close.png` clear glyph on the built-in search input while keeping the clear-on-press handler. Ignored when `renderInputSearch` is supplied (that prop replaces the entire search affordance).
- **`modalAnimationType?: 'none' | 'slide' | 'fade'`** — forwarded to the underlying React Native `<Modal>`. The OS "Reduce Motion" setting still wins — the component forces `'none'` regardless of the prop value — so the accessibility invariant holds.
- **`renderItem(item, selected, index?)`** — extends the existing signature with an optional third argument for stagger animations (`Animated.View` / `MotiView`). The `SectionList` path now forwards the section-local row index too (previously hardcoded to `0`). Existing two-argument callers keep working unchanged.

#### Bug fix

- **Dropdown auto-scroll virtualization on small lists.** FlatList's `initialScrollIndex` skipped mounting rows above the selected index until the user scrolled toward them. On a dataset whose total content fit within `maxHeight` there was nowhere to scroll, so rows 0..(target-1) stayed permanently unmounted — selecting option C in a 4-row list reopened with only C and D visible. Replaced with a post-mount `scrollToIndex` effect; the existing `onScrollToIndexFailed` retry path still covers large-list edge cases.

#### Docs

- New [Animations guide](https://carlos3g.github.io/element-dropdown/docs/guides/animations) — copy-paste recipes for Reanimated, Moti, and RN's built-in `LayoutAnimation`. The library itself ships **zero animation peer dependencies**; the guide makes that contract explicit and documents what the library deliberately won't expose (no Modal replacement, no `Animated.Value` leakage).
- Four new animation demos in the Expo example app (chevron rotation, staggered row enter, animated MultiSelect chips, zero-dep LayoutAnimation). Example-only — the library package is unchanged.

#### Compatibility

Every new prop is additive. Existing consumers who upgrade from 2.16.x need no code changes — the drop-in promise (a 2.12.x `react-native-element-dropdown` user can swap the install name and import path and nothing else) still holds.

## [v2.16.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.16.0) — 2026-04-19

Accessibility and performance pass. Two additive public props
(`accessibilityHint`, `searchDebounce`), several default-behaviour
improvements for screen readers, a round of long-standing bug
fixes, and an internal refactor that deduplicates Dropdown and
MultiSelect into a private `src/internal/` surface. Drop-in
compatibility preserved.

#### New props

- **`accessibilityHint?: string`** (Dropdown + MultiSelect) —
  hint announced after the trigger's label and combobox role.
- **`searchDebounce?: number`** (Dropdown + MultiSelect) —
  milliseconds to throttle the filter pass for large lists. The
  text input stays responsive; only the search matcher is
  debounced. `0` / omitted is the synchronous default.
- **`Section<T>`** type is now exported for consumers building
  typed section arrays.

#### Accessibility

All improvements are on by default:

- **Items, trigger, chips accessible by default.** The long-standing
  `accessible={!!accessibilityLabel}` gate has been removed, so
  every touchable surface reaches VoiceOver / TalkBack whether or
  not the consumer sets a component-level label.
- **Roles:** `button` on list rows, `header` on the default
  section header, `combobox` on triggers (unchanged). Decorative
  `ⓧ` glyph on chips hidden from the a11y tree.
- **Chip-row live region (MultiSelect).** New selections announce
  via `accessibilityLiveRegion=\"polite\"`.
- **Modal isolation.** Overlay sets `accessibilityViewIsModal` so
  VoiceOver focus can't escape to the view behind the dropdown.
- **Reduce Motion.** Modal animation disables itself when the OS
  preference is set, with live updates via
  `AccessibilityInfo.reduceMotionChanged`.
- **Search input label** now respects `searchInputProps.accessibilityLabel`
  (previously overwritten by the derived label).

#### Bug fixes

- **TextInput** now syncs to an empty-string `value` prop
  (previous `if (value) setText(value)` guard silently skipped
  `''`).
- **MultiSelect `inside` mode** now honours `hitSlop`,
  `allowFontScaling`, `selectedTextProps`, and `selectedTextStyle`
  — all of them were silently dropped from the inside-mode
  trigger.
- **MultiSelect chip row** no longer renders every item as a chip
  when `value` is `undefined`. (The filter predicate returned the
  item instead of a boolean, and `value?.indexOf(...)` was
  `undefined !== -1 === true`.)
- **SelectCountry** now honours `imageField` when rendering the
  trigger image (was hardcoded to `selectItem.image`).
- **Dropdown** items with a `valueField` equal to `null` no
  longer appear selected when nothing is picked.
- **\`_assign(item, { _index })\`** mutation of consumer data
  removed; frozen / Redux-owned items render without warnings or
  throws.
- **`setKey(Math.random())`** vestigial force-update removed.
- **`keyboardStyle: ViewStyle = {}`** dead code removed from both
  `_renderModal` paths.

#### Performance

- **Imperative handle stability.** `ref.current` identity is
  now stable from mount to unmount instead of flipping on every
  render. Consumers storing the ref in state / context / effect
  deps no longer see spurious renders.
- **SectionList row memoisation.** The `renderItem` wrapper used
  in the sectioned render path is memoised, avoiding a fresh
  identity (and full row re-render) on every parent render.

#### Internal refactor

Shared pieces between Dropdown and MultiSelect (measurement,
keyboard tracking, search normalisation, section header, search
input, key extractor, reduce-motion, debounce) are extracted to a
private [`src/internal/`](https://github.com/carlos3g/element-dropdown/tree/master/src/internal) surface.
Not re-exported from `src/index.tsx`. Each component shed ~130
lines of duplicated code and now consumes the primitives.

#### Tooling

- Bumped to **TypeScript 6.0** with `moduleResolution: \"bundler\"`
  and an explicit `rootDir` in `tsconfig.build.json`.
- GitHub Actions bumped (checkout 4 → 6, setup-node 4 → 6,
  deploy-pages 4 → 5, upload-pages-artifact 3 → 5).
- `docs-version.yml` and `changelog.yml` now rebase-and-retry
  on push so release-time race conditions don't leave the repo
  half-done.
- `dangerfile.js` fixed for ESM module loading in danger@13 (was
  throwing `__dirname is not defined` on every perf-workflow
  run).

#### Tests

87 → 187 tests (+100). New suites for internal primitives
(`internal.test.ts`, `internal-components.test.tsx`,
`internal-hooks.test.tsx`) plus regression coverage for every
bug fixed above. `compatibility.test.tsx` still green — 21
assertions over the drop-in public surface.

#### Docs

- Rewritten [Accessibility](https://carlos3g.github.io/element-dropdown/docs/accessibility)
  page.
- Dropdown + MultiSelect prop tables updated with
  `accessibilityHint`, `searchDebounce`, and the new a11y
  default-behaviour notes.
- CLAUDE.md grew an "Internal architecture" + "Accessibility
  invariants" section.

## [v2.15.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.15.0) — 2026-04-19

Sectioned lists. A single new prop (`sections`) turns Dropdown and
MultiSelect into grouped selectors backed by React Native's
`SectionList`, with sticky headers and per-section search. Every
other behaviour — selection, search, `disabledField`,
`activeColor`, `onEndReached`, `excludeItems`,
`hideSelectedFromList`, `selectedToTop`, etc. — is unchanged.

#### New API

- **`sections?: { title: string; data: T[] }[]`** — pass instead
  of `data` to render grouped items. When present, `data` is
  ignored.
- **`renderSectionHeader?(section) => ReactElement | null`** — fully
  custom header renderer.
- **`sectionHeaderStyle?: ViewStyle`** — style the default header
  container.
- **`sectionHeaderTextStyle?: TextStyle`** — style the default
  header `<Text>`.
- **`Section<T>`** — new exported type.

Both `Dropdown` and `MultiSelect` accept all four new props.

#### Minimal example

```tsx
<Dropdown
  sections={[
    { title: 'Berries', data: [{ label: 'Strawberry', value: 'str' }] },
    { title: 'Citrus',  data: [{ label: 'Lemon',      value: 'lem' }] },
  ]}
  labelField="label"
  valueField="value"
  onChange={setFruit}
/>
```

#### Behavior notes

- Search filters **per-section**; sections that lose every match
  are hidden (no lonely headers).
- `autoScroll` is skipped in sectioned mode — section headers
  shift offsets, so we don't try to scroll to a specific row.
- `flatListProps` is ignored in sectioned mode; use the new
  header styling / render props instead.
- `data` moves from required to optional at the type level
  (additive — existing callers passing `data` are unchanged).

#### Fixes

- Stable empty-array fallback for an unset `data` prop. The
  former `data = []` destructure default created a new reference
  on every render, which tripped `getValue`'s useEffect into an
  infinite re-render loop whenever users rely on `sections` and
  skip `data`.

#### Docs

New recipe on the docs site:
- [Sectioned lists](https://carlos3g.github.io/element-dropdown/docs/guides/sectioned-lists)

Refreshed:
- [Dropdown API](https://carlos3g.github.io/element-dropdown/docs/components/dropdown)
- [MultiSelect API](https://carlos3g.github.io/element-dropdown/docs/components/multi-select)

#### Upstream issues closed

- #165 (sectioning)
- #223 (group headers)

## [v2.14.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.14.0) — 2026-04-19

A batch of community-requested features ported from the upstream
PR backlog, plus a few fork-only additions and small fixes. All
changes are additive — `v2.13.0` consumers can upgrade without
code changes.

#### Search input
- **`searchKeyboardType`** — set the search input's `keyboardType`
  (closes upstream #320, supersedes #230, #231).
- **`searchInputProps`** — `TextInputProps` passthrough for
  `selectionColor`, `returnKeyType`, `autoCapitalize`,
  `autoFocus`, etc. (covers issue #312).
- **`searchField`** now accepts `keyof T | (keyof T)[]` — match
  across multiple fields without writing a custom matcher
  (reframes upstream #308).
- **`persistSearch`** — keep the search text across opens /
  selections instead of clearing it (issue #283).

#### List behaviour
- **`onEndReached`** + **`onEndReachedThreshold`** first-class on
  both components (closes upstream #226 / issue #329).
- **`activeItemTextStyle`** — extra text style applied only to the
  selected row (closes upstream #269).
- **`hideSelectedFromList`** — drop selected items from the
  rendered list (issue #321).

#### MultiSelect-only
- **`closeModalWhenSelectedItem`** — opt-in close-on-toggle
  (closes upstream #310). Default `false` preserves current
  keep-selecting behaviour.
- **`selectedToTop`** — push selected items to the top of the
  list (closes upstream #241).

#### Custom presentation
- **`renderSelectedItem`** on Dropdown — replace the entire
  trigger body with custom JSX, receives `visible` (closes
  upstream #318 slice; supersedes #347, #273, #323).
- **`renderModalHeader`** on both — render a sticky header above
  the list inside the modal, receives `close()` (covers issue
  #218).

#### SelectCountry
- **`selectedImageStyle`** — separate style for the trigger image
  on top of the existing `imageStyle` for list rows (closes
  upstream PR #257).

#### Fixes
- Auto position now flips upward when the trigger sits in the
  bottom half of the screen, replacing the fixed `< 150` pixel
  threshold with `max(minSlack, H/2)` (closes upstream #264).
- Modal-level `TouchableWithoutFeedback` is now
  `accessible={false}` and the redundant inner wrap was removed,
  so iOS Accessibility Inspector and screen readers can drill
  into individual list rows (covers issues #297, #303).

#### Docs
New recipes on the docs site:

- [Pagination with `onEndReached`](https://carlos3g.github.io/element-dropdown/docs/guides/end-reached-pagination)
- [Custom trigger](https://carlos3g.github.io/element-dropdown/docs/guides/custom-trigger)
- [Modal header](https://carlos3g.github.io/element-dropdown/docs/guides/modal-header)
- [Selected-item ordering](https://carlos3g.github.io/element-dropdown/docs/guides/selected-ordering)
- [Search input passthrough](https://carlos3g.github.io/element-dropdown/docs/guides/search-input-props)

Updated: [Custom search field](https://carlos3g.github.io/element-dropdown/docs/guides/custom-search-field)
to cover the new multi-field array form.

#### Upstream PRs closeable as merged-equivalent

This release adds equivalents for upstream PRs **#218 (issue), #226, #241, #257, #264, #269, #310, #318 (slice), #320** — they can be closed on `hoaphantn7604/react-native-element-dropdown` referencing this release. Plus duplicates **#230, #231, #347, #273, #323, #308**.

## [v2.13.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.13.0) — 2026-04-19

First substantive release under the fork. Modernizes the dev stack,
lands community fixes, and adds two small features. No breaking API
changes — consumers on 2.12.x can upgrade in place.

#### Features

- **`disabledField`** on `Dropdown` and `MultiSelect` — mark individual
  items as non-interactive. Closes upstream #170, #291.
- **`hitSlop`** — enlarge the trigger tap target. Closes upstream #354.
- **`allowFontScaling`** — threaded through trigger label, item
  labels, and the built-in search input. Closes upstream #248, #341.
- **`isInsideModal`** — tells the component that its `measureInWindow`
  result is already relative to an enclosing `<Modal>`, so the
  status-bar offset isn't double-counted. Closes upstream #362.

#### Fixes

- Stop stale-frame flicker on reopen — cached measurement is cleared
  on close so reopen waits for a fresh `measureInWindow`. Closes
  upstream #198, #330, #298.
- Stabilize `autoScroll` — replace the broken `debounce` + imperative
  scroll with `FlatList#initialScrollIndex`. Kills snap-back during
  browsing and the `scrollToIndex out of range` crash when searching.
  Closes upstream #345, #290, #344, #156, #202, #274, #275, #249.
- `MultiSelect` trigger label honors `selectedTextStyle` when items
  are selected. Closes upstream #353.
- `itemContainerStyle` can override the row's built-in `padding: 17`.
  Closes upstream #322, #251, #266, #250, #203, #187.
- TS type-only re-exports use `export type`. Closes upstream #174,
  #324.
- Export `DropdownProps`, `MultiSelectProps`, `SelectCountryProps`.
  Closes upstream #352.
- `MultiSelect#renderLeftIcon` / `renderRightIcon` receive `visible`.
  Closes upstream #222.
- `FlatList#keyExtractor` uses `valueField` when present. Closes
  upstream #200.

#### Accessibility

- Trigger now announces itself as `combobox` with
  `accessibilityState.expanded` / `disabled`. Closes upstream #214.
- List items expose `accessibilityState.selected` / `disabled`.

#### Docs

- New `docs/recipes.md` covering ~15 common questions.
- New `docs/upstream-triage.md` with the full fork roadmap.

#### Tooling

Modernized: Node 22, TypeScript 5.7, React 18.3, React Native 0.76
(dev), Jest 29, ESLint 9 flat config, Prettier 3, release-it 20,
Lefthook 1.10. Test suite: 20 passing tests (up from one `it.todo`).

#### Deferred

Keyboard-avoidance rework (#180, #357, #339, #288, #328), Android 14+
`dropdownPosition="top"` edge-to-edge fallout (#355), and the Realme
positioning quirk (#350) — all need device-level reproduction.

<!-- generated:end -->
