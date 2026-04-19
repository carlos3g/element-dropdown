import React from 'react';
import {
  ImageStyle,
  KeyboardTypeOptions,
  StyleProp,
  TextInputProps,
  TextStyle,
} from 'react-native';

import CInput from '../components/TextInput';

// Styles for the outer wrapper are owned by each component because
// they pull from their local stylesheet (Dropdown's `styles.input`
// vs MultiSelect's `styles.input`). Callers pass a ready-flattened
// `wrapperStyle` / `textInputStyle`.

interface Props {
  /** When false, renders nothing — the component is a no-op. */
  search: boolean;
  /** Fully custom search affordance. When provided, `onSearch` is the only callback; the component renders whatever the user returns. */
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null;

  /** Current value of the input (controlled). */
  value: string;
  /** Called with the new text on every change. */
  onChangeText: (text: string) => void;

  wrapperStyle: StyleProp<TextStyle>;
  textInputStyle: StyleProp<TextStyle>;

  testID?: string;
  accessibilityLabel?: string;
  allowFontScaling?: boolean;

  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: KeyboardTypeOptions;
  searchInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'placeholder'
    | 'placeholderTextColor'
    | 'allowFontScaling'
    | 'keyboardType'
  >;

  iconColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
}

/**
 * Renders the search bar used by both Dropdown and MultiSelect. Honours
 * `renderInputSearch` when provided, otherwise falls back to the
 * built-in `<CInput>` + clear-icon layout. Extracted to avoid a
 * ~50-line duplicated `renderSearch` `useCallback` in each component.
 */
export function DropdownSearchInput({
  search,
  renderInputSearch,
  value,
  onChangeText,
  wrapperStyle,
  textInputStyle,
  testID,
  accessibilityLabel,
  allowFontScaling,
  placeholder,
  placeholderTextColor,
  keyboardType,
  searchInputProps,
  iconColor,
  iconStyle,
}: Props) {
  if (!search) return null;

  if (renderInputSearch) {
    return renderInputSearch(onChangeText);
  }

  // Derive a fallback accessibilityLabel from the dropdown-level prop
  // so screen readers have *something* to announce, but let the caller
  // win by putting `searchInputProps` after the derived value in the
  // spread. Consumers who care about the exact label can pass
  // `searchInputProps={{ accessibilityLabel: 'Search fruits' }}`.
  const derivedLabel = accessibilityLabel
    ? accessibilityLabel + ' input'
    : undefined;

  return (
    <CInput
      autoCorrect={false}
      accessibilityLabel={derivedLabel}
      {...searchInputProps}
      testID={testID ? testID + ' input' : undefined}
      allowFontScaling={allowFontScaling}
      style={wrapperStyle}
      inputStyle={textInputStyle}
      value={value}
      keyboardType={keyboardType}
      placeholder={placeholder}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor}
      showIcon
      iconStyle={[{ tintColor: iconColor }, iconStyle]}
    />
  );
}
