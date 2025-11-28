import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { palette } from '../theme/palette'

export default function AnimatedAISearchButton({ onPress, icon, label, style }) {
    const pulseAnim = useRef(new Animated.Value(1)).current
    const rotateAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        )

        const rotate = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        )

        pulse.start()
        rotate.start()

        return () => {
            pulse.stop()
            rotate.stop()
        }
    }, [pulseAnim, rotateAnim])

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <Animated.View style={[styles.glowContainer, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                    colors={[palette.accent, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glow}
                />
            </Animated.View>

            <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <View style={styles.rotatingBorder} />
                    </Animated.View>
                    <Ionicons name={icon} size={20} color={palette.accent} style={styles.icon} />
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        minWidth: 100,
    },
    glowContainer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    glow: {
        flex: 1,
        opacity: 0.5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        position: 'relative',
    },
    rotatingBorder: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: palette.accent,
        borderStyle: 'dashed',
    },
    icon: {
        zIndex: 2,
    },
    label: {
        color: palette.textPrimary,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
})
