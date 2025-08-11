import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Appbar, List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calculator, Package, Search, Info, Truck } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import { Card as CustomCard } from '../components/Card';
import { NativeAdCard } from '../components/ads/NativeAdCard';
import { AdUnitIDs, isAdsEnabled } from '../config/ads';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const features = [
    {
      title: 'Hitung Ongkir',
      description: 'Hitung biaya pengiriman ke seluruh Indonesia',
      icon: Calculator,
      screen: 'CostCalculator',
      color: '#2196f3',
    },
    {
      title: 'Lacak Paket',
      description: 'Lacak status pengiriman paket Anda',
      icon: Package,
      screen: 'Tracking',
      color: '#4caf50',
    },
    {
      title: 'Cari Lokasi',
      description: 'Cari provinsi, kota, dan kecamatan',
      icon: Search,
      screen: 'Search',
      color: '#ff9800',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16 }}>
        {/* Header */}
        <Card elevation={3}>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Truck size={64} color={theme.colors.primary} />
            <Text variant="headlineMedium" style={{ marginTop: 16, textAlign: 'center', color: theme.colors.primary, fontWeight: 'bold' }}>
              Golek Ongkir
            </Text>
            <Text variant="bodyLarge" style={{ marginTop: 8, textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              Aplikasi cek ongkir dan lacak paket terlengkap
            </Text>
          </View>
        </Card>

        {/* Native Ad (Sponsor) */}
        {isAdsEnabled() && (
          <NativeAdCard adUnitID={AdUnitIDs.native_home} testMode={false} />
        )}

        {/* Features */}
  <Text variant="titleLarge" style={{ marginVertical: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>
          Fitur Utama
        </Text>
        
        {features.map((feature, index) => (
          <Card key={index} elevation={2} style={{ marginBottom: 12 }}>
            <Card.Content style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              backgroundColor: 'transparent',
              paddingVertical: 16
            }}>
              <View style={{
                backgroundColor: feature.color,
                borderRadius: 30,
                padding: 15,
                marginRight: 16
              }}>
                <feature.icon size={30} color="white" />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                  {feature.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {feature.description}
                </Text>
              </View>
              
              <Button
                mode="contained"
                onPress={() => navigation.navigate(feature.screen as never)}
                style={{ backgroundColor: feature.color }}
                compact
              >
                Buka
              </Button>
            </Card.Content>
          </Card>
        ))}

      </View>
    </ScrollView>
  );
};