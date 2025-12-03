import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { AuthProvider } from './app/context/AuthContext'
import { DataCacheProvider } from './app/context/DataCacheContext'
import RootNavigator from './app/navigation/RootNavigator'
import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load images
        await Asset.fromModule(require('./assets/welcome_hero.jpg')).downloadAsync()
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  if (!appIsReady) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <DataCacheProvider>
          <RootNavigator />
        </DataCacheProvider>
      </AuthProvider>
    </View>
  )
}
