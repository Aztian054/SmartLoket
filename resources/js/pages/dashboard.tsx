import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { RolleBadge } from '@/components/smartloket/status-badge';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BarChart3, CheckCircle2, Clock, Inbox, TrendingUp } from 'lucide-react';

interface StatCard {
    label: string;
    nilai: number;
    warna: 'primary' | 'warning' | 'info' | 'danger' | 'success' | 'indigo' | 'purple';
}

interface ChartPoint {
    bulan: string;
    tahun: string;
    masuk: number;
    selesai: number;
}

interface OverdueRow {
    id: number;
    kode_tiket: string;
    nama_pemohon: string;
    jenis_permohonan: string | null;
    status: string;
    status_badge: string;
    status_label: string;
    tanggal_masuk: string | null;
}

interface DashboardProps {
    role: string;
    nama: string;
    stat: StatCard[];
    chart: ChartPoint[];
    overdue: OverdueRow[];
    server_waktu: string;
}

const toneMap: Record<string, string> = {
    primary: 'text-primary',
    warning: 'text-amber-600',
    info: 'text-sky-600',
    danger: 'text-red-600',
    success: 'text-emerald-600',
    indigo: 'text-indigo-600',
    purple: 'text-violet-600',
};

const roleNames: Record<string, string> = {
    admin: 'Administrator Database Tiket',
    pemimpin: 'Pemimpin Kantor',
    loket: 'Loket Penerimaan',
    verifikator: 'Verifikator Berkas',
    warkah: 'Pencarian & Data Warkah',
    validator_btel: 'Validator Pra-Buku Tanah El.',
    validator_suel: 'Validator Pra-Surat Ukur El.',
    alih_media_btel: 'Alih Media Pra-Buku Tanah El.',
    alih_media_suel: 'Alih Media Pra-Surat Ukur El.',
};

export default function Dashboard({ role, nama, stat, chart, overdue, server_waktu }: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];
    const maxNilai = Math.max(1, ...chart.map((c) => Math.max(c.masuk, c.selesai)));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Selamat datang, <strong>{nama}</strong> — {roleNames[role] ?? role}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <RolleBadge role={role} />
                        <span className="flex items-center gap-1 rounded-full border bg-primary/10 px-3 py-1 text-xs text-primary">
                            <Clock className="size-3" /> {server_waktu}
                        </span>
                    </div>
                </div>

                <FlashMessages />
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stat.map((s) => (
                        <Card key={s.label} className="border-l-4 border-l-primary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <BarChart3 className="size-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${toneMap[s.warna] ?? 'text-foreground'}`}>{s.nilai}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-primary" /> Tren 6 Bulan Terakhir
                            </CardTitle>
                            <CardDescription>Berkas masuk vs selesai per bulan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-48 items-end gap-3">
                                {chart.map((c) => (
                                    <div key={c.bulan + c.tahun} className="flex flex-1 flex-col items-center gap-1">
                                        <div className="flex w-full items-end justify-center gap-1" style={{ height: '12rem' }}>
                                            <div
                                                className="w-3 rounded-t bg-primary/70"
                                                style={{ height: `${Math.round((c.masuk / maxNilai) * 100)}%` }}
                                                title={`Masuk ${c.masuk}`}
                                            />
                                            <div
                                                className="w-3 rounded-t bg-emerald-500/80"
                                                style={{ height: `${Math.round((c.selesai / maxNilai) * 100)}%` }}
                                                title={`Selesai ${c.selesai}`}
                                            />
                                        </div>
                                        <small className="text-xs text-muted-foreground">{c.bulan}</small>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><span className="size-2 rounded bg-primary/70" /> Masuk</span>
                                <span className="flex items-center gap-1"><span className="size-2 rounded bg-emerald-500/80" /> Selesai</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="size-5 text-amber-500" /> Berkas Terlambat (&gt; 30 hari)
                            </CardTitle>
                            <CardDescription>Tiket yang belum selesai melebihi target waktu</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {overdue.length === 0 ? (
                                <p className="flex items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                                    <CheckCircle2 className="size-4 text-emerald-500" /> Tidak ada berkas terlambat.
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-2 py-2">Kode Tiket</th>
                                            <th className="px-2 py-2">Pemohon</th>
                                            <th className="px-2 py-2">Masuk</th>
                                            <th className="px-2 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overdue.map((o) => (
                                            <tr key={o.id} className="border-t">
                                                <td className="px-2 py-2 font-semibold">{o.kode_tiket}</td>
                                                <td className="px-2 py-2">{o.nama_pemohon}</td>
                                                <td className="px-2 py-2">{o.tanggal_masuk ?? '-'}</td>
                                                <td className="px-2 py-2">
                                                    <Badge variant="outline">{o.status_label}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </div>
<Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Inbox className="size-5 text-primary" /> Pintu Cepat Modul
                        </CardTitle>
                        <CardDescription>Akses langsung ke modul sesuai peran Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <ModuleLink href="/tracking" title="Tracking Publik" desc="Lacak status berkas publik" />
                        <ModuleLink href="/reports" title="Laporan & Rekap" desc="Rekap kinerja semua tahap" />
                        {role === 'admin' && <ModuleLink href="/admin" title="Database Tiket" desc="DB Tiket terpadu + arsip + akun" />}
                        {role === 'pemimpin' && <ModuleLink href="/pemimpin" title="Monitoring" desc="Dashboard eksekutif" />}
                        {role === 'loket' && <ModuleLink href="/loket" title="Loket Penerimaan" desc="Daftarkan & kelola berkas masuk" />}
                        {role === 'verifikator' && <ModuleLink href="/verifikator" title="Verifikasi Berkas" desc="Cek berkas tahap 2" />}
                        {role === 'warkah' && <ModuleLink href="/warkah" title="Warkah" desc="Pencarian & data warkah tahap 3" />}
                        {role === 'validator_btel' && <ModuleLink href="/validator-bt" title="Validasi BT" desc="Validasi pra-buku tanah elektronik" />}
                        {role === 'validator_suel' && <ModuleLink href="/validator-su" title="Validasi SU" desc="Validasi pra-surat ukur elektronik" />}
                        {role === 'alih_media_btel' && <ModuleLink href="/alih-media-bt" title="Alih Media BT" desc="Alih media pra-buku tanah elektronik" />}
                        {role === 'alih_media_suel' && <ModuleLink href="/alih-media-su" title="Alih Media SU" desc="Alih media pra-surat ukur elektronik" />}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function ModuleLink({ href, title, desc }: { href: string; title: string; desc: string }) {
    return (
        <a href={href} className="rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-primary/5">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </a>
    );
}