# 🌿 EcoBank - Platform Bank Sampah Digital

EcoBank adalah aplikasi pengelolaan bank sampah digital yang dirancang untuk memfasilitasi pencatatan setoran sampah, kalkulasi poin insentif, dan estimasi reduksi emisi karbon secara otomatis.

---

## 🚀 Teknologi Utama (Tech Stack)

* **Framework**: Next.js 16 (App Router)
* **Library**: React 19 JavaScript (JSX)
* **Styling**: Murni CSS / Utility Classes tanpa library UI eksternal
* **State Management**: React Context API + `localStorage` (untuk pengelolaan saldo poin)
* **Backend Storage**: Route Handlers + Penyimpanan berkas JSON lokal

---

## 🏗️ Design Patterns & Arsitektur

### 1. Container-Presenter Pattern
* **Container (Halaman)**: Memegang seluruh logika bisnis, pemanggilan API, pengelolaan state global, dan pemrosesan form (`app/page.jsx`, `app/admin/page.jsx`).
* **Presenter (Komponen)**: Murni berfokus pada visualisasi antarmuka berdasarkan *props* yang diterima dari Container.

### 2. Hooks Pattern
Logika aplikasi dipisah secara modular ke dalam *Custom Hooks*:
* **`usePoints`**: Mengelola kalkulasi, penambahan, dan konsistensi saldo poin pengguna melalui Context & `localStorage`.
* **`useDropoff`**: Mengurus alur pengiriman data setoran sampah dan pengambilan respons dari API.

### 3. Strategy Pattern
Aturan perhitungan poin dan reduksi emisi karbon untuk setiap jenis sampah ($kg$) dipisah menggunakan **Strategy Pattern** di kalkulator. Hal ini mempermudah penyesuaian atau penambahan aturan tarif poin baru di masa mendatang tanpa merusak struktur komponen UI.

---

## 📂 Struktur Folder Proyek

```text
ecobank/
├── app/
│   ├── admin/             # Halaman Portal Admin (Otentikasi ENV)
│   │   └── page.jsx
│   ├── api/
│   │   └── dropoff/       # Route Handler API Setor Sampah (JSON Storage)
│   │       └── route.js
│   ├── layout.jsx         # Layout Utama Aplikasi
│   └── page.jsx           # Halaman Publik Nasabah (Container)
├── content/
│   └── wasteTypes.json    # Master Data Statis Jenis Sampah
├── data/                  # Storage Persisten Docker Volume (Persistensi JSON)
├── hooks/
│   ├── usePoints.js       # Hook Manajemen Poin & LocalStorage
│   └── useDropoff.js      # Hook Pengiriman Tiket Drop-off
├── lib/
│   └── wasteStrategy.js   # Implementasi Strategy Pattern Perhitungan Poin
├── Dockerfile             # Multi-stage Standalone Build
└── .dockerignore          # Pengecualian Build Docker
```

---

## 🐳 Konfigurasi & Poin Penting Dockerfile

1. **Multi-Stage Build**: Proses kompilasi aplikasi dilakukan menggunakan *image* Node.js, diikuti pemisahan *runtime* agar ukuran *container image* akhir menjadi jauh lebih ringan dan efisien.
2. **Standalone Output**: Aplikasi berjalan menggunakan versi *standalone* Next.js via perintah `node server.js` tanpa bergantung pada dependency dev yang tidak diperlukan.
3. **Networking (`PORT` & `HOSTNAME`)**: Menggunakan **Port 3000** dan **`HOSTNAME=0.0.0.0`** agar aplikasi dapat diakses secara transparan dari luar kontainer.
4. **Persistensi Data (`/app/data`)**: Direktori `/app/data` dipetakan ke **Docker Volume** untuk memastikan data transaksi setoran sampah (`drop-off`) tetap aman dan tidak hilang (*persistent*) saat kontainer di-restart.
5. **Keamanan (`ADMIN_PASSWORD`)**: Kata sandi admin disuntikkan secara dinamis melalui Environment Variable (`ENV`), sehingga kredensial sensitif tidak tersimpan permanen (*hardcoded*) di dalam *image* Docker.

---

## 🛠️ Cara Menjalankan Aplikasi

### 1. Mode Pengembang (Lokal)

```bash
# Install dependencies
npm install

# Jalankan server pengembangan Next.js
npm run dev
```
Akses di peramban web: `http://localhost:3000`

### 2. Mode Kontainer (Docker)

```bash
# 1. Build Docker Image
docker build -t ecobank-app .

# 2. Jalankan Kontainer dengan Volume dan Environment Variable (Windows CMD)
docker run -p 3000:3000 -e ADMIN_PASSWORD=admin123 -v "%cd%\data:/app/data" ecobank-app

# Atau menggunakan Windows PowerShell:
docker run -p 3000:3000 -e ADMIN_PASSWORD=admin123 -v "${PWD}/data:/app/data" ecobank-app
```

---

## 🔑 Kredensial Akses

* **URL Publik (Nasabah)**: `http://localhost:3000`
* **URL Portal Admin**: `http://localhost:3000/admin`
* **Kata Sandi Admin**: Diset via environment variable (`ADMIN_PASSWORD`, default: `admin123`)
* **Repositori Docker Hub**: `https://hub.docker.com/r/hazai24/ecobank`
