import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Chip, Banner, useTheme } from 'react-native-paper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { TrackingResult } from '../types';
import { apiService } from '../services/api';
import { Truck, Receipt, Phone, Search, RotateCcw, Construction, Check } from 'lucide-react-native';
import { NativeAdCard } from '../components/ads/NativeAdCard';
import { AdUnitIDs, isAdsEnabled, isAdsTestMode } from '../config/ads';

export const TrackingScreen = () => {
  const theme = useTheme();
  const [selectedCourier, setSelectedCourier] = useState('');
  const [waybill, setWaybill] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const couriers = [
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

  const trackPackage = async () => {
    if (!selectedCourier) {
      Alert.alert('Error', 'Pilih kurir terlebih dahulu');
      return;
    }

    if (!waybill.trim()) {
      Alert.alert('Error', 'Masukkan nomor resi');
      return;
    }

    try {
      setLoading(true);
      setTrackingResult(null);
      
      const trackingData: any = {
        courier: selectedCourier,
        waybill: waybill.trim(),
      };

      // Add phone number for JNE if provided
      if (selectedCourier === 'jne' && phoneNumber.trim()) {
        trackingData.last_phone_number = phoneNumber.trim();
      }

      const response = await apiService.trackPackage(trackingData);

      if (!response.error && response.data && response.data.data) {
        setTrackingResult(response.data.data);
      } else {
        Alert.alert('Error', response.message || 'Gagal melacak paket');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat melacak paket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered') || lowerStatus.includes('terkirim')) {
      return theme.colors.secondary;
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('perjalanan')) {
      return theme.colors.tertiary;
    } else if (lowerStatus.includes('picked') || lowerStatus.includes('diambil')) {
      return theme.colors.primary;
    }
    return theme.colors.outline;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Melacak paket..." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Development Notice Banner */}
      <Banner
        visible={true}
        actions={[]}
        icon={() => <Construction size={20} color={theme.colors.tertiary} />}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline,
        }}
      >
        <Text style={{ color: theme.colors.onSurface, fontSize: 14 }}>
          🚧 Fitur pelacakan resi masih dalam tahap pengembangan dan mungkin belum berfungsi dengan sempurna.
        </Text>
      </Banner>
      
      <View style={{ padding: 16 }}>
        {/* Courier Selection */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Pilih Kurir
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {couriers.map((courier) => (
              <Chip
                key={courier.code}
                selected={selectedCourier === courier.code}
                onPress={() => setSelectedCourier(courier.code)}
                mode={selectedCourier === courier.code ? 'flat' : 'outlined'}
                icon={selectedCourier === courier.code ? () => <Check size={16} color="white" /> : undefined}
              >
                {courier.name}
              </Chip>
            ))}
          </View>
        </Card>

        {/* Waybill Input */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16 }}>
            Nomor Resi
          </Text>
          <TextInput
            label="Nomor Resi"
            value={waybill}
            onChangeText={setWaybill}
            mode="outlined"
            right={<TextInput.Icon icon={() => <Receipt size={20} color={theme.colors.onSurfaceVariant} />} />}
            placeholder="Masukkan nomor resi"
          />
        </Card>

        {/* Phone Number for JNE */}
        {selectedCourier === 'jne' && (
          <Card>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              Nomor Telepon (Opsional)
            </Text>
            <TextInput
              label="5 digit terakhir nomor telepon penerima"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              keyboardType="numeric"
              maxLength={5}
              right={<TextInput.Icon icon={() => <Phone size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="12345"
            />
            <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
              Khusus untuk JNE, masukkan 5 digit terakhir nomor telepon penerima jika diperlukan
            </Text>
          </Card>
        )}

        {/* Track Button */}
        <Button
          mode="contained"
          onPress={trackPackage}
          style={{ margin: 16, paddingVertical: 8 }}
          icon={() => <Search size={20} color={theme.colors.onPrimary} />}
          disabled={!selectedCourier || !waybill.trim()}
        >
          Lacak Paket
        </Button>

  {/* Tracking Results */}
  {trackingResult ? (
          <Card>
            <Text variant="titleLarge" style={{ marginBottom: 16, fontWeight: 'bold' }}>
              Hasil Pelacakan
            </Text>
            
            {/* Package Info */}
            <View style={{ 
              backgroundColor: theme.colors.primaryContainer, 
              padding: 16, 
              borderRadius: 8, 
              marginBottom: 16 
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Truck size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                  {trackingResult.waybill_number}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Tanggal Kirim:</Text>
                <Text variant="bodyMedium">
                  {trackingResult.waybill_date} {trackingResult.waybill_time}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Berat:</Text>
                <Text variant="bodyMedium">{trackingResult.weight}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Asal:</Text>
                <Text variant="bodyMedium">{trackingResult.origin}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Tujuan:</Text>
                <Text variant="bodyMedium">{trackingResult.destination}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Pengirim:</Text>
                <Text variant="bodyMedium">{trackingResult.shipper_name}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Penerima:</Text>
                <Text variant="bodyMedium">{trackingResult.receiver_name}</Text>
              </View>
            </View>

            {/* Current Status */}
            <View style={{ 
              backgroundColor: getStatusColor(trackingResult.status.status), 
              padding: 16, 
              borderRadius: 8, 
              marginBottom: 16 
            }}>
              <Text variant="titleMedium" style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
                Status: {trackingResult.status.status}
              </Text>
            </View>

            {/* Tracking History */}
            <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: 'bold' }}>
              Riwayat Pengiriman
            </Text>
            
            {trackingResult.manifest.map((item, index) => (
              <View key={index} style={{ 
                flexDirection: 'row',
                paddingVertical: 12,
                borderLeftWidth: 3,
                borderLeftColor: index === 0 ? theme.colors.secondary : theme.colors.outlineVariant || theme.colors.outline,
                paddingLeft: 16,
                marginLeft: 8,
                marginBottom: 8
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: index === 0 ? theme.colors.secondary : theme.colors.outlineVariant || theme.colors.outline,
                  marginRight: 16,
                  marginTop: 4,
                  marginLeft: -24
                }} />
                
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                    {item.desc}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    {formatDate(item.date)} • {item.location}
                  </Text>
                </View>
              </View>
            ))}
            {isAdsEnabled() && (
              <NativeAdCard adUnitID={AdUnitIDs.native_tracking} testMode={isAdsTestMode()} />
            )}
          </Card>
  ) : null}
      </View>
    </ScrollView>
  );
};