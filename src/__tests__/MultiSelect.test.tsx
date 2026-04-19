import React from 'react';
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

describe('MultiSelect', () => {
  it('renders the placeholder when nothing is selected', () => {
    setup();

    expect(screen.getByText('Pick fruits')).toBeTruthy();
  });

  it('opens the list when the trigger is pressed', () => {
    setup();

    fireEvent.press(screen.getByTestId('multiselect'));

    for (const item of data) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });

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
