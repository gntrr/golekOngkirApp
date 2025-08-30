# Onboarding Feature

Fitur onboarding/walkthrough interaktif untuk pengguna baru aplikasi Golek Ongkir.

## Fitur

- **Step-by-step guide**: Panduan interaktif dengan 5 langkah untuk memperkenalkan fitur-fitur utama aplikasi
- **Progress bar**: Indikator visual menunjukkan progress pengguna dalam walkthrough
- **Animasi halus**: Transisi yang smooth antar step dengan fade dan scale animation
- **Navigasi fleksibel**: Tombol previous/next dengan kemampuan skip
- **Persistent storage**: Status onboarding disimpan secara lokal menggunakan AsyncStorage
- **Version control**: Support untuk menampilkan onboarding lagi ketika ada update fitur
- **Manual trigger**: Pengguna dapat melihat panduan lagi melalui halaman Info

## Struktur File

```
src/
├── screens/
│   └── OnboardingScreen.tsx          # Screen utama onboarding
├── components/
│   └── OnboardingChecker.tsx         # Komponen untuk mengecek status onboarding
├── services/
│   └── onboarding.ts                 # Service untuk mengelola status onboarding
└── navigation/
    └── AppNavigator.tsx              # Navigation yang sudah diupdate
```

## Cara Kerja

1. **First Launch**: Ketika aplikasi dibuka pertama kali, `OnboardingChecker` akan mengecek status di AsyncStorage
2. **Show Onboarding**: Jika belum pernah melihat onboarding, user diarahkan ke `OnboardingScreen`
3. **Complete Onboarding**: Setelah selesai, status disimpan dan user diarahkan ke halaman utama
4. **Subsequent Launches**: User langsung masuk ke halaman utama
5. **Manual Access**: User bisa mengakses onboarding lagi melalui menu "Tampilkan Panduan" di halaman Info

## Konten Onboarding

1. **Welcome** - Perkenalan aplikasi
2. **Calculate Shipping** - Fitur hitung ongkir
3. **Track Package** - Fitur lacak paket
4. **Search Location** - Fitur cari lokasi
5. **Ready to Start** - Konfirmasi siap menggunakan aplikasi

## OnboardingService API

```typescript
// Cek status onboarding
OnboardingService.hasSeenOnboarding(): Promise<boolean>

// Tandai onboarding sebagai sudah dilihat
OnboardingService.markOnboardingAsSeen(): Promise<void>

// Reset status onboarding
OnboardingService.resetOnboarding(): Promise<void>

// Feature hints (untuk pengembangan future)
OnboardingService.shouldShowFeatureHint(featureName: string): Promise<boolean>
OnboardingService.markFeatureHintAsSeen(featureName: string): Promise<void>
```

## Customization

Untuk mengubah konten onboarding, edit array `onboardingSteps` di `OnboardingScreen.tsx`:

```typescript
const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Judul Step',
    description: 'Deskripsi step',
    icon: IconComponent,
    color: '#hexcolor',
  },
  // ... step lainnya
];
```

## Dependencies

- `@react-native-async-storage/async-storage` - Untuk menyimpan status onboarding
- `react-native-paper` - UI components dan theming
- `lucide-react-native` - Icons
- `@react-navigation/native` - Navigation

## Testing

Untuk testing fitur onboarding:

1. **Reset onboarding**: Gunakan tombol "Tampilkan Panduan" di halaman Info
2. **Clear app data**: Hapus data aplikasi untuk simulasi first-time user
3. **Manual reset**: Gunakan `OnboardingService.resetOnboarding()` di development

## Future Enhancements

- [ ] Onboarding yang berbeda untuk setiap update major
- [ ] Feature hints/tooltips untuk fitur baru
- [ ] Analytics tracking untuk onboarding completion rate
- [ ] Dynamic onboarding content dari server
- [ ] A/B testing untuk berbagai variasi onboarding
