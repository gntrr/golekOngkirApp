import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  const theme = useTheme();
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{
        marginTop: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        fontSize: 16
      }}>{message}</Text>
    </View>
  );
};