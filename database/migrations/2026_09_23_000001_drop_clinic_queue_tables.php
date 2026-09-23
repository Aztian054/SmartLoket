<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * Hapus tabel modul antrian klinik (legacy) yang telah dibuang dari aplikasi:
 *   - services
 *   - counters
 *   - tickets
 *   - calls
 *
 * Aman dijalankan berulang (dropIfExists). Tabel SmartLoket (tikets, dst.)
 * TIDAK tersentuh.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('calls');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('counters');
        Schema::dropIfExists('services');
    }

    public function down(): void
    {
        // Tidak ada rollback — modul klinik memang telah dihapus permanen.
    }
};