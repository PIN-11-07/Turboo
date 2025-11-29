import React from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { palette } from '../theme/palette'

export default function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key]
                    const isFocused = state.index === index

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name)
                        }
                    }

                    let iconName = 'home-outline'
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline'
                    else if (route.name === 'Search') iconName = isFocused ? 'search' : 'search-outline'
                    else if (route.name === 'Publish') iconName = isFocused ? 'add-circle' : 'add-circle-outline'
                    else if (route.name === 'Messages') iconName = isFocused ? 'mail' : 'mail-outline'
                    else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline'

                    // Special styling for the middle button (Publish)
                    if (route.name === 'Publish') {
                        return (
                            <TouchableOpacity
                                key={index}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                style={styles.tabButton}
                            >
                                <View style={styles.plusButtonContainer}>
                                    <Ionicons name="add" size={32} color={palette.champagne} />
                                </View>
                            </TouchableOpacity>
                        )
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={styles.tabButton}
                        >
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={palette.champagne}
                            />
                            {isFocused && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    content: {
        flexDirection: 'row',
        backgroundColor: palette.darkGrey, // #1A1A1A
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        // Elevation for Android
        elevation: 8,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    plusButtonContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: palette.champagne, // #E1CFAA
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 20,
        height: 2,
        backgroundColor: palette.mustard, // #BB7E1D
        borderRadius: 1,
    }
})
