import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, I18nManager, View } from 'react-native';

import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice } from '../toolkits';
import { statusBarHeight } from './constants';

const { isTablet } = useDetectDevice;

/**
 * Shape produced by `measureInWindow` plus the derived values the
 * dropdown modal layout needs (top-vs-bottom extents, full-screen
 * flag).
 */
export interface TriggerPosition {
  /** True when the dropdown renders as a full-screen modal (landscape / `mode="modal"`). */
  isFull: boolean;
  width: number;
  /** Y of the top of the open list relative to the screen. */
  top: number;
  /** Y of the bottom of the open list relative to the screen. */
  bottom: number;
  left: number;
  /** Measured height of the trigger itself. */
  height: number;
}

/**
 * Encapsulates the trigger-measurement dance both Dropdown and
 * MultiSelect perform identically:
 *
 * - Maintains the `View` ref attached to the trigger.
 * - Re-measures via `measureInWindow` on demand (open, keyboard,
 *   layout).
 * - Caches the measurement; drops it on close so reopening waits for
 *   a fresh measurement before mounting the Modal (upstream #198,
 *   #330, #298).
 * - Applies the `isInsideModal` statusBar offset adjustment
 *   (upstream #362).
 * - Handles tablet / landscape / `mode="auto"` full-screen rules.
 *
 * @param mode - The current `mode` prop.
 * @param isInsideModal - Whether the dropdown is rendered inside an
 *   RN `<Modal>`.
 * @param visible - Whether the list is currently open. When this flips
 *   to `false`, the cached position is dropped.
 */
export function useTriggerMeasurement(
  mode: 'default' | 'modal' | 'auto',
  isInsideModal: boolean,
  visible: boolean
) {
  const orientation = useDeviceOrientation();
  const { width: W, height: H } = Dimensions.get('window');
  const ref = useRef<View>(null);
  const [position, setPosition] = useState<TriggerPosition | undefined>();

  const measure = useCallback(() => {
    if (!ref.current) return;
    ref.current.measureInWindow((pageX, pageY, width, height) => {
      let isFull = isTablet
        ? false
        : mode === 'modal' || orientation === 'LANDSCAPE';
      if (mode === 'auto') isFull = false;

      const top = isFull ? 20 : height + pageY + 2;
      const bottom = H - top + height;
      const left = I18nManager.isRTL ? W - width - pageX : pageX;

      // When nested inside an RN Modal, `measureInWindow` reports
      // coordinates relative to that Modal's own root, so adding
      // `statusBarHeight` a second time double-counts it and pushes
      // the list down by ~24–44 px.
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
  }, [H, W, orientation, mode, isInsideModal]);

  useEffect(() => {
    if (!visible) setPosition(undefined);
  }, [visible]);

  return {
    /** Ref to attach to the trigger's outer `<View>`. */
    ref,
    /** Last measurement (undefined before the first measure or after close). */
    position,
    /** Re-measure the trigger; the callback returned is stable across renders with the same `mode`/`isInsideModal`/orientation. */
    measure,
    /** Current window width in dp. */
    windowWidth: W,
    /** Current window height in dp. */
    windowHeight: H,
    /** `'PORTRAIT' | 'LANDSCAPE'`. */
    orientation,
  };
}
