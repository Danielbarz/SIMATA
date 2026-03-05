import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Shadows } from '../constants/theme';

const SIMATA_FACTS = [
  'SIMATA adalah infrastruktur keamanan digital yang mengintegrasikan teknologi Edge-AI Computer Vision untuk mendeteksi perilaku anomali di dalam kabin secara preventif.',
  'Sistem ini secara aktif memitigasi risiko kekerasan seksual melalui algoritma Real-time Pose Estimation guna menjamin keamanan perjalanan Anda.',
  'SIMATA hadir untuk mewujudkan standar baru keamanan transportasi nasional yang inklusif melalui monitoring aktif yang patuh terhadap regulasi privasi.',
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
        setCurrentIndex((prev) => (prev + 1) % SIMATA_FACTS.length);
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
            <Ionicons name="shield-checkmark" size={16} color="#02B150" />
          </View>
          <Text style={styles.headerText}>SIMATA Safety</Text>
          {/* Progress dots */}
          <View style={styles.dots}>
            {SIMATA_FACTS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.factText}>{SIMATA_FACTS[currentIndex]}</Text>
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
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#02B150',
    flex: 1,
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
