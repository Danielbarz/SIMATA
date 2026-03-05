import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Shadows } from '../constants/theme';
import { mockDriver } from '../constants/mockData';
import FloatingInfoBox from '../components/FloatingInfoBox';

export default function TripScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showSafetyInfo, setShowSafetyInfo] = useState(false);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.6, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '30%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '55%', left: 0, right: 0, height: 2.5 }]} />
        <View style={[styles.road, { left: '30%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.road, { left: '65%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.greenArea, { top: '10%', left: '5%', width: 65, height: 45 }]} />
        <View style={[styles.greenArea, { top: '60%', right: '8%', width: 55, height: 40 }]} />

        <View style={styles.routeLine} />

        <View style={styles.carMarker}>
          <View style={styles.carMarkerInner}>
            <Ionicons name="car-sport" size={20} color="#02B150" />
          </View>
        </View>

        <View style={styles.destPin}>
          <View style={styles.destPinInner}>
            <Ionicons name="location" size={16} color="#E91E8F" />
          </View>
        </View>

        {/* Floating Safety Info */}
        <FloatingInfoBox />
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <TouchableOpacity
          style={styles.floatingMonitorIsland}
          activeOpacity={0.85}
          onPress={() => setShowSafetyInfo(true)}
        >
          <View style={styles.monitorDotWrap}>
            <Animated.View style={[styles.monitorDotPulse, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.monitorDotCore} />
          </View>
          <View style={styles.monitoringTextRow}>
            <Text style={styles.monitoringText}>Diawasi</Text>
            <Image
              source={require('../resources/icons/icon-full.png')}
              style={styles.monitoringLogo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Dalam Perjalanan</Text>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            {mockDriver.avatar ? (
              <Image source={mockDriver.avatar} style={styles.driverAvatarImage} />
            ) : (
              <Ionicons name="person" size={28} color="#02B150" />
            )}
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{mockDriver.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFB300" />
              <Text style={styles.driverRating}>{mockDriver.rating}</Text>
              <Text style={styles.driverRides}>• {mockDriver.totalRides} perjalanan</Text>
            </View>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#02B150" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <Ionicons name="call" size={20} color="#02B150" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.vehicleRow}>
          <View style={styles.vehicleWrap}>
            <Image
              source={require('../resources/images/Mockup/avanza.png')}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>
              {mockDriver.vehicleMake} {mockDriver.vehicleModel}
            </Text>
            <Text style={styles.vehiclePlate}>{mockDriver.vehiclePlate}</Text>
          </View>
          <Text style={styles.vehicleColor}>{mockDriver.vehicleColor}</Text>
        </View>

        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.routeText} numberOfLines={1}>Stasiun Cisauk - Intermoda BSD</Text>
          </View>
          <View style={styles.routeLineV} />
          <View style={styles.routeRow}>
            <View style={styles.dotPink} />
            <Text style={styles.routeText} numberOfLines={1}>AEON Mall BSD City - Gate A</Text>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.emergencyBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="warning" size={18} color="#F44336" />
            <Text style={styles.emergencyText}>Darurat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social" size={18} color="#02B150" />
            <Text style={styles.shareText}>Bagikan Perjalanan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSafetyInfo && (
        <View style={styles.safetyInfoOverlay}>
          <TouchableOpacity
            style={styles.safetyInfoBackdrop}
            activeOpacity={1}
            onPress={() => setShowSafetyInfo(false)}
          />
          <View style={styles.safetyInfoCard}>
            <View style={styles.safetyInfoHeader}>
              <Text style={styles.safetyInfoTitle}>Cara Kerja SIMATA</Text>
              <TouchableOpacity onPress={() => setShowSafetyInfo(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.safetyInfoText}>
              SIMATA memantau perjalanan secara real-time menggunakan AI untuk mendeteksi kondisi tidak aman.
            </Text>
            <Text style={styles.safetyInfoText}>
              Jika terdeteksi anomali, sistem akan memicu notifikasi darurat dan menyimpan bukti digital secara aman.
            </Text>
            <Text style={styles.safetyInfoText}>
              Semua pemrosesan dilakukan dengan pendekatan privasi-terjaga untuk melindungi data pengguna.
            </Text>
            <TouchableOpacity
              style={styles.safetyInfoCloseBtn}
              activeOpacity={0.8}
              onPress={() => setShowSafetyInfo(false)}
            >
              <Text style={styles.safetyInfoCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0E4',
  },
  mapBg: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E8F0E4',
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
    justifyContent: 'center',
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
  // Bottom card
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    ...Shadows.top,
    zIndex: 10,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 49,
    height: 5,
    backgroundColor: '#00000040',
    borderRadius: 3,
  },

  // Status
  statusRow: {
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(2,177,80,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#02B150',
  },
  monitoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244,67,54,0.10)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 22,
    gap: 8,
  },
  floatingMonitorIsland: {
    position: 'absolute',
    top: -52,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCECEC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    zIndex: 20,
    ...Shadows.md,
  },
  safetyInfoOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: 'flex-end',
  },
  safetyInfoBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  safetyInfoCard: {
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Shadows.lg,
  },
  safetyInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  safetyInfoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  safetyInfoText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4A4A4A',
    marginBottom: 8,
  },
  safetyInfoCloseBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
    backgroundColor: 'rgba(2,177,80,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  safetyInfoCloseText: {
    color: '#02B150',
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: 'rgba(244,67,54,0.35)',
  },
  monitorDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  monitoringText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D32F2F',
  },
  monitoringTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    justifyContent: 'center',
  },
  monitoringLogo: {
    width: 132,
    height: 28,
  },

  // Driver
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(2,177,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  driverAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353535',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#353535',
  },
  driverRides: {
    fontSize: 12,
    color: '#999',
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(2,177,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Vehicle
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  vehicleWrap: {
    width: 56,
    height: 34,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleImage: {
    width: 52,
    height: 28,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#353535',
  },
  vehiclePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353535',
    letterSpacing: 1,
  },
  vehicleColor: {
    fontSize: 12,
    color: '#999',
  },

  // Route
  routeCard: {
    marginHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeLineV: {
    width: 1.5,
    height: 18,
    backgroundColor: '#DDD',
    marginLeft: 5.5,
    marginVertical: 4,
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#02B150',
  },
  dotPink: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E8F',
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#353535',
    flex: 1,
  },

  // Bottom actions
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(2,177,80,0.1)',
  },
  shareText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#02B150',
  },
});
