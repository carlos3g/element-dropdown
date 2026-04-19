import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { hairlineWidth } from './constants';

interface Section {
  title: string;
  data: unknown[];
}

interface Props {
  section: Section;
  /** Caller-supplied renderer; takes precedence over the default. */
  renderSectionHeader?: (section: any) => React.ReactElement | null;
  /** Style merged on top of the default header container. */
  sectionHeaderStyle?: StyleProp<ViewStyle>;
  /** Style merged on top of the default header text. */
  sectionHeaderTextStyle?: StyleProp<TextStyle>;
  /** Extra style applied to the `<Text>` (typically a `fontFamily` override). */
  fontStyle?: StyleProp<TextStyle>;
  allowFontScaling?: boolean;
}

/**
 * Default section-header used when the consumer doesn't pass
 * `renderSectionHeader`. Previously duplicated as `_renderSectionHeader`
 * in both Dropdown and MultiSelect.
 */
export function DropdownSectionHeader({
  section,
  renderSectionHeader,
  sectionHeaderStyle,
  sectionHeaderTextStyle,
  fontStyle,
  allowFontScaling,
}: Props) {
  if (renderSectionHeader) {
    return renderSectionHeader(section);
  }
  return (
    <View
      // `role="header"` lets VoiceOver / TalkBack surface the section
      // title via the "next heading" navigation gesture, which is the
      // primary way screen-reader users skim a grouped list.
      accessibilityRole="header"
      style={[defaultStyles.header, sectionHeaderStyle]}
    >
      <Text
        allowFontScaling={allowFontScaling}
        style={[defaultStyles.headerText, sectionHeaderTextStyle, fontStyle]}
      >
        {section.title}
      </Text>
    </View>
  );
}

// The two components used to own duplicated `sectionHeader` /
// `sectionHeaderText` entries in their StyleSheet. Colocate the
// defaults with the renderer so only one copy exists.
const defaultStyles = StyleSheet.create({
  header: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderBottomWidth: hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
