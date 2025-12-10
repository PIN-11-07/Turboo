import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const ratingStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.darkGrey,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: palette.darkGrey,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontFamily: 'OTJubileeGolden-Italic',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 8,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topContent: {
    gap: 18,
  },
  titleSection: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
    fontFamily: 'OTJubileeGolden',
  },
  subtitle: {
    fontSize: 15,
    color: palette.champagne,
    lineHeight: 20,
    fontFamily: 'OTJubileeGolden',
  },
  vehicleBox: {
    borderRadius: 12,
    backgroundColor: palette.darkGrey,
    borderWidth: 1,
    borderColor: palette.darkMustard,
    padding: 16,
  },
  vehicleLabel: {
    color: palette.white,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: 'OTJubileeGolden-ExtraLightItalic',
  },
  vehicleValue: {
    color: palette.white,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: 'OTJubileeGolden',
  },
  ratingSection: {
    gap: 12,
  },
  prompt: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'OTJubileeGolden',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 6,
  },
  infoBox: {
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    padding: 0,
  },
  infoText: {
    color: palette.champagne,
    lineHeight: 20,
    fontFamily: 'BaiJamjuree-Regular',
    textAlign: 'center',
  },
  errorText: {
    color: palette.danger,
    marginTop: -4,
    fontFamily: 'BaiJamjuree-Regular',
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: palette.mustard,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: palette.champagne,
  },
  primaryButtonText: {
    color: palette.darkGrey,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'BaiJamjuree-Regular',
  },
  primaryButtonTextPressed: {
    color: palette.darkMustard,
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.darkMustard,
    backgroundColor: palette.darkGrey,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(187, 126, 29, 0.1)',
    borderColor: palette.mustard,
  },
  secondaryButtonText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'OTJubileeGolden',
  },
  secondaryButtonTextPressed: {
    color: palette.mustard,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
