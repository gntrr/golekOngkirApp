# Golek Ongkir

Aplikasi React Native untuk cek ongkir, lacak paket, dan cari lokasi. Menggunakan Material Design 3 (react-native-paper), React Navigation, dan NativeWind (Tailwind) dengan dukungan Light/Dark Theme.

---

## Ringkasan
- Versi aplikasi: 1.1.0
- Package (Android): `com.gntrr.golekongkir.gaeopo`
- Target SDK: 35 · React Native: 0.80.2 · Node: >= 18 · Java: 17
- Fitur: Hitung Ongkir, Lacak Paket, Cari Lokasi, Beranda
- Dual Theme: Ya (mengikuti sistem)

---

## Instalasi & Menjalankan
Prerequisites: Node 18+, Java 17, Android SDK. (Ikuti panduan resmi RN untuk setup lingkungan.)

1) Install dependencies
```sh
npm install
```

2) Jalankan Metro bundler
```sh
npx react-native start
```

3) Jalankan di Android (device/emulator)
```sh
npx react-native run-android
```

Untuk iOS, lihat `README_APP.md` (opsional).

---

## Build Rilis (APK/AAB) untuk Play Store
1) Signing (Android)
- Siapkan keystore dan set variabel di `~/.gradle/gradle.properties` (disarankan, hindari commit kredensial):
```
MYAPP_UPLOAD_STORE_FILE=your-keystore.keystore
MYAPP_UPLOAD_KEY_ALIAS=your-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-store-pass
MYAPP_UPLOAD_KEY_PASSWORD=your-key-pass
```
- Taruh file keystore di `android/app/` atau gunakan path absolut.

2) Build AAB (untuk Play Console)
```sh
cd android
./gradlew clean bundleRelease --no-daemon
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

3) Build APK (untuk sideload/testing)
```sh
cd android
./gradlew assembleRelease --no-daemon
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

4) Versi aplikasi
- Atur di `android/app/build.gradle`:
  - `versionCode` (wajib naik setiap rilis)
  - `versionName` (mis. "1.1.0")

Catatan: Proyek memakai JSC Intl (`jsc-android-intl`) agar `Intl.NumberFormat` bekerja di Android. Ada fallback JS untuk format Rupiah jika Intl tidak tersedia.

---

## Dual Theme (Light/Dark)
- Theme diatur di `App.tsx` memakai `react-native-paper` (MD3 light/dark).
- Komponen mengikuti token warna:
  - Background: `theme.colors.background`
  - Konten/kartu: `theme.colors.surface` / `surfaceVariant`
  - Teks utama: `theme.colors.onSurface`
  - Teks sekunder: `theme.colors.onSurfaceVariant`
  - Aksen: `theme.colors.primary` / `secondary` / `tertiary`
- Navigasi (`src/navigation/AppNavigator.tsx`):
  - Header/top app bar: background `surface`, teks/icon `onSurface` (mendukung dark mode).
  - Tab bar: tinggi lebih lega, padding bawah ekstra, inactive tint `onSurfaceVariant`, background `surface/elevation`.
- Semua screen utama (Home, Info, Search, Cost Calculator, Tracking) sudah disesuaikan agar kontras baik di kedua mode.

---

## NativeWind/Tailwind Setup
- Konfigurasi: `tailwind.config.js` (root).
- Entry CSS: `global.css` (root)
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- `metro.config.js` mengatur `process.env.TAILWIND_CONFIG` dan path absolut `global.css` supaya Gradle yang berjalan dari `android/` tetap menemukan konfigurasi.
- Ada `android/tailwind.config.js` yang me-require config root sebagai fallback.

---

## Ikon Aplikasi
- Ganti ikon di `android/app/src/main/res/mipmap-*/ic_launcher.png` dan `ic_launcher_round.png`.
- Rekomendasi: Android Studio > New > Image Asset (Launcher Icons, Adaptive & Legacy) untuk menghasilkan semua densitas.
- Manifest menunjuk `@mipmap/ic_launcher` dan `@mipmap/ic_launcher_round`.

---

## Konfigurasi API
- Ubah base URL di `src/services/api.ts`.
- Endpoints dipakai: `GET /provinces`, `GET /cities`, `GET /districts`, `GET /search`, `POST /cost`, `POST /track`.
- Dapat gunakan `.env` (sudah terpasang `react-native-config` via `dotenv.gradle`). Contoh ada di `.env.example`.
- Catatan emulator: Android emulator gunakan `http://10.0.2.2:8000/api`, iOS simulator gunakan `http://127.0.0.1:8000/api` untuk backend lokal.

Contoh isi `.env`:
```env
# wajib
API_BASE_URL=https://api.example.com/v1

# opsional
APP_NAME=Golek Ongkir
APP_VERSION=1.0.0
```

---

## Troubleshooting
- Metro hang saat task `createBundleReleaseJsAndAssets`:
  - Pastikan di `android/app/build.gradle`: `debuggableVariants = ["debug"]` (agar rilis membundel JS).
  - Reset Watchman (opsional):
    ```
    watchman watch-del <project-root>
    watchman watch-project <project-root>
    ```
- Error Tailwind config saat bundling dari `android/`:
  - `metro.config.js` sudah mengatur `TAILWIND_CONFIG`; pastikan `global.css` ada di root.
- ReferenceError: `Intl` (Android):
  - Sudah diatasi dengan `jsc-android-intl` + fallback JS untuk format Rupiah.
- Gradle warnings/deprecations: informasional, aman; update plugin bila perlu.

---

## Lisensi
Lisensi: MIT — lihat file `LICENSE`.
