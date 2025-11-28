import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { palette } from '../../theme/palette'

export default function SearchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Search Screen</Text>
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
