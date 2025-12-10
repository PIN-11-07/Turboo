import { StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    brand: {
        fontFamily: 'OTJubileeGolden-Italic',
        color: palette.white,
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: 60,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    titleItalic: {
        fontFamily: 'OTJubileeGolden-Italic',
        fontSize: 45,
        color: palette.lightGrey,
    },
    titleRegular: {
        fontSize: 45,
        color: palette.lightGrey,
        fontFamily: 'OTJubileeGolden-Extralight',
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: palette.white,
        fontSize: 16,
        fontFamily: 'BaiJamjuree-Regular',
    },
    scrollText: {
        color: palette.lightGrey,
        fontSize: 12,
        marginTop: 8,
    },
})

