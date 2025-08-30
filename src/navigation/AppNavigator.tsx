import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Info, ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { CostCalculatorScreen } from '../screens/CostCalculatorScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

// Import components
import { OnboardingChecker } from '../components/OnboardingChecker';

import { RootStackParamList, TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // Ensure comfortable spacing above the system gesture bar
  const extraBottom = 12; // additional padding in dp
  const paddingBottom = (insets.bottom || 0) + extraBottom;
  const tabBarHeight = 60 + (insets.bottom || 0) + 4; // base height + inset
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          } else if (route.name === 'Info') {
            return <Info size={size} color={color} />;
          }
          return <Home size={size} color={color} />;
        },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          paddingBottom,
          paddingTop: 6,
          height: tabBarHeight,
          backgroundColor: theme.colors.elevation?.level2 || theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.colors.onSurface,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Beranda' }}
      />
      <Tab.Screen 
        name="Info" 
        component={InfoScreen} 
        options={{ title: 'Informasi' }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  const theme = useTheme();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  const handleOnboardingStatusChecked = (status: boolean) => {
    setHasSeenOnboarding(status);
  };

  if (hasSeenOnboarding === null) {
    return (
      <OnboardingChecker onOnboardingStatusChecked={handleOnboardingStatusChecked}>
        <></>
      </OnboardingChecker>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? "Home" : "Onboarding"}
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.colors.onSurface,
        },
        headerLeft: ({ canGoBack }) => {
          if (canGoBack) {
            return (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 16, padding: 8 }}
              >
                <ArrowLeft size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            );
          }
          return null;
        },
      })}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CostCalculator" 
        component={CostCalculatorScreen} 
        options={{ title: 'Hitung Ongkir' }}
      />
      <Stack.Screen 
        name="Tracking" 
        component={TrackingScreen} 
        options={{ title: 'Lacak Paket' }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Cari Lokasi' }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};