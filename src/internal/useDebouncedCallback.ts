import { useEffect, useRef } from 'react';

/**
 * Wraps a callback so repeated invocations within `delayMs` collapse
 * to the latest args, firing exactly once `delayMs` after the final
 * call. When `delayMs` is `0` / `undefined`, the callback runs
 * synchronously with no timer involved — consumers opt in via a
 * single prop.
 *
 * Uses refs so the returned invoker has stable identity for the
 * component's lifetime while still reaching the freshest callback
 * and delay values on every invocation.
 */
export function useDebouncedCallback<A extends any[]>(
  fn: (...args: A) => void,
  delayMs: number | undefined
): (...args: A) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const delayRef = useRef(delayMs);
  delayRef.current = delayMs;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const invokerRef = useRef((...args: A) => {
    const delay = delayRef.current;
    if (!delay) {
      fnRef.current(...args);
      return;
    }
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      fnRef.current(...args);
    }, delay);
  });

  return invokerRef.current;
}
