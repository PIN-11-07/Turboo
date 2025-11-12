import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PublishScreen from './screens/PublishScreen'
import { stackScreenOptions } from '../../navigation/navigationTheme'

const Stack = createNativeStackNavigator()

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
