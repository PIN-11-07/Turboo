import { StyleSheet, Dimensions } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')
const CARD_ASPECT_RATIO = 1.586 // Standard credit card aspect ratio
const CARD_WIDTH = width - 48
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO

export const addCardStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: palette.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 8,
    },
    headerTitle: {
        color: palette.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
        fontStyle: 'italic',
    },
    // Card Preview
    cardPreviewContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        marginBottom: 32,
        alignSelf: 'center',
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: palette.mustard,
    },
    cardGradient: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardChip: {
        width: 40,
        height: 30,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    cardBrand: {
        color: palette.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    cardNumberPreview: {
        color: palette.textPrimary,
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 2,
        marginTop: 20,
        marginBottom: 20,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        marginBottom: 4,
    },
    cardValue: {
        color: palette.textPrimary,
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    // Form
    sectionTitle: {
        color: palette.textPrimary,
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
    },
    scanButton: {
        backgroundColor: 'rgba(187, 126, 29, 0.2)', // palette.mustard with opacity
        borderRadius: 8,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: palette.mustard,
    },
    scanButtonText: {
        color: palette.mustard,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    formGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        color: palette.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.mustard,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: palette.textPrimary,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowItem: {
        flex: 0.48,
    },
    saveButton: {
        backgroundColor: palette.mustard,
        borderRadius: 8,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
})
