import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 20
    }}>
      <ActivityIndicator size="large" color="#2196f3" />
      <Text style={{
        marginTop: 16,
        color: '#666',
        textAlign: 'center',
        fontSize: 16
      }}>{message}</Text>
    </View>
  );
};