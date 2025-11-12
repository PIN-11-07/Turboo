import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import HomeListingDetailScreen from './screens/HomeListingDetailScreen'
import { stackScreenOptions } from '../../navigation/navigationTheme'

const Stack = createNativeStackNavigator()

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
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
