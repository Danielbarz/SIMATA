import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const TRACK_WIDTH = SCREEN_WIDTH - 64; // paddingHorizontal 32 * 2
const THUMB_SIZE = 56;
const TRACK_PADDING = 4;
const ACCEPT_THRESHOLD = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2 - 8;

const COUNTDOWN_SECONDS = 20;

const mockOrder = {
  id: 'ORD-2847',
  passenger: {
    name: userProfile.name,
    rating: userProfile.rating,
    totalRides: userProfile.totalRides,
  },
  pickup: {
    label: 'Stasiun Cisauk - Intermoda BSD',
    address: 'Jl. Raya Cisauk, Tangerang Selatan',
    distanceToPickup: '1.2 km',
    etaToPickup: '3 menit',
  },
  dropoff: {
    label: 'AEON Mall BSD City - Gate A',
    address: 'Jl. BSD Raya Utama, Tangerang Selatan',
  },
  tripDistance: '4.8 km',
  rideType: 'Reguler',
  price: 30000,
  priceDisplay: 'Rp30.000',
  paymentMethod: 'QRIS',
};

export default function DriverOrderScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  // Slide to accept state
  const slideX = useRef(new Animated.Value(0)).current;
  const [sliderFill, setSliderFill] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (accepted) return;
    if (countdown <= 0) {
      router.replace('/driver-home');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, accepted]);

  // Navigate to pickup route after acceptance animation
  useEffect(() => {
    if (!accepted) return;
    const t = setTimeout(() => {
      router.replace('/driver-pickup');
    }, 1500);
    return () => clearTimeout(t);
  }, [accepted]);

  // Slider fill tracking
  useEffect(() => {
    const id = slideX.addListener(({ value }) => {
      const fill = Math.min(1, Math.max(0, value / ACCEPT_THRESHOLD));
      setSliderFill(fill);
    });
    return () => slideX.removeListener(id);
  }, []);

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
          // Snap to end and accept
          Animated.timing(slideX, {
            toValue: ACCEPT_THRESHOLD,
            duration: 150,
            useNativeDriver: false,
          }).start(() => setAccepted(true));
        } else {
          // Snap back
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

  const countdownProgress = countdown / COUNTDOWN_SECONDS;
  const circumference = 2 * Math.PI * 20; // r=20
  const strokeDashoffset = circumference * (1 - countdownProgress);

  const thumbTranslate = slideX.interpolate({
    inputRange: [0, ACCEPT_THRESHOLD],
    outputRange: [0, ACCEPT_THRESHOLD],
    extrapolate: 'clamp',
  });

  const labelOpacity = slideX.interpolate({
    inputRange: [0, ACCEPT_THRESHOLD * 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (accepted) {
    return (
      <View style={styles.acceptedContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#02B150" />
        <LinearGradient
          colors={['#02B150', '#00D95F']}
          style={styles.acceptedGradient}
        >
          <Ionicons name="checkmark-circle" size={80} color="#FFF" />
          <Text style={styles.acceptedTitle}>Order Diterima!</Text>
          <Text style={styles.acceptedSub}>Menuju ke lokasi penjemputan...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '30%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '55%', left: 0, right: 0, height: 2.5 }]} />
        <View style={[styles.road, { left: '30%', top: 0, bottom: 0, width: 3 }]} />
        <View style={[styles.road, { left: '65%', top: 0, bottom: 0, width: 2.5 }]} />
        <View style={[styles.greenArea, { top: '15%', left: '5%', width: 55, height: 40 }]} />
        <View style={[styles.greenArea, { top: '45%', right: '8%', width: 50, height: 35 }]} />
        <View style={[styles.greenArea, { top: '68%', left: '40%', width: 40, height: 30 }]} />

        {/* Pickup pin */}
        <View style={[styles.mapPin, { top: '28%', left: '26%' }]}>
          <View style={styles.pinGreen} />
        </View>
        {/* Dropoff pin */}
        <View style={[styles.mapPin, { top: '52%', left: '60%' }]}>
          <View style={styles.pinPink} />
        </View>
        {/* Route line */}
        <View style={styles.routeLine} />
      </View>

      {/* Countdown Badge */}
      <View style={styles.countdownBadge}>
        <View style={styles.countdownInner}>
          <Text style={[
            styles.countdownNum,
            countdown <= 5 && { color: '#E91E8F' },
          ]}>
            {countdown}
          </Text>
        </View>
        <Text style={styles.countdownLabel}>detik</Text>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.newOrderBadge}>
            <View style={styles.newOrderDot} />
            <Text style={styles.newOrderText}>Order Baru</Text>
          </View>
          <Text style={styles.orderId}>{mockOrder.id}</Text>
        </View>

        {/* Passenger Info */}
        <View style={styles.passengerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {mockOrder.passenger.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{mockOrder.passenger.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F4B400" />
              <Text style={styles.ratingText}>
                {mockOrder.passenger.rating} · {mockOrder.passenger.totalRides} perjalanan
              </Text>
            </View>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>{mockOrder.priceDisplay}</Text>
            <Text style={styles.priceTagSub}>{mockOrder.paymentMethod}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Route */}
        <View style={styles.routeCard}>
          {/* Pickup */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={styles.dotGreen} />
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routePointLabel}>Jemput</Text>
              <Text style={styles.routePointName} numberOfLines={1}>
                {mockOrder.pickup.label}
              </Text>
              <Text style={styles.routePointAddr} numberOfLines={1}>
                {mockOrder.pickup.address}
              </Text>
            </View>
            <View style={styles.etaBadge}>
              <Ionicons name="navigate-outline" size={12} color="#02B150" />
              <Text style={styles.etaText}>{mockOrder.pickup.etaToPickup}</Text>
            </View>
          </View>

          <View style={styles.routeConnector}>
            <View style={styles.routeConnectorLine} />
          </View>

          {/* Dropoff */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={styles.dotPink} />
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routePointLabel}>Antar</Text>
              <Text style={styles.routePointName} numberOfLines={1}>
                {mockOrder.dropoff.label}
              </Text>
              <Text style={styles.routePointAddr} numberOfLines={1}>
                {mockOrder.dropoff.address}
              </Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{mockOrder.tripDistance}</Text>
            </View>
          </View>
        </View>

        {/* Trip type row */}
        <View style={styles.tripMetaRow}>
          <View style={styles.tripMetaItem}>
            <Ionicons name="car-outline" size={15} color="#666" />
            <Text style={styles.tripMetaText}>{mockOrder.rideType}</Text>
          </View>
          <View style={styles.tripMetaDot} />
          <View style={styles.tripMetaItem}>
            <Ionicons name="location-outline" size={15} color="#666" />
            <Text style={styles.tripMetaText}>{mockOrder.pickup.distanceToPickup} ke penjemputan</Text>
          </View>
        </View>

        {/* Slide to Accept */}
        <View style={styles.sliderTrack}>
          {/* Fill */}
          <Animated.View
            style={[
              styles.sliderFill,
              { width: slideX.interpolate({
                inputRange: [0, ACCEPT_THRESHOLD],
                outputRange: [THUMB_SIZE, TRACK_WIDTH - TRACK_PADDING * 2],
                extrapolate: 'clamp',
              }) },
            ]}
          />
          {/* Label */}
          <Animated.Text style={[styles.sliderLabel, { opacity: labelOpacity }]}>
            Geser untuk terima
          </Animated.Text>
          {/* Thumb */}
          <Animated.View
            style={[styles.sliderThumb, { transform: [{ translateX: thumbTranslate }] }]}
            {...panResponder.panHandlers}
          >
            <Ionicons name="chevron-forward" size={24} color="#FFF" />
          </Animated.View>
        </View>

        {/* Reject */}
        <TouchableOpacity
          style={styles.rejectBtn}
          activeOpacity={0.7}
          onPress={() => router.replace('/driver-home')}
        >
          <Text style={styles.rejectText}>Tolak Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Accepted state
  acceptedContainer: {
    flex: 1,
  },
  acceptedGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  acceptedTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },
  acceptedSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },

  // Map
  mapBg: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  greenArea: {
    position: 'absolute',
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    opacity: 0.6,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#02B150',
    borderWidth: 3,
    borderColor: '#FFF',
    ...Shadows.sm,
  },
  pinPink: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E91E8F',
    borderWidth: 3,
    borderColor: '#FFF',
    ...Shadows.sm,
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: 120,
    height: 90,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },

  // Countdown
  countdownBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 6,
    ...Shadows.md,
  },
  countdownInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#353535',
    minWidth: 24,
    textAlign: 'center',
  },
  countdownLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },

  // Bottom Card
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  newOrderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(2,177,80,0.1)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  newOrderDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#02B150',
  },
  newOrderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02B150',
  },
  orderId: {
    fontSize: 12,
    color: '#AAA',
    fontWeight: '500',
  },

  // Passenger
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
  passengerInfo: {
    flex: 1,
    gap: 3,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#353535',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#888',
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  priceTagText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#02B150',
  },
  priceTagSub: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginBottom: 14,
  },

  // Route card
  routeCard: {
    marginHorizontal: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  routeIconCol: {
    paddingTop: 3,
    width: 16,
    alignItems: 'center',
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#02B150',
    borderWidth: 2,
    borderColor: 'rgba(2,177,80,0.25)',
  },
  dotPink: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E8F',
    borderWidth: 2,
    borderColor: 'rgba(233,30,143,0.25)',
  },
  routeConnector: {
    paddingLeft: 12,
    height: 12,
    justifyContent: 'center',
  },
  routeConnectorLine: {
    width: 1.5,
    height: 12,
    backgroundColor: '#DDD',
  },
  routeTextCol: {
    flex: 1,
  },
  routePointLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  routePointName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#353535',
  },
  routePointAddr: {
    fontSize: 11,
    color: '#888',
    marginTop: 1,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(2,177,80,0.1)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#02B150',
  },
  distanceBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },

  // Trip meta
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripMetaText: {
    fontSize: 12,
    color: '#666',
  },
  tripMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#CCC',
  },

  // Slider
  sliderTrack: {
    marginHorizontal: 32,
    height: THUMB_SIZE + TRACK_PADDING * 2,
    backgroundColor: '#F0F0F0',
    borderRadius: (THUMB_SIZE + TRACK_PADDING * 2) / 2,
    marginBottom: 10,
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
    fontSize: 14,
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

  // Reject
  rejectBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  rejectText: {
    fontSize: 13,
    color: '#AAA',
    fontWeight: '600',
  },
});
