import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/**
 * Temporary placeholder component to keep the shared components directory in place.
 */
export default function ComponentsPlaceHolder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Components placeholder</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#6d6d6d',
  },
})
