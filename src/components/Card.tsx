import React from 'react';
import { View, ViewProps } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 2,
  style,
  ...props 
}) => {
  const theme = useTheme();
  return (
    <PaperCard 
      elevation={elevation} 
      style={[
        {
          margin: 8,
          padding: 16,
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
        },
        style
      ]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};