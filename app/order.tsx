import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { rideTypes } from '../constants/mockData';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Heights for collapsed and expanded states
const DRAG_HANDLE_HEIGHT = 27; // paddingTop(12) + handle(5) + paddingBottom(10)
const COLLAPSED_CONTENT_HEIGHT = 58; // collapsed bar content
const COLLAPSED_HEIGHT = DRAG_HANDLE_HEIGHT + COLLAPSED_CONTENT_HEIGHT;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.52;
const BOTTOM_SHEET_BOTTOM = Platform.OS === 'ios' ? 160 : 144;
const SWIPE_THRESHOLD = 50;

// Spring config for smooth, bouncy animations
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
};

// Car images mapping
const carImages: Record<string, any> = {
  reguler: require('../resources/icons/car1.png'),
  hemat: require('../resources/icons/car2.png'),
  premium: require('../resources/icons/car3.png'),
};

export default function OrderScreen() {
  const router = useRouter();
  const [selectedRides, setSelectedRides] = useState<string[]>(['reguler']);

  const selectedRideObjects = rideTypes.filter((r) => selectedRides.includes(r.id));
  const primaryRide = selectedRideObjects[0];
  const minPrice = selectedRideObjects.length > 0
    ? Math.min(...selectedRideObjects.map((r) => r.price))
    : 30000;

  const toggleRide = (id: string) => {
    setSelectedRides((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // minimal 1 harus terpilih
        return prev.filter((r) => r !== id);
      }
      return [...prev, id];
    });
  };

  // Animated value: 0 = collapsed, 1 = expanded
  const sheetProgress = useSharedValue(1); // start expanded
  const startProgress = useSharedValue(1); // captures state at drag start

  const expandSheet = useCallback(() => {
    'worklet';
    sheetProgress.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const collapseSheet = useCallback(() => {
    'worklet';
    sheetProgress.value = withSpring(0, SPRING_CONFIG);
  }, []);

  const toggleSheet = useCallback(() => {
    'worklet';
    if (sheetProgress.value < 0.5) {
      sheetProgress.value = withSpring(1, SPRING_CONFIG);
    } else {
      sheetProgress.value = withSpring(0, SPRING_CONFIG);
    }
  }, []);

  // Tap gesture for the drag handle
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      'worklet';
      toggleSheet();
    });

  // Pan gesture for swiping
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10]) // activate after 10px vertical movement
    .onStart(() => {
      'worklet';
      startProgress.value = sheetProgress.value; // capture initial state
    })
    .onUpdate((event) => {
      'worklet';
      const range = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;
      // Use startProgress to determine direction, not the live value
      if (startProgress.value >= 0.5) {
        // Was expanded: dragging down collapses
        const progress = startProgress.value - event.translationY / range;
        sheetProgress.value = Math.max(0, Math.min(1, progress));
      } else {
        // Was collapsed: dragging up expands
        const progress = startProgress.value - event.translationY / range;
        sheetProgress.value = Math.max(0, Math.min(1, progress));
      }
    })
    .onEnd((event) => {
      'worklet';
      const velocityThreshold = 500;
      if (Math.abs(event.velocityY) > velocityThreshold) {
        // Fast swipe: use velocity direction
        if (event.velocityY > 0) {
          collapseSheet();
        } else {
          expandSheet();
        }
      } else {
        // Snap to nearest state based on current position
        if (sheetProgress.value >= 0.5) {
          expandSheet();
        } else {
          collapseSheet();
        }
      }
    });

  // Combine gestures: pan only for the whole sheet
  const sheetGesture = panGesture;

  // Animated styles for the bottom sheet container
  const animatedSheetStyle = useAnimatedStyle(() => {
    const height = interpolate(
      sheetProgress.value,
      [0, 1],
      [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      Extrapolation.CLAMP
    );
    return {
      height,
    };
  });

  // Animated styles for expanded content (fade in/out)
  const animatedExpandedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sheetProgress.value,
      [0, 0.3, 1],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    const translateYVal = interpolate(
      sheetProgress.value,
      [0, 0.5, 1],
      [20, 10, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY: translateYVal }],
      // When fully collapsed, don't let it intercept touches
      pointerEvents: sheetProgress.value < 0.2 ? 'none' : 'auto',
    };
  });

  // Animated styles for collapsed content (fade in/out)
  const animatedCollapsedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sheetProgress.value,
      [0, 0.4, 0.7],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );
    const translateYVal = interpolate(
      sheetProgress.value,
      [0, 0.5, 1],
      [0, -5, -15],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY: translateYVal }],
      // When fully expanded, don't let it intercept touches
      pointerEvents: sheetProgress.value > 0.6 ? 'none' : 'auto',
    };
  });

  const animatedFloatingSafetyStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      sheetProgress.value,
      [0, 0.25, 0.5],
      [1, 0.4, 0],
      Extrapolation.CLAMP
    );
    const translateYVal = interpolate(
      sheetProgress.value,
      [0, 0.5],
      [0, 12],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY: translateYVal }],
      pointerEvents: sheetProgress.value > 0.3 ? 'none' : 'auto',
    };
  });

  const handleFindDriver = () => {
    router.push('/searching');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* === FULL SCREEN MAP (always behind everything) === */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.mapBg}>
          {/* Roads */}
          <View style={[styles.road, { top: '15%', left: 0, right: 0, height: 3 }]} />
          <View style={[styles.road, { top: '30%', left: 0, right: 0, height: 2.5 }]} />
          <View style={[styles.road, { top: '45%', left: 0, right: 0, height: 3 }]} />
          <View style={[styles.road, { top: '60%', left: 0, right: 0, height: 2 }]} />
          <View style={[styles.road, { top: '75%', left: 0, right: 0, height: 2.5 }]} />
          <View style={[styles.road, { top: '90%', left: 0, right: 0, height: 3 }]} />
          <View style={[styles.road, { left: '15%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
          <View style={[styles.road, { left: '35%', top: 0, bottom: 0, width: 2.5, height: '100%' }]} />
          <View style={[styles.road, { left: '55%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
          <View style={[styles.road, { left: '75%', top: 0, bottom: 0, width: 2.5, height: '100%' }]} />
          <View style={[styles.road, { left: '92%', top: 0, bottom: 0, width: 2, height: '100%' }]} />

          {/* Green areas */}
          <View style={[styles.greenArea, { top: '8%', left: '5%', width: 70, height: 50 }]} />
          <View style={[styles.greenArea, { top: '22%', right: '8%', width: 55, height: 40 }]} />
          <View style={[styles.greenArea, { top: '50%', left: '40%', width: 50, height: 35 }]} />
          <View style={[styles.greenArea, { top: '70%', left: '8%', width: 60, height: 40 }]} />
          <View style={[styles.greenArea, { top: '85%', right: '15%', width: 45, height: 30 }]} />

          {/* Buildings */}
          <View style={[styles.building, { top: '12%', left: '40%' }]} />
          <View style={[styles.building, { top: '28%', left: '60%', width: 40, height: 28 }]} />
          <View style={[styles.building, { top: '38%', left: '10%', width: 35, height: 22 }]} />
          <View style={[styles.building, { top: '18%', right: '25%', width: 30, height: 25 }]} />
          <View style={[styles.building, { top: '55%', right: '20%', width: 38, height: 26 }]} />
          <View style={[styles.building, { top: '65%', left: '25%', width: 32, height: 20 }]} />
          <View style={[styles.building, { top: '80%', left: '50%', width: 36, height: 24 }]} />

          {/* Route lines */}
          <View style={styles.routeLine1} />
          <View style={styles.routeLine2} />
          <View style={styles.routeLine3} />

          {/* Pickup Marker */}
          <View style={styles.pickupMarker}>
            <View style={styles.pickupPulse} />
            <View style={styles.pickupDot} />
          </View>

          {/* Dropoff Marker */}
          <View style={styles.dropoffMarker}>
            <View style={styles.dropoffPin}>
              <Ionicons name="location" size={18} color="#E91E8F" />
            </View>
            <View style={styles.dropoffShadow} />
          </View>

          {/* ETA badge */}
          <View style={styles.mapEtaBadge}>
            <Text style={styles.mapEtaText}>9 min</Text>
          </View>
        </View>
      </View>

      {/* White gradient at top */}
      <LinearGradient
        colors={['#FFFFFF', 'rgba(255,255,255,0)']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Location Card (fixed at top) */}
      <View style={styles.locationCard}>
        <View style={styles.locationDots}>
          <View style={styles.dotGreen} />
          <View style={styles.dotLine} />
          <View style={styles.dotRed} />
        </View>
        <View style={styles.locationTexts}>
          <Text style={styles.locationPickup} numberOfLines={1}>
            Stasiun Cisauk - Intermoda BSD
          </Text>
          <View style={styles.locationDivider} />
          <Text style={styles.locationDropoff} numberOfLines={1}>
            AEON Mall BSD City - Gate A
          </Text>
        </View>
        <TouchableOpacity style={styles.ubahBtn} activeOpacity={0.7}>
          <Ionicons name="pencil" size={14} color="#353535" />
          <Text style={styles.ubahText}>Ubah</Text>
        </TouchableOpacity>
      </View>

      {/* === ANIMATED BOTTOM SHEET === */}
      <GestureDetector gesture={sheetGesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          {/* Drag Handle - tap to toggle */}
          <GestureDetector gesture={tapGesture}>
            <View style={styles.dragHandleArea}>
              <View style={styles.dragHandle} />
            </View>
          </GestureDetector>

        {/* Both views are always rendered, opacity crossfade handles visibility */}

          {/* COLLAPSED: Mini bar with selected ride */}
          <Animated.View style={[styles.collapsedBarWrap, animatedCollapsedStyle]}>
            <View style={styles.collapsedBar}>
              <Image
                source={carImages[selectedRides[0]]}
                resizeMode="contain"
                style={styles.collapsedCarImage}
              />
              <View style={styles.collapsedInfo}>
                <Text style={styles.collapsedName}>
                  {selectedRides.length > 1
                    ? `${primaryRide?.name} +${selectedRides.length - 1}`
                    : primaryRide?.name}
                </Text>
                <Text style={styles.collapsedEta}>{primaryRide?.eta}</Text>
              </View>
              <Text style={styles.collapsedPrice}>
                {selectedRides.length > 1
                  ? `Mulai Rp${minPrice.toLocaleString('id-ID')}`
                  : primaryRide?.priceDisplay}
              </Text>
              <View style={styles.collapsedCheckbox}>
                <Ionicons name="checkmark" size={14} color="#FFF" />
              </View>
            </View>
          </Animated.View>

          {/* EXPANDED: Full ride list */}
          <Animated.View style={[styles.expandedWrap, animatedExpandedStyle]}>
          {/* Safety Banner */}
          <View style={styles.safetyCard}>
            <View style={styles.safetyRow}>
              <Ionicons name="shield-checkmark" size={18} color="#02B150" />
              <Text style={styles.safetyTitle}>Perjalanan kamu dijamin aman!</Text>
            </View>
            <Text style={styles.safetyDesc}>
              Kami sudah membuat protokol keamanan yang dapat memantau aktivitas driver untuk memastikan keamananmu.
            </Text>
          </View>

          {/* Scrollable Ride Options */}
          <ScrollView
            style={styles.rideScroll}
            contentContainerStyle={styles.rideScrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            nestedScrollEnabled
          >
            {rideTypes.map((ride, index) => {
              const isSelected = selectedRides.includes(ride.id);
              return (
                <TouchableOpacity
                  key={ride.id}
                  activeOpacity={0.7}
                  onPress={() => toggleRide(ride.id)}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['rgba(119,191,151,0.2)', 'rgba(2,177,80,0.2)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.rideOption}
                    >
                      <RideContent ride={ride} isSelected={isSelected} />
                    </LinearGradient>
                  ) : (
                    <View style={styles.rideOption}>
                      <RideContent ride={ride} isSelected={isSelected} />
                    </View>
                  )}
                  {index < rideTypes.length - 1 && (
                    <View style={styles.rideDivider} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* === FLOATING SAFETY CARD (visible when collapsed) === */}
      <Animated.View style={[styles.floatingSafetyCard, animatedFloatingSafetyStyle]}>
        <View style={styles.safetyRow}>
          <Ionicons name="shield-checkmark" size={18} color="#02B150" />
          <Text style={styles.safetyTitle}>Perjalanan kamu dijamin aman!</Text>
        </View>
        <Text style={styles.safetyDesc}>
          Kami sudah membuat protokol keamanan yang dapat memantau aktivitas driver untuk memastikan keamananmu.
        </Text>
      </Animated.View>

      {/* === FIXED BOTTOM BAR (always visible) === */}
      <View style={styles.fixedBottom}>
        <View style={styles.paymentRow}>
          <TouchableOpacity style={styles.qrisBadge} activeOpacity={0.7}>
            <Text style={styles.qrisText}>QRIS</Text>
            <Ionicons name="chevron-forward" size={14} color="#353535" />
          </TouchableOpacity>
          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>
              {selectedRides.length > 1 ? 'Mulai dari' : 'Total Harga'}
            </Text>
            <Text style={styles.totalPrice}>
              {selectedRides.length > 1
                ? `Rp${minPrice.toLocaleString('id-ID')}`
                : `Rp${primaryRide?.price.toLocaleString('id-ID') || '30.000'}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleFindDriver}
        >
          <Text style={styles.ctaText}>Temukan Driver</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

// Ride option content (expanded view only)
function RideContent({
  ride,
  isSelected,
}: {
  ride: any;
  isSelected: boolean;
}) {
  return (
    <>
      {/* Car Image */}
      <Image
        source={carImages[ride.id]}
        resizeMode="contain"
        style={styles.carImage}
      />

      {/* Info */}
      <View style={styles.rideInfo}>
        <Text style={styles.rideName}>{ride.name}</Text>
        <Text style={styles.rideEta}>{ride.eta}</Text>
        <Text style={styles.rideDesc}>{ride.description}</Text>
      </View>

      {/* Price + Checkbox */}
      <View style={styles.ridePriceWrap}>
        <Text style={styles.ridePrice}>{ride.priceDisplay}</Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0E4',
  },

  // === FULL SCREEN MAP ===
  mapBg: {
    flex: 1,
    backgroundColor: '#E8F0E4',
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
  building: {
    position: 'absolute',
    width: 35,
    height: 25,
    backgroundColor: '#D7CCC8',
    borderRadius: 3,
    opacity: 0.5,
  },
  routeLine1: {
    position: 'absolute',
    top: '18%',
    left: '12%',
    width: 4,
    height: 120,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  routeLine2: {
    position: 'absolute',
    top: '18%',
    left: '12%',
    width: 180,
    height: 4,
    backgroundColor: '#2979FF',
    borderRadius: 2,
    transform: [{ rotate: '25deg' }],
  },
  routeLine3: {
    position: 'absolute',
    top: '38%',
    left: '52%',
    width: 4,
    height: 80,
    backgroundColor: '#2979FF',
    borderRadius: 2,
  },
  pickupMarker: {
    position: 'absolute',
    top: '14%',
    left: '9%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupPulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,170,19,0.15)',
    position: 'absolute',
  },
  pickupDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#02B150',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  dropoffMarker: {
    position: 'absolute',
    top: '45%',
    left: '55%',
    alignItems: 'center',
  },
  dropoffPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dropoffShadow: {
    width: 10,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginTop: 2,
  },
  mapEtaBadge: {
    position: 'absolute',
    top: '30%',
    left: '38%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    ...Shadows.sm,
  },
  mapEtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2979FF',
  },

  // Top gradient
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    zIndex: 5,
  },

  // Location Card (fixed at top, above map)
  locationCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 36,
    left: 17,
    right: 17,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 11,
    zIndex: 10,
    ...Shadows.md,
  },
  locationDots: {
    alignItems: 'center',
    marginRight: 10,
    height: 40,
    justifyContent: 'space-between',
  },
  dotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#02B150',
  },
  dotLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#00000020',
    marginVertical: 2,
  },
  dotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E8F',
  },
  locationTexts: {
    flex: 1,
    marginRight: 3,
  },
  locationPickup: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#00000020',
    marginBottom: 5,
  },
  locationDropoff: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ubahBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...Shadows.sm,
  },
  ubahText: {
    color: '#353535',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  // === BOTTOM SHEET ===
  bottomSheet: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 144,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Shadows.top,
    zIndex: 15,
    overflow: 'hidden',
  },

  // Drag handle - enlarged area for easy grabbing
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  dragHandle: {
    width: 49,
    height: 5,
    backgroundColor: '#00000030',
    borderRadius: 3,
  },

  // Collapsed mini bar wrapper (absolutely positioned so both views can overlap)
  collapsedBarWrap: {
    position: 'absolute',
    top: DRAG_HANDLE_HEIGHT,
    left: 0,
    right: 0,
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 14,
  },
  collapsedCarImage: {
    width: 45,
    height: 34,
    marginRight: 10,
  },
  collapsedInfo: {
    flex: 1,
  },
  collapsedName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#353535',
  },
  collapsedEta: {
    fontSize: 11,
    color: '#888',
  },
  collapsedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#353535',
    marginRight: 10,
  },
  collapsedCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#02B150',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Expanded content wrapper
  expandedWrap: {
    flex: 1,
  },

  // Ride scroll
  rideScroll: {
    flex: 1,
  },
  rideScrollContent: {
    paddingBottom: 20,
  },

  // Safety Card (inside bottom sheet)
  safetyCard: {
    backgroundColor: '#F8FFF8',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(2,177,80,0.15)',
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  safetyTitle: {
    color: '#353535',
    fontSize: 13,
    fontWeight: 'bold',
  },
  safetyDesc: {
    color: '#666',
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 2,
  },

  // Floating safety card (shown when sheet is collapsed)
  floatingSafetyCard: {
    position: 'absolute',
    bottom: BOTTOM_SHEET_BOTTOM + COLLAPSED_HEIGHT + 10,
    left: 16,
    right: 16,
    backgroundColor: '#F8FFF8',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(2,177,80,0.20)',
    zIndex: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },

  // Ride Options
  rideOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  rideDivider: {
    height: 1,
    backgroundColor: '#00000010',
    marginHorizontal: 30,
  },

  // Car images
  carImage: {
    width: 73,
    height: 55,
    marginRight: 11,
  },

  // Ride info
  rideInfo: {
    flex: 1,
  },
  rideName: {
    color: '#353535',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rideEta: {
    color: '#555',
    fontSize: 11,
  },
  rideDesc: {
    color: '#888',
    fontSize: 11,
  },
  ridePriceWrap: {
    alignItems: 'flex-end',
    gap: 8,
  },
  ridePrice: {
    color: '#353535',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ridePriceCompact: {
    fontSize: 12,
  },
  checkbox: {
    width: 30,
    height: 30,
    backgroundColor: '#F6F6F6',
    borderColor: '#00000017',
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#02B150',
    borderColor: '#02B150',
  },

  // === FIXED BOTTOM BAR ===
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingHorizontal: 17,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Shadows.top,
    zIndex: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qrisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 14,
    ...Shadows.md,
  },
  qrisText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#353535',
    letterSpacing: 1,
  },
  totalWrap: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    color: '#353535',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#353535',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: '#02B150',
    borderRadius: 33,
    paddingVertical: 14,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
