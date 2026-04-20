---
id: animations
title: Animations
sidebar_position: 20
description: Animate Dropdown and MultiSelect with Reanimated, Moti, or RN's built-in LayoutAnimation — zero peer dependencies on the library side, you choose the animation stack.
keywords:
  - react native dropdown animation
  - react native multiselect animation
  - reanimated dropdown
  - moti dropdown
  - stagger animation
---

# How do I animate Dropdown and MultiSelect?

**`@carlos3g/element-dropdown` deliberately ships no animation peer
dependencies.** Animation is your app's concern, not the library's —
we just expose render callbacks you can wrap in whatever your stack
already uses: `react-native-reanimated`, `moti`, RN's built-in
`Animated`, RN's built-in `LayoutAnimation`, or something else.

This guide collects the common recipes. Every snippet works without
any change to the library itself — the callbacks are there today.

## Rotate the chevron on open

`renderRightIcon(visible)` receives the current open/closed state.
Drive any rotation hook off it.

```tsx
// With Reanimated v3
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Dropdown } from '@carlos3g/element-dropdown';

function AnimatedChevron({ visible }: { visible?: boolean }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(visible ? '180deg' : '0deg') }],
  }));
  return (
    <Animated.Text style={[{ fontSize: 16 }, style]}>▾</Animated.Text>
  );
}

<Dropdown
  data={data}
  labelField="label"
  valueField="value"
  onChange={onChange}
  renderRightIcon={(visible) => <AnimatedChevron visible={visible} />}
/>
```

## Stagger row enter animations

`renderItem` is called with `(item, selected, index)`. Use the
index to offset each row's entering animation.

```tsx
// With Moti
import { MotiView } from 'moti';
import { Dropdown } from '@carlos3g/element-dropdown';

<Dropdown
  data={data}
  labelField="label"
  valueField="value"
  onChange={onChange}
  renderItem={(item, selected, index = 0) => (
    <MotiView
      from={{ opacity: 0, translateY: -8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 40 }}
      style={{ padding: 16 }}
    >
      <Text style={{ fontWeight: selected ? '600' : '400' }}>
        {item.label}
      </Text>
    </MotiView>
  )}
/>
```

The same pattern with Reanimated's `FadeIn.delay(index * 40)`:

```tsx
import Animated, { FadeIn } from 'react-native-reanimated';

renderItem={(item, _selected, index = 0) => (
  <Animated.View
    entering={FadeIn.delay(index * 40)}
    style={{ padding: 16 }}
  >
    <Text>{item.label}</Text>
  </Animated.View>
)}
```

## Animate chip add / remove (MultiSelect)

`renderSelectedItem` wraps each chip in the chip row. Return an
animated container and let Reanimated's layout animation handle
enter/exit.

```tsx
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { MultiSelect } from '@carlos3g/element-dropdown';

<MultiSelect
  data={data}
  labelField="label"
  valueField="value"
  value={value}
  onChange={setValue}
  renderSelectedItem={(item, unSelect) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#EEF2FF',
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Text>{item.label}</Text>
      <Text onPress={() => unSelect?.(item)} style={{ marginLeft: 8 }}>
        ×
      </Text>
    </Animated.View>
  )}
/>
```

## Zero-dependency option: RN `LayoutAnimation`

React Native ships `LayoutAnimation` — a native-driven animation of
the next layout pass. It's free, requires no peer dep, and works
well for chip rows and list filters that don't need per-row
orchestration.

On Android you must opt in once at startup:

```ts
import { Platform, UIManager } from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
```

Then call `LayoutAnimation.configureNext(...)` right before the
state change you want animated:

```tsx
import { LayoutAnimation } from 'react-native';
import { MultiSelect } from '@carlos3g/element-dropdown';

<MultiSelect
  data={data}
  labelField="label"
  valueField="value"
  value={value}
  onChange={(next) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setValue(next);
  }}
/>
```

The next render's layout changes (chip added or removed, list
reflow) animate natively. Good tradeoff when you don't already have
Reanimated in the tree.

## Open / close the modal itself

Use [`modalAnimationType`](../components/dropdown#container-and-layout) —
forwarded to the underlying React Native `<Modal>`. The library
also honors the OS "Reduce Motion" setting and forces `'none'`
regardless of the prop. See the [Accessibility](../accessibility)
page for the full story.

```tsx
<Dropdown
  // ...
  modalAnimationType="fade"
/>
```

If you need a fully custom modal backdrop (e.g. animated blur),
that's intentionally **not** exposed — replacing the `<Modal>`
wholesale has too many edge cases (accessibility scope, Android
back-button handling, reduce-motion plumbing). If you have a
concrete use case, open an issue.

## What the library will never do

- **Ship an animation peer dependency.** Your app picks the stack.
- **Bake animations into defaults.** Opting in via a callback is
  the only path — no surprise motion when you upgrade.
- **Expose `Animated.Value` / shared values.** Those are
  stack-specific; the render callbacks give you strings and
  booleans, and your animation code owns the hooks.
