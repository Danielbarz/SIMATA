import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Colors, FontSize, Shadows } from '../constants/theme';
import { mockDriver } from '../constants/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SIMATA_FACTS = [
  {
    icon: 'eye-outline' as const,
    text: 'SIMATA adalah infrastruktur keamanan digital yang mengintegrasikan teknologi Edge-AI Computer Vision untuk mendeteksi perilaku anomali di dalam kabin secara preventif.',
  },
  {
    icon: 'body-outline' as const,
    text: 'Sistem ini secara aktif memitigasi risiko kekerasan seksual melalui algoritma Real-time Pose Estimation guna menjamin keamanan perjalanan Anda.',
  },
  {
    icon: 'globe-outline' as const,
    text: 'SIMATA hadir untuk mewujudkan standar baru keamanan transportasi nasional yang inklusif melalui monitoring aktif yang patuh terhadap regulasi privasi.',
  },
  {
    icon: 'phone-portrait-outline' as const,
    text: 'Memberikan perlindungan proaktif melalui pemrosesan data lokal (on-device) guna memastikan privasi mutlak bagi penumpang dan mitra pengemudi.',
  },
  {
    icon: 'document-text-outline' as const,
    text: 'Menyediakan infrastruktur bukti digital yang sah secara hukum sesuai amanat UU TPKS untuk memperkuat perlindungan bagi setiap pengguna.',
  },
];

const ROTATE_INTERVAL = 2500;
const DRIVER_SEARCH_TIMEOUT = 8000;
const FOUND_REDIRECT_DELAY = 1200;

export default function SearchingScreen() {
  const router = useRouter();
  const [found, setFound] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Simulate finding driver faster for better UX.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFound(true);
    }, DRIVER_SEARCH_TIMEOUT);
    return () => clearTimeout(timer);
  }, []);

  // Rotate facts
  useEffect(() => {
    if (found) return;
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setFactIndex((prev) => (prev + 1) % SIMATA_FACTS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [found]);

  // Found animation
  useEffect(() => {
    if (found) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        router.replace('/trip');
      }, FOUND_REDIRECT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [found]);

  const currentFact = SIMATA_FACTS[factIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={[styles.road, { top: '20%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '40%', left: 0, right: 0, height: 2.5 }]} />
        <View style={[styles.road, { top: '60%', left: 0, right: 0, height: 3 }]} />
        <View style={[styles.road, { top: '80%', left: 0, right: 0, height: 2 }]} />
        <View style={[styles.road, { left: '25%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.road, { left: '55%', top: 0, bottom: 0, width: 2.5, height: '100%' }]} />
        <View style={[styles.road, { left: '80%', top: 0, bottom: 0, width: 3, height: '100%' }]} />
        <View style={[styles.greenArea, { top: '10%', left: '5%', width: 60, height: 45 }]} />
        <View style={[styles.greenArea, { top: '50%', right: '10%', width: 50, height: 35 }]} />
        <View style={[styles.greenArea, { top: '70%', left: '35%', width: 45, height: 30 }]} />

        {/* Lottie Animation - in white card */}
        <View style={styles.lottieWrap}>
          <LottieView
            source={require('../resources/animations/Safety.json')}
            autoPlay
            loop
            style={styles.lottieAnim}
          />
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomCard}>
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandle} />
        </View>

        {!found ? (
          <>
            {/* Searching Status */}
            <View style={styles.searchingHeader}>
              <View style={styles.searchingDot}>
                <View style={styles.searchingDotPulse} />
                <View style={styles.searchingDotCore} />
              </View>
              <View>
                <Text style={styles.searchTitle}>Mencari Driver...</Text>
                <Text style={styles.searchSubtitle}>Mencarikan driver terdekat untukmu</Text>
              </View>
            </View>

            {/* Route Info */}
            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeText}>Stasiun Cisauk - Intermoda BSD</Text>
              </View>
              <View style={styles.routeLineV} />
              <View style={styles.routeRow}>
                <View style={styles.dotPink} />
                <Text style={styles.routeText}>AEON Mall BSD City - Gate A</Text>
              </View>
            </View>

            {/* SIMATA Fact Card - matches floating box style */}
            <Animated.View style={[styles.factCard, { opacity: fadeAnim }]}>
              <View style={styles.factHeader}>
                <View style={styles.factIconWrap}>
                  <Ionicons name={currentFact.icon as any} size={18} color="#E91E8F" />
                </View>
                <Text style={styles.factLabel}>SIMATA Safety</Text>
                <View style={styles.factDots}>
                  {SIMATA_FACTS.map((_, i) => (
                    <View
                      key={i}
                      style={[styles.factDot, i === factIndex && styles.factDotActive]}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.factText}>{currentFact.text}</Text>
            </Animated.View>
          </>
        ) : (
          /* Driver Found */
          <Animated.View
            style={[
              styles.foundContent,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color="#FFF" />
            </View>
            <Text style={styles.foundTitle}>Driver Ditemukan!</Text>
            <Text style={styles.foundSubtitle}>
              {mockDriver.name} sedang menuju ke lokasimu
            </Text>
          </Animated.View>
        )}
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

  // Lottie
  lottieWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnim: {
    width: 200,
    height: 200,
  },

  // Bottom card
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
    backgroundColor: '#00000030',
    borderRadius: 3,
  },

  // Searching header
  searchingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 14,
  },
  searchingDot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingDotPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(2,177,80,0.12)',
  },
  searchingDotCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#02B150',
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353535',
  },
  searchSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  // Route
  routeInfo: {
    marginHorizontal: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeLineV: {
    width: 1.5,
    height: 16,
    backgroundColor: '#DDD',
    marginLeft: 5.5,
    marginVertical: 3,
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
  },

  // SIMATA Fact Card
  factCard: {
    marginHorizontal: 24,
    backgroundColor: '#F8FFF8',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(2,177,80,0.15)',
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(233,30,143,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  factLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02B150',
    flex: 1,
  },
  factDots: {
    flexDirection: 'row',
    gap: 4,
  },
  factDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD',
  },
  factDotActive: {
    backgroundColor: '#E91E8F',
    width: 16,
  },
  factText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },

  // Found
  foundContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E91E8F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  foundTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E91E8F',
    marginBottom: 8,
  },
  foundSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
