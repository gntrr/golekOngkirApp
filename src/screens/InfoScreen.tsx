import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, List, Divider, useTheme, Button } from 'react-native-paper';
import { Info, Smartphone, Globe, Mail, Phone, HelpCircle } from 'lucide-react-native';
import { Card } from '../components/Card';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { OnboardingService } from '../services/onboarding';

export const InfoScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleShowOnboarding = () => {
    Alert.alert(
      'Tampilkan Panduan',
      'Apakah Anda ingin melihat panduan aplikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              await OnboardingService.resetOnboarding();
              // Reset navigation stack and go to onboarding
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            } catch (error) {
              console.error('Error resetting onboarding:', error);
            }
          },
        },
      ]
    );
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16 }}>
        {/* App Info */}
        <Card>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Info size={48} color={theme.colors.primary} />
            <Text variant="headlineSmall" style={{ marginTop: 16, fontWeight: 'bold', color: theme.colors.onSurface }}>
              Golek Ongkir
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
              Aplikasi untuk menghitung ongkos kirim, melacak paket, dan mencari lokasi di seluruh Indonesia
            </Text>
          </View>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <List.Item
            title="Versi Aplikasi"
            description="1.2.0"
            left={(props) => <Smartphone {...props} size={24} color={theme.colors.primary} />}
          />
        
        </Card>

        {/* Features */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold', color: theme.colors.onSurface }}>
            Fitur Aplikasi
          </Text>
          
          <List.Item
            title="Hitung Ongkir"
            description="Menghitung biaya pengiriman dengan berbagai kurir"
            left={(props) => <Globe {...props} size={24} color="#4caf50" />}
          />
          
          <List.Item
            title="Lacak Paket"
            description="Melacak status pengiriman paket real-time"
            left={(props) => <Globe {...props} size={24} color="#ff9800" />}
          />
          
          <List.Item
            title="Cari Lokasi"
            description="Mencari provinsi, kota, dan kecamatan"
            left={(props) => <Globe {...props} size={24} color="#9c27b0" />}
          />
          
          <Divider style={{ marginVertical: 8 }} />
          
          <List.Item
            title="Tampilkan Panduan"
            description="Lihat panduan penggunaan aplikasi"
            left={(props) => <HelpCircle {...props} size={24} color={theme.colors.primary} />}
            onPress={handleShowOnboarding}
          />
        </Card>

        {/* Contact Info */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Informasi Kontak
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
            Hubungi kami untuk informasi lebih lanjut, saran, atau masalah teknis
          </Text>
          
          <List.Item
            title="Email"
            description="contact@wimaalif.my.id"
            left={(props) => <Mail {...props} size={24} color={theme.colors.primary} />}
          />
          
          {/* <List.Item
            title="Telepon"
            description="+62 21 1234 5678"
            left={(props) => <Phone {...props} size={24} color="#2196f3" />}
          /> */}
        </Card>

        {/* Legal & Privacy */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold', color: theme.colors.onSurface }}>
            Legal & Privacy
          </Text>
          
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
            © {new Date().getFullYear()} Golek Ongkir. Semua hak dilindungi undang-undang.
            {"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>Data & Privacy:</Text>
            {"\n"}
            • Aplikasi mengumpulkan data lokasi untuk fitur ongkir
            {"\n"}
            • Informasi paket dikirim ke server untuk tracking
            {"\n"}
            • Menggunakan Google AdMob yang dapat mengumpulkan data untuk iklan
            {"\n"}
            • Semua data diproses sesuai kebijakan privasi
            {"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>API & Data:</Text>
            {"\n"}
            Aplikasi ini menggunakan API dari berbagai penyedia layanan kurir untuk memberikan informasi ongkos kirim yang akurat. Data yang ditampilkan dapat berubah sewaktu-waktu sesuai dengan kebijakan masing-masing kurir.
            {"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>Iklan:</Text>
            {"\n"}
            Aplikasi menampilkan iklan melalui Google AdMob untuk mendukung pengembangan aplikasi gratis.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};