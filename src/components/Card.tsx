import React from 'react';
import { View, ViewProps } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

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
  return (
    <PaperCard 
      elevation={elevation} 
      style={[
        {
          margin: 8,
          padding: 16,
          backgroundColor: 'white',
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