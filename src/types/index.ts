export interface Province {
  id: number;
  name: string;
  // Legacy fields for backward compatibility
  province_id?: string;
  province?: string;
}

export interface City {
  id: number;
  name: string;
  // Legacy fields for backward compatibility
  city_id?: string;
  province_id?: string;
  province?: string;
  type?: string;
  city_name?: string;
  postal_code?: string;
}

export interface District {
  id: number;
  name: string;
  // Legacy fields for backward compatibility
  subdistrict_id?: string;
  province_id?: string;
  province?: string;
  city_id?: string;
  city?: string;
  type?: string;
  subdistrict_name?: string;
}

export interface SearchResult {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
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

// RAW backend tracking response (as-is from API)
export interface RawTrackSummary {
  courier_code: string;
  courier_name: string;
  waybill_number: string;
  service_code: string;
  waybill_date: string;
  shipper_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: string;
}

export interface RawTrackDetails {
  waybill_number: string;
  waybill_date: string;
  waybill_time: string;
  weight: string;
  origin: string;
  destination: string;
  shipper_name: string;
  shipper_address1: string;
  shipper_address2: string;
  shipper_address3: string;
  shipper_city: string;
  receiver_name: string;
  receiver_address1: string;
  receiver_address2: string;
  receiver_address3: string;
  receiver_city: string;
}

export interface RawTrackDeliveryStatus {
  status: string;
  pod_receiver: string;
  pod_date: string;
  pod_time: string;
}

export interface RawTrackManifestItem {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}

export interface RawTrackingResponse {
  delivered: boolean;
  summary: RawTrackSummary;
  details: RawTrackDetails;
  delivery_status: RawTrackDeliveryStatus;
  manifest: RawTrackManifestItem[];
}

export interface ApiResponse<T> {
  error: boolean;
  data?: {
    meta: {
      message: string;
      code: number;
      status: string;
    };
    data: T;
  };
  status?: number;
  message?: string;
}

export type RootStackParamList = {
  Home: undefined;
  CostCalculator: undefined;
  Tracking: undefined;
  Search: undefined;
  Info: undefined;
};

export type TabParamList = {
  Home: undefined;
  Info: undefined;
};