# Campus Lost & Found

Platform digital untuk melaporkan barang hilang dan temuan di lingkungan kampus. Memudahkan mahasiswa saling terhubung untuk mengembalikan barang yang hilang.

---

## 🚀 Fitur

- **Autentikasi** — Register dan login dengan email & password
- **CRUD Laporan** — Buat, lihat, edit, dan hapus laporan barang
- **Upload Foto** — Upload foto barang via Cloudinary
- **Semua Laporan** — Lihat laporan dari seluruh pengguna kampus
- **Detail Laporan** — Lihat informasi lengkap setiap laporan
- **Filter & Search** — Filter berdasarkan status dan cari berdasarkan judul
- **Statistik** — Ringkasan total, hilang, dan ditemukan
- **Proteksi Route** — Halaman hanya bisa diakses setelah login
- **Responsive** — Tampilan rapi di desktop dan mobile

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|---|---|
| Next.js 16 (App Router) | Framework fullstack |
| TypeScript | Tipe data statis |
| Tailwind CSS | Styling UI |
| MongoDB Atlas | Database cloud |
| Mongoose | ODM untuk MongoDB |
| NextAuth.js v5 | Autentikasi |
| Cloudinary | Penyimpanan foto |
| bcryptjs | Enkripsi password |

---

## 📋 Cara Kerja Aplikasi

1. User **mendaftar** dan **login** ke aplikasi
2. User bisa **membuat laporan** barang hilang atau temuan lengkap dengan foto dan deskripsi
3. Semua laporan bisa dilihat oleh **seluruh user** di halaman Semua Laporan
4. User yang menemukan barang menulis **nomor WhatsApp** di deskripsi agar bisa dihubungi
5. User yang merasa barangnya ditemukan bisa **menghubungi pelapor** via WhatsApp
6. Setiap user hanya bisa **mengedit dan menghapus** laporan miliknya sendiri

---

## 🗂️ Struktur Project

campus-lost-found/

├── app/

│   ├── api/

│   │   ├── auth/[...nextauth]/   # Handler autentikasi NextAuth

│   │   ├── health/               # Health check endpoint

│   │   ├── items/                # CRUD laporan barang

│   │   ├── register/             # API registrasi user

│   │   └── upload/               # API upload foto Cloudinary

│   ├── components/

│   │   └── Toast.tsx             # Komponen notifikasi

│   ├── dashboard/                # Halaman dashboard (laporan milik sendiri)

│   │   ├── items/create/         # Form buat laporan

│   │   ├── items/[id]/edit/      # Form edit laporan

│   │   ├── DeleteButton.tsx      # Tombol hapus dengan konfirmasi

│   │   └── SearchFilter.tsx      # Filter dan pencarian

│   ├── laporan/                  # Halaman semua laporan (publik)

│   │   ├── [id]/                 # Halaman detail laporan

│   │   └── PublicSearchFilter.tsx

│   ├── login/                    # Halaman login

│   ├── register/                 # Halaman register

│   ├── layout.tsx                # Layout global

│   ├── not-found.tsx             # Halaman 404

│   └── page.tsx                  # Halaman utama

├── lib/

│   ├── mongodb.ts                # Koneksi database

│   └── cloudinary.ts             # Konfigurasi Cloudinary

├── models/

│   ├── User.ts                   # Schema user

│   └── Item.ts                   # Schema laporan barang

├── auth.ts                       # Konfigurasi NextAuth

├── proxy.ts                      # Middleware proteksi route

└── .env.example                  # Contoh environment variable

---

## ⚙️ Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/rekzydwi/campus-lost-found.git
cd campus-lost-found
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Buat File `.env.local`

Salin dari `.env.example` lalu isi nilainya:

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campus_lost_found
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🗃️ Environment Variables

| Variable | Keterangan |
|---|---|
| `MONGODB_URI` | Connection string MongoDB Atlas |
| `NEXTAUTH_SECRET` | Kunci rahasia untuk enkripsi session |
| `NEXTAUTH_URL` | URL aplikasi (http://localhost:3000 untuk development) |
| `CLOUDINARY_CLOUD_NAME` | Cloud name dari dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | API key dari dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret dari dashboard Cloudinary |

---

## 📅 Log Pengembangan

| Hari | Tanggal | Yang Dikerjakan |
|---|---|---|
| 1 | 21 Juni 2026 | Setup project Next.js, Tailwind CSS, GitHub |
| 2 | 22 Juni 2026 | Koneksi MongoDB Atlas, Mongoose, health endpoint |
| 3 | 23-25 Juni 2026 | Autentikasi NextAuth, register, login, middleware |
| 4 | 26 Juni 2026 | CRUD laporan barang, model Item |
| 5 | 27 Juni 2026 | Upload foto via Cloudinary |
| 6 | 28 Juni 2026 | Filter, search, statistik, halaman publik |
| 7 | 28 Juni 2026 | Toast notifikasi, konfirmasi hapus, halaman 404 |
| 8 | 29 Juni 2026 | Detail laporan, README, final cleanup |

---

## 👨‍💻 Developer

**Rekzy Dwi Permana**
Project Magang — Campus Lost & Found