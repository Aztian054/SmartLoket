# SmartLoket

> Sistem Loket Pelayanan Pertanahan Elektronik — Kantor Pertanahan Kota Bandar Lampung

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Inertia](https://img.shields.io/badge/Inertia.js-2-9553c9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)

---

## 📋 Deskripsi

**SmartLoket** adalah aplikasi web untuk digitalisasi pelayanan loket pertanahan di Kantor Pertanahan Kota Bandar Lampung. Sistem mengelola **10 tiket layanan** (Pertama Kali, Jual Beli, Ganti Nama, Roya, Hak Tanggungan, dan lain-lain) dengan alur kerja **9 peran RBAC** dari Loket Penerimaan hingga Sertifikat Elektronik terbit, disertai **Tracking Publik** bagi pemohon dan **Laporan & Rekap** untuk pimpinan.

Fitur hasil rebranding SmartLoket:

- 🏛️ **Logo resmi Kementerian ATR/BPN 2026** dipakai sebagai identitas aplikasi (SVG, favicon, header, sidebar, dan halaman publik).
- 🌗 **Toggle tema site-wide** (Light / Dark / System) tersedia di header aplikasi dan halaman Beranda — tidak lagi hanya di halaman Settings.
- 🔐 **Settings = Manajemen Akun (khusus Admin)** — menu "Manajemen Akun" pindah dari sidebar admin ke menu **Settings** pada dropdown profil; halamannya kini berisi kelola akun petugas + pengaturan email pengirim (Profil Admin).
- ✉️ **Pengirim email sistem = Profil Admin** yang dapat diubah dinamis tanpa menyentuh `.env` (email revisi pemohon dikirim dari email + sandi aplikasi akun admin).
- 🧪 **Email pemohon tersedia di seluruh 10 tiket contoh** untuk uji alur notifikasi revisi.

---

## 🏗️ Tech Stack

| Layer | Teknologi |
| ------- | ----------- |
| **Frontend** | React 19, TypeScript, Inertia.js 2, Tailwind CSS 4 |
| **UI Components** | shadcn/ui, Radix UI, Lucide React |
| **Backend** | Laravel 12, PHP 8.2+ |
| **Database** | MySQL (default melalui Laragon), SQLite (pengujian) |
| **Build Tool** | Vite (Laravel React Starter Kit) |
| **Email** | SMTP (konfigurasi `.env` atau Profil Admin dinamis) |

---

## 👥 Peran (RBAC 9)

| Peran | Kode | Menu Utama |
| ------- | ------ | ------------ |
| Admin | `admin` | Database Tiket, Arsip, Revisi, Form Pendaftaran, Settings (Manajemen Akun) |
| Pemimpin | `pemimpin` | Monitoring, Laporan & Rekap |
| Loket Penerimaan | `loket` | Loket Penerimaan |
| Verifikator | `verifikator` | Verifikasi Berkas |
| Warkah | `warkah` | Pencarian & Data Warkah |
| Validator BT | `validator_btel` | Validasi Pra-BTel |
| Validator SU | `validator_suel` | Validasi Pra-SuEl |
| Alih Media BT | `alih_media_btel` | Alih Media Pra-BTel |
| Alih Media SU | `alih_media_suel` | Alih Media Pra-SuEl |

---

## 🔄 Alur Layanan (V2.0 & 2026)

```txt
Loket Penerimaan
   → Verifikasi Berkas
   → Warkah (penelusuran data warkah + serah terima berkas ke validator)
   → Validasi Pra-BTel ──┬── paralel
   → Validasi Pra-SuEl ──┘
   → Alih Media Pra-BTel ──┬── paralel
   → Alih Media Pra-SuEl ──┘
   → Sertifikat Elektronik terbit
```

Setiap tahap memakai pola **pull-based**: Smart Search → Add → Proses → Selesai → kembali ke Database Admin. Dokumen alur detail: [`docs/flow/alur-warkah.md`](docs/flow/alur-warkah.md).

---

## 🚀 Instalasi & Menjalankan

> Lingkungan disarankan: **Laragon** (PHP 8.2+, MySQL, Composer, Node.js 20+).

```bash
# 1. Dependensi
composer install
npm install

# 2. Konfigurasi environment
cp .env.example .env
php artisan key:generate
# → isi DB_USERNAME / DB_PASSWORD / DB_DATABASE (atau pakai SQLite: DB_CONNECTION=sqlite)

# 3. Migrasi + seeder data contoh (users, tiket, master)
php artisan migrate --seed

# 4. Build aset frontend (pengembangan)
npm run dev
# atau untuk produksi:
npm run build

# 5. Jalankan server
php artisan serve
```

Login cepat (hasil `UserSeeder`):

| Username | Password | Peran |
| ---------- | ---------- | ------- |
| `admin` | `admin123` | Admin |
| `pemimpin` | `pemimpin123` | Pemimpin |
| `loket1` | `loket123` | Loket |
| `verifikator1` | `verif123` | Verifikator |
| `warkah1` | `warkah123` | Warkah |
| `vbtel1` / `vsuel1` | `vbtel123` / `vsuel123` | Validator |
| `ambt1` / `amsu1` | `ambt123` / `amsu123` | Alih Media |

Data tiket contoh dibuat oleh `SampleTiketSeeder` (10 tiket, semuanya berisi `email_pemohon` untuk uji notifikasi revisi). Email pemohon yang dipakai: `razky0823@gmail.com`, `agustus0852@gmail.com`, `razky8804st@gmail.com`, `kiritokun8804@gmail.com`, `jeckagus0823@gmail.com`, `jeckvartigo0823@gmail.com`, `awir4806@gmail.com`.

---

## ✉️ Pengaturan Email Pengirim (Profil Admin)

Email revisi berkas otomatis dikirim ke `email_pemohon` tiap kali berkas dikembalikan dari tahap mana pun.

- **Pengirim default** mengikuti `.env` (`MAIL_FROM_ADDRESS`, `MAIL_USERNAME`, `MAIL_PASSWORD`).
- **Pengirim dinamis (opsional)**: Admin membuka **Settings → Manajemen Akun → Pengaturan Email Pengirim (Profil Admin)**, mengisi email + Sandi Aplikasi. `RevisionEmailService` lalu memakai profil admin tersebut sebagai `from` & kredensial SMTP saat runtime, tanpa mengubah `.env`.
- Kolom `sandi_aplikasi` tersimpan di tabel `users` dan **tidak pernah diserialisasi** ke frontend (`$hidden`).

Dokumen alur lengkap: [`docs/flow/email-revisi-pemohon.md`](docs/flow/email-revisi-pemohon.md).

---

## 🧪 Pengujian

```bash
php artisan test                 # suite fitur (termasuk BerkasLengkapMilestoneTest)
npm run build                    # validasi tipe + bundling frontend
php -l app/Http/Controllers/*.php
```

---

## 📁 Struktur Penting

```text
app/
├── Http/Controllers/AdminController.php   # DB admin, Manajemen Akun, settings.email
├── Models/{User,Tiket,BidangTanah, …}     # model domain
└── Services/RevisionEmailService.php      # pengirim email revisi (dinamis per profil admin)
database/
├── migrations/                            # skema (sandi_aplikasi, email_pemohon, …)
└── seeders/                               # UserSeeder, SampleTiketSeeder, …
resources/js/
├── components/app-header.tsx              # header global + toggle tema
├── components/app-sidebar.tsx             # navigasi per peran
└── pages/                                 # halaman Inertia (admin, loket, tahap, …)
public/images/logobpn2026.svg              # logo resmi (favicon/header/sidebar)
docs/flow/                                 # dokumentasi alur layanan
```

---

## 📄 Lisensi

Proyek internal Kantor Pertanahan Kota Bandar Lampung. Seluruh logo & identitas Kementerian ATR/BPN adalah aset kementerian.
