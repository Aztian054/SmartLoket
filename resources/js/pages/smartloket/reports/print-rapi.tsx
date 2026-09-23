import { KopSurat } from '@/components/smartloket/kop-surat';
import { type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';

const HEADERS = ['No', 'Kode Tiket', 'Pemohon', 'NIK', 'Jenis', 'Masuk', 'Selesai', 'Status', 'Bidang', 'Kelurahan', 'Kecamatan', 'Loket', 'Verif', 'Warkah', 'Val BT', 'Val SU', 'AM BT', 'AM SU', 'Tanggal Beres', 'Ket Sertipikat'];

export default function PrintRapi({ tikets, startDate, endDate, status }: { tikets: SmartTiket[]; startDate: string; endDate: string; status: string }) {
    const cell = 'border border-neutral-900 px-1 py-1 text-[9px] text-left';

    return (
        <div className="min-h-screen bg-white p-5 font-sans text-[11px] text-neutral-900">
            <Head title="Cetak Rapi — Rekap Monitoring" />
            <div className="print-btn mb-3">
                <button onClick={() => window.print()} className="cursor-pointer rounded bg-neutral-900 px-4 py-2 text-white">
                    🖨 Cetak
                </button>
            </div>

            <KopSurat subtitle="REKAP MONITORING BERKAS PERMOHONAN PERTANAHAN" />

            <p className="mb-3 text-center text-[10px]">
                Periode: {startDate} s/d {endDate} {status ? `— Status: ${status}` : ''} — Jumlah: {tikets.length}
            </p>

            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {HEADERS.map((h) => (
                                <th key={h} className={`${cell} bg-neutral-100 font-bold whitespace-nowrap`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tikets.map((t, i) => (
                            <tr key={t.id}>
                                <td className={cell}>{i + 1}</td>
                                <td className={`${cell} whitespace-nowrap`}>{t.kode_tiket}</td>
                                <td className={cell}>{t.nama_pemohon}</td>
                                <td className={cell}>{t.nik_pemohon ?? '-'}</td>
                                <td className={cell}>{t.jenis_permohonan?.nama ?? '-'}</td>
                                <td className={cell}>{t.tanggal_masuk ?? '-'}</td>
                                <td className={cell}>{t.tanggal_selesai ?? '-'}</td>
                                <td className={cell}>{t.status_label}</td>
                                <td className={`${cell} text-center`}>{t.jumlah_bidang}</td>
                                <td className={cell}>{t.kelurahan_desa ?? '-'}</td>
                                <td className={cell}>{t.kecamatan ?? '-'}</td>
                                <td className={cell}>{t.nama_petugas_loket ?? '-'}</td>
                                {[0, 1, 2, 3, 4, 5].map((s) => (
                                    <td key={s} className={cell}>
                                        {(t.penugasans ?? []).find((p) => p.stage === secStage(s))?.user?.name ?? '-'}
                                    </td>
                                ))}
                                <td className={cell}>-</td>
                                <td className={cell}>-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @media print { body { margin: 6mm; } .print-btn { display: none; } }
            `}</style>
        </div>
    );
}

function secStage(i: number): string {
    return ['verifikasi', 'warkah', 'validasi_btel', 'validasi_suel', 'alih_media_btel', 'alih_media_suel'][i];
}