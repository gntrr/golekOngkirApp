import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  size = 8,
  activeColor,
  inactiveColor,
}) => {
  const theme = useTheme();
  
  const finalActiveColor = activeColor || theme.colors.primary;
  const finalInactiveColor = inactiveColor || theme.colors.outline;

  const renderDots = () => {
    const dots = [];
    
    for (let i = 0; i < totalSteps; i++) {
      const isActive = i <= currentStep;
      const isCompleted = i < currentStep;
      
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: isActive ? size * 3 : size,
              height: size,
              backgroundColor: isActive ? finalActiveColor : finalInactiveColor,
              borderRadius: size / 2,
            },
          ]}
        />
      );
    }
    
    return dots;
  };

  return (
    <View style={styles.container}>
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    // Animated styles will be applied directly in component
  },
});
