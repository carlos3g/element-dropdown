/* eslint-disable @typescript-eslint/no-shadow */
import _assign from 'lodash/assign';
import _differenceWith from 'lodash/differenceWith';
import _get from 'lodash/get';
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
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useDetectDevice } from '../../toolkits';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import CInput from '../TextInput';
import { IMultiSelectRef, MultiSelectProps, Section } from './model';
import { styles } from './styles';

const { isTablet } = useDetectDevice;
const ic_down = require('../../assets/down.png');
const statusBarHeight: number = StatusBar.currentHeight || 0;

// Stable empty array used when neither `data` nor `sections` is
// provided. See Dropdown/index.tsx for the same guard + reason.
const EMPTY_DATA: any[] = [];

const MultiSelectComponent = React.forwardRef<
  IMultiSelectRef,
  MultiSelectProps<any>
>((props, currentRef) => {
  const orientation = useDeviceOrientation();
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
        : (dataProp ?? EMPTY_DATA),
    [usingSections, sections, dataProp]
  );

  const ref = useRef<View>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>(data);
  const [listSections, setListSections] = useState<Section<any>[]>(
    sections ?? []
  );
  const [, setKey] = useState<number>(Math.random());
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

  const font = useCallback(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily,
      };
    } else {
      return {};
    }
  }, [fontFamily]);

  const getValue = useCallback(() => {
    setCurrentValue(value ? [...value] : []);
  }, [value]);

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

        // When nested inside an RN Modal, measureInWindow already reports
        // coordinates relative to the Modal root, so the status-bar offset
        // ends up double-counted. See upstream #362.
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

  // Drop the cached measurement on close so reopening waits for a fresh
  // measurement before mounting the Modal (upstream #198, #330, #298).
  useEffect(() => {
    if (!visible) {
      setPosition(undefined);
    }
  }, [visible]);

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

      setKey(Math.random());

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
              font(),
            ])}
            {...selectedTextProps}
          >
            {placeholder}
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
      </TouchableWithoutFeedback>
    );
  };

  const checkSelected = useCallback(
    (item: any) => {
      const index = currentValue.findIndex((e) => e === _get(item, valueField));
      return index > -1;
    },
    [currentValue, valueField]
  );

  const _renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const selected = checkSelected(item);
      const itemDisabled = disabledField ? !!_get(item, disabledField) : false;
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
      checkSelected,
      disabledField,
      font,
      itemAccessibilityLabelField,
      itemContainerStyle,
      itemTestIDField,
      itemTextStyle,
      labelField,
      onSelect,
      renderItem,
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
            showIcon
            placeholderTextColor={searchPlaceholderTextColor}
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
    searchText,
    testID,
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
              sections={listSections}
              renderItem={({ item }) => _renderItem({ item, index: 0 }) as any}
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
      eventClose,
      flatListProps,
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
            <TouchableWithoutFeedback accessible={false} onPress={showOrClose}>
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

  const unSelect = (item: any) => {
    if (!disable) {
      onSelect(item);
    }
  };

  const _renderItemSelected = (inside: boolean) => {
    const list = data.filter((e: any) => {
      const check = value?.indexOf(_get(e, valueField));
      if (check !== -1) {
        return e;
      }
    });

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
                      font(),
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
    return (
      <TouchableWithoutFeedback
        testID={testID}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: visible, disabled: disable }}
        onPress={showOrClose}
      >
        <View style={styles.dropdownInside}>
          {renderLeftIcon?.(visible)}
          {value && value?.length > 0 ? (
            _renderItemSelected(true)
          ) : (
            <Text
              style={StyleSheet.flatten([
                styles.textItem,
                placeholderStyle,
                font(),
              ])}
            >
              {placeholder}
            </Text>
          )}
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
