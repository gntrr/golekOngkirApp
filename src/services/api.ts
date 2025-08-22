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
  RawTrackingResponse,
} from '../types';
import NetInfo from '@react-native-community/netinfo';

// API Configuration
if (!Config.API_BASE_URL) {
  throw new Error('API_BASE_URL is not configured in .env file');
}
const API_BASE_URL = Config.API_BASE_URL;
const FALLBACK_API_URL = 'http://localhost:8000/api';
console.log('API Configuration:', {
  API_BASE_URL,
  Config_API_BASE_URL: Config.API_BASE_URL
});

// Check network connectivity
const checkNetworkConnectivity = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Golek-Ongkir-App/1.0.0',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Retry function for network errors
const retryRequest = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  try {
    // Check network connectivity first
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      throw new Error('No internet connection');
    }
    return await fn();
  } catch (error: any) {
    console.log('API Error:', {
      message: error.message,
      code: error.code,
      retries: retries,
    });
    
    if (retries > 0 && (error.code === 'NETWORK_ERROR' || error.message === 'Network Error' || error.message.includes('timeout'))) {
      console.log(`Retrying request... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

export const apiService = {
  // Get all provinces
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    return retryRequest(async () => {
      try {
        const response = await api.get('/provinces');
        return response.data;
      } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
      }
    });
  },

  // Get cities by province ID
  getCities: async (provinceId: string): Promise<ApiResponse<City[]>> => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/cities?province=${provinceId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    });
  },

  // Get districts by city ID
  getDistricts: async (cityId: string): Promise<ApiResponse<District[]>> => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/districts?city=${cityId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
      }
    });
  },

  // Search locations
  searchLocations: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
    return retryRequest(async () => {
      try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        console.error('Error searching locations:', error);
        throw error;
      }
    });
  },

  // Calculate shipping cost
  calculateCost: async (data: {
    origin: number;
    destination: number;
    weight: number;
    courier: string;
  }): Promise<ApiResponse<CostResult[]>> => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/cost', data);
        return response.data;
      } catch (error) {
        console.error('Error calculating cost:', error);
        throw error;
      }
    });
  },

  // Track package
  trackPackage: async (data: {
    courier: string;
    waybill: string;
    last_phone_number?: string;
  }): Promise<ApiResponse<TrackingResult>> => {
    return retryRequest(async () => {
      try {
        const response = await api.post('/track', data);
        const body = response.data;
        // If backend already returns wrapped ApiResponse<TrackingResult>
        if (body && body.data && body.data.data) {
          return body as ApiResponse<TrackingResult>;
        }

        // If backend returns raw tracking response, normalize it
        if (body && typeof body === 'object' && 'summary' in body && 'manifest' in body) {
          const raw = body as RawTrackingResponse;
          const toMillis = (d?: string, t?: string) => {
            if (!d || !t) return 0;
            const iso = `${d}T${t}`; // treat as local time
            const ms = Date.parse(iso);
            if (!isNaN(ms)) return ms;
            const ms2 = Date.parse(`${d} ${t}`);
            return isNaN(ms2) ? 0 : ms2;
          };
          const sortedManifest = (raw.manifest || [])
            .slice()
            .sort((a, b) => toMillis(b.manifest_date, b.manifest_time) - toMillis(a.manifest_date, a.manifest_time));
          const normalized: TrackingResult = {
            waybill_number: raw.details.waybill_number,
            waybill_date: raw.details.waybill_date,
            waybill_time: raw.details.waybill_time,
            weight: raw.details.weight,
            origin: raw.details.origin,
            destination: raw.details.destination || raw.details.receiver_city,
            shipper_name: raw.details.shipper_name,
            receiver_name: raw.details.receiver_name,
            status: {
              status_code: raw.summary.status,
              status: raw.summary.status,
            },
            manifest: sortedManifest.map((m) => ({
              // Store as ISO-like string to improve Date parsing reliability
              date: `${m.manifest_date}T${m.manifest_time}`.trim(),
              desc: m.manifest_description,
              location: m.city_name || raw.details.receiver_city || '',
            })),
          };

          const wrapped: ApiResponse<TrackingResult> = {
            error: false,
            data: {
              meta: { message: 'OK', code: 200, status: raw.summary.status },
              data: normalized,
            },
          };
          return wrapped;
        }

        // Fallback: return as-is (may cause UI to show error)
        return body as ApiResponse<TrackingResult>;
      } catch (error) {
        console.error('Error tracking package:', error);
        throw error;
      }
    });
  },
};