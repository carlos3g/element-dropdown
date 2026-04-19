# CLAUDE.md

Orientation for Claude when working in this repo. Keep this file
short; link to real docs rather than duplicating them.

## What this project is

**Actively maintained fork** of
[`hoaphantn7604/react-native-element-dropdown`](https://github.com/hoaphantn7604/react-native-element-dropdown),
published on npm as **`@carlos3g/element-dropdown`**.

The original package was popular (1.3k stars, 210 forks) but has been
effectively unmaintained since mid-2024 — 186 open issues, 37 open
PRs, none of them addressed. This fork exists to keep the library
alive: triage the backlog, land community patches, fix bugs, add
small DX features, and modernize the tooling.

## Goals (in priority order)

1. **Stability.** Fix long-standing bugs the upstream never
   addressed (positioning, autoScroll crashes, TS export issues,
   styling dead-ends). The public API must stay backward-compatible
   for users migrating from `react-native-element-dropdown` — a
   2.12.x user should be able to change the install name and the
   import path and nothing else.
2. **Triage community work.** Many upstream PRs are small, clean,
   and ready to merge. Port them here (see
   [`docs/upstream-triage.md`](docs/upstream-triage.md)).
3. **Add DX-level features** that users have been asking for
   (per-item disable, `hitSlop`, better a11y, etc.) without bloating
   the API or introducing native modules.
4. **Improve docs.** Many upstream issues are really questions —
   answers already exist in the code or props. See
   [`docs/recipes.md`](docs/recipes.md).
5. **Keep tooling modern.** Don't let this project drift back into
   the state the upstream is in.

## Key repo facts

- **Default branch:** `master`.
- **Remotes:** `origin` → `carlos3g/element-dropdown` (this fork),
  `upstream` → `hoaphantn7604/react-native-element-dropdown`.
- **Default release flow:** bump version on `master` → create a git
  tag + GitHub Release → `.github/workflows/release.yml` publishes
  via npm Trusted Publishing (OIDC, `--provenance`). No `NPM_TOKEN`
  secret; the release workflow pins Node 24 because Node 22's
  bundled npm can't self-upgrade to the npm ≥ 11.5.1 required by
  Trusted Publishing.
- **Stack (as of v2.13.0):** Node 22 via `.nvmrc`, TypeScript 5.7,
  React 18.3 (dev), RN 0.76 (dev), Jest 29, ESLint 9 flat config,
  Prettier 3, `react-native-builder-bob` 0.32. Consumers stay on
  `react: *` / `react-native: *` peer deps.
- **Yarn Classic** (1.22) via corepack — the repo still ships a v1
  `yarn.lock` and `.yarnrc` bootstrap script. Don't migrate to Yarn
  Berry as part of unrelated work.

## What to read first

- `README.md` — install + prop tables (inherited from upstream).
- `docs/upstream-triage.md` — full snapshot of the upstream
  backlog, cluster analysis, and the v3 roadmap. **Re-triage before
  starting a new batch of fixes** — issue numbers drift.
- `docs/recipes.md` — answers to common usage questions.
- `src/index.tsx` — the full public API surface.

## Conventions

- **Commits:** conventional commits (`fix:`, `feat:`, `chore:`,
  `docs:`, `ci:`, `test:`, `style:`). Commitlint enforces this via
  `lefthook`'s `commit-msg` hook. Do **not** add a
  `Co-Authored-By: Claude …` trailer — Carlos's preference.
- **Branching:** one topic per branch, one PR per topic. Don't
  stack unrelated fixes in the same PR, even small ones — it makes
  the release notes and bisecting noisy.
- **Pull requests:** always pass `--repo carlos3g/element-dropdown`
  to `gh pr create` on this repo. Without it, `gh` defaults to the
  upstream parent and opens the PR on the wrong repo.
- **Tests:** live in `src/__tests__/*.test.{ts,tsx}` using
  `@testing-library/react-native`. A custom `jest.setup.js` patches
  `measureInWindow` on mocked RN host components so the Modal path
  actually renders in tests. New component behavior should come
  with a test.
- **Don't rewind the tooling.** The stack was deliberately brought
  current in v2.13.0. If something in the dev stack needs changing,
  move it forward, not back.

## Commands

```bash
yarn install            # requires yarn 1.22 (via corepack)
yarn lint               # eslint 9, flat config
yarn typecheck          # tsc --noEmit; excludes example/
yarn test               # jest 29
yarn prepack            # bob build — emits lib/commonjs/module/typescript
```

Lefthook runs `eslint` + `tsc --noEmit` on `pre-commit` and
`commitlint` on `commit-msg`. Hooks should not normally be
bypassed.

## Known deferred work

These are intentionally out of scope until someone can reproduce on
real devices:

- **Keyboard avoidance rework** (upstream #180, #357, #339, #288,
  #328) — the iOS and Android 0.76+ math is brittle.
- **Android 14+ `dropdownPosition="top"`** (upstream #355) —
  edge-to-edge default changes status bar semantics.
- **Realme OEM positioning quirk** (upstream #350).

Tracked in `docs/upstream-triage.md`. Don't attempt these without a
physical-device repro.
