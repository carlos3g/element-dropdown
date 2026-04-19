// Aggregated re-export. Consumers inside this package import from
// `../internal` to pick up shared hooks, components, and constants.
// Not re-exported from `src/index.tsx` — this surface is private.

export {
  defaultChevronIcon,
  EMPTY_DATA,
  hairlineWidth,
  statusBarHeight,
  styleContainerVertical,
} from './constants';
export { createKeyExtractor } from './keyExtractor';
export { createSearchPredicate, normalize } from './search';
export { useKeyboardTracking } from './useKeyboardTracking';
export { useReducedMotion } from './useReducedMotion';
export {
  useTriggerMeasurement,
  type TriggerPosition,
} from './useTriggerMeasurement';
export { DropdownSearchInput } from './DropdownSearchInput';
export { DropdownSectionHeader } from './DropdownSectionHeader';
