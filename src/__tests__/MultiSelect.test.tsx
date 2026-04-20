import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { MultiSelect } from '..';
import type { IMultiSelectRef } from '..';

type Item = { label: string; value: string };

const data: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const setup = (props: Partial<React.ComponentProps<typeof MultiSelect>> = {}) =>
  render(
    <MultiSelect
      testID="multiselect"
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick fruits"
      onChange={jest.fn()}
      {...props}
    />
  );

describe('MultiSelect — rendering', () => {
  it('renders the placeholder when nothing is selected', () => {
    setup();

    expect(screen.getByText('Pick fruits')).toBeTruthy();
  });

  it('applies selectedTextStyle to the trigger label when items are selected', () => {
    const { rerender } = setup({
      value: [],
      placeholderStyle: { color: 'silver' },
      selectedTextStyle: { color: 'purple' },
    });

    const initial = screen.getByText('Pick fruits');
    const initialStyle = Array.isArray(initial.props.style)
      ? Object.assign({}, ...initial.props.style.filter(Boolean))
      : initial.props.style;
    expect(initialStyle.color).toBe('silver');

    rerender(
      <MultiSelect
        testID="multiselect"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        placeholderStyle={{ color: 'silver' }}
        selectedTextStyle={{ color: 'purple' }}
        value={['apple']}
        onChange={jest.fn()}
      />
    );

    const afterSelect = screen.getByText('Pick fruits');
    const afterStyle = Array.isArray(afterSelect.props.style)
      ? Object.assign({}, ...afterSelect.props.style.filter(Boolean))
      : afterSelect.props.style;
    expect(afterStyle.color).toBe('purple');
  });
});

describe('MultiSelect — open/close', () => {
  it('opens the list when the trigger is pressed', () => {
    setup();

    fireEvent.press(screen.getByTestId('multiselect'));

    for (const item of data) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });

  it('fires onFocus on open and onBlur on close', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const ref = React.createRef<IMultiSelectRef>();

    render(
      <MultiSelect
        ref={ref}
        testID="multiselect"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={jest.fn()}
      />
    );

    act(() => {
      ref.current?.open();
    });
    expect(onFocus).toHaveBeenCalledTimes(1);

    act(() => {
      ref.current?.close();
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('exposes open() and close() through the imperative ref', () => {
    const ref = React.createRef<IMultiSelectRef>();
    render(
      <MultiSelect
        ref={ref}
        testID="multiselect"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
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

describe('MultiSelect — selection', () => {
  it('adds items to the selection when tapped and keeps the list open', () => {
    const onChange = jest.fn();
    const Harness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        />
      );
    };
    render(<Harness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Apple'));

    expect(onChange).toHaveBeenLastCalledWith(['apple']);

    fireEvent.press(screen.getByText('Banana'));
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);
  });

  it('removes an already-selected item when tapped again in the list', () => {
    const TestHarness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          value={value}
          onChange={setValue}
        />
      );
    };
    render(<TestHarness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Apple'));

    const appleInstances = screen.getAllByText('Apple');
    fireEvent.press(appleInstances[appleInstances.length - 1]!);

    expect(screen.queryAllByText('Apple').length).toBeLessThanOrEqual(1);
  });

  it('refreshes chip row when value prop changes externally', () => {
    const { rerender } = render(
      <MultiSelect
        testID="multiselect"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        value={[]}
        onChange={jest.fn()}
      />
    );

    expect(screen.queryByText('Apple')).toBeNull();

    rerender(
      <MultiSelect
        testID="multiselect"
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        value={['apple', 'banana']}
        onChange={jest.fn()}
      />
    );

    // Chips render both labels below the trigger.
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });
});

describe('MultiSelect — maxSelect', () => {
  it('blocks adding items beyond the limit', () => {
    const observed: string[][] = [];
    const Harness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          maxSelect={2}
          value={value}
          onChange={(v) => {
            observed.push(v);
            setValue(v);
          }}
        />
      );
    };
    render(<Harness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Apple'));
    fireEvent.press(screen.getByText('Banana'));
    fireEvent.press(screen.getByText('Cherry'));

    // The selection never exceeded maxSelect=2.
    const longest = observed.reduce((acc, v) => Math.max(acc, v.length), 0);
    expect(longest).toBe(2);
  });

  it('still removes items when at the maxSelect limit', () => {
    const Harness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          maxSelect={2}
          value={value}
          onChange={setValue}
        />
      );
    };
    render(<Harness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Apple'));
    fireEvent.press(screen.getByText('Banana'));

    // Now at the limit. Remove Apple by tapping it in the list.
    const appleInstances = screen.getAllByText('Apple');
    fireEvent.press(appleInstances[appleInstances.length - 1]!);

    // Cherry should now be addable.
    fireEvent.press(screen.getByText('Cherry'));

    expect(screen.getByText('Cherry')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });
});

describe('MultiSelect — chip row', () => {
  it('renders the chip row below the trigger by default', () => {
    setup({ value: ['apple'] });

    // With only one item matching 'Apple' (the chip), no list is open.
    expect(screen.getByText('Apple')).toBeTruthy();
    // The placeholder text is still visible as the trigger label.
    expect(screen.getByText('Pick fruits')).toBeTruthy();
  });

  it('hides the chip row when visibleSelectedItem is false', () => {
    setup({ value: ['apple'], visibleSelectedItem: false });

    // The chip row should not render "Apple".
    expect(screen.queryByText('Apple')).toBeNull();
    // Placeholder/trigger still shows.
    expect(screen.getByText('Pick fruits')).toBeTruthy();
  });

  it('uses renderSelectedItem for custom chip rendering', () => {
    const renderSelectedItem = jest.fn((item: Item) => (
      <Text>{`[${item.label}]`}</Text>
    ));
    setup({ value: ['apple', 'banana'], renderSelectedItem });

    expect(renderSelectedItem).toHaveBeenCalled();
    const calledWith = new Set(
      renderSelectedItem.mock.calls.map(([item]) => item.value)
    );
    expect(calledWith).toEqual(new Set(['apple', 'banana']));
    expect(screen.getAllByText('[Apple]').length).toBeGreaterThan(0);
    expect(screen.getAllByText('[Banana]').length).toBeGreaterThan(0);
  });
});

describe('MultiSelect — renderEmpty', () => {
  it('renders the empty slot when data is empty and the list is open', () => {
    render(
      <MultiSelect
        testID="multiselect"
        data={[]}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        onChange={jest.fn()}
        renderEmpty={() => <Text>No fruits yet</Text>}
      />
    );

    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByText('No fruits yet')).toBeTruthy();
  });

  it('shows renderEmpty when search filters every row out', () => {
    setup({
      search: true,
      renderEmpty: (q: string) => <Text>{`No match for "${q}"`}</Text>,
    });

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.changeText(screen.getByTestId('multiselect input'), 'zzz');

    expect(screen.getByText('No match for "zzz"')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
  });
});

describe('MultiSelect — search', () => {
  it('filters items by label when searching', () => {
    setup({ search: true });

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.changeText(screen.getByTestId('multiselect input'), 'ban');

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
  });
});

describe('MultiSelect — accessibility', () => {
  it('announces itself as a combobox and flips expanded on open', () => {
    const ref = React.createRef<IMultiSelectRef>();
    render(
      <MultiSelect
        ref={ref}
        testID="multiselect"
        accessibilityLabel="Fruit basket"
        data={data}
        labelField="label"
        valueField="value"
        value={[]}
        onChange={jest.fn()}
      />
    );

    const trigger = screen.getByLabelText('Fruit basket');
    expect(trigger.props.accessibilityRole).toBe('combobox');
    expect(trigger.props.accessibilityState.expanded).toBe(false);

    act(() => {
      ref.current?.open();
    });
    const updated = screen.getByLabelText('Fruit basket');
    expect(updated.props.accessibilityState.expanded).toBe(true);
  });
});

describe('MultiSelect — disabledField', () => {
  it('skips toggles for items marked as disabled', () => {
    const onChange = jest.fn();
    const dataWithDisabled = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', locked: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    render(
      <MultiSelect
        testID="multiselect"
        data={dataWithDisabled}
        labelField="label"
        valueField="value"
        disabledField="locked"
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Banana'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('still toggles non-disabled items when disabledField is set', () => {
    const onChange = jest.fn();
    const dataWithDisabled = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', locked: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    render(
      <MultiSelect
        testID="multiselect"
        data={dataWithDisabled}
        labelField="label"
        valueField="value"
        disabledField="locked"
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Cherry'));
    expect(onChange).toHaveBeenCalledWith(['cherry']);
  });
});

describe('MultiSelect — sections', () => {
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
    props: Partial<React.ComponentProps<typeof MultiSelect>> = {}
  ) =>
    render(
      <MultiSelect
        testID="multiselect"
        sections={sectioned}
        labelField="label"
        valueField="value"
        placeholder="Pick fruits"
        value={[]}
        onChange={jest.fn()}
        {...props}
      />
    );

  it('renders section headers alongside items when opened', () => {
    setupSections();

    fireEvent.press(screen.getByTestId('multiselect'));

    expect(screen.getByText('Berries')).toBeTruthy();
    expect(screen.getByText('Citrus')).toBeTruthy();
    expect(screen.getByText('Strawberry')).toBeTruthy();
    expect(screen.getByText('Lemon')).toBeTruthy();
  });

  it('toggles items from sections', () => {
    const onChange = jest.fn();
    setupSections({ onChange });

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Strawberry'));

    expect(onChange).toHaveBeenCalledWith(['str']);
  });

  it('filters per-section during search and drops empty sections', () => {
    setupSections({ search: true });

    fireEvent.press(screen.getByTestId('multiselect'));

    const searchInput = screen.getByTestId('multiselect input');
    fireEvent(searchInput, 'onChangeText', 'orange');

    expect(screen.getByText('Orange')).toBeTruthy();
    expect(screen.queryByText('Lemon')).toBeNull();
    expect(screen.queryByText('Berries')).toBeNull();
    expect(screen.getByText('Citrus')).toBeTruthy();
  });

  it('honors a custom renderSectionHeader', () => {
    const renderSectionHeader = jest.fn(
      (section: { title: string }) =>
        (
          <Text testID={`sh-${section.title}`}>{`• ${section.title}`}</Text>
        ) as any
    );
    setupSections({ renderSectionHeader });

    fireEvent.press(screen.getByTestId('multiselect'));

    expect(screen.getByTestId('sh-Berries')).toBeTruthy();
    expect(screen.getByText('• Citrus')).toBeTruthy();
  });
});

describe('MultiSelect — behaviour coverage', () => {
  it('persistSearch keeps the search text across close/reopen', () => {
    setup({ search: true, persistSearch: true, value: [] });

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.changeText(screen.getByTestId('multiselect input'), 'cherry');
    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByTestId('multiselect'));

    expect(screen.getByTestId('multiselect input').props.value).toBe('cherry');
  });

  it('default behaviour clears the search text on close', () => {
    setup({ search: true, value: [] });

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.changeText(screen.getByTestId('multiselect input'), 'cherry');
    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByTestId('multiselect'));

    expect(screen.getByTestId('multiselect input').props.value).toBe('');
  });

  it('hideSelectedFromList hides selected items from the list rows', () => {
    // By default the chip row only renders while the list is CLOSED
    // (see `alwaysRenderSelectedItem`). We open with `alwaysRender…`
    // so the chip stays visible alongside the filtered list — that
    // way we can assert both halves in a single open state.
    setup({
      value: ['banana'],
      hideSelectedFromList: true,
      alwaysRenderSelectedItem: true,
    });

    fireEvent.press(screen.getByTestId('multiselect'));

    // Chip is still visible (via alwaysRenderSelectedItem).
    expect(screen.getByText('Banana')).toBeTruthy();

    // But the list row isn't. Apple and Cherry still render.
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Cherry')).toBeTruthy();

    // There should be exactly one "Banana" text — the chip, not a
    // list row.
    const bananas = screen.getAllByText('Banana');
    expect(bananas).toHaveLength(1);
  });

  it('activeItemTextStyle is applied only to the selected rows', () => {
    setup({
      value: ['apple'],
      activeItemTextStyle: { color: 'orange' },
    });

    fireEvent.press(screen.getByTestId('multiselect'));

    const flattenStyle = (node: any) =>
      Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;

    const apples = screen.getAllByText('Apple');
    const appleInList = apples[apples.length - 1]!;
    expect(flattenStyle(appleInList).color).toBe('orange');

    const banana = screen.getByText('Banana');
    expect(flattenStyle(banana).color).not.toBe('orange');
  });

  it('searchKeyboardType lands on the underlying TextInput', () => {
    setup({ search: true, searchKeyboardType: 'numeric', value: [] });
    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByTestId('multiselect input').props.keyboardType).toBe(
      'numeric'
    );
  });

  it('searchInputProps are spread onto the underlying TextInput', () => {
    setup({
      search: true,
      value: [],
      searchInputProps: {
        autoCapitalize: 'words',
        returnKeyType: 'done',
      },
    });
    fireEvent.press(screen.getByTestId('multiselect'));
    const input = screen.getByTestId('multiselect input');
    expect(input.props.autoCapitalize).toBe('words');
    expect(input.props.returnKeyType).toBe('done');
  });

  it('renderModalHeader renders inside the modal and receives close()', () => {
    setup({
      value: [],
      renderModalHeader: (close) => (
        <Text testID="ms-modal-header" onPress={close}>
          HEADER
        </Text>
      ),
    });

    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByTestId('ms-modal-header')).toBeTruthy();

    fireEvent.press(screen.getByTestId('ms-modal-header'));
    expect(screen.queryByTestId('ms-modal-header')).toBeNull();
  });

  it('onEndReached + onEndReachedThreshold are forwarded to the FlatList', () => {
    const onEndReached = jest.fn();
    setup({
      onEndReached,
      onEndReachedThreshold: 0.1,
      value: [],
    });

    fireEvent.press(screen.getByTestId('multiselect'));
    const list = screen.getByTestId('multiselect flatlist');
    expect(list.props.onEndReached).toBe(onEndReached);
    expect(list.props.onEndReachedThreshold).toBe(0.1);
  });

  it('closeModalWhenSelectedItem=true closes the list after each toggle', () => {
    const Harness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          value={value}
          onChange={setValue}
          closeModalWhenSelectedItem
        />
      );
    };
    render(<Harness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByTestId('multiselect flatlist')).toBeTruthy();

    fireEvent.press(screen.getByText('Apple'));
    // List is dismissed.
    expect(screen.queryByTestId('multiselect flatlist')).toBeNull();
  });

  it('selectedToTop pushes selected items to the top of the list', () => {
    // Each list row gets `testID = item[labelField]` by default
    // (Apple, Banana, Cherry). Query them all, read the DOM order
    // through `findAllByTestId`, then compare positions.
    const Harness = () => {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <MultiSelect
          testID="multiselect"
          data={data}
          labelField="label"
          valueField="value"
          value={value}
          onChange={setValue}
          selectedToTop
        />
      );
    };
    render(<Harness />);

    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByText('Cherry'));

    // Close and reopen so the re-sorted listData flushes through.
    fireEvent.press(screen.getByTestId('multiselect'));
    fireEvent.press(screen.getByTestId('multiselect'));

    const apple = screen.getByTestId('Apple');
    const banana = screen.getByTestId('Banana');
    const cherry = screen.getByTestId('Cherry');

    // Verify Cherry sits before Apple / Banana by comparing rendered
    // depth-first order via a shared parent walk.
    const order = (() => {
      const seen: string[] = [];
      const walk = (node: any) => {
        if (!node) return;
        if (node.props && node.props.testID) seen.push(node.props.testID);
        if (Array.isArray(node.children)) node.children.forEach(walk);
      };
      walk(screen.toJSON());
      return seen;
    })();

    const idx = (label: string) => order.findIndex((r) => r === label);
    expect(idx('Cherry')).toBeGreaterThan(-1);
    expect(idx('Cherry')).toBeLessThan(idx('Apple'));
    expect(idx('Cherry')).toBeLessThan(idx('Banana'));

    // Sanity: all three are present in the tree.
    expect(apple).toBeTruthy();
    expect(banana).toBeTruthy();
    expect(cherry).toBeTruthy();
  });
});

describe('MultiSelect — regressions', () => {
  // Guardrails for bugs fixed during the Apr 2026 refactor; each one
  // existed in the code for years because nothing caught them.

  it('renders no chips when value is undefined (not "render every item")', () => {
    // Previous bug: `_renderItemSelected` filtered with
    //   const check = value?.indexOf(...)
    //   if (check !== -1) return e
    // When `value` was undefined, `check` was undefined, `!== -1` was
    // true, and the trigger row rendered every item as a chip.
    setup({ value: undefined });

    // `Apple`, `Banana`, `Cherry` should NOT appear in the chip row
    // while the list is closed. The trigger shows just the
    // placeholder.
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Banana')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
    expect(screen.getByText('Pick fruits')).toBeTruthy();
  });

  it('renders no chips when value is an empty array', () => {
    setup({ value: [] });
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Banana')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
  });

  it('only renders chips for the items actually in the value array', () => {
    setup({ value: ['banana'] });
    expect(screen.getAllByText('Banana').length).toBeGreaterThan(0);
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
  });

  it('does not mutate items passed in `data` (no magical `_index` property)', () => {
    // Previous bug: `_renderItem` called
    //   _assign(item, { _index: index })
    // which mutated the consumer's data. Frozen items would throw.
    const frozen = Object.freeze([
      Object.freeze({ label: 'Apple', value: 'apple' }),
      Object.freeze({ label: 'Banana', value: 'banana' }),
    ]);

    expect(() =>
      render(
        <MultiSelect
          testID="multiselect"
          data={frozen as any}
          labelField="label"
          valueField="value"
          value={[]}
          onChange={jest.fn()}
        />
      )
    ).not.toThrow();

    fireEvent.press(screen.getByTestId('multiselect'));

    // Items remain free of the removed sentinel.
    for (const item of frozen) {
      expect(item).not.toHaveProperty('_index');
    }
  });
});

describe('MultiSelect — inside mode', () => {
  // `_renderDropdownInside` used to drop several props that default
  // mode passed through — hitSlop, allowFontScaling, selectedTextProps
  // — meaning consumers of `inside={true}` silently lost them.

  it('forwards hitSlop to the trigger', () => {
    const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };
    setup({ inside: true, hitSlop });
    expect(screen.getByTestId('multiselect').props.hitSlop).toEqual(hitSlop);
  });

  it('forwards allowFontScaling to the placeholder <Text>', () => {
    setup({ inside: true, allowFontScaling: false });
    expect(screen.getByText('Pick fruits').props.allowFontScaling).toBe(false);
  });

  it('spreads selectedTextProps onto the placeholder <Text>', () => {
    setup({
      inside: true,
      selectedTextProps: { numberOfLines: 2, testID: 'ms-inside-label' },
    });
    // testID passthrough is the easy assertion; numberOfLines is on
    // the same <Text>.
    const label = screen.getByTestId('ms-inside-label');
    expect(label.props.numberOfLines).toBe(2);
  });
});

describe('MultiSelect — a11y defaults', () => {
  it('marks the trigger accessible even without accessibilityLabel', () => {
    setup(); // no accessibilityLabel
    const trigger = screen.getByTestId('multiselect');
    expect(trigger.props.accessible).not.toBe(false);
  });

  it('marks list items accessible even without accessibilityLabel', () => {
    setup();
    fireEvent.press(screen.getByTestId('multiselect'));
    const apple = screen.getByTestId('Apple');
    expect(apple.props.accessible).not.toBe(false);
    expect(apple.props.accessibilityLabel).toBe('Apple');
  });

  it('marks chips accessible even without accessibilityLabel', () => {
    setup({ value: ['apple'] });
    // Chip row is rendered below the closed trigger.
    const chip = screen.getByTestId('Apple');
    expect(chip.props.accessible).not.toBe(false);
    expect(chip.props.accessibilityLabel).toBe('Apple');
  });

  it('sets accessibilityRole="button" on list items', () => {
    setup();
    fireEvent.press(screen.getByTestId('multiselect'));
    expect(screen.getByTestId('Apple').props.accessibilityRole).toBe('button');
  });

  it('sets accessibilityRole="button" and hint on chips', () => {
    setup({ value: ['apple'] });
    const chip = screen.getByTestId('Apple');
    expect(chip.props.accessibilityRole).toBe('button');
    expect(chip.props.accessibilityHint).toMatch(/remove/i);
  });

  it('forwards accessibilityHint to the trigger', () => {
    setup({ accessibilityHint: 'Opens fruit picker' });
    expect(screen.getByTestId('multiselect').props.accessibilityHint).toBe(
      'Opens fruit picker'
    );
  });

  it('forwards accessibilityHint to the trigger in inside mode', () => {
    setup({ inside: true, accessibilityHint: 'Opens fruit picker' });
    expect(screen.getByTestId('multiselect').props.accessibilityHint).toBe(
      'Opens fruit picker'
    );
  });

  it('marks the chip row as a polite accessibility live region', () => {
    const { UNSAFE_getByProps } = setup({ value: ['apple'] });
    // The container around the chips announces additions to screen
    // readers without forcing the user back to the row.
    expect(
      UNSAFE_getByProps({ accessibilityLiveRegion: 'polite' })
    ).toBeTruthy();
  });
});
