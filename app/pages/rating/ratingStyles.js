import { StyleSheet } from 'react-native'

const palette = {
  background: '#050505',
  surface: '#111111',
  accent: '#C58A1A',
  accentDark: '#8A5C0D',
  textPrimary: '#FFFFFF',
  textSecondary: '#C4C4C4',
  textMuted: '#4C4C4C',
  border: 'rgba(197,138,26,0.35)',
  overlay: 'rgba(197,138,26,0.12)',
  danger: '#FF6B6B',
}

export const ratingStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    paddingVertical: 34,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: palette.border,
  },
  close: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: palette.accent,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: palette.textSecondary,
    marginBottom: 22,
  },
  vehicleBox: {
    borderRadius: 18,
    backgroundColor: palette.overlay,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 22,
  },
  vehicleLabel: {
    color: palette.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  vehicleValue: {
    color: palette.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  prompt: {
    textAlign: 'center',
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.overlay,
    padding: 14,
    marginBottom: 16,
  },
  infoText: {
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    color: palette.danger,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: palette.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})