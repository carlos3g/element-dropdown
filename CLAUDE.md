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
   import path and nothing else. `src/__tests__/compatibility.test.tsx`
   is the machine-readable spec of that promise; if it fails, the
   fork has drifted.
2. **Triage community work.** Many upstream PRs are small, clean,
   and ready to merge. Port them here (see
   [`docs/upstream-triage.md`](docs/upstream-triage.md)).
3. **Add DX-level features** that users have been asking for
   (per-item disable, `hitSlop`, better a11y, etc.) without bloating
   the API or introducing native modules.
4. **Improve docs.** The docs site at
   [carlos3g.github.io/element-dropdown](https://carlos3g.github.io/element-dropdown/)
   is the primary user-facing surface now; the README is a short
   pitch + redirect.
5. **Keep tooling modern.** Don't let this project drift back into
   the state the upstream is in.

## Repo layout

Three independent project roots, each with its own lockfile:

- `./` — the library. Yarn 4 (Berry) via Corepack, `nodeLinker:
node-modules`. Publishes as `@carlos3g/element-dropdown`.
- `./example/` — Expo SDK 55 demo app with `expo-router` file-based
  routing. Its own Yarn 4 project (empty sentinel `yarn.lock` so
  it isn't treated as a workspace of the library root).
- `./website/` — Docusaurus 3 docs site, deployed to GitHub Pages.
  npm-managed (`package-lock.json`), not Yarn.

## Key repo facts

- **Default branch:** `master`.
- **Remotes:** `origin` → `carlos3g/element-dropdown` (this fork),
  `upstream` → `hoaphantn7604/react-native-element-dropdown`.
- **Release flow:** bump `package.json#version` on `master` →
  `gh release create vX.Y.Z` → three workflows fire automatically
  in parallel:
  - `release.yml` publishes to npm via Trusted Publishing (OIDC,
    `--provenance`, Node 24 because Node 22's bundled npm 10 can't
    self-upgrade to the 11.5.1 required by OIDC)
  - `docs-version.yml` snapshots the docs via
    `docusaurus docs:version X.Y.Z` and pushes back to `master`
  - the subsequent push fires `docs.yml`, which rebuilds and
    redeploys the site
- **Stack (as of v2.13.0):** Node 22 (`.nvmrc`), Yarn 4
  (`packageManager` field, Corepack), TypeScript 5.7, React 18.3
  (dev), RN 0.76 (dev), Jest 30, ESLint 9 flat config, Prettier 3,
  `react-native-builder-bob` 0.32, Reassure for perf regression
  tests. Consumers stay on `react: *` / `react-native: *` peer
  deps.

## What to read first

- [`README.md`](README.md) — short hero + link to docs site.
- [`docs/upstream-triage.md`](docs/upstream-triage.md) — full
  snapshot of the upstream backlog, cluster analysis, and the v3
  roadmap. **Re-triage before starting a new batch of fixes** —
  issue numbers drift.
- [Docs site](https://carlos3g.github.io/element-dropdown/) — the
  user-facing documentation (recipes, API reference, migration
  guide). Source in [`website/`](website).
- [`src/index.tsx`](src/index.tsx) — the full public API surface.
- [`src/__tests__/compatibility.test.tsx`](src/__tests__/compatibility.test.tsx)
  — the drop-in promise encoded as a test; read it before
  touching the public surface.

## Conventions

- **Commits:** conventional commits (`fix:`, `feat:`, `chore:`,
  `docs:`, `ci:`, `test:`, `style:`). Commitlint enforces this via
  `lefthook`'s `commit-msg` hook. Do **not** add a
  `Co-Authored-By: Claude …` trailer — Carlos's preference.
- **Branching:** one topic per branch, one PR per topic. Don't
  stack unrelated fixes in the same PR, even small ones — it makes
  release notes and bisecting noisy.
- **Pull requests:** always pass `--repo carlos3g/element-dropdown`
  to `gh pr create` on this repo. Without it, `gh` defaults to the
  upstream parent and opens the PR on the wrong repo.
- **Tests:**
  - Unit/integration tests live in `src/__tests__/*.test.{ts,tsx}`
    using `@testing-library/react-native`. A custom `jest.setup.js`
    patches `measureInWindow` on mocked RN host components so the
    Modal path actually renders in tests. New component behavior
    should come with a test.
  - Perf tests live in `src/__perf__/*.perf-test.tsx` using
    Reassure. Excluded from `yarn test`; run with `yarn reassure`.
    `.github/workflows/perf.yml` runs baseline vs current on every
    PR and posts the diff as a comment via Danger.
  - `compatibility.test.tsx` is a guardrail over the upstream drop-in
    promise. If it breaks, either restore parity or bump the major
    version and document the break in
    [`website/docs/migration-from-upstream.mdx`](website/docs/migration-from-upstream.mdx).
- **Don't rewind the tooling.** The stack was deliberately brought
  current in v2.13.0 and expanded since (Yarn 4, Expo 55 example,
  Reassure). If something needs changing, move it forward, not
  back.

## Commands

```bash
yarn install            # Yarn 4 via Corepack (packageManager field)
yarn lint               # eslint 9, flat config
yarn typecheck          # tsc --noEmit; excludes example/ and website/
yarn test               # jest 30; unit + compat tests only
yarn reassure           # perf tests via Reassure
yarn prepack            # bob build — emits lib/commonjs/module/typescript
yarn example start      # run the Expo demo app (Metro)
```

Inside `website/` use npm (`npm run start`, `npm run build`).

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
- **`react-native-builder-bob` 0.40+** — reshapes the
  `main`/`module`/`exports` entries in a consumer-facing way; needs
  a migration-aware PR rather than a routine bump.

Tracked in `docs/upstream-triage.md`. Don't attempt these without a
physical-device repro.
