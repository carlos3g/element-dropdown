import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '@carlos3g/element-dropdown',
  tagline:
    'Maintained React Native dropdown and multi-select — drop-in fork of react-native-element-dropdown.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://carlos3g.github.io',
  baseUrl: '/element-dropdown/',

  organizationName: 'carlos3g',
  projectName: 'element-dropdown',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://img.shields.io',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: '@carlos3g/element-dropdown',
        description:
          'Maintained React Native dropdown and multi-select — drop-in fork of react-native-element-dropdown with long-standing bugs fixed, modern tooling, and signed releases.',
        url: 'https://carlos3g.github.io/element-dropdown/',
        codeRepository: 'https://github.com/carlos3g/element-dropdown',
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'React Native',
        license: 'https://opensource.org/licenses/MIT',
        author: {
          '@type': 'Person',
          name: 'Carlos Mesquita',
          url: 'https://github.com/carlos3g',
        },
        keywords: [
          'react-native',
          'dropdown',
          'multiselect',
          'picker',
          'select',
          'combobox',
          'typescript',
          'expo',
        ],
      }),
    },
  ],

  presets: [
    [
      'classic',
      {
        // Only wire GA4 in production. In `docusaurus start`, the plugin's
        // route-change handler can call `window.gtag()` before the async
        // gtag.js script finishes loading, throwing "window.gtag is not a
        // function" on every internal navigation. Skipping it locally also
        // keeps your own dev clicks out of the analytics.
        gtag:
          process.env.NODE_ENV === 'production'
            ? {
                trackingID: 'G-VQLNCLZ4XC',
                anonymizeIP: true,
              }
            : undefined,
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/carlos3g/element-dropdown/tree/master/website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          lastVersion: '2.13.0',
          versions: {
            current: {
              label: 'Next 🚧',
              path: 'next',
              banner: 'unreleased',
            },
            '2.13.0': {
              label: '2.13.0',
              path: '',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: '/docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    [
      'plugin-image-zoom',
      {
        selector: '.markdown img, .demoGrid img, [class*="demoGrid"] img',
        background: {
          light: 'rgba(0, 0, 0, 0.6)',
          dark: 'rgba(0, 0, 0, 0.8)',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    metadata: [
      {
        name: 'description',
        content:
          'Maintained React Native dropdown and multi-select for iOS, Android, and Web. Drop-in fork of react-native-element-dropdown with long-standing bugs fixed.',
      },
      {
        name: 'keywords',
        content:
          'react native dropdown, react native multiselect, react native picker, react native select, react-native-element-dropdown, @carlos3g/element-dropdown, expo dropdown, react native combobox',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:title', content: 'React Native Dropdown & MultiSelect' },
      {
        name: 'twitter:description',
        content:
          'Drop-in fork of react-native-element-dropdown. Bugs get fixed, the toolchain stays current, and every release is signed.',
      },
      {
        name: 'google-site-verification',
        content: 'SbimU1L_z5TMYrHJLLKjHAffNU8Hg3JEENj_yUYtibk',
      },
    ],
    announcementBar: {
      id: 'v2_13_0',
      content:
        'Now on <strong>v2.13.0</strong> — modernized tooling, long-standing bugs fixed, and drop-in migration from <code>react-native-element-dropdown</code>. <a target="_blank" rel="noopener noreferrer" href="https://github.com/carlos3g/element-dropdown/releases/tag/v2.13.0">See what changed</a>.',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      isCloseable: true,
    },
    navbar: {
      title: '@carlos3g/element-dropdown',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'html',
          position: 'right',
          value:
            '<a href="https://www.npmjs.com/package/@carlos3g/element-dropdown" target="_blank" rel="noopener noreferrer" class="navbar-npm-badge" aria-label="npm package version"><img src="https://img.shields.io/npm/v/@carlos3g/element-dropdown?style=flat-square&labelColor=0f172a&color=cb0000&label=npm" alt="npm version" /></a>',
        },
        {
          href: 'https://github.com/carlos3g/element-dropdown',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Installation', to: '/docs/installation' },
            { label: 'Migration', to: '/docs/migration-from-upstream' },
          ],
        },
        {
          title: 'Components',
          items: [
            { label: 'Dropdown', to: '/docs/components/dropdown' },
            { label: 'MultiSelect', to: '/docs/components/multi-select' },
            {
              label: 'SelectCountry',
              to: '/docs/components/select-country',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/carlos3g/element-dropdown',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@carlos3g/element-dropdown',
            },
            {
              label: 'Releases',
              href: 'https://github.com/carlos3g/element-dropdown/releases',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Carlos Mesquita. Maintained fork of react-native-element-dropdown.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'diff', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
