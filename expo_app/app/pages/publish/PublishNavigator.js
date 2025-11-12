import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PublishScreen from './screens/PublishScreen'
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

export default function PublishNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Publish"
        component={PublishScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
