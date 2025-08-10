import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Appbar, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Calculator, Package, Search, Info, Truck } from 'lucide-react-native';
import { RootStackParamList } from '../types';
import { Card as CustomCard } from '../components/Card';

export const HomeScreen = () => {
  const navigation = useNavigation();

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
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        {/* Header */}
        <Card elevation={3}>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Truck size={64} color="#2196f3" />
            <Text variant="headlineMedium" style={{ marginTop: 16, textAlign: 'center', color: '#2196f3', fontWeight: 'bold' }}>
              Golek Ongkir
            </Text>
            <Text variant="bodyLarge" style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
              Aplikasi cek ongkir dan lacak paket terlengkap
            </Text>
          </View>
        </Card>

        {/* Features */}
        <Text variant="titleLarge" style={{ marginVertical: 20, fontWeight: 'bold', color: '#333' }}>
          Fitur Utama
        </Text>
        
        {features.map((feature, index) => (
          <Card key={index} elevation={2}>
            <Card.Content style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              backgroundColor: 'transparent'
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
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>
                  {feature.title}
                </Text>
                <Text variant="bodyMedium" style={{ color: '#666', marginTop: 4 }}>
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

        {/* Info */}
        <Card elevation={1}>
          <View style={{ alignItems: 'center' }}>
            <Info size={24} color="#2196f3" />
            <Text variant="bodyMedium" style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
              Aplikasi ini menggunakan API RajaOngkir untuk mendapatkan data ongkir terkini
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};