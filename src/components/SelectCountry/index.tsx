import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import Dropdown from '../Dropdown';
import type { IDropdownRef } from '../Dropdown/model';
import { ISelectCountryRef, SelectCountryProps } from './model';
import { styles } from './styles';

const SelectCountryComponent = React.forwardRef<
  ISelectCountryRef,
  SelectCountryProps<any>
>((props, currentRef) => {
  const {
    data,
    value,
    valueField,
    labelField,
    imageField,
    selectedTextStyle,
    imageStyle,
    selectedImageStyle,
  } = props;
  const ref = useRef<IDropdownRef>(null);

  useImperativeHandle(currentRef, () => {
    return { open: eventOpen, close: eventClose };
  });

  const eventOpen = () => {
    ref.current?.open();
  };

  const eventClose = () => {
    ref.current?.close();
  };

  const _renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Image source={item[imageField]} style={[styles.image, imageStyle]} />
        <Text style={[styles.selectedTextStyle, selectedTextStyle]}>
          {item[labelField]}
        </Text>
      </View>
    );
  };

  const selectItem: any = useMemo(() => {
    if (!data) return undefined;
    const index = data.findIndex((e: any) => e[valueField] === value);
    return data[index];
  }, [data, valueField, value]);

  return (
    <Dropdown
      ref={ref}
      {...props}
      renderItem={_renderItem}
      renderLeftIcon={() => {
        // The previous implementation read `selectItem.image` directly,
        // which silently broke whenever `imageField` was anything other
        // than "image". Honor the user's field choice.
        const source = selectItem && selectItem[imageField];
        if (source) {
          return (
            <Image
              source={source}
              style={[styles.image, imageStyle, selectedImageStyle]}
            />
          );
        }
        return null;
      }}
    />
  );
});

export default SelectCountryComponent;
