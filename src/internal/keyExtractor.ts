import _get from 'lodash/get';

/**
 * FlatList/SectionList `keyExtractor` that uses the item's `valueField`
 * when present and falls back to the index. Previously inlined in both
 * Dropdown and MultiSelect — identical code.
 */
export function createKeyExtractor(valueField: string | number | symbol) {
  return (item: unknown, index: number) => {
    const key = _get(item, valueField as any);
    return key != null ? String(key) : index.toString();
  };
}
