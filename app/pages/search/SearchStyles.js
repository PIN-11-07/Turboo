import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

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

    // AI Info Section
    aiInfoSection: {
        backgroundColor: 'rgba(198, 133, 21, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(198, 133, 21, 0.2)',
    },
    aiInfoText: {
        color: palette.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },

    // Categories
    categoriesSection: {
        backgroundColor: 'transparent',
        marginBottom: 16,
    },
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
        paddingBottom: 8,
    },
    categoryCard: {
        flex: 1,
        margin: 5,
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: palette.surface,
        position: 'relative',
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.85)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    // Results List Styles
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    gridContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },

    // Card layout wrappers (ListingCard handles visuals)
    listCardWrapper: {
        width: '100%',
    },
    gridCardWrapper: {
        width: '48%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
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
        backgroundColor: palette.danger,
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
