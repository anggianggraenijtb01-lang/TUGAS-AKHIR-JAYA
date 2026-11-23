# UNI-LANDFARM (Tugas Akhir)

> **Platform Website Toko Digital Resmi & Asisten AI untuk Akselerasi Brand UMKM Lokal Nusantara**

UNI-LANDFARM adalah solusi all-in-one bagi pelaku usaha mikro, kecil, dan menengah (khususnya sektor agrobisnis, perkebunan, kuliner kemasan, dan produk herbal lokal) untuk memiliki website katalog resmi siap jualan, terintegrasi langsung dengan WhatsApp Checkout dan asisten AI pintar.

---

## 📁 Struktur Direktori

```text
UNILAND-NEW-ERA/
├── unilandfarm-frontend/     # Aplikasi Web Klien (React 18 + TypeScript + Vite)
│   ├── public/               # Asset statis, gambar produk UMKM, dan logo
│   ├── src/
│   │   ├── components/       # Komponen UI Landing Page, Auth, Portal, CMS, Wizard
│   │   ├── services/         # Mock data, API connectors, & AI generators
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── App.tsx           # Router & state manajemen utama
│   │   └── index.css         # Desain sistem & tokens (Forest, Gold, & Coffee Brown)
│   └── package.json
│
├── unilandfarm-backend/      # API Server & Backend (Node.js + Express + Prisma)
│   ├── prisma/               # Schema database & migrasi Prisma
│   ├── src/
│   │   ├── config/           # Konfigurasi database & Gemini AI
│   │   ├── controllers/      # Business logic & handler request
│   │   ├── middlewares/      # JWT auth middleware & validation
│   │   ├── routes/           # REST API endpoints
│   │   └── utils/            # Helper token & enkripsi
│   ├── .env.example          # Contoh variabel lingkungan
│   └── package.json
│
├── .gitignore                # Aturan ignore Git (node_modules, build, env)
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Frontend (`unilandfarm-frontend`)

```bash
cd unilandfarm-frontend

# Install dependencies
npm install

# Jalankan server pengembangan
npm run dev

# Buka di browser
# http://localhost:3000
```

### 2. Backend (`unilandfarm-backend`)

```bash
cd unilandfarm-backend

# Install dependencies
npm install

# Duplikasi file konfigurasi env
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Jalankan backend development server
npm run dev
```

---

## 🎨 Teknologi & Desain Sistem

- **Frontend**: React 18, TypeScript, Vite, Modern Responsive Design.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **AI Engine**: Google Gemini API (untuk asisten copywriter & otomatisasi jadwal promo).
- **Tema Visual**:
  - *Deep Pine Forest* (`#233726`, `#18261a`)
  - *Harvest Gold* (`#E5AC32`, `#F59E0B`)
  - *Coffee Earth Brown* (`#7B4B28`, `#5A3825`)
  - *Warm Organic Cream Canvas* (`#FAF7F0`, `#F5F0E6`)

---

## 👤 Pengembang
- **Nama / Akun**: `anggianggraenijtb01-lang`
- **Repositori**: [TUGAS-AKHIR-JAYA](https://github.com/anggianggraenijtb01-lang/TUGAS-AKHIR-JAYA.git)
