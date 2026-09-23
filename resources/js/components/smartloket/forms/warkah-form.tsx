import { SelectField, TextAreaField } from './fields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftRight, Save, Send } from 'lucide-react';
import { type SmartTiket } from '@/types';

export interface LembarWarkah {
    id?: number;
    status_pengembalian?: string | null;
    status_data_sertipikat_bt?: string | null;
    status_data_sertipikat_su?: string | null;
    status_sosialisasi?: string | null;
    status_dokumen_bt?: string | null;
    status_dokumen_su?: string | null;
    gabungan?: boolean;
    jumlah_berkas?: number | null;
    jumlah_halaman?: number | null;
    keterangan_status?: string | null;
    catatan?: string | null;
    nama_penerima_validator?: string | null;
    waktu_serah?: string | null;
    tanggal_diserahkan?: string | null;
    status_berkas_bt?: string | null;
    status_berkas_su?: string | null;
    catatan_kondisi_berkas?: string | null;
    petugas_pengembali?: string | null;
    waktu_kembali?: string | null;
    tanggal_kembali?: string | null;
    kondisi_berkas_kembali?: string | null;
    catatan_pengembalian?: string | null;
}

const STS = [
    { value: 'belum', label: 'Belum' },
    { value: 'proses', label: 'Proses' },
    { value: 'selesai', label: 'Selesai' },
];
const ADA = [
    { value: 'ada', label: 'Ada' },
    { value: 'tidak_ada', label: 'Tidak Ada' },
];
const KONDISI = [
    { value: 'lengkap', label: 'Lengkap' },
    { value: 'rusak', label: 'Rusak' },
    { value: 'kurang', label: 'Kurang' },
];

function fmtDateTime(v?: string | null): string {
    if (!v) return '-';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtDate(v?: string | null): string {
    if (!v) return '-';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface WarkahFormProps {
    tiket: SmartTiket;
    lembar: LembarWarkah;
    validatorUsers: Array<{ id: number; name: string; role: string }>;
    canKonfirmasiKembali: boolean;
    alihMediaSelesai?: { alih_media_btel: boolean; alih_media_suel: boolean };
}
export function WarkahForm({ tiket, lembar, validatorUsers, canKonfirmasiKembali, alihMediaSelesai }: WarkahFormProps) {
    const sp = lembar.status_pengembalian ?? 'belum';
    const [status_data_sertipikat_bt, setDataBt] = useState(lembar.status_data_sertipikat_bt ?? 'belum');
    const [status_data_sertipikat_su, setDataSu] = useState(lembar.status_data_sertipikat_su ?? 'belum');
    const [status_sosialisasi, setSos] = useState(lembar.status_sosialisasi ?? 'belum');
    const [status_dokumen_bt, setDokBt] = useState(lembar.status_dokumen_bt ?? '');
    const [status_dokumen_su, setDokSu] = useState(lembar.status_dokumen_su ?? '');
    const [gabungan, setGabungan] = useState(lembar.gabungan ? '1' : '0');
    const [jumlah_berkas, setJumBerkas] = useState(lembar.jumlah_berkas?.toString() ?? '');
    const [jumlah_halaman, setJumHal] = useState(lembar.jumlah_halaman?.toString() ?? '');
    const [keterangan_status, setKet] = useState(lembar.keterangan_status ?? '');
    const [catatan, setCatatan] = useState(lembar.catatan ?? '');

    // Modal serah
    const [penerima_validator_id, setPenerima] = useState('');
    const [waktu_serah, setWaktuSerah] = useState(new Date().toISOString().slice(0, 16));
    const [status_berkas_bt, setSerahBt] = useState('');
    const [status_berkas_su, setSerahSu] = useState('');
    const [catatan_kondisi_berkas, setCatKondisi] = useState('');

    // Modal kembali
    const [petugas_pengembali, setPengembali] = useState('');
    const [waktu_kembali, setWaktuKembali] = useState(new Date().toISOString().slice(0, 16));
    const [kondisi_berkas_kembali, setKondisi] = useState('');
    const [catatan_pengembalian, setCatKembali] = useState('');

    const [openSerah, setOpenSerah] = useState(false);
    const [openKembali, setOpenKembali] = useState(false);

    const changeLembar = (n: string, v: string) => {
        if (n === 'status_data_sertipikat_bt') setDataBt(v);
        else if (n === 'status_data_sertipikat_su') setDataSu(v);
        else if (n === 'status_sosialisasi') setSos(v);
        else if (n === 'status_dokumen_bt') setDokBt(v);
        else if (n === 'status_dokumen_su') setDokSu(v);
        else if (n === 'gabungan') setGabungan(v);
        else if (n === 'jumlah_berkas') setJumBerkas(v);
        else if (n === 'jumlah_halaman') setJumHal(v);
        else if (n === 'keterangan_status') setKet(v);
        else if (n === 'catatan') setCatatan(v);
    };

    const submitLembar = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/warkah/${tiket.id}/simpan`,
            {
                status_data_sertipikat_bt,
                status_data_sertipikat_su,
                status_sosialisasi,
                status_dokumen_bt,
                status_dokumen_su,
                gabungan,
                jumlah_berkas: jumlah_berkas || null,
                jumlah_halaman: jumlah_halaman || null,
                keterangan_status,
                catatan,
            },
            { preserveScroll: true },
        );
    };

    const submitSerah = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/warkah/${tiket.id}/kirim`,
            { penerima_validator_id, waktu_serah, status_berkas_bt, status_berkas_su, catatan_kondisi_berkas },
            { preserveScroll: true, onSuccess: () => setOpenSerah(false) },
        );
    };

    const submitKembali = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/warkah/${tiket.id}/pengembalian`,
            { petugas_pengembali, waktu_kembali, kondisi_berkas_kembali, catatan_pengembalian },
            { preserveScroll: true, onSuccess: () => setOpenKembali(false) },
        );
    };

return (
        <>
            {/* Serah Terima & Pengembalian */}
            <div className="mb-4 rounded-lg border border-l-4 border-l-zinc-400">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
                    <h6 className="flex items-center gap-2 font-bold">
                        <ArrowLeftRight className="size-4 text-primary" /> Serah Terima & Pengembalian Berkas BT/SU
                    </h6>
                    {sp === 'dipinjam' ? (
                        <Badge variant="secondary">DIPINJAM</Badge>
                    ) : sp === 'dikembalikan' ? (
                        <Badge className="bg-emerald-600">DIKEMBALIKAN</Badge>
                    ) : (
                        <Badge variant="outline">BELUM DISERAHKAN</Badge>
                    )}
                </div>
                <div className="grid gap-3 p-4 text-sm sm:grid-cols-2">
                    <div>
                        <small className="text-muted-foreground">Status Berkas BT/SU</small>
                        <p className="mb-1 font-semibold text-primary">
                            {tiket.diserahkan_ke_validator ? 'Telah Diserahkan ke Validator BT/SU' : 'Belum Diserahkan ke Validator BT/SU'}
                        </p>
                        {lembar.nama_penerima_validator && (
                            <p className="mb-0">
                                <small className="text-muted-foreground">Petugas Validator Penerima</small>
                                <br />
                                <strong>{lembar.nama_penerima_validator}</strong>
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="mb-1">
                            <small className="text-muted-foreground">Waktu Serah</small>
                            <br />
                            <strong>{fmtDateTime(lembar.waktu_serah)}</strong>
                        </p>
                        {(lembar.status_berkas_bt || lembar.status_berkas_su) && (
                            <p className="mb-0">
                                <small className="text-muted-foreground">Kondisi Berkas Saat Serah</small>
                                <br />
                                <strong className="uppercase">BT: {lembar.status_berkas_bt ?? '-'} â€¢ SU: {lembar.status_berkas_su ?? '-'}</strong>
                            </p>
                        )}
                        {lembar.catatan_kondisi_berkas && (
                            <p className="mb-0 rounded border bg-muted/40 px-2 py-1">
                                <small className="text-muted-foreground">Catatan Kondisi:</small> {lembar.catatan_kondisi_berkas}
                            </p>
                        )}
                        {lembar.petugas_pengembali && (
                            <p className="mb-0 mt-1">
                                <small className="text-muted-foreground">Petugas Pengembali</small>
                                <br />
                                <strong>{lembar.petugas_pengembali}</strong>
                            </p>
                        )}
                        {lembar.waktu_kembali && (
                            <p className="mb-0">
                                <small className="text-muted-foreground">Waktu Terima Kembali</small>
                                <br />
                                <strong>{fmtDateTime(lembar.waktu_kembali)}</strong>
                            </p>
                        )}
                        {lembar.kondisi_berkas_kembali && (
                            <p className="mb-0">
                                <small className="text-muted-foreground">Kondisi Saat Kembali</small>
                                <br />
                                <strong className="uppercase">{lembar.kondisi_berkas_kembali}</strong>
                            </p>
                        )}
                        {lembar.catatan_pengembalian && (
                            <p className="mb-0 mt-1 rounded border bg-muted/40 px-2 py-1">
                                <small className="text-muted-foreground">Catatan Pengembalian:</small> {lembar.catatan_pengembalian}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t bg-muted/30 px-4 py-3">
                    {!tiket.diserahkan_ke_validator ? (
                        <Button size="sm" onClick={() => setOpenSerah(true)}>
                            <Send className="mr-1 size-4" /> Serahkan Berkas Warkah
                        </Button>
                    ) : (
                        <span className="rounded bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                            âœ“ Diserahkan â€” {fmtDateTime(lembar.waktu_serah)}
                        </span>
                    )}
                    {sp === 'dipinjam' && canKonfirmasiKembali && (
                        <Button size="sm" variant="outline" className="text-amber-700" onClick={() => setOpenKembali(true)}>
                            <ArrowLeftRight className="mr-1 size-4" /> Konfirmasi Pengembalian Berkas
                        </Button>
                    )}
                    {sp === 'dipinjam' && !canKonfirmasiKembali && (
                        <span className="rounded bg-amber-100 px-3 py-1 text-xs text-amber-700">
                            Berkas sedang dipinjam â€” Alih Media BT {alihMediaSelesai?.alih_media_btel ? 'âœ“' : 'âœ•'} / SU {alihMediaSelesai?.alih_media_suel ? 'âœ“' : 'âœ•'}
                        </span>
                    )}
                </div>
            </div>
{/* Lembar Kerja Warkah */}
            <form onSubmit={submitLembar} className="mb-4 space-y-4 rounded-lg border p-4">
                <h6 className="font-bold">Lembar Kerja Warkah</h6>
                <div className="grid gap-4 md:grid-cols-3">
                    <SelectField name="status_data_sertipikat_bt" label="Data Sertipikat Buku Tanah (BT)" value={status_data_sertipikat_bt} onChange={changeLembar} options={STS} placeholder={null} />
                    <SelectField name="status_data_sertipikat_su" label="Data Sertipikat Surat Ukur (SU)" value={status_data_sertipikat_su} onChange={changeLembar} options={STS} placeholder={null} />
                    <SelectField name="status_sosialisasi" label="Warkah (Sosialisasi)" value={status_sosialisasi} onChange={changeLembar} options={STS} placeholder={null} />
                    <SelectField name="status_dokumen_bt" label="Status Dokumen BT" value={status_dokumen_bt} onChange={changeLembar} options={ADA} />
                    <SelectField name="status_dokumen_su" label="Status Dokumen SU" value={status_dokumen_su} onChange={changeLembar} options={ADA} />
                    <SelectField
                        name="gabungan"
                        label="Gabungan / Combine"
                        value={gabungan}
                        onChange={changeLembar}
                        options={[{ value: '0', label: 'Tidak' }, { value: '1', label: 'Ya' }]}
                        placeholder={null}
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Jumlah Berkas</Label>
                        <input type="number" min={0} value={jumlah_berkas} onChange={(e) => changeLembar('jumlah_berkas', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" />
                    </div>
                    <div className="space-y-1">
                        <Label>Jumlah Halaman</Label>
                        <input type="number" min={0} value={jumlah_halaman} onChange={(e) => changeLembar('jumlah_halaman', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" />
                    </div>
                </div>
                <TextAreaField name="keterangan_status" label="Keterangan Status" value={keterangan_status} onChange={changeLembar} rows={2} />
                <TextAreaField name="catatan" label="Catatan" value={catatan} onChange={changeLembar} rows={3} />
                <Button type="submit">
                    <Save className="mr-1 size-4" /> Simpan Progres Warkah
                </Button>
            </form>
{/* Modal Serah */}
            {openSerah && (
                <ModalShell title="Serahkan Berkas Warkah ke Validator" onClose={() => setOpenSerah(false)}>
                    <form onSubmit={submitSerah} className="space-y-3">
                        <div className="space-y-1">
                            <Label>
                                Penerima (Validator BT/SU) <span className="text-red-500">*</span>
                            </Label>
                            <select value={penerima_validator_id} onChange={(e) => setPenerima(e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                                <option value="">â€” Pilih Penerima â€”</option>
                                {validatorUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.role === 'validator_btel' ? 'Validator BT' : 'Validator SU'})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label>
                                Waktu Serah <span className="text-red-500">*</span>
                            </Label>
                            <input
                                type="datetime-local"
                                value={waktu_serah}
                                onChange={(e) => setWaktuSerah(e.target.value)}
                                required
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <SelectField name="status_berkas_bt" label="Status Berkas BT" value={status_berkas_bt} onChange={(n, v) => setSerahBt(v)} options={KONDISI} required />
                            <SelectField name="status_berkas_su" label="Status Berkas SU" value={status_berkas_su} onChange={(n, v) => setSerahSu(v)} options={KONDISI} required />
                        </div>
                        <TextAreaField
                            name="catatan_kondisi_berkas"
                            label="Catatan Kondisi Berkas"
                            value={catatan_kondisi_berkas}
                            onChange={(n, v) => setCatKondisi(v)}
                            placeholder="Contoh: Berkas BT & SU lengkap, fisik baik, siap diverifikasi."
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenSerah(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                <Send className="mr-1 size-4" /> Serahkan Berkas
                            </Button>
                        </div>
                    </form>
                </ModalShell>
            )}
{/* Modal Konfirmasi Pengembalian */}
            {openKembali && (
                <ModalShell title="Konfirmasi Pengembalian Berkas BT/SU" onClose={() => setOpenKembali(false)}>
                    <form onSubmit={submitKembali} className="space-y-3">
                        <div className="space-y-1">
                            <Label>
                                Nama Petugas Pengembali <span className="text-red-500">*</span>
                            </Label>
                            <input
                                value={petugas_pengembali}
                                onChange={(e) => setPengembali(e.target.value)}
                                required
                                maxLength={100}
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>
                                Waktu Terima Kembali Berkas <span className="text-red-500">*</span>
                            </Label>
                            <input
                                type="datetime-local"
                                value={waktu_kembali}
                                onChange={(e) => setWaktuKembali(e.target.value)}
                                required
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            />
                        </div>
                        <SelectField
                            name="kondisi_berkas_kembali"
                            label="Kondisi Berkas"
                            value={kondisi_berkas_kembali}
                            onChange={(n, v) => setKondisi(v)}
                            options={KONDISI}
                            required
                        />
                        <TextAreaField
                            name="catatan_pengembalian"
                            label="Catatan Pengembalian"
                            value={catatan_pengembalian}
                            onChange={(n, v) => setCatKembali(v)}
                            placeholder="Contoh: Berkas BT/SU diterima kembali lengkap tanpa kerusakan."
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenKembali(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                                <ArrowLeftRight className="mr-1 size-4" /> Konfirmasi Pengembalian Berkas
                            </Button>
                        </div>
                    </form>
                </ModalShell>
            )}
        </>
    );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-lg rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h6 className="mb-3 font-bold">{title}</h6>
                {children}
            </div>
        </div>
    );
}
