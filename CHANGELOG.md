# Changelog

All notable changes to `@carlos3g/element-dropdown` are listed here.
This file is auto-updated on each GitHub Release by
`.github/workflows/changelog.yml`. The canonical source is the
[GitHub Releases page](https://github.com/carlos3g/element-dropdown/releases).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- generated:start -->

## [v2.14.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.14.0) — 2026-04-19

A batch of community-requested features ported from the upstream PR backlog, plus a few fork-only additions and small fixes. All changes are additive — `v2.13.0` consumers can upgrade without code changes.

### Search input
- **`searchKeyboardType`** — set the search input's `keyboardType` (closes upstream #320, supersedes #230, #231).
- **`searchInputProps`** — `TextInputProps` passthrough for `selectionColor`, `returnKeyType`, `autoCapitalize`, `autoFocus`, etc. (covers issue #312).
- **`searchField`** now accepts `keyof T | (keyof T)[]` — match across multiple fields without writing a custom matcher (reframes upstream #308).
- **`persistSearch`** — keep the search text across opens / selections instead of clearing it (issue #283).

### List behaviour
- **`onEndReached`** + **`onEndReachedThreshold`** first-class on both components (closes upstream #226 / issue #329).
- **`activeItemTextStyle`** — extra text style applied only to the selected row (closes upstream #269).
- **`hideSelectedFromList`** — drop selected items from the rendered list (issue #321).

### MultiSelect-only
- **`closeModalWhenSelectedItem`** — opt-in close-on-toggle (closes upstream #310). Default `false` preserves current keep-selecting behaviour.
- **`selectedToTop`** — push selected items to the top of the list (closes upstream #241).

### Custom presentation
- **`renderSelectedItem`** on Dropdown — replace the entire trigger body with custom JSX, receives `visible` (closes upstream #318 slice; supersedes #347, #273, #323).
- **`renderModalHeader`** on both — render a sticky header above the list inside the modal, receives `close()` (covers issue #218).

### SelectCountry
- **`selectedImageStyle`** — separate style for the trigger image on top of the existing `imageStyle` for list rows (closes upstream PR #257).

### Fixes
- Auto position now flips upward when the trigger sits in the bottom half of the screen, replacing the fixed `< 150` pixel threshold with `max(minSlack, H/2)` (closes upstream #264).
- Modal-level `TouchableWithoutFeedback` is now `accessible={false}` and the redundant inner wrap was removed, so iOS Accessibility Inspector and screen readers can drill into individual list rows (covers issues #297, #303).

## [v2.13.0](https://github.com/carlos3g/element-dropdown/releases/tag/v2.13.0) — 2026-04-19

Initial fork-maintained release — modernized tooling, long-standing bugs fixed, drop-in migration from `react-native-element-dropdown@2.12.x`.

### New props
- **`disabledField`** — mark individual items non-interactive without forking `renderItem`.
- **`hitSlop`** — expand the trigger's tap target.
- **`allowFontScaling`** — propagated to every `Text`/`TextInput`.
- **`isInsideModal`** — correct positioning when nested inside a React Native `<Modal>`.

### Fixes
- `scrollToIndex out of range` crash when searching long lists (upstream #156, #202, #274, #275).
- `autoScroll` snap-back during browsing, jump on open, and reference-equality reset (upstream #345, #290, #344).
- Open-time flicker on reopen after scroll (upstream #198, #330, #298).
- `padding: 17` on item rows is now overridable via `itemContainerStyle` (upstream #322 + duplicates).
- MultiSelect trigger honours `selectedTextStyle` instead of always falling back to `placeholderStyle` (upstream #353).

### TS / build
- `IDropdownRef`, `IMultiSelectRef`, `DropdownProps`, `MultiSelectProps`, `SelectCountryProps` now exported via `export type` so bundlers don't emit them as runtime imports (upstream #174, #324, #352).
- `keyExtractor` uses `valueField` instead of array index (upstream #200 / PR #107).
- MultiSelect `renderLeftIcon` / `renderRightIcon` now receive `visible` (upstream PR #222).
- Trigger announces `accessibilityRole="combobox"` plus `expanded` / `disabled` state (upstream #214).

### Tooling
- Yarn 4 (Berry) via Corepack, TypeScript 5.7, RN 0.76 dev, React 18.3, Jest 30, ESLint 9 flat, Reassure perf regression tests.
- npm publish via Trusted Publishing (OIDC), provenance attestation, Node 24 on the release runner.
- Docusaurus 3 documentation site at <https://carlos3g.github.io/element-dropdown/>.

<!-- generated:end -->
