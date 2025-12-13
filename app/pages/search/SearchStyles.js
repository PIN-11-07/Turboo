import { StyleSheet, Dimensions } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')

const FONT = 'OTJubileeGolden'
const FONT_LIGHT = 'OTJubileeGolden-Extralight'
const FONT_ITALIC = 'OTJubileeGolden-Italic'

export const searchStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: palette.darkGrey,
    },
    container: {
        flex: 1,
        backgroundColor: palette.darkGrey,
    },

    /* HEADER */
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: palette.darkGrey,
    },

    /* SEARCH BAR — ORIGINAL */
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: palette.champagne,
    },
    searchIcon: {
        marginRight: 8,
        color: palette.champagne,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: palette.champagne,
        fontSize: 16,
        height: '100%',
        fontFamily: 'BaiJamjuree-Regular',
    },
    verticalDivider: {
        width: 1,
        height: 48,
        backgroundColor: palette.champagne,
        marginHorizontal: 12,
    },
    visualSearchButtonInside: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visualSearchButton: {
        marginLeft: 12,
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: palette.darkGrey,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: palette.champagne,
    },

    // AI Info Section
    aiInfoSection: {
        paddingVertical: 12,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    aiInfoText: {
        color: palette.lightGrey,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
        fontFamily: 'BaiJamjuree-Regular',
    },

    /* CATEGORIES */
    categoriesSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 27,
        fontFamily: FONT,
        color: palette.lightGrey,
        marginBottom: 30,
        marginTop: 10,
        paddingHorizontal: 16,
    },
    categoriesGrid: {
        paddingHorizontal: 11,
        paddingBottom: 8,
    },
    categoryCard: {
        flex: 1,
        margin: 5,
        height: 130,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: palette.darkGrey,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    categoryHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: palette.lightGrey,
        paddingVertical: 6,
        paddingHorizontal: 12,
        zIndex: 1,
    },
    categoryTitle: {
        color: palette.darkGrey,
        fontSize: 27,
        fontFamily: 'OTJubileeGolden-Extralight',
    },

    /* LIST / GRID */
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    gridContainer: {
        paddingHorizontal: 11,
        paddingBottom: 80,
    },

    // Card Styles (Matched to FeedStyles)
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 5,
        borderWidth: 1,
        width: '48%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardImageWrapper: {
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 130,
    },
    cardImagePlaceholder: {
        backgroundColor: palette.elevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImagePlaceholderText: {
        color: palette.textSecondary,
        fontWeight: '600',
    },
    cardInfo: {
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: 4,
        backgroundColor: palette.lightGrey,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: palette.darkGrey,
        lineHeight: 21,
        minHeight: 42,
        fontFamily: FONT,
    },
    cardPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    favoriteHeartButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        marginLeft: -8,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: palette.darkGrey,
        fontFamily: FONT,
    },

    /* AI IMAGE SEARCH */
    aiSearchContainer: {
        marginBottom: 10,
    },
    aiPreviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    aiPreviewImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    removeImageButtonSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: palette.danger,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageX: {
        color: palette.white,
        fontSize: 12,
        fontWeight: 'bold',
    },

    /* CONTROLS */
    controlsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10,
        alignItems: 'center',
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 8,
        height: 36,
    },
    controlButtonText: {
        marginLeft: 6,
        fontSize: 16,
        fontFamily: 'BaiJamjuree-Regular',
        fontWeight: '600',
    },

    /* EMPTY & LOADING */
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: palette.textMuted,
        textAlign: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(4, 4, 4, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    categoryHeroGradient: {
        height: 300,
        marginHorizontal: 0,
        marginBottom: 12,
        borderRadius: 0,
        opacity: 1,
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        zIndex: -1,
    },


})
