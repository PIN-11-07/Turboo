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
  recommendationsSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: 'rgba(245, 197, 24, 0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.18)',
    marginBottom: 12,
  },
  recommendationHero: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.accent,
  },
  recommendationSubtitle: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 6,
  },
  recommendationList: {
    paddingVertical: 6,
  },
  recommendationItem: {
    flexBasis: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  recommendationImage: {
    width: '100%',
    height: 110,
  },
  recommendationItemContent: {
    padding: 10,
  },
  recommendationItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  recommendationItemPrice: {
    fontSize: 13,
    color: palette.accent,
    marginTop: 6,
    fontWeight: '700',
  },
  recommendButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: palette.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  recommendButtonText: {
    color: palette.accent,
    fontWeight: '700',
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
  cardImageWrapper: {
    position: 'relative',
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 4, 4, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  favoriteButtonDisabled: {
    opacity: 0.65,
  },
  favoriteIcon: {
    fontSize: 20,
    color: palette.textPrimary,
  },
  favoriteIconActive: {
    color: palette.danger,
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
