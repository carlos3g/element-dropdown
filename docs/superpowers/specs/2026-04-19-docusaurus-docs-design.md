# Docusaurus documentation site

**Date:** 2026-04-19
**Status:** Design approved; pending written-spec review.

## Summary

Stand up a complete documentation site for `@carlos3g/element-dropdown`
using Docusaurus Classic (TypeScript), hosted at
`https://carlos3g.github.io/element-dropdown/`. The site replaces the
prop tables currently buried in `README.md` and absorbs
`docs/recipes.md` as per-topic guides, while the README remains a
self-contained install-and-pitch page.

## Goals

- Discoverable, searchable documentation for the three public
  components (`Dropdown`, `MultiSelect`, `SelectCountry`).
- A marketing-oriented landing page at `/` that mirrors the tone of
  the README's hero.
- A migration guide for developers moving from
  `react-native-element-dropdown@2.12.x`.
- Versioned docs starting at `v2.13.0`, so future API changes don't
  break links or mislead older users.
- Zero-touch publishing: every merge to `master` that touches
  `website/**` deploys.

## Non-goals

- Algolia DocSearch. Local client-side search ships now; Algolia is a
  separate follow-up if search quality proves insufficient.
- Interactive Expo Snack embeds. Static code blocks only.
- Custom theming, logo, or branding. Docusaurus default palette
  ships as-is.
- Internationalisation. English only.
- Migrating `docs/upstream-triage.md` into the public site. It stays
  as an internal roadmap at the repo root.

## Decisions (locked)

| # | Question | Decision |
|---|---|---|
| 1 | Root shape | Marketing landing at `/` + docs at `/docs/*` |
| 2 | Depth | Full (~12–15 pages) |
| 3 | Deploy | GitHub Pages default domain (`carlos3g.github.io/element-dropdown`) |
| 4 | Existing `docs/*.md` | Migrate `recipes.md`; keep `upstream-triage.md` |
| 5 | Search | Local (`@easyops-cn/docusaurus-search-local`) |
| 6 | Versioning | Yes, starting at `v2.13.0` |
| 7 | Code examples | Static code blocks only |
| 8 | Landing sections | Hero + Why-this-fork + What-you-get + Demos + Quick example + CTA |
| 9 | Theming | Docusaurus default |
| 10 | Layout | Isolated `website/` subfolder, npm-managed |

## Architecture

```
element-dropdown/
├── website/                          # Docusaurus site, isolated from the library
│   ├── docs/                         # "next" / unreleased version
│   │   ├── intro.md
│   │   ├── installation.md
│   │   ├── quick-start.md
│   │   ├── migration-from-upstream.md
│   │   ├── components/
│   │   │   ├── dropdown.md
│   │   │   ├── multi-select.md
│   │   │   └── select-country.md
│   │   ├── guides/                   # one page per recipe
│   │   │   ├── imperative-open-close.md
│   │   │   ├── custom-search-field.md
│   │   │   ├── custom-search-matcher.md
│   │   │   ├── disabled-items.md
│   │   │   ├── nested-in-modal.md
│   │   │   ├── multi-select-inside-mode.md
│   │   │   ├── empty-state.md
│   │   │   ├── on-change-text.md
│   │   │   ├── exclusion.md
│   │   │   ├── hit-slop.md
│   │   │   ├── font-scaling.md
│   │   │   ├── text-input-passthrough.md
│   │   │   └── icon-per-state.md
│   │   ├── accessibility.md
│   │   └── why-this-fork.md
│   ├── versioned_docs/version-2.13.0/
│   ├── versioned_sidebars/
│   ├── src/
│   │   ├── pages/index.tsx           # custom landing page
│   │   ├── components/
│   │   │   ├── Hero/
│   │   │   ├── WhyThisFork/
│   │   │   ├── WhatYouGet/
│   │   │   ├── Demos/
│   │   │   ├── QuickExample/
│   │   │   └── FinalCta/
│   │   └── css/custom.css
│   ├── static/img/                   # GIFs, og image
│   ├── docusaurus.config.ts
│   ├── sidebars.ts
│   ├── package.json
│   └── package-lock.json
├── docs/
│   └── upstream-triage.md             # stays; not published
├── .github/workflows/
│   └── docs.yml                       # new: build + deploy on master
└── …
```

- **Preset:** `@docusaurus/preset-classic` (TypeScript).
- **Search plugin:** `@easyops-cn/docusaurus-search-local` with
  `hashed: true`, `docsRouteBasePath: '/docs'`, `indexBlog: false`.
- **Node version:** 22 (matches release workflow and `.nvmrc`).
- **Package manager for the site:** npm. The library root keeps
  yarn 1; `website/` is isolated.
- **Lint / prettier:** add `website/` to `eslintIgnore` and
  `.prettierignore` at the root so library CI is untouched.

## Content model

### Sidebar (`sidebars.ts`)

```
Getting Started
├─ Introduction
├─ Installation
├─ Quick start
└─ Migration from upstream

Components
├─ Dropdown
├─ MultiSelect
└─ SelectCountry

Guides           (flat, order driven by sidebar_position front-matter)

Reference
├─ Accessibility
└─ Why this fork
```

### Page shapes

**Component page** (`components/*.md`):

1. One-paragraph description.
2. Minimal runnable snippet.
3. Props table grouped by category (Required, Styling, Behavior,
   Search, Accessibility, Callbacks). Each row: `name`, `type`,
   `default`, one-line description.
4. "Related guides" linking into the Guides section.

**Guide page** (`guides/*.md`):

1. Title phrased as the reader's question.
2. 1–2 paragraphs of context.
3. A complete, copy-paste code block.
4. (Optional) gotchas / notes.

### Versioning

After first build succeeds, run:

```
npm run docusaurus docs:version 2.13.0
```

That freezes `docs/` → `versioned_docs/version-2.13.0/` and
`versioned_sidebars/version-2.13.0-sidebars.json`. `docs/` remains the
"next" working copy. Navbar gets a version dropdown automatically.

## Homepage (`src/pages/index.tsx`)

Top-to-bottom:

1. **Hero** — headline (`react-native-element-dropdown, maintained.`),
   subhead (same copy as README), two CTAs:
   - Primary: `Get started` → `/docs/intro`
   - Secondary: `GitHub` → repo.
2. **Install + migration diff** — the 2-line diff block from the
   README, inline on the page.
3. **What you get** — three cards (Active maintenance · Drop-in
   migration · Signed releases). Icons from Docusaurus's built-in
   emoji fallbacks to keep it asset-free.
4. **Why this fork** — bullet list of the five symptom bullets from
   the README ("scrollToIndex out of range", stale-frame flicker,
   etc.). Below the list, a line: "Fixed — see
   [docs/upstream-triage.md](…) and the [release
   notes](…)".
5. **Demos** — the two GIFs currently in the README (dropdown +
   multi-select), side by side on desktop, stacked on mobile.
6. **Quick example** — a short code block showing a minimal working
   Dropdown. Links to Quick Start.
7. **Final CTA** — "Read the docs" → `/docs/intro`.

Footer: repo, npm, changelog, license.

## Deploy pipeline

`.github/workflows/docs.yml`:

```yaml
name: Docs
on:
  push:
    branches: [master]
    paths:
      - 'website/**'
      - '.github/workflows/docs.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
          cache-dependency-path: website/package-lock.json
      - run: npm ci
        working-directory: website
      - run: npm run build
        working-directory: website
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/build
      - id: deploy
        uses: actions/deploy-pages@v4
```

**Prerequisite (one-time, human):** Repo Settings → Pages → Source =
"GitHub Actions". First deploy fails with a clear message until this
is set.

## Content migration plan

| Source | Destination | Action |
|---|---|---|
| `docs/recipes.md` | `website/docs/guides/*.md` | Split into 13 files with front-matter; delete original |
| `README.md` prop tables | `website/docs/components/*.md` | Extract by component; remove from README |
| `README.md` hero/features | `website/src/pages/index.tsx` | Reuse copy; README stays self-contained |
| `README.md` "Recipes" link | — | Update to point at the deployed site |
| `docs/upstream-triage.md` | (stays) | No change; internal |

## Validation

- **Docusaurus build:** `cd website && npm run build` must pass.
  Docusaurus fails on broken internal links by default — that's the
  gate.
- **Docusaurus typecheck:** `npm run typecheck` in `website/` passes.
- **Library CI (`ci.yml`):** unchanged. Lint and tsc ignore
  `website/`.
- **Post-deploy smoke test (manual, first deploy only):**
  - Site opens at `carlos3g.github.io/element-dropdown/`
  - Search indexes "disabledField" and returns the Dropdown and
    MultiSelect pages
  - Version dropdown shows `2.13.0` + `Next`
  - Each of the 3 component pages renders its props table
  - Every guide is reachable from the sidebar

## Out of scope for this spec

- Algolia DocSearch submission (follow-up).
- Custom theming / logo / favicon beyond Docusaurus defaults.
- i18n.
- Snack-powered live examples.
- Publishing the triage / roadmap doc publicly.
- Preview deploys on PR branches. GitHub Pages only supports one
  live site per repo; if previews become valuable, move to Cloudflare
  Pages (which is the obvious alternative) and re-scope.

## Risks & follow-ups

- **Versioned-docs churn.** Each release that changes API or props
  means re-running `docs:version X.Y.Z` after the docs are updated.
  If upkeep becomes a burden, revisit the versioning decision.
- **Prop-table accuracy drift.** The tables are hand-maintained.
  Long-term, consider generating from TypeScript types via
  `react-docgen-typescript` during build. Out of scope now.
- **Search on first visit.** `docusaurus-search-local` ships the
  index in the bundle; first page load grows by ~100–200 KB. Likely
  fine given a ~15-page site, but measure after the first release.
