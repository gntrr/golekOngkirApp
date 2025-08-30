import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import { 
  Calculator, 
  MapPin, 
  Search, 
  Info, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle 
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingService } from '../services/onboarding';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Selamat Datang di Golek Ongkir',
    description: 'Aplikasi terpercaya untuk menghitung ongkos kirim ke seluruh Indonesia dengan mudah dan cepat.',
    icon: CheckCircle,
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Hitung Ongkir',
    description: 'Bandingkan tarif ongkir dari berbagai ekspedisi seperti JNE, TIKI, POS Indonesia, dan lainnya.',
    icon: Calculator,
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Lacak Paket',
    description: 'Pantau status pengiriman paket Anda secara real-time dengan mudah.',
    icon: MapPin,
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Cari Lokasi',
    description: 'Temukan kode pos dan informasi lengkap wilayah di seluruh Indonesia.',
    icon: Search,
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Siap Memulai!',
    description: 'Semua fitur sudah siap digunakan. Mari mulai menghitung ongkir dan lacak paket Anda.',
    icon: Info,
    color: '#4CAF50',
  },
];

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate when index changes
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [currentIndex, fadeAnim, scaleAnim]);

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    try {
      await OnboardingService.markOnboardingAsSeen();
      navigation.replace('Home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.replace('Home');
    }
  };

  const renderStep = ({ item, index }: { item: OnboardingStep; index: number }) => {
    const IconComponent = item.icon;
    
    return (
      <View style={[styles.stepContainer, { width: screenWidth }]}>
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <IconComponent size={80} color={item.color} />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {item.title}
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index <= currentIndex 
                  ? theme.colors.primary 
                  : theme.colors.outline,
                width: index <= currentIndex ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <StatusBar backgroundColor={theme.colors.surface} barStyle="dark-content" />
      
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: theme.colors.primary }]}>
            Lewati
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content */}
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={renderStep}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
      />

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.navButton,
            styles.prevButton,
            { 
              backgroundColor: currentIndex === 0 ? 'transparent' : theme.colors.surfaceVariant,
              borderWidth: currentIndex === 0 ? 0 : 1,
              borderColor: currentIndex === 0 ? 'transparent' : theme.colors.outline,
              opacity: currentIndex === 0 ? 0.3 : 1,
            }
          ]}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={20} color={currentIndex === 0 ? theme.colors.onSurfaceVariant : theme.colors.onSurface} />
          <Text style={[styles.navButtonText, { color: currentIndex === 0 ? theme.colors.onSurfaceVariant : theme.colors.onSurface }]}>
            Kembali
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.onPrimary }]}>
            {currentIndex === onboardingSteps.length - 1 ? 'Mulai' : 'Lanjut'}
          </Text>
          <ArrowRight size={20} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
    gap: 8,
  },
  prevButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
