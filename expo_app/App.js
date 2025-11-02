import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { AuthProvider, useAuth } from './app/context/AuthContext'
import HomeScreen from './app/screens/Home'
import LoginScreen from './app/screens/Login'

function Main() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return user ? <HomeScreen /> : <LoginScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  )
}
