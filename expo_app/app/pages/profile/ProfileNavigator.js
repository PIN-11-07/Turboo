import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from './screens/ProfileScreen'
import ProfileListingDetailScreen from './screens/ProfileListingDetailScreen'

const Stack = createNativeStackNavigator()

export default function ProfileNavigator() {
  return (
    <Stack.Navigator>
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
