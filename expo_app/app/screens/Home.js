import React from 'react'
import { View, Text, Button } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function HomeScreen() {
  const { user, signOut } = useAuth()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Benvenuto, {user?.email}</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  )
}
