import React from 'react'
import { View, Text, Button } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function HomeScreen() {
  const { user, signOut } = useAuth()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido a la pantalla 3, {user?.email}</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  )
}
