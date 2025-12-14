import { StyleSheet, Dimensions, Platform } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')
const FONT_FAMILY = 'OTJubileeGolden'

export const feedScreenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  emptyList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
    backgroundColor: '#000',
  },
  topSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#000',
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
    backgroundColor: palette.darkGrey,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: 110,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  recommendButtonText: {
    color: palette.champagne,
    fontWeight: '700',
    marginLeft: 8,
    fontFamily: FONT_FAMILY,
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
  cardWrapper: {
    width: '48%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
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

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInputWrapper: {
    flex: 1.4,
    position: 'relative',
  },
  enhancedSearchInput: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 44,
    fontSize: 16,
    color: palette.textPrimary,
    height: 40,
    paddingVertical: 0,
    borderRadius: 8
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
    paddingHorizontal: 6,
    backgroundColor: palette.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    minWidth: 54,
    height: 40,
    justifyContent: 'center'
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
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  gridImageContainer: {
    aspectRatio: 4 / 3,
    width: '100%',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.overlay,
  },

  gridContent: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    height: 75,
  },
  gridTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },

  gridPrice: {
    color: "#efc001ff",
    fontSize: 16,
    fontWeight: '700',
    marginTop: "auto",
    alignSelf: "flex-end",
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
    height: 6,
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

  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroTitles: {
    flex: 1,
  },
  heroTitleMain: {
    color: palette.champagne,
    fontSize: 50,
    fontWeight: "700",
    fontFamily: "OTJubileeGolden-Extralight",
  },


  heroTitleSub: {
    fontSize: 50,
    fontStyle: "italic",
    color: palette.champagne,
    marginTop: -6,
    fontFamily: "OTJubileeGolden-Italic",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.textPrimary,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modalText: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtonPrimary: {
    backgroundColor: palette.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtonSecondary: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonTextSecondary: {
    color: palette.textMuted,
    fontSize: 14,
  },

})
