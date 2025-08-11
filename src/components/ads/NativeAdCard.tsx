import React, { useEffect, useMemo, useState } from 'react';
import { Image, View, Text as RNText } from 'react-native';
import { useTheme, Text as PaperText } from 'react-native-paper';
import {
  TestIds,
  NativeAd as InvertaseNativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  NativeAdEventType,
} from 'react-native-google-mobile-ads';

// Native ad card using Invertase react-native-google-mobile-ads
// Wraps a loaded NativeAd inside NativeAdView and registers asset views.
export const NativeAdCard = ({ adUnitID, testMode = false, style }: { adUnitID: string; testMode?: boolean; style?: any }) => {
  const theme = useTheme();
  const unitIdToUse = useMemo(() => (testMode ? TestIds.NATIVE : adUnitID), [testMode, adUnitID]);
  const [nativeAd, setNativeAd] = useState<InvertaseNativeAd | undefined>();

  useEffect(() => {
    let mounted = true;
    // Load a native ad for the given unit id.
    InvertaseNativeAd.createForAdRequest(unitIdToUse, {
      // Prefer landscape media if available; keep muted video to match previous behavior
      startVideoMuted: true,
    })
      .then((ad) => {
        if (!mounted) return;
        setNativeAd(ad);
        console.log(`[AD] Native loaded: ${unitIdToUse}`);
        // Example event listener (clicks). Add others as needed.
        ad.addAdEventListener(NativeAdEventType.IMPRESSION, () =>
          console.log(`[AD] Native impression: ${unitIdToUse}`),
        );
        ad.addAdEventListener(NativeAdEventType.CLICKED, () =>
          console.log(`[AD] Native clicked: ${unitIdToUse}`),
        );
      })
      .catch((e) => {
        console.warn(`[AD] Native failed: ${unitIdToUse} -> ${e?.message || e}`);
      });

    return () => {
      mounted = false;
      if (nativeAd) nativeAd.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitIdToUse]);

  if (!unitIdToUse) return null;
  if (!nativeAd) {
    // Simple spacer while loading
    return <View style={[{ height: 0 }, style]} />;
  }

  return (
    <NativeAdView
      nativeAd={nativeAd}
      style={[
        {
          borderRadius: 12,
          overflow: 'hidden',
          marginVertical: 12,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
        style,
      ]}
    >
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!nativeAd.icon?.url && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }}
              />
            </NativeAsset>
          )}
          <View style={{ flex: 1 }}>
            <PaperText variant="labelSmall" style={{ marginBottom: 2, color: theme.colors.onSurfaceVariant }}>
              Sponsored
            </PaperText>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <RNText style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }}>
                {nativeAd.headline}
              </RNText>
            </NativeAsset>
          </View>
        </View>

        {/* Media asset (image or video) */}
        <NativeMediaView style={{ height: 160, marginTop: 10, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.surfaceVariant }} />

        {/* CTA must be a direct child of NativeAsset */}
        {nativeAd.callToAction ? (
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <RNText
              style={{
                marginTop: 12,
                alignSelf: 'flex-start',
                backgroundColor: theme.colors.primary,
                color: theme.colors.onPrimary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                fontWeight: 'bold',
              }}
            >
              {nativeAd.callToAction}
            </RNText>
          </NativeAsset>
        ) : null}
      </View>
  </NativeAdView>
  );
};
