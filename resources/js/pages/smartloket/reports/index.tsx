import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { SortableTh } from '@/components/smartloket/sortable-th';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartJenisPermohonan, type SmartTiket } from '@/types';
import { type SortDir } from '@/lib/sort';
import { type Paginated } from '../loket/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, FileSpreadsheet, Printer } from 'lucide-react';

interface ReportsIndexProps {
    tikets: Paginated<SmartTiket>;
    stats: { total: number; selesai: number; proses: number; dikembalikan: number; batal: number };
    startDate: string;
    endDate: string;
    jenisPermohonans: SmartJenisPermohonan[];
    filters: { q?: string; status?: string; jenis_permohonan_id?: string; start_date?: string; end_date?: string; sort?: string; dir?: string };
}

export default function ReportsIndex({ tikets, stats, startDate, endDate, jenisPermohonans, filters }: ReportsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan & Rekap', href: '/reports' }];
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [jp, setJp] = useState(filters.jenis_permohonan_id ?? '');
    const [sd, setSd] = useState(filters.start_date ?? startDate);
    const [ed, setEd] = useState(filters.end_date ?? endDate);
    const sort = filters.sort ?? 'id';
    const dir: SortDir = filters.dir === 'asc' ? 'asc' : 'desc';
    const changeSort = (key: string, d: SortDir) =>
        router.get('/reports', { q, status, jenis_permohonan_id: jp, start_date: sd, end_date: ed, sort: key, dir: d }, { preserveState: true, preserveScroll: true });

    const doFilter = () => router.get('/reports', { q, status, jenis_permohonan_id: jp, start_date: sd, end_date: ed });
    const query = () => `?q=${encodeURIComponent(q)}&status=${status}&jenis_permohonan_id=${jp}&start_date=${sd}&end_date=${ed}`;

    const cards = [
        { label: 'Total', v: stats.total, tone: 'text-primary' },
        { label: 'Selesai', v: stats.selesai, tone: 'text-emerald-600' },
        { label: 'Dalam Proses', v: stats.proses, tone: 'text-sky-600' },
        { label: 'Dikembalikan', v: stats.dikembalikan, tone: 'text-red-600' },
        { label: 'Batal', v: stats.batal, tone: 'text-zinc-500' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan & Rekap" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <BarChart3 className="size-5 text-primary" /> Laporan & Rekap
                        </h1>
                        <p className="text-muted-foreground">
                            Periode {sd} s/d {ed}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <a href={`/reports/print${query()}`} target="_blank" rel="noopener noreferrer">
                                <Printer className="mr-1 size-4" /> Cetak
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={`/reports/print-rapi${query()}`} target="_blank" rel="noopener noreferrer">
                                <Printer className="mr-1 size-4" /> Cetak Rapi
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href={`/reports/export${query()}`}>
                                <FileSpreadsheet className="mr-1 size-4" /> Export Excel
                            </a>
                        </Button>
                    </div>
                </div>

                <FlashMessages />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode/nama..." className="w-52" />
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-sm">
                        <option value="">Semua Status</option>
                        {['diterima', 'verifikasi', 'warkah', 'validasi_btel', 'validasi_suel', 'alih_media_btel', 'alih_media_suel', 'selesai', 'dikembalikan', 'batal'].map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <select value={jp} onChange={(e) => setJp(e.target.value)} className="input-sm">
                        <option value="">Semua Jenis</option>
                        {jenisPermohonans.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.nama}
                            </option>
                        ))}
                    </select>
                    <input type="date" value={sd} onChange={(e) => setSd(e.target.value)} className="input-sm" />
                    <input type="date" value={ed} onChange={(e) => setEd(e.target.value)} className="input-sm" />
                    <Button size="sm" onClick={doFilter}>
                        Filter
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <SortableTh label="Kode" sortKey="kode_tiket" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Pemohon" sortKey="nama_pemohon" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Jenis" sortKey="jenis" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Bidang" sortKey="jumlah_bidang" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Status" sortKey="status" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Masuk" sortKey="tanggal_masuk" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Selesai" sortKey="tanggal_selesai" current={sort} dir={dir} onSort={changeSort} />
                                <SortableTh label="Loket" sortKey="petugas_loket" current={sort} dir={dir} onSort={changeSort} />
                            </tr>
                        </thead>
                        <tbody>
                            {tikets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                                        Tidak ada berkas yang cocok.
                                    </td>
                                </tr>
                            ) : (
                                tikets.data.map((t) => (
                                    <tr key={t.id} className="border-t">
                                        <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                        <td className="px-3 py-2">{t.nama_pemohon}</td>
                                        <td className="px-3 py-2 text-xs">{t.jenis_permohonan?.nama ?? '-'}</td>
                                        <td className="px-3 py-2">{t.jumlah_bidang}</td>
                                        <td className="px-3 py-2">
                                            <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                        </td>
                                        <td className="px-3 py-2 text-xs">{t.tanggal_masuk ? new Date(t.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="px-3 py-2 text-xs">{t.tanggal_selesai ? new Date(t.tanggal_selesai).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="px-3 py-2 text-xs">{t.petugas_loket?.name ?? '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}