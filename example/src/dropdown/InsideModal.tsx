import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';

// Inside an RN <Modal>, measureInWindow reports coordinates relative to
// the Modal's root. Without `isInsideModal`, the status-bar offset is
// double-counted and the list opens below the trigger by ~24–44 px on
// Android. Toggle the prop below to see the difference.

const data = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
  { label: 'Option E', value: 'e' },
];

export default function InsideModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [useInsideModal, setUseInsideModal] = useState(true);
  const [value, setValue] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        Opens a Dropdown inside a React Native {'<Modal>'}. The
        `isInsideModal` prop skips the internal status-bar offset so the
        list lines up with its trigger. Toggle it to see the bug.
      </Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>isInsideModal</Text>
        <Pressable
          onPress={() => setUseInsideModal((v) => !v)}
          style={[styles.toggle, useInsideModal && styles.toggleOn]}
        >
          <Text
            style={[
              styles.toggleText,
              useInsideModal && styles.toggleTextOn,
            ]}
          >
            {useInsideModal ? 'ON' : 'OFF'}
          </Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => setModalOpen(true)}
      >
        <Text style={styles.primaryText}>Open modal</Text>
      </TouchableOpacity>

      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.scrim}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Inside a native Modal</Text>
            <Dropdown
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Pick one"
              value={value}
              isInsideModal={useInsideModal}
              onChange={(item) => setValue(item.value)}
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selected}
            />
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.secondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  caption: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  toggleOn: {
    backgroundColor: '#0f172a',
  },
  toggleText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  toggleTextOn: {
    color: '#ffffff',
  },
  primary: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 16,
  },
  sheetTitle: {
    fontSize: 16,
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
  secondary: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#475569',
    fontWeight: '500',
  },
});
