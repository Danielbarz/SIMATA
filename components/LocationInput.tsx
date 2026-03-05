import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize } from '../constants/theme';

interface LocationInputProps {
  pickupText?: string;
  dropoffText?: string;
  onPickupPress?: () => void;
  onDropoffPress?: () => void;
  onChangePress?: () => void;
}

export default function LocationInput({
  pickupText = 'Lokasi jemput',
  dropoffText = 'Mau ke mana?',
  onPickupPress,
  onDropoffPress,
  onChangePress,
}: LocationInputProps) {
  return (
    <View style={styles.container}>
      {/* Timeline dots */}
      <View style={styles.timeline}>
        <View style={styles.dotGreen} />
        <View style={styles.line} />
        <View style={styles.dotPink}>
          <View style={styles.dotPinkInner} />
        </View>
      </View>

      {/* Input fields */}
      <View style={styles.inputs}>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={onPickupPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.inputText,
              pickupText !== 'Lokasi jemput' && styles.inputTextActive,
            ]}
            numberOfLines={1}
          >
            {pickupText}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.inputRow}
          onPress={onDropoffPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.inputText,
              dropoffText !== 'Mau ke mana?' && styles.inputTextActive,
            ]}
            numberOfLines={1}
          >
            {dropoffText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ubah button */}
      {onChangePress && (
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={onChangePress}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={14} color={Colors.primary} />
          <Text style={styles.changeText}>Ubah</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  timeline: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    height: 56,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  line: {
    width: 1.5,
    flex: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: 3,
  },
  dotPink: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPinkInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E91E8F',
  },
  inputs: {
    flex: 1,
  },
  inputRow: {
    paddingVertical: 6,
  },
  inputText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  inputTextActive: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceDivider,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingLeft: Spacing.sm,
  },
  changeText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
});
