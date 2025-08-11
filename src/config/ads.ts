import Config from 'react-native-config';

export const ADS_ENABLED = (Config.ADS_ENABLED ?? 'true') === 'true';

export const AdUnitIDs = {
  native_home: Config.ADMOB_NATIVE_HOME_ID || 'your_ad_unit_id',
  native_tracking: Config.ADMOB_NATIVE_TRACKING_ID || 'your_ad_unit_id',
  native_calc: Config.ADMOB_NATIVE_CALC_ID || 'your_ad_unit_id',
  native_search: Config.ADMOB_NATIVE_SEARCH_ID || 'your_ad_unit_id',
};

export const isAdsEnabled = () => ADS_ENABLED;
