import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Background decoration */}
      <View style={styles.bgDecor}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
      </View>

      {/* Logo & Title */}
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={['#02B150', '#00D95F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Ionicons name="car-sport" size={32} color="#FFF" />
          </LinearGradient>
        </View>
        <Text style={styles.appName}>SIMATA</Text>
        <Text style={styles.tagline}>Simulasi Transportasi Aman</Text>
      </View>

      {/* Role Selection */}
      <View style={styles.content}>
        <Text style={styles.selectTitle}>Pilih Mode Demo</Text>
        <Text style={styles.selectSubtitle}>
          Pilih peran yang ingin kamu coba
        </Text>

        {/* User Card */}
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => router.push('/splash?role=penumpang')}
        >
          <LinearGradient
            colors={['#02B150', '#00D95F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.roleGradient}
          >
            <View style={styles.roleIconWrap}>
              <Ionicons name="person" size={28} color="#02B150" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Penumpang</Text>
              <Text style={styles.roleDesc}>
                Pesan perjalanan, pilih tujuan, dan pantau driver
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Driver Card */}
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => router.push('/splash?role=driver')}
        >
          <View style={styles.roleCardInner}>
            <View style={[styles.roleIconWrap, styles.roleIconDriver]}>
              <Ionicons name="car" size={28} color="#02B150" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleName, { color: Colors.textPrimary }]}>Driver</Text>
              <Text style={[styles.roleDesc, { color: Colors.textSecondary }]}>
                Terima order, navigasi, dan selesaikan perjalanan
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SIMATA Demo v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    top: 100,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(2, 177, 80, 0.04)',
  },
  // Header
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    marginBottom: 40,
  },
  logoWrap: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  selectTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  // Role Cards
  roleCard: {
    borderRadius: 20,
    marginBottom: 16,
    ...Shadows.md,
    overflow: 'hidden',
  },
  roleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  roleCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: 20,
  },
  roleIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleIconDriver: {
    backgroundColor: 'rgba(2, 177, 80, 0.1)',
  },
  roleInfo: {
    flex: 1,
    marginRight: 8,
  },
  roleName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
