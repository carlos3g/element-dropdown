import type React from 'react';
import type {
  FlatListProps,
  ImageStyle,
  Insets,
  KeyboardTypeOptions,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { TextProps } from 'react-native';
import type { Section } from '../Dropdown/model';
export type { Section } from '../Dropdown/model';

/**
 * Imperative handle exposed by the MultiSelect component.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { MultiSelect } from '@carlos3g/element-dropdown';
 * import type { IMultiSelectRef } from '@carlos3g/element-dropdown';
 *
 * const ref = useRef<IMultiSelectRef>(null);
 * ref.current?.open();
 * ref.current?.close();
 * ```
 */
export interface IMultiSelectRef {
  /** Open the list. No-op if `disable={true}`. */
  open: () => void;
  /** Close the list. No-op if `disable={true}`. */
  close: () => void;
}

/**
 * Props for the {@link MultiSelect} component — multi-select with a
 * chip row that renders the current selection.
 *
 * @typeParam T - Shape of each item in `data`.
 *
 * @example Minimal usage
 * ```tsx
 * import { useState } from 'react';
 * import { MultiSelect } from '@carlos3g/element-dropdown';
 *
 * const data = [
 *   { label: 'Apple', value: 'apple' },
 *   { label: 'Banana', value: 'banana' },
 *   { label: 'Cherry', value: 'cherry' },
 * ];
 *
 * function FruitBasket() {
 *   const [value, setValue] = useState<string[]>([]);
 *   return (
 *     <MultiSelect
 *       data={data}
 *       labelField="label"
 *       valueField="value"
 *       value={value}
 *       onChange={setValue}
 *       placeholder="Pick fruits"
 *     />
 *   );
 * }
 * ```
 *
 * @see https://carlos3g.github.io/element-dropdown/docs/components/multi-select
 */
export interface MultiSelectProps<T> {
  ref?:
    | React.RefObject<IMultiSelectRef>
    | React.MutableRefObject<IMultiSelectRef>
    | null
    | undefined;

  // ──────────────────────────────────────────────────────────────────
  // Required: data and binding
  // ──────────────────────────────────────────────────────────────────

  /**
   * Array of items to render in the list. Pass `sections` instead
   * to group items under section headers.
   */
  data?: T[];
  /**
   * Groups of items to render under section headers. Pass this
   * *instead of* `data` — when present, `data` is ignored.
   *
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/sectioned-lists
   */
  sections?: Section<T>[];
  /** Field on each item used as the visible label. */
  labelField: keyof T;
  /** Field on each item that uniquely identifies it. */
  valueField: keyof T;
  /** Currently selected `valueField` values. */
  value?: string[] | null | undefined;
  /** Fires with the new selection array on every toggle. */
  onChange: (value: string[]) => void;

  // ──────────────────────────────────────────────────────────────────
  // Trigger label & chip row
  // ──────────────────────────────────────────────────────────────────

  /** Trigger label when the selection is empty. @default 'Select item' */
  placeholder?: string;
  /** Style for the placeholder text. */
  placeholderStyle?: StyleProp<TextStyle>;
  /** Style for the trigger label when the selection is non-empty. */
  selectedTextStyle?: StyleProp<TextStyle>;
  /** Extra props for the trigger `<Text>`. @default {} */
  selectedTextProps?: TextProps;
  /** Cap on how many items can be selected. */
  maxSelect?: number;
  /** When `false`, the chip row below the trigger is hidden. @default true */
  visibleSelectedItem?: boolean;
  /** Keep the chip row visible while the list is open. @default false */
  alwaysRenderSelectedItem?: boolean;
  /**
   * Render the chip row inside the trigger instead of below it.
   * @default false
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/multi-select-inside-mode
   */
  inside?: boolean;
  /** Style for each chip container. */
  selectedStyle?: StyleProp<ViewStyle>;
  /**
   * Fully custom chip renderer.
   *
   * @param item     - The selected item.
   * @param unSelect - Callback to deselect this item.
   */
  renderSelectedItem?: (
    item: T,
    unSelect?: (item: T) => void
  ) => React.ReactElement | null;

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
  /** Layout mode — see Dropdown for the same prop. @default 'default' */
  mode?: 'default' | 'modal' | 'auto';
  /** Force the list to open above, below, or auto-pick. @default 'auto' */
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  /** Reverses scroll direction when the list opens above the trigger. @default true */
  inverted?: boolean;
  /**
   * Set when this MultiSelect is rendered inside a React Native
   * `<Modal>`. Skips the double-counted `statusBarHeight` offset.
   * @default false
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/nested-in-modal
   */
  isInsideModal?: boolean;

  // ──────────────────────────────────────────────────────────────────
  // Items
  // ──────────────────────────────────────────────────────────────────

  /** Style merged on top of the built-in row style. */
  itemContainerStyle?: StyleProp<ViewStyle>;
  /** Style for the default item label. */
  itemTextStyle?: StyleProp<TextStyle>;
  /** Extra text style applied only to selected rows. */
  activeItemTextStyle?: StyleProp<TextStyle>;
  /** Background of the row for already-selected items. @default '#F6F7F8' */
  activeColor?: string;
  /**
   * Field on each item whose truthy value disables that row.
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/disabled-items
   */
  disabledField?: keyof T;
  /**
   * Drop already-selected items from the rendered list.
   * @default false
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/selected-ordering
   */
  hideSelectedFromList?: boolean;
  /**
   * Push selected items to the top of the list. No-op when
   * `hideSelectedFromList` is `true`.
   * @default false
   */
  selectedToTop?: boolean;
  /** Fully custom row renderer. */
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null;

  // ──────────────────────────────────────────────────────────────────
  // Sections (used only when `sections` is provided)
  // ──────────────────────────────────────────────────────────────────

  /** Style for the default section-header container `<View>`. */
  sectionHeaderStyle?: StyleProp<ViewStyle>;
  /** Style for the default section-header `<Text>`. */
  sectionHeaderTextStyle?: StyleProp<TextStyle>;
  /** Fully custom section-header renderer. */
  renderSectionHeader?: (section: Section<T>) => React.ReactElement | null;

  // ──────────────────────────────────────────────────────────────────
  // Search (mirrors Dropdown)
  // ──────────────────────────────────────────────────────────────────

  /** Show the search input above the list. @default false */
  search?: boolean;
  /**
   * Field(s) the default matcher compares against.
   * @default labelField
   */
  searchField?: keyof T | (keyof T)[];
  /** Placeholder text for the search input. */
  searchPlaceholder?: string;
  /** Placeholder color for the search input. @default 'gray' */
  searchPlaceholderTextColor?: string;
  /** Style for the search input. */
  inputSearchStyle?: StyleProp<TextStyle>;
  /** `keyboardType` for the search input. */
  searchKeyboardType?: KeyboardTypeOptions;
  /**
   * `TextInputProps` spread onto the search input. The dropdown-managed
   * props are excluded from this type.
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
  /** Keep the search text across opens / selections. @default false */
  persistSearch?: boolean;
  /** Fully custom matcher. Return `true` to keep an item. */
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  /** Fully custom search input. */
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => React.ReactElement | null;
  /** Fires whenever the search text changes. */
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
   * Renders a sticky header above the list inside the modal.
   * @see https://carlos3g.github.io/element-dropdown/docs/guides/modal-header
   */
  renderModalHeader?: (close: () => void) => React.ReactElement | null;

  // ──────────────────────────────────────────────────────────────────
  // Behaviour
  // ──────────────────────────────────────────────────────────────────

  /** Disable the trigger entirely. @default false */
  disable?: boolean;
  /** Lift the list when the search input raises the keyboard. @default true */
  keyboardAvoiding?: boolean;
  /**
   * When `true`, toggling an item calls `onConfirmSelectItem` instead
   * of immediately mutating `value`. @default false
   */
  confirmSelectItem?: boolean;
  /** Same as `confirmSelectItem` but for un-toggling. @default false */
  confirmUnSelectItem?: boolean;
  /** Confirm handler invoked under the `confirm*` props. */
  onConfirmSelectItem?: (item: any) => void;
  /**
   * Close the list after each toggle. Defaults to `false` to match
   * typical multi-select UX (keep selecting).
   * @default false
   */
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

  /** Applied to trigger, item, chip, and search text. */
  fontFamily?: string;
  /** Propagated to every `Text` and `TextInput`. */
  allowFontScaling?: boolean;

  // ──────────────────────────────────────────────────────────────────
  // Accessibility & testing
  // ──────────────────────────────────────────────────────────────────

  /** Label for the trigger; also propagated to the search and list. */
  accessibilityLabel?: string;
  /** Field on each item used for its `accessibilityLabel`. @default labelField */
  itemAccessibilityLabelField?: string;
  /** `testID` for the trigger; propagated to the search and list. */
  testID?: string;
  /** Field on each item used as its `testID`. @default labelField */
  itemTestIDField?: string;
  /**
   * Expand the trigger's tap target without affecting layout.
   * @example hitSlop={10}
   */
  hitSlop?: Insets | number;
}
