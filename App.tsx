/**
 * Golek Ongkir App
 * Aplikasi cek ongkir dan lacak paket
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';

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
