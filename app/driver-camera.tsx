import React, { useState, useEffect, useRef } from 'react';
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

// Simulated camera view — no expo-camera dependency needed for demo
const useCameraPermissions: () => [{ granted: boolean } | null, () => Promise<any>] =
  () => [{ granted: true }, () => Promise.resolve({ granted: true })];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SCAN_DELAY_MS = 2500;

// Face box positions tuned to match the mockup photo
const FACE_BOXES = [
  {
    key: 'driver',
    label: 'Driver',
    color: '#02B150',
    top: SCREEN_HEIGHT * 0.35,
    left: SCREEN_WIDTH * 0.03,
    width: SCREEN_WIDTH * 0.44,
    height: SCREEN_HEIGHT * 0.28,
  },
  {
    key: 'penumpang',
    label: 'Penumpang',
    color: '#E91E8F',
    top: SCREEN_HEIGHT * 0.29,
    left: SCREEN_WIDTH * 0.50,
    width: SCREEN_WIDTH * 0.40,
    height: SCREEN_HEIGHT * 0.25,
  },
];

export default function DriverCameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);

  // Animation values
  const scanLineY = useRef(new Animated.Value(0)).current;
  const boxOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Scanning line animation
  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();
    return () => scanLoop.stop();
  }, []);

  // Simulate face detection after delay
  useEffect(() => {
    const t = setTimeout(() => {
      setScanning(false);
      setDetected(true);
      // Fade in boxes
      Animated.timing(boxOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        // Pulse loop after fade-in
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.04, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          ])
        ).start();
      });
    }, SCAN_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Permission not yet determined
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.permCard}>
          <View style={styles.permIconWrap}>
            <Ionicons name="camera-outline" size={40} color="#02B150" />
          </View>
          <Text style={styles.permTitle}>Izin Kamera Diperlukan</Text>
          <Text style={styles.permDesc}>
            Aplikasi membutuhkan akses kamera untuk memverifikasi keberadaan driver dan penumpang demi keamanan perjalanan.
          </Text>
          <TouchableOpacity
            style={styles.permBtn}
            activeOpacity={0.85}
            onPress={requestPermission}
          >
            <Text style={styles.permBtnText}>Izinkan Akses Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.permSkipBtn}
            activeOpacity={0.7}
            onPress={() => router.replace('/driver-home')}
          >
            <Text style={styles.permSkipText}>Lewati</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const scanTranslateY = scanLineY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT * 0.55],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Face recognition mockup background */}
      <Image
        source={require('../resources/images/Mockup/face recognition.png')}
        style={styles.camera}
        resizeMode="contain"
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Scanning line */}
      {scanning && (
        <Animated.View
          style={[
            styles.scanLine,
            { transform: [{ translateY: scanTranslateY }] },
          ]}
        />
      )}

      {/* Face detection boxes — fade in after scan */}
      {detected && FACE_BOXES.map((box) => (
        <Animated.View
          key={box.key}
          style={[
            styles.faceBox,
            {
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              opacity: boxOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={[styles.corner, styles.cornerTL, { borderColor: box.color }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: box.color }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: box.color }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: box.color }]} />
          <View style={[styles.faceLabel, { backgroundColor: box.color }]}>
            <Text style={styles.faceLabelText}>{box.label}</Text>
          </View>
        </Animated.View>
      ))}

      {/* Top prompt */}
      <View style={styles.prompt}>
        <View style={styles.promptIcon}>
          <Image
            source={require('../resources/icons/icon-small.png')}
            style={styles.promptShieldIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.promptText}>
          Pastikan posisi kamera dapat menangkap wajah driver dan penumpang
        </Text>
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {/* Status */}
        <View style={styles.statusRow}>
          {scanning ? (
            <>
              <Animated.View style={[styles.statusDot, { backgroundColor: '#F4B400' }]} />
              <Text style={styles.statusText}>Memindai wajah...</Text>
            </>
          ) : (
            <>
              <View style={[styles.statusDot, { backgroundColor: '#02B150' }]} />
              <Text style={[styles.statusText, { color: '#02B150' }]}>
                2 wajah terdeteksi
              </Text>
              <Ionicons name="checkmark-circle" size={18} color="#02B150" />
            </>
          )}
        </View>

        {/* Detected count row */}
        {detected && (
          <View style={styles.detectedRow}>
            <View style={styles.detectedItem}>
              <View style={[styles.detectedDot, { backgroundColor: '#02B150' }]} />
              <Text style={styles.detectedLabel}>Driver terdeteksi</Text>
            </View>
            <View style={styles.detectedItem}>
              <View style={[styles.detectedDot, { backgroundColor: '#E91E8F' }]} />
              <Text style={styles.detectedLabel}>Penumpang terdeteksi</Text>
            </View>
          </View>
        )}

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmBtn, !detected && styles.confirmBtnDisabled]}
          activeOpacity={detected ? 0.85 : 1}
          disabled={!detected}
          onPress={() => router.replace('/driver-trip')}
        >
          <LinearGradient
            colors={detected ? ['#02B150', '#00D95F'] : ['#CCC', '#CCC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmGradient}
          >
            <Ionicons
              name={detected ? 'checkmark-circle' : 'time-outline'}
              size={22}
              color="#FFF"
            />
            <Text style={styles.confirmText}>
              {detected ? 'Konfirm & Mulai Perjalanan' : 'Mendeteksi Wajah...'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Permission screen
  permContainer: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    ...Shadows.lg,
  },
  permIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(2,177,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#353535',
    marginBottom: 10,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permBtn: {
    backgroundColor: '#02B150',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  permBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  permSkipBtn: {
    paddingVertical: 8,
  },
  permSkipText: {
    fontSize: 14,
    color: '#AAA',
  },

  // Camera
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#1a1a2e',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  // Scan line
  scanLine: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#02B150',
    opacity: 0.7,
    shadowColor: '#02B150',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  // Face boxes
  faceBox: {
    position: 'absolute',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2.5,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  faceLabel: {
    position: 'absolute',
    top: -22,
    left: 0,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  faceLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },

  // Prompt
  prompt: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Shadows.md,
  },
  promptIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(2,177,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  promptShieldIcon: {
    width: 18,
    height: 18,
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    color: '#353535',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    paddingHorizontal: 24,
    gap: 12,
    ...Shadows.top,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detectedRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detectedLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  confirmBtn: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
