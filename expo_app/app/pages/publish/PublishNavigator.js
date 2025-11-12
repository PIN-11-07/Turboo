import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PublishScreen from './screens/PublishScreen'

const Stack = createNativeStackNavigator()

export default function PublishNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Publish" component={PublishScreen} />
    </Stack.Navigator>
  )
}
