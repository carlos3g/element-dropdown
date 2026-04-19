/* eslint-disable @typescript-eslint/no-shadow */
import _differenceWith from 'lodash/differenceWith';
import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
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
import { DropdownProps, IDropdownRef, Section } from './model';
import { styles } from './styles';

const DropdownComponent = React.forwardRef<IDropdownRef, DropdownProps<any>>(
  (props, currentRef) => {
    const {
      testID,
      itemTestIDField,
      onChange,
      style = {},
      containerStyle,
      placeholderStyle,
      selectedTextStyle,
      itemContainerStyle,
      itemTextStyle,
      activeItemTextStyle,
      inputSearchStyle,
      iconStyle,
      selectedTextProps = {},
      data: dataProp,
      sections,
      renderSectionHeader,
      sectionHeaderStyle,
      sectionHeaderTextStyle,
      labelField,
      valueField,
      searchField,
      disabledField,
      value,
      activeColor = '#F6F7F8',
      fontFamily,
      iconColor = 'gray',
      searchPlaceholder,
      searchPlaceholderTextColor = 'gray',
      placeholder = 'Select item',
      search = false,
      searchKeyboardType,
      searchInputProps,
      persistSearch = false,
      maxHeight = 340,
      minHeight = 0,
      disable = false,
      keyboardAvoiding = true,
      inverted = true,
      renderLeftIcon,
      renderRightIcon,
      renderSelectedItem,
      renderItem,
      renderInputSearch,
      renderModalHeader,
      onFocus,
      onBlur,
      autoScroll = true,
      showsVerticalScrollIndicator = true,
      dropdownPosition = 'auto',
      flatListProps,
      searchQuery,
      backgroundColor,
      onChangeText,
      confirmSelectItem,
      onConfirmSelectItem,
      accessibilityLabel,
      itemAccessibilityLabelField,
      mode = 'default',
      closeModalWhenSelectedItem = true,
      excludeItems = [],
      excludeSearchItems = [],
      hideSelectedFromList = false,
      onEndReached,
      onEndReachedThreshold = 0.5,
      hitSlop,
      allowFontScaling,
      isInsideModal = false,
    } = props;

    // When `sections` is provided it takes precedence over `data` —
    // we flatten it to keep the rest of the component (currentValue
    // lookup, autoScroll, excludeData, etc.) working unchanged over
    // a plain array. The sectioned view is derived only at render
    // time via `listSections`.
    const usingSections = sections !== undefined && sections !== null;
    const data = useMemo(
      () =>
        usingSections
          ? sections!.flatMap((s) => s.data)
          : ((dataProp ?? EMPTY_DATA) as any[]),
      [usingSections, sections, dataProp]
    );

    const [visible, setVisible] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<any>(null);
    const [listData, setListData] = useState<any[]>(data);
    const [listSections, setListSections] = useState<Section<any>[]>(
      sections ?? []
    );
    const [searchText, setSearchText] = useState('');

    const refList = useRef<FlatList>(null);
    const refSectionList = useRef<SectionList>(null);

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
        if (hideSelectedFromList && currentValue) {
          const selectedKey = _get(currentValue, valueField);
          if (selectedKey != null) {
            result = result.filter(
              (item) => _get(item, valueField) !== selectedKey
            );
          }
        }
        return result;
      },
      [excludeItems, valueField, hideSelectedFromList, currentValue]
    );

    // Apply excludeItems / hideSelectedFromList to each section,
    // drop sections that end up empty (keeps the list from rendering
    // a lone "Empty" header when every row is filtered out).
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

    // Re-measure whenever the keyboard shows or hides so the list
    // re-positions itself above the keyboard.
    const keyboardHeight = useKeyboardTracking(_measure);

    const getValue = useCallback(() => {
      const defaultValue =
        typeof value === 'object' ? _get(value, valueField) : value;

      const getItem = data.filter((e) =>
        _isEqual(defaultValue, _get(e, valueField))
      );

      if (getItem.length > 0) {
        setCurrentValue(getItem[0]);
      } else {
        setCurrentValue(null);
      }
    }, [data, value, valueField]);

    useEffect(() => {
      getValue();
    }, [value, data, getValue]);

    const autoScrollTarget = useMemo(() => {
      if (!autoScroll) return -1;
      // Only auto-scroll when the list isn't filtered; otherwise the target
      // index would be computed against the full dataset but applied to the
      // filtered list, which is the source of scrollToIndex-out-of-range
      // crashes (upstream #156, #202, #274, #275) and the snap-back during
      // browsing (upstream #345).
      if (!data?.length || listData?.length !== data.length) return -1;

      const defaultValue =
        typeof value === 'object' ? _get(value, valueField) : value;
      const index = _findIndex(listData, (e) =>
        _isEqual(defaultValue, _get(e, valueField))
      );
      return index >= 0 && index < listData.length ? index : -1;
    }, [autoScroll, data?.length, listData, value, valueField]);

    const onScrollToIndexFailed = useCallback(
      ({ index }: { index: number }) => {
        // FlatList couldn't fulfil initialScrollIndex because the row hadn't
        // been laid out yet. Retry on the next tick — by then the estimated
        // offset is populated and scrollToIndex succeeds.
        if (!refList.current || index < 0) return;
        requestAnimationFrame(() => {
          try {
            refList.current?.scrollToIndex({ index, animated: false });
          } catch {
            // Swallow: the list may have shrunk again between the failure
            // callback and this retry. The correct index will be picked up
            // on the next open.
          }
        });
      },
      []
    );

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
          onSearch('');
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

        if (searchText.length > 0) {
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
      persistSearch,
    ]);

    const onSearch = useCallback(
      (text: string) => {
        if (text.length === 0) {
          // Empty query — reset to the unfiltered, exclude-aware view.
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
        if (confirmSelectItem && onConfirmSelectItem) {
          return onConfirmSelectItem(item);
        }

        setCurrentValue(item);
        onChange(item);

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
        confirmSelectItem,
        eventClose,
        onChange,
        onChangeText,
        onConfirmSelectItem,
        onSearch,
        closeModalWhenSelectedItem,
        persistSearch,
      ]
    );

    const _renderDropdown = () => {
      const isSelected = currentValue && _get(currentValue, valueField);
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
          {renderSelectedItem ? (
            renderSelectedItem(visible)
          ) : (
            <View style={styles.dropdown}>
              {renderLeftIcon?.(visible)}
              <Text
                allowFontScaling={allowFontScaling}
                style={[
                  styles.textItem,
                  isSelected !== null ? selectedTextStyle : placeholderStyle,
                  fontStyle,
                ]}
                {...selectedTextProps}
              >
                {isSelected !== null
                  ? _get(currentValue, labelField)
                  : placeholder}
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
          )}
        </TouchableWithoutFeedback>
      );
    };

    const _renderItem = useCallback(
      ({ item, index }: { item: any; index: number }) => {
        const isSelected = currentValue && _get(currentValue, valueField);
        const selected = _isEqual(_get(item, valueField), isSelected);
        const itemDisabled = disabledField
          ? !!_get(item, disabledField)
          : false;
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
        currentValue,
        disabledField,
        fontStyle,
        itemAccessibilityLabelField,
        itemContainerStyle,
        itemTestIDField,
        itemTextStyle,
        labelField,
        onSelect,
        renderItem,
        valueField,
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
                ref={refSectionList}
                sections={listSections}
                // `inverted` on SectionList would flip section-header
                // order too, which is confusing — keep the natural
                // reading order even when opening upward.
                renderItem={({ item }) =>
                  _renderItem({ item, index: 0 }) as any
                }
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
              ref={refList}
              initialScrollIndex={
                autoScrollTarget >= 0 ? autoScrollTarget : undefined
              }
              onScrollToIndexFailed={onScrollToIndexFailed}
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
        autoScrollTarget,
        eventClose,
        flatListProps,
        keyExtractor,
        listData,
        listSections,
        inverted,
        onEndReached,
        onEndReachedThreshold,
        onScrollToIndexFailed,
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

          // When the trigger sits in the bottom half of the screen, prefer
          // opening upwards so the list has room to breathe (upstream #264).
          // The minimum slack stays at 150 (search) / 100 (no search) for
          // small lists near the threshold.
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
              <TouchableWithoutFeedback
                accessible={false}
                onPress={showOrClose}
              >
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

    return (
      <View
        style={StyleSheet.flatten([styles.mainWrap, style])}
        ref={ref}
        onLayout={_measure}
      >
        {_renderDropdown()}
        {_renderModal()}
      </View>
    );
  }
);

export default DropdownComponent;
