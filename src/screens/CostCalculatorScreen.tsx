import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Chip, Divider, useTheme } from 'react-native-paper';
import { LocationPicker } from '../components/LocationPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Province, City, District, CostResult } from '../types';
import { apiService } from '../services/api';
import { Truck, Scale, Calculator, Check } from 'lucide-react-native';

export const CostCalculatorScreen = () => {
  const theme = useTheme();
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
    { code: 'sicepat', name: 'Sicepat' },
    { code: 'ide', name: 'IDE' },
    { code: 'sap', name: 'SAP' },
    { code: 'jnt', name: 'JNT' },
    { code: 'ninja', name: 'Ninja' },
    { code: 'tiki', name: 'TIKI' },
    { code: 'lion', name: 'Lion' },
    { code: 'anteraja', name: 'Anteraja' },
    { code: 'pos', name: 'POS Indonesia' },
    { code: 'ncs', name: 'NCS' },
    { code: 'rex', name: 'Rex' },
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
      
      const requestData = {
        origin: originLocation.district.id,
        destination: destinationLocation.district.id,
        weight: parseInt(weight),
        courier: selectedCouriers.join(':')
      };
      
      console.log('Sending cost calculation request:', requestData);
      console.log('Selected couriers:', selectedCouriers);
      
      const response = await apiService.calculateCost(requestData);
      console.log('API Response:', response);
      console.log('API Response Data:', JSON.stringify(response.data, null, 2));

      // Check if response has data directly or nested in data.data
      if (response && !response.error) {
        const resultData = response.data?.data || response.data || response;
        console.log('Result Data:', JSON.stringify(resultData, null, 2));
        
        if (resultData && Array.isArray(resultData) && resultData.length > 0) {
          // Log each service's data structure
          resultData.forEach((service, index) => {
            console.log(`Service ${index}:`, JSON.stringify(service, null, 2));
          });
          
          // Transform flat array of services into grouped courier structure
          const groupedByCourier = resultData.reduce((acc: any, service: any) => {
            const courierCode = service.code;
            const courierName = service.name;
            
            if (!acc[courierCode]) {
              acc[courierCode] = {
                code: courierCode,
                name: courierName,
                costs: []
              };
            }
            
            acc[courierCode].costs.push({
              service: service.service,
              description: service.description,
              cost: [{
                value: service.cost,
                etd: service.etd,
                note: ''
              }]
            });
            
            return acc;
          }, {});
          
          const transformedResults = Object.values(groupedByCourier) as CostResult[];
           console.log('Transformed Results:', JSON.stringify(transformedResults, null, 2));
           setResults(transformedResults);
        } else {
          console.log('No valid result data found');
          Alert.alert('Error', 'Tidak ada data ongkir yang ditemukan');
        }
      } else {
        // Handle API error response
        const errorMessage = response.data?.meta?.message || response.message || 'Gagal menghitung ongkir';
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Cost calculation error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Terjadi kesalahan saat menghitung ongkir';
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        if (serverError && serverError.meta && serverError.meta.message) {
          errorMessage = serverError.meta.message;
        } else if (serverError && typeof serverError === 'object') {
          // Handle validation errors
          if (serverError.message) {
            errorMessage = serverError.message;
          } else if (serverError.errors) {
            // Handle field validation errors
            const firstError = Object.values(serverError.errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0] as string;
            }
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    try {
      if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(amount);
      }
    } catch {}
    // Fallback: simple thousands separator and prefix
    return `Rp ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  if (loading) {
    return <LoadingSpinner message="Menghitung ongkir..." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
            right={<TextInput.Icon icon={() => <Scale size={20} color={theme.colors.onSurfaceVariant} />} />}
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
                icon={selectedCouriers.includes(courier.code) ? () => <Check size={16} color="black" /> : undefined}
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
          icon={() => <Calculator size={20} color="white" />}
          disabled={!originLocation.district || !destinationLocation.district || !weight}
        >
          Hitung Ongkir
        </Button>

        {/* Results */}
        {results && results.length > 0 && (
          <Card>
            <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: 'bold' }}>
              Hasil Perhitungan
            </Text>
            
            {results && results.map((courier, courierIndex) => (
              <View key={courierIndex} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Truck size={24} color={theme.colors.primary} />
                  <Text variant="titleMedium" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                    {courier.name}
                  </Text>
                </View>
                
                {courier.costs && courier.costs.map((service, serviceIndex) => (
                  <View key={serviceIndex} style={{ 
                    backgroundColor: theme.colors.surfaceVariant, 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 8 
                  }}>
                    <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                      {service.service}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginVertical: 4 }}>
                      {service.description}
                    </Text>
                    
                    {service.cost && service.cost.map((cost, costIndex) => (
                      <View key={costIndex} style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8
                      }}>
                        <View>
                          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {formatCurrency(cost.value)}
                          </Text>
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            Estimasi: {cost.etd} hari
                          </Text>
                        </View>
                        {cost.note && (
                          <Text variant="bodySmall" style={{ color: theme.colors.tertiary, fontStyle: 'italic' }}>
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