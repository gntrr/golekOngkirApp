# Golek Ongkir App

Aplikasi React Native untuk cek ongkir dan lacak paket dengan Material Design yang modern dan responsif.

## Fitur Utama

### 🏠 Beranda
- Dashboard utama dengan navigasi ke semua fitur
- Desain Material Design yang modern
- Informasi singkat tentang aplikasi

### 💰 Hitung Ongkir
- Pilih lokasi asal dan tujuan (Provinsi → Kota → Kecamatan)
- Input berat paket dalam gram
- Pilih multiple kurir (JNE, POS, TIKI, Sicepat, J&T, NCS, SAP, Ninja, Lion, Anteraja, Rex, IDE)
- Tampilkan hasil perhitungan dengan detail layanan dan estimasi waktu
- Format mata uang Rupiah yang mudah dibaca

### 📦 Lacak Paket
- Pilih kurir untuk pelacakan
- Input nomor resi
- Khusus JNE: input 5 digit terakhir nomor telepon (opsional)
- Tampilkan informasi lengkap paket (pengirim, penerima, berat, dll)
- Timeline tracking dengan status terkini
- Riwayat perjalanan paket dengan tanggal dan lokasi

### 🔍 Cari Lokasi
- Pencarian cepat provinsi, kota, dan kecamatan
- Minimal 2 karakter untuk pencarian
- Hasil pencarian dengan ID lokasi untuk referensi
- Tips pencarian yang membantu user

## Tech Stack

- **React Native 0.80.2** - Framework mobile
- **TypeScript** - Type safety
- **React Navigation 6** - Navigation dengan bottom tabs
- **React Native Paper** - Material Design components
- **NativeWind** - Tailwind CSS untuk React Native
- **React Native Vector Icons** - Icon set Material Icons
- **Axios** - HTTP client untuk API calls

## API Backend

Aplikasi ini menggunakan backend (contoh):
- **Production**: `https://api.example.com/v1`
- **Local Android emulator**: `http://10.0.2.2:8000/api`
- **Local iOS simulator**: `http://127.0.0.1:8000/api`

### Endpoints yang digunakan:
- `GET /provinces` - Daftar provinsi
- `GET /cities?province={id}` - Daftar kota berdasarkan provinsi
- `GET /districts?city={id}` - Daftar kecamatan berdasarkan kota
- `GET /search?q={term}` - Pencarian lokasi
- `POST /cost` - Hitung ongkir
- `POST /track` - Lacak paket

## Instalasi dan Menjalankan

### Prerequisites
- Node.js 18+
- React Native development environment
- Android Studio (untuk Android)
- Xcode (untuk iOS)

### Langkah Instalasi

1. **Clone atau download project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (khusus iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Jalankan Metro bundler**
   ```bash
   npx react-native start
   ```

5. **Jalankan aplikasi**
   
   **Android:**
   ```bash
   npx react-native run-android
   ```
   
   **iOS:**
   ```bash
   npx react-native run-ios
   ```

## Struktur Project

```
src/
├── components/          # Komponen reusable
│   ├── Card.tsx        # Material Design card
│   ├── LoadingSpinner.tsx  # Loading indicator
│   └── LocationPicker.tsx  # Picker untuk lokasi
├── navigation/         # Setup navigasi
│   └── AppNavigator.tsx
├── screens/           # Halaman-halaman utama
│   ├── HomeScreen.tsx
│   ├── CostCalculatorScreen.tsx
│   ├── TrackingScreen.tsx
│   └── SearchScreen.tsx
├── services/          # API services
│   └── api.ts
└── types/            # TypeScript definitions
    └── index.ts
```

## Fitur Design

### Material Design 3
- Menggunakan React Native Paper dengan Material Design 3
- Color scheme yang konsisten (Primary: Blue, Secondary: Pink)
- Elevation dan shadows yang tepat
- Typography yang sesuai Material Design guidelines

### Responsive Design
- Layout yang adaptif untuk berbagai ukuran layar
- Touch targets yang sesuai standar accessibility
- Spacing dan padding yang konsisten

### User Experience
- Loading states yang informatif
- Error handling dengan alert yang jelas
- Form validation yang real-time
- Smooth navigation dengan bottom tabs
- Visual feedback untuk semua interaksi

## Konfigurasi

### API Configuration
URL API dapat diubah di file `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend.com/api';
```

### Theme Configuration
Theme Material Design dapat dikustomisasi di `App.tsx`:
```typescript
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196f3',
    secondary: '#e91e63',
  },
};
```

## Troubleshooting

### Metro bundler error
Jika port 8081 sudah digunakan:
```bash
npx react-native start --port 8082
```

### Android build error
Clean dan rebuild:
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### iOS build error
Clean dan install ulang pods:
```bash
cd ios && rm -rf Pods && pod install && cd ..
npx react-native run-ios
```

## Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## Lisensi

MIT License - lihat file LICENSE untuk detail lengkap.