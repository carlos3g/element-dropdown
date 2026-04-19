#!/usr/bin/env node
/**
 * Generates `static/llms.txt` (manifest, per https://llmstxt.org) and
 * `static/llms-full.txt` (full concatenated docs) at build time. Both
 * files end up at the docs site root after Docusaurus copies `static/`
 * verbatim, so an LLM agent can fetch
 * https://carlos3g.github.io/element-dropdown/llms.txt for an index
 * and /llms-full.txt for the entire documentation in one request.
 *
 * Run from `website/`. Wired into `package.json` as `prebuild` and
 * `prestart`. Pure Node — no Docusaurus internals — to stay robust
 * across major Docusaurus upgrades.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(__dirname, '..');
const docsDir = path.join(websiteRoot, 'docs');
const staticDir = path.join(websiteRoot, 'static');
const siteUrl = 'https://carlos3g.github.io/element-dropdown';

/** @typedef {{ id: string; title: string; description: string; url: string; raw: string; section: string; sidebarPosition: number }} Doc */

/**
 * Recursively collect every md/mdx file under `docs/`. Skips
 * `versioned_docs/` — only the latest editable copy is indexed.
 */
function collectDocs(dir, section = '') {
  /** @type {Doc[]} */
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectDocs(full, entry.name));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    const raw = fs.readFileSync(full, 'utf8');
    const fm = parseFrontmatter(raw);
    const id = fm.id || path.basename(entry.name, path.extname(entry.name));
    const title = fm.title || id;
    const description = fm.description || extractFirstParagraph(stripFrontmatter(raw));
    const relUrl =
      section === ''
        ? `${siteUrl}/docs/${id}`
        : `${siteUrl}/docs/${section}/${id}`;
    out.push({
      id,
      title,
      description,
      url: relUrl,
      raw: stripFrontmatter(raw).trim(),
      section: section || 'root',
      sidebarPosition: Number(fm.sidebar_position ?? 999),
    });
  }
  return out;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    out[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
}

function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

function extractFirstParagraph(body) {
  const lines = body.split('\n');
  let buf = '';
  for (const line of lines) {
    if (/^#/.test(line)) continue;
    if (line.trim() === '') {
      if (buf) break;
      continue;
    }
    buf += (buf ? ' ' : '') + line.trim();
  }
  return buf.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 200);
}

const docs = collectDocs(docsDir);

const sections = {
  root: 'Getting Started',
  components: 'Components',
  guides: 'Guides',
};

const sectionDocs = Object.fromEntries(
  Object.keys(sections).map((s) => [
    s,
    docs
      .filter((d) => d.section === s)
      .sort((a, b) => a.sidebarPosition - b.sidebarPosition || a.title.localeCompare(b.title)),
  ])
);

// ---------------------------------------------------------------------------
// llms.txt — manifest per llmstxt.org
// ---------------------------------------------------------------------------

const llmsTxt = [
  '# @carlos3g/element-dropdown',
  '',
  '> Maintained React Native dropdown and multi-select. A drop-in fork of `react-native-element-dropdown` with long-standing bugs fixed, modernized tooling, and signed releases. Provides three components: `Dropdown` (single-select), `MultiSelect`, and `SelectCountry` (flag picker).',
  '',
  'The library is published as `@carlos3g/element-dropdown`. The public API matches `react-native-element-dropdown@2.12.x` so consumers can switch by changing the install name and import path.',
  '',
  '## Documentation',
  '',
  ...sectionDocs.root.map((d) => `- [${d.title}](${d.url}): ${d.description}`),
  '',
  '## Components',
  '',
  ...sectionDocs.components.map((d) => `- [${d.title}](${d.url}): ${d.description}`),
  '',
  '## Guides',
  '',
  ...sectionDocs.guides.map((d) => `- [${d.title}](${d.url}): ${d.description}`),
  '',
  '## Optional',
  '',
  `- [Full documentation in one file](${siteUrl}/llms-full.txt): every page concatenated for single-fetch consumption by LLM agents.`,
  `- [Source repository](https://github.com/carlos3g/element-dropdown): includes the upstream-triage roadmap and changelog.`,
  `- [npm package](https://www.npmjs.com/package/@carlos3g/element-dropdown): install metadata and version history.`,
  '',
].join('\n');

// ---------------------------------------------------------------------------
// llms-full.txt — every doc concatenated
// ---------------------------------------------------------------------------

const banner = [
  '# @carlos3g/element-dropdown — full documentation',
  '',
  `> Single-file dump of every documentation page on ${siteUrl}, in stable order.`,
  `> Generated at build time. For the manifest version see ${siteUrl}/llms.txt.`,
  '',
  '---',
  '',
];

const renderDoc = (d) =>
  [`# ${d.title}`, '', `Source: ${d.url}`, '', d.raw, '', '---', ''].join('\n');

const llmsFullTxt = [
  ...banner,
  ...sectionDocs.root.map(renderDoc),
  ...sectionDocs.components.map(renderDoc),
  ...sectionDocs.guides.map(renderDoc),
].join('\n');

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

fs.mkdirSync(staticDir, { recursive: true });
fs.writeFileSync(path.join(staticDir, 'llms.txt'), llmsTxt);
fs.writeFileSync(path.join(staticDir, 'llms-full.txt'), llmsFullTxt);

const indexed = docs.length;
const fullSize = (llmsFullTxt.length / 1024).toFixed(1);
console.log(
  `[llms-txt] indexed ${indexed} docs → static/llms.txt + static/llms-full.txt (${fullSize} KB)`
);
