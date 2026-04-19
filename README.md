[<img src="https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-element-dropdown-demo.png">](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-element-dropdown-demo.png)

# `react-native-element-dropdown`, maintained.

📚 **[Full documentation →](https://carlos3g.github.io/element-dropdown/)**

A drop-in fork of [`react-native-element-dropdown`](https://github.com/hoaphantn7604/react-native-element-dropdown). Bugs get fixed, the toolchain stays current, and every release is signed. Same API, same components (`Dropdown`, `MultiSelect`, `SelectCountry`), same props — change two lines and keep shipping.

```sh
npm install @carlos3g/element-dropdown
```

```diff
- import { Dropdown } from 'react-native-element-dropdown';
+ import { Dropdown } from '@carlos3g/element-dropdown';
```

## Why this fork

The original package is unmaintained — a large open issue backlog, plus clean community PRs sitting untouched for years. If you're already on `react-native-element-dropdown`, you've probably hit at least one of these:

- `Invariant Violation: scrollToIndex out of range` when searching long lists
- The list flashes at the wrong position for a frame when you reopen it
- `IDropdownRef` / `IMultiSelectRef` missing when you build for web or Expo
- Every item has a non-overridable `padding: 17` — `itemContainerStyle` can't shrink it
- MultiSelect trigger uses `placeholderStyle` even after you've selected something

Fixed — along with plenty more. See the roadmap in [`docs/upstream-triage.md`](docs/upstream-triage.md) and per-version detail in the [release notes](https://github.com/carlos3g/element-dropdown/releases).

## What you get

- **Dropdown + MultiSelect + SelectCountry** — three components, one package, same feel on iOS and Android
- **Drop-in migration** — public API unchanged from `react-native-element-dropdown@2.12.x`, `peerDependencies: *`
- **Active maintenance** — upstream bugs get triaged and fixed in every release; see the changelog for the current set
- **Better defaults** — per-item disable via `disabledField`, `hitSlop` for bigger tap targets, `allowFontScaling`, `isInsideModal` for nested Modal positioning
- **Proper accessibility** — trigger announces as `combobox`, items expose selected/disabled state
- **A real test suite** — integration tests cover the core interaction flows
- **Signed releases** — published via npm Trusted Publishing, with provenance attestation on every version

## Quick example

```tsx
import { useState } from 'react';
import { Dropdown } from '@carlos3g/element-dropdown';

const data = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

export function FruitPicker() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Pick a fruit"
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}
```

For the full API (Dropdown, MultiSelect, SelectCountry), migration guide, and 13 hands-on recipes, see **[the docs](https://carlos3g.github.io/element-dropdown/)**.

## Demo

[<img src="https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-element-dropdown-thumbnal.jpg">](https://youtu.be/FhTDR_Ad_14)

<br />

![](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-drpdown.gif)
![](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/react-native-multiselect.gif)

## Contributing

See the upstream triage at [`docs/upstream-triage.md`](docs/upstream-triage.md) for the current roadmap and the prioritized list of upstream issues and PRs worth porting. Issues and pull requests are the interface — please include a repro when filing.

## License

MIT — see [LICENSE](LICENSE). This is a fork; the original copyright is preserved in contributor metadata.
