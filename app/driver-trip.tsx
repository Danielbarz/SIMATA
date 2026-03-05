import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Shadows } from '../constants/theme';
import { userProfile } from '../constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TRIP_ETA = '12 menit';
const TRIP_FARE = 'Rp 28.500';
const DROPOFF = 'AEON Mall BSD City - Gate A';
const CURRENT_ROAD = 'Jl. Pahlawan Seribu';

export default function DriverTripScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.4,
      duration: 14000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.6, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Map ── */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '30%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '55%', left: 0, right: 0, height: 2.5 }]} />
        <View style={[styles.road, { left: '30%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.road, { left: '65%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.greenArea, { top: '10%', left: '5%', width: 65, height: 45 }]} />
        <View style={[styles.greenArea, { top: '60%', right: '8%', width: 55, height: 40 }]} />

        {/* Route highlight */}
        <View style={styles.routeLine} />

        {/* Car */}
        <View style={styles.carMarker}>
          <View style={styles.carMarkerInner}>
            <Ionicons name="car-sport" size={20} color="#02B150" />
          </View>
        </View>

        {/* Destination pin */}
        <View style={styles.destPin}>
          <View style={styles.destPinInner}>
            <Ionicons name="location" size={16} color="#E91E8F" />
          </View>
        </View>
      </View>

      {/* ── Top navigation card ── */}
      <View style={styles.navCard}>
        <View style={styles.navCardInner}>
          <View style={styles.navArrowCircle}>
            <Ionicons name="arrow-up" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.navTextWrap}>
            <Text style={styles.navDistance}>500 m</Text>
            <Text style={styles.navRoad} numberOfLines={1}>{CURRENT_ROAD}</Text>
          </View>
          <View style={styles.navEtaWrap}>
            <Text style={styles.navEtaLabel}>Tiba dalam</Text>
            <Text style={styles.navEtaValue}>{TRIP_ETA}</Text>
          </View>
        </View>
      </View>

      {/* ── Bottom panel ── */}
      <View style={styles.bottomPanel}>
        {/* Drag handle */}
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <View style={styles.originDot} />
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.destDot} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelLeft}>Lokasi Jemput</Text>
            <Text style={styles.progressLabelRight} numberOfLines={1}>{DROPOFF}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Passenger + fare */}
        <View style={styles.infoRow}>
          <View style={styles.passengerRow}>
            <View style={styles.passengerAvatar}>
              {userProfile.avatar ? (
                <Image source={userProfile.avatar} style={styles.passengerAvatarImage} />
              ) : (
                <Ionicons name="person" size={20} color="#E91E8F" />
              )}
            </View>
            <View>
              <Text style={styles.passengerName}>{userProfile.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFB300" />
                <Text style={styles.passengerRating}>{userProfile.rating}</Text>
              </View>
            </View>
          </View>
          <View style={styles.fareWrap}>
            <Text style={styles.fareLabel}>Pendapatan</Text>
            <Text style={styles.fareValue}>{TRIP_FARE}</Text>
          </View>
        </View>

        {/* Monitoring pill */}
        <View style={styles.monitorRow}>
          <View style={styles.monitorDotWrap}>
            <Animated.View style={[styles.monitorDotPulse, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.monitorDotCore} />
          </View>
          <Text style={styles.monitorText}>Perjalanan diawasi SIMATA</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="navigate-outline" size={18} color="#02B150" />
            <Text style={styles.navBtnText}>Navigasi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endBtnWrap}
            activeOpacity={0.8}
            onPress={() => router.replace('/driver-home')}
          >
            <LinearGradient
              colors={['#02B150', '#028A3E']}
              style={styles.endBtnGradient}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.endBtnText}>Selesai Perjalanan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Emergency */}
        <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.7}>
          <Ionicons name="warning-outline" size={15} color="#F44336" />
          <Text style={styles.emergencyText}>Darurat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0E4',
  },

  // Map
  mapBg: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E8F0E4',
    position: 'relative',
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
  routeLine: {
    position: 'absolute',
    top: '28%',
    left: '30%',
    width: 4,
    height: '28%',
    backgroundColor: '#02B150',
    borderRadius: 2,
    opacity: 0.8,
  },
  carMarker: {
    position: 'absolute',
    top: '42%',
    left: '27%',
    alignItems: 'center',
  },
  carMarkerInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  destPin: {
    position: 'absolute',
    top: '20%',
    left: '27%',
    alignItems: 'center',
  },
  destPinInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  // Top nav card
  navCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    left: 16,
    right: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#02B150',
    ...Shadows.md,
    zIndex: 20,
  },
  navCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  navArrowCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextWrap: {
    flex: 1,
  },
  navDistance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  navRoad: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  navEtaWrap: {
    alignItems: 'flex-end',
  },
  navEtaLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  navEtaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Bottom panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    ...Shadows.top,
    zIndex: 10,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#00000018',
    borderRadius: 2,
  },

  // Progress
  progressSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#02B150',
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#EBEBEB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#02B150',
    borderRadius: 3,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E91E8F',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabelLeft: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  progressLabelRight: {
    fontSize: 11,
    color: '#AAAAAA',
    maxWidth: '55%',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginHorizontal: 24,
  },

  // Passenger + fare row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passengerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(233,30,143,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  passengerAvatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#353535',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  passengerRating: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  fareWrap: {
    alignItems: 'flex-end',
  },
  fareLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    marginBottom: 2,
  },
  fareValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02B150',
  },

  // Monitoring
  monitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
    backgroundColor: 'rgba(2,177,80,0.08)',
    marginHorizontal: 24,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  monitorDotWrap: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorDotPulse: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(2,177,80,0.35)',
  },
  monitorDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#02B150',
  },
  monitorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#02B150',
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#02B150',
    backgroundColor: 'rgba(2,177,80,0.06)',
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#02B150',
  },
  endBtnWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  endBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  endBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Emergency
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  emergencyText: {
    fontSize: 13,
    color: '#F44336',
    fontWeight: '600',
  },
});
