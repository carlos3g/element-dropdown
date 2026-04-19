import React from 'react';
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

describe('Dropdown', () => {
  it('renders the placeholder when no value is provided', () => {
    setup();

    expect(screen.getByText('Pick a fruit')).toBeTruthy();
  });

  it('renders the selected label when a value is provided', () => {
    setup({ value: 'banana' });

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Pick a fruit')).toBeNull();
  });

  it('opens the list when the trigger is pressed and shows each item', () => {
    setup();

    fireEvent.press(screen.getByTestId('dropdown'));

    for (const item of data) {
      expect(screen.getByText(item.label)).toBeTruthy();
    }
  });

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

  it('does not open when disable is true', () => {
    setup({ disable: true });

    fireEvent.press(screen.getByTestId('dropdown'));

    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('filters items by label when searching', () => {
    setup({ search: true });

    fireEvent.press(screen.getByTestId('dropdown'));

    fireEvent.changeText(screen.getByTestId('dropdown input'), 'ban');

    expect(screen.getByText('Banana')).toBeTruthy();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('Cherry')).toBeNull();
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
