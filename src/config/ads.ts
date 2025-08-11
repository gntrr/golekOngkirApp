import Config from 'react-native-config';

export const ADS_ENABLED = (Config.ADS_ENABLED ?? 'true') === 'true';
export const ADS_TEST_MODE = (Config.ADS_TEST_MODE ?? 'false') === 'true';

// Official AdMob Native Advanced test unit id
const TEST_NATIVE_ID = 'ca-app-pub-3940256099942544/2247696110';

// All unit IDs are sourced from .env; if missing, fall back to test id (never real values)
export const AdUnitIDs = {
  native_home: Config.ADMOB_NATIVE_HOME_ID || TEST_NATIVE_ID,
  native_tracking: Config.ADMOB_NATIVE_TRACKING_ID || TEST_NATIVE_ID,
  native_calc: Config.ADMOB_NATIVE_CALC_ID || TEST_NATIVE_ID,
  native_search: Config.ADMOB_NATIVE_SEARCH_ID || TEST_NATIVE_ID,
};

export const isAdsEnabled = () => ADS_ENABLED;
export const isAdsTestMode = () => ADS_TEST_MODE;
