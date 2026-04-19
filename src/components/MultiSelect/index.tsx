/* eslint-disable @typescript-eslint/no-shadow */
import _differenceWith from 'lodash/differenceWith';
import _get from 'lodash/get';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {
  createKeyExtractor,
  createSearchPredicate,
  defaultChevronIcon,
  DropdownSearchInput,
  DropdownSectionHeader,
  EMPTY_DATA,
  styleContainerVertical,
  useKeyboardTracking,
  useTriggerMeasurement,
} from '../../internal';
import { IMultiSelectRef, MultiSelectProps, Section } from './model';
import { styles } from './styles';

const MultiSelectComponent = React.forwardRef<
  IMultiSelectRef,
  MultiSelectProps<any>
>((props, currentRef) => {
  const {
    testID,
    itemTestIDField,
    onChange,
    data: dataProp,
    sections,
    renderSectionHeader,
    sectionHeaderStyle,
    sectionHeaderTextStyle,
    value,
    style = {},
    labelField,
    valueField,
    searchField,
    disabledField,
    selectedStyle,
    selectedTextStyle,
    itemContainerStyle,
    itemTextStyle,
    activeItemTextStyle,
    iconStyle,
    selectedTextProps = {},
    activeColor = '#F6F7F8',
    containerStyle,
    fontFamily,
    placeholderStyle,
    iconColor = 'gray',
    inputSearchStyle,
    searchPlaceholder,
    searchPlaceholderTextColor = 'gray',
    placeholder = 'Select item',
    search = false,
    searchKeyboardType,
    searchInputProps,
    persistSearch = false,
    maxHeight = 340,
    minHeight = 0,
    maxSelect,
    disable = false,
    keyboardAvoiding = true,
    inside = false,
    inverted = true,
    renderItem,
    renderLeftIcon,
    renderRightIcon,
    renderSelectedItem,
    renderInputSearch,
    renderModalHeader,
    onFocus,
    onBlur,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto',
    flatListProps,
    alwaysRenderSelectedItem = false,
    searchQuery,
    backgroundColor,
    onChangeText,
    confirmSelectItem,
    confirmUnSelectItem,
    onConfirmSelectItem,
    accessibilityLabel,
    itemAccessibilityLabelField,
    visibleSelectedItem = true,
    mode = 'default',
    closeModalWhenSelectedItem = false,
    excludeItems = [],
    excludeSearchItems = [],
    hideSelectedFromList = false,
    selectedToTop = false,
    onEndReached,
    onEndReachedThreshold = 0.5,
    hitSlop,
    allowFontScaling,
    isInsideModal = false,
  } = props;

  // `sections` takes precedence over `data`; flatten for shared
  // logic (currentValue lookup, selection toggles, etc.) and keep
  // the sectioned view only for the render path.
  const usingSections = sections !== undefined && sections !== null;
  const data = useMemo(
    () =>
      usingSections
        ? sections!.flatMap((s) => s.data)
        : ((dataProp ?? EMPTY_DATA) as any[]),
    [usingSections, sections, dataProp]
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>(data);
  const [listSections, setListSections] = useState<Section<any>[]>(
    sections ?? []
  );
  const [searchText, setSearchText] = useState('');

  const {
    ref,
    position,
    measure: _measure,
    windowWidth: W,
    windowHeight: H,
    orientation,
  } = useTriggerMeasurement(mode, isInsideModal, visible);

  const styleHorizontal: ViewStyle = useMemo(() => {
    return {
      width: orientation === 'LANDSCAPE' ? W / 2 : '100%',
      alignSelf: 'center',
    };
  }, [W, orientation]);

  useImperativeHandle(currentRef, () => {
    return { open: eventOpen, close: eventClose };
  });

  useEffect(() => {
    return eventClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const excludeData = useCallback(
    (data: any[]) => {
      let result = data || [];
      if (excludeItems.length > 0) {
        result =
          _differenceWith(
            result,
            excludeItems,
            (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField)
          ) || [];
      }
      if (hideSelectedFromList && currentValue.length > 0) {
        result = result.filter(
          (item) => !currentValue.includes(_get(item, valueField))
        );
      }
      if (selectedToTop && currentValue.length > 0 && !hideSelectedFromList) {
        const selected: any[] = [];
        const rest: any[] = [];
        for (const item of result) {
          if (currentValue.includes(_get(item, valueField))) {
            selected.push(item);
          } else {
            rest.push(item);
          }
        }
        result = [...selected, ...rest];
      }
      return result;
    },
    [
      excludeItems,
      valueField,
      hideSelectedFromList,
      selectedToTop,
      currentValue,
    ]
  );

  // Apply the same filter / reorder pass to each section, then drop
  // any section that ends up empty so the list doesn't render a
  // stray header with no rows beneath it.
  const excludeSections = useCallback(
    (input: Section<any>[]) => {
      return input
        .map((s) => ({ ...s, data: excludeData(s.data) }))
        .filter((s) => s.data.length > 0);
    },
    [excludeData]
  );

  useEffect(() => {
    if (searchText.length === 0) {
      if (usingSections) {
        setListSections(excludeSections(sections ?? []));
      } else if (data) {
        const filterData = excludeData(data);
        setListData([...filterData]);
      }
    }

    if (searchText) {
      onSearch(searchText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sections, searchText]);

  const eventOpen = () => {
    if (!disable) {
      _measure();
      setVisible(true);
      if (onFocus) {
        onFocus();
      }

      if (searchText.length > 0) {
        onSearch(searchText);
      }
    }
  };

  const eventClose = useCallback(() => {
    if (!disable) {
      setVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  }, [disable, onBlur]);

  const fontStyle = useMemo(
    () => (fontFamily ? { fontFamily } : undefined),
    [fontFamily]
  );

  const getValue = useCallback(() => {
    setCurrentValue(value ? [...value] : []);
  }, [value]);

  // Re-measure whenever the keyboard shows or hides so the list
  // re-positions itself above the keyboard.
  const keyboardHeight = useKeyboardTracking(_measure);

  useEffect(() => {
    getValue();
  }, [getValue, value]);

  const showOrClose = useCallback(() => {
    if (!disable) {
      const visibleStatus = !visible;

      if (keyboardHeight > 0 && !visibleStatus) {
        return Keyboard.dismiss();
      }

      if (!visibleStatus && !persistSearch) {
        if (onChangeText) {
          onChangeText('');
        }
        setSearchText('');
      }

      _measure();
      setVisible(visibleStatus);

      if (usingSections) {
        setListSections(excludeSections(sections ?? []));
      } else if (data) {
        const filterData = excludeData(data);
        setListData(filterData);
      }

      if (visibleStatus) {
        if (onFocus) {
          onFocus();
        }
      } else {
        if (onBlur) {
          onBlur();
        }
      }

      if (searchText.length > 0 && (visibleStatus || persistSearch)) {
        onSearch(searchText);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disable,
    keyboardHeight,
    visible,
    _measure,
    data,
    sections,
    usingSections,
    excludeSections,
    searchText,
    onFocus,
    onBlur,
    onChangeText,
    persistSearch,
  ]);

  const onSearch = useCallback(
    (text: string) => {
      if (text.length === 0) {
        if (usingSections) {
          setListSections(excludeSections(sections ?? []));
        } else {
          setListData(excludeData(data));
        }
        return;
      }

      const predicate = createSearchPredicate<any>({
        text,
        searchField,
        labelField,
        searchQuery,
      });

      const applyExcludes = (items: any[]) => {
        if (excludeSearchItems.length === 0 && excludeItems.length === 0) {
          return items;
        }
        const excluded =
          _differenceWith(
            items,
            excludeSearchItems,
            (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField)
          ) || [];
        return excludeData(excluded);
      };

      if (usingSections) {
        const filtered = (sections ?? [])
          .map((s) => ({
            ...s,
            data: applyExcludes(s.data.filter(predicate)),
          }))
          .filter((s) => s.data.length > 0);
        setListSections(filtered);
      } else {
        setListData(applyExcludes(data.filter(predicate)));
      }
    },
    [
      data,
      sections,
      usingSections,
      searchQuery,
      excludeSearchItems,
      excludeItems,
      searchField,
      labelField,
      valueField,
      excludeData,
      excludeSections,
    ]
  );

  const onSelect = useCallback(
    (item: any) => {
      const newCurrentValue = [...currentValue];
      const index = newCurrentValue.findIndex(
        (e) => e === _get(item, valueField)
      );
      if (index > -1) {
        newCurrentValue.splice(index, 1);
      } else {
        if (maxSelect) {
          if (newCurrentValue.length < maxSelect) {
            newCurrentValue.push(_get(item, valueField));
          }
        } else {
          newCurrentValue.push(_get(item, valueField));
        }
      }

      if (onConfirmSelectItem) {
        if (index > -1) {
          if (confirmUnSelectItem) {
            onConfirmSelectItem(newCurrentValue);
          } else {
            onChange(newCurrentValue);
          }
        } else {
          if (confirmSelectItem) {
            onConfirmSelectItem(newCurrentValue);
          } else {
            onChange(newCurrentValue);
          }
        }
      } else {
        onChange(newCurrentValue);
      }

      if (closeModalWhenSelectedItem) {
        if (!persistSearch) {
          if (onChangeText) {
            onChangeText('');
          }
          setSearchText('');
          onSearch('');
        }
        eventClose();
      }
    },
    [
      closeModalWhenSelectedItem,
      confirmSelectItem,
      confirmUnSelectItem,
      currentValue,
      eventClose,
      maxSelect,
      onChange,
      onChangeText,
      onConfirmSelectItem,
      onSearch,
      persistSearch,
      valueField,
    ]
  );

  const _renderDropdown = () => {
    return (
      <TouchableWithoutFeedback
        testID={testID}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: visible, disabled: disable }}
        hitSlop={hitSlop}
        onPress={showOrClose}
      >
        <View style={styles.dropdown}>
          {renderLeftIcon?.(visible)}
          <Text
            allowFontScaling={allowFontScaling}
            style={StyleSheet.flatten([
              styles.textItem,
              value && value.length > 0 ? selectedTextStyle : placeholderStyle,
              fontStyle,
            ])}
            {...selectedTextProps}
          >
            {placeholder}
          </Text>
          {renderRightIcon ? (
            renderRightIcon(visible)
          ) : (
            <Image
              source={defaultChevronIcon}
              style={StyleSheet.flatten([
                styles.icon,
                { tintColor: iconColor },
                iconStyle,
              ])}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const checkSelected = useCallback(
    (item: any) => currentValue.includes(_get(item, valueField)),
    [currentValue, valueField]
  );

  const _renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const selected = checkSelected(item);
      const itemDisabled = disabledField ? !!_get(item, disabledField) : false;
      return (
        <TouchableHighlight
          key={index.toString()}
          testID={_get(item, itemTestIDField || labelField)}
          accessible={!!accessibilityLabel}
          accessibilityLabel={_get(
            item,
            itemAccessibilityLabelField || labelField
          )}
          accessibilityState={{ selected, disabled: itemDisabled }}
          disabled={itemDisabled}
          underlayColor={activeColor}
          onPress={() => !itemDisabled && onSelect(item)}
        >
          <View
            style={StyleSheet.flatten([
              styles.item,
              itemContainerStyle,
              selected && {
                backgroundColor: activeColor,
                ...styles.wrapItem,
              },
              itemDisabled && { opacity: 0.4 },
            ])}
          >
            {renderItem ? (
              renderItem(item, selected)
            ) : (
              <Text
                allowFontScaling={allowFontScaling}
                style={StyleSheet.flatten([
                  styles.textItem,
                  itemTextStyle,
                  selected && activeItemTextStyle,
                  fontStyle,
                ])}
              >
                {_get(item, labelField)}
              </Text>
            )}
          </View>
        </TouchableHighlight>
      );
    },
    [
      accessibilityLabel,
      activeColor,
      activeItemTextStyle,
      allowFontScaling,
      checkSelected,
      disabledField,
      fontStyle,
      itemAccessibilityLabelField,
      itemContainerStyle,
      itemTestIDField,
      itemTextStyle,
      labelField,
      onSelect,
      renderItem,
    ]
  );

  const onSearchTextChange = useCallback(
    (text: string) => {
      setSearchText(text);
      if (onChangeText) onChangeText(text);
      onSearch(text);
    },
    [onChangeText, onSearch]
  );

  const renderSearch = useCallback(
    () => (
      <DropdownSearchInput
        search={search}
        renderInputSearch={renderInputSearch}
        value={searchText}
        onChangeText={onSearchTextChange}
        wrapperStyle={[styles.input, inputSearchStyle]}
        textInputStyle={[inputSearchStyle, fontStyle]}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        allowFontScaling={allowFontScaling}
        placeholder={searchPlaceholder}
        placeholderTextColor={searchPlaceholderTextColor}
        keyboardType={searchKeyboardType}
        searchInputProps={searchInputProps}
        iconColor={iconColor}
        iconStyle={iconStyle}
      />
    ),
    [
      accessibilityLabel,
      allowFontScaling,
      fontStyle,
      iconColor,
      iconStyle,
      inputSearchStyle,
      onSearchTextChange,
      renderInputSearch,
      search,
      searchInputProps,
      searchKeyboardType,
      searchPlaceholder,
      searchPlaceholderTextColor,
      searchText,
      testID,
    ]
  );

  const _renderSectionHeader = useCallback(
    ({ section }: { section: any }) => (
      <DropdownSectionHeader
        section={section}
        renderSectionHeader={renderSectionHeader}
        sectionHeaderStyle={sectionHeaderStyle}
        sectionHeaderTextStyle={sectionHeaderTextStyle}
        fontStyle={fontStyle}
        allowFontScaling={allowFontScaling}
      />
    ),
    [
      renderSectionHeader,
      sectionHeaderStyle,
      sectionHeaderTextStyle,
      fontStyle,
      allowFontScaling,
    ]
  );

  const keyExtractor = useMemo(
    () => createKeyExtractor(valueField),
    [valueField]
  );

  const _renderList = useCallback(
    (isTopPosition: boolean) => {
      const isInverted = !inverted ? false : isTopPosition;

      const _renderListHelper = () => {
        if (usingSections) {
          return (
            <SectionList
              testID={testID + ' sectionlist'}
              accessibilityLabel={accessibilityLabel + ' sectionlist'}
              keyboardShouldPersistTaps="handled"
              sections={listSections}
              renderItem={({ item }) => _renderItem({ item, index: 0 }) as any}
              renderSectionHeader={_renderSectionHeader}
              keyExtractor={keyExtractor}
              stickySectionHeadersEnabled
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              onEndReached={onEndReached}
              onEndReachedThreshold={onEndReachedThreshold}
            />
          );
        }
        return (
          <FlatList
            testID={testID + ' flatlist'}
            accessibilityLabel={accessibilityLabel + ' flatlist'}
            {...flatListProps}
            keyboardShouldPersistTaps="handled"
            data={listData}
            inverted={isTopPosition ? inverted : false}
            renderItem={_renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
          />
        );
      };

      return (
        <View style={styles.flexShrink}>
          {renderModalHeader?.(eventClose)}
          {isInverted && _renderListHelper()}
          {renderSearch()}
          {!isInverted && _renderListHelper()}
        </View>
      );
    },
    [
      _renderItem,
      _renderSectionHeader,
      accessibilityLabel,
      eventClose,
      flatListProps,
      keyExtractor,
      listData,
      listSections,
      inverted,
      onEndReached,
      onEndReachedThreshold,
      renderModalHeader,
      renderSearch,
      showsVerticalScrollIndicator,
      testID,
      usingSections,
    ]
  );

  const _renderModal = useCallback(() => {
    if (visible && position) {
      const { isFull, width, height, top, bottom, left } = position;

      const onAutoPosition = () => {
        if (keyboardHeight > 0) {
          return bottom < keyboardHeight + height;
        }

        // Trigger in bottom half opens upward (upstream #264).
        const minSlack = search ? 150 : 100;
        return bottom < Math.max(minSlack, H / 2);
      };

      if (width && top && bottom) {
        const styleVertical: ViewStyle = {
          left: left,
          maxHeight: maxHeight,
          minHeight: minHeight,
        };
        const isTopPosition =
          dropdownPosition === 'auto'
            ? onAutoPosition()
            : dropdownPosition === 'top';

        let extendHeight = !isTopPosition ? top : bottom;
        if (
          keyboardAvoiding &&
          keyboardHeight > 0 &&
          isTopPosition &&
          dropdownPosition === 'auto'
        ) {
          extendHeight = keyboardHeight;
        }

        return (
          <Modal
            transparent
            statusBarTranslucent
            visible={visible}
            supportedOrientations={['landscape', 'portrait']}
            onRequestClose={showOrClose}
          >
            <TouchableWithoutFeedback accessible={false} onPress={showOrClose}>
              <View
                style={StyleSheet.flatten([
                  styles.flex1,
                  isFull && styleContainerVertical,
                  backgroundColor && { backgroundColor: backgroundColor },
                ])}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.flex1,
                    !isTopPosition
                      ? { paddingTop: extendHeight }
                      : {
                          justifyContent: 'flex-end',
                          paddingBottom: extendHeight,
                        },
                    isFull && styles.fullScreen,
                  ])}
                >
                  <View
                    style={StyleSheet.flatten([
                      styles.container,
                      isFull ? styleHorizontal : styleVertical,
                      {
                        width,
                      },
                      containerStyle,
                    ])}
                  >
                    {_renderList(isTopPosition)}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        );
      }
      return null;
    }
    return null;
  }, [
    visible,
    search,
    position,
    keyboardHeight,
    maxHeight,
    minHeight,
    dropdownPosition,
    keyboardAvoiding,
    showOrClose,
    backgroundColor,
    containerStyle,
    styleHorizontal,
    _renderList,
    H,
  ]);

  const unSelect = (item: any) => {
    if (!disable) {
      onSelect(item);
    }
  };

  const _renderItemSelected = (inside: boolean) => {
    // Only render chips for items whose valueField is in the current
    // selection. The previous implementation returned `e` (truthy)
    // instead of a boolean and didn't guard against `value === undefined`,
    // which caused every item to render as a chip when nothing was
    // selected.
    const list = value
      ? data.filter((e: any) => value.includes(_get(e, valueField)))
      : [];

    return (
      <View
        style={StyleSheet.flatten([
          styles.rowSelectedItem,
          inside && styles.flex1,
        ])}
      >
        {list.map((e) => {
          if (renderSelectedItem) {
            return (
              <TouchableWithoutFeedback
                testID={_get(e, itemTestIDField || labelField)}
                accessible={!!accessibilityLabel}
                accessibilityLabel={_get(
                  e,
                  itemAccessibilityLabelField || labelField
                )}
                key={_get(e, labelField)}
                onPress={() => unSelect(e)}
              >
                {renderSelectedItem(e, () => {
                  unSelect(e);
                })}
              </TouchableWithoutFeedback>
            );
          } else {
            return (
              <TouchableWithoutFeedback
                testID={_get(e, itemTestIDField || labelField)}
                accessible={!!accessibilityLabel}
                accessibilityLabel={_get(
                  e,
                  itemAccessibilityLabelField || labelField
                )}
                key={_get(e, labelField)}
                onPress={() => unSelect(e)}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.selectedItem,
                    selectedStyle,
                  ])}
                >
                  <Text
                    style={StyleSheet.flatten([
                      styles.selectedTextLeftItem,
                      selectedTextStyle,
                      fontStyle,
                    ])}
                  >
                    {_get(e, labelField)}
                  </Text>
                  <Text
                    style={StyleSheet.flatten([
                      styles.selectedTextItem,
                      selectedTextStyle,
                    ])}
                  >
                    ⓧ
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }
        })}
      </View>
    );
  };

  const _renderInside = () => {
    return (
      <View
        style={StyleSheet.flatten([styles.mainWrap, style])}
        ref={ref}
        onLayout={_measure}
      >
        {_renderDropdownInside()}
        {_renderModal()}
      </View>
    );
  };

  const _renderDropdownInside = () => {
    const hasSelection = !!(value && value.length > 0);
    return (
      <TouchableWithoutFeedback
        testID={testID}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: visible, disabled: disable }}
        hitSlop={hitSlop}
        onPress={showOrClose}
      >
        <View style={styles.dropdownInside}>
          {renderLeftIcon?.(visible)}
          {hasSelection ? (
            _renderItemSelected(true)
          ) : (
            <Text
              allowFontScaling={allowFontScaling}
              style={StyleSheet.flatten([
                styles.textItem,
                placeholderStyle,
                fontStyle,
              ])}
              {...selectedTextProps}
            >
              {placeholder}
            </Text>
          )}
          {renderRightIcon ? (
            renderRightIcon(visible)
          ) : (
            <Image
              source={defaultChevronIcon}
              style={StyleSheet.flatten([
                styles.icon,
                { tintColor: iconColor },
                iconStyle,
              ])}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (inside) {
    return _renderInside();
  }

  return (
    <>
      <View
        style={StyleSheet.flatten([styles.mainWrap, style])}
        ref={ref}
        onLayout={_measure}
      >
        {_renderDropdown()}
        {_renderModal()}
      </View>
      {(!visible || alwaysRenderSelectedItem) &&
        visibleSelectedItem &&
        _renderItemSelected(false)}
    </>
  );
});

export default MultiSelectComponent;
