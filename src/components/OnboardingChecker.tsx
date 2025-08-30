import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { OnboardingService } from '../services/onboarding';

interface OnboardingCheckerProps {
  children: React.ReactNode;
  onOnboardingStatusChecked: (hasSeenOnboarding: boolean) => void;
}

export const OnboardingChecker: React.FC<OnboardingCheckerProps> = ({
  children,
  onOnboardingStatusChecked,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await OnboardingService.hasSeenOnboarding();
      onOnboardingStatusChecked(hasSeenOnboarding);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      onOnboardingStatusChecked(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
};
