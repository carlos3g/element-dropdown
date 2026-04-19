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

/**
 * Imperative handle exposed by the Dropdown component.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { Dropdown } from '@carlos3g/element-dropdown';
 * import type { IDropdownRef } from '@carlos3g/element-dropdown';
 *
 * const ref = useRef<IDropdownRef>(null);
 * ref.current?.open();   // programmatically open the list
 * ref.current?.close();  // programmatically close the list
 * ```
 */
export type IDropdownRef = {
  /** Open the dropdown list. No-op if `disable={true}`. */
  open: () => void;
  /** Close the dropdown list. No-op if `disable={true}`. */
  close: () => void;
};

/**
 * Props for the {@link Dropdown} component — single-select dropdown.
 *
 * @typeParam T - Shape of each item in `data`.
 *
 * @example Minimal usage
 * ```tsx
 * import { useState } from 'react';
 * import { Dropdown } from '@carlos3g/element-dropdown';
 *
 * const data = [
 *   { label: 'Apple', value: 'apple' },
 *   { label: 'Banana', value: 'banana' },
 * ];
 *
 * function FruitPicker() {
 *   const [value, setValue] = useState<string | null>(null);
 *   return (
 *     <Dropdown
 *       data={data}
 *       labelField="label"
 *       valueField="value"
 *       value={value}
 *       onChange={(item) => setValue(item.value)}
 *       placeholder="Pick a fruit"
 *     />
 *   );
 * }
 * ```
 *
 * @see https://carlos3g.github.io/element-dropdown/docs/components/dropdown
 */
export interface DropdownProps<T> {
  ref?:
    | React.RefObject<IDropdownRef>
    | React.MutableRefObject<IDropdownRef>
    | null
    | undefined;

  // ──────────────────────────────────────────────────────────────────
  // Required: data and binding
  // ──────────────────────────────────────────────────────────────────

  /** Array of items to render in the list. */
  data: T[];
  /** Field on each item used as the visible label. */
  labelField: keyof T;
  /** Field on each item that uniquely identifies it. */
  valueField: keyof T;
  /**
   * Fires with the selected item when the user picks from the list.
   * Receives the entire item, not just `valueField`.
   */
  onChange: (item: T) => void;

  // ──────────────────────────────────────────────────────────────────
  // Value and trigger label
  // ──────────────────────────────────────────────────────────────────

  /**
   * Currently selected value. Accepts the full item or just the
   * `valueField` value (string match).
   */
  value?: T | string | null | undefined;
  /** Label shown when no item is selected. @default 'Select item' */
  placeholder?: string;
  /** Style for the placeholder text. */
  placeholderStyle?: StyleProp<TextStyle>;
  /** Style for the trigger label when an item is selected. */
  selectedTextStyle?: StyleProp<TextStyle>;
  /** Extra props for the trigger label `<Text>` (e.g. `numberOfLines`). @default {} */
  selectedTextProps?: TextProps;

  // ──────────────────────────────────────────────────────────────────
  // Container, layout, mode
  // ──────────────────────────────────────────────────────────────────

  /** Style for the outer wrapper. @default {} */
  style?: StyleProp<ViewStyle>;
  /** Style for the floating list container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Color of the scrim behind the modal in full-screen modes. */
  backgroundColor?: string;
  /** Maximum height of the list. @default 340 */
  maxHeight?: number;
  /** Minimum height of the list. @default 0 */
  minHeight?: number;
  /**
   * Layout mode.
   * - `'default'` — float the list against the trigger.
   * - `'modal'` — center the list on screen as a full-screen modal.
   * - `'auto'` — measure the trigger and pick a position.
   * @default 'default'
   */
  mode?: 'default' | 'modal' | 'auto';
  /**
   * Force the list to open above (`'top'`), below (`'bottom'`),
   * or compute (`'auto'`).
   * @default 'auto'
   */
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  /** Reverses scroll direction when the list opens above the trigger. @default true */
  inverted?: boolean;
  /**
   * Set to `true` when this Dropdown is rendered inside a React Native
   * `<Modal>`. RN reports `measureInWindow` relative to the outermost
   * Modal, so the internal `statusBarHeight` offset ends up
   * double-counted; this prop skips it.
   * @default false
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/nested-in-modal
   */
  isInsideModal?: boolean;

  // ──────────────────────────────────────────────────────────────────
  // Items
  // ──────────────────────────────────────────────────────────────────

  /**
   * Style merged on top of the built-in row style. Use this to
   * change padding, height, etc.
   */
  itemContainerStyle?: StyleProp<ViewStyle>;
  /** Style for the default item label `<Text>`. */
  itemTextStyle?: StyleProp<TextStyle>;
  /** Extra text style applied only to the currently-selected row. */
  activeItemTextStyle?: StyleProp<TextStyle>;
  /** Background color of the row that matches `value`. @default '#F6F7F8' */
  activeColor?: string;
  /**
   * Field on each item whose truthy value disables that row.
   * @example
   * ```tsx
   * <Dropdown disabledField="disabled" data={[{...}, { ..., disabled: true }]} ... />
   * ```
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/disabled-items
   */
  disabledField?: keyof T;
  /** Drop the currently selected item from the rendered list. @default false */
  hideSelectedFromList?: boolean;
  /**
   * Fully custom row renderer. Overrides the default label.
   *
   * @param item     - The item being rendered.
   * @param selected - Whether `item` matches the current `value`.
   */
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null;

  // ──────────────────────────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────────────────────────

  /** Show the search input above the list. @default false */
  search?: boolean;
  /**
   * Field(s) the default matcher compares against. Pass an array to
   * search several at once.
   * @default labelField
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/custom-search-field
   */
  searchField?: keyof T | (keyof T)[];
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Placeholder color for the search input. @default 'gray' */
  searchPlaceholderTextColor?: string;
  /** Style for the search input. */
  inputSearchStyle?: StyleProp<TextStyle>;
  /**
   * `keyboardType` for the search input.
   * @example searchKeyboardType="email-address"
   */
  searchKeyboardType?: KeyboardTypeOptions;
  /**
   * `TextInputProps` spread onto the search input. Use for
   * `selectionColor`, `returnKeyType`, `autoCapitalize`, `autoFocus`,
   * etc. The props the dropdown manages itself (`value`,
   * `onChangeText`, `placeholder`, `placeholderTextColor`,
   * `allowFontScaling`, `keyboardType`) are intentionally excluded.
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/search-input-props
   */
  searchInputProps?: Omit<
    TextInputProps,
    | 'value'
    | 'onChangeText'
    | 'placeholder'
    | 'placeholderTextColor'
    | 'allowFontScaling'
    | 'keyboardType'
  >;
  /** Keep the search text across opens/selections instead of clearing. @default false */
  persistSearch?: boolean;
  /**
   * Fully custom matcher. Return `true` to keep an item.
   * @example
   * ```ts
   * searchQuery={(kw, label) => label.toLowerCase().includes(kw.toLowerCase())}
   * ```
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/custom-search-matcher
   */
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  /** Fully custom search input. Receives an `onSearch(text)` to feed back. */
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null;
  /**
   * Fires whenever the search text changes.
   * @param search - The new value of the search input.
   */
  onChangeText?: (search: string) => void;

  // ──────────────────────────────────────────────────────────────────
  // Icons & custom presentation
  // ──────────────────────────────────────────────────────────────────

  /** Style for the default chevron icon. */
  iconStyle?: StyleProp<ImageStyle>;
  /** Tint color for the default chevron. @default 'gray' */
  iconColor?: string;
  /** Custom left icon. Receives whether the list is open. */
  renderLeftIcon?: (visible?: boolean) => React.ReactElement | null;
  /** Custom right icon. Receives whether the list is open. */
  renderRightIcon?: (visible?: boolean) => React.ReactElement | null;
  /**
   * Replace the entire trigger body with custom JSX. When provided,
   * `renderLeftIcon`, the label, and `renderRightIcon` are not
   * rendered.
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/custom-trigger
   */
  renderSelectedItem?: (visible?: boolean) => React.ReactElement | null;
  /**
   * Renders a sticky header view above the list inside the modal.
   * Receives a `close()` to dismiss the dropdown.
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/modal-header
   */
  renderModalHeader?: (close: () => void) => React.ReactElement | null;

  // ──────────────────────────────────────────────────────────────────
  // Behaviour
  // ──────────────────────────────────────────────────────────────────

  /** Disable the trigger entirely. @default false */
  disable?: boolean;
  /**
   * On open, scroll the list to the currently-selected row. Ignored
   * while the list is filtered.
   * @default true
   */
  autoScroll?: boolean;
  /** Lift the list when the search input raises the keyboard. @default true */
  keyboardAvoiding?: boolean;
  /**
   * When `true`, selecting an item calls `onConfirmSelectItem` and
   * does NOT close the list — useful for "review then confirm" flows.
   * @default false
   */
  confirmSelectItem?: boolean;
  /** Called when `confirmSelectItem` is `true`. */
  onConfirmSelectItem?: (item: T) => void;
  /** Close the list after a selection. @default true */
  closeModalWhenSelectedItem?: boolean;
  /** Show the vertical scroll indicator on the list. @default true */
  showsVerticalScrollIndicator?: boolean;
  /** Passthrough to the underlying `FlatList`. */
  flatListProps?: Omit<FlatListProps<any>, 'renderItem' | 'data'>;
  /** Items hidden from the rendered list. @default [] */
  excludeItems?: T[];
  /** Items shown in the list but excluded from search matches. @default [] */
  excludeSearchItems?: T[];
  /** Fires when the list scrolls within `onEndReachedThreshold` of the bottom. */
  onEndReached?: () => void;
  /** Distance from the end (in viewport units) at which `onEndReached` fires. @default 0.5 */
  onEndReachedThreshold?: number;

  // ──────────────────────────────────────────────────────────────────
  // Lifecycle callbacks
  // ──────────────────────────────────────────────────────────────────

  /** Fires when the list opens. */
  onFocus?: () => void;
  /** Fires when the list closes. */
  onBlur?: () => void;

  // ──────────────────────────────────────────────────────────────────
  // Text rendering
  // ──────────────────────────────────────────────────────────────────

  /** Applied to trigger label, item labels, and the search input. */
  fontFamily?: string;
  /** Propagated to every `Text` and `TextInput` the component renders. */
  allowFontScaling?: boolean;

  // ──────────────────────────────────────────────────────────────────
  // Accessibility & testing
  // ──────────────────────────────────────────────────────────────────

  /**
   * Label for the trigger. Propagated as `{label} input` to the
   * search field and `{label} flatlist` to the list.
   */
  accessibilityLabel?: string;
  /**
   * Field on each item used for its `accessibilityLabel`.
   * @default labelField
   */
  itemAccessibilityLabelField?: string;
  /**
   * `testID` for the trigger. Propagated as `{testID} input` /
   * `{testID} flatlist` for the search field and list.
   */
  testID?: string;
  /**
   * Field on each item used as its `testID`.
   * @default labelField
   */
  itemTestIDField?: string;
  /**
   * Expand the trigger's tap target without affecting layout.
   * @example hitSlop={10}
   * @example hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
   */
  hitSlop?: Insets | number;
}
