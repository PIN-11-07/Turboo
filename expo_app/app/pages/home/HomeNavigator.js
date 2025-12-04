import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './HomeScreen'
import ListingDetailScreen from '../listingDetails/ListingDetailScreen'
import PurchaseScreen from '../purchase/PurchaseScreen'
import PurchaseConfirmationScreen from '../purchase/PurchaseConfirmationScreen'
import AddCardScreen from '../purchase/AddCardScreen'
import RecommendationsScreen from './RecommendationsScreen'
import { palette } from '../../theme/palette'
import RatingScreen from '../rating/ratingScreen'

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
        component={ListingDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={{ title: 'Confirmar compra' }}
      />
      <Stack.Screen
        name="PurchaseConfirmation"
        component={PurchaseConfirmationScreen}
        options={{ title: 'Compra completada', headerBackVisible: false }}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="RatingScreen"
        component={RatingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
