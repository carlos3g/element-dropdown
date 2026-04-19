---
id: font-scaling
title: Respecting the system font scale
sidebar_position: 11
description: Control whether labels scale with the OS accessibility font-size setting.
---

# How do I control font scaling?

Pass `allowFontScaling`. The prop threads through every `Text`
and `TextInput` the component renders itself — the trigger label,
the placeholder, item labels in the default renderer, and the
built-in search input.

```tsx
<Dropdown
  allowFontScaling={false}
  data={data}
  labelField="label"
  valueField="value"
  onChange={(item) => setValue(item.value)}
/>
```

Three sensible choices:

- **Default (`undefined`)** — React Native's default, which is
  `true` on iOS and Android. Labels scale with the user's font-size
  accessibility setting.
- **`true`** — same as default, but explicit.
- **`false`** — locks labels at their declared size. Use sparingly;
  disabling font scaling hurts users who rely on larger text.

If you use `renderItem`, `renderInputSearch`, or
`renderSelectedItem`, you're responsible for font scaling in your
own text.
