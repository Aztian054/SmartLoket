import { KopSurat } from '@/components/smartloket/kop-surat';
import { type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';

export default function PrintReport({ tikets, startDate, endDate }: { tikets: SmartTiket[]; startDate: string; endDate: string }) {
    const cell = 'border border-neutral-900 px-1.5 py-1 text-[10px] text-left';

    return (
        <div className="min-h-screen bg-white p-6 font-sans text-[12px] text-neutral-900">
            <Head title="Laporan Rekap" />
            <div className="print-btn mb-3">
                <button onClick={() => window.print()} className="cursor-pointer rounded bg-neutral-900 px-4 py-2 text-white">
                    Cetak
                </button>
            </div>

            <KopSurat subtitle="LAPORAN REKAP BERKAS PERMOHONAN PERTANAHAN" />

            <p className="mb-3 text-center text-[11px]">
                Periode: {startDate} s/d {endDate} — Jumlah berkas: {tikets.length}
            </p>

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {['No', 'Kode Tiket', 'Pemohon', 'Jenis', 'Bidang', 'Masuk', 'Status'].map((h) => (
                            <th key={h} className={`${cell} bg-neutral-100 font-bold`}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tikets.map((t, i) => (
                        <tr key={t.id}>
                            <td className={cell}>{i + 1}</td>
                            <td className={cell}>{t.kode_tiket}</td>
                            <td className={cell}>{t.nama_pemohon}</td>
                            <td className={cell}>{t.jenis_permohonan?.nama ?? '-'}</td>
                            <td className={`${cell} text-center`}>{t.jumlah_bidang}</td>
                            <td className={cell}>{t.tanggal_masuk ?? '-'}</td>
                            <td className={cell}>{t.status_label}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="mt-6 border-t border-neutral-300 pt-1.5 text-center text-[10px] text-neutral-500">
                Dokumen dicetak otomatis dari Sistem SmartLoket — Kantor Pertanahan Kota Bandar Lampung
            </p>

            <style>{`
                @media print { body { margin: 8mm; } .print-btn { display: none; } }
            `}</style>
        </div>
    );
}