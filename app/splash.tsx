import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Colors, FontSize, Shadows } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'penumpang' | 'driver' }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === 'driver') {
        router.replace('/driver-home');
      } else {
        router.replace('/order');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [role]);

  const isDriver = role === 'driver';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Background decoration */}
      <View style={styles.bgDecor}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </View>

      {/* Logo */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={['#02B150', '#00D95F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Ionicons
              name={isDriver ? 'car' : 'person'}
              size={28}
              color="#FFF"
            />
          </LinearGradient>
        </View>
        <Text style={styles.modeLabel}>
          Mode {isDriver ? 'Driver' : 'Penumpang'}
        </Text>
      </View>

      {/* Lottie Animation */}
      <View style={styles.animWrap}>
        <LottieView
          source={require('../resources/animations/loading.json')}
          autoPlay
          loop
          style={styles.anim}
        />
      </View>

      {/* Bottom text */}
      <View style={styles.footer}>
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
        <View style={styles.appVersionRow}>
          <Image
            source={require('../resources/icons/icon-full.png')}
            style={styles.appVersionLogo}
            resizeMode="contain"
          />
          <Text style={styles.appVersion}>Demo v1.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  bgDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(2, 177, 80, 0.06)',
  },
  circle2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(2, 177, 80, 0.04)',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    marginBottom: 16,
  },
  logoWrap: {
    marginBottom: 14,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  modeLabel: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  animWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anim: {
    width: 240,
    height: 240,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    gap: 6,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  appVersion: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  appVersionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appVersionLogo: {
    width: 72,
    height: 16,
  },
});
