import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Calculator, Package, Search } from 'lucide-react-native';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { CostCalculatorScreen } from '../screens/CostCalculatorScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { SearchScreen } from '../screens/SearchScreen';

import { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'CostCalculator') {
            return <Calculator size={size} color={color} />;
          } else if (route.name === 'Tracking') {
            return <Package size={size} color={color} />;
          } else if (route.name === 'Search') {
            return <Search size={size} color={color} />;
          }
          return <Home size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196f3',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2196f3',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Beranda' }}
      />
      <Tab.Screen 
        name="CostCalculator" 
        component={CostCalculatorScreen} 
        options={{ title: 'Hitung Ongkir' }}
      />
      <Tab.Screen 
        name="Tracking" 
        component={TrackingScreen} 
        options={{ title: 'Lacak Paket' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Cari Lokasi' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};