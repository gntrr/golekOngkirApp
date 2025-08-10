export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface District {
  subdistrict_id: string;
  province_id: string;
  province: string;
  city_id: string;
  city: string;
  type: string;
  subdistrict_name: string;
}

export interface SearchResult {
  subdistrict_id: string;
  province_id: string;
  province: string;
  city_id: string;
  city: string;
  type: string;
  subdistrict_name: string;
}

export interface CostService {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

export interface CostResult {
  code: string;
  name: string;
  costs: CostService[];
}

export interface TrackingDetail {
  date: string;
  desc: string;
  location: string;
}

export interface TrackingResult {
  waybill_number: string;
  waybill_date: string;
  waybill_time: string;
  weight: string;
  origin: string;
  destination: string;
  shipper_name: string;
  receiver_name: string;
  status: {
    status_code: string;
    status: string;
  };
  manifest: TrackingDetail[];
}

export interface ApiResponse<T> {
  error: boolean;
  data?: T;
  status?: number;
  message?: string;
}

export type RootStackParamList = {
  Home: undefined;
  CostCalculator: undefined;
  Tracking: undefined;
  Search: undefined;
};