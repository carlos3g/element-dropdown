import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { SelectCountry } from '..';
import type { ISelectCountryRef, SelectCountryProps } from '..';

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

const setup = (props: Partial<SelectCountryProps<Country>> = {}) =>
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

describe('SelectCountry — regressions', () => {
  it('renders the trigger image using the user-supplied `imageField`', () => {
    // Previous bug: renderLeftIcon read `selectItem.image` directly,
    // ignoring the user's imageField choice. Anyone using a different
    // field name (e.g. `flag`, `emoji`) silently got no trigger image.
    type CountryWithFlag = {
      label: string;
      value: string;
      flag: { uri: string };
    };
    const customData: CountryWithFlag[] = [
      { label: 'Brazil', value: 'BR', flag: { uri: 'https://ex.com/br.png' } },
      { label: 'France', value: 'FR', flag: { uri: 'https://ex.com/fr.png' } },
    ];

    render(
      <SelectCountry
        testID="country"
        data={customData}
        labelField="label"
        valueField="value"
        imageField="flag"
        value="FR"
        onChange={jest.fn()}
      />
    );

    // Find every Image rendered inside the trigger and assert at least
    // one points at the France flag URI. (There's also a per-row image
    // for each country, so we assert presence rather than exclusivity.)
    const triggerFlag = screen.UNSAFE_getAllByType(
      require('react-native').Image
    );
    const sources = triggerFlag
      .map((img: any) => img.props.source?.uri)
      .filter(Boolean);
    expect(sources).toContain('https://ex.com/fr.png');
  });
});
