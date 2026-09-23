import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, CheckCircle2, Eye, RotateCcw, Search } from 'lucide-react';

interface BebanRow {
    id: number;
    name: string;
    email: string;
    role: string;
    beban_aktif: number;
    total_selesai: number;
}

interface ActivityRow {
    id: number;
    stage_dari: string;
    stage_ke: string;
    keterangan: string;
    created_at: string;
    tiket?: { id: number; kode_tiket: string } | null;
    user?: { id: number; name: string } | null;
}

interface PemimpinIndexProps {
    stageCounts: Record<string, number>;
    selesaiTotal: number;
    beban: BebanRow[];
    tikets: SmartTiket[];
    activities: ActivityRow[];
    filters: { q?: string; status?: string };
}

const STAGES: Array<[string, string]> = [
    ['diterima', 'Diterima / DB Admin'],
    ['verifikasi', 'Verifikasi Berkas'],
    ['warkah', 'Pencarian & Data Warkah'],
    ['validasi_btel', 'Validasi Pra-BTel'],
    ['validasi_suel', 'Validasi Pra-SuEl'],
    ['alih_media_btel', 'Alih Media Pra-BTel'],
    ['alih_media_suel', 'Alih Media Pra-SuEl'],
    ['selesai', 'Selesai'],
    ['dikembalikan', 'Dikembalikan (Revisi)'],
    ['batal', 'Batal'],
];

export default function PemimpinIndex({ stageCounts, selesaiTotal, beban, tikets, activities, filters }: PemimpinIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Monitoring & Evaluasi', href: '/pemimpin' }];
    const filter = () => router.get('/pemimpin', { q: filters.q, status: filters.status }, { preserveState: true });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring & Evaluasi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Monitoring & Evaluasi</h1>
                        <p className="text-muted-foreground">Ringkasan layanan, beban kerja, dan berkas yang sedang berjalan.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <a href="/reports">Rekap Laporan</a>
                        </Button>
                        <Button variant="outline" onClick={() => router.reload({ only: ['stageCounts', 'beban', 'tikets', 'activities'] })}>
                            <RotateCcw className="mr-1 size-4" /> Segarkan
                        </Button>
                    </div>
                </div>

                <FlashMessages />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardContent className="flex items-center justify-between pt-4">
                            <div>
                                <div className="text-xs font-semibold uppercase text-muted-foreground">Berkas Selesai</div>
                                <div className="text-3xl font-bold text-emerald-600">{selesaiTotal}</div>
                                <small className="text-muted-foreground">Total sertifikat elekt. terbit</small>
                            </div>
                            <CheckCircle2 className="size-8 text-emerald-500/40" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between pt-4">
                            <div>
                                <div className="text-xs font-semibold uppercase text-muted-foreground">Perlu Perbaikan</div>
                                <div className="text-3xl font-bold text-red-600">{stageCounts.dikembalikan ?? 0}</div>
                                <small className="text-muted-foreground">Dikembalikan ke tahap asal</small>
                            </div>
                            <RotateCcw className="size-8 text-red-500/40" />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Status Alur Layanan (Tahap Saat Ini)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {STAGES.map(([kode, label]) => (
                            <div key={kode} className="flex items-center justify-between rounded-md border px-3 py-2">
                                <span className="text-sm">{label}</span>
                                <Badge variant={kode === 'selesai' ? 'default' : kode === 'dikembalikan' || kode === 'batal' ? 'destructive' : 'secondary'}>
                                    {stageCounts[kode] ?? 0}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
<div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Search className="size-4 text-primary" /> Beban Kerja Petugas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Petugas</th>
                                        <th className="px-3 py-2">Peran</th>
                                        <th className="px-3 py-2 text-center">Aktif</th>
                                        <th className="px-3 py-2 text-center">Total Selesai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {beban.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                                                Belum ada petugas dengan penugasan.
                                            </td>
                                        </tr>
                                    ) : (
                                        beban.map((u) => (
                                            <tr key={u.id} className="border-t">
                                                <td className="px-3 py-2 font-medium">{u.name}</td>
                                                <td className="px-3 py-2">{u.role}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <Badge variant={u.beban_aktif > 0 ? 'secondary' : 'outline'}>{u.beban_aktif}</Badge>
                                                </td>
                                                <td className="px-3 py-2 text-center">{u.total_selesai}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Activity className="size-4 text-primary" /> Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {activities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
                            ) : (
                                activities.map((a) => (
                                    <div key={a.id} className="flex gap-2 border-b py-2">
                                        <Activity className="mt-1 size-4 text-muted-foreground" />
                                        <div className="text-sm">
                                            <span className="font-semibold">{a.tiket?.kode_tiket ?? '-'}</span>
                                            <span className="block text-muted-foreground">
                                                [{a.stage_dari} → {a.stage_ke}] {a.keterangan}
                                            </span>
                                            <small className="text-muted-foreground/70">
                                                {a.user?.name ?? 'Sistem'} • {a.created_at ? new Date(a.created_at).toLocaleString('id-ID') : ''}
                                            </small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
<Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Daftar Berkas Permohonan</CardTitle>
                        <Badge variant="secondary">{tikets.length} berkas</Badge>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <div className="mb-3 flex flex-wrap gap-2">
                            <select
                                value={filters.status ?? ''}
                                onChange={(e) => router.get('/pemimpin', { status: e.target.value })}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="">Semua Status</option>
                                {STAGES.map(([kode, label]) => (
                                    <option key={kode} value={kode}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <input
                                value={filters.q ?? ''}
                                onChange={(e) => router.get('/pemimpin', { q: e.target.value })}
                                placeholder="Cari kode tiket / nama . . ."
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            />
                            <Button size="sm" onClick={filter}>
                                Filter
                            </Button>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-2">Kode Tiket</th>
                                    <th className="px-3 py-2">Pemohon</th>
                                    <th className="px-3 py-2">Jenis</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Petugas Loket</th>
                                    <th className="px-3 py-2">Masuk</th>
                                    <th className="px-3 py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
{tikets.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-3 py-4 text-center text-muted-foreground">
                                            Tidak ada berkas yang cocok dengan filter saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    tikets.map((t) => (
                                        <tr key={t.id} className="border-t">
                                            <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                            <td className="px-3 py-2">{t.nama_pemohon}</td>
                                            <td className="px-3 py-2 text-xs">{t.jenis_permohonan?.nama ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                            </td>
                                            <td className="px-3 py-2 text-xs">{t.petugas_loket?.name ?? '-'}</td>
                                            <td className="px-3 py-2 text-xs">
                                                {t.tanggal_masuk ? new Date(t.tanggal_masuk).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={`/pemimpin/tiket/${t.id}`}>
                                                        <Eye className="mr-1 size-4" /> Detail
                                                    </a>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}