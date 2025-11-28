import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Messages Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: palette.textPrimary,
        fontSize: 18,
    },
})
