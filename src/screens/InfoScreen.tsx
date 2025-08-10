import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { Info, Smartphone, Globe, Mail, Phone } from 'lucide-react-native';
import { Card } from '../components/Card';

export const InfoScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        {/* App Info */}
        <Card>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Info size={48} color="#2196f3" />
            <Text variant="headlineSmall" style={{ marginTop: 16, fontWeight: 'bold', color: '#333' }}>
              Golek Ongkir
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', textAlign: 'center', marginTop: 8 }}>
              Aplikasi untuk menghitung ongkos kirim, melacak paket, dan mencari lokasi di seluruh Indonesia
            </Text>
          </View>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <List.Item
            title="Versi Aplikasi"
            description="1.0.0"
            left={(props) => <Smartphone {...props} size={24} color="#2196f3" />}
          />
        
        </Card>

        {/* Features */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>
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
        </Card>

        {/* Contact Info */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Informasi Kontak
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16, color: '#666' }}>
            Hubungi kami untuk informasi lebih lanjut, saran, atau masalah teknis
          </Text>
          
          <List.Item
            title="Email"
            description="contact@wimaalif.my.id"
            left={(props) => <Mail {...props} size={24} color="#2196f3" />}
          />
          
          {/* <List.Item
            title="Telepon"
            description="+62 21 1234 5678"
            left={(props) => <Phone {...props} size={24} color="#2196f3" />}
          /> */}
        </Card>

        {/* Legal */}
        <Card>
          <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>
            Legal
          </Text>
          
          <Text variant="bodySmall" style={{ color: '#666', lineHeight: 20 }}>
            © 2024 Golek Ongkir. Semua hak dilindungi undang-undang.
            {"\n\n"}
            Aplikasi ini menggunakan API dari berbagai penyedia layanan kurir untuk memberikan informasi ongkos kirim yang akurat.
            {"\n\n"}
            Data yang ditampilkan dapat berubah sewaktu-waktu sesuai dengan kebijakan masing-masing kurir.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};