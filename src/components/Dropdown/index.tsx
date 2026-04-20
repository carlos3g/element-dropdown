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
  useDebouncedCallback,
  useKeyboardTracking,
  useReducedMotion,
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
      searchDebounce,
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
      renderSearchClearIcon,
      renderModalHeader,
      onFocus,
      onBlur,
      autoScroll = true,
      showsVerticalScrollIndicator = true,
      dropdownPosition = 'auto',
      flatListProps,
      renderEmpty,
      searchQuery,
      backgroundColor,
      modalAnimationType,
      onChangeText,
      confirmSelectItem,
      onConfirmSelectItem,
      accessibilityLabel,
      accessibilityHint,
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

    // Keep the imperative handle stable across renders: `open`/`close`
    // are pinned to a ref that tracks the latest closure-captured
    // versions of `eventOpen` / `eventClose`. Without this, the
    // default `useImperativeHandle(ref, factory)` runs on every render
    // and replaces `ref.current` with a brand-new object, which
    // invalidates any effect downstream that depends on ref identity.
    const imperativeRef = useRef({
      open: () => {},
      close: () => {},
    });
    useImperativeHandle(
      currentRef,
      () => ({
        open: () => imperativeRef.current.open(),
        close: () => imperativeRef.current.close(),
      }),
      []
    );

    useEffect(() => {
      const handle = imperativeRef.current;
      return () => handle.close();
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

    // Pin the latest open/close onto the stable imperative ref.
    // Assigning during render is safe here because the ref is private
    // — nothing reads it until the user calls `ref.current.open()`.
    imperativeRef.current.open = eventOpen;
    imperativeRef.current.close = eventClose;

    const fontStyle = useMemo(
      () => (fontFamily ? { fontFamily } : undefined),
      [fontFamily]
    );

    // Re-measure whenever the keyboard shows or hides so the list
    // re-positions itself above the keyboard.
    const keyboardHeight = useKeyboardTracking(_measure);

    // Honour the user's "reduce motion" OS preference — disable the
    // Modal slide / fade when they've asked for less motion.
    const reducedMotion = useReducedMotion();

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

    // Scroll to the selected row *after* the list has mounted, rather
    // than via FlatList's `initialScrollIndex`. That prop virtualizes
    // items before the target index out of the initial render window,
    // which for datasets whose total content fits in the viewport
    // leaves rows 0..(target-1) permanently unmounted with nowhere to
    // scroll. Post-mount `scrollToIndex` lets FlatList render the
    // normal window first and then move the viewport. The existing
    // `onScrollToIndexFailed` path retries when the target is still
    // outside the mounted window on the first frame.
    useEffect(() => {
      if (!visible || autoScrollTarget < 0) return;
      const raf = requestAnimationFrame(() => {
        try {
          refList.current?.scrollToIndex({
            index: autoScrollTarget,
            animated: false,
          });
        } catch {
          // Swallow — onScrollToIndexFailed handles the retry.
        }
      });
      return () => cancelAnimationFrame(raf);
    }, [visible, autoScrollTarget]);

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
      const hasSelection = currentValue != null;
      return (
        <TouchableWithoutFeedback
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
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
                  hasSelection ? selectedTextStyle : placeholderStyle,
                  fontStyle,
                ]}
                {...selectedTextProps}
              >
                {hasSelection ? _get(currentValue, labelField) : placeholder}
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
        // `selected` must only be true when SOMETHING is selected AND
        // the current item matches it. Previously
        //   const isSelected = currentValue && _get(currentValue, valueField);
        //   const selected = _isEqual(_get(item, valueField), isSelected);
        // treated no-selection-at-all as `isSelected === null`, then
        // marked any item whose valueField happened to equal null as
        // selected — a subtle falsy-match bug.
        const selected =
          currentValue != null &&
          _isEqual(_get(item, valueField), _get(currentValue, valueField));
        const itemDisabled = disabledField
          ? !!_get(item, disabledField)
          : false;
        return (
          <TouchableHighlight
            key={index.toString()}
            testID={_get(item, itemTestIDField || labelField)}
            accessibilityLabel={_get(
              item,
              itemAccessibilityLabelField || labelField
            )}
            accessibilityRole="button"
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
                renderItem(item, selected, index)
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

    // The filter (onSearch) runs at most once every `searchDebounce`
    // ms if set; the text-state update and `onChangeText` fire
    // synchronously so the input stays responsive.
    const runSearch = useDebouncedCallback(onSearch, searchDebounce);
    const onSearchTextChange = useCallback(
      (text: string) => {
        setSearchText(text);
        if (onChangeText) onChangeText(text);
        runSearch(text);
      },
      [onChangeText, runSearch]
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
          clearIcon={renderSearchClearIcon?.() ?? null}
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
        renderSearchClearIcon,
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

    // Stable wrapper so SectionList doesn't see a fresh renderItem
    // identity every render (which would force every row to re-render
    // even when nothing about the item changed).
    const renderSectionItem = useCallback(
      ({ item, index }: { item: any; index: number }) =>
        _renderItem({ item, index }) as any,
      [_renderItem]
    );

    const _renderList = useCallback(
      (isTopPosition: boolean) => {
        const isInverted = !inverted ? false : isTopPosition;

        // Calling renderEmpty eagerly here is cheap — React only mounts
        // the returned element when the list is actually empty, so the
        // result is discarded on every non-empty render.
        const emptyElement = renderEmpty ? renderEmpty(searchText) : null;

        const _renderListHelper = () => {
          if (usingSections) {
            return (
              <SectionList
                testID={testID + ' sectionlist'}
                accessibilityLabel={accessibilityLabel + ' sectionlist'}
                keyboardShouldPersistTaps="handled"
                sections={listSections}
                // `inverted` on SectionList would flip section-header
                // order too, which is confusing — keep the natural
                // reading order even when opening upward.
                renderItem={renderSectionItem}
                renderSectionHeader={_renderSectionHeader}
                keyExtractor={keyExtractor}
                stickySectionHeadersEnabled
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
                ListEmptyComponent={emptyElement}
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
              // NOTE: we deliberately don't pass `initialScrollIndex`
              // here. FlatList treats it as "skip mounting items
              // before this index until the user scrolls toward
              // them" — which, for a small dataset whose total
              // content fits in the viewport, leaves items
              // 0..(target-1) permanently unmounted with nowhere to
              // scroll. Instead we scroll in an effect once the list
              // is mounted (see `autoScrollTarget` effect above).
              onScrollToIndexFailed={onScrollToIndexFailed}
              data={listData}
              inverted={isTopPosition ? inverted : false}
              renderItem={_renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              onEndReached={onEndReached}
              onEndReachedThreshold={onEndReachedThreshold}
              ListEmptyComponent={emptyElement}
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
        renderSectionItem,
        listSections,
        inverted,
        onEndReached,
        onEndReachedThreshold,
        onScrollToIndexFailed,
        renderEmpty,
        renderModalHeader,
        renderSearch,
        searchText,
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
              animationType={reducedMotion ? 'none' : modalAnimationType}
              visible={visible}
              supportedOrientations={['landscape', 'portrait']}
              onRequestClose={showOrClose}
            >
              <TouchableWithoutFeedback
                accessible={false}
                onPress={showOrClose}
              >
                <View
                  // Scope VoiceOver to the modal while it's open — stops
                  // focus escaping to whatever renders behind us on iOS
                  // (and Android equivalents treat this as a no-op).
                  accessibilityViewIsModal
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
      modalAnimationType,
      reducedMotion,
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

// Preserve the `<T>` generic across the public type boundary.
// `React.forwardRef<Ref, Props>` can only accept a single concrete
// props type, so the inner implementation stays pinned to
// `DropdownProps<any>` for runtime. We re-introduce the generic here
// with a cast so that `<Dropdown data={users} ... />` infers
// `onChange(item: User)` and `renderItem(item: User, ...)` from the
// `data` prop's element type — instead of the `any` the raw
// forwardRef signature would surface. The cast is safe because the
// runtime behaviour doesn't depend on `T`: all field access goes
// through `labelField` / `valueField`, which are already typed as
// `keyof T` in the model.
export default DropdownComponent as <T>(
  props: DropdownProps<T>
) => React.ReactElement | null;
