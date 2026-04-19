import { StatusBar, StyleSheet, ViewStyle } from 'react-native';

/**
 * StatusBar height on Android (undefined on iOS). Read once at module
 * load — not reactive; if a consumer changes orientation, RN reports
 * the new bar height through a different API and we pick it up via
 * `useDeviceOrientation`'s re-render path.
 */
export const statusBarHeight: number = StatusBar.currentHeight ?? 0;

/**
 * Stable empty array. Inlining `= []` in destructure creates a fresh
 * reference on every render, which cascades into useMemo recomputation
 * and infinite useEffect loops through the internal `getValue` /
 * `excludeData` chain. Share a single reference across the library so
 * the guard is consistent.
 */
export const EMPTY_DATA: readonly unknown[] = [];

/**
 * Backdrop style applied to the full-screen overlay when the dropdown
 * is in `mode="modal"` or landscape-on-phone mode. Shared between
 * Dropdown and MultiSelect — behaviour is identical.
 */
export const styleContainerVertical: ViewStyle = {
  backgroundColor: 'rgba(0,0,0,0.1)',
  alignItems: 'center',
};

/**
 * Default chevron icon shipped with the library. The `require` is
 * done once at module load so the metro hash is stable across
 * renders and both components share the same asset instance.
 */
export const defaultChevronIcon = require('../assets/down.png');

/**
 * Hairline width chosen up-front for section-header dividers — saves
 * re-evaluating StyleSheet.hairlineWidth in per-component styles.
 */
export const hairlineWidth = StyleSheet.hairlineWidth;
