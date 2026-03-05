import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../constants/theme';
import { userProfile } from '../constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRACK_WIDTH = SCREEN_WIDTH - 64;
const THUMB_SIZE = 56;
const TRACK_PADDING = 4;
const ACCEPT_THRESHOLD = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2 - 8;

export default function DriverPickupScreen() {
  const router = useRouter();
  const slideX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        const clamped = Math.max(0, Math.min(gs.dx, ACCEPT_THRESHOLD));
        slideX.setValue(clamped);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx >= ACCEPT_THRESHOLD * 0.85) {
          Animated.timing(slideX, {
            toValue: ACCEPT_THRESHOLD,
            duration: 150,
            useNativeDriver: false,
          }).start(() => router.push('/driver-camera'));
        } else {
          Animated.spring(slideX, {
            toValue: 0,
            useNativeDriver: false,
            tension: 60,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const labelOpacity = slideX.interpolate({
    inputRange: [0, ACCEPT_THRESHOLD * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '25%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '50%', left: 0, right: 0, height: 2.5 }]} />
        <View style={[styles.road, { top: '72%', left: 0, right: 0, height: 2 }]} />
        <View style={[styles.road, { left: '20%', top: 0, bottom: 0, width: 3 }]} />
        <View style={[styles.road, { left: '55%', top: 0, bottom: 0, width: 2.5 }]} />
        <View style={[styles.road, { left: '80%', top: 0, bottom: 0, width: 2 }]} />
        <View style={[styles.greenArea, { top: '12%', left: '8%', width: 55, height: 38 }]} />
        <View style={[styles.greenArea, { top: '42%', right: '12%', width: 48, height: 32 }]} />

        {/* Route highlighted path */}
        <LinearGradient
          colors={['#02B150', '#02B15060']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.routePath}
        />

        {/* Current location (driver) */}
        <View style={styles.driverPin}>
          <View style={styles.driverPinOuter}>
            <View style={styles.driverPinInner}>
              <Ionicons name="car" size={14} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Destination pin (passenger) */}
        <View style={styles.destPin}>
          <View style={styles.destPinCircle}>
            <Ionicons name="person" size={13} color="#FFF" />
          </View>
          <View style={styles.destPinTail} />
        </View>

        {/* ETA badge on map */}
        <View style={styles.etaMapBadge}>
          <Text style={styles.etaMapNum}>3</Text>
          <Text style={styles.etaMapUnit}>menit</Text>
        </View>
      </View>

      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <LinearGradient
          colors={['#02B150', '#00C957']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.navHeaderGradient}
        >
          <Ionicons name="navigate" size={20} color="#FFF" />
          <View style={styles.navHeaderText}>
            <Text style={styles.navHeaderTitle}>Menuju Penjemputan</Text>
            <Text style={styles.navHeaderSub}>1.2 km · sekitar 3 menit</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {/* Passenger info */}
        <View style={styles.passengerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {userProfile.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{userProfile.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F4B400" />
              <Text style={styles.ratingText}>{userProfile.rating}</Text>
              <Text style={styles.separatorDot}>·</Text>
              <Ionicons name="location-outline" size={12} color="#888" />
              <Text style={styles.ratingText}>Stasiun Cisauk - Intermoda BSD</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Pickup address */}
        <View style={styles.addressCard}>
          <View style={styles.addressIconWrap}>
            <View style={styles.addressDot} />
          </View>
          <View style={styles.addressTextWrap}>
            <Text style={styles.addressLabel}>Lokasi Penjemputan</Text>
            <Text style={styles.addressName}>Stasiun Cisauk - Intermoda BSD</Text>
            <Text style={styles.addressSub}>Jl. Raya Cisauk, Tangerang Selatan</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>1.2 km</Text>
          </View>
        </View>

        {/* Slide to confirm pickup */}
        <View style={styles.sliderTrack}>
          <Animated.View
            style={[
              styles.sliderFill,
              {
                width: slideX.interpolate({
                  inputRange: [0, ACCEPT_THRESHOLD],
                  outputRange: [THUMB_SIZE, TRACK_WIDTH - TRACK_PADDING * 2],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
          <Animated.Text style={[styles.sliderLabel, { opacity: labelOpacity }]}>
            Penumpang sudah dijemput
          </Animated.Text>
          <Animated.View
            style={[
              styles.sliderThumb,
              { transform: [{ translateX: slideX }] },
            ]}
            {...panResponder.panHandlers}
          >
            <Ionicons name="person-add" size={22} color="#FFF" />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Map
  mapBg: { flex: 1, position: 'relative', overflow: 'hidden' },
  road: { position: 'absolute', backgroundColor: '#FFFFFF' },
  greenArea: {
    position: 'absolute',
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    opacity: 0.6,
  },
  routePath: {
    position: 'absolute',
    top: '22%',
    left: '17%',
    width: 140,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
    transform: [{ rotate: '12deg' }],
  },
  driverPin: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    alignItems: 'center',
  },
  driverPinOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(2,177,80,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverPinInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#02B150',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  destPin: {
    position: 'absolute',
    top: '18%',
    left: '14%',
    alignItems: 'center',
  },
  destPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E91E8F',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  destPinTail: {
    width: 2,
    height: 6,
    backgroundColor: '#E91E8F',
    borderRadius: 1,
  },
  etaMapBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    ...Shadows.md,
  },
  etaMapNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#02B150',
  },
  etaMapUnit: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  // Nav header
  navHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    left: 16,
    right: 80,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.md,
  },
  navHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  navHeaderText: { flex: 1 },
  navHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  navHeaderSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },

  // Bottom card
  bottomCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    ...Shadows.top,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 49,
    height: 5,
    backgroundColor: '#00000018',
    borderRadius: 3,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(2,177,80,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#02B150',
  },
  passengerInfo: { flex: 1, gap: 4 },
  passengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#353535',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  ratingText: { fontSize: 12, color: '#888' },
  separatorDot: { fontSize: 12, color: '#CCC' },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginBottom: 14,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  addressIconWrap: {
    paddingTop: 4,
    alignItems: 'center',
  },
  addressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E8F',
    borderWidth: 2,
    borderColor: 'rgba(233,30,143,0.25)',
  },
  addressTextWrap: { flex: 1 },
  addressLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  addressName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#353535',
  },
  addressSub: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  distanceBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },

  // Slider
  sliderTrack: {
    marginHorizontal: 32,
    height: THUMB_SIZE + TRACK_PADDING * 2,
    backgroundColor: '#F0F0F0',
    borderRadius: (THUMB_SIZE + TRACK_PADDING * 2) / 2,
    marginBottom: 8,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,177,80,0.15)',
    borderRadius: (THUMB_SIZE + TRACK_PADDING * 2) / 2,
  },
  sliderLabel: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  sliderThumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#02B150',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
});
