export interface TrackingTiket {
    id: number;
    kode_tiket: string;
    status: string;
    status_pembetulan: string;
    status_label: string;
    status_badge: string;
    nama_pemohon: string;
    nik_pemohon: string | null;
    no_hp_pemohon: string;
    jumlah_bidang: number;
    kelurahan_desa: string | null;
    kecamatan: string | null;
    no_hak_sekarang: string | null;
    tanggal_masuk: string | null;
    jenis_permohonan?: { id: number; kode: string; nama: string; kategori: string } | null;
    riwayat_statuses?: Array<{ id: number; stage_dari: string; stage_ke: string; keterangan: string; created_at: string }>;
}

const STATUS_ORDER = ['diterima', 'verifikasi', 'warkah', 'validasi_btel', 'validasi_suel', 'alih_media_btel', 'alih_media_suel', 'selesai'];
const STATUS_NAMES: Record<string, string> = {
    diterima: 'Loket',
    verifikasi: 'Verifikasi',
    warkah: 'Warkah',
    validasi_btel: 'Validasi BT',
    validasi_suel: 'Validasi SU',
    alih_media_btel: 'Alih Media BT',
    alih_media_suel: 'Alih Media SU',
    selesai: 'Selesai',
};

export function dateTxt(v?: string | null): string {
    if (!v) return '-';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function dateTimeTxt(v?: string | null): string {
    if (!v) return '-';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return (
        d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' +
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );
}
export function TrackingResult({ tiket }: { tiket: TrackingTiket }) {
    const currentIdx = STATUS_ORDER.indexOf(tiket.status);

    return (
        <div className="mt-6">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div>
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-xs">Kode Tiket Resmi</span>
                        <h3 className="text-xl font-bold" style={{ color: '#0b2239' }}>
                            {tiket.kode_tiket}
                        </h3>
                    </div>
                    {tiket.status === 'selesai' && (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                            <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <path d="M22 4 12 14.01l-3-3" />
                            </svg>
                            <div>
                                <h6 className="font-bold">Sertifikat Elektronik Telah Terbit!</h6>
                                <p className="mb-0 text-xs">Permohonan Anda telah selesai diproses dan Sertifikat Elektronik telah ditandatangani.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4 flex gap-1">
                    {STATUS_ORDER.map((s, i) => {
                        const done = currentIdx >= i;
                        return (
                            <div key={s} className="flex-1 text-center">
                                <div
                                    className={`mx-auto flex size-11 items-center justify-center rounded-full font-bold ${
                                        done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                                    }`}
                                >
                                    {i + 1}
                                </div>
                                <div className={`mt-1 text-[10px] ${done ? 'font-semibold text-emerald-600' : 'text-slate-400'}`}>
                                    {STATUS_NAMES[s]}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        <h6 className="mb-1 font-bold">Data Pemohon</h6>
                        <p className="mb-0"><span className="text-slate-400">Nama</span><br /><strong>{tiket.nama_pemohon}</strong></p>
                        <p className="mb-0"><span className="text-slate-400">Tgl. Masuk</span><br /><strong>{dateTxt(tiket.tanggal_masuk)}</strong></p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        <h6 className="mb-1 font-bold">Layanan Pertanahan</h6>
                        <p className="mb-0"><span className="text-slate-400">Jenis Layanan</span><br /><strong>{tiket.jenis_permohonan?.nama ?? '-'}</strong></p>
                        <p className="mb-0"><span className="text-slate-400">Jumlah Bidang</span><br /><strong>{tiket.jumlah_bidang}</strong></p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <a href="/tracking" className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100">
                        ← Cari Berkas Lain
                    </a>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                        Status: {tiket.status_label} {tiket.status_pembetulan !== 'P0' ? `(${tiket.status_pembetulan})` : ''}
                    </span>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
                <h6 className="mb-3 font-bold">Riwayat Perjalanan Berkas</h6>
                {!tiket.riwayat_statuses?.length ? (
                    <p className="text-sm text-slate-400">Belum ada riwayat perpindahan untuk berkas ini.</p>
                ) : (
                    <div className="divide-y text-sm">
                        {tiket.riwayat_statuses.map((r) => (
                            <div key={r.id} className="py-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-primary">{r.stage_ke}</span>
                                    <small className="text-slate-400">{dateTimeTxt(r.created_at)} WIB</small>
                                </div>
                                <div className="text-slate-500">{r.keterangan}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}