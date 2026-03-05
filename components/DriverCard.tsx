import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize, Shadows } from '../constants/theme';

interface DriverCardProps {
  name: string;
  rating: number;
  totalRides: number;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  eta: string;
  onCall?: () => void;
  onChat?: () => void;
}

export default function DriverCard({
  name,
  rating,
  totalRides,
  vehicleModel,
  vehicleColor,
  vehiclePlate,
  eta,
  onCall,
  onChat,
}: DriverCardProps) {
  return (
    <View style={styles.container}>
      {/* Header with ETA */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver sedang menuju ke kamu</Text>
        <View style={styles.etaBadge}>
          <Ionicons name="time-outline" size={14} color={Colors.primary} />
          <Text style={styles.etaText}>{eta}</Text>
        </View>
      </View>

      {/* Driver info */}
      <View style={styles.driverRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={Colors.textMuted} />
        </View>

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.rideCount}>• {totalRides.toLocaleString()} perjalanan</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onChat} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onCall} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Vehicle */}
      <View style={styles.vehicleRow}>
        <View style={styles.vehicleInfo}>
          <Ionicons name="car" size={18} color={Colors.textSecondary} />
          <Text style={styles.vehicleText}>
            {vehicleColor} {vehicleModel}
          </Text>
        </View>
        <View style={styles.plateWrap}>
          <Text style={styles.plateText}>{vehiclePlate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  etaText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rideCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGray,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  vehicleText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  plateWrap: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  plateText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
});
