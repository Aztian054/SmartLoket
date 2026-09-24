# Alur Email Revisi Pemohon

> Dokumen pendamping SmartLoket — mekanisme notifikasi email ketika berkas
> dikembalikan (**revisi**) dari tahap mana pun, plus konfigurasi **pengirim dinamis
> dari Profil Admin**.

## 1. Ringkasan

Ketika seorang petugas (Verifikator, Warkah, Validator BT/SU, atau Alih Media)
melakukan aksi **revisi** pada suatu tiket, sistem mengirim email pemberitahuan
ke `email_pemohon` tiket tersebut. Pengiriman bersifat **non-fatal**: kegagalan
SMTP **tidak pernah** menggagalkan aksi revisi di workflow.

Pemicu:

```
Stage mana pun (verifikasi/warkah/validasi/alih media)
   → aksi revisi (controller memanggil RevisionEmailService::sendForRevisi)
   → email ke email_pemohon tiket
   → lampiran Form_Perbaikan (PDF, fallback HTML)
```

## 2. Data Pemohon

- Kolom: `tikets.email_pemohon` (migrasi `2026_09_20_000001`, setelah `no_hp_pemohon`).
- Diisi di form Loket & form Admin (tambah tiket).
- `SampleTiketSeeder` mengisi **10 tiket** dengan 7 alamat uji:
  `razky0823@gmail.com`, `agustus0852@gmail.com`, `razky8804st@gmail.com`,
  `kiritokun8804@gmail.com`, `jeckagus0823@gmail.com`, `jeckvartigo0823@gmail.com`,
  `awir4806@gmail.com`.
- Bila email kosong/tidak valid → `sendForRevisi` mengembalikan tanpa mengirim
  apa pun; alur revisi manual tetap berjalan.

## 3. Email yang Dikirim

- Kelas: `App\Mail\RevisionNotification` (konten berisi kode tiket, tahap asal,
  isi revisi, dan status `revisi_ke` terbaru).
- Lampiran: `Form_Perbaikan_<kode_tiket>.pdf` via **barryvdh/laravel-dompdf**
  (bila tersedia), fallback **HTML printable** (`partials.print_perbaikan`).

## 4. Pengirim Dinamis = Profil Admin

Konfigurasi pengirim diset **pada runtime** oleh `RevisionEmailService::applyAdminMailConfig()`
sebelum setiap pengiriman:

1. Ambil akun admin pertama (`User::where('role','admin')->orderBy('id')->first()`).
2. Bila email admin valid:
   - `mail.from.address` ← email admin
   - `mail.from.name` ← nama admin
   - `Mail::alwaysFrom(...)` agar paksa `from` pada semua mailer.
3. Bila `sandi_aplikasi` admin terisi:
   - `mail.mailers.smtp.username` ← email admin
   - `mail.mailers.smtp.password` ← sandi_aplikasi
4. Bila profil admin belum terisi → tetap memakai `.env`
   (`MAIL_FROM_ADDRESS`, `MAIL_USERNAME`, `MAIL_PASSWORD`).

### Cara mengatur (di aplikasi)

1. Login sebagai **admin**.
2. Buka menu **Settings** (dropdown profil kanan atas) yang mengarah ke **Manajemen Akun**.
3. Pada kartu **"Pengaturan Email Pengirim (Profil Admin)"** isi:
   - **No. HP Admin** (opsional, disimpan ke `users.no_hp`),
   - **Email Pengirim** (wajib, disimpan ke `users.email`),
   - **Sandi Aplikasi (SMTP)** (opsional; kosongkan = tetap memakai `.env`),
4. Simpan → POST ke `POST /admin/settings/email`
   (`AdminController@settingsEmailUpdate`).

### Keamanan `sandi_aplikasi`

- Migrasi `2026_09_24_000001_add_sandi_aplikasi_to_users_table`.
- Kolom masuk `$fillable` **dan** `$hidden` pada `User` → **tidak pernah
  dikirim ke frontend/JSON** (mirip `password_text`).
- Form hanya **menulis**; aplikasi tidak pernah menampilkan kembali nilai sandi
  yang tersimpan (input kosong akan mempertahankan nilai lama).

## 5. Pengujian Manual (tanpa SMTP produksi)

Gunakan **Mailtrap** / log sebagai mailer pengembangan di `.env`:

```ini
MAIL_MAILER=log        # tulis ke storage/logs/laravel.log
MAIL_FROM_ADDRESS=no-reply@smartloket.test
```

Lalu:

1. Login `warkah1` → Add tiket → simpan hasil → **Revisi Berkas**.
2. Cek `storage/logs/laravel.log`: muncul baris
   `SmartLoket: email revisi ke-N terkirim ke ... untuk K/...`.
3. Ganti email/sandi di **Settings (Admin)** lalu ulangi revisi — baris log
   harus menampilkan `from` alamat email profil admin yang baru.