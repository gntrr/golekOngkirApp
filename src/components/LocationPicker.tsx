import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, Menu, Divider } from 'react-native-paper';
import { Province, City, District } from '../types';
import { apiService } from '../services/api';
import { Card } from './Card';

interface LocationPickerProps {
  onLocationSelect: (location: {
    province?: Province;
    city?: City;
    district?: District;
  }) => void;
  label: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  label,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  const [provinceMenuVisible, setProvinceMenuVisible] = useState(false);
  const [cityMenuVisible, setCityMenuVisible] = useState(false);
  const [districtMenuVisible, setDistrictMenuVisible] = useState(false);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      loadCities(selectedProvince.id.toString());
      setSelectedCity(null);
      setSelectedDistrict(null);
      setCities([]);
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      loadDistricts(selectedCity.id.toString());
      setSelectedDistrict(null);
      setDistricts([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    onLocationSelect({
      province: selectedProvince || undefined,
      city: selectedCity || undefined,
      district: selectedDistrict || undefined,
    });
  }, [selectedProvince, selectedCity, selectedDistrict]);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProvinces();
      if (!response.error && response.data && response.data.data) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (provinceId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getCities(provinceId);
      if (!response.error && response.data && response.data.data) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async (cityId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getDistricts(cityId);
      if (!response.error && response.data && response.data.data) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Text variant="titleMedium" style={{ marginBottom: 16 }}>
        {label}
      </Text>
      
      {/* Province Picker */}
      <Menu
        visible={provinceMenuVisible}
        onDismiss={() => setProvinceMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setProvinceMenuVisible(true)}
            style={{ marginBottom: 8 }}
            disabled={loading}
          >
            {selectedProvince ? selectedProvince.name : 'Pilih Provinsi'}
          </Button>
        }
      >
        <ScrollView style={{ maxHeight: 200 }}>
          {provinces.map((province) => (
            <Menu.Item
              key={`province-${province.id}`}
              onPress={() => {
                setSelectedProvince(province);
                setProvinceMenuVisible(false);
              }}
              title={province.name}
            />
          ))}
        </ScrollView>
      </Menu>

      {/* City Picker */}
      {selectedProvince && (
        <Menu
          visible={cityMenuVisible}
          onDismiss={() => setCityMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCityMenuVisible(true)}
              style={{ marginBottom: 8 }}
              disabled={loading || cities.length === 0}
            >
              {selectedCity ? selectedCity.name : 'Pilih Kota'}
            </Button>
          }
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {cities.map((city) => (
              <Menu.Item
                key={`city-${city.id}`}
                onPress={() => {
                  setSelectedCity(city);
                  setCityMenuVisible(false);
                }}
                title={city.name}
              />
            ))}
          </ScrollView>
        </Menu>
      )}

      {/* District Picker */}
      {selectedCity && (
        <Menu
          visible={districtMenuVisible}
          onDismiss={() => setDistrictMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setDistrictMenuVisible(true)}
              disabled={loading || districts.length === 0}
            >
              {selectedDistrict ? selectedDistrict.name : 'Pilih Kecamatan'}
            </Button>
          }
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {districts.map((district) => (
              <Menu.Item
                key={`district-${district.id}`}
                onPress={() => {
                  setSelectedDistrict(district);
                  setDistrictMenuVisible(false);
                }}
                title={district.name}
              />
            ))}
          </ScrollView>
        </Menu>
      )}
    </Card>
  );
};