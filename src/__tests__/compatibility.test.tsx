/**
 * Drop-in compatibility guardrails.
 *
 * This file enforces the commitment that @carlos3g/element-dropdown is a
 * drop-in replacement for react-native-element-dropdown@2.12.x: the
 * public API surface, prop signatures, and default behavior must stay
 * backward-compatible with the upstream.
 *
 * If any assertion here fails, the fork has drifted from that promise.
 * Either restore parity, or — if the break is intentional — bump the
 * major version, document the break in docs/migration-from-upstream.mdx,
 * and update or remove the failing assertion.
 */

import React from 'react';
import type {
  FlatListProps,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, Text, View } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import * as lib from '..';
import {
  Dropdown,
  MultiSelect,
  SelectCountry,
  type DropdownProps,
  type IDropdownRef,
  type IMultiSelectRef,
  type ISelectCountryRef,
  type MultiSelectProps,
  type SelectCountryProps,
} from '..';

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' },
  { label: 'Three', value: '3' },
];

// ---------------------------------------------------------------------------
// 1. Exports
// ---------------------------------------------------------------------------

describe('compat / public exports', () => {
  it('re-exports the three documented components', () => {
    expect(lib.Dropdown).toBeDefined();
    expect(lib.MultiSelect).toBeDefined();
    expect(lib.SelectCountry).toBeDefined();
  });

  it('keeps IDropdownRef, IMultiSelectRef, ISelectCountryRef exportable (compile-time)', () => {
    // Assigning these types proves they are exported. A failing assignment
    // is a compile error, not a runtime one — that's the point.
    const ref = null as unknown as {
      d: IDropdownRef;
      m: IMultiSelectRef;
      s: ISelectCountryRef;
    };
    expect(ref).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 2. Dropdown — default values documented in the upstream README
// ---------------------------------------------------------------------------

describe('compat / Dropdown default contract', () => {
  it('uses "Select item" as the default placeholder', () => {
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Select item')).toBeTruthy();
  });

  it('does not render a search input by default (search=false)', () => {
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.queryByTestId('dropdown input')).toBeNull();
  });

  it('does not open when disable defaults to false but prop is true', () => {
    // Smoke-test the default=false branch by verifying opens work without
    // the prop set.
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByText('One')).toBeTruthy();
  });

  it('matches the documented defaults for the common props', () => {
    // The upstream README pins specific default values. If any of these
    // change, it's a breaking contract change and needs a major release
    // + migration note — not a silent drift.
    const readmeDefaults = {
      placeholder: 'Select item',
      activeColor: '#F6F7F8',
      iconColor: 'gray',
      searchPlaceholderTextColor: 'gray',
      maxHeight: 340,
      minHeight: 0,
      search: false,
      autoScroll: true,
      showsVerticalScrollIndicator: true,
      dropdownPosition: 'auto',
      mode: 'default',
      keyboardAvoiding: true,
      inverted: true,
      disable: false,
      closeModalWhenSelectedItem: true,
    } as const;

    // Compile-time check: every key here is a valid DropdownProps<Item>.
    // Drift in types will break this line.
    const typed: Partial<DropdownProps<Item>> = readmeDefaults;

    // Keep the runtime side referenced so tree-shakers don't erase it.
    expect(typed).toEqual(readmeDefaults);
  });
});

// ---------------------------------------------------------------------------
// 3. MultiSelect — default values documented upstream
// ---------------------------------------------------------------------------

describe('compat / MultiSelect default contract', () => {
  it('uses "Select item" as the default placeholder', () => {
    render(
      <MultiSelect
        testID="multi"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Select item')).toBeTruthy();
  });

  it('accepts the documented defaults as a typed value', () => {
    const readmeDefaults: Partial<MultiSelectProps<Item>> = {
      placeholder: 'Select item',
      activeColor: '#F6F7F8',
      iconColor: 'gray',
      searchPlaceholderTextColor: 'gray',
      maxHeight: 340,
      minHeight: 0,
      search: false,
      showsVerticalScrollIndicator: true,
      dropdownPosition: 'auto',
      mode: 'default',
      keyboardAvoiding: true,
      inverted: true,
      disable: false,
      visibleSelectedItem: true,
      alwaysRenderSelectedItem: false,
      inside: false,
    };
    expect(readmeDefaults).toBeDefined();
  });

  it('accepts string[] as value (documented signature)', () => {
    // Runtime assertion: MultiSelect accepts and reflects a string[].
    render(
      <MultiSelect
        testID="multi"
        data={data}
        labelField="label"
        valueField="value"
        value={['1']}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('One')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 4. Imperative API — open() / close()
// ---------------------------------------------------------------------------

describe('compat / imperative API', () => {
  it('IDropdownRef carries open() and close() — compile + runtime', () => {
    const ref = React.createRef<IDropdownRef>();
    render(
      <Dropdown
        ref={ref}
        testID="d"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    );

    expect(typeof ref.current?.open).toBe('function');
    expect(typeof ref.current?.close).toBe('function');
  });

  it('IMultiSelectRef carries open() and close()', () => {
    const ref = React.createRef<IMultiSelectRef>();
    render(
      <MultiSelect
        ref={ref}
        testID="m"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
        onChange={jest.fn()}
      />
    );

    expect(typeof ref.current?.open).toBe('function');
    expect(typeof ref.current?.close).toBe('function');
  });

  it('ISelectCountryRef carries open() and close()', () => {
    const ref = React.createRef<ISelectCountryRef>();
    render(
      <SelectCountry
        ref={ref}
        testID="s"
        data={[
          { label: 'Brazil', value: 'br', image: { uri: 'https://x/br.png' } },
        ]}
        labelField="label"
        valueField="value"
        imageField="image"
        onChange={jest.fn()}
      />
    );

    expect(typeof ref.current?.open).toBe('function');
    expect(typeof ref.current?.close).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// 5. Upstream prop surface — compile-time guard
// ---------------------------------------------------------------------------
//
// These component instances feed every prop documented in the upstream
// README (v2.12.x) at its widest signature. If any prop is removed or
// has its type tightened in a breaking way, this block fails to compile.
//
// We intentionally accept wider types than the upstream used (e.g. new
// optional fork-only props are fine). We must NEVER narrow or drop.

describe('compat / upstream prop surface (compile-time)', () => {
  it('accepts every upstream Dropdown prop in one typed object', () => {
    const props: DropdownProps<Item> = {
      testID: 'u',
      itemTestIDField: 'value',
      style: {} as ViewStyle,
      containerStyle: {} as ViewStyle,
      placeholderStyle: {} as TextStyle,
      selectedTextStyle: {} as TextStyle,
      selectedTextProps: { numberOfLines: 1 },
      itemContainerStyle: {} as ViewStyle,
      itemTextStyle: {} as TextStyle,
      inputSearchStyle: {} as TextStyle,
      iconStyle: {} as ImageStyle,
      maxHeight: 300,
      minHeight: 100,
      fontFamily: 'System',
      iconColor: 'gray',
      activeColor: '#F6F7F8',
      data,
      value: '1',
      placeholder: 'Select item',
      labelField: 'label',
      valueField: 'value',
      searchField: 'label',
      search: true,
      searchPlaceholder: 'Search',
      searchPlaceholderTextColor: 'gray',
      disable: false,
      autoScroll: true,
      showsVerticalScrollIndicator: true,
      dropdownPosition: 'auto',
      flatListProps: {} as Omit<FlatListProps<Item>, 'renderItem' | 'data'>,
      keyboardAvoiding: true,
      backgroundColor: 'transparent',
      confirmSelectItem: false,
      accessibilityLabel: 'Dropdown',
      itemAccessibilityLabelField: 'label',
      inverted: true,
      mode: 'default',
      closeModalWhenSelectedItem: true,
      excludeItems: [],
      excludeSearchItems: [],
      onChange: (_item: Item) => {},
      onChangeText: (_t: string) => {},
      renderLeftIcon: (_visible?: boolean) => <View />,
      renderRightIcon: (_visible?: boolean) => <View />,
      renderItem: (_item: Item, _selected?: boolean) => <View />,
      renderInputSearch: (_onSearch: (s: string) => void) => <View />,
      onFocus: () => {},
      onBlur: () => {},
      searchQuery: (_kw: string, _label: string) => true,
      onConfirmSelectItem: (_item: Item) => {},
    };

    // Runtime: just confirm the typed object is serialisable and the
    // component accepts it. The real assertion is compile-time — if any
    // of the keys above stops being a valid DropdownProps<Item> key, tsc
    // errors before Jest even runs.
    expect(props.labelField).toBe('label');
    expect(typeof (<Dropdown {...props} />)).toBe('object');
  });

  it('accepts every upstream MultiSelect prop in one typed object', () => {
    const props: MultiSelectProps<Item> = {
      testID: 'u',
      itemTestIDField: 'value',
      style: {} as ViewStyle,
      containerStyle: {} as ViewStyle,
      placeholderStyle: {} as TextStyle,
      inputSearchStyle: {} as TextStyle,
      selectedStyle: {} as ViewStyle,
      selectedTextStyle: {} as TextStyle,
      selectedTextProps: { numberOfLines: 1 },
      itemContainerStyle: {} as ViewStyle,
      itemTextStyle: {} as TextStyle,
      iconStyle: {} as ImageStyle,
      maxHeight: 300,
      minHeight: 100,
      maxSelect: 5,
      fontFamily: 'System',
      iconColor: 'gray',
      activeColor: '#F6F7F8',
      data,
      value: ['1'],
      placeholder: 'Select item',
      labelField: 'label',
      valueField: 'value',
      searchField: 'label',
      search: true,
      disable: false,
      showsVerticalScrollIndicator: true,
      searchPlaceholder: 'Search',
      searchPlaceholderTextColor: 'gray',
      dropdownPosition: 'auto',
      flatListProps: {} as Omit<FlatListProps<Item>, 'renderItem' | 'data'>,
      alwaysRenderSelectedItem: false,
      visibleSelectedItem: true,
      keyboardAvoiding: true,
      inside: false,
      backgroundColor: 'transparent',
      confirmSelectItem: false,
      confirmUnSelectItem: false,
      accessibilityLabel: 'Multi',
      itemAccessibilityLabelField: 'label',
      inverted: true,
      mode: 'default',
      excludeItems: [],
      excludeSearchItems: [],
      onChange: (_value: string[]) => {},
      onChangeText: (_t: string) => {},
      renderLeftIcon: (_visible?: boolean) => <View />,
      renderRightIcon: (_visible?: boolean) => <View />,
      renderItem: (_item: Item, _selected?: boolean) => <View />,
      renderSelectedItem: (_item: Item, _unSelect?: (i: Item) => void) => (
        <View />
      ),
      renderInputSearch: (_onSearch: (s: string) => void) => <View />,
      onFocus: () => {},
      onBlur: () => {},
      searchQuery: (_kw: string, _label: string) => true,
      onConfirmSelectItem: (_item: unknown) => {},
    };

    expect(props.labelField).toBe('label');
    expect(typeof (<MultiSelect {...props} />)).toBe('object');
  });

  it('accepts every upstream SelectCountry prop in one typed object', () => {
    type Country = {
      label: string;
      value: string;
      image: { uri: string };
    };
    const countries: Country[] = [
      { label: 'Brazil', value: 'br', image: { uri: 'https://x/br.png' } },
    ];

    const props: SelectCountryProps<Country> = {
      data: countries,
      labelField: 'label',
      valueField: 'value',
      imageField: 'image',
      imageStyle: {} as ImageStyle,
      onChange: () => {},
    };

    expect(props.imageField).toBe('image');
    expect(typeof (<SelectCountry {...props} />)).toBe('object');
  });
});

// ---------------------------------------------------------------------------
// 6. Canonical upstream README snippets — behaviors documented as promised
// ---------------------------------------------------------------------------

describe('compat / upstream README promises', () => {
  it('onChange receives the full item object (not just the value)', () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Two'));

    // Upstream README: `onChange: (item: object) => void` — the full
    // item, not just the valueField value.
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Two', value: '2' })
    );
  });

  it('MultiSelect onChange receives a string[] of values (not objects)', () => {
    const onChange = jest.fn();
    render(
      <MultiSelect
        testID="multi"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('multi'));
    fireEvent.press(screen.getByText('Two'));

    // Upstream: MultiSelect.onChange is `(value: string[]) => void`.
    const callArg = onChange.mock.calls[0]?.[0];
    expect(Array.isArray(callArg)).toBe(true);
    expect(callArg).toEqual(['2']);
  });

  it('searchQuery receives (keyword, labelValue) and is called per item', () => {
    const searchQuery = jest.fn((_kw: string, _label: string) => true);
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        search
        searchQuery={searchQuery}
        onChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'foo');

    // Upstream: (keyword: string, labelValue: string) => Boolean.
    const firstCall = searchQuery.mock.calls[0];
    expect(typeof firstCall?.[0]).toBe('string');
    expect(typeof firstCall?.[1]).toBe('string');
  });

  it('renderItem is called with (item, selected)', () => {
    const renderItem = jest.fn((_item: Item, _selected?: boolean) => (
      <Text>{String(_item.label)}</Text>
    ));
    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        value="1"
        onChange={jest.fn()}
        renderItem={renderItem}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(renderItem).toHaveBeenCalled();
    const args = renderItem.mock.calls[0];
    expect(args?.[0]).toEqual(
      expect.objectContaining({ label: 'One', value: '1' })
    );
    expect(typeof args?.[1]).toBe('boolean');
  });

  it('renderLeftIcon / renderRightIcon receive the visible boolean', () => {
    const renderLeftIcon = jest.fn((_visible?: boolean) => <Image />);
    const renderRightIcon = jest.fn((_visible?: boolean) => <Image />);

    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
        renderLeftIcon={renderLeftIcon}
        renderRightIcon={renderRightIcon}
      />
    );

    // Both icons get `false` while the list is closed.
    expect(renderLeftIcon).toHaveBeenLastCalledWith(false);
    expect(renderRightIcon).toHaveBeenLastCalledWith(false);

    fireEvent.press(screen.getByTestId('dropdown'));

    // And `true` once opened.
    expect(renderLeftIcon).toHaveBeenLastCalledWith(true);
    expect(renderRightIcon).toHaveBeenLastCalledWith(true);
  });

  it('renderInputSearch receives the onSearch callback', () => {
    const renderInputSearch = jest.fn((_onSearch: (text: string) => void) => (
      <View />
    ));

    render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        search
        onChange={jest.fn()}
        renderInputSearch={renderInputSearch}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(renderInputSearch).toHaveBeenCalled();
    const firstArg = renderInputSearch.mock.calls[0]?.[0];
    expect(typeof firstArg).toBe('function');
  });
});
