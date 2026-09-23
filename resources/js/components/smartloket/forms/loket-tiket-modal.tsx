import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PackageOpen, Plus, Save, Trash2 } from 'lucide-react';
import { type SmartJenisPermohonan } from '@/types';

interface BidangRow {
    nib: string;
    no_sertifikat_lama: string;
    jenis_hak: string;
    nama_pemegang_hak: string;
    desa_kelurahan: string;
    kecamatan: string;
}

const inputCls =
    'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring';

export function LoketTiketModal({ open, onClose, jenisPermohonans, jenisHaks }: {
    open: boolean;
    onClose: () => void;
    jenisPermohonans: SmartJenisPermohonan[];
    jenisHaks: Array<{ id: number; kode: string; nama: string }>;
}) {
    const [kode_tiket, setKode] = useState('');
    const [jenis_permohonan_id, setJenis] = useState('');
    const [nama_pemohon, setNama] = useState('');
    const [nik_pemohon, setNik] = useState('');
    const [no_hp_pemohon, setHp] = useState('');
    const [email_pemohon, setEmail] = useState('');
    const [no_hak_sekarang, setHak] = useState('');
    const [no_hak_sebelumnya, setHakLama] = useState('');
    const [kelurahan_desa, setKelurahan] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [bidangCount, setBidangCount] = useState(1);
    const [rows, setRows] = useState<BidangRow[]>([{ nib: '', no_sertifikat_lama: '', jenis_hak: '', nama_pemegang_hak: '', desa_kelurahan: '', kecamatan: '' }]);

    const setRow = (i: number, field: keyof BidangRow, value: string) => {
        setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
    };

    const syncRows = () => {
        setRows((r) => {
            const next = [...r];
            while (next.length < bidangCount) next.push({ nib: '', no_sertifikat_lama: '', jenis_hak: '', nama_pemegang_hak: '', desa_kelurahan: '', kecamatan: '' });
            return next.slice(0, bidangCount);
        });
    };

    const jp = jenisPermohonans.find((j) => String(j.id) === jenis_permohonan_id);
    if (!open) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/loket',
            {
                kode_tiket,
                jenis_permohonan_id,
                nama_pemohon,
                nik_pemohon,
                no_hp_pemohon,
                email_pemohon,
                no_hak_sekarang,
                no_hak_sebelumnya,
                kelurahan_desa,
                kecamatan,
                jumlah_bidang: bidangCount,
                keterangan,
                bidang: rows as unknown as Array<Record<string, string>>,
            },
            { onSuccess: () => onClose(), preserveScroll: true },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h5 className="mb-1 font-bold">Daftarkan Tiket / Berkas Baru</h5>
                <p className="text-sm text-muted-foreground">
                    Nomor tiket diisi <strong>manual</strong> (format bebas). Berkas langsung masuk <strong>Database Admin</strong>.
                </p>
                <form onSubmit={submit} className="mt-4 space-y-5">
<div className="space-y-3">
                        <h6 className="font-semibold">Data Pemohon</h6>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Nama Pemohon" required>
                                <input value={nama_pemohon} onChange={(e) => setNama(e.target.value)} required maxLength={200} className={inputCls} />
                            </Field>
                            <Field label="NIK Pemohon">
                                <input value={nik_pemohon} onChange={(e) => setNik(e.target.value)} maxLength={20} placeholder="16 digit NIK" className={inputCls} />
                            </Field>
                            <Field label="No. HP Pemohon" required>
                                <input value={no_hp_pemohon} onChange={(e) => setHp(e.target.value)} required maxLength={20} placeholder="08xxxxxxxxxx" className={inputCls} />
                            </Field>
                            <Field label="Email Pemohon" required>
                                <input type="email" value={email_pemohon} onChange={(e) => setEmail(e.target.value)} required maxLength={150} placeholder="nama@email.com" className={inputCls} />
                            </Field>
                            <Field label="No. Hak Sekarang">
                                <input value={no_hak_sekarang} onChange={(e) => setHak(e.target.value)} maxLength={100} className={inputCls} />
                            </Field>
                            <Field label="No. Hak Sebelumnya">
                                <input value={no_hak_sebelumnya} onChange={(e) => setHakLama(e.target.value)} maxLength={100} className={inputCls} />
                            </Field>
                            <Field label="Kelurahan / Desa">
                                <input value={kelurahan_desa} onChange={(e) => setKelurahan(e.target.value)} maxLength={100} className={inputCls} />
                            </Field>
                            <Field label="Kecamatan">
                                <input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} maxLength={100} className={inputCls} />
                            </Field>
                        </div>
                    </div>
<div className="space-y-3 border-t pt-3">
                        <h6 className="flex items-center gap-2 font-semibold">
                            <PackageOpen className="size-4 text-primary" /> Data Bidang Tanah
                        </h6>
                        <div className="flex items-center gap-2">
                            <Label>Jumlah Bidang</Label>
                            <input
                                type="number"
                                min={1}
                                value={bidangCount}
                                onChange={(e) => setBidangCount(Math.max(1, Number(e.target.value)))}
                                className={`${inputCls} w-20`}
                            />
                            <Button type="button" size="sm" variant="outline" onClick={syncRows}>
                                Sesuaikan
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {rows.map((r, i) => (
                                <div key={i} className="grid gap-2 rounded-md border p-3 sm:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">NIB</Label>
                                        <input value={r.nib} onChange={(e) => setRow(i, 'nib', e.target.value)} className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">No. Sertifikat Lama</Label>
                                        <input value={r.no_sertifikat_lama} onChange={(e) => setRow(i, 'no_sertifikat_lama', e.target.value)} className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Jenis Hak</Label>
                                        <select value={r.jenis_hak} onChange={(e) => setRow(i, 'jenis_hak', e.target.value)} className={inputCls}>
                                            <option value="">— pilih —</option>
                                            {jenisHaks.map((jh) => (
                                                <option key={jh.id} value={jh.kode}>
                                                    {jh.kode} — {jh.nama}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Nama Pemegang Hak</Label>
                                        <input value={r.nama_pemegang_hak} onChange={(e) => setRow(i, 'nama_pemegang_hak', e.target.value)} className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Kelurahan</Label>
                                        <input value={r.desa_kelurahan} onChange={(e) => setRow(i, 'desa_kelurahan', e.target.value)} className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Kecamatan</Label>
                                        <input value={r.kecamatan} onChange={(e) => setRow(i, 'kecamatan', e.target.value)} className={inputCls} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
<div className="space-y-1 border-t pt-3">
                        <div className="space-y-1">
                            <Label>Keterangan</Label>
                            <textarea rows={2} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className={`${inputCls} h-auto py-2`} />
                        </div>
                        {jp && jp.persyaratan_dokumens && jp.persyaratan_dokumens.length > 0 && (
                            <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
                                <p className="mb-1 font-semibold">Persyaratan {jp.nama}:</p>
                                <ul className="list-disc pl-5">
                                    {jp.persyaratan_dokumens.map((p) => (
                                        <li key={p.id}>{p.nama_dokumen}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-3">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">
                            <Save className="mr-1 size-4" /> Daftarkan Berkas
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <Label>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {children}
        </div>
    );
}