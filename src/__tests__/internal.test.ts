import {
  createKeyExtractor,
  createSearchPredicate,
  normalize,
} from '../internal';

describe('normalize', () => {
  it('lowercases', () => {
    expect(normalize('CaFÉ')).toBe('cafe');
  });

  it('strips diacritics via NFD', () => {
    expect(normalize('café')).toBe('cafe');
    expect(normalize('ãéíõû')).toBe('aeiou');
  });

  it('removes all whitespace', () => {
    expect(normalize('  a b   c\td\ne ')).toBe('abcde');
  });

  it('treats null and undefined as empty string', () => {
    expect(normalize(null)).toBe('');
    expect(normalize(undefined)).toBe('');
  });

  it('coerces numbers to strings', () => {
    expect(normalize(42)).toBe('42');
    expect(normalize(3.14)).toBe('3.14');
  });

  it('is idempotent', () => {
    const once = normalize('São Paulo');
    expect(normalize(once)).toBe(once);
  });
});

describe('createSearchPredicate — default matcher', () => {
  type User = { name: string; email: string; phone: string };
  const users: User[] = [
    { name: 'Alice', email: 'alice@example.com', phone: '123' },
    { name: 'Bruno', email: 'bruno@acme.io', phone: '456' },
    { name: 'Céline', email: 'celine@fr.tld', phone: '789' },
  ];

  it('matches against labelField when searchField is omitted', () => {
    const predicate = createSearchPredicate<User>({
      text: 'ali',
      searchField: undefined,
      labelField: 'name',
    });
    expect(users.filter(predicate).map((u) => u.name)).toEqual(['Alice']);
  });

  it('matches against a single searchField', () => {
    const predicate = createSearchPredicate<User>({
      text: 'acme',
      searchField: 'email',
      labelField: 'name',
    });
    expect(users.filter(predicate).map((u) => u.name)).toEqual(['Bruno']);
  });

  it('matches across multiple fields when searchField is an array', () => {
    const predicate = createSearchPredicate<User>({
      text: '789',
      searchField: ['name', 'email', 'phone'],
      labelField: 'name',
    });
    expect(users.filter(predicate).map((u) => u.name)).toEqual(['Céline']);
  });

  it('is accent-insensitive', () => {
    const predicate = createSearchPredicate<User>({
      text: 'celine',
      searchField: 'name',
      labelField: 'name',
    });
    expect(users.filter(predicate).map((u) => u.name)).toEqual(['Céline']);
  });

  it('is whitespace-insensitive', () => {
    const predicate = createSearchPredicate<User>({
      text: ' al i ce ',
      searchField: 'name',
      labelField: 'name',
    });
    expect(users.filter(predicate).map((u) => u.name)).toEqual(['Alice']);
  });
});

describe('createSearchPredicate — custom searchQuery', () => {
  type Item = { label: string; value: string };
  const items: Item[] = [
    { label: 'alpha', value: '1' },
    { label: 'beta', value: '2' },
  ];

  it('forwards text and the primary searchField value to the callback', () => {
    const searchQuery = jest.fn().mockReturnValue(true);
    const predicate = createSearchPredicate<Item>({
      text: 'needle',
      searchField: 'label',
      labelField: 'label',
      searchQuery,
    });
    predicate(items[0]!);
    expect(searchQuery).toHaveBeenCalledWith('needle', 'alpha');
  });

  it('uses the first entry when searchField is an array', () => {
    const searchQuery = jest.fn().mockReturnValue(true);
    const predicate = createSearchPredicate<Item>({
      text: 'needle',
      searchField: ['value', 'label'],
      labelField: 'label',
      searchQuery,
    });
    predicate(items[0]!);
    expect(searchQuery).toHaveBeenCalledWith('needle', '1');
  });

  it('falls back to labelField when searchField is undefined', () => {
    const searchQuery = jest.fn().mockReturnValue(true);
    const predicate = createSearchPredicate<Item>({
      text: 'needle',
      searchField: undefined,
      labelField: 'label',
      searchQuery,
    });
    predicate(items[0]!);
    expect(searchQuery).toHaveBeenCalledWith('needle', 'alpha');
  });

  it('coerces non-boolean returns with !!', () => {
    const predicate = createSearchPredicate<Item>({
      text: 'anything',
      searchField: 'label',
      labelField: 'label',
      searchQuery: () => 1 as any, // truthy, not boolean
    });
    expect(predicate(items[0]!)).toBe(true);

    const predicate2 = createSearchPredicate<Item>({
      text: 'anything',
      searchField: 'label',
      labelField: 'label',
      searchQuery: () => 0 as any, // falsy
    });
    expect(predicate2(items[0]!)).toBe(false);
  });
});

describe('createKeyExtractor', () => {
  it('uses the valueField when present', () => {
    const kx = createKeyExtractor('value');
    expect(kx({ value: 'abc' }, 0)).toBe('abc');
    expect(kx({ value: 42 }, 0)).toBe('42');
  });

  it('falls back to the index when valueField is missing', () => {
    const kx = createKeyExtractor('value');
    expect(kx({}, 3)).toBe('3');
    expect(kx({ other: 'x' }, 7)).toBe('7');
  });

  it('treats null as missing but keeps 0 and empty string', () => {
    const kx = createKeyExtractor('value');
    expect(kx({ value: null }, 2)).toBe('2');
    expect(kx({ value: undefined }, 5)).toBe('5');
    // 0 and '' are not null — they should survive.
    expect(kx({ value: 0 }, 1)).toBe('0');
    expect(kx({ value: '' }, 1)).toBe('');
  });

  it('supports nested paths via lodash.get', () => {
    const kx = createKeyExtractor('nested.id');
    expect(kx({ nested: { id: 'deep' } }, 0)).toBe('deep');
  });
});
