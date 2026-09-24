# Alur Warkah & Milestone "Berkas Telah Lengkap"

> Dokumen pendamping SmartLoket — alur layanan tahap **Warkah** sesuai
> *"ALUR DIAGRAM VERSI RIZKI - REVISI (FINAL)"* dan pengujian `BerkasLengkapMilestoneTest`.

## 1. Peta Alur Keseluruhan

```txt
Loket Penerimaan (tiket dibuat)
   → Verifikasi Berkas
   → Warkah (cari & data warkah, serah terima berkas ke validator)
   → Validasi Pra-BTel ──┬── paralel
   → Validasi Pra-SuEl ──┘
   → Alih Media Pra-BTel ──┬── paralel
   → Alih Media Pra-SuEl ──┘
   → Sertifikat Elektronik terbit
```

Setiap tahap memakai pola **pull-based**: Smart Search → Add → Proses → Selesai → kembali ke Database Admin.

## 2. Siklus Milestone Warkah

`LembarKerjaWarkah::STATUS_SERTIPIKAT` merupakan single source of truth milestone Warkah:

| Status | Arti |
| -------- | ------ |
| `belum` | Data/dokumen BT & SU belum lengkap (default). |
| **`berkas_lengkap`** | **Milestone eksplisit "Berkas Telah Lengkap (Warkah)"** — petugas Warkah menyatakan keseluruhan data sertipikat (BT & SU) dan dokumen fisik lengkap. |
| `diserahkan` | Berkas diserahkan ke Validator BT/SU (dipinjam). |
| `dikembalikan` | Berkas dikembalikan ke Warkah setelah Alih Media selesai. |

Detail serah terima & pengembalian berkas disimpan pada kolom:

- **Serah terima** (`WarkahController::kirim`): `penerima_validator_id`, `nama_penerima_validator`, `waktu_serah`, `status_berkas_bt`, `status_berkas_su`, `catatan_kondisi_berkas`.
- **Pengembalian**: `petugas_pengembali`, `waktu_kembali`, `kondisi_berkas_kembali`, `catatan_pengembalian`.

Kondisi fisik berkas disepakati lewat `KONDISI_BERKAS = lengkap | rusak | kurang`.

## 3. Sinyal "Terkunci" pada Pencarian Alih Media

Begitu milestone **Berkas Telah Lengkap** tercapai (`status_sertipikat = berkas_lengkap`),
berkas menjadi **terkunci** terhadap perubahan yang akan membatalkan milestone tersebut.
Gate claim diekspos ke UI pencarian Alih Media dengan **alasan keterkuncian** yang jelas
(daripada disembunyikan), sehingga petugas Alih Media memahami mengapa berkas belum bisa
di-Add / diubah statusnya.

## 4. Pengujian — `BerkasLengkapMilestoneTest`

File: `tests/Feature/BerkasLengkapMilestoneTest.php` (menggunakan `RefreshDatabase`).

Skenario yang diuji:

1. **Tiket & milestone normal** — tiket 'diterima' di-Add oleh Warkah, kemudian
   `kirimBerkas` ke validator dengan payload lengkap
   (`status_data_sertipikat_bt/su = selesai`, `status_dokumen_bt/su = ada`, …).
2. **Payload lengkap tidak boleh ditolak** — seluruh token pelengkap milestone
   dianggap sah.
3. **Right-to-edit dikunci** — perubahan yang bertentangan dengan milestone yang
   sudah tercapai menghasilkan respons/kondisi "terkunci" dengan alasan.

Menjalankan seluruh suite:

```bash
php artisan test
```

## 5. Rute & Controller Terkait

| Metode | URI | Controller |
| -------- | ----- | ------------ |
| GET | `/warkah` | `WarkahController@index` |
| POST | `/warkah/add/{id}` | `WarkahController@add` |
| POST | `/warkah/{id}/kirim` | `WarkahController@kirim` (serah terima ke validator) |
| POST | `/warkah/{id}/selesai` | `WarkahController@selesai` |
| POST | `/warkah/{id}/revisi` | `WarkahController@revisi` (memicu email pemohon) |

> Semua rute di atas dilindungi middleware `role:warkah`.
