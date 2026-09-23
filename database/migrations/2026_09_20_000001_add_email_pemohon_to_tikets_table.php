<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom email pemohon untuk pengiriman notifikasi revisi
     * (PRD v2.3 — Lampiran: email revisi dikirim dari tahap mana pun).
     */
    public function up(): void
    {
        Schema::table('tikets', function (Blueprint $table) {
            $table->string('email_pemohon', 150)->nullable()->after('no_hp_pemohon');
        });
    }

    public function down(): void
    {
        Schema::table('tikets', function (Blueprint $table) {
            $table->dropColumn('email_pemohon');
        });
    }
};