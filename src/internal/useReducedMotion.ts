import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Track the system's "reduce motion" accessibility preference.
 * Used to disable the Modal slide/fade animation when the user has
 * asked the OS to minimise motion.
 *
 * Returns `false` until the initial async fetch resolves (iOS + Android
 * both expose the setting via `AccessibilityInfo`), then updates on
 * every OS-level preference change.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Guard the probe — RN mocks can replace `isReduceMotionEnabled`
    // with a jest.fn() that returns `undefined` instead of a Promise.
    const probe = AccessibilityInfo.isReduceMotionEnabled?.();
    if (probe && typeof probe.then === 'function') {
      probe
        .then((enabled) => {
          if (!cancelled) setReduced(!!enabled);
        })
        .catch(() => {
          // Platform doesn't support the probe — leave `reduced=false`.
        });
    }

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => setReduced(!!enabled)
    );

    return () => {
      cancelled = true;
      if (typeof sub?.remove === 'function') sub.remove();
    };
  }, []);

  return reduced;
}
