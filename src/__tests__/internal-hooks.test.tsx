import { act, renderHook } from '@testing-library/react-native';
import { Keyboard, View } from 'react-native';

import { useKeyboardTracking, useTriggerMeasurement } from '../internal';

/**
 * Capture the listener callback registered with Keyboard.addListener so
 * we can invoke it manually. RN's Keyboard.emit isn't part of the
 * public test surface across versions; spying on addListener keeps the
 * tests portable.
 */
const captureKeyboardListeners = () => {
  const listeners: Record<string, ((e: any) => void)[]> = {};
  const spy = jest
    .spyOn(Keyboard, 'addListener')
    .mockImplementation((event: any, cb: any) => {
      (listeners[event] ??= []).push(cb);
      return { remove: () => {} } as any;
    });
  return {
    fire: (event: 'keyboardDidShow' | 'keyboardDidHide', payload: any) => {
      for (const cb of listeners[event] ?? []) cb(payload);
    },
    restore: () => spy.mockRestore(),
  };
};

describe('useKeyboardTracking', () => {
  it('starts with height 0', () => {
    const k = captureKeyboardListeners();
    const { result } = renderHook(() => useKeyboardTracking());
    expect(result.current).toBe(0);
    k.restore();
  });

  it('updates the returned height on keyboardDidShow', () => {
    const k = captureKeyboardListeners();
    const { result } = renderHook(() => useKeyboardTracking());

    act(() => {
      k.fire('keyboardDidShow', { endCoordinates: { height: 280 } });
    });
    expect(result.current).toBe(280);

    act(() => {
      k.fire('keyboardDidHide', {});
    });
    expect(result.current).toBe(0);
    k.restore();
  });

  it('invokes the onChange callback with the new height on show and hide', () => {
    const k = captureKeyboardListeners();
    const onChange = jest.fn();
    renderHook(() => useKeyboardTracking(onChange));

    act(() => {
      k.fire('keyboardDidShow', { endCoordinates: { height: 260 } });
    });
    act(() => {
      k.fire('keyboardDidHide', {});
    });

    expect(onChange).toHaveBeenNthCalledWith(1, 260);
    expect(onChange).toHaveBeenNthCalledWith(2, 0);
    k.restore();
  });

  it('registers exactly one show and one hide listener across re-renders', () => {
    // The hook intentionally pins listeners once — a fresh onChange ref
    // on every render shouldn't re-register.
    const addSpy = jest.spyOn(Keyboard, 'addListener').mockReturnValue({
      remove: () => {},
    } as any);

    const { rerender, unmount } = renderHook<void, { cb: (h: number) => void }>(
      ({ cb }) => useKeyboardTracking(cb),
      {
        initialProps: { cb: jest.fn() },
      }
    );
    for (let i = 0; i < 5; i++) {
      rerender({ cb: jest.fn() });
    }
    // 2 registrations (show + hide), regardless of the extra renders.
    const showCalls = addSpy.mock.calls.filter(
      ([ev]) => ev === 'keyboardDidShow'
    );
    const hideCalls = addSpy.mock.calls.filter(
      ([ev]) => ev === 'keyboardDidHide'
    );
    expect(showCalls).toHaveLength(1);
    expect(hideCalls).toHaveLength(1);

    unmount();
    addSpy.mockRestore();
  });

  it('calls remove() on the subscriptions at unmount', () => {
    const showRemove = jest.fn();
    const hideRemove = jest.fn();
    const addSpy = jest
      .spyOn(Keyboard, 'addListener')
      .mockImplementation((event: any) => {
        return {
          remove: event === 'keyboardDidShow' ? showRemove : hideRemove,
        } as any;
      });

    const { unmount } = renderHook(() => useKeyboardTracking());
    unmount();

    expect(showRemove).toHaveBeenCalledTimes(1);
    expect(hideRemove).toHaveBeenCalledTimes(1);
    addSpy.mockRestore();
  });
});

describe('useTriggerMeasurement', () => {
  // jest.setup.js patches View.prototype.measureInWindow to call back
  // with (0, 0, 200, 48). The hook computes top/bottom/left from those.

  it('starts with undefined position and fills in window metadata', () => {
    const { result } = renderHook(() =>
      useTriggerMeasurement('default', false, false)
    );
    expect(result.current.position).toBeUndefined();
    expect(result.current.windowWidth).toBeGreaterThan(0);
    expect(result.current.windowHeight).toBeGreaterThan(0);
    expect(['PORTRAIT', 'LANDSCAPE']).toContain(result.current.orientation);
  });

  it('populates position with the measured rect when measure() is called', () => {
    const { result } = renderHook(() =>
      useTriggerMeasurement('default', false, false)
    );

    const view = new (View as any)();
    (result.current.ref as any).current = view;

    act(() => {
      result.current.measure();
    });

    const position = result.current.position!;
    // Patched measureInWindow returns (0, 0, 200, 48).
    expect(position.width).toBe(200);
    expect(position.height).toBe(48);
    expect(position.left).toBe(0);
    // top = height (48) + pageY (0) + 2 padding (+ statusBarHeight,
    // which is 0 on iOS test env).
    expect(position.top).toBeGreaterThanOrEqual(50);
  });

  it('clears position when visible flips from true to false', () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof useTriggerMeasurement>,
      { visible: boolean }
    >(({ visible }) => useTriggerMeasurement('default', false, visible), {
      initialProps: { visible: true },
    });

    const view = new (View as any)();
    (result.current.ref as any).current = view;

    act(() => {
      result.current.measure();
    });
    expect(result.current.position).toBeDefined();

    rerender({ visible: false });
    expect(result.current.position).toBeUndefined();
  });

  it('forces isFull=false when mode is "auto" even in landscape', () => {
    // `mode === 'auto'` short-circuits after the usual ternary, so
    // regardless of `isTablet` / orientation the final value is false.
    const { result } = renderHook(() =>
      useTriggerMeasurement('auto', false, true)
    );
    const view = new (View as any)();
    (result.current.ref as any).current = view;

    act(() => {
      result.current.measure();
    });

    expect(result.current.position?.isFull).toBe(false);
  });

  it('does not crash when the ref has no current node', () => {
    const { result } = renderHook(() =>
      useTriggerMeasurement('default', false, true)
    );
    expect(() => {
      act(() => {
        result.current.measure();
      });
    }).not.toThrow();
    expect(result.current.position).toBeUndefined();
  });

  it('still produces a valid top when isInsideModal skips the status-bar offset', () => {
    // On iOS test env `statusBarHeight === 0`, so the two paths yield
    // the same `top`. We still exercise the branch to make sure
    // `isInsideModal=true` doesn't blow up.
    const { result } = renderHook(() =>
      useTriggerMeasurement('default', true, true)
    );
    const view = new (View as any)();
    (result.current.ref as any).current = view;

    act(() => {
      result.current.measure();
    });

    expect(result.current.position?.top).toBeDefined();
    expect(result.current.position?.bottom).toBeDefined();
  });
});
