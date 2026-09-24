<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom sandi aplikasi (SMTP) pada profil admin.
     *
     * SmartLoket: email pengirim otomatis (email revisi pemohon) memakai
     * email + sandi aplikasi dari akun admin, diatur lewat halaman
     * Settings (Manajemen Akun) → "Pengaturan Email Pengirim (Profil Admin)".
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('sandi_aplikasi', 255)->nullable()->after('password_text');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('sandi_aplikasi');
        });
    }
};