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
