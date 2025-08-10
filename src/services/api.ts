import axios from 'axios';
import Config from 'react-native-config';
import {
  Province,
  City,
  District,
  SearchResult,
  CostResult,
  TrackingResult,
  ApiResponse,
} from '../types';

const API_BASE_URL = Config.API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get all provinces
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    try {
      const response = await api.get('/provinces');
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  // Get cities by province ID
  getCities: async (provinceId: number): Promise<ApiResponse<City[]>> => {
    try {
      const response = await api.get(`/cities?province=${provinceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  // Get districts by city ID
  getDistricts: async (cityId: number): Promise<ApiResponse<District[]>> => {
    try {
      const response = await api.get(`/districts?city=${cityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  },

  // Search locations
  searchLocations: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  // Calculate shipping cost
  calculateCost: async (data: {
    origin: number;
    destination: number;
    weight: number;
    couriers: string;
  }): Promise<ApiResponse<CostResult[]>> => {
    try {
      const response = await api.post('/cost', data);
      return response.data;
    } catch (error) {
      console.error('Error calculating cost:', error);
      throw error;
    }
  },

  // Track package
  trackPackage: async (data: {
    courier: string;
    waybill: string;
    last_phone_number?: string;
  }): Promise<ApiResponse<TrackingResult>> => {
    try {
      const response = await api.post('/track', data);
      return response.data;
    } catch (error) {
      console.error('Error tracking package:', error);
      throw error;
    }
  },
};