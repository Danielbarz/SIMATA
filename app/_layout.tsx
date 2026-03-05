import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

// Disable text selection globally on web
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = '* { -webkit-user-select: none !important; user-select: none !important; cursor: default; } input, textarea { user-select: text !important; -webkit-user-select: text !important; }';
  document.head.appendChild(style);
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="test" />
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" options={{ animation: 'fade' }} />
      <Stack.Screen name="order" />
      <Stack.Screen name="searching" />
      <Stack.Screen name="trip" />
      <Stack.Screen name="driver-home" />
      <Stack.Screen name="driver-order" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="driver-pickup" />
      <Stack.Screen name="driver-camera" options={{ animation: 'fade' }} />
      <Stack.Screen name="driver-trip" />
    </Stack>
  );
}
