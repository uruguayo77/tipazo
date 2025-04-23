export const colors = {
  primary: '#3B82F6',
  primaryLight: '#93C5FD',
  primaryDark: '#2563EB',
  secondary: '#10B981',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#059669',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  textDark: '#111827',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.gray[400],
    tabIconSelected: colors.primary,
    card: colors.card,
    border: colors.border,
  },
};