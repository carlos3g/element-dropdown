import { act, renderHook } from '@testing-library/react-native';
import { Dimensions, ScaledSize } from 'react-native';

import { useDeviceOrientation } from '../useDeviceOrientation';

type DimensionsChangeListener = (event: { screen: ScaledSize }) => void;

const makeScreen = (width: number, height: number): ScaledSize => ({
  width,
  height,
  scale: 1,
  fontScale: 1,
});

describe('useDeviceOrientation', () => {
  const originalGet = Dimensions.get;
  const originalAddEventListener = Dimensions.addEventListener;

  let listener: DimensionsChangeListener | undefined;
  let remove: jest.Mock;

  beforeEach(() => {
    listener = undefined;
    remove = jest.fn();

    Dimensions.get = jest.fn(
      () => makeScreen(375, 812) // portrait
    ) as typeof Dimensions.get;

    Dimensions.addEventListener = jest.fn((_event, cb) => {
      listener = cb as DimensionsChangeListener;
      return { remove } as unknown as ReturnType<
        typeof Dimensions.addEventListener
      >;
    }) as unknown as typeof Dimensions.addEventListener;
  });

  afterEach(() => {
    Dimensions.get = originalGet;
    Dimensions.addEventListener = originalAddEventListener;
  });

  it('returns PORTRAIT when height >= width', () => {
    const { result } = renderHook(() => useDeviceOrientation());

    expect(result.current).toBe('PORTRAIT');
  });

  it('returns LANDSCAPE when width > height', () => {
    Dimensions.get = jest.fn(() =>
      makeScreen(812, 375)
    ) as typeof Dimensions.get;

    const { result } = renderHook(() => useDeviceOrientation());

    expect(result.current).toBe('LANDSCAPE');
  });

  it('updates when Dimensions emit a change event', () => {
    const { result } = renderHook(() => useDeviceOrientation());

    expect(result.current).toBe('PORTRAIT');

    act(() => {
      listener?.({ screen: makeScreen(812, 375) });
    });

    expect(result.current).toBe('LANDSCAPE');
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useDeviceOrientation());

    unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });
});
