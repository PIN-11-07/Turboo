import { StyleSheet, Dimensions } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')

const FONT = 'OTJubileeGolden'
const FONT_LIGHT = 'OTJubileeGolden-Extralight'
const FONT_ITALIC = 'OTJubileeGolden-Italic'

export const searchStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    /* HEADER */
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: 'transparent',
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
        backgroundColor: palette.surface,     // ← ORIGINAL
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: palette.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: palette.textPrimary,
        fontSize: 16,
        height: '100%',
    },
    visualSearchButton: {
        marginLeft: 12,
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: palette.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: palette.border,
    },

    // AI Info Section
    aiInfoSection: {
        backgroundColor: 'rgba(198, 133, 21, 0.08)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(198, 133, 21, 0.18)',
    },
    aiInfoText: {
        color: palette.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },

    /* CATEGORIES */
    categoriesSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: FONT,
        color: palette.champagne,
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
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: '#000',
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
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTitle: {
        color: palette.champagne,
        fontSize: 18,
        fontFamily: FONT,
        textAlign: 'center',
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
        backgroundColor: palette.lightGrey,
        borderRadius: 18,
        marginBottom: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 6,
    },
    cardImageWrapper: {
        height: 200,
        width: '100%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
        fontFamily: FONT,
        color: palette.darkGrey,
        flex: 1,
        marginRight: 8,
    },
    cardPrice: {
        fontSize: 18,
        fontFamily: FONT,
        color: palette.darkGrey,
    },
    cardSubtitle: {
        fontSize: 15,
        color: palette.textSecondary,
        marginBottom: 12,
    },
    cardBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    cardBadge: {
        backgroundColor: 'rgba(245,197,24,0.15)',
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
        marginTop: 2,
    },
    cardLocation: {
        fontSize: 13,
        color: palette.textMuted,
        fontWeight: '500',
    },

    /* GRID ITEM */
    gridItem: {
        flex: 1,
        margin: 5,
        backgroundColor: palette.lightGrey,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
        maxWidth: (width - 32) / 2,
    },
    gridImageContainer: {
        aspectRatio: 4 / 3,
        width: '100%',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: palette.overlay,
    },
    gridContent: {
        padding: 10,
        height: 80,
        justifyContent: 'space-between',
    },
    gridTitle: {
        fontSize: 14,
        fontFamily: FONT,
        color: palette.darkGrey,
    },
    gridPrice: {
        fontSize: 15,
        fontFamily: FONT,
        color: palette.darkGrey,
        alignSelf: 'flex-end',
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
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

    /* CONTROLS */
    controlsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
        marginRight: 8,
        height: 36,
    },
    controlButtonActive: {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
    },
    controlButtonText: {
        marginLeft: 6,
        fontSize: 12,
        color: palette.textPrimary,
        fontWeight: '600',
    },
    controlButtonTextActive: {
        color: palette.background,
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
        backgroundColor: 'rgba(4,4,4,0.85)',
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
