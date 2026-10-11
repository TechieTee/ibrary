import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ClassesScreen } from '../screens/ClassesScreen';
import { LegibilityScreen } from '../screens/LegibilityScreen';
import { AssessmentScreen } from '../screens/AssessmentScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent1.primary,
        tabBarInactiveTintColor: theme.colors.greyscale.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.greyscale.bgLight,
          borderTopColor: theme.colors.greyscale.stroke,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          title: 'Classes',
          tabBarLabel: 'Classes',
          tabBarAccessibilityLabel: 'Classes tab',
        }}
      />
      <Tab.Screen
        name="Legibility"
        component={LegibilityScreen}
        options={{
          title: 'Legibility',
          tabBarLabel: 'Legibility',
          tabBarAccessibilityLabel: 'Legibility tab',
        }}
      />
      <Tab.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{
          title: 'Assessment',
          tabBarLabel: 'Assessment',
          tabBarAccessibilityLabel: 'Assessment tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
}
