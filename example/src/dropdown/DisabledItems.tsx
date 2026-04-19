import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

// Mark individual items as non-interactive by pointing `disabledField` at
// a field on each item. Disabled items render dimmed, skip onChange, and
// expose accessibilityState.disabled to screen readers.

type Plan = {
  label: string;
  value: string;
  locked?: boolean;
  reason?: string;
};

const data: Plan[] = [
  { label: 'Free', value: 'free' },
  { label: 'Starter — $9/mo', value: 'starter' },
  {
    label: 'Team — $29/mo (contact sales)',
    value: 'team',
    locked: true,
    reason: 'Requires a sales call',
  },
  { label: 'Pro — $49/mo', value: 'pro' },
  {
    label: 'Enterprise (talk to us)',
    value: 'enterprise',
    locked: true,
    reason: 'Custom pricing only',
  },
];

export default function DisabledItems() {
  const [value, setValue] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pick a plan</Text>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        disabledField="locked"
        placeholder="Choose a plan"
        value={value}
        onChange={(item) => {
          setValue(item.value);
          setLastAttempt(null);
        }}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selected}
      />
      <Text style={styles.caption}>
        Items marked as locked render at reduced opacity and can't be
        selected. Try tapping them — nothing fires.
      </Text>
      {lastAttempt ? (
        <Text style={styles.warning}>Last blocked: {lastAttempt}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdown: {
    height: 50,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  selected: {
    color: '#0f172a',
    fontSize: 14,
  },
  caption: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  warning: {
    color: '#b91c1c',
    fontSize: 13,
  },
});
