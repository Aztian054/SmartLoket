<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use App\Models\TiketPenugasan;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Dashboard per-peran (SmartLoket). Data dihitung server-side dan
     * dirender sebagai halaman React/Inertia — tanpa polling klinik.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $role = $user->role;

        $total = Tiket::count();

        // Statistik 6 bulan terakhir (grafik).
        $chart = collect(range(5, 0))->map(function ($m) {
            $month = Carbon::today()->copy()->subMonths($m);

            return [
                'bulan' => $month->format('M'),
                'tahun' => $month->format('Y'),
                'masuk' => Tiket::whereYear('tanggal_masuk', $month->year)
                    ->whereMonth('tanggal_masuk', $month->month)
                    ->count(),
                'selesai' => Tiket::where('status', 'selesai')
                    ->whereYear('tanggal_selesai', $month->year)
                    ->whereMonth('tanggal_selesai', $month->month)
                    ->count(),
            ];
        })->values();

        // Berkas terlambat (> 30 hari non-selesai).
        $overdueDays = 30;
        $overdue = Tiket::whereNotIn('status', ['selesai', 'batal'])
            ->whereDate('tanggal_masuk', '<', Carbon::today()->subDays($overdueDays))
            ->with('jenisPermohonan')
            ->orderByDesc('tanggal_masuk')
            ->limit(10)
            ->get()
            ->map(fn (Tiket $t) => $this->tiketRingkas($t));

        // Card statistik umum.
        $statUmum = [
            ['label' => 'Total Tiket', 'nilai' => $total, 'warna' => 'primary'],
            ['label' => 'Diterima di Loket', 'nilai' => Tiket::where('status', 'diterima')->count(), 'warna' => 'warning'],
            ['label' => 'Dalam Proses', 'nilai' => Tiket::whereIn('status', array_keys(Tiket::STAGES))->count(), 'warna' => 'info'],
            ['label' => 'Revisi', 'nilai' => Tiket::where('status', 'dikembalikan')->count() + Tiket::where('status', 'perbaikan')->count(), 'warna' => 'danger'],
            ['label' => 'Selesai', 'nilai' => Tiket::where('status', 'selesai')->count(), 'warna' => 'success'],
        ];

        $props = [
            'role' => $role,
            'nama' => $user->name,
            'stat' => $statUmum,
            'chart' => $chart,
            'overdue' => $overdue,
            'server_waktu' => Carbon::now()->format('d/m/Y H:i'),
        ];

        // Statistik khusus per peran.
        if ($role === 'loket') {
            $props['stat'] = array_merge($statUmum, [
                ['label' => 'Tiket Saya (Loket)', 'nilai' => Tiket::where(fn ($q) => $q->where('created_by', $user->id)->orWhere('petugas_loket_id', $user->id))->count(), 'warna' => 'indigo'],
                ['label' => 'Revisi Belum Diproses', 'nilai' => Tiket::where('status', 'dikembalikan')
                    ->whereHas('catatanRevisis', fn ($q) => $q->where('sudah_diproses', false))
                    ->count(), 'warna' => 'warning'],
            ]);
        } elseif (in_array($role, ['verifikator', 'warkah', 'validator_btel', 'validator_suel', 'alih_media_btel', 'alih_media_suel'], true)) {
            $stage = match ($role) {
                'verifikator' => 'verifikasi',
                default => $role,
            };

            $props['stat'] = array_merge($statUmum, [
                ['label' => 'Tersedia di DB Admin', 'nilai' => $this->tersediaDiDb($stage), 'warna' => 'primary'],
                ['label' => 'Antrian Aktif Saya', 'nilai' => $this->aktifSaya($stage, $user->id), 'warna' => 'success'],
                ['label' => 'Berkas Selesai Saya', 'nilai' => $this->selesaiSaya($stage, $user->id), 'warna' => 'success'],
            ]);
        }

        return Inertia::render('dashboard', $props);
    }

    private function tiketRingkas(Tiket $t): array
    {
        return [
            'id' => $t->id,
            'kode_tiket' => $t->kode_tiket,
            'nama_pemohon' => $t->nama_pemohon,
            'jenis_permohonan' => $t->jenisPermohonan?->nama,
            'status' => $t->status,
            'status_badge' => $t->status_badge,
            'status_label' => $t->status_label,
            'tanggal_masuk' => $t->tanggal_masuk?->format('d/m/Y'),
        ];
    }

    private function tersediaDiDb(string $stage): int
    {
        return TiketPenugasan::where('stage', $stage)->where('status', 'selesai')
            ->whereIn('tiket_id', function ($q) {
                $q->select('id')->from('tikets')->where('status', '!=', 'batal');
            })
            ->count();
    }

    private function aktifSaya(string $stage, int $userId): int
    {
        return TiketPenugasan::where('stage', $stage)->where('status', 'proses')
            ->where('user_id', $userId)->count();
    }

    private function selesaiSaya(string $stage, int $userId): int
    {
        return TiketPenugasan::where('stage', $stage)->where('status', 'selesai')
            ->where('user_id', $userId)->count();
    }
}