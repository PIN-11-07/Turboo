import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import ListingDetailScreen from './screens/ListingDetailScreen'

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
        component={ListingDetailScreen}
        options={{ title: 'Detalles del vehículo' }}
      />
    </Stack.Navigator>
  )
}
