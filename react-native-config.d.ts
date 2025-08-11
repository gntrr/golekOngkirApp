declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL?: string;
    APP_NAME?: string;
    APP_VERSION?: string;
  ADS_ENABLED?: string;
  ADS_TEST_MODE?: string;
  ADMOB_APP_ID?: string;
  ADMOB_NATIVE_HOME_ID?: string;
  ADMOB_NATIVE_TRACKING_ID?: string;
  ADMOB_NATIVE_CALC_ID?: string;
  ADMOB_NATIVE_SEARCH_ID?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}