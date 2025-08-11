const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Ensure Tailwind config is resolved from the project root even when Gradle runs Metro from android/
process.env.TAILWIND_CONFIG = process.env.TAILWIND_CONFIG || path.resolve(__dirname, 'tailwind.config.js');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  input: path.resolve(__dirname, 'global.css'),
});
