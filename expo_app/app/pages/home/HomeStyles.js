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
  
  // Enhanced Search Styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  enhancedSearchInput: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 44,
    paddingVertical: 12,
    fontSize: 16,
    color: palette.textPrimary,
  },
  searchInputFocused: {
    borderColor: palette.accent,
  },
  searchIconLeft: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.border,
  },
  controlButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: palette.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    minWidth: 64,
  },
  controlButtonActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  controlButtonText: {
    color: palette.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  controlButtonTextActive: {
    color: palette.background,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: palette.accent,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Grid View Styles  
  gridContainer: {
    paddingHorizontal: 10,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor: palette.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  gridImageContainer: {
    aspectRatio: 4/3,
    width: '100%',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.overlay,
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridPrice: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gridYear: {
    color: palette.textMuted,
    fontSize: 12,
  },
  aiSearchContainer: {
    marginTop: 12,
  },
  aiButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiSmallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  aiSmallButtonText: {
    color: palette.background,
    fontWeight: '700',
    marginLeft: 8,
  },
  aiPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiPreviewImage: {
    width: 96,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: palette.overlay,
  },
  removeImageButtonSmall: {
    backgroundColor: palette.surface,
    padding: 8,
    borderRadius: 8,
  },
  removeImageX: {
    color: palette.danger,
    fontWeight: '700',
  },
})
