import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Shadows } from '../constants/theme';
import { mockDriver } from '../constants/mockData';
import FloatingInfoBox from '../components/FloatingInfoBox';
import LottieView from 'lottie-react-native';

export default function TripScreen() {
  const router = useRouter();
  const routeProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runRouteLoop = () => {
      routeProgress.setValue(0);

      Animated.sequence([
        Animated.timing(routeProgress, {
          toValue: 0.35,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(routeProgress, {
          toValue: 0.75,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(routeProgress, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ]).start(({ finished }) => {
        if (finished && isMounted) {
          runRouteLoop();
        }
      });
    };

    runRouteLoop();

    return () => {
      isMounted = false;
      routeProgress.stopAnimation();
    };
  }, [routeProgress]);

  const carTranslateX = routeProgress.interpolate({
    inputRange: [0, 0.35, 0.75, 1],
    outputRange: [0, 0, 145, 210],
  });

  const carTranslateY = routeProgress.interpolate({
    inputRange: [0, 0.35, 0.75, 1],
    outputRange: [0, 72, 128, 128],
  });

  const carRotation = routeProgress.interpolate({
    inputRange: [0, 0.35, 0.75, 1],
    outputRange: ['90deg', '90deg', '26deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '22%', left: 0, right: 0, height: 4 }]} />
        <View style={[styles.road, { top: '42%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '62%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { left: '20%', top: 0, bottom: 0, width: 3 }]} />
        <View style={[styles.road, { left: '45%', top: 0, bottom: 0, width: 3 }]} />
        <View style={[styles.road, { left: '74%', top: 0, bottom: 0, width: 3 }]} />

        <View style={[styles.greenArea, { top: '10%', left: '6%', width: 72, height: 48 }]} />
        <View style={[styles.greenArea, { top: '58%', right: '8%', width: 60, height: 40 }]} />

        <View style={[styles.block, { top: '16%', left: '34%', width: 46, height: 30 }]} />
        <View style={[styles.block, { top: '48%', left: '8%', width: 42, height: 28 }]} />
        <View style={[styles.block, { top: '36%', right: '14%', width: 54, height: 32 }]} />

        <View style={styles.routeLayer}>
          <View style={styles.routeSeg1} />
          <View style={styles.routeSeg2} />
          <View style={styles.routeSeg3} />
        </View>

        <View style={styles.pickupMarker}>
          <View style={styles.pickupPulse} />
          <View style={styles.pickupDot} />
        </View>

        <View style={styles.dropoffMarker}>
          <View style={styles.dropoffDot} />
          <View style={styles.dropoffShadow} />
        </View>

        {/* Car marker */}
        <Animated.View
          style={[
            styles.carMarker,
            {
              transform: [
                { translateX: carTranslateX },
                { translateY: carTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.carMarkerInner}>
            <Animated.View style={{ transform: [{ rotate: carRotation }] }}>
              <Image
                source={require('../resources/images/Mockup/avanza.png')}
                style={styles.mapCarImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Floating SIMATA Info */}
        <FloatingInfoBox />
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Dalam Perjalanan</Text>
          </View>
          <View style={styles.monitoringBadge}>
            <LottieView
              source={require('../resources/animations/dot.json')}
              autoPlay
              loop
              style={styles.dotAnim}
            />
            <Text style={styles.monitoringText}>Diawasi SIMATA</Text>
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
    borderRadius: 5,
    opacity: 0.7,
  },
  block: {
    position: 'absolute',
    backgroundColor: '#D9D2C7',
    borderRadius: 4,
    opacity: 0.55,
  },
  routeLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  routeSeg1: {
    position: 'absolute',
    top: '24%',
    left: '23%',
    width: 4,
    height: 72,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  routeSeg2: {
    position: 'absolute',
    top: '24%',
    left: '23%',
    width: 150,
    height: 4,
    backgroundColor: '#2979FF',
    borderRadius: 2,
    transform: [{ rotate: '24deg' }],
  },
  routeSeg3: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    width: 90,
    height: 4,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  pickupMarker: {
    position: 'absolute',
    top: '21%',
    left: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  pickupPulse: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(2,177,80,0.16)',
    position: 'absolute',
  },
  pickupDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#02B150',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  dropoffMarker: {
    position: 'absolute',
    top: '50%',
    left: '79%',
    alignItems: 'center',
    zIndex: 4,
  },
  dropoffDot: {
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
  carMarker: {
    position: 'absolute',
    top: '20.5%',
    left: '18.8%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
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
  mapCarImage: {
    width: 24,
    height: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: 'rgba(233,30,143,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 2,
  },
  dotAnim: {
    width: 22,
    height: 22,
  },
  monitoringText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E8F',
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
