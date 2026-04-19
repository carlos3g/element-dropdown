# Contributing

Contributions are welcome — bug fixes, small features, doc edits,
and clean ports of upstream community PRs are all on the table.

Before you start, please read the [code of conduct](./CODE_OF_CONDUCT.md).
If you're not sure whether something fits the direction of the
fork, skim [`docs/upstream-triage.md`](./docs/upstream-triage.md) or
open a lightweight issue first.

## Project layout

```
element-dropdown/
├── src/               # library source (Dropdown, MultiSelect, SelectCountry)
├── example/           # Expo app you can run locally to exercise the lib
├── website/           # Docusaurus documentation site (npm-managed, isolated)
├── docs/              # internal-only: spec docs and upstream triage
├── .github/workflows/ # CI, release (npm OIDC), docs deploy, docs versioning
└── ...
```

Root is yarn 1.22 (classic). The docs site in `website/` is its
own npm workspace — don't mix the two.

## Development workflow

Install deps at the root (library):

```sh
yarn
```

Run the example app to test your changes — the library's JS is
aliased to the example so edits hot-reload:

```sh
yarn example start       # metro
yarn example ios
yarn example android
yarn example web
```

Before opening a PR, make sure all gates pass:

```sh
yarn lint
yarn typecheck
yarn test
yarn prepack             # bob build → lib/commonjs, lib/module, lib/typescript
```

To auto-fix lint / format issues:

```sh
yarn lint --fix
```

Pre-commit hooks (via lefthook) run `eslint` and `tsc --noEmit` on
staged files, plus `commitlint` on the commit message. They should
not normally be bypassed.

## Commit message convention

We follow the [Conventional Commits](https://www.conventionalcommits.org) spec:

- `fix:` bug fix
- `feat:` new feature
- `refactor:` code refactor with no behavioral change
- `docs:` documentation only
- `test:` adding or updating tests
- `chore:` tooling, dependencies, CI
- `style:` formatting changes (Prettier reformats)
- `ci:` CI / workflow changes

`commitlint` enforces this — non-conforming messages are rejected
by the `commit-msg` hook.

## Testing

Tests live in `src/__tests__/*.test.{ts,tsx}` and use
`@testing-library/react-native`. `jest.setup.js` patches
`measureInWindow` on mocked RN host components so the Modal path
actually renders in tests.

New behavior should come with a test. Bug fixes should come with a
regression test when realistic.

## Working on the docs site

The docs site lives in `website/` and is managed with its own
`npm` + `package-lock.json`. Install and run locally:

```sh
cd website
npm ci
npm run start            # http://localhost:3000
```

Build + typecheck:

```sh
npm run build
npm run typecheck
```

Docs are versioned. `website/docs/` is the "Next" / unreleased
copy. Snapshots live in `website/versioned_docs/version-X.Y.Z/`.
**You don't need to snapshot manually** — when a GitHub Release is
published, `.github/workflows/docs-version.yml` runs
`docusaurus docs:version X.Y.Z` automatically and commits the
snapshot back to `master`. The resulting push triggers `docs.yml`,
which redeploys the site.

## Publishing

Releases are fully automated from a GitHub Release:

1. Bump `version` in `package.json` (e.g., `2.13.0` → `2.14.0`).
2. Commit and push to `master` (example:
   `chore: release 2.14.0`).
3. `gh release create v2.14.0 --title "v2.14.0" --notes "..."` —
   or create the Release through the GitHub UI.

What happens automatically:

- `.github/workflows/release.yml` publishes to npm via Trusted
  Publishing (OIDC, `--access public --provenance`). No
  `NPM_TOKEN` secret involved.
- `.github/workflows/docs-version.yml` snapshots the docs at the
  new version and pushes back to `master`.
- `.github/workflows/docs.yml` redeploys the site to
  [carlos3g.github.io/element-dropdown](https://carlos3g.github.io/element-dropdown/).

Pre-releases (GitHub's "pre-release" checkbox) are skipped by the
docs-version workflow on purpose. npm publish still runs.

## Sending a pull request

- Prefer small, focused PRs — one concern per branch.
- Check [`docs/upstream-triage.md`](./docs/upstream-triage.md) to
  see if the issue or PR is already tracked; link to it in the
  description.
- If your change is a port of an upstream community PR, reference
  the upstream PR number.
- The public API must stay backward-compatible with
  `react-native-element-dropdown@2.12.x`. Drop-in migration is a
  core commitment — see
  [`docs/why-this-fork`](https://carlos3g.github.io/element-dropdown/docs/why-this-fork).
- For a change that affects props or behavior, update the
  component page in `website/docs/components/` in the same PR.
- The PR template will remind you of the gate checks. Fill it in.

## Triaging issues

- Apply `needs triage` + `bug` / `enhancement` labels for new
  reports.
- If the issue maps to an entry in the upstream triage doc, add
  the upstream reference to the issue body and cross-link.
- If the issue needs device-level reproduction (iOS version,
  Android OEM, etc.), label it `needs repro` and ask for a Snack
  or sample repo.
