import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, List, Divider, useTheme } from 'react-native-paper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { SearchResult } from '../types';
import { apiService } from '../services/api';
import { Search, SearchX, Lightbulb, CheckCircle, X, MapPin, RotateCcw } from 'lucide-react-native';
import { NativeAdCard } from '../components/ads/NativeAdCard';
import { AdUnitIDs, isAdsEnabled, isAdsTestMode } from '../config/ads';

export const SearchScreen = () => {
  const theme = useTheme();
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

      if (!response.error && response.data && response.data.data) {
        setSearchResults(response.data.data);
      } else {
        Alert.alert('Error', response.message || 'Gagal mencari lokasi');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mencari lokasi. Silakan coba lagi.');
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
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
            searchQuery ? (
              <X size={20} color="#666" onPress={clearSearch} />
            ) : (
              <Search size={20} color="#666" />
            )
          }
          placeholder="Contoh: Jakarta Selatan, Bandung, Surabaya"
          onSubmitEditing={handleSearch}
        />
        
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Button
            mode="contained"
            onPress={handleSearch}
            style={{ flex: 1 }}
            icon={() => <Search size={20} color="white" />}
            disabled={!searchQuery.trim() || searchQuery.trim().length < 2}
          >
            Cari
          </Button>
          
          {(searchQuery || hasSearched) && (
            <Button
              mode="outlined"
              onPress={clearSearch}
              icon={() => <RotateCcw size={20} color="blue" />}
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
              <Search size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ marginLeft: 8, fontWeight: 'bold' }}>
                Hasil Pencarian
              </Text>
              {searchResults.length > 0 && (
                <Text variant="bodyMedium" style={{ marginLeft: 'auto', color: theme.colors.onSurfaceVariant }}>
                  {searchResults.length} hasil
                </Text>
              )}
            </View>
            
            {searchResults.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <SearchX size={48} color="#ccc" />
                <Text variant="bodyLarge" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                  Tidak ada hasil ditemukan
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.outline, textAlign: 'center' }}>
                  Coba gunakan kata kunci yang berbeda
                </Text>
              </View>
            ) : (
              <View>
                {searchResults.map((result, index) => (
                  <View key={`search-result-${result.id}-${index}`}>
                    <List.Item
                      title={result.subdistrict_name}
                      description={`${result.district_name}, ${result.city_name}, ${result.province_name}`}
                      left={(props) => (
                        <MapPin size={24} color={theme.colors.primary} />
                      )}
                      right={(props) => (
                        <View style={{ 
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 8
                        }}>
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            ID: {result.id}
                          </Text>
                        </View>
                      )}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 0,
                      }}
                      titleStyle={{
                        fontWeight: 'bold',
                        color: theme.colors.onSurface
                      }}
                      descriptionStyle={{
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 4
                      }}
                    />
                    {index === 4 && isAdsEnabled() && (
                      <NativeAdCard adUnitID={AdUnitIDs.native_search} testMode={isAdsTestMode()} />
                    )}
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
              <Lightbulb size={48} color={theme.colors.tertiary} />
              <Text variant="titleMedium" style={{ marginTop: 16, fontWeight: 'bold', color: theme.colors.onSurface }}>
                Tips Pencarian
              </Text>
              
              <View style={{ marginTop: 16, width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <CheckCircle size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Gunakan minimal 2 karakter
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <CheckCircle size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Cari berdasarkan nama kota atau kecamatan
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <CheckCircle size={20} color="#4caf50" />
                  <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1 }}>
                    Contoh: "Jakarta", "Bandung", "Surabaya"
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircle size={20} color="#4caf50" />
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