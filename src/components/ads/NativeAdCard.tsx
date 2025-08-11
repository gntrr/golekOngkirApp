import React from 'react';
import { View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import NativeAd, { CallToActionView, HeadlineView, IconView, ImageView, AdBadge } from 'react-native-admob-native-ads';

// Simple Native Advanced card that adapts to app theme
// Requires a valid adUnitID passed via props.

export const NativeAdCard = ({ adUnitID, testMode = false, style }: { adUnitID: string; testMode?: boolean; style?: any }) => {
  const theme = useTheme();
  if (!adUnitID) return null;
  return (
    <NativeAd
      adUnitID={adUnitID}
      enableTestMode={testMode}
      style={[{ borderRadius: 12, overflow: 'hidden', marginVertical: 12, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outline }, style]}
      videoOptions={{ muted: true }}
      enableSwipeGestureOptions={{ tapsAllowed: true, swipeGestureDirection: 'right' }}
    >
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconView style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <AdBadge style={{ marginBottom: 2, alignSelf: 'flex-start' }} textStyle={{ fontSize: 10 }} />
            <HeadlineView style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }} />
          </View>
        </View>

        <ImageView style={{ height: 160, marginTop: 10, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.surfaceVariant }} />

    <CallToActionView
          style={{
            marginTop: 12,
            alignSelf: 'flex-start',
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          textStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
        />

    {/* Label */}
    <Text variant="labelSmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>Sponsor</Text>
      </View>
  </NativeAd>
  );
};
