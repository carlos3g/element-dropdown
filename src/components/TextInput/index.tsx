/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import type { CTextInput } from './model';
import { styles } from './styles';

const ic_close = require('../../assets/close.png');

const TextInputComponent: CTextInput = (props) => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = (_value: string) => {},
    renderLeftIcon,
    renderRightIcon,
    clearIcon,
  } = props;

  // Seed from the first value prop so controlled callers don't flash an
  // empty input before the sync-effect runs.
  const [text, setText] = useState<string>(value ?? '');

  // Sync whenever the controlled `value` prop changes — including back
  // to ''. The previous `if (value) setText(value)` guard silently
  // skipped empty strings, so a parent resetting `value` to '' left
  // the input showing stale text.
  useEffect(() => {
    if (value !== undefined) {
      setText(value);
    }
  }, [value]);

  const onChange = (text: string) => {
    setText(text);
    onChangeText(text);
  };

  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon();
      }
      if (text.length > 0) {
        return (
          <TouchableOpacity onPress={() => onChange('')}>
            {clearIcon ?? (
              <Image
                source={ic_close}
                style={StyleSheet.flatten([styles.icon, iconStyle])}
              />
            )}
          </TouchableOpacity>
        );
      }
      return null;
    }
    return null;
  };

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily,
      };
    } else {
      return {};
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={[style]}>
        <View style={styles.textInput}>
          {renderLeftIcon?.()}
          <TextInput
            {...props}
            style={StyleSheet.flatten([styles.input, inputStyle, font()])}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
          />
          {_renderRightIcon()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextInputComponent;
