import { KopSurat } from '@/components/smartloket/kop-surat';
import { type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';

interface LastRevisi {
    id?: number;
    dari_stage: string | null;
    ke_stage: string | null;
    isi_revisi: string;
    pengirim?: { id: number; name: string } | null;
}

export default function PrintPerbaikan({ tiket, lastRevisi }: { tiket: SmartTiket; lastRevisi: LastRevisi | null }) {
    const fmtDate = (v?: string | null) => {
        if (!v) return '-';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const stage = lastRevisi?.dari_stage ?? '';
    const stageTxt = stage ? stage.replaceAll('_', ' ') : '-';
    const stageTxtUc = stage
        ? stage
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
        : '';

    return (
        <div className="min-h-screen bg-white p-6 font-sans text-[13px] text-neutral-900">
            <Head title={`Form Permohonan Perbaikan — ${tiket.kode_tiket}`} />
            <div className="no-print mb-2.5 text-right">
                <button
                    onClick={() => window.print()}
                    className="cursor-pointer rounded-md bg-[#0b2239] px-4 py-2 text-white"
                >
                    🖨 Cetak / Simpan PDF
                </button>
                <a href="javascript:history.back()" className="ml-2">
                    Kembali
                </a>
            </div>

            <KopSurat subtitle="FORM PERMINTAAN PERBAIKAN / KELENGKAPAN BERKAS" />

            <p className="mt-0">
                Dengan hormat, bersama ini kami sampaikan bahwa berkas permohonan di bawah ini masih memerlukan{' '}
                <strong>perbaikan / kelengkapan</strong> sebelum dapat diproses ke tahap berikutnya:
            </p>

            <table className="mb-3.5 w-full border-collapse">
                <tbody>
                    {[
                        ['Kode Tiket', tiket.kode_tiket],
                        ['Nama Pemohon', tiket.nama_pemohon],
                        ['NIK Pemohon', tiket.nik_pemohon ?? '-'],
                        ['Jenis Permohonan', tiket.jenis_permohonan?.nama ?? '-'],
                        ['Nomor Hak (Sekarang)', tiket.no_hak_sekarang ?? '-'],
                        ['Letak Tanah', `Kel. ${tiket.kelurahan_desa ?? '-'}, Kec. ${tiket.kecamatan ?? '-'}`],
                        ['Jumlah Bidang', String(tiket.jumlah_bidang)],
                        ['Tanggal Masuk', fmtDate(tiket.tanggal_masuk)],
                        ['Tahap Pengirim', stageTxtUc],
                    ].map(([label, value]) => (
                        <tr key={label} className="[&>th]:border [&>th]:border-[#9aa4b0] [&>td]:border [&>td]:border-[#9aa4b0]">
                            <th className="w-[30%] bg-[#eef2f7] px-2 py-1.5 text-left">{label}</th>
                            <td className="px-2 py-1.5">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mb-3.5 border border-[#9aa4b0] p-2.5">
                <strong>Uraian Perbaikan / Kelengkapan yang Diminta:</strong>
                <p className="mt-2 whitespace-pre-wrap">{lastRevisi?.isi_revisi ?? '—'}</p>
            </div>

            <p>
                <strong>Catatan:</strong> Perbaikan dapat dikirim kembali melalui Loket (atau tahap lanjutan) setelah pemohon
                melengkapinya. Revisi dinyatakan selesai setelah umumnya diverifikasi ulang pada tahap yang bersangkutan (P1, P2, P3, …).
            </p>

            <div className="mt-8 flex justify-between">
                <div className="w-[30%] text-center">
                    <div>Pemohon / Kuasa</div>
                    <div className="mt-16 border-t border-neutral-900 pt-1.5">(......................)</div>
                </div>
                <div />
                <div className="w-[30%] text-center">
                    <div>Petugas {stageTxtUc}</div>
                    <div className="mt-16 border-t border-neutral-900 pt-1.5">{lastRevisi?.pengirim?.name ?? ''}</div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none; }
                    body { padding: 0; }
                }
            `}</style>
        </div>
    );
}