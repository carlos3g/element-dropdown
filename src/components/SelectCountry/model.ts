import type { ImageStyle } from 'react-native';
import type { DropdownProps } from '../Dropdown/model';

/**
 * Imperative handle exposed by the SelectCountry component.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { SelectCountry } from '@carlos3g/element-dropdown';
 * import type { ISelectCountryRef } from '@carlos3g/element-dropdown';
 *
 * const ref = useRef<ISelectCountryRef>(null);
 * ref.current?.open();
 * ```
 */
export type ISelectCountryRef = {
  /** Open the list. */
  open: () => void;
  /** Close the list. */
  close: () => void;
};

/**
 * Props for the {@link SelectCountry} component — a Dropdown variant
 * that renders an image (typically a country flag) next to each item
 * label.
 *
 * Accepts every {@link DropdownProps} prop plus the SelectCountry
 * additions documented below.
 *
 * @typeParam T - Shape of each item in `data`.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { SelectCountry } from '@carlos3g/element-dropdown';
 *
 * const data = [
 *   { value: 'gb', lable: 'United Kingdom', image: { uri: 'https://.../GB.png' } },
 *   { value: 'fr', lable: 'France',         image: { uri: 'https://.../FR.png' } },
 * ];
 *
 * function CountryPicker() {
 *   const [code, setCode] = useState('gb');
 *   return (
 *     <SelectCountry
 *       data={data}
 *       value={code}
 *       valueField="value"
 *       labelField="lable"
 *       imageField="image"
 *       onChange={(item) => setCode(item.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @see https://carlos3g.github.io/element-dropdown/docs/components/select-country
 */
export interface SelectCountryProps<T> extends DropdownProps<T> {
  /**
   * Field on each item whose value is an `ImageSourcePropType`
   * (a `{ uri }` object or a `require(...)`).
   */
  imageField: string;
  /** Style applied to the image rendered next to each list-row label. */
  imageStyle?: ImageStyle;
  /**
   * Extra style for the image rendered inside the trigger when an
   * item is selected. Merged on top of `imageStyle`.
   */
  selectedImageStyle?: ImageStyle;
}
