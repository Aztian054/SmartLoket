import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Plus, Settings2 } from 'lucide-react';

interface KategoriRow { id: number; kode: string; nama: string; is_active: boolean; jenis_permohonans_count?: number }
interface JenisHakRow { id: number; kode: string; nama: string; is_active: boolean; bidang_tanahs_count?: number }
interface SaranKoreksiRow { id: number; nama_dokumen_kurang: string; pesan_koreksi: string; jenis_permohonan?: { nama: string } | null }
interface Persyaratan { id: number; nama_dokumen: string; wajib: boolean; keterangan?: string | null }

interface FormPendaftaranProps {
    jenisPermohonans: Array<{ id: number; kode: string; nama: string; kategori: string; is_active: boolean; persyaratan_dokumens?: Persyaratan[]; tikets_count?: number }>;
    kategoris: KategoriRow[];
    jenisHaks: JenisHakRow[];
    saranKoreksis: SaranKoreksiRow[];
    editJenisPermohonan?: Array<{ id: number; kode: string; nama: string; kategori: string; is_active: boolean; persyaratan_dokumens?: Persyaratan[] }> | null;
    editSaranKoreksi?: Array<{ id: number; jenis_permohonan_id: number; nama_dokumen_kurang: string; pesan_koreksi: string }> | null;
    editJenisHak?: Array<{ id: number; kode: string; nama: string; is_active: boolean }> | null;
    editKategori?: Array<{ id: number; kode: string; nama: string; is_active: boolean }> | null;
}

export default function FormPendaftaran({ jenisPermohonans, kategoris, jenisHaks, saranKoreksis, editJenisPermohonan, editSaranKoreksi, editJenisHak, editKategori }: FormPendaftaranProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kelola Form Pendaftaran', href: '/admin/form-pendaftaran' }];
    const [tab, setTab] = useState('jp');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Form Pendaftaran" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Settings2 className="size-5 text-primary" /> Kelola Form Pendaftaran
                    </h1>
                    <p className="text-muted-foreground">Kelola master form pendaftaran secara mandiri — perubahan langsung berlaku tanpa ubahan kode.</p>
                </div>

                <FlashMessages />

                <div className="flex flex-wrap gap-1 border-b">
                    {[
                        ['jp', 'Jenis Permohonan'],
                        ['kategori', 'Kategori'],
                        ['jenisHak', 'Jenis Hak'],
                        ['saran', 'Saran Koreksi'],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${tab === key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'jp' && <JenisPermohonanTab jenisPermohonans={jenisPermohonans} kategoris={kategoris} edit={editJenisPermohonan?.[0] ?? null} />}
                {tab === 'kategori' && <KategoriTab kategoris={kategoris} edit={editKategori?.[0] ?? null} />}
                {tab === 'jenisHak' && <JenisHakTab jenisHaks={jenisHaks} edit={editJenisHak?.[0] ?? null} />}
                {tab === 'saran' && <SaranTab saranKoreksis={saranKoreksis} jenisPermohonans={jenisPermohonans} edit={editSaranKoreksi?.[0] ?? null} />}
            </div>
        </AppLayout>
    );
}
function JenisPermohonanTab({ jenisPermohonans, kategoris, edit }: {
    jenisPermohonans: NonNullable<FormPendaftaranProps['jenisPermohonans']>;
    kategoris: KategoriRow[];
    edit: { id: number; kode: string; nama: string; kategori: string; is_active: boolean; persyaratan_dokumens?: Persyaratan[] } | null;
}) {
    const [kode, setKode] = useState(edit?.kode ?? '');
    const [nama, setNama] = useState(edit?.nama ?? '');
    const [kategori, setKategori] = useState(edit?.kategori ?? '');

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (edit) {
            router.put(`/admin/form-pendaftaran/jenis-permohonan/${edit.id}`, { kode, nama, kategori });
        } else {
            router.post('/admin/form-pendaftaran/jenis-permohonan', { kode, nama, kategori });
        }
    };

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{edit ? `Edit ${edit.kode}` : 'Tambah Jenis Permohonan'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={save} className="space-y-3">
                        <Field label="Kode" required>
                            <input value={kode} onChange={(e) => setKode(e.target.value)} required maxLength={10} className="input-sm" />
                        </Field>
                        <Field label="Nama" required>
                            <input value={nama} onChange={(e) => setNama(e.target.value)} required maxLength={200} className="input-sm" />
                        </Field>
                        <Field label="Kategori" required>
                            <select value={kategori} onChange={(e) => setKategori(e.target.value)} required className="input-sm">
                                <option value="">— Pilih Kategori —</option>
                                {kategoris.map((k) => (
                                    <option key={k.id} value={k.kode}>
                                        {k.kode} — {k.nama}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Button type="submit">Simpan</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base">Daftar Jenis Permohonan</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {jenisPermohonans.map((j) => (
                        <div key={j.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                            <div>
                                <Badge variant="outline">{j.kode}</Badge>{' '}
                                <span className="text-sm font-medium">{j.nama}</span>
                                <small className="block text-muted-foreground">
                                    Kategori: {j.kategori} • {j.persyaratan_dokumens?.length ?? 0} persyaratan • {j.tikets_count ?? 0} tiket
                                </small>
                            </div>
                            <a href={`/admin/form-pendaftaran/jenis-permohonan/${j.id}/edit`}>
                                <Button size="sm" variant="outline">
                                    <Pencil className="mr-1 size-3" /> Edit
                                </Button>
                            </a>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
function KategoriTab({ kategoris, edit }: { kategoris: KategoriRow[]; edit: { kode: string; nama: string; is_active: boolean } | null }) {
    const [kode, setKode] = useState(edit?.kode ?? '');
    const [nama, setNama] = useState(edit?.nama ?? '');
    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (edit) router.put(`/admin/form-pendaftaran/kategori/${edit.kode}`, { kode, nama });
        else router.post('/admin/form-pendaftaran/kategori', { kode, nama });
    };
    return (
        <div className="flex flex-wrap gap-4">
            <Card className="w-80">
                <CardHeader>
                    <CardTitle className="text-base">{edit ? `Edit ${edit.kode}` : 'Tambah Kategori'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={save} className="space-y-3">
                        <Field label="Kode" required>
                            <input value={kode} onChange={(e) => setKode(e.target.value)} required maxLength={20} className="input-sm" />
                        </Field>
                        <Field label="Nama" required>
                            <input value={nama} onChange={(e) => setNama(e.target.value)} required maxLength={100} className="input-sm" />
                        </Field>
                        <Button type="submit">Simpan</Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="min-w-80 flex-1">
                <CardHeader>
                    <CardTitle className="text-base">Daftar Kategori</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {kategoris.map((k) => (
                        <div key={k.id} className="flex items-center justify-between py-2">
                            <span className="text-sm">
                                {k.kode} — {k.nama} ({k.jenis_permohonans_count ?? 0})
                            </span>
                            <a href={`/admin/form-pendaftaran/kategori/${k.id}/edit`}>
                                <Button size="sm" variant="outline">
                                    <Pencil className="mr-1 size-3" /> Edit
                                </Button>
                            </a>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function JenisHakTab({ jenisHaks, edit }: { jenisHaks: JenisHakRow[]; edit: { kode: string; nama: string; is_active: boolean } | null }) {
    const [kode, setKode] = useState(edit?.kode ?? '');
    const [nama, setNama] = useState(edit?.nama ?? '');
    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (edit) router.put(`/admin/form-pendaftaran/jenis-hak/${edit.kode}`, { kode, nama });
        else router.post('/admin/form-pendaftaran/jenis-hak', { kode, nama });
    };
    return (
        <div className="flex flex-wrap gap-4">
            <Card className="w-80">
                <CardHeader>
                    <CardTitle className="text-base">{edit ? `Edit ${edit.kode}` : 'Tambah Jenis Hak'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={save} className="space-y-3">
                        <Field label="Kode" required>
                            <input value={kode} onChange={(e) => setKode(e.target.value)} required maxLength={10} className="input-sm" />
                        </Field>
                        <Field label="Nama" required>
                            <input value={nama} onChange={(e) => setNama(e.target.value)} required maxLength={100} className="input-sm" />
                        </Field>
                        <Button type="submit">Simpan</Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="min-w-80 flex-1">
                <CardHeader>
                    <CardTitle className="text-base">Daftar Jenis Hak</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {jenisHaks.map((j) => (
                        <div key={j.id} className="flex items-center justify-between py-2">
                            <span className="text-sm">
                                {j.kode} — {j.nama} ({j.bidang_tanahs_count ?? 0})
                            </span>
                            <a href={`/admin/form-pendaftaran/jenis-hak/${j.id}/edit`}>
                                <Button size="sm" variant="outline">
                                    <Pencil className="mr-1 size-3" /> Edit
                                </Button>
                            </a>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
function SaranTab({ saranKoreksis, jenisPermohonans, edit }: {
    saranKoreksis: SaranKoreksiRow[];
    jenisPermohonans: NonNullable<FormPendaftaranProps['jenisPermohonans']>;
    edit: { id: number; jenis_permohonan_id: number; nama_dokumen_kurang: string; pesan_koreksi: string } | null;
}) {
    const [nama_dokumen_kurang, setNama] = useState(edit?.nama_dokumen_kurang ?? '');
    const [pesan_koreksi, setPesan] = useState(edit?.pesan_koreksi ?? '');
    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (edit) {
            router.put(`/admin/form-pendaftaran/saran-koreksi/${edit.id}`, { nama_dokumen_kurang, pesan_koreksi, jenis_permohonan_id: edit.jenis_permohonan_id });
        } else {
            router.post('/admin/form-pendaftaran/saran-koreksi', { nama_dokumen_kurang, pesan_koreksi, jenis_permohonan_id: jenisPermohonans[0]?.id });
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{edit ? 'Edit Saran Koreksi' : 'Tambah Saran Koreksi'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={save} className="max-w-lg space-y-3">
                    <Field label="Nama Dokumen Kurang" required>
                        <input value={nama_dokumen_kurang} onChange={(e) => setNama(e.target.value)} required className="input-sm" />
                    </Field>
                    <Field label="Pesan Koreksi" required>
                        <textarea value={pesan_koreksi} onChange={(e) => setPesan(e.target.value)} required className="input-sm min-h-20" />
                    </Field>
                    <Button type="submit">Simpan</Button>
                </form>
                <div className="mt-6 space-y-2">
                    {saranKoreksis.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 border-b py-2 text-sm">
                            <div>
                                <strong>{s.nama_dokumen_kurang}</strong>
                                <small className="block text-muted-foreground">{s.pesan_koreksi}</small>
                            </div>
                            <a href={`/admin/form-pendaftaran/saran-koreksi/${s.id}/edit`}>
                                <Button size="sm" variant="outline">
                                    <Pencil className="mr-1 size-3" /> Edit
                                </Button>
                            </a>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}