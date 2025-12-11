
import React, { useRef } from 'react'
import {
    Text,
    View,
    Animated,
    PanResponder,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { welcomeStyles } from './welcomeStyles'
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
                welcomeStyles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
            {...panResponder.panHandlers}
        >
            <View style={welcomeStyles.videoContainer}>
                <Image
                    source={require('../../../assets/welcome_hero.jpg')}
                    style={welcomeStyles.video}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={welcomeStyles.gradient}
                >
                    <View style={welcomeStyles.content}>
                        <Text style={welcomeStyles.brand}>REVVOL</Text>

                        <View style={welcomeStyles.titleContainer}>
                            <Text style={welcomeStyles.titleItalic}>Exclusive</Text>
                            <Text style={welcomeStyles.titleRegular}> deals for</Text>
                        </View>
                        <View style={welcomeStyles.titleContainer}>
                            <Text style={welcomeStyles.titleItalic}>classic</Text>
                            <Text style={welcomeStyles.titleRegular}> drivers</Text>
                        </View>

                        <View style={welcomeStyles.spacer} />

                        <View style={welcomeStyles.buttonContainer}>
                            <View style={{ transform: [{ scaleY: 0.3 }], marginBottom: -30 }}>
                                <Ionicons name="chevron-up" size={80} color={palette.white} />
                            </View>
                            <TouchableOpacity
                                style={welcomeStyles.secondaryButton}
                                onPress={navigateToApp}
                            >
                                <Text style={welcomeStyles.secondaryButtonText}>Slide to Explore</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </Animated.View>
    )
}
