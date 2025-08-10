import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, List, Divider } from 'react-native-paper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { SearchResult } from '../types';
import { apiService } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchLocations = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      Alert.alert('Error', 'Masukkan minimal 2 karakter untuk pencarian');
      return;
    }

    try {
      setLoading(true);
      setSearchResults([]);
      setHasSearched(true);
      
      const response = await apiService.searchLocations(searchQuery.trim());

      if (!response.error && response.data) {
        setSearchResults(response.data);
      } else {
        Alert.alert('Error', response.message || 'Gagal mencari lokasi');
        setSearchResults([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat mencari lokasi');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchLocations();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  if (loading) {
    return <LoadingSpinner message="Mencari lokasi..." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Search Input */}
      <Card>
        <Text variant="titleMedium" style={{ marginBottom: 16 }}>
          Cari Lokasi
        </Text>
        
        <TextInput
          label="Cari provinsi, kota, atau kecamatan"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          right={
            <TextInput.Icon 
              icon={searchQuery ? "close" : "magnify"} 
              onPress={searchQuery ? clearSearch : undefined}
            />
          }
          placeholder="Contoh: Jakarta Selatan, Bandung, Surabaya"
          onSubmitEditing={handleSearch}
        />
        
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Button
            mode="contained"
            onPress={handleSearch}
            style={{ flex: 1 }}
            icon="magnify"
            disabled={!searchQuery.trim() || searchQuery.trim().length < 2}
          >
            Cari
          </Button>
          
          {(searchQuery || hasSearched) && (
            <Button
              mode="outlined"
              onPress={clearSearch}
              icon="refresh"
            >
              Reset
            </Button>
          )}
        </View>
      </Card>

      {/* Search Results */}
      <ScrollView style={{ flex: 1 }}>
        {hasSearched && (
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Icon name="search" size={24} color="#2196f3" />
              <Text variant="titleMedium" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                Hasil Pencarian
              </Text>
              {searchResults.length > 0 && (
                <Text variant="bodyMedium" style={{ marginLeft: 'auto', color: '#666' }}>
                  {searchResults.length} hasil
                </Text>
              )}
            </View>
            
            {searchResults.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Icon name="search-off" size={48} color="#ccc" />
                <Text variant="bodyLarge" style={{ marginTop: 16, color: '#666', textAlign: 'center' }}>
                  Tidak ada hasil ditemukan
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, color: '#999', textAlign: 'center' }}>
                  Coba gunakan kata kunci yang berbeda
                </Text>
              </View>
            ) : (
              <View>
                {searchResults.map((result, index) => (
                  <View key={index}>
                    <List.Item
                      title={result.subdistrict_name}
                      description={`${result.type} ${result.city}, ${result.province}`}
                      left={(props) => (
                        <List.Icon 
                          {...props} 
                          icon="map-marker" 
                          color="#2196f3"
                        />
                      )}
                      right={(props) => (
                        <View style={{ 
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 8
                        }}>
                          <Text variant="bodySmall" style={{ color: '#666' }}>
                            ID: {result.subdistrict_id}
                          </Text>
                        </View>
                      )}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 0,
                      }}
                      titleStyle={{
                        fontWeight: 'bold',
                        color: '#333'
                      }}
                      descriptionStyle={{
                        color: '#666',
                        marginTop: 4
                      }}
                    />
                    {index < searchResults.length - 1 && <Divider />}
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Icon name="lightbulb-outline" size={48} color="#ff9800" />
              <Text variant="titleMedium" style={{ marginTop: 16, fontWeight: 'bold', color: '#333' }}>
                Tips Pencarian
              </Text>
              
              <View style={{ marginTop: 16, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="check-circle" size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Gunakan minimal 2 karakter
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="check-circle" size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Cari berdasarkan nama kota atau kecamatan
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Icon name="check-circle" size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Contoh: "Jakarta", "Bandung", "Surabaya"
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="check-circle" size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Hasil akan menampilkan kecamatan yang cocok
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};