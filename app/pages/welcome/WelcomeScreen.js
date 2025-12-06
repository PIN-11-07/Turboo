
import React, { useRef } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Animated,
    PanResponder,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../../theme/palette'

const { height } = Dimensions.get('window')

export default function WelcomeScreen() {
    const navigation = useNavigation()
    const slideAnim = useRef(new Animated.Value(0)).current

    const navigateToApp = () => {
        Animated.timing(slideAnim, {
            toValue: -height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            navigation.replace('MainApp')
        })
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy < -10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy < 0) {
                    slideAnim.setValue(gestureState.dy)
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -height * 0.15) {
                    navigateToApp()
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start()
                }
            },
        })
    ).current

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
            {...panResponder.panHandlers}
        >
            <ImageBackground
                source={require('../../../assets/welcome_hero.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Text style={styles.brand}>REVVOL</Text>

                        <View style={styles.titleContainer}>
                            <Text style={styles.titleItalic}>Exclusive</Text>
                            <Text style={styles.titleRegular}> deals for</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleItalic}>classic</Text>
                            <Text style={styles.titleRegular}> drivers</Text>
                        </View>

                        <View style={styles.spacer} />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={navigateToApp}
                            >
                                <Text style={styles.secondaryButtonText}>Slide to Explore</Text>
                                <Ionicons name="chevron-up" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
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
        color: '#FFF',
        fontSize: 14,
        letterSpacing: 2,
        fontWeight: '600',
        marginBottom: 60,
        fontStyle: 'italic',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    titleItalic: {
        fontFamily: 'serif',
        fontSize: 42,
        color: '#FFF',
        fontStyle: 'italic',
    },
    titleRegular: {
        fontSize: 42,
        color: '#CCC',
        fontWeight: '300',
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    primaryButton: {
        backgroundColor: palette.accent,
        paddingVertical: 16,
        width: '100%',
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 8,
    },
})

