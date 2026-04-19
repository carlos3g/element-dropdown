import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

function Hero() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          <code>react-native-element-dropdown</code>, maintained.
        </Heading>
        <p className={styles.heroSubtitle}>
          A drop-in fork of{' '}
          <code>react-native-element-dropdown</code>. Bugs get fixed, the
          toolchain stays current, and every release is signed. Change two
          lines and keep shipping.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Get started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/carlos3g/element-dropdown"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function InstallAndMigrate() {
  return (
    <section className={styles.installSection}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h3">Install</Heading>
            <CodeBlock language="bash">
              {`npm install @carlos3g/element-dropdown`}
            </CodeBlock>
          </div>
          <div className="col col--6">
            <Heading as="h3">Migrate in two lines</Heading>
            <CodeBlock language="diff">
              {`- import { Dropdown } from 'react-native-element-dropdown';
+ import { Dropdown } from '@carlos3g/element-dropdown';`}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

type Benefit = {
  title: string;
  body: ReactNode;
};

const benefits: Benefit[] = [
  {
    title: 'Active maintenance',
    body: (
      <>
        Upstream bugs get triaged and fixed in every release. The roadmap
        is public and the changelog is honest.
      </>
    ),
  },
  {
    title: 'Drop-in migration',
    body: (
      <>
        Public API unchanged from <code>react-native-element-dropdown@2.12.x</code>.
        No native rebuild, no config changes, no peer-dep drift.
      </>
    ),
  },
  {
    title: 'Signed releases',
    body: (
      <>
        Every version is published via npm Trusted Publishing with
        provenance attestation. Anyone can verify the tarball came from
        this repository's CI.
      </>
    ),
  },
];

function WhatYouGet() {
  return (
    <section className={styles.benefits}>
      <div className="container">
        <Heading as="h2">What you get</Heading>
        <div className="row">
          {benefits.map((b) => (
            <div key={b.title} className="col col--4">
              <div className={styles.card}>
                <Heading as="h3">{b.title}</Heading>
                <p>{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyThisFork() {
  return (
    <section className={styles.why}>
      <div className="container">
        <Heading as="h2">Why this fork</Heading>
        <p>
          The original package is unmaintained — a large open-issue backlog,
          plus clean community pull requests sitting untouched for years.
          If you're already on <code>react-native-element-dropdown</code>,
          you've likely hit one of these:
        </p>
        <ul className={styles.painList}>
          <li>
            <code>Invariant Violation: scrollToIndex out of range</code>{' '}
            when searching long lists
          </li>
          <li>
            The list flashes at the wrong position for a frame when you
            reopen it
          </li>
          <li>
            <code>IDropdownRef</code> / <code>IMultiSelectRef</code> aren't
            importable when you build for web or Expo
          </li>
          <li>
            Every item has a non-overridable <code>padding: 17</code> —{' '}
            <code>itemContainerStyle</code> can't shrink it
          </li>
          <li>
            <code>MultiSelect</code> trigger uses{' '}
            <code>placeholderStyle</code> even after you've selected
            something
          </li>
        </ul>
        <p>
          Fixed — along with plenty more. See the{' '}
          <Link to="/docs/why-this-fork">full context</Link> and the{' '}
          <Link to="https://github.com/carlos3g/element-dropdown/releases">
            release notes
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Demos() {
  return (
    <section className={styles.demos}>
      <div className="container">
        <Heading as="h2">Demo</Heading>
        <div className={styles.demoGrid}>
          <img
            alt="React Native Dropdown component demo — single-select with search"
            loading="lazy"
            decoding="async"
            src="https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-drpdown.gif?raw=true"
          />
          <img
            alt="React Native MultiSelect component demo — multi-select with chip row"
            loading="lazy"
            decoding="async"
            src="https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-multiselect.gif?raw=true"
          />
        </div>
      </div>
    </section>
  );
}

function QuickExample() {
  const code = `import { useState } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

export function FruitPicker() {
  const [value, setValue] = useState(null);
  return (
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick a fruit"
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}`;

  return (
    <section className={styles.quick}>
      <div className="container">
        <Heading as="h2">Quick example</Heading>
        <CodeBlock language="tsx">{code}</CodeBlock>
        <p>
          Need more?{' '}
          <Link to="/docs/quick-start">Head to Quick start</Link>.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <div className="container">
        <Heading as="h2">Ready to drop it in?</Heading>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the docs
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/migration-from-upstream"
          >
            Migration guide
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="React Native Dropdown & MultiSelect"
      description="Maintained React Native dropdown and multi-select for iOS, Android, and Web. Drop-in fork of react-native-element-dropdown with long-standing bugs fixed, modern tooling, and signed releases."
    >
      <Hero />
      <main>
        <InstallAndMigrate />
        <WhatYouGet />
        <WhyThisFork />
        <Demos />
        <QuickExample />
        <FinalCta />
      </main>
    </Layout>
  );
}
