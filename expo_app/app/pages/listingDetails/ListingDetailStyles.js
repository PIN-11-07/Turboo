import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const listingDetailScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: palette.background,
  },
  loader: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: palette.danger,
  },
  errorText: {
    color: palette.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  galleryWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryImage: {
    height: 220,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: palette.overlay,
  },
  galleryPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryPlaceholderText: {
    color: palette.textMuted,
    fontSize: 16,
  },
  section: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 22,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  price: {
    fontSize: 20,
    color: palette.accent,
    fontWeight: '600',
    marginTop: 8,
  },
  caption: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: palette.textSecondary,
  },
  sellerName: {
    fontSize: 16,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  sellerNamePlaceholder: {
    color: palette.textMuted,
    fontWeight: '500',
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attributeRowSpacing: {
    marginTop: 12,
  },
  attributeLabel: {
    fontSize: 15,
    color: palette.textMuted,
  },
  attributeValue: {
    fontSize: 15,
    color: palette.textPrimary,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  favoriteButtonActive: {},
  favoriteButtonDisabled: {
    opacity: 0.6,
  },
  favoriteIcon: {
    fontSize: 20,
    color: palette.textPrimary,
  },
  favoriteIconActive: {
    color: palette.danger,
  },
  purchaseText: {
    color: palette.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  buyButton: {
    marginTop: 4,
    backgroundColor: palette.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '700',
  },
})
