import React from 'react'
import { View, Text, Button } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function HomeScreen() {
  const { user, signOut } = useAuth()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Benvenuto nella schermata 3, {user?.email}</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  )
}
