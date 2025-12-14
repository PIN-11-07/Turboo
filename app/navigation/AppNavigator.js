import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
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
import { palette } from '../theme/palette'

const TAB_BAR_HEIGHT = 88
const TAB_BAR_BOTTOM_OFFSET = 16

const Tab = createBottomTabNavigator()
const FeedStack = createNativeStackNavigator()
const SearchStack = createNativeStackNavigator()
const PublishStack = createNativeStackNavigator()
const MessagesStack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()

const baseStackScreenOptions = {
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
}

const createStackScreenOptions = bottomPadding => ({
  ...baseStackScreenOptions,
  contentStyle: {
    backgroundColor: palette.background,
    paddingBottom: bottomPadding,
  },
})

const useFloatingTabPadding = () => {
  const insets = useSafeAreaInsets()
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + insets.bottom
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()
  const bottomOffset = TAB_BAR_BOTTOM_OFFSET + insets.bottom

  return (
    <View style={[styles.tabContainer, { bottom: bottomOffset }]}>
      <View style={[styles.tabContent, { paddingBottom: insets.bottom > 0 ? 6 : 0 }]}>
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
                  <Ionicons name="add" size={32} color={palette.champagne} />
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
              <Ionicons name={iconName} size={24} color={palette.champagne} />
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const FeedStackNavigator = () => {
  const bottomPadding = useFloatingTabPadding()

  return (
    <FeedStack.Navigator screenOptions={createStackScreenOptions(bottomPadding)}>
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
}

const SearchStackNavigator = () => {
  const bottomPadding = useFloatingTabPadding()

  return (
    <SearchStack.Navigator screenOptions={createStackScreenOptions(bottomPadding)}>
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
}

const PublishStackNavigator = () => {
  const bottomPadding = useFloatingTabPadding()

  return (
    <PublishStack.Navigator screenOptions={createStackScreenOptions(bottomPadding)}>
      <PublishStack.Screen
        name="PublishMain"
        component={PublishScreen}
        options={{ headerShown: false }}
      />
    </PublishStack.Navigator>
  )
}

const MessagesStackNavigator = () => {
  const bottomPadding = useFloatingTabPadding()

  return (
    <MessagesStack.Navigator screenOptions={createStackScreenOptions(bottomPadding)}>
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
}

const ProfileStackNavigator = () => {
  const bottomPadding = useFloatingTabPadding()

  return (
    <ProfileStack.Navigator screenOptions={createStackScreenOptions(bottomPadding)}>
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
}

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

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM_OFFSET,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 11, 11, 0.65)',
    borderRadius: 30,
    paddingVertical: 0,
    paddingHorizontal: 10,
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  plusButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: palette.champagne,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2,
    backgroundColor: palette.mustard,
    borderRadius: 1,
  },
})
