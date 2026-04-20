/* eslint-disable @typescript-eslint/no-unused-vars, no-void */

/**
 * Compile-time guardrails for the public component generics.
 *
 * These tests have no runtime assertions — their purpose is to fail
 * `yarn typecheck` if the `<T>` generic parameter ever regresses to
 * `any` on the exported Dropdown / MultiSelect / SelectCountry
 * components. `Equals` is a strict type-equality helper (via
 * distributive conditional + function-identity trick) that does NOT
 * collapse under bivariance, which is how `any` leaks usually escape
 * — hence the stricter helper instead of a plain assignability probe.
 *
 * The `@typescript-eslint/no-unused-vars` and `no-void` rules are
 * relaxed at the top of the file because the assertions here are
 * intrinsically unused at runtime; they exist so the type checker
 * catches regressions. Callback parameters are referenced only via
 * `typeof`, which normal ESLint rules flag as unused.
 */

import React from 'react';
import { Dropdown, MultiSelect, SelectCountry } from '..';

type Item = { id: string; name: string };
type Country = { code: string; label: string; flag: string };

/** Strict type equality: does not collapse under `any`. */
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

describe('types / generic preservation', () => {
  it('Dropdown infers onChange item from data', () => {
    const items: Item[] = [{ id: 'a', name: 'Apple' }];

    const _probe = (
      <Dropdown
        data={items}
        labelField="name"
        valueField="id"
        onChange={(item) => {
          // If the generic is preserved, `item` is `Item`. If it
          // regresses to `any`, the equality check collapses and
          // TypeScript rejects the assignment below.
          const _ok: Equals<typeof item, Item> = true;
          void _ok;
        }}
      />
    );
    void _probe;
  });

  it('Dropdown constrains labelField/valueField to keyof T', () => {
    const items: Item[] = [{ id: 'a', name: 'Apple' }];

    const _good = (
      <Dropdown
        data={items}
        labelField="name"
        valueField="id"
        onChange={() => {}}
      />
    );
    void _good;

    const _bad = (
      <Dropdown
        data={items}
        // @ts-expect-error — 'doesNotExist' is not keyof Item.
        labelField="doesNotExist"
        valueField="id"
        onChange={() => {}}
      />
    );
    void _bad;
  });

  it('Dropdown infers renderItem item, selected, index from data', () => {
    const items: Item[] = [{ id: 'a', name: 'Apple' }];

    const _probe = (
      <Dropdown
        data={items}
        labelField="name"
        valueField="id"
        onChange={() => {}}
        renderItem={(item, selected, index) => {
          const _item: Equals<typeof item, Item> = true;
          const _selected: Equals<typeof selected, boolean | undefined> = true;
          const _index: Equals<typeof index, number | undefined> = true;
          void _item;
          void _selected;
          void _index;
          return null;
        }}
      />
    );
    void _probe;
  });

  it('MultiSelect infers renderItem and renderSelectedItem item from data', () => {
    const items: Item[] = [{ id: 'a', name: 'Apple' }];

    const _probe = (
      <MultiSelect
        data={items}
        labelField="name"
        valueField="id"
        value={[]}
        onChange={() => {}}
        renderItem={(item) => {
          const _ok: Equals<typeof item, Item> = true;
          void _ok;
          return null;
        }}
        renderSelectedItem={(item) => {
          const _ok: Equals<typeof item, Item> = true;
          void _ok;
          return null;
        }}
      />
    );
    void _probe;
  });

  it('SelectCountry infers onChange item from data', () => {
    const countries: Country[] = [
      { code: 'br', label: 'Brazil', flag: 'br.png' },
    ];

    const _probe = (
      <SelectCountry
        data={countries}
        labelField="label"
        valueField="code"
        imageField="flag"
        onChange={(item) => {
          const _ok: Equals<typeof item, Country> = true;
          void _ok;
        }}
      />
    );
    void _probe;
  });
});
