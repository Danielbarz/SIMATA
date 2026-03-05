import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';
import { rideTypes } from '../constants/mockData';
import MapPlaceholder from '../components/MapPlaceholder';
import LocationInput from '../components/LocationInput';
import RideOptionCard from '../components/RideOptionCard';
import Button from '../components/Button';

export default function BookingScreen() {
  const [selectedRide, setSelectedRide] = useState('reguler');

  const selected = rideTypes.find((r) => r.id === selectedRide);
  const carColors: Record<string, string> = {
    reguler: '#FFB74D',
    hemat: '#CE93D8',
    premium: '#90CAF9',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Location Input - Sticky */}
        <View style={styles.locationSection}>
          <LocationInput
            pickupText="Stasiun Cisauk - Intermoda BSD"
            dropoffText="AEON Mall BSD City - Gate A"
            onChangePress={() => {}}
          />
        </View>

        {/* Map */}
        <MapPlaceholder />

        {/* Safety Banner */}
        <View style={styles.safetyBanner}>
          <View style={styles.safetyIcon}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          </View>
          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>Perjalanan kamu dijamin aman!</Text>
            <Text style={styles.safetyDesc}>
              Kami sudah membuat protokol keamanan yang dapat memantau aktivitas driver untuk memastikan keamananmu.
            </Text>
          </View>
        </View>

        {/* Ride Options */}
        <View style={styles.rideSection}>
          {rideTypes.map((ride) => (
            <RideOptionCard
              key={ride.id}
              name={ride.name}
              eta={ride.eta}
              description={ride.description}
              price={ride.priceDisplay}
              selected={selectedRide === ride.id}
              onPress={() => setSelectedRide(ride.id)}
              carColor={carColors[ride.id]}
            />
          ))}
        </View>

        {/* Payment & Total */}
        <View style={styles.paymentSection}>
          {/* Payment Method */}
          <View style={styles.paymentRow}>
            <TouchableOpacity style={styles.paymentMethod} activeOpacity={0.7}>
              <View style={styles.qrisBadge}>
                <Text style={styles.qrisText}>QRIS</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.totalWrap}>
              <Text style={styles.totalLabel}>Total Harga</Text>
              <Text style={styles.totalPrice}>Rp{selected?.price.toLocaleString('id-ID') || '30.000'}</Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <View style={styles.confirmSection}>
          <Button
            title="Temukan Driver"
            onPress={() => {}}
            size="lg"
            fullWidth
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
  },
  // Location
  locationSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    ...Shadows.sm,
    zIndex: 10,
  },
  // Safety
  safetyBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'flex-start',
  },
  safetyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  safetyDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  // Ride options
  rideSection: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceDivider,
  },
  // Payment
  paymentSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceDivider,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qrisBadge: {
    backgroundColor: Colors.surfaceGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  qrisText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  totalWrap: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  // Confirm
  confirmSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
