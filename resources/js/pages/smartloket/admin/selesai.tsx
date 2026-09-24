import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { SortableTh } from '@/components/smartloket/sortable-th';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartJenisPermohonan, type SmartTiket } from '@/types';
import { type SortDir } from '@/lib/sort';
import { type Paginated } from '../loket/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Archive, Search } from 'lucide-react';

interface SelesaiProps {
    tikets: Paginated<SmartTiket>;
    tahuns: number[];
    jenisPermohonans: SmartJenisPermohonan[];
    jenisHaks: Array<{ id: number; kode: string; nama: string }>;
    petugasList: Array<{ id: number; name: string }>;
    folders: Array<{ id: number; nama_folder: string }>;
    filters: { q?: string; tahun?: string; jenis_permohonan_id?: string; jenis_hak?: string; petugas?: string; sort?: string; dir?: string };
}

export default function AdminSelesai({ tikets, tahuns, jenisPermohonans, jenisHaks, petugasList, folders, filters }: SelesaiProps) {
    const [q, setQ] = useState(filters.q ?? '');
    const [selected, setSelected] = useState<number[]>([]);
    const [openBulk, setOpenBulk] = useState(false);
    const [folder_id, setFolder] = useState('');
    const [nama_arsip, setNama] = useState('');
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: 'Arsip Berkas Selesai', href: '/admin/selesai' },
    ];
    const allIds = tikets.data.map((t) => t.id);
    const allChecked = allIds.length > 0 && allIds.every((id) => selected.includes(id));

    const toggle = (id: number) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const toggleAll = () => setSelected(allChecked ? [] : allIds);
    const doFilter = () => router.get('/admin/selesai', { ...filters, q });
    const sort = filters.sort ?? 'tanggal_selesai';
    const dir: SortDir = filters.dir === 'asc' ? 'asc' : 'desc';
    const changeSort = (key: string, d: SortDir) =>
        router.get('/admin/selesai', { ...filters, q, sort: key, dir: d }, { preserveState: true, preserveScroll: true });
    const submitBulk = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/selesai/arsipkan-massal', { folder_id, nama_arsip, ids: selected.join(',') }, { onSuccess: () => setOpenBulk(false) });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arsip Berkas Selesai" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Archive className="size-5 text-primary" /> Arsip Berkas Selesai
                        </h1>
                        <p className="text-muted-foreground">Migrasi berkas berstatus selesai ke arsip folder fisik.</p>
                    </div>
                    <Button size="sm" onClick={() => setOpenBulk(true)}>
                        <Archive className="mr-1 size-4" /> Arsipkan Semua Hasil Filter ({selected.length} dipilih)
                    </Button>
                </div>

                <FlashMessages />
<Card>
                    <CardContent className="flex flex-wrap items-center gap-2 pt-4">
                        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode/nama/NIK..." className="w-56" />
                        <select defaultValue={filters.tahun ?? ''} className="h-9 rounded-md border px-3 text-sm" onChange={(e) => router.get('/admin/selesai', { ...filters, tahun: e.target.value })}>
                            <option value="">Tahun Selesai</option>
                            {tahuns.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        <select defaultValue={filters.jenis_permohonan_id ?? ''} className="h-9 rounded-md border px-3 text-sm" onChange={(e) => router.get('/admin/selesai', { ...filters, jenis_permohonan_id: e.target.value })}>
                            <option value="">Jenis Permohonan</option>
                            {jenisPermohonans.map((j) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama}
                                </option>
                            ))}
                        </select>
                        <select defaultValue={filters.jenis_hak ?? ''} className="h-9 rounded-md border px-3 text-sm" onChange={(e) => router.get('/admin/selesai', { ...filters, jenis_hak: e.target.value })}>
                            <option value="">Jenis Hak</option>
                            {jenisHaks.map((j) => (
                                <option key={j.id} value={j.kode}>
                                    {j.kode}
                                </option>
                            ))}
                        </select>
                        <select defaultValue={filters.petugas ?? ''} className="h-9 rounded-md border px-3 text-sm" onChange={(e) => router.get('/admin/selesai', { ...filters, petugas: e.target.value })}>
                            <option value="">Petugas Loket</option>
                            {petugasList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <Button size="sm" onClick={doFilter}>
                            <Search className="mr-1 size-4" /> Filter
                        </Button>
                    </CardContent>
                </Card>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">
                                    <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                                </th>
                                <SortableTh label="Kode Tiket" sortKey="kode_tiket" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Pemohon" sortKey="nama_pemohon" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Jenis" sortKey="jenis" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Bidang" sortKey="jumlah_bidang" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Selesai" sortKey="tanggal_selesai" current={sort} dir={dir} onSort={changeSort} />
                                <th className="px-3 py-2">Arsip</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
{tikets.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                                            Tidak ada berkas selesai yang cocok.
                                        </td>
                                    </tr>
                                ) : (
                                    tikets.data.map((t) => (
                                        <tr key={t.id} className="border-t">
                                            <td className="px-3 py-2">
                                                <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} />
                                            </td>
                                            <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                            <td className="px-3 py-2">{t.nama_pemohon}</td>
                                            <td className="px-3 py-2 text-xs">{t.jenis_permohonan?.nama ?? '-'}</td>
                                            <td className="px-3 py-2">{t.jumlah_bidang}</td>
                                            <td className="px-3 py-2 text-xs">{t.tanggal_selesai ? new Date(t.tanggal_selesai).toLocaleDateString('id-ID') : '-'}</td>
                                            <td className="px-3 py-2">
                                                {(t.arsips?.length ?? 0) > 0 ? (
                                                    <Badge className="bg-emerald-600">Sudah</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Belum</Badge>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={`/admin/tiket/${t.id}`}>Detail</a>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
{openBulk && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenBulk(false)}>
                        <form onSubmit={submitBulk} className="w-full max-w-md rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h6 className="mb-3 font-bold">Arsipkan Massal Berkas Selesai</h6>
                            <p className="mb-3 text-sm text-muted-foreground">{selected.length} berkas terpilih akan diarsipkan ke folder di bawah.</p>
                            <div className="mb-3 space-y-1">
                                <label className="text-sm font-medium">
                                    Folder Arsip <span className="text-red-500">*</span>
                                </label>
                                <select value={folder_id} onChange={(e) => setFolder(e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                                    <option value="">— Pilih Folder —</option>
                                    {folders.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.nama_folder}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 space-y-1">
                                <label className="text-sm font-medium">
                                    Nama Arsip <span className="text-red-500">*</span>
                                </label>
                                <input value={nama_arsip} onChange={(e) => setNama(e.target.value)} required maxLength={200} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setOpenBulk(false)}>
                                    Batal
                                </Button>
                                <Button type="submit">
                                    <Archive className="mr-1 size-4" /> Arsipkan
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}