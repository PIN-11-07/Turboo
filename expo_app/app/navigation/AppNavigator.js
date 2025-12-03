import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../pages/home/HomeScreen'
import ListingDetailScreen from '../pages/listingDetails/ListingDetailScreen'
import PurchaseScreen from '../pages/purchase/PurchaseScreen'
import PurchaseConfirmationScreen from '../pages/purchase/PurchaseConfirmationScreen'
import RecommendationsScreen from '../pages/home/RecommendationsScreen'
import RatingScreen from '../pages/rating/ratingScreen'
import SearchScreen from '../pages/search/SearchScreen'
import MessagesScreen from '../pages/messages/MessagesScreen'
import ChatScreen from '../pages/messages/ChatScreen'
import PublishScreen from '../pages/publish/PublishScreen'
import ProfileScreen from '../pages/profile/ProfileScreen'
import CustomTabBar from './CustomTabBar'
import { palette } from '../theme/palette'

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const SearchStack = createNativeStackNavigator()
const PublishStack = createNativeStackNavigator()
const MessagesStack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()

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

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={stackScreenOptions}>
    <HomeStack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{ title: 'Confirmar compra' }}
    />
    <HomeStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ title: 'Compra completada', headerBackVisible: false }}
    />
    <HomeStack.Screen
      name="Recommendations"
      component={RecommendationsScreen}
      options={{ title: '' }}
    />
    <HomeStack.Screen
      name="RatingScreen"
      component={RatingScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
)

const SearchStackNavigator = () => (
  <SearchStack.Navigator screenOptions={stackScreenOptions}>
    <SearchStack.Screen
      name="SearchMain"
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{ title: 'Confirmar compra' }}
    />
    <SearchStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ title: 'Compra completada', headerBackVisible: false }}
    />
    <SearchStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </SearchStack.Navigator>
)

const PublishStackNavigator = () => (
  <PublishStack.Navigator screenOptions={stackScreenOptions}>
    <PublishStack.Screen
      name="PublishMain"
      component={PublishScreen}
      options={{ headerShown: false }}
    />
  </PublishStack.Navigator>
)

const MessagesStackNavigator = () => (
  <MessagesStack.Navigator screenOptions={stackScreenOptions}>
    <MessagesStack.Screen
      name="MessagesMain"
      component={MessagesScreen}
      options={{ headerShown: false }}
    />
    <MessagesStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </MessagesStack.Navigator>
)

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={stackScreenOptions}>
    <ProfileStack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ title: 'Detalles del vehículo' }}
    />
    <ProfileStack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{ title: 'Confirmar compra' }}
    />
    <ProfileStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ title: 'Compra completada', headerBackVisible: false }}
    />
    <ProfileStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </ProfileStack.Navigator>
)

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        // Keep every tab mounted so each stack loads once at startup
        lazy: false,
        unmountOnBlur: false,
        headerShown: false,
        sceneContainerStyle: {
          backgroundColor: palette.background,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{ tabBarLabel: 'Buscar' }}
      />
      <Tab.Screen
        name="Publish"
        component={PublishStackNavigator}
        options={{ tabBarLabel: 'Publicar' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={{ tabBarLabel: 'Mensajes' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  )
}
