import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { AuthProvider } from './app/context/AuthContext'
import RootNavigator from './app/navigation/RootNavigator'
import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load images
        await Asset.fromModule(require('./assets/welcome_hero.jpg')).downloadAsync()
        // Load fonts
        await Font.loadAsync({
          'OTJubileeGolden': require('./assets/fonts/OTJubilee-GoldenMedium.otf'),
          'OTJubileeGolden-Italic': require('./assets/fonts/OTJubilee-GoldenMediumItalic.otf'),
          'OTJubileeGolden-Extralight': require('./assets/fonts/OTJubilee-GoldenExtralight.otf'),
          'OTJubileeGolden-ExtralightItalic': require('./assets/fonts/OTJubilee-GoldenExtralightItalic.otf'),
          'OTJubileeGolden-Extrabold': require('./assets/fonts/OTJubilee-GoldenExtrabold.otf'),
          'OTJubileeGolden-ExtraboldItalic': require('./assets/fonts/OTJubilee-GoldenExtraboldItalic.otf'),
        })
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
        <RootNavigator />
      </AuthProvider>
    </View>
  )
}
