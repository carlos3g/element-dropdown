import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { DropdownSearchInput, DropdownSectionHeader } from '../internal';

describe('DropdownSearchInput', () => {
  const baseProps = {
    search: true,
    value: '',
    onChangeText: jest.fn(),
    wrapperStyle: {},
    textInputStyle: {},
  };

  afterEach(() => {
    baseProps.onChangeText.mockReset();
  });

  it('renders nothing when search is false', () => {
    const { toJSON } = render(
      <DropdownSearchInput {...baseProps} search={false} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders the built-in CInput with derived testIDs', () => {
    render(<DropdownSearchInput {...baseProps} testID="dropdown" />);
    // CInput spreads `testID` onto its inner TextInput; "dropdown input"
    // is the conventional id used throughout the component tests.
    expect(screen.getByTestId('dropdown input')).toBeTruthy();
  });

  it('delegates to renderInputSearch when provided', () => {
    const renderInputSearch = jest.fn((onSearch: (s: string) => void) => (
      <Text testID="custom-input" onPress={() => onSearch('hello')}>
        custom
      </Text>
    ));

    render(
      <DropdownSearchInput
        {...baseProps}
        renderInputSearch={renderInputSearch}
      />
    );

    expect(screen.getByTestId('custom-input')).toBeTruthy();
    // And the renderInputSearch callback still hooks into our
    // onChangeText plumbing.
    fireEvent.press(screen.getByTestId('custom-input'));
    expect(baseProps.onChangeText).toHaveBeenCalledWith('hello');
  });

  it('forwards typing to onChangeText', () => {
    render(<DropdownSearchInput {...baseProps} testID="dd" />);
    fireEvent.changeText(screen.getByTestId('dd input'), 'typed');
    expect(baseProps.onChangeText).toHaveBeenCalledWith('typed');
  });

  it('forwards searchInputProps to the underlying TextInput', () => {
    render(
      <DropdownSearchInput
        {...baseProps}
        testID="dd"
        searchInputProps={{
          autoCapitalize: 'characters',
          selectionColor: '#007AFF',
          autoFocus: true,
        }}
      />
    );
    const input = screen.getByTestId('dd input');
    expect(input.props.autoCapitalize).toBe('characters');
    expect(input.props.selectionColor).toBe('#007AFF');
    expect(input.props.autoFocus).toBe(true);
  });

  it('forwards keyboardType', () => {
    render(
      <DropdownSearchInput
        {...baseProps}
        testID="dd"
        keyboardType="email-address"
      />
    );
    expect(screen.getByTestId('dd input').props.keyboardType).toBe(
      'email-address'
    );
  });

  it('forwards placeholder and placeholder color', () => {
    render(
      <DropdownSearchInput
        {...baseProps}
        testID="dd"
        placeholder="Search fruits"
        placeholderTextColor="tomato"
      />
    );
    const input = screen.getByTestId('dd input');
    expect(input.props.placeholder).toBe('Search fruits');
    expect(input.props.placeholderTextColor).toBe('tomato');
  });

  it('reflects the controlled value prop', () => {
    const { rerender } = render(
      <DropdownSearchInput {...baseProps} testID="dd" value="initial" />
    );
    expect(screen.getByTestId('dd input').props.value).toBe('initial');

    rerender(
      <DropdownSearchInput {...baseProps} testID="dd" value="updated" />
    );
    expect(screen.getByTestId('dd input').props.value).toBe('updated');
  });
});

describe('DropdownSectionHeader', () => {
  const section = { title: 'Berries', data: [{}] };

  it('renders the default header with the section title', () => {
    render(<DropdownSectionHeader section={section} />);
    expect(screen.getByText('Berries')).toBeTruthy();
  });

  it('delegates to a custom renderSectionHeader when provided', () => {
    const custom = jest.fn((s: typeof section) => (
      <Text testID="custom-header">{`• ${s.title}`}</Text>
    ));
    render(
      <DropdownSectionHeader section={section} renderSectionHeader={custom} />
    );
    expect(screen.getByTestId('custom-header')).toBeTruthy();
    expect(screen.getByText('• Berries')).toBeTruthy();
    expect(custom).toHaveBeenCalledWith(section);
  });

  it('passes a custom renderSectionHeader priority over style props', () => {
    const custom = jest.fn(() => <Text testID="only-custom">x</Text>);
    render(
      <DropdownSectionHeader
        section={section}
        renderSectionHeader={custom}
        sectionHeaderStyle={{ backgroundColor: 'red' }}
        sectionHeaderTextStyle={{ color: 'blue' }}
      />
    );
    // The default header is not rendered when a custom renderer is set.
    expect(screen.queryByText('Berries')).toBeNull();
    expect(screen.getByTestId('only-custom')).toBeTruthy();
  });

  it('merges sectionHeaderTextStyle and fontStyle on the default <Text>', () => {
    render(
      <DropdownSectionHeader
        section={section}
        sectionHeaderTextStyle={{ color: 'indigo' }}
        fontStyle={{ fontFamily: 'Inter' }}
      />
    );
    const textNode = screen.getByText('Berries');
    const flat = Array.isArray(textNode.props.style)
      ? Object.assign({}, ...textNode.props.style.filter(Boolean))
      : textNode.props.style;
    expect(flat.color).toBe('indigo');
    expect(flat.fontFamily).toBe('Inter');
  });

  it('forwards allowFontScaling', () => {
    render(
      <DropdownSectionHeader section={section} allowFontScaling={false} />
    );
    expect(screen.getByText('Berries').props.allowFontScaling).toBe(false);
  });
});
