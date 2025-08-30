import AsyncStorage from '@react-native-async-storage/async-storage';

export class OnboardingService {
  private static readonly STORAGE_KEY = 'hasSeenOnboarding';
  private static readonly VERSION_KEY = 'onboardingVersion';
  private static readonly CURRENT_VERSION = '1.0';

  static async hasSeenOnboarding(): Promise<boolean> {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(this.STORAGE_KEY);
      const version = await AsyncStorage.getItem(this.VERSION_KEY);
      
      // If version is different, show onboarding again
      if (version !== this.CURRENT_VERSION) {
        return false;
      }
      
      return hasSeenOnboarding === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  static async markOnboardingAsSeen(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, 'true');
      await AsyncStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
    } catch (error) {
      console.error('Error marking onboarding as seen:', error);
    }
  }

  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await AsyncStorage.removeItem(this.VERSION_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }

  static async shouldShowFeatureHint(featureName: string): Promise<boolean> {
    try {
      const key = `hint_${featureName}`;
      const hasSeenHint = await AsyncStorage.getItem(key);
      return hasSeenHint !== 'true';
    } catch (error) {
      console.error('Error checking feature hint:', error);
      return false;
    }
  }

  static async markFeatureHintAsSeen(featureName: string): Promise<void> {
    try {
      const key = `hint_${featureName}`;
      await AsyncStorage.setItem(key, 'true');
    } catch (error) {
      console.error('Error marking feature hint as seen:', error);
    }
  }
}
