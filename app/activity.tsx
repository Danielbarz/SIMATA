import React from 'react';
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
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';
import { rideHistory } from '../constants/mockData';

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Aktivitas</Text>
          <Text style={styles.subtitle}>Riwayat perjalananmu</Text>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Perjalanan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.85</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Rp2.4jt</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {['Semua', 'Selesai', 'Dibatalkan'].map((filter, i) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, i === 0 && styles.filterTabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ride History */}
        {rideHistory.map((ride) => (
          <TouchableOpacity key={ride.id} style={styles.rideCard} activeOpacity={0.8}>
            <View style={styles.rideHeader}>
              <View style={styles.rideHeaderLeft}>
                <View style={[
                  styles.statusDot,
                  ride.status === 'completed' ? styles.dotCompleted : styles.dotCancelled,
                ]} />
                <Text style={styles.rideDate}>{ride.date} • {ride.time}</Text>
              </View>
              <Text style={[
                styles.ridePrice,
                ride.status === 'cancelled' && styles.priceCancelled,
              ]}>
                {ride.price}
              </Text>
            </View>

            <View style={styles.rideRoute}>
              <View style={styles.routeTimeline}>
                <View style={styles.timelineDotG} />
                <View style={styles.timelineLineSmall} />
                <View style={styles.timelineDotP} />
              </View>
              <View style={styles.routeTexts}>
                <Text style={styles.routePoint}>{ride.pickup}</Text>
                <Text style={styles.routePoint}>{ride.dropoff}</Text>
              </View>
            </View>

            <View style={styles.rideFooter}>
              <View style={styles.rideTypeBadge}>
                <Ionicons
                  name={ride.rideType === 'Bike' ? 'bicycle-outline' : 'car-outline'}
                  size={14}
                  color={Colors.textSecondary}
                />
                <Text style={styles.rideTypeText}>{ride.rideType}</Text>
              </View>
              {ride.rating && (
                <View style={styles.ratingWrap}>
                  {Array.from({ length: ride.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color={Colors.warning} />
                  ))}
                </View>
              )}
              {ride.status === 'cancelled' && (
                <View style={styles.cancelBadge}>
                  <Text style={styles.cancelText}>Dibatalkan</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  // Stats
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.surfaceDivider,
  },
  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  // Ride Card
  rideCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCompleted: {
    backgroundColor: Colors.success,
  },
  dotCancelled: {
    backgroundColor: Colors.error,
  },
  rideDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  ridePrice: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  priceCancelled: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  rideRoute: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  routeTimeline: {
    alignItems: 'center',
    marginRight: Spacing.md,
    paddingVertical: 2,
  },
  timelineDotG: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timelineLineSmall: {
    width: 1.5,
    height: 16,
    backgroundColor: Colors.surfaceBorder,
  },
  timelineDotP: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E8F',
  },
  routeTexts: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routePoint: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  rideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rideTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceGray,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  rideTypeText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  ratingWrap: {
    flexDirection: 'row',
    gap: 1,
  },
  cancelBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  cancelText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    fontWeight: '600',
  },
});
