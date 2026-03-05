import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Shadows } from '../constants/theme';

export default function DriverHomeScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const orderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate incoming order after going active
  useEffect(() => {
    if (isActive) {
      orderTimer.current = setTimeout(() => {
        router.push('/driver-order');
      }, 4000);
    } else {
      if (orderTimer.current) clearTimeout(orderTimer.current);
    }
    return () => {
      if (orderTimer.current) clearTimeout(orderTimer.current);
    };
  }, [isActive]);

  // Pulse animation for active state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      pulseLoop.current = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.35,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.4,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
      pulseOpacity.setValue(0.4);
    }
    return () => pulseLoop.current?.stop();
  }, [isActive]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={22} color="#353535" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mode Driver</Text>
        <View style={styles.onlineBadge}>
          <View style={[styles.onlineDot, isActive && styles.onlineDotActive]} />
          <Text style={[styles.onlineText, isActive && styles.onlineTextActive]}>
            {isActive ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>

        {/* Status label */}
        <Text style={styles.statusLabel}>
          {isActive ? 'Kamu sedang menerima order' : 'Kamu sedang offline'}
        </Text>
        <Text style={styles.statusSub}>
          {isActive
            ? 'Tekan tombol untuk berhenti menerima order'
            : 'Tekan tombol untuk mulai menerima order'}
        </Text>

        {/* Big Toggle Button */}
        <View style={styles.toggleWrap}>
          {/* Pulse ring */}
          {isActive && (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsActive((prev) => !prev)}
          >
            {isActive ? (
              <LinearGradient
                colors={['#02B150', '#00D95F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.toggleBtn}
              >
                <Ionicons name="car" size={42} color="#FFF" />
                <Text style={styles.toggleTextActive}>AKTIF</Text>
              </LinearGradient>
            ) : (
              <View style={styles.toggleBtnInactive}>
                <Ionicons name="car" size={42} color="#AAA" />
                <Text style={styles.toggleTextInactive}>MULAI</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={20} color="#02B150" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Trip Hari Ini</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Ionicons name="wallet-outline" size={20} color="#02B150" />
            <Text style={styles.statValue}>Rp0</Text>
            <Text style={styles.statLabel}>Pendapatan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={20} color="#02B150" />
            <Text style={styles.statValue}>5.0</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353535',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
  },
  onlineDotActive: {
    backgroundColor: '#02B150',
  },
  onlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#AAA',
  },
  onlineTextActive: {
    color: '#02B150',
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#353535',
    textAlign: 'center',
  },
  statusSub: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Toggle
  toggleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: 160,
    height: 160,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#02B150',
  },
  toggleBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.lg,
  },
  toggleBtnInactive: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 3,
    borderColor: '#DDD',
  },
  toggleTextActive: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  toggleTextInactive: {
    color: '#AAA',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
    ...Shadows.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEE',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#353535',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
  },
});
