import { KopSurat } from '@/components/smartloket/kop-surat';
import { type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';

export default function PrintReceipt({ tiket }: { tiket: SmartTiket }) {
    const fmtDate = (v?: string | null) => {
        if (!v) return '-';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const tbodyBorder = '[&>tbody>tr>td]:border [&>tbody>tr>td]:border-neutral-900 [&>tbody>tr>td]:px-1.5 [&>tbody>tr>td]:py-1 [&>tbody>tr>td]:text-left';

    return (
        <div className="min-h-screen bg-white p-7 font-sans text-[12px] text-neutral-900">
            <Head title={`Tanda Terima — ${tiket.kode_tiket}`} />
            <div className="print-btn mb-4">
                <button onClick={() => window.print()} className="cursor-pointer rounded bg-neutral-900 px-4 py-2 text-white">
                    Cetak
                </button>
            </div>

            <KopSurat />

            <div className="my-4 text-center text-[13px] font-bold">
                <span className="inline-block border-2 border-neutral-900 bg-neutral-50 px-4 py-1.5">KODE TIKET: {tiket.kode_tiket}</span>
            </div>

            <p className="mb-1 text-center text-[13px] font-bold">TANDA TERIMA BERKAS PERMOHONAN PERTANAHAN</p>

            <table className="mb-2 w-full border-collapse text-[12px]">
                <tbody>
                    <tr>
                        <td className="w-[15%] py-0.5 align-top text-neutral-500">Tanggal Masuk</td>
                        <td className="py-0.5 align-top">: {fmtDate(tiket.tanggal_masuk)}</td>
                        <td className="w-[15%] py-0.5 align-top text-neutral-500">Jenis Permohonan</td>
                        <td className="py-0.5 align-top">: {tiket.jenis_permohonan?.nama ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-0.5 align-top text-neutral-500">Jumlah Bidang</td>
                        <td className="py-0.5 align-top">: {tiket.jumlah_bidang}</td>
                        <td className="py-0.5 align-top text-neutral-500">Nomor Antrian</td>
                        <td className="py-0.5 align-top">: {tiket.nomor_antrian ?? '-'}</td>
                    </tr>
                </tbody>
            </table>

            <p className="mt-3 font-bold">Data Pemohon</p>
            <table className="mb-2 w-full border-collapse text-[12px]">
                <tbody>
                    <tr>
                        <td className="w-[15%] py-0.5 align-top text-neutral-500">Nama Pemohon</td>
                        <td className="w-[35%] py-0.5 align-top">: {tiket.nama_pemohon}</td>
                        <td className="w-[15%] py-0.5 align-top text-neutral-500">NIK</td>
                        <td className="py-0.5 align-top">: {tiket.nik_pemohon ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-0.5 align-top text-neutral-500">No. HP</td>
                        <td className="py-0.5 align-top">: {tiket.no_hp_pemohon}</td>
                        <td className="py-0.5 align-top text-neutral-500">No. Hak Sekarang</td>
                        <td className="py-0.5 align-top">: {tiket.no_hak_sekarang ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-0.5 align-top text-neutral-500">Kelurahan / Kecamatan</td>
                        <td className="py-0.5 align-top" colSpan={3}>
                            : {tiket.kelurahan_desa ?? '-'}, {tiket.kecamatan ?? '-'}
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="mt-3 font-bold">Data Bidang Tanah</p>
            <table className={`mb-3 w-full border-collapse text-[11px] [&>thead>tr>th]:border [&>thead>tr>th]:border-neutral-900 [&>thead>tr>th]:bg-neutral-100 [&>thead>tr>th]:px-1.5 [&>thead>tr>th]:py-1 ${tbodyBorder}`}>
                <thead>
                    <tr>
                        {['#', 'NIB', 'No. Sertifikat Lama', 'Jenis Hak', 'Pemegang Hak', 'Kelurahan / Kecamatan'].map((h) => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
{(tiket.bidang_tanahs ?? []).length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                Tidak ada data bidang tanah.
                            </td>
                        </tr>
                    ) : (
                        tiket.bidang_tanahs!.map((b) => (
                            <tr key={b.id}>
                                <td>{b.urutan}</td>
                                <td>{b.nib ?? '-'}</td>
                                <td>{b.no_sertifikat_lama ?? '-'}</td>
                                <td>{b.jenis_hak ?? '-'}</td>
                                <td>{b.nama_pemegang_hak ?? '-'}</td>
                                <td>
                                    {b.desa_kelurahan ?? '-'}, {b.kecamatan ?? '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <p className="text-[11px]">
                Daftar persyaratan permohonan terlampir pada <strong>Checklist Berkas</strong>.
            </p>

            <div className="float-right mt-[60px] w-[280px] text-center text-[12px]">
                <div>Bandar Lampung, {fmtDate(new Date().toISOString())}</div>
                <div className="mt-[80px] border-t border-neutral-900 pt-1 font-bold">{tiket.petugas_loket?.name ?? '-'}</div>
                <div>Petugas Loket</div>
            </div>
            <div className="clear-both" />

            <style>{`
                @media print { body { margin: 10mm; } .print-btn { display: none; } }
            `}</style>
        </div>
    );
}