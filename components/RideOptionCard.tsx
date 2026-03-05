import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize } from '../constants/theme';

interface RideOptionCardProps {
  name: string;
  eta: string;
  description: string;
  price: string;
  selected?: boolean;
  onPress: () => void;
  carColor?: string;
}

export default function RideOptionCard({
  name,
  eta,
  description,
  price,
  selected = false,
  onPress,
  carColor = '#FFB74D',
}: RideOptionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
    >
      {/* Car illustration placeholder */}
      <View style={styles.carWrap}>
        <View style={[styles.carBody, { backgroundColor: carColor }]}>
          <View style={styles.carRoof} />
          <View style={styles.carWindow} />
        </View>
        <View style={styles.carWheelLeft} />
        <View style={styles.carWheelRight} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.eta}>{eta}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Price + Check */}
      <View style={styles.priceSection}>
        <Text style={styles.price}>{price}</Text>
        <View style={[styles.checkCircle, selected && styles.checkCircleSelected]}>
          {selected && (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDivider,
    backgroundColor: Colors.surface,
  },
  containerSelected: {
    backgroundColor: '#F8FFF8',
  },
  // Simplified car illustration
  carWrap: {
    width: 52,
    height: 36,
    marginRight: Spacing.md,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  carBody: {
    width: 48,
    height: 24,
    borderRadius: 8,
    position: 'relative',
  },
  carRoof: {
    position: 'absolute',
    top: -8,
    left: 10,
    width: 26,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  carWindow: {
    position: 'absolute',
    top: -6,
    left: 12,
    width: 22,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  carWheelLeft: {
    position: 'absolute',
    bottom: 0,
    left: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#424242',
  },
  carWheelRight: {
    position: 'absolute',
    bottom: 0,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#424242',
  },
  // Info
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  eta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  // Price
  priceSection: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  checkCircleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
