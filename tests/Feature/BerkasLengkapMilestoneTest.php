<?php

namespace Tests\Feature;

use App\Models\BidangTanah;
use App\Models\JenisPermohonan;
use App\Models\LembarKerjaWarkah;
use App\Models\RiwayatStatus;
use App\Models\Tiket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Milestone "Berkas Telah Lengkap (Warkah)" + sinyal TERKUNCI dengan alasan di
 * pencarian Alih Media (gate claim sesungguhnya diekspos ke UI, bukan disembunyikan).
 */
class BerkasLengkapMilestoneTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role): User
    {
        return User::factory()->create([
            'name' => $role,
            'username' => $role.'_'.str()->random(6),
            'role' => $role,
            'is_active' => true,
        ]);
    }

    private function tiket(): Tiket
    {
        $jenis = JenisPermohonan::create([
            'kode' => 'BL', 'nama' => 'Permohonan Uji Milestone', 'kategori' => 'umum', 'is_active' => true,
        ]);

        $tiket = Tiket::create([
            'kode_tiket' => 'BL/'.now()->timestamp,
            'nomor_antrian' => 'A-001',
            'status_pembetulan' => 'P0',
            'tanggal_masuk' => now()->toDateString(),
            'jenis_permohonan_id' => $jenis->id,
            'nama_pemohon' => 'Pemohon Milestone',
            'no_hp_pemohon' => '081200000000',
            'jumlah_bidang' => 1,
            'status' => 'diterima',
        ]);

        BidangTanah::create(['tiket_id' => $tiket->id, 'nib' => '001', 'urutan' => 1]);

        return $tiket;
    }

    private function addWarkahKeAntrian(User $warkah, Tiket $tiket): void
    {
        $this->actingAs($warkah);
        $this->post(route('warkah.add', $tiket->id))->assertSessionHasNoErrors();
    }

    private function kirimBerkas(User $warkah, User $validator, Tiket $tiket): void
    {
        $this->actingAs($warkah);
        $this->post(route('warkah.kirim', $tiket->id), [
            'penerima_validator_id' => $validator->id,
            'waktu_serah' => now()->format('Y-m-d\TH:i'),
            'status_berkas_bt' => 'lengkap',
            'status_berkas_su' => 'lengkap',
            'catatan_kondisi_berkas' => 'Berkas BT/SU diserahkan lengkap.',
        ])->assertSessionHasNoErrors();
        $tiket->refresh();
    }

    /** Token payload lengkap untuk milestone Berkas Telah Lengkap. */
    private function payloadLengkap(): array
    {
        return [
            'status_data_sertipikat_bt' => 'selesai',
            'status_data_sertipikat_su' => 'selesai',
            'status_dokumen_bt' => 'ada',
            'status_dokumen_su' => 'ada',
            'jumlah_berkas' => 2,
            'jumlah_halaman' => 40,
        ];
    }

    public function test_alih_media_lihat_tiket_terkunci_menunggu_validator_dengan_alasan(): void
    {
        $alih = $this->user('alih_media_btel');
        $tiket = $this->tiket();
        $tiket->update(['diserahkan_ke_validator' => true, 'status' => 'diterima']);
        // Verifikator sudah selesai, Validator BT/SU belum → gate Alih Media belum terbuka.
        $tiket->penugasans()->create([
            'user_id' => $this->user('verifikator')->id,
            'stage' => 'verifikasi', 'status' => 'selesai',
            'tanggal_add' => now(), 'tanggal_selesai' => now(),
        ]);

        $response = $this->actingAs($alih)
            ->getJson(route('alih_media_btel.search', ['q' => $tiket->kode_tiket]));

        $response->assertOk();
        $row = collect($response->json('tikets'))->firstWhere('id', $tiket->id);
        $this->assertNotNull($row, 'Tiket yang belum lolos gate harus tetap TAMPIL di pencarian Alih Media.');
        $this->assertTrue($row['locked']);
        $this->assertStringContainsString('Menunggu Validator BT', $row['lock_reason']);
        $this->assertStringContainsString('SU', $row['lock_reason']);
    }

    public function test_alih_media_lihat_tiket_terkunci_menunggu_warkah_serahkan_berkas(): void
    {
        $alih = $this->user('alih_media_btel');
        $tiket = $this->tiket();
        $tiket->penugasans()->create([
            'user_id' => $this->user('verifikator')->id,
            'stage' => 'verifikasi', 'status' => 'selesai',
            'tanggal_add' => now(), 'tanggal_selesai' => now(),
        ]);

        $response = $this->actingAs($alih)
            ->getJson(route('alih_media_btel.search', ['q' => $tiket->kode_tiket]));

        $response->assertOk();
        $row = collect($response->json('tikets'))->firstWhere('id', $tiket->id);
        $this->assertNotNull($row);
        $this->assertTrue($row['locked']);
        $this->assertStringContainsString('Menunggu Warkah menyerahkan berkas BT/SU', $row['lock_reason']);
    }

    public function test_tiket_lolos_gate_alih_media_tidak_terkunci(): void
    {
        $alih = $this->user('alih_media_btel');
        $tiket = $this->tiket();
        $tiket->update(['diserahkan_ke_validator' => true, 'status' => 'diterima']);

        foreach (['verifikasi', 'validasi_btel', 'validasi_suel'] as $stage) {
            $tiket->penugasans()->create([
                'user_id' => $this->user($stage === 'verifikasi' ? 'verifikator' : ($stage === 'validasi_btel' ? 'validator_btel' : 'validator_suel'))->id,
                'stage' => $stage, 'status' => 'selesai',
                'tanggal_add' => now(), 'tanggal_selesai' => now(),
            ]);
        }

        $response = $this->actingAs($alih)
            ->getJson(route('alih_media_btel.search', ['q' => $tiket->kode_tiket]));

        $response->assertOk();
        $row = collect($response->json('tikets'))->firstWhere('id', $tiket->id);
        $this->assertNotNull($row);
        $this->assertFalse($row['locked']);
        $this->assertNull($row['lock_reason']);
    }

    public function test_milestone_berkas_lengkap_ditandai_dan_direkam_ke_riwayat(): void
    {
        $warkah = $this->user('warkah');
        $tiket = $this->tiket();
        $this->addWarkahKeAntrian($warkah, $tiket);

        $this->actingAs($warkah);
        $this->post(route('warkah.berkas-lengkap', $tiket->id), $this->payloadLengkap())
            ->assertSessionHasNoErrors();

        $lembar = LembarKerjaWarkah::where('tiket_id', $tiket->id)->first();
        $this->assertSame('berkas_lengkap', $lembar->status_sertipikat);
        $this->assertSame('Berkas Telah Lengkap', $lembar->status_sertipikat_label);
        $this->assertSame('selesai', $lembar->status_data_sertipikat_bt);
        $this->assertSame('ada', $lembar->status_dokumen_su);

        $this->assertDatabaseHas('riwayat_statuses', [
            'tiket_id' => $tiket->id,
            'stage_ke' => 'Warkah (berkas_lengkap)',
        ]);
        $this->assertStringContainsString(
            'BERKAS TELAH LENGKAP',
            RiwayatStatus::where('tiket_id', $tiket->id)->where('stage_ke', 'Warkah (berkas_lengkap)')->first()->keterangan
        );
    }

    public function test_milestone_ditolak_saat_data_belum_lengkap(): void
    {
        $warkah = $this->user('warkah');
        $tiket = $this->tiket();
        $this->addWarkahKeAntrian($warkah, $tiket);

        // Dokumen SU masih belum ada / data BT masih proses → belum lengkap.
        $this->actingAs($warkah);
        $this->post(route('warkah.berkas-lengkap', $tiket->id), [
            'status_data_sertipikat_bt' => 'proses',
            'status_data_sertipikat_su' => 'selesai',
            'status_dokumen_bt' => 'ada',
            'status_dokumen_su' => 'tidak_ada',
        ])->assertSessionHas('error', 'Berkas belum lengkap: Data Sertipikat BT & SU harus berstatus Selesai, dan Dokumen BT & SU harus Ada.');

        $this->assertNull(LembarKerjaWarkah::where('tiket_id', $tiket->id)->first()->status_sertipikat);
        $this->assertDatabaseMissing('riwayat_statuses', ['tiket_id' => $tiket->id, 'stage_ke' => 'Warkah (berkas_lengkap)']);
    }

    public function test_siklus_milestone_berkas_lengkap_ke_diserahkan_ke_dikembalikan_ke_selesai(): void
    {
        $warkah = $this->user('warkah');
        $tiket = $this->tiket();
        $this->addWarkahKeAntrian($warkah, $tiket);

        // 1. Milestone Berkas Telah Lengkap.
        $this->actingAs($warkah);
        $this->post(route('warkah.berkas-lengkap', $tiket->id), $this->payloadLengkap())
            ->assertSessionHasNoErrors();
        $this->assertSame('berkas_lengkap', LembarKerjaWarkah::where('tiket_id', $tiket->id)->first()->status_sertipikat);

        // 2. Serahkan ke Validator → diserahkan (dipinjam).
        $this->kirimBerkas($warkah, $this->user('validator_btel'), $tiket);
        $lembar = LembarKerjaWarkah::where('tiket_id', $tiket->id)->first();
        $this->assertSame('diserahkan', $lembar->status_sertipikat);
        $this->assertTrue($tiket->isDiserahkanKeValidator());

        // Milestone tidak dapat ditandai ulang setelah diserahkan.
        $this->actingAs($warkah);
        $this->post(route('warkah.berkas-lengkap', $tiket->id), $this->payloadLengkap())
            ->assertSessionHas('error');

        // 3. Alih Media BT & SU selesai → pengembalian → dikembalikan.
        $tiket->penugasans()->create([
            'user_id' => $this->user('alih_media_btel')->id,
            'stage' => 'alih_media_btel', 'status' => 'selesai', 'tanggal_add' => now(), 'tanggal_selesai' => now(),
        ]);
        $tiket->penugasans()->create([
            'user_id' => $this->user('alih_media_suel')->id,
            'stage' => 'alih_media_suel', 'status' => 'selesai', 'tanggal_add' => now(), 'tanggal_selesai' => now(),
        ]);

        $this->actingAs($warkah);
        $this->post(route('warkah.pengembalian', $tiket->id), [
            'petugas_pengembali' => 'Petugas Warkah Test',
            'waktu_kembali' => now()->format('Y-m-d\TH:i'),
            'kondisi_berkas_kembali' => 'lengkap',
            'catatan_pengembalian' => 'Berkas BT/SU diterima kembali lengkap.',
            'jumlah_berkas_dikembalikan' => 2,
        ])->assertSessionHasNoErrors();

        $lembar->refresh();
        $this->assertSame('dikembalikan', $lembar->status_sertipikat);
        $this->assertSame('dikembalikan', $lembar->status_pengembalian);

        // 4. Warkah Proses Selesai → tiket SELESAI.
        $this->actingAs($warkah);
        $this->post(route('warkah.selesai', $tiket->id), ['catatan' => 'Berkas BT/SU sudah kembali ke Warkah.'])
            ->assertSessionHasNoErrors();
        $this->assertSame('selesai', $tiket->fresh()->status);
    }
}