import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../pages/home/HomeScreen'
import ListingDetailScreen from '../pages/listingDetails/ListingDetailScreen'
import PurchaseScreen from '../pages/purchase/PurchaseScreen'
import PurchaseConfirmationScreen from '../pages/purchase/PurchaseConfirmationScreen'
import RecommendationsScreen from '../pages/home/RecommendationsScreen'
import RatingScreen from '../pages/rating/ratingScreen'
import { palette } from '../theme/palette'

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
