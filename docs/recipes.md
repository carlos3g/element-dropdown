# Recipes

Common questions with answers that already work today. If your use case
isn't covered here and you think it should be, open an issue on
[`carlos3g/element-dropdown`](https://github.com/carlos3g/element-dropdown/issues).

## Open and close from outside

The imperative ref exposes `open()` and `close()`:

```tsx
import { useRef } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';
import type { IDropdownRef } from '@carlos3g/element-dropdown';

const ref = useRef<IDropdownRef>(null);

<Button title="Pick" onPress={() => ref.current?.open()} />
<Dropdown ref={ref} data={data} labelField="label" valueField="value" onChange={...} />
```

Useful for: opening from a bottom-tab press, closing on navigation
events, deep links, or programmatic flows.

## Searching with a custom field

By default the search matches against the label. To search a different
field, set `searchField`:

```tsx
<Dropdown
  data={users}
  labelField="name"
  valueField="id"
  searchField="email"
  search
  onChange={...}
/>
```

For fully custom matching (accents, locale, multi-field), use
`searchQuery`:

```tsx
<Dropdown
  searchQuery={(keyword, labelValue) =>
    labelValue.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
  }
  {...}
/>
```

## Different icons for open vs closed state

Both `renderLeftIcon` and `renderRightIcon` receive the current
visibility:

```tsx
<Dropdown
  renderRightIcon={(visible) => (
    <Icon name={visible ? 'chevron-up' : 'chevron-down'} />
  )}
  {...}
/>
```

## Change the highlight color of the active row

`activeColor` sets the background color for the currently-selected
item in the list:

```tsx
<Dropdown activeColor="#e6f0ff" {...} />
```

To also change the text style of the active row, use `renderItem`:

```tsx
<Dropdown
  renderItem={(item, selected) => (
    <View style={[styles.row, selected && styles.rowActive]}>
      <Text style={[styles.label, selected && styles.labelActive]}>
        {item.label}
      </Text>
    </View>
  )}
  {...}
/>
```

## Empty state (no search results)

Use `flatListProps.ListEmptyComponent`:

```tsx
<Dropdown
  search
  flatListProps={{
    ListEmptyComponent: () => (
      <View style={{ padding: 16 }}>
        <Text>No matches</Text>
      </View>
    ),
  }}
  {...}
/>
```

## Disable individual items

Mark items with a truthy value at a shared field, then point
`disabledField` at that field:

```tsx
const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', locked: true },
  { label: 'Cherry', value: 'cherry' },
];

<Dropdown data={data} disabledField="locked" labelField="label" valueField="value" onChange={...} />
```

Disabled items render at reduced opacity, can't be pressed, and are
announced as `disabled` to screen readers.

## Nest a Dropdown inside a React Native Modal

React Native's `measureInWindow` reports coordinates relative to the
outermost Modal rather than the screen. Set `isInsideModal` so the
component doesn't double-count the status bar offset:

```tsx
<Modal visible={visible}>
  <Dropdown isInsideModal data={data} {...} />
</Modal>
```

## Show a chip row of selections inside the trigger (MultiSelect)

Set `inside={true}` to render the selected chips inline in the trigger
instead of below it:

```tsx
<MultiSelect inside value={selectedIds} data={data} {...} />
```

## Make the tap target bigger without enlarging the trigger

Use `hitSlop`:

```tsx
<Dropdown hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }} {...} />
```

## Respect (or override) the system font scale

Pass `allowFontScaling` to control whether labels scale with the OS
accessibility font setting. The prop threads through the trigger
label, item labels, and the built-in search input.

```tsx
<Dropdown allowFontScaling={false} {...} />
```

## Customize the cursor/selection color on the search input

`@carlos3g/element-dropdown` passes unknown props straight to the
underlying `TextInput`, so RN's standard props work:

```tsx
<Dropdown
  search
  selectionColor="#0088ff"
  cursorColor="#0088ff"
  {...}
/>
```

## Catch when the user clears the search

`onChangeText` fires whenever the search text changes, including the
"X" clear button and when the list closes:

```tsx
<Dropdown
  search
  onChangeText={(text) => {
    if (text === '') {
      // user cleared or the dropdown closed
    }
  }}
  {...}
/>
```

## Work around a "ref.current is null" on the very first press

`eventOpen` / `eventClose` resolve after the first render, so if you
try to open the component before it has mounted (e.g. from a parent's
initial render) the call is a no-op. Open from a user gesture or a
`useEffect` that runs after mount:

```tsx
useEffect(() => {
  // safe here — component is mounted
  ref.current?.open();
}, []);
```

## Exclude items from the visible list or from search results

`excludeItems` hides specific items from the list entirely.
`excludeSearchItems` keeps them visible but excludes them from search
matches:

```tsx
<Dropdown
  data={all}
  excludeItems={archived}
  excludeSearchItems={featured}
  {...}
/>
```
