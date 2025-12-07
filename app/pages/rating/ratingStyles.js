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
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topContent: {
    gap: 18,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.accent,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  vehicleBox: {
    borderRadius: 18,
    backgroundColor: palette.overlay,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
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
    lineHeight: 22,
  },
  ratingSection: {
    gap: 12,
  },
  prompt: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 6,
  },
  infoBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.overlay,
    padding: 14,
  },
  infoText: {
    color: palette.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    color: palette.danger,
    marginTop: -4,
  },
  buttonGroup: {
    gap: 12,
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
