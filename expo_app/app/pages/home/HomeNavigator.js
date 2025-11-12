import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import HomeListingDetailScreen from './screens/HomeListingDetailScreen'

const Stack = createNativeStackNavigator()

export default function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListingDetail"
        component={HomeListingDetailScreen}
        options={{ title: 'Detalles del vehículo' }}
      />
    </Stack.Navigator>
  )
}
