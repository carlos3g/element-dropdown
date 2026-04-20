import React from 'react';
import { Text, TextInput } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { Dropdown } from '..';
import type { IDropdownRef } from '..';

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const setup = (props: Partial<React.ComponentProps<typeof Dropdown>> = {}) =>
  render(
    <Dropdown
      testID="dropdown"
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick a fruit"
      onChange={jest.fn()}
      {...props}
    />
  );

describe('Dropdown — rendering', () => {
  it('renders the placeholder when no value is provided', () => {
    setup();

    expect(screen.getByText('Pick a fruit')).toBeTruthy();
  });

  it('renders the selected label when a value is provided', () => {
    setup({ value: 'banana' });

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Pick a fruit')).toBeNull();
  });

  it('updates the selected label when the value prop changes after mount', () => {
    const { rerender } = setup({ value: 'apple' });
    expect(screen.getByText('Apple')).toBeTruthy();

    rerender(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        value="cherry"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Cherry')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('does not render the search input by default', () => {
    setup();

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.queryByTestId('dropdown input')).toBeNull();
  });

  it('renders the search input when search is true', () => {
    setup({ search: true, searchPlaceholder: 'Search…' });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByTestId('dropdown input')).toBeTruthy();
  });
});

describe('Dropdown — open/close', () => {
  it('opens the list when the trigger is pressed and shows each item', () => {
    setup();

    fireEvent.press(screen.getByTestId('dropdown'));

    for (const item of data) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });

  it('does not open when disable is true', () => {
    setup({ disable: true });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('fires onFocus on open and onBlur on close', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    setup({ onFocus, onBlur });

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Apple'));
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('exposes open() and close() through the imperative ref', () => {
    const ref = React.createRef<IDropdownRef>();
    render(
      <Dropdown
        ref={ref}
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        onChange={jest.fn()}
      />
    );

    expect(screen.queryByText('Apple')).toBeNull();

    act(() => {
      ref.current?.open();
    });
    expect(screen.getByText('Apple')).toBeTruthy();

    act(() => {
      ref.current?.close();
    });
    expect(screen.queryByText('Apple')).toBeNull();
  });
});

describe('Dropdown — selection', () => {
  it('calls onChange and closes the list when an item is pressed', () => {
    const onChange = jest.fn();
    setup({ onChange });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Cherry'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Cherry', value: 'cherry' })
    );
  });

  it('keeps the list open when closeModalWhenSelectedItem is false', () => {
    const onChange = jest.fn();
    setup({ onChange, closeModalWhenSelectedItem: false });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Cherry'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Apple')).toBeTruthy();
  });

  it('uses onConfirmSelectItem instead of onChange when confirmSelectItem is true', () => {
    const onChange = jest.fn();
    const onConfirmSelectItem = jest.fn();
    setup({
      onChange,
      confirmSelectItem: true,
      onConfirmSelectItem,
    });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Cherry'));

    expect(onChange).not.toHaveBeenCalled();
    expect(onConfirmSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'cherry' })
    );
  });
});

describe('Dropdown — renderEmpty', () => {
  it('renders the empty slot when data is empty and the list is open', () => {
    render(
      <Dropdown
        testID="dropdown"
        data={[]}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        onChange={jest.fn()}
        renderEmpty={() => <Text>No fruits yet</Text>}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByText('No fruits yet')).toBeTruthy();
  });

  it('passes the current search text to renderEmpty', () => {
    const renderEmpty = jest.fn((q: string) => <Text>{`(${q})`}</Text>);
    setup({ search: true, data: [], renderEmpty });

    fireEvent.press(screen.getByTestId('dropdown'));

    // Initial empty-data render: searchText is ''.
    expect(renderEmpty).toHaveBeenCalledWith('');
    expect(screen.getByText('()')).toBeTruthy();

    fireEvent.changeText(screen.getByTestId('dropdown input'), 'banana');

    // After typing, the callback is invoked with the new query so the
    // consumer can switch between "no data" and "no results" copy.
    expect(renderEmpty).toHaveBeenCalledWith('banana');
    expect(screen.getByText('(banana)')).toBeTruthy();
  });

  it('shows renderEmpty when search filters every row out', () => {
    setup({
      search: true,
      renderEmpty: (q) => <Text>{`No match for "${q}"`}</Text>,
    });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'zzz');

    expect(screen.getByText('No match for "zzz"')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
  });
});

describe('Dropdown — search', () => {
  it('filters items by label when searching', () => {
    setup({ search: true });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'ban');

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
  });

  it('uses searchField to match against a non-label field', () => {
    const users = [
      { name: 'Alice', email: 'alice@example.com', id: '1' },
      { name: 'Bob', email: 'bob@example.com', id: '2' },
    ];
    render(
      <Dropdown
        testID="dropdown"
        data={users}
        labelField="name"
        valueField="id"
        searchField="email"
        search
        onChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'bob@');

    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.queryByText('Alice')).toBeNull();
  });

  it('uses a custom searchQuery when provided', () => {
    const searchQuery = jest.fn((keyword: string, labelValue: string) =>
      labelValue.toLowerCase().startsWith(keyword.toLowerCase())
    );
    setup({ search: true, searchQuery });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'c');

    expect(searchQuery).toHaveBeenCalled();
    expect(screen.getByText('Cherry')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Banana')).toBeNull();
  });

  it('forwards onChangeText when the user types and fires it with an empty string on close', () => {
    const onChange = jest.fn();
    const onChangeText = jest.fn();
    setup({ onChange, search: true, onChangeText });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'ap');
    expect(onChangeText).toHaveBeenCalledWith('ap');

    fireEvent.press(screen.getByText('Apple'));
    expect(onChangeText).toHaveBeenLastCalledWith('');
  });

  it('swaps the default clear glyph via renderSearchClearIcon', () => {
    const renderSearchClearIcon = jest.fn(() => <Text>clear-me</Text>);
    setup({ search: true, renderSearchClearIcon });

    fireEvent.press(screen.getByTestId('dropdown'));
    // No text yet → clear icon is not rendered at all.
    expect(screen.queryByText('clear-me')).toBeNull();

    fireEvent.changeText(screen.getByTestId('dropdown input'), 'ap');

    // With text, the custom icon replaces the default image.
    expect(screen.getByText('clear-me')).toBeTruthy();
  });

  it('replaces the default search input when renderInputSearch is provided', () => {
    const renderInputSearch = jest.fn((onSearch: (t: string) => void) => (
      <TextInput
        testID="custom-search"
        onChangeText={onSearch}
        placeholder="Custom"
      />
    ));
    setup({ search: true, renderInputSearch });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(renderInputSearch).toHaveBeenCalled();
    expect(screen.queryByTestId('dropdown input')).toBeNull();

    const custom = screen.getByTestId('custom-search');
    fireEvent.changeText(custom, 'ban');

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
  });
});

describe('Dropdown — exclusions', () => {
  it('hides excludeItems from the rendered list', () => {
    setup({ excludeItems: [{ label: 'Banana', value: 'banana' }] });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.queryByText('Banana')).toBeNull();
    expect(screen.getByText('Cherry')).toBeTruthy();
  });

  it('keeps excludeSearchItems visible but removes them from search results', () => {
    setup({
      search: true,
      excludeSearchItems: [{ label: 'Banana', value: 'banana' }],
    });

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByText('Banana')).toBeTruthy();

    fireEvent.changeText(screen.getByTestId('dropdown input'), 'na');

    // "Banana" would match 'na' by default, but excludeSearchItems drops it.
    expect(screen.queryByText('Banana')).toBeNull();
  });
});

describe('Dropdown — custom rendering', () => {
  it('uses renderItem instead of the default label', () => {
    const renderItem = jest.fn((item: Item) => (
      <Text testID={`row-${item.value}`}>{'»' + item.label}</Text>
    ));
    setup({ renderItem });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(renderItem).toHaveBeenCalled();
    expect(screen.getByTestId('row-apple')).toBeTruthy();
    expect(screen.getByText('»Apple')).toBeTruthy();
  });

  it('passes the visible flag to renderLeftIcon and renderRightIcon', () => {
    const renderLeftIcon = jest.fn((visible?: boolean) => (
      <Text testID="left">{visible ? 'open' : 'closed'}</Text>
    ));
    const renderRightIcon = jest.fn((visible?: boolean) => (
      <Text testID="right">{visible ? 'open' : 'closed'}</Text>
    ));
    setup({ renderLeftIcon, renderRightIcon });

    // Closed state
    expect(screen.getByTestId('left').children[0]).toBe('closed');
    expect(screen.getByTestId('right').children[0]).toBe('closed');

    // Open state
    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByTestId('left').children[0]).toBe('open');
    expect(screen.getByTestId('right').children[0]).toBe('open');
  });
});

describe('Dropdown — accessibility', () => {
  it('announces itself as a combobox to assistive tech', () => {
    setup({ accessibilityLabel: 'Fruit selector' });

    const trigger = screen.getByLabelText('Fruit selector');
    expect(trigger.props.accessibilityRole).toBe('combobox');
    expect(trigger.props.accessibilityState).toEqual({
      expanded: false,
      disabled: false,
    });
  });

  it('reports accessibilityState.disabled when disable is true', () => {
    setup({ accessibilityLabel: 'Fruit', disable: true });

    const trigger = screen.getByLabelText('Fruit');
    expect(trigger.props.accessibilityState.disabled).toBe(true);
  });

  it('forwards accessibilityLabel to the search input and flatlist', () => {
    setup({ search: true, accessibilityLabel: 'Fruit' });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByLabelText('Fruit input')).toBeTruthy();
    expect(screen.getByLabelText('Fruit flatlist')).toBeTruthy();
  });
});

describe('Dropdown — disabledField', () => {
  it('skips onChange for items whose disabledField is truthy', () => {
    const onChange = jest.fn();
    const dataWithDisabled = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', locked: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    render(
      <Dropdown
        testID="dropdown"
        data={dataWithDisabled}
        labelField="label"
        valueField="value"
        disabledField="locked"
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Banana'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still selects items whose disabledField is falsy', () => {
    const onChange = jest.fn();
    const dataWithDisabled = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', locked: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    render(
      <Dropdown
        testID="dropdown"
        data={dataWithDisabled}
        labelField="label"
        valueField="value"
        disabledField="locked"
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Cherry'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'cherry' })
    );
  });
});

describe('Dropdown — style threading', () => {
  it('applies selectedTextStyle when a value is selected and placeholderStyle otherwise', () => {
    const { rerender } = render(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        placeholderStyle={{ color: 'silver' }}
        selectedTextStyle={{ color: 'purple' }}
        onChange={jest.fn()}
      />
    );

    const placeholder = screen.getByText('Pick a fruit');
    const placeholderStyle = Array.isArray(placeholder.props.style)
      ? Object.assign({}, ...placeholder.props.style.filter(Boolean))
      : placeholder.props.style;
    expect(placeholderStyle.color).toBe('silver');

    rerender(
      <Dropdown
        testID="dropdown"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        placeholderStyle={{ color: 'silver' }}
        selectedTextStyle={{ color: 'purple' }}
        value="apple"
        onChange={jest.fn()}
      />
    );

    const selected = screen.getByText('Apple');
    const selectedStyle = Array.isArray(selected.props.style)
      ? Object.assign({}, ...selected.props.style.filter(Boolean))
      : selected.props.style;
    expect(selectedStyle.color).toBe('purple');
  });

  it('passes hitSlop to the trigger', () => {
    const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };
    setup({ hitSlop });

    const trigger = screen.getByTestId('dropdown');
    expect(trigger.props.hitSlop).toEqual(hitSlop);
  });
});

describe('Dropdown — sections', () => {
  const sectioned = [
    {
      title: 'Berries',
      data: [
        { label: 'Strawberry', value: 'str' },
        { label: 'Blueberry', value: 'blu' },
      ],
    },
    {
      title: 'Citrus',
      data: [
        { label: 'Lemon', value: 'lem' },
        { label: 'Orange', value: 'ora' },
      ],
    },
  ];

  const setupSections = (
    props: Partial<React.ComponentProps<typeof Dropdown>> = {}
  ) =>
    render(
      <Dropdown
        testID="dropdown"
        sections={sectioned}
        labelField="label"
        valueField="value"
        placeholder="Pick a fruit"
        onChange={jest.fn()}
        {...props}
      />
    );

  it('renders section headers alongside the items when opened', () => {
    setupSections();

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByText('Berries')).toBeTruthy();
    expect(screen.getByText('Citrus')).toBeTruthy();
    expect(screen.getByText('Strawberry')).toBeTruthy();
    expect(screen.getByText('Orange')).toBeTruthy();
  });

  it('calls onChange with the picked item from a section', () => {
    const onChange = jest.fn();
    setupSections({ onChange });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.press(screen.getByText('Lemon'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'lem' })
    );
  });

  it('filters per-section during search and drops sections that go empty', () => {
    setupSections({ search: true });

    fireEvent.press(screen.getByTestId('dropdown'));

    const searchInput = screen.getByTestId('dropdown input');
    fireEvent(searchInput, 'onChangeText', 'lemon');

    expect(screen.getByText('Lemon')).toBeTruthy();
    expect(screen.queryByText('Strawberry')).toBeNull();
    expect(screen.queryByText('Berries')).toBeNull();
    expect(screen.getByText('Citrus')).toBeTruthy();
  });

  it('invokes a custom renderSectionHeader', () => {
    const renderSectionHeader = jest.fn(
      (section: { title: string }) =>
        (
          <Text testID={`sh-${section.title}`}>{`>> ${section.title}`}</Text>
        ) as any
    );
    setupSections({ renderSectionHeader });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByTestId('sh-Berries')).toBeTruthy();
    expect(screen.getByText('>> Citrus')).toBeTruthy();
    expect(renderSectionHeader).toHaveBeenCalledTimes(sectioned.length);
  });
});

describe('Dropdown — behaviour coverage', () => {
  it('persistSearch keeps the search text across close/reopen', () => {
    setup({ search: true, persistSearch: true });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'banana');
    // Close
    fireEvent.press(screen.getByTestId('dropdown'));
    // Reopen
    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByTestId('dropdown input').props.value).toBe('banana');
  });

  it('default behaviour clears the search text on close', () => {
    setup({ search: true });

    fireEvent.press(screen.getByTestId('dropdown'));
    fireEvent.changeText(screen.getByTestId('dropdown input'), 'banana');
    // Close
    fireEvent.press(screen.getByTestId('dropdown'));
    // Reopen
    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.getByTestId('dropdown input').props.value).toBe('');
  });

  it('hideSelectedFromList removes the currently selected row from the list', () => {
    setup({ value: 'banana', hideSelectedFromList: true });

    fireEvent.press(screen.getByTestId('dropdown'));

    // Banana is shown in the trigger but not in the list rows.
    expect(screen.getAllByText('Banana').length).toBe(1);
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Cherry')).toBeTruthy();
  });

  it('activeItemTextStyle is applied to the selected row only', () => {
    setup({
      value: 'banana',
      activeItemTextStyle: { fontWeight: '900', color: 'red' },
    });

    fireEvent.press(screen.getByTestId('dropdown'));

    const flattenStyle = (node: any) =>
      Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;

    // Multiple "Banana" occurrences: one in the trigger, one in the
    // list. The list entry is the last one rendered.
    const bananas = screen.getAllByText('Banana');
    const selectedInList = bananas[bananas.length - 1];
    const selectedStyle = flattenStyle(selectedInList);
    expect(selectedStyle.color).toBe('red');
    expect(selectedStyle.fontWeight).toBe('900');

    // A non-selected row does NOT pick up activeItemTextStyle. Cherry
    // sits after Banana in the list; Apple gets virtualized away
    // because autoScroll sets initialScrollIndex past it.
    const cherryStyle = flattenStyle(screen.getByText('Cherry'));
    expect(cherryStyle.color).not.toBe('red');
    expect(cherryStyle.fontWeight).not.toBe('900');
  });

  it('searchKeyboardType lands on the underlying TextInput', () => {
    setup({ search: true, searchKeyboardType: 'email-address' });
    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByTestId('dropdown input').props.keyboardType).toBe(
      'email-address'
    );
  });

  it('searchInputProps are spread onto the underlying TextInput', () => {
    setup({
      search: true,
      searchInputProps: {
        selectionColor: '#007AFF',
        returnKeyType: 'search',
        autoCapitalize: 'none',
      },
    });
    fireEvent.press(screen.getByTestId('dropdown'));
    const input = screen.getByTestId('dropdown input');
    expect(input.props.selectionColor).toBe('#007AFF');
    expect(input.props.returnKeyType).toBe('search');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('renderSelectedItem replaces the default trigger body', () => {
    setup({
      renderSelectedItem: () => <Text>CUSTOM TRIGGER BODY</Text>,
    });
    expect(screen.getByText('CUSTOM TRIGGER BODY')).toBeTruthy();
    // Placeholder is not rendered when renderSelectedItem takes over.
    expect(screen.queryByText('Pick a fruit')).toBeNull();
  });

  it('renderSelectedItem receives the current visible state', () => {
    const fn = jest.fn((visible: boolean | undefined) => (
      <Text>{visible ? 'OPEN' : 'CLOSED'}</Text>
    ));
    setup({ renderSelectedItem: fn });

    expect(screen.getByText('CLOSED')).toBeTruthy();

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByText('OPEN')).toBeTruthy();
  });

  it('renderModalHeader renders above the list and receives a close() callback', () => {
    const close = jest.fn();
    setup({
      renderModalHeader: (closeCb) => {
        close.mockImplementation(closeCb);
        return (
          <Text testID="modal-header" onPress={() => closeCb()}>
            HEADER
          </Text>
        );
      },
    });

    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByTestId('modal-header')).toBeTruthy();

    // Tapping the header fires close() which should dismiss the list.
    fireEvent.press(screen.getByTestId('modal-header'));
    expect(screen.queryByTestId('modal-header')).toBeNull();
  });

  it('onEndReached + onEndReachedThreshold are forwarded to the FlatList', () => {
    const onEndReached = jest.fn();
    setup({ onEndReached, onEndReachedThreshold: 0.25 });

    fireEvent.press(screen.getByTestId('dropdown'));
    const list = screen.getByTestId('dropdown flatlist');
    expect(list.props.onEndReached).toBe(onEndReached);
    expect(list.props.onEndReachedThreshold).toBe(0.25);
  });
});

describe('Dropdown — regressions', () => {
  it('does not mutate items passed in `data` (no magical `_index` property)', () => {
    // Previous bug: `_renderItem` called `_assign(item, { _index: index })`,
    // which silently mutated the consumer's data — frozen items would
    // throw, Redux slices would warn.
    const frozen = Object.freeze([
      Object.freeze({ label: 'Apple', value: 'apple' }),
      Object.freeze({ label: 'Banana', value: 'banana' }),
    ]);

    expect(() =>
      render(
        <Dropdown
          testID="dropdown"
          data={frozen as any}
          labelField="label"
          valueField="value"
          onChange={jest.fn()}
        />
      )
    ).not.toThrow();

    fireEvent.press(screen.getByTestId('dropdown'));

    for (const item of frozen) {
      expect(item).not.toHaveProperty('_index');
    }
  });
});

describe('Dropdown — a11y defaults', () => {
  it('marks the trigger accessible even without accessibilityLabel', () => {
    // Previously `accessible={!!accessibilityLabel}` meant that if the
    // consumer didn't pass `accessibilityLabel`, the trigger was
    // explicitly set to `accessible={false}` and screen readers
    // skipped it entirely.
    setup(); // no accessibilityLabel
    const trigger = screen.getByTestId('dropdown');
    // `accessible` is now unset → TouchableWithoutFeedback defaults to
    // true, which renders undefined (RN treats undefined == default).
    expect(trigger.props.accessible).not.toBe(false);
  });

  it('marks list items accessible even without accessibilityLabel', () => {
    setup(); // no accessibilityLabel
    fireEvent.press(screen.getByTestId('dropdown'));

    // Each row is a TouchableHighlight with its own accessibilityLabel
    // derived from the item's labelField. It should be accessible
    // regardless of whether the dropdown-level prop is set.
    const appleRow = screen.getByTestId('Apple');
    expect(appleRow.props.accessible).not.toBe(false);
    expect(appleRow.props.accessibilityLabel).toBe('Apple');
  });

  it('sets accessibilityRole="button" on list items', () => {
    setup();
    fireEvent.press(screen.getByTestId('dropdown'));
    expect(screen.getByTestId('Apple').props.accessibilityRole).toBe('button');
  });

  it('forwards accessibilityHint to the trigger', () => {
    setup({ accessibilityHint: 'Opens fruit picker' });
    expect(screen.getByTestId('dropdown').props.accessibilityHint).toBe(
      'Opens fruit picker'
    );
  });

  it('marks the open modal with accessibilityViewIsModal', () => {
    const { UNSAFE_getByProps } = setup();
    fireEvent.press(screen.getByTestId('dropdown'));
    // Scopes VoiceOver focus to the dropdown modal while open.
    expect(UNSAFE_getByProps({ accessibilityViewIsModal: true })).toBeTruthy();
  });
});

describe('Dropdown — modalAnimationType', () => {
  it('forwards modalAnimationType to the underlying Modal', () => {
    const { UNSAFE_getByType } = setup({ modalAnimationType: 'fade' });
    fireEvent.press(screen.getByTestId('dropdown'));

    const Modal = require('react-native').Modal;
    expect(UNSAFE_getByType(Modal).props.animationType).toBe('fade');
  });

  it('leaves animationType undefined by default (RN platform default)', () => {
    const { UNSAFE_getByType } = setup();
    fireEvent.press(screen.getByTestId('dropdown'));

    const Modal = require('react-native').Modal;
    expect(UNSAFE_getByType(Modal).props.animationType).toBeUndefined();
  });
});
