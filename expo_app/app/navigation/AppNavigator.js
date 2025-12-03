import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeNavigator from './HomeNavigator'
import PublishNavigator from './PublishNavigator'
import ProfileNavigator from './ProfileNavigator'
import SearchScreen from '../pages/search/SearchScreen'
import MessagesScreen from '../pages/messages/MessagesScreen'
import CustomTabBar from './CustomTabBar'
import { palette } from '../theme/palette'

const Tab = createBottomTabNavigator()

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
        component={HomeNavigator}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Buscar' }}
      />
      <Tab.Screen
        name="Publish"
        component={PublishNavigator}
        options={{ tabBarLabel: 'Publicar' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarLabel: 'Mensajes' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  )
}
