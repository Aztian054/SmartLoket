import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { LoketTiketModal } from '@/components/smartloket/forms/loket-tiket-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartJenisPermohonan, type SmartTiket } from '@/types';
import { type Paginated } from '../loket/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Database, PlusCircle, Search } from 'lucide-react';

interface AdminIndexProps {
    tikets: Paginated<SmartTiket> & {
        data: Array<SmartTiket & { monitor_warkah?: string | null; monitor_sertipikat?: string | null; monitor_sertipikat_label?: string | null }>;
    };
    stats: { total: number; menunggu: number; proses: number; selesai: number; dikembalikan: number; batal: number };
    jenisPermohonans: SmartJenisPermohonan[];
    jenisHaks: Array<{ id: number; kode: string; nama: string }>;
    filters: { q?: string; status?: string; jenis_permohonan_id?: string };
}

export default function AdminIndex({ tikets, stats, jenisPermohonans, jenisHaks, filters }: AdminIndexProps) {
    const [openModal, setOpenModal] = useState(false);
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [jp, setJp] = useState(filters.jenis_permohonan_id ?? '');
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Database Tiket (Admin)', href: '/admin' }];

    const cards = [
        { label: 'Total Tiket', v: stats.total, tone: 'text-primary' },
        { label: 'Menunggu (Diterima)', v: stats.menunggu, tone: 'text-amber-600' },
        { label: 'Dalam Proses', v: stats.proses, tone: 'text-sky-600' },
        { label: 'Selesai', v: stats.selesai, tone: 'text-emerald-600' },
        { label: 'Revisi', v: stats.dikembalikan, tone: 'text-red-600' },
        { label: 'Batal', v: stats.batal, tone: 'text-zinc-500' },
    ];

    const doFilter = () => router.get('/admin', { q, status, jenis_permohonan_id: jp });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database Tiket" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Database className="size-5 text-primary" /> Database Tiket Terpadu
                        </h1>
                        <p className="text-muted-foreground">Semua tiket terpusat di sini — status "diterima" berarti menunggu di-Add tahap berikutnya.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setOpenModal(true)}>
                            <PlusCircle className="mr-1 size-4" /> Tambah Tiket
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/admin/form-pendaftaran">Form Pendaftaran</a>
                        </Button>
                    </div>
                </div>

                <FlashMessages />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {cards.map((c) => (
                        <Card key={c.label}>
                            <CardContent className="pt-4 text-center">
                                <div className={`text-3xl font-bold ${c.tone}`}>{c.v}</div>
                                <small className="text-muted-foreground">{c.label}</small>
                            </CardContent>
                        </Card>
                    ))}
                </div>
<div className="flex flex-wrap items-center gap-2">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode / nama / NIK..." className="w-60" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">Semua Status</option>
                        {['diterima', 'verifikasi', 'warkah', 'validasi_btel', 'validasi_suel', 'alih_media_btel', 'alih_media_suel', 'dikembalikan', 'perbaikan', 'selesai', 'batal'].map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <select value={jp} onChange={(e) => setJp(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">Semua Jenis</option>
                        {jenisPermohonans.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.nama}
                            </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={doFilter}>
                        <Search className="mr-1 size-4" /> Filter
                    </Button>
                </div>
<div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">Kode</th>
                                <th className="px-3 py-2">Pemohon</th>
                                <th className="px-3 py-2">Jenis</th>
                                <th className="px-3 py-2">Bidang</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Warkah</th>
                                <th className="px-3 py-2">Sertipikat</th>
                                <th className="px-3 py-2">Masuk</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tikets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                                        Belum ada berkas.
                                    </td>
                                </tr>
                            ) : (
                                tikets.data.map((t) => (
                                    <tr key={t.id} className="border-t">
                                        <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                        <td className="px-3 py-2">
                                            {t.nama_pemohon}
                                            <small className="block text-muted-foreground">{t.nik_pemohon ?? '-'}</small>
                                        </td>
                                        <td className="px-3 py-2">
                                            <Badge variant="outline">{t.jenis_permohonan?.kode}</Badge>
                                        </td>
                                        <td className="px-3 py-2">{t.bidang_tanahs?.length ?? t.jumlah_bidang}</td>
                                        <td className="px-3 py-2">
                                            <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                        </td>
                                        <td className="px-3 py-2 text-xs">{t.monitor_warkah ?? '-'}</td>
                                        <td className="px-3 py-2 text-xs">{t.monitor_sertipikat_label ?? t.monitor_sertipikat ?? '-'}</td>
                                        <td className="px-3 py-2 text-xs">{t.tanggal_masuk ? new Date(t.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</td>
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
            </div>

            <LoketTiketModal open={openModal} onClose={() => setOpenModal(false)} jenisPermohonans={jenisPermohonans} jenisHaks={jenisHaks} />
        </AppLayout>
    );
}