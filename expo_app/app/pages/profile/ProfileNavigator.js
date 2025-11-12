import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from './screens/ProfileScreen'
import ProfileListingDetailScreen from './screens/ProfileListingDetailScreen'
import { palette } from '../../theme/palette'

const Stack = createNativeStackNavigator()

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: palette.surface,
  },
  headerTintColor: palette.accent,
  headerTitleStyle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: palette.background,
  },
}

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileListingDetail"
        component={ProfileListingDetailScreen}
        options={{ title: 'Dettagli del veicolo' }}
      />
    </Stack.Navigator>
  )
}
