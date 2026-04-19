# Upstream triage & v3 roadmap

Snapshot of open issues and pull requests on the upstream repo
[`hoaphantn7604/react-native-element-dropdown`](https://github.com/hoaphantn7604/react-native-element-dropdown)
as of **2026-04-18**. Produced to plan the v3 roadmap for
`@carlos3g/element-dropdown`.

The upstream is effectively unmaintained (last meaningful activity mid-2024,
186 open issues, 37 open PRs, many 1–3 years old). Most of the backlog
boils down to five structural problems.

---

## 1. Executive summary

Five clusters account for the majority of reported pain:

1. **`measureInWindow` + `statusBarHeight` math** is wrong in common cases:
   RN Modal nesting, certain OEMs (Realme), Android 14+ with `top` position,
   open-time flicker.
2. **`autoScroll` / `scrollToIndex` misbehavior**: snap-back during browsing,
   jump on open, reference-equality reset, classic `scrollToIndex out of
   range` crash when searching.
3. **TypeScript exports broken for bundlers** — `IDropdownRef`,
   `IMultiSelectRef`, and the `Props` types aren't exported as types.
4. **Hardcoded `padding: 17` in `styles.item`** — users can't shrink or
   style the row container.
5. **Keyboard avoidance** on iOS + Android 0.76+ is brittle.

There are also ~10 small, clean PRs sitting unmerged for 1–3 years that
close multiple issues each.

---

## 2. Issue clusters

### 2.1 Positioning / measurement

| Upstream | Summary |
|---|---|
| #362 | Dropdown nested inside a `Modal` renders with `statusBarHeight` offset |
| #350 | List opens above input on Realme devices despite `dropdownPosition="bottom"` |
| #355 | `dropdownPosition="top"` broken on Android 14+ |
| #207 | Incorrect open position on Android post-RN 0.72 |
| #243 | Gap between field and list on Android (new-arch regression) |
| #198 | List flickers on open because initial render uses stale position |
| #330 | Same flicker, multi-dropdown screens |
| #298 | First-click UI disturbance after scroll |
| #360 | iOS-specific left offset |
| #161, #182, #268 | Older duplicate reports |

Root cause: `_measure` runs `measureInWindow` but the modal renders
before the measurement callback fires, using a stale position from a
prior open. Fix is a dedicated rework (see v3.1).

### 2.2 `scrollToIndex` / autoScroll

| Upstream | Summary |
|---|---|
| #345 | `autoScroll` snaps back while browsing long lists |
| #290 | Content jumps to selected value after open |
| #344 | Value resets and scrolls to top due to reference-equality mismatch |
| #156, #202, #274, #275 | `scrollToIndex out of range` crash while searching |
| #249 | Flickering scroll |

Two fixes: a one-line `scrollToIndex` bounds guard
(already proposed as PR #253), and an `autoScroll` redesign that
runs exactly once per open.

### 2.3 TypeScript / build-tooling

| Upstream | Summary |
|---|---|
| #174 | `IDropdownRef`, `IMultiSelectRef` not found (webpack/expo) |
| #324 | Same, in Expo warnings |
| #284 | Metro/Expo cannot read `Dropdown` of undefined — related bundling failure |
| #352 | Export `DropdownProps` / `MultiSelectProps` |
| #157 | Jest transform docs note |

Fix: `export type` for type-only re-exports in `src/index.tsx`, and add
`DropdownProps` / `MultiSelectProps` exports (≈10-line diff; covered by
PR #176 plus a small addition).

### 2.4 Styling / customization

| Upstream | Summary |
|---|---|
| #322 | Item view padding not overridable |
| #251, #266, #250, #203, #187 | Same root cause |
| #333 | iOS dark-mode scroll indicator invisible (needs `indicatorStyle` prop) |
| #332, #171, #309 | Scroll-bar visibility / color |
| #183 | Background color for selected item — already `activeColor`; **docs gap** |
| #337 | Show selected items inside the input — already `inside={true}`; **docs gap** |
| #353 | MultiSelect trigger applies `placeholderStyle` even when items are selected — confirmed in source |
| #321 | Don't render selected item |
| #149 | Option to truncate number of chips in MultiSelect |
| #361 | Space between text and icon |

### 2.5 Keyboard / focus

| Upstream | Summary |
|---|---|
| #180 | Dropdown stays far from keyboard when searching on iOS |
| #288 | Unfiltered data when keyboard closed with search text |
| #339 | Doesn't return to original position after keyboard dismiss |
| #357 | Doesn't pull up when keyboard is open |
| #328 | Keyboard + positioning issues on RN 0.76/0.77 |

### 2.6 Features requested

**Data / behavior:**
`#170`/`#291` disable individual item · `#165` sectioning ·
`#223` group headers · `#254` add-if-not-in-list ·
`#217` complex entities · `#283` persist search query ·
`#329` onEndReached (also PR #226) ·
`#349` conditional label/value.

**Styling:**
`#252` icon per visibility — already possible ·
`#326` add item to renderLeft/RightIcon ·
`#236` full-width modal ·
`#218` modal header with exit button.

**Accessibility:**
`#214` A11y role (PR #215) · `#228` arrow-key a11y ·
`#297` / `#303` iOS items individually accessible ·
`#354` `hitSlop` · `#312` selection / cursor color ·
`#248` / `#341` `allowFontScaling`.

**Search:**
`#262` autocomplete docs · `#308` `searchBothFieldFunction` ·
`#230`/`#231`/`#320` `searchKeyboardType` ·
`#172` locale-aware search.

### 2.7 Doc gaps (already-supported behavior, just undocumented)

~15 issues are really questions about features that already exist:
`#129`, `#163`, `#169`, `#173`, `#183`, `#192`, `#193`, `#246`, `#255`,
`#280`, `#289`, `#292`, `#295`, `#305`, `#311`, `#337`. A Recipes
section in the README would retire most of them.

### 2.8 Vague / missing repro (low priority)

`#244`, `#276`, `#260`, `#263`, `#293`, `#216`, `#227`, `#229`, `#270`,
`#314`, `#336`, `#338`, `#364`. Ask for repro; close if no response.

---

## 3. Pull-request shortlist

Small, clean PRs ready to merge:

| Upstream PR | Change | Fixes |
|---|---|---|
| #176 | `export type` for `IDropdownRef`, `IMultiSelectRef` | #174, #324 |
| #253 | Guard `scrollToIndex` when list is empty | #156, #202, #274, #275 |
| #359 | Remove `listData` from `useEffect` deps | #302 |
| #304 | Also guards the infinite loop (overlaps with #359) | #302 |
| #222 | MultiSelect `renderLeft/RightIcon` gets `visible` arg | — |
| #215 | Adds accessibility role | #214 |
| #209 | Moves container width to parent of the FlatList | Android scroll bug |
| #107 | `keyExtractor` by `valueField` instead of index | #200 |
| #162 | `itemTouchableStyle` + `itemTextContainerStyle` | #322, #251, #266, #250 |
| #282 | `selectedTextProps` in MultiSelect | #188 |
| #269 | `activeTextStyle` for selected-list item | — |
| #233 | `searchPlaceholderTextColor` in MultiSelect | #261 |
| #258 | Don't double-apply `inputSearchStyle` inside text | — |
| #264 | `auto` position uses half-screen heuristic | #242 |
| #320 | `searchKeyboardType` | #230, #231 |
| #241 | `selectedToTop` option in MultiSelect | — |
| #257 | SelectCountry `selectedImageStyle` | — |

Needs rework (real diff small, PR noisy):

- **#342** (`allowFontScaling`) — real change ≈10 lines, PR includes
  23 k lines of lockfile churn.
- **#310** (`closeModalWhenSelectedItem` in MultiSelect) — the Dropdown
  already has this prop; port that ~30-line slice.

Close as superseded:

- **#117** — `invertedList` already shipped as `inverted`.
- **#230**, **#231** — duplicates of #320.
- **#273** vs **#347** — pick one custom-selected-display API, close
  the other.

---

## 4. Top 12 issues by bang-for-buck

| Rank | Issue(s) | Complexity |
|---|---|---|
| 1 | TS exports (#174, #324, #352) | S |
| 2 | Modal-nested positioning (#362) — patch in hand | S |
| 3 | `autoScroll` snap-back (#345 + cluster) | S–M |
| 4 | `scrollToIndex` out of range (#156 + dups) — PR #253 | S |
| 5 | Infinite re-render (#302) — PR #359 | S |
| 6 | Open-time flicker (#198, #330) | M |
| 7 | Item padding not overridable (#322 + dups) | S |
| 8 | Android 14+ top position (#355) | M |
| 9 | Keyboard-avoiding math (#180, #357, #339) | M |
| 10 | Per-item disable (#170, #291) | S |
| 11 | `hitSlop` prop (#354) | S |
| 12 | MultiSelect `selectedTextStyle` bug (#353) | S |

Honorable mentions: `allowFontScaling` (#248/#341), iOS dark-mode
scrollbar (#333), A11y role (#214/PR #215), `selectionColor` (#312).

---

## 5. Suggested v3 order of attack

**v3.0 — stability + TS (quick wins bundle):**
1. TS exports via `export type`
2. `scrollToIndex` guard
3. Stabilize `autoScroll` (fire-once-per-open, reference-safe)
4. Infinite-loop guard
5. Small community PRs (#222, #215, #209, #107)
6. Move `padding: 17` into `itemContainerStyle` default or expose a new prop

**v3.1 — positioning overhaul:**
7. `_measure` rework: Modal nesting, OEM quirks, Android 14+, open flicker
8. Keyboard-avoidance rework on iOS + Android for both top/bottom positions

**v3.2 — DX props:**
9. `disabledField`, `hitSlop`, `allowFontScaling`, `selectionColor`,
   `indicatorStyle`
10. Recipes section in README to close ~15 question-issues

**v3.3 — optional features:**
11. Sections (`#165`), first-class `onEndReached` (`#329` / PR #226),
    autocomplete (`#254`), modal header (`#218`)

---

*All issue/PR numbers above refer to the upstream repo unless stated
otherwise. Snapshot taken 2026-04-18; re-run the triage before starting
a new work batch.*
