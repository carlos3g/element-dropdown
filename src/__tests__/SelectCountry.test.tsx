import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { SelectCountry } from '..';
import type { ISelectCountryRef } from '..';

type Country = {
  label: string;
  value: string;
  image: { uri: string };
};

const data: Country[] = [
  {
    label: 'Brazil',
    value: 'BR',
    image: { uri: 'https://example.com/br.png' },
  },
  {
    label: 'United Kingdom',
    value: 'GB',
    image: { uri: 'https://example.com/gb.png' },
  },
  {
    label: 'United States',
    value: 'US',
    image: { uri: 'https://example.com/us.png' },
  },
];

const setup = (
  props: Partial<React.ComponentProps<typeof SelectCountry>> = {}
) =>
  render(
    <SelectCountry
      testID="country"
      data={data}
      labelField="label"
      valueField="value"
      imageField="image"
      placeholder="Pick a country"
      onChange={jest.fn()}
      {...props}
    />
  );

describe('SelectCountry', () => {
  it('renders the placeholder when no value is provided', () => {
    setup();

    expect(screen.getByText('Pick a country')).toBeTruthy();
  });

  it('renders the selected label when a value is provided', () => {
    setup({ value: 'BR' });

    expect(screen.getByText('Brazil')).toBeTruthy();
  });

  it('opens the list when the trigger is pressed', () => {
    setup();

    fireEvent.press(screen.getByTestId('country'));

    for (const country of data) {
      expect(screen.getByText(country.label)).toBeTruthy();
    }
  });

  it('calls onChange with the selected country', () => {
    const onChange = jest.fn();
    setup({ onChange });

    fireEvent.press(screen.getByTestId('country'));
    fireEvent.press(screen.getByText('United Kingdom'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'United Kingdom', value: 'GB' })
    );
  });

  it('forwards Dropdown-level props like search', () => {
    setup({ search: true, searchPlaceholder: 'Find country…' });

    fireEvent.press(screen.getByTestId('country'));

    expect(screen.getByTestId('country input')).toBeTruthy();
  });

  it('exposes open() and close() through the imperative ref', () => {
    const ref = React.createRef<ISelectCountryRef>();
    render(
      <SelectCountry
        ref={ref}
        testID="country"
        data={data}
        labelField="label"
        valueField="value"
        imageField="image"
        onChange={jest.fn()}
      />
    );

    expect(screen.queryByText('Brazil')).toBeNull();

    act(() => {
      ref.current?.open();
    });
    expect(screen.getByText('Brazil')).toBeTruthy();

    act(() => {
      ref.current?.close();
    });
    expect(screen.queryByText('Brazil')).toBeNull();
  });
});
