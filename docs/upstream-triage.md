# Upstream triage & v3 roadmap

Snapshot of open pull requests on the upstream repo
[`hoaphantn7604/react-native-element-dropdown`](https://github.com/hoaphantn7604/react-native-element-dropdown)
as of **2026-04-19**. Produced to plan the next releases of
`@carlos3g/element-dropdown` (current: `v2.13.0`).

Upstream is effectively unmaintained (last meaningful activity
mid-2024, **149 open issues**, **37 open PRs**). No new PR opened
since #359 on 2025-11-18.

This document focuses on **the 37 open upstream PRs**, triaged
one-by-one against the current state of the fork. Issue-level
triage was the focus of the previous revision; the PR diffs are a
better signal of "what's ready to land" since contributors already
did the work.

---

## 1. Status snapshot — what the fork already shipped

The `v2.13.0` branch already lands the entire **v3.0 quick-wins
bundle** plus most of v3.1/v3.2. Reverify before attempting to
re-implement any of these:

| Cluster | Upstream issues / PRs closed | Fork commit |
|---|---|---|
| TS exports (`export type`, `DropdownProps`, `MultiSelectProps`, `SelectCountryProps`) | #174, #324, #352 / PR #176 | `7cee7b0` |
| `keyExtractor` by `valueField` | #200 / PR #107 | `7cee7b0` |
| MultiSelect `renderLeft/RightIcon(visible)` | PR #222 | `7cee7b0` |
| Combobox a11y role + expanded/disabled state | #214 / PR #215 | `7cee7b0` |
| `scrollToIndex` out-of-range guard + retry | #156, #202, #274, #275 / PR #253 | `a070c35` |
| `autoScroll` snap-back + reference-equality reset | #345, #290, #344 | `a070c35` |
| Item-row `padding: 17` overridable via `itemContainerStyle` | #322, #251, #266, #250, #203, #187, #240 / PR #162 (partial) | `4443d65` |
| MultiSelect trigger honours `selectedTextStyle` | #353 | `3918bdc` |
| Open-time flicker (drop cached measurement on close) | #198, #330, #298 | `025ca95` |
| Modal-nesting offset (`isInsideModal` prop) | #362 | `025ca95` |
| Per-item disable (`disabledField`) | #170, #291 | `c258e5c` |
| `hitSlop` prop | #354 | `c448c37` |
| `allowFontScaling` prop | #248, #341 / PR #342 (cleaned) | `c448c37` |
| `selectedTextProps` on MultiSelect | PR #282 | already wired in `MultiSelect/index.tsx:449` |
| `searchPlaceholderTextColor` on MultiSelect | PR #233 | already wired in `MultiSelect/index.tsx:571` |
| Infinite re-render in search effect | #302 / PR #304, #359 | already correct in current code |
| Recipes / undocumented features | #129, #163, #169, #173, #183, #192, #193, #246, #252, #255, #265, #280, #289, #292, #295, #305, #311, #337 | `394c0c6` + Docusaurus site |
| Modernized tooling (Yarn 4, TS 5.7, RN 0.76 dev, ESLint 9 flat, Jest 30, Reassure perf, Bob 0.32) | n/a | tooling commits |

Net result: **~50 upstream issues are addressable today** by simply
swapping the install name from `react-native-element-dropdown` to
`@carlos3g/element-dropdown`. The drop-in promise is enforced by
`src/__tests__/compatibility.test.tsx`.

---

## 2. Open upstream PRs — full triage (37/37)

### 2.1 ✅ Already merged-equivalent — close upstream (12 PRs)

These are already shipped under a different commit or are no-ops
against current fork code. No action needed in the fork; could be
closed upstream as "merged in `@carlos3g/element-dropdown`".

| Upstream PR | Title | Where it landed |
|---|---|---|
| #176 | `export type` for ref types | `7cee7b0` (extended) |
| #107 | `keyExtractor` by `valueField` | `7cee7b0` |
| #215 | A11y role | `7cee7b0` (extended) |
| #222 | MultiSelect `renderLeft/RightIcon(visible)` | `7cee7b0` |
| #253 | `scrollToIndex` out-of-range guard | `a070c35` |
| #279 | Error handling on top of #253 | superseded by `a070c35` |
| #304 | `useEffect` infinite-loop fix | already correct in current code |
| #359 | Same fix, different patch | already correct in current code |
| #282 | `selectedTextProps` on MultiSelect | already wired |
| #233 | `searchPlaceholderTextColor` on MultiSelect | already wired |
| #240 | Remove `padding: 17` from item | superseded by `4443d65` (default kept, made overridable) |
| #342 | `allowFontScaling` | `c448c37` (clean impl, no 23k-line lockfile churn) |
| #117 | `invertedList` | already shipped upstream as `inverted`, inherited |

### 2.2 ❌ Not applicable — close upstream without porting (5 PRs)

| Upstream PR | Title | Why skip |
|---|---|---|
| #85 | Remove `@ts-expect-err` | irrelevant under TS 5.7 |
| #90 | Update Node v10 in CI | fork already on Node 22/24 |
| #126 | `orientation.portrait === true` → `orientation.portrait` | micro-cosmetic, no behavioural gain |
| #296 | Remove `Math.floor` from positions | **regresses** `025ca95` which added the floors to fix sub-pixel flicker |
| #307 | `imageField` for left icon | `renderLeftIcon` is already field-agnostic |

### 2.3 🟢 Implement — v2.14.0 "community patches v2" (8 PRs)

Small, mechanical, low-risk. One PR per entry per fork branching
convention. Bundled release target.

| # | Upstream PR | Change | Size | Notes |
|---|---|---|---|---|
| R1 | **#320** | `searchKeyboardType` | ~10 lines | Add to both Dropdown + MultiSelect; closes #230, #231 too |
| R2 | **#310** | `closeModalWhenSelectedItem` on MultiSelect | ~30 lines | Dropdown already has it — port that slice |
| R3 | **#269** | `activeItemTextStyle` (text style for selected list row) | ~10 lines | Complements existing `activeColor` |
| R4 | **#241** | `selectedToTop` on MultiSelect | ~15 lines | Push selected items to top of options list |
| R5 | **#257** | `selectedImageStyle` on `SelectCountry` | ~5 lines | Trivial, additive |
| R6 | **#226** | `onEndReached` first-class | ~15 lines | Currently only via `flatListProps`; expose with `onEndReachedThreshold` default |
| R7 | **#264** | `auto` position via half-screen heuristic | ~5 lines | Replaces fixed `< 150` threshold at `Dropdown/index.tsx:691` |
| R8 | **#258** | Don't double-apply `inputSearchStyle` | 1 line | Verify against `TextInput/index.tsx:81` first — `styles.input` differs across layers |

### 2.4 🟡 Implement — v2.15.0, needs API decision (2–3 PRs)

Three upstream PRs propose the same "custom selected display"
feature with incompatible APIs. Pick one, close the others as
duplicates.

| Upstream PR | Proposed API | Verdict |
|---|---|---|
| **#318** | `renderSelectedItem?(visible) => ReactNode` | **Best** — consistent with `renderLeft/RightIcon`, exposes `visible` |
| #347 | `selectedText?: string` | string-only, no JSX support |
| #273 | `selectedVal?: JSX.Element` | poorly named, no `visible` arg |
| #323 | `renderMainView?() => ReactNode` | same intent, weaker name |

**Recommendation:** port only the `renderSelectedItem` slice from
PR #318 (drop the rest of its broader refactor — see §2.6); close
#347, #273, #323.

Plus:

| # | Upstream PR | Change | Notes |
|---|---|---|---|
| F1 | **#318** (slice) | `renderSelectedItem` | per above |
| F2 | **#308** | `searchBothFieldFunction` | Reframe as smarter default: accept `searchField` as `string \| string[]`, not a new prop. Closes #308 conceptually. |
| F3 | **#162** | `itemTouchableStyle` + `itemTextContainerStyle` | Re-evaluate: our `4443d65` already lets `itemContainerStyle` shrink the row. Implement only if there's a demonstrable case for separating tappable area from text container. |

### 2.5 🟠 Defer — needs physical-device repro (3 PRs)

Per `CLAUDE.md`, anything that touches measurement / positioning
without device repro is risky.

| Upstream PR | Why defer |
|---|---|
| #197 | Moves `left` from `styleVertical` to outer wrapper. Risk: RTL + Modal regression |
| #209 | Moves `width` to immediate parent of FlatList (Android scroll bug). Same risk |
| #319 | Animation via RN `Animated` API. Adds surface area; better as opt-in Reanimated layout-anim in v3 |

### 2.6 ⚫ Close as superseded / out of scope (5 PRs)

| Upstream PR | Reason |
|---|---|
| #318 | Broader refactor — keep only the `renderSelectedItem` slice (see §2.4); discard the rest |
| #230 | Duplicate of #320 |
| #231 | Duplicate of #320 |
| #347 | Conceptual duplicate of #318 |
| #273 | Conceptual duplicate of #318 |
| #323 | Conceptual duplicate of #318 |

---

## 3. PR triage tally

| Bucket | Count | PRs |
|---|---|---|
| Already merged-equivalent | 12 | #176, #107, #215, #222, #253, #279, #304, #359, #282, #233, #240, #342, #117 |
| Not applicable | 5 | #85, #90, #126, #296, #307 |
| Implement v2.14.0 | 8 | #320, #310, #269, #241, #257, #226, #264, #258 |
| Implement v2.15.0 (design call) | 2–3 | #318 (slice), #308 (reframed), #162 (maybe) |
| Defer | 3 | #197, #209, #319 |
| Close as duplicate / superseded | 5 | #230, #231, #347, #273, #323 |
| **Total** | **37** | |

(#117 counted under "merged-equivalent" since it's already in
upstream 2.x and inherited; it's also closeable.)

---

## 4. Suggested order of attack

**v2.14.0 — community patches v2 (R1–R8 above):**
Bundle the 8 small, mechanical ports. One PR per row (per
branching convention). Closes ~10 more upstream issues by direct
reference. Estimated ~1 week.

**v2.15.0 — DX features + API decision (F1–F3 above):**
Each its own PR with a recipe doc page. Estimated ~1 week if
F3/#162 is dropped, ~2 weeks if kept.

**v3.0 — bigger features (deferred):**
Sectioned lists (#165), autocomplete / add-if-missing (#254),
optional animation hooks (#319 reframed in Reanimated). Each its
own minor release.

**Continuous:** keep `compatibility.test.tsx` green; any breaking
change flips us to a major and requires an entry in
`website/docs/migration-from-upstream.mdx`.

---

## 5. Issue-level work not covered by upstream PRs

These have no corresponding upstream PR but are worth tracking as
the fork's own roadmap (no contributor patch to port — original
work needed):

| # | Upstream issues | Notes |
|---|---|---|
| F4 | `hideSelectedFromList` boolean | #321 — additive |
| F5 | `maxVisibleChips` + "+N more" in MultiSelect | #149 |
| F6 | Locale-aware default search (`localeCompare` w/ `sensitivity:'base'`) | #172 |
| F7 | iOS arrow-key / per-item a11y | #228, #297, #303 |
| F8 | Modal header (`renderModalHeader?(close) => ReactNode`) | #218 |
| F9 | `persistSearch?: boolean` | #283 (opt-in to keep current behaviour) |
| F10 | `selectionColor` / `cursorColor` on search input | #312 |
| F11 | `indicatorStyle` for iOS dark-mode scrollbar | #333, #332, #171, #309 |

Target: **v2.15.0** alongside §2.4 items.

---

## 6. Deferred — need physical-device repro (issue-level)

Per `CLAUDE.md`, these stay out of scope until reproducible:

| # | Upstream | Reason |
|---|---|---|
| D1 | #180, #357, #339, #288, #328 | Keyboard-avoidance rework; iOS + Android 0.76+ math is brittle |
| D2 | #355 | Android 14+ `dropdownPosition="top"` edge-to-edge |
| D3 | #350 | Realme OEM positioning quirk |
| D4 | #364 | iOS-only open/close blip on screen-back navigation |
| D5 | #358 | Dropdown not showing on iOS 26 (needs SDK 26 testing) |
| D6 | #340, #315 | "Untested on new architecture" — track once we have a Fabric harness |
| D7 | #313 | `SafeAreaView` interactions |
| D8 | #243 | Android gap (new-arch regression) — overlaps D1/D6 |

---

## 7. Out of scope (won't fix, by design)

- Anything that requires native modules.
- Animations that require a non-peer-dep library.
- Tooling rollbacks (Yarn 1, ESLint 8, RN 0.71, etc.).
- `react-native-builder-bob` 0.40+ migration — needs a separate
  consumer-aware PR; tracked but not blocking.

---

*All issue/PR numbers above refer to the upstream repo unless
stated otherwise. Snapshot taken 2026-04-19. Re-run the triage
before starting a new work batch — issue numbers and counts drift.*
