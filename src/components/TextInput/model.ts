import type React from 'react';
import type {
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface Props extends TextInputProps {
  fontFamily?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  showIcon?: boolean;
  renderRightIcon?: () => React.ReactElement | null;
  renderLeftIcon?: () => React.ReactElement | null;
  /**
   * Replace the default `close.png` glyph shown on the built-in
   * clear button, while keeping the `onPress` handler that clears
   * the text. Ignored when `renderRightIcon` is provided (which
   * takes over the whole right-icon slot).
   */
  clearIcon?: React.ReactElement | null;
}

export type CTextInput = React.FC<Props>;
