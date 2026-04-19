import _get from 'lodash/get';

/**
 * Lowercase, strip whitespace, and remove diacritics so the default
 * matcher is accent-insensitive and whitespace-agnostic.
 *
 * Pure function, defined once at module load — used to be redeclared
 * inside every keystroke handler.
 */
export function normalize(raw: unknown): string {
  return String(raw ?? '')
    .toLowerCase()
    .replace(/\s/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Build the search predicate used by the default matcher or by a
 * user-supplied `searchQuery`. Closes over `searchField`, `labelField`,
 * and `searchQuery` so the caller just asks "does this item match?".
 *
 * `searchField` may be a single key, an array of keys, or omitted —
 * the matcher falls back to `labelField` when nothing else is set.
 */
export function createSearchPredicate<T>({
  text,
  searchField,
  labelField,
  searchQuery,
}: {
  text: string;
  searchField: keyof T | (keyof T)[] | undefined;
  labelField: keyof T;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
}): (item: T) => boolean {
  if (searchQuery) {
    const primary =
      (Array.isArray(searchField) ? searchField[0] : searchField) || labelField;
    return (item) => {
      const labelText = _get(item, primary as any);
      return !!searchQuery(text, labelText);
    };
  }

  const fields: any[] = Array.isArray(searchField)
    ? searchField
    : [searchField || labelField];
  const key = normalize(text);
  return (item) =>
    fields.some((field) => normalize(_get(item, field)).indexOf(key) >= 0);
}
