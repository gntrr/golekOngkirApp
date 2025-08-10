declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL?: string;
    APP_NAME?: string;
    APP_VERSION?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}