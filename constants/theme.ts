// SIMATA Ride-Hailing App — Design System
// Clean, Light Mode, Green-focused (Grab/Gojek style)

export const Colors = {
  // Primary - Green
  primary: '#00AA13',
  primaryLight: '#E8F5E9',
  primaryDark: '#008C10',
  primarySoft: '#F0FFF0',

  // Secondary
  secondary: '#1C1C1E',

  // Accent
  accent: '#FF6B00',       // Orange for highlights
  accentPink: '#E91E8F',   // Pink for dropoff marker
  accentBlue: '#2979FF',   // Blue for route/links

  // Semantic
  success: '#00AA13',
  warning: '#FFB300',
  error: '#F44336',
  info: '#2979FF',

  // Background
  background: '#FFFFFF',
  backgroundGray: '#F5F5F5',
  backgroundCard: '#FFFFFF',
  backgroundOverlay: 'rgba(0,0,0,0.04)',

  // Surface
  surface: '#FFFFFF',
  surfaceGray: '#F7F7F8',
  surfaceBorder: '#E8E8E8',
  surfaceDivider: '#F0F0F0',

  // Text
  textPrimary: '#1C1C1E',
  textSecondary: '#6E6E73',
  textMuted: '#AEAEB2',
  textWhite: '#FFFFFF',
  textGreen: '#00AA13',

  // Gradients
  gradientGreen: ['#00CC16', '#00AA13'],
  gradientLight: ['#FFFFFF', '#F5F5F5'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  top: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
};
