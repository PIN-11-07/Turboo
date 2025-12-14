import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import FeedScreen from '../pages/feed/FeedScreen'
import ListingDetailScreen from '../pages/listingDetails/ListingDetailScreen'
import PurchaseScreen from '../pages/purchase/PurchaseScreen'
import PurchaseConfirmationScreen from '../pages/purchase/PurchaseConfirmationScreen'
import RecommendationsScreen from '../pages/recommendations/RecommendationsScreen'
import RatingScreen from '../pages/rating/ratingScreen'
import SearchScreen from '../pages/search/SearchScreen'
import MessagesScreen from '../pages/messages/MessagesScreen'
import ChatScreen from '../pages/chat/ChatScreen'
import PublishScreen from '../pages/publish/PublishScreen'
import ProfileScreen from '../pages/profile/ProfileScreen'
import AddCardScreen from '../pages/purchase/AddCardScreen' // Import the AddCardScreen
import { palette } from '../theme/palette'

// ... existing code ...

const Tab = createBottomTabNavigator()
const FeedStack = createNativeStackNavigator()
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

const chatHiddenRoutes = ['Chat']

const getTabBarStyle = route => {
  const routeName = getFocusedRouteNameFromRoute(route)

  if (routeName && chatHiddenRoutes.includes(routeName)) {
    return { display: 'none' }
  }

  return undefined
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key]?.options || {}
  const tabBarStyle = StyleSheet.flatten(focusedOptions.tabBarStyle)
  const shouldHideTabBar = focusedOptions.tabBarVisible === false || tabBarStyle?.display === 'none'

  if (shouldHideTabBar) return null

  return (
    <View style={styles.tabContainer}>
      <BlurView intensity={40} tint="dark" style={styles.tabContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          let iconName = 'home-outline'
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline'
          else if (route.name === 'Search') iconName = isFocused ? 'search' : 'search-outline'
          else if (route.name === 'Publish') iconName = isFocused ? 'add-circle' : 'add-circle-outline'
          else if (route.name === 'Messages') iconName = isFocused ? 'mail' : 'mail-outline'
          else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline'

          if (route.name === 'Publish') {
            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabButton}
              >
                <View style={styles.plusButtonContainer}>
                  <Ionicons name="add" size={32} color={palette.white} />
                </View>
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Ionicons name={iconName} size={24} color={palette.white} />
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          )
        })}
      </BlurView>
    </View>
  )
}

const FeedStackNavigator = () => (
  <FeedStack.Navigator screenOptions={stackScreenOptions}>
    <FeedStack.Screen
      name="HomeMain"
      component={FeedScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="AddCard"
      component={AddCardScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="Recommendations"
      component={RecommendationsScreen}
      options={{ title: '' }}
    />
    <FeedStack.Screen
      name="RatingScreen"
      component={RatingScreen}
      options={{ headerShown: false }}
    />
    <FeedStack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </FeedStack.Navigator>
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
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="AddCard"
      component={AddCardScreen}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ headerShown: false }}
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
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Purchase"
      component={PurchaseScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="AddCard"
      component={AddCardScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="PurchaseConfirmation"
      component={PurchaseConfirmationScreen}
      options={{ headerShown: false }}
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
        component={FeedStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Inicio',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Buscar',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Publish"
        component={PublishStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Publicar',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Mensajes',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Perfil',
          tabBarStyle: getTabBarStyle(route),
        })}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    borderRadius: 30,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  plusButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2,
    backgroundColor: palette.white,
    borderRadius: 1,
  },
})
