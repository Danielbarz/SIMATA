import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize } from '../constants/theme';

export default function MapPlaceholder({ style }: { style?: any }) {
  return (
    <View style={[styles.container, style]}>
      {/* Map background - light colored */}
      <View style={styles.mapBg}>
        {/* Roads */}
        <View style={[styles.road, styles.roadH1]} />
        <View style={[styles.road, styles.roadH2]} />
        <View style={[styles.road, styles.roadV1]} />
        <View style={[styles.road, styles.roadV2]} />
        <View style={[styles.road, styles.roadDiag]} />

        {/* Green areas (parks) */}
        <View style={[styles.greenArea, { top: '15%', left: '5%', width: 60, height: 40 }]} />
        <View style={[styles.greenArea, { top: '60%', right: '10%', width: 50, height: 35 }]} />

        {/* Buildings (subtle blocks) */}
        <View style={[styles.building, { top: '20%', left: '20%' }]} />
        <View style={[styles.building, { top: '30%', left: '60%', width: 45, height: 30 }]} />
        <View style={[styles.building, { top: '55%', left: '35%', width: 30, height: 25 }]} />

        {/* Route line (blue) */}
        <View style={styles.routeContainer}>
          <View style={styles.routeSegment1} />
          <View style={styles.routeSegment2} />
          <View style={styles.routeSegment3} />
        </View>

        {/* Pickup marker (Green dot with pulse) */}
        <View style={styles.pickupMarker}>
          <View style={styles.pickupPulse} />
          <View style={styles.pickupDot} />
        </View>

        {/* Dropoff marker (Pink marker) */}
        <View style={styles.dropoffMarker}>
          <View style={styles.dropoffPin} />
          <View style={styles.dropoffShadow} />
        </View>

        {/* ETA badge */}
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>9 min</Text>
        </View>

        {/* Fastest route badge */}
        <View style={styles.fastestBadge}>
          <Text style={styles.fastestTime}>7 min</Text>
          <Text style={styles.fastestLabel}>Fastest</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 0,
    overflow: 'hidden',
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#E8F0E4',
    position: 'relative',
  },
  // Roads
  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  roadH1: {
    top: '40%',
    left: 0,
    right: 0,
    height: 4,
  },
  roadH2: {
    top: '65%',
    left: 0,
    right: 0,
    height: 3,
  },
  roadV1: {
    left: '30%',
    top: 0,
    bottom: 0,
    width: 4,
  },
  roadV2: {
    left: '70%',
    top: 0,
    bottom: 0,
    width: 3,
  },
  roadDiag: {
    top: '25%',
    left: '45%',
    width: 120,
    height: 3,
    transform: [{ rotate: '35deg' }],
  },
  // Green areas
  greenArea: {
    position: 'absolute',
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    opacity: 0.6,
  },
  // Buildings
  building: {
    position: 'absolute',
    width: 35,
    height: 25,
    backgroundColor: '#D7CCC8',
    borderRadius: 3,
    opacity: 0.5,
  },
  // Route
  routeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  routeSegment1: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: 4,
    height: 80,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  routeSegment2: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: 140,
    height: 4,
    backgroundColor: '#2979FF',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  routeSegment3: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    width: 4,
    height: 50,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  // Markers
  pickupMarker: {
    position: 'absolute',
    top: '25%',
    left: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupPulse: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 170, 19, 0.15)',
    position: 'absolute',
  },
  pickupDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  dropoffMarker: {
    position: 'absolute',
    top: '58%',
    left: '65%',
    alignItems: 'center',
  },
  dropoffPin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E91E8F',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  dropoffShadow: {
    width: 8,
    height: 3,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 2,
  },
  // ETA badge
  etaBadge: {
    position: 'absolute',
    top: '45%',
    left: '48%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  etaText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.accentBlue,
  },
  // Fastest badge
  fastestBadge: {
    position: 'absolute',
    bottom: '15%',
    left: '8%',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  fastestTime: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fastestLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.85)',
  },
});
