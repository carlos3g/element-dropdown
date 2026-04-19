/* eslint-disable @typescript-eslint/no-shadow */
import _assign from 'lodash/assign';
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
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { useDetectDevice } from '../../toolkits';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import CInput from '../TextInput';
import { DropdownProps, IDropdownRef, Section } from './model';
import { styles } from './styles';

const { isTablet } = useDetectDevice;
const ic_down = require('../../assets/down.png');

const statusBarHeight: number = StatusBar.currentHeight || 0;

// Stable empty array used when neither `data` nor `sections` is
// provided. Inlining `= []` in destructure creates a fresh
// reference on every render, which cascades into useMemo
// recomputation and infinite useEffect loops through getValue /
// excludeData.
const EMPTY_DATA: any[] = [];

const DropdownComponent = React.forwardRef<IDropdownRef, DropdownProps<any>>(
  (props, currentRef) => {
    const orientation = useDeviceOrientation();
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
          : (dataProp ?? EMPTY_DATA),
      [usingSections, sections, dataProp]
    );

    const ref = useRef<View>(null);
    const refList = useRef<FlatList>(null);
    const refSectionList = useRef<SectionList>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<any>(null);
    const [listData, setListData] = useState<any[]>(data);
    const [listSections, setListSections] = useState<Section<any>[]>(
      sections ?? []
    );
    const [position, setPosition] = useState<any>();
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [searchText, setSearchText] = useState('');

    const { width: W, height: H } = Dimensions.get('window');
    const styleContainerVertical: ViewStyle = useMemo(() => {
      return {
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
      };
    }, []);
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

    // Drop the cached measurement whenever the dropdown closes, so the next
    // open waits for a fresh `measureInWindow` before mounting the Modal.
    // Without this, reopening paints one frame at the previous position
    // (upstream #198, #330, #298).
    useEffect(() => {
      if (!visible) {
        setPosition(undefined);
      }
    }, [visible]);

    const font = useCallback(() => {
      if (fontFamily) {
        return {
          fontFamily: fontFamily,
        };
      } else {
        return {};
      }
    }, [fontFamily]);

    const _measure = useCallback(() => {
      if (ref && ref?.current) {
        ref.current.measureInWindow((pageX, pageY, width, height) => {
          let isFull = isTablet
            ? false
            : mode === 'modal' || orientation === 'LANDSCAPE';

          if (mode === 'auto') {
            isFull = false;
          }

          const top = isFull ? 20 : height + pageY + 2;
          const bottom = H - top + height;
          const left = I18nManager.isRTL ? W - width - pageX : pageX;

          // When nested inside an RN Modal, measureInWindow already
          // reports coordinates relative to the Modal's own root, so
          // adding the status-bar offset a second time pushes the list
          // down by ~24–44 px. See upstream #362.
          const statusOffset = isInsideModal ? 0 : statusBarHeight;

          setPosition({
            isFull,
            width: Math.floor(width),
            top: Math.floor(top + statusOffset),
            bottom: Math.floor(bottom - statusOffset),
            left: Math.floor(left),
            height: Math.floor(height),
          });
        });
      }
    }, [H, W, orientation, mode, isInsideModal]);

    const onKeyboardDidShow = useCallback(
      (e: KeyboardEvent) => {
        _measure();
        setKeyboardHeight(e.endCoordinates.height);
      },
      [_measure]
    );

    const onKeyboardDidHide = useCallback(() => {
      setKeyboardHeight(0);
      _measure();
    }, [_measure]);

    useEffect(() => {
      const susbcriptionKeyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        onKeyboardDidShow
      );
      const susbcriptionKeyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        onKeyboardDidHide
      );

      return () => {
        if (typeof susbcriptionKeyboardDidShow?.remove === 'function') {
          susbcriptionKeyboardDidShow.remove();
        }

        if (typeof susbcriptionKeyboardDidHide?.remove === 'function') {
          susbcriptionKeyboardDidHide.remove();
        }
      };
    }, [onKeyboardDidHide, onKeyboardDidShow]);

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
        if (text.length > 0) {
          const normalize = (raw: unknown) =>
            String(raw ?? '')
              .toLowerCase()
              .replace(/\s/g, '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

          const fields: any[] = Array.isArray(searchField)
            ? searchField
            : [searchField || labelField];

          const key = normalize(text);

          const defaultFilterFunction = (e: any) =>
            fields.some((field) => normalize(_get(e, field)).indexOf(key) >= 0);

          const propSearchFunction = (e: any) => {
            const primary =
              (Array.isArray(searchField) ? searchField[0] : searchField) ||
              labelField;
            const labelText = _get(e, primary as any);

            return searchQuery?.(text, labelText);
          };

          const predicate = searchQuery
            ? propSearchFunction
            : defaultFilterFunction;

          const applyExcludes = (items: any[]) => {
            if (excludeSearchItems.length > 0 || excludeItems.length > 0) {
              const excluded =
                _differenceWith(
                  items,
                  excludeSearchItems,
                  (obj1, obj2) =>
                    _get(obj1, valueField) === _get(obj2, valueField)
                ) || [];
              return excludeData(excluded);
            }
            return items;
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
            const dataSearch = data.filter(predicate);
            setListData(applyExcludes(dataSearch));
          }
        } else {
          if (usingSections) {
            setListSections(excludeSections(sections ?? []));
          } else {
            const filterData = excludeData(data);
            setListData(filterData);
          }
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
                  font(),
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
                  source={ic_down}
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
        _assign(item, { _index: index });
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
                    font(),
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
        font,
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

    const renderSearch = useCallback(() => {
      if (search) {
        if (renderInputSearch) {
          return renderInputSearch((text) => {
            if (onChangeText) {
              setSearchText(text);
              onChangeText(text);
            }
            onSearch(text);
          });
        } else {
          return (
            <CInput
              autoCorrect={false}
              {...searchInputProps}
              testID={testID + ' input'}
              accessibilityLabel={accessibilityLabel + ' input'}
              allowFontScaling={allowFontScaling}
              style={[styles.input, inputSearchStyle]}
              inputStyle={[inputSearchStyle, font()]}
              value={searchText}
              keyboardType={searchKeyboardType}
              placeholder={searchPlaceholder}
              onChangeText={(e) => {
                if (onChangeText) {
                  setSearchText(e);
                  onChangeText(e);
                }
                onSearch(e);
              }}
              placeholderTextColor={searchPlaceholderTextColor}
              showIcon
              iconStyle={[{ tintColor: iconColor }, iconStyle]}
            />
          );
        }
      }
      return null;
    }, [
      accessibilityLabel,
      allowFontScaling,
      font,
      iconColor,
      iconStyle,
      inputSearchStyle,
      onChangeText,
      onSearch,
      renderInputSearch,
      search,
      searchInputProps,
      searchKeyboardType,
      searchPlaceholder,
      searchPlaceholderTextColor,
      testID,
      searchText,
    ]);

    const _renderSectionHeader = useCallback(
      ({ section }: { section: any }) => {
        const s = section as Section<any>;
        if (renderSectionHeader) {
          return renderSectionHeader(s);
        }
        return (
          <View style={[styles.sectionHeader, sectionHeaderStyle]}>
            <Text
              allowFontScaling={allowFontScaling}
              style={[styles.sectionHeaderText, sectionHeaderTextStyle, font()]}
            >
              {s.title}
            </Text>
          </View>
        );
      },
      [
        renderSectionHeader,
        sectionHeaderStyle,
        sectionHeaderTextStyle,
        allowFontScaling,
        font,
      ]
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
                keyExtractor={(item, index) => {
                  const key = _get(item, valueField);
                  return key != null ? String(key) : index.toString();
                }}
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
              keyExtractor={(item, index) => {
                const key = _get(item, valueField);
                return key != null ? String(key) : index.toString();
              }}
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
        valueField,
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

          let keyboardStyle: ViewStyle = {};

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
                    keyboardStyle,
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
      styleContainerVertical,
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
