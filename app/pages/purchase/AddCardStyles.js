import { StyleSheet, Dimensions } from 'react-native'
import { palette } from '../../theme/palette'

const { width } = Dimensions.get('window')
const CARD_ASPECT_RATIO = 1.586 // Standard credit card aspect ratio
const CARD_WIDTH = width - 48
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO

export const addCardStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: palette.darkGrey,
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
        color: palette.mustard,
        fontSize: 16,
        fontFamily: 'OTJubileeGolden',
        letterSpacing: 1,
        textTransform: 'uppercase',
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
        color: palette.white,
        fontSize: 18,
        fontFamily: 'OTJubileeGolden-Italic',
        letterSpacing: 1,
    },
    cardNumberPreview: {
        color: palette.white,
        fontSize: 22,
        fontFamily: 'OTJubileeGolden',
        letterSpacing: 2,
        marginTop: 20,
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: palette.champagne,
        fontSize: 10,
        marginBottom: 4,
        fontFamily: 'BaiJamjuree-Regular',
        textTransform: 'uppercase',
    },
    cardValue: {
        color: palette.white,
        fontSize: 14,
        fontFamily: 'OTJubileeGolden',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Form
    sectionTitle: {
        color: palette.white,
        fontSize: 20,
        fontFamily: 'OTJubileeGolden',
        marginBottom: 24,
    },
    scanButton: {
        backgroundColor: 'rgba(187, 126, 29, 0.1)', // palette.mustard with opacity
        borderRadius: 8,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: palette.darkMustard,
        borderStyle: 'dashed',
    },
    scanButtonText: {
        color: palette.mustard,
        fontSize: 16,
        fontFamily: 'BaiJamjuree-Regular',
        marginLeft: 12,
    },
    formGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        color: palette.champagne,
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'BaiJamjuree-Regular',
    },
    input: {
        backgroundColor: palette.elevated,
        borderWidth: 1,
        borderColor: palette.darkMustard,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: palette.white,
        fontSize: 16,
        fontFamily: 'BaiJamjuree-Regular',
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
        color: palette.elevated,
        fontSize: 16,
        fontFamily: 'BaiJamjuree-Regular',
        fontWeight: '600',
    },
})
