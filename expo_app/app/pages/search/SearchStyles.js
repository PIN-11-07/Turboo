import { StyleSheet, Dimensions, Platform } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')

export const searchStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "transparent",
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: "transparent",
    },
    // Search Bar
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
        borderColor: palette.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
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

    // Categories
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: palette.textPrimary,
        marginBottom: 16,
        marginTop: 8,
        paddingHorizontal: 16,
    },
    categoriesGrid: {
        paddingHorizontal: 11, // Adjusted to balance with card margins
        paddingBottom: 20,
    },
    categoryCard: {
        flex: 1,
        margin: 5,
        height: 110,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: palette.surface,
        position: 'relative',
        borderWidth: 1,
        borderColor: palette.border,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    // Results List Styles
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
        backgroundColor: palette.surface,
        borderRadius: 18,
        marginBottom: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 5,
    },
    cardImageWrapper: {
        position: 'relative',
        height: 200,
        width: '100%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
        flex: 1,
        marginRight: 8,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: palette.accent,
    },
    cardSubtitle: {
        fontSize: 15,
        color: palette.textSecondary,
        marginTop: 4,
        marginBottom: 12,
    },
    cardBadgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
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
        marginTop: 2,
    },
    cardLocation: {
        fontSize: 13,
        color: palette.textMuted,
        fontWeight: '500',
    },
    cardMeta: {
        fontSize: 12,
        color: palette.textMuted,
    },

    // Grid Item Styles
    gridItem: {
        flex: 1,
        margin: 5,
        backgroundColor: palette.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
        maxWidth: (width - 32) / 2, // Adjusted for padding
    },
    gridImageContainer: {
        aspectRatio: 4 / 3,
        width: '100%',
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: palette.overlay,
    },
    gridContent: {
        padding: 10,
        flexDirection: "column",
        justifyContent: "space-between",
        height: 80,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: palette.textPrimary,
        marginBottom: 4,
    },
    gridPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: palette.accent,
        marginTop: "auto",
        alignSelf: "flex-end",
    },

    // Empty & Loading
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

    // AI Search
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
        backgroundColor: palette.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageX: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Controls
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
})
