import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const homeScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: palette.background,
  },
  emptyList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
    backgroundColor: palette.background,
  },
  topSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: palette.background,
  },
  hero: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: palette.textMuted,
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    color: palette.textMuted,
  },
  searchInput: {
    fontSize: 16,
    color: palette.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardImagePlaceholder: {
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: palette.textSecondary,
    fontWeight: '600',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  cardSubtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: palette.textMuted,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.accent,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  cardBadge: {
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    color: palette.accent,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  cardLocation: {
    fontSize: 13,
    color: palette.textMuted,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: palette.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  errorText: {
    color: palette.danger,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(4, 4, 4, 0.85)',
  },
})

export const homeListingDetailScreenStyles = StyleSheet.create({
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
})
