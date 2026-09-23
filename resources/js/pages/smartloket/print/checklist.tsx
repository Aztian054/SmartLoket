import { KopSurat } from '@/components/smartloket/kop-surat';
import { type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';

export default function PrintChecklist({ tiket }: { tiket: SmartTiket }) {
    const fmtDate = (v?: string | null) => {
        if (!v) return '-';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    const cellCls = 'border border-neutral-900 px-1.5 py-1 text-left text-[11px]';
    const persyaratans = tiket.jenis_permohonan?.persyaratan_dokumens ?? [];

    return (
        <div className="min-h-screen bg-white p-7 font-sans text-[12px] text-neutral-900">
            <Head title={`Checklist Berkas — ${tiket.kode_tiket}`} />
            <div className="print-btn mb-4">
                <button onClick={() => window.print()} className="cursor-pointer rounded bg-neutral-900 px-4 py-2 text-white">
                    Cetak
                </button>
            </div>

            <KopSurat />

            <div className="my-4 text-center text-[13px] font-bold">
                <span className="inline-block border-2 border-neutral-900 bg-neutral-50 px-4 py-1.5">KODE TIKET: {tiket.kode_tiket}</span>
            </div>

            <p className="mb-1 text-center text-[13px] font-bold">CHECKLIST KELENGKAPAN BERKAS PERMOHONAN PERTANAHAN</p>

            <table className="mb-2 w-full border-collapse text-[12px]">
                <tbody>
                    <tr>
                        <td className="w-[25%] py-0.5 align-top text-neutral-500">Nama Pemohon</td>
                        <td className="w-[25%] py-0.5 align-top">: {tiket.nama_pemohon}</td>
                        <td className="w-[25%] py-0.5 align-top text-neutral-500">NIK</td>
                        <td className="py-0.5 align-top">: {tiket.nik_pemohon ?? '-'}</td>
                    </tr>
                    <tr>
                        <td className="py-0.5 align-top text-neutral-500">Jenis Permohonan</td>
                        <td className="py-0.5 align-top">: {tiket.jenis_permohonan?.nama ?? '-'}</td>
                        <td className="py-0.5 align-top text-neutral-500">Jumlah Bidang</td>
                        <td className="py-0.5 align-top">: {tiket.jumlah_bidang}</td>
                    </tr>
                    <tr>
                        <td className="py-0.5 align-top text-neutral-500">Tanggal Masuk</td>
                        <td className="py-0.5 align-top">: {fmtDate(tiket.tanggal_masuk)}</td>
                        <td className="py-0.5 align-top text-neutral-500">Status</td>
                        <td className="py-0.5 align-top">: {tiket.status_label}</td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {['No', 'Persyaratan Dokumen', 'Sifat', 'Keterangan', 'Lengkap'].map((h, i) => (
                            <th key={h} className={`${cellCls} ${i === 0 ? 'w-[28px]' : ''} ${i === 2 ? 'w-[90px]' : ''} ${i === 3 ? 'w-[120px]' : ''} ${i === 4 ? 'w-[40px] text-center' : ''} bg-neutral-100`}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {persyaratans.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={`${cellCls} text-center`}>
                                Belum ada daftar persyaratan untuk jenis permohonan ini.
                            </td>
                        </tr>
                    ) : (
                        persyaratans.map((d, i) => (
                            <tr key={d.id}>
                                <td className={cellCls}>{i + 1}</td>
                                <td className={cellCls}>{d.nama_dokumen}</td>
                                <td className={`${cellCls} font-bold`}>{d.wajib ? 'WAJIB' : 'Opsional'}</td>
                                <td className={cellCls}>{d.keterangan ?? '-'}</td>
                                <td className={`${cellCls} text-center align-middle`}>
                                    <span className="inline-block size-3 border border-neutral-900">&nbsp;</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <table className="mt-[60px] w-full border-collapse text-[12px] [&>tbody>tr>td]:w-[33%]">
                <tbody>
                    <tr>
                        {[
                            ['Pemohon,', tiket.nama_pemohon],
                            ['Petugas Loket,', tiket.petugas_loket?.name ?? '-'],
                            ['Verifikator,', ''],
                        ].map(([label, name]) => (
                            <td key={label as string} className="text-center align-bottom">
                                <div>{label}</div>
                                <div className="mt-[80px] border-t border-neutral-900 pt-1 font-bold">{name}</div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            <p className="mt-6 border-t border-neutral-200 pt-1.5 text-center text-[10px] text-neutral-500">
                Dokumen ini dicetak otomatis oleh Sistem Loket Pelayanan Pertanahan Elektronik • Kantor Pertanahan Kota Bandar Lampung
            </p>

            <style>{`
                @media print { body { margin: 10mm; } .print-btn { display: none; } }
            `}</style>
        </div>
    );
}