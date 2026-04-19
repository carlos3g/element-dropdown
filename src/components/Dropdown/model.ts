import type React from 'react';
import type {
  FlatListProps,
  ImageStyle,
  Insets,
  KeyboardTypeOptions,
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type IDropdownRef = {
  open: () => void;
  close: () => void;
};

export interface DropdownProps<T> {
  ref?:
    | React.RefObject<IDropdownRef>
    | React.MutableRefObject<IDropdownRef>
    | null
    | undefined;
  testID?: string;
  itemTestIDField?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  selectedTextProps?: TextProps;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  activeItemTextStyle?: StyleProp<TextStyle>;
  inputSearchStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  maxHeight?: number;
  minHeight?: number;
  fontFamily?: string;
  iconColor?: string;
  activeColor?: string;
  data: T[];
  value?: T | string | null | undefined;
  placeholder?: string;
  labelField: keyof T;
  valueField: keyof T;
  searchField?: keyof T | (keyof T)[];
  disabledField?: keyof T;
  search?: boolean;
  searchKeyboardType?: KeyboardTypeOptions;
  searchInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'placeholder'
    | 'placeholderTextColor'
    | 'allowFontScaling'
    | 'keyboardType'
  >;
  persistSearch?: boolean;
  hitSlop?: Insets | number;
  allowFontScaling?: boolean;
  /**
   * Set when this Dropdown is rendered inside a React Native Modal.
   * React Native reports `measureInWindow` coordinates relative to the
   * outermost Modal, not the screen, so the component's internal
   * `statusBarHeight` offset ends up double-counted. Set this to `true`
   * to skip that offset and have the list open against the trigger
   * correctly.
   */
  isInsideModal?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  disable?: boolean;
  autoScroll?: boolean;
  showsVerticalScrollIndicator?: boolean;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  flatListProps?: Omit<FlatListProps<any>, 'renderItem' | 'data'>;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  confirmSelectItem?: boolean;
  accessibilityLabel?: string;
  itemAccessibilityLabelField?: string;
  inverted?: boolean;
  mode?: 'default' | 'modal' | 'auto';
  closeModalWhenSelectedItem?: boolean;
  excludeItems?: T[];
  excludeSearchItems?: T[];
  hideSelectedFromList?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  onChange: (item: T) => void;
  renderLeftIcon?: (visible?: boolean) => React.ReactElement | null;
  renderRightIcon?: (visible?: boolean) => React.ReactElement | null;
  renderSelectedItem?: (visible?: boolean) => React.ReactElement | null;
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null;
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null;
  renderModalHeader?: (close: () => void) => React.ReactElement | null;
  onFocus?: () => void;
  onBlur?: () => void;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  onChangeText?: (search: string) => void;
  onConfirmSelectItem?: (item: T) => void;
}
