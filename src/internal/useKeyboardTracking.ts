import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

/**
 * Subscribe to `keyboardDidShow` / `keyboardDidHide` and invoke a
 * caller-supplied `onChange` whenever either fires. Tracks the current
 * keyboard height so consumers can use it directly in layout math.
 *
 * Both Dropdown and MultiSelect re-measured the trigger every time the
 * keyboard moved; callers pass their `_measure` function in as
 * `onChange`.
 *
 * @param onChange Fired on every show / hide with the new keyboard
 *   height (0 on hide). Kept as a reference — consumers should wrap
 *   their handler in `useCallback` so the listeners aren't re-registered
 *   on every render.
 * @returns the current keyboard height in dp.
 */
export function useKeyboardTracking(
  onChange?: (height: number) => void
): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      onChange?.(e.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
      onChange?.(0);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      if (typeof showSub?.remove === 'function') showSub.remove();
      if (typeof hideSub?.remove === 'function') hideSub.remove();
    };
    // onChange is intentionally omitted — we only want to register
    // listeners once, and consumers should pass a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyboardHeight;
}
