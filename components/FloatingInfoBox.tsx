import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows } from '../constants/theme';

const SAFETY_FACTS = [
  'Platform ini adalah infrastruktur keamanan digital yang mengintegrasikan teknologi Edge-AI Computer Vision untuk mendeteksi perilaku anomali di dalam kabin secara preventif.',
  'Sistem ini secara aktif memitigasi risiko kekerasan seksual melalui algoritma Real-time Pose Estimation guna menjamin keamanan perjalanan Anda.',
  'Platform ini hadir untuk mewujudkan standar baru keamanan transportasi nasional yang inklusif melalui monitoring aktif yang patuh terhadap regulasi privasi.',
  'Memberikan perlindungan proaktif melalui pemrosesan data lokal (on-device) guna memastikan privasi mutlak bagi penumpang dan mitra pengemudi.',
  'Menyediakan infrastruktur bukti digital yang sah secara hukum sesuai amanat UU TPKS untuk memperkuat perlindungan bagi setiap pengguna.',
];

const ROTATE_INTERVAL = 5000; // 5 seconds per message

export default function FloatingInfoBox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // Change text
        setCurrentIndex((prev) => (prev + 1) % SAFETY_FACTS.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Image
              source={require('../resources/icons/icon-small.png')}
              style={styles.headerShieldIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerBrandRow}>
            <Image
              source={require('../resources/icons/icon-full.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>Safety</Text>
          </View>
          {/* Progress dots */}
          <View style={styles.dots}>
            {SAFETY_FACTS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.factText}>{SAFETY_FACTS[currentIndex]}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(2, 177, 80, 0.15)',
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(2, 177, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerShieldIcon: {
    width: 16,
    height: 16,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02B150',
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  headerLogo: {
    width: 60,
    height: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD',
  },
  dotActive: {
    backgroundColor: '#02B150',
    width: 16,
  },
  factText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
});
