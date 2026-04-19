// Smoke test over the public API surface.
// Consumers rely on these imports existing; catch accidental removals here.

import * as lib from '..';
import type {
  DropdownProps,
  IDropdownRef,
  ISelectCountryRef,
  IMultiSelectRef,
  MultiSelectProps,
  SelectCountryProps,
} from '..';

describe('public exports', () => {
  it('exposes the three component values', () => {
    expect(typeof lib.Dropdown).toBe('object');
    expect(typeof lib.MultiSelect).toBe('object');
    expect(typeof lib.SelectCountry).toBe('object');
  });

  it('exports the ref and props types (compile-time check)', () => {
    // These assignments compile only if the types are exported. A plain
    // runtime assertion keeps the test from being dead weight.
    type Shape = {
      dropdownRef: IDropdownRef;
      multiSelectRef: IMultiSelectRef;
      selectCountryRef: ISelectCountryRef;
      dropdownProps: DropdownProps<{ id: string; label: string }>;
      multiSelectProps: MultiSelectProps<{ id: string; label: string }>;
      selectCountryProps: SelectCountryProps<{
        id: string;
        label: string;
        image: string;
      }>;
    };
    const placeholder = null as unknown as Shape;
    expect(placeholder).toBeNull();
  });

  it('does not leak internal modules from the package root', () => {
    const allowed = new Set(['Dropdown', 'MultiSelect', 'SelectCountry']);
    const actual = Object.keys(lib).filter((k) => !k.startsWith('_'));
    for (const key of actual) {
      expect(allowed.has(key)).toBe(true);
    }
  });
});
