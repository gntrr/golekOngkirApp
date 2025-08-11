/**
 * Golek Ongkir App
 * Aplikasi cek ongkir dan lacak paket
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { isAdsTestMode } from './src/config/ads';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196f3',
    primaryContainer: '#e3f2fd',
    secondary: '#e91e63',
    secondaryContainer: '#fce4ec',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64b5f6',
    primaryContainer: '#1565c0',
    secondary: '#f48fb1',
    secondaryContainer: '#ad1457',
  },
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Set global request configuration and initialize the SDK once.
    const configureAndInit = async () => {
      try {
        await mobileAds().setRequestConfiguration({
          // Keep it permissive; adjust for your audience if needed
          maxAdContentRating: MaxAdContentRating.MA,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
          // Enable test devices in test mode
          testDeviceIdentifiers: isAdsTestMode() ? ['EMULATOR'] : [],
        });
        await mobileAds().initialize();
      } catch (e) {
        // Non-fatal; ads simply won't load
        console.warn('[AD] initialize failed', e);
      }
    };
    configureAndInit();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.primary}
      />
      <AppNavigator />
    </PaperProvider>
  );
}

export default App;
