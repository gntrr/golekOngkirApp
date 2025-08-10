import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Chip, Divider } from 'react-native-paper';
import { LocationPicker } from '../components/LocationPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Province, City, District, CostResult } from '../types';
import { apiService } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const CostCalculatorScreen = () => {
  const [originLocation, setOriginLocation] = useState<{
    province?: Province;
    city?: City;
    district?: District;
  }>({});
  
  const [destinationLocation, setDestinationLocation] = useState<{
    province?: Province;
    city?: City;
    district?: District;
  }>({});
  
  const [weight, setWeight] = useState('');
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>(['jne']);
  const [results, setResults] = useState<CostResult[]>([]);
  const [loading, setLoading] = useState(false);

  const availableCouriers = [
    { code: 'jne', name: 'JNE' },
    { code: 'pos', name: 'POS Indonesia' },
    { code: 'tiki', name: 'TIKI' },
    { code: 'rpx', name: 'RPX' },
    { code: 'esl', name: 'ESL' },
    { code: 'pcp', name: 'PCP' },
    { code: 'jet', name: 'JET' },
    { code: 'dse', name: 'DSE' },
    { code: 'first', name: 'First Logistics' },
    { code: 'ncs', name: 'NCS' },
    { code: 'star', name: 'Star Cargo' },
  ];

  const toggleCourier = (courierCode: string) => {
    setSelectedCouriers(prev => {
      if (prev.includes(courierCode)) {
        return prev.filter(c => c !== courierCode);
      } else {
        return [...prev, courierCode];
      }
    });
  };

  const calculateCost = async () => {
    if (!originLocation.district || !destinationLocation.district) {
      Alert.alert('Error', 'Pilih lokasi asal dan tujuan terlebih dahulu');
      return;
    }

    if (!weight || parseInt(weight) <= 0) {
      Alert.alert('Error', 'Masukkan berat paket yang valid');
      return;
    }

    if (selectedCouriers.length === 0) {
      Alert.alert('Error', 'Pilih minimal satu kurir');
      return;
    }

    try {
      setLoading(true);
      setResults([]);
      
      const response = await apiService.calculateCost({
        origin: parseInt(originLocation.district.subdistrict_id),
        destination: parseInt(destinationLocation.district.subdistrict_id),
        weight: parseInt(weight),
        couriers: selectedCouriers.join(',')
      });

      if (!response.error && response.data) {
        setResults(response.data);
      } else {
        Alert.alert('Error', response.message || 'Gagal menghitung ongkir');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat menghitung ongkir');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner message="Menghitung ongkir..." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        {/* Origin Location */}
        <LocationPicker
          label="Lokasi Asal"
          onLocationSelect={setOriginLocation}
        />

        {/* Destination Location */}
        <LocationPicker
          label="Lokasi Tujuan"
          onLocationSelect={setDestinationLocation}
        />

        {/* Weight Input */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Berat Paket
          </Text>
          <TextInput
            label="Berat (gram)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            mode="outlined"
            right={<TextInput.Icon icon="scale" />}
          />
        </Card>

        {/* Courier Selection */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Pilih Kurir
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {availableCouriers.map((courier) => (
              <Chip
                key={courier.code}
                selected={selectedCouriers.includes(courier.code)}
                onPress={() => toggleCourier(courier.code)}
                mode={selectedCouriers.includes(courier.code) ? 'flat' : 'outlined'}
              >
                {courier.name}
              </Chip>
            ))}
          </View>
        </Card>

        {/* Calculate Button */}
        <Button
          mode="contained"
          onPress={calculateCost}
          style={{ margin: 16, paddingVertical: 8 }}
          icon="calculator"
          disabled={!originLocation.district || !destinationLocation.district || !weight}
        >
          Hitung Ongkir
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: 'bold' }}>
              Hasil Perhitungan
            </Text>
            
            {results.map((courier, courierIndex) => (
              <View key={courierIndex} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="local-shipping" size={24} color="#2196f3" />
                  <Text variant="titleMedium" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                    {courier.name}
                  </Text>
                </View>
                
                {courier.costs.map((service, serviceIndex) => (
                  <View key={serviceIndex} style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 8 
                  }}>
                    <Text variant="titleSmall" style={{ fontWeight: 'bold', color: '#333' }}>
                      {service.service}
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#666', marginVertical: 4 }}>
                      {service.description}
                    </Text>
                    
                    {service.cost.map((cost, costIndex) => (
                      <View key={costIndex} style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8
                      }}>
                        <View>
                          <Text variant="titleMedium" style={{ color: '#2196f3', fontWeight: 'bold' }}>
                            {formatCurrency(cost.value)}
                          </Text>
                          <Text variant="bodySmall" style={{ color: '#666' }}>
                            Estimasi: {cost.etd} hari
                          </Text>
                        </View>
                        {cost.note && (
                          <Text variant="bodySmall" style={{ color: '#ff9800', fontStyle: 'italic' }}>
                            {cost.note}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
                
                {courierIndex < results.length - 1 && <Divider style={{ marginTop: 8 }} />}
              </View>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
};