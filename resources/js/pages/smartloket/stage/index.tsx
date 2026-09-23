import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRight, Database, History, Inbox, PlusCircle, RefreshCw, Search, UserCheck } from 'lucide-react';

interface StageStats {
    total_db: number;
    active: number;
    history: number;
    lengkap: number;
    revisi: number;
}

interface SearchRow {
    id: number;
    kode_tiket: string;
    nama_pemohon: string;
    status_badge: string;
    status_label: string;
    jumlah_bidang: number;
    jenis: string | null;
    tanggal_masuk: string | null;
    locked?: boolean;
    active?: { user_id: number } | null;
}

interface StageIndexProps {
    stage: string;
    stageLabel: string;
    routeBase: string;
    stats: StageStats;
    activeTikets: SmartTiket[];
    history: SmartTiket[];
    revisiMenunggu: SmartTiket[];
    berkasDipinjam?: Array<{ id: number; tiket_id: number; tanggal_diserahkan: string | null; tiket?: { id: number; kode_tiket: string; nama_pemohon: string } | null }>;
}

const STAGE_TITLES: Record<string, string> = {
    verifikasi: 'Stage 2 : Verifikasi Berkas',
    warkah: 'Stage 3 : Pencarian & Data Warkah',
    validasi_btel: 'Stage 4a : Validasi Pra-BTel',
    validasi_suel: 'Stage 4b : Validasi Pra-SuEl',
    alih_media_btel: 'Stage 5a : Alih Media Pra-BTel',
    alih_media_suel: 'Stage 5b : Alih Media Pra-SuEl',
};

const PREFIX: Record<string, string> = {
    verifikasi: 'verifikator',
    validasi_btel: 'validator_btel',
    validasi_suel: 'validator_suel',
};

export default function StageIndex({ stage, stageLabel, routeBase, stats, activeTikets, history, revisiMenunggu, berkasDipinjam }: StageIndexProps) {
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchRow[]>([]);
    const [searched, setSearched] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [{ title: STAGE_TITLES[stage] ?? stageLabel, href: `/${routeBase}` }];
    const prefix = PREFIX[stage] ?? routeBase;
    const isValidatorOrAlih = stage.startsWith('validasi_') || stage.startsWith('alih_media_');

    const doSearch = async (query: string) => {
        setQ(query);
        const term = query.trim();
        if (!term) {
            setResults([]);
            setSearched(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/${routeBase}/search?q=${encodeURIComponent(term)}`);
            const data = await res.json();
            setResults(data?.tikets ?? []);
            setSearched(true);
        } catch {
            setResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const addTicket = (id: number) => {
        router.post(`/${routeBase}/add/${id}`, {}, { preserveScroll: true });
    };

    const statCards = [
        { label: 'Tersedia di DB Admin', value: stats.total_db, tone: 'text-primary' },
        { label: 'Antrian Aktif Saya', value: stats.active, tone: 'text-emerald-600' },
        { label: 'Pernah Diproses', value: stats.history, tone: 'text-sky-600' },
        { label: 'Berkas Selesai', value: stats.lengkap, tone: 'text-emerald-600' },
        { label: 'Perlu Revisi', value: stats.revisi, tone: 'text-amber-600' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={stageLabel} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{STAGE_TITLES[stage] ?? stageLabel}</h1>
                    <p className="text-muted-foreground">Pola kerja pull-based: Smart Search → Add → Proses → Selesai → kembali ke DB Admin.</p>
                </div>

                <FlashMessages />
{/* Statistik */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {statCards.map((s) => (
                        <Card key={s.label}>
                            <CardContent className="pt-4 text-center">
                                <div className={`text-3xl font-bold ${s.tone}`}>{s.value}</div>
                                <small className="text-muted-foreground">{s.label}</small>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Alert pola kerja */}
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
                    <Database className="mt-1 size-5 text-primary" />
                    <div>
                        <strong>Pola Kerja {stageLabel}</strong>
                        <p className="text-sm">
                            Cari berkas di Database Admin — <Badge variant="secondary">{stats.total_db}</Badge> berkas tersedia → klik <strong>Add</strong> →
                            proses → <strong>Proses Selesai</strong> → kembali ke DB Admin.
                        </p>
                    </div>
                </div>

                {/* Berkas Dipinjam (Warkah) */}
                {berkasDipinjam && berkasDipinjam.length > 0 && (
                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Berkas BT/SU Dipinjam (menunggu pengembalian)</CardTitle>
                            <Badge variant="outline" className="rounded-full">
                                {berkasDipinjam.length}
                            </Badge>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Kode Tiket</th>
                                        <th className="px-3 py-2">Pemohon</th>
                                        <th className="px-3 py-2">Tanggal Diserahkan</th>
                                        <th className="px-3 py-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
{berkasDipinjam.map((bk) => (
                                        <tr key={bk.id} className="border-t">
                                            <td className="px-3 py-2 font-semibold">
                                                <a href={`/${routeBase}/${bk.tiket_id}`} className="hover:underline">
                                                    {bk.tiket?.kode_tiket}
                                                </a>
                                            </td>
                                            <td className="px-3 py-2">{bk.tiket?.nama_pemohon}</td>
                                            <td className="px-3 py-2">{bk.tanggal_diserahkan ?? '-'}</td>
                                            <td className="px-3 py-2 text-right">
                                                <a href={`/${routeBase}/${bk.tiket_id}`}>
                                                    <Button size="sm" variant="outline" className="text-amber-700">
                                                        Catat Pengembalian
                                                    </Button>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}

                {/* Revisi Menunggu Saya */}
                {revisiMenunggu.length > 0 && (
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Revisi Menunggu Saya</CardTitle>
                            <Badge className="rounded-full bg-red-600">{revisiMenunggu.length}</Badge>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Kode Tiket</th>
                                        <th className="px-3 py-2">Pemohon</th>
                                        <th className="px-3 py-2">Catatan Revisi</th>
                                        <th className="px-3 py-2">Revisi Ke</th>
                                        <th className="px-3 py-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revisiMenunggu.map((rt) => {
                                        const cr = [...(rt.catatan_revisis ?? [])].filter((c) => !c.sudah_diproses).at(-1);
                                        return (
                                            <tr key={rt.id} className="border-t">
                                                <td className="px-3 py-2 font-semibold">
                                                    <a href={`/${prefix}/${rt.id}`} className="hover:underline">
                                                        {rt.kode_tiket}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-2">{rt.nama_pemohon}</td>
                                                <td className="px-3 py-2 text-xs text-muted-foreground">{cr?.isi_revisi ?? '-'}</td>
                                                <td className="px-3 py-2">{rt.revisi_ke}</td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button size="sm" asChild>
                                                        <a href={`/${prefix}/${rt.id}`}>Proses</a>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
{/* Smart Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Search className="size-4 text-primary" /> Smart Search — Database Admin
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input value={q} onChange={(e) => doSearch(e.target.value)} placeholder="Cari kode tiket, nama pemohon, NIK . . ." className="pl-9" />
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            {loading ? (
                                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                                    <RefreshCw className="size-4 animate-spin" /> Mencari…
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Kode Tiket</th>
                                            <th className="px-3 py-2">Pemohon</th>
                                            <th className="px-3 py-2">Jenis Permohonan</th>
                                            <th className="px-3 py-2">Bidang</th>
                                            <th className="px-3 py-2">Tanggal Masuk</th>
                                            <th className="px-3 py-2">Status</th>
                                            <th className="px-3 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searched && results.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                                                    <Search className="mx-auto mb-2 size-6" />
                                                    Tidak ditemukan berkas yang dapat di-Add
                                                    {q.trim() && ` untuk pencarian "${q.trim()}".`}
                                                    <small className="mt-1 block">
                                                        {isValidatorOrAlih
                                                            ? 'Pastikan Warkah telah menandai status sertipikat DISERAHKAN pada berkas yang dicari.'
                                                            : 'Pastikan tahap prasyarat telah selesai pada berkas yang dicari.'}
                                                    </small>
                                                </td>
                                            </tr>
                                        )}
{results.map((t) => {
                                            const taken = !!t.active && t.active.user_id !== undefined;
                                            return (
                                                <tr key={t.id} className="border-t">
                                                    <td className="px-3 py-2 font-semibold">
                                                        <a href={`/${prefix}/${t.id}`} className="hover:underline">
                                                            {t.kode_tiket}
                                                        </a>
                                                    </td>
                                                    <td className="px-3 py-2">{t.nama_pemohon}</td>
                                                    <td className="px-3 py-2 text-xs">{t.jenis}</td>
                                                    <td className="px-3 py-2">{t.jumlah_bidang}</td>
                                                    <td className="px-3 py-2">{t.tanggal_masuk}</td>
                                                    <td className="px-3 py-2">
                                                        <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        {taken ? (
                                                            <Badge variant="secondary" className="normal-case">
                                                                Diproses akun lain
                                                            </Badge>
                                                        ) : t.locked ? (
                                                            <Badge variant="secondary" className="normal-case">
                                                                Terkunci
                                                            </Badge>
                                                        ) : (
                                                            <Button size="sm" variant="outline" onClick={() => addTicket(t.id)}>
                                                                <PlusCircle className="mr-1 size-4" /> Add
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            {!searched && !loading && (
                                <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                                    <ArrowRight className="size-4" /> Ketik kata kunci untuk mencari berkas yang tersedia di Database Admin.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Antrian Aktif Saya */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <UserCheck className="size-4 text-primary" /> Antrian Aktif Saya
                        </CardTitle>
                        {activeTikets.length > 0 && <Badge className="rounded-full bg-emerald-600">{activeTikets.length}</Badge>}
                    </CardHeader>
                    <CardContent>
{activeTikets.length === 0 ? (
                            <p className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                                <Inbox className="size-8" />
                                Belum ada berkas dalam antrian Anda.
                                <small>Gunakan Smart Search di atas lalu klik <strong>Add</strong> untuk mengambil berkas dari Database Admin.</small>
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Kode Tiket</th>
                                            <th className="px-3 py-2">Pemohon</th>
                                            <th className="px-3 py-2">Jenis Permohonan</th>
                                            <th className="px-3 py-2">Di-Add</th>
                                            <th className="px-3 py-2">Status</th>
                                            <th className="px-3 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTikets.map((t) => {
                                            const p = (t.penugasans ?? []).find((pp) => pp.status === 'proses');
                                            return (
                                                <tr key={t.id} className="border-t">
                                                    <td className="px-3 py-2 font-semibold">
                                                        <a href={`/${prefix}/${t.id}`} className="hover:underline">
                                                            {t.kode_tiket}
                                                        </a>
                                                    </td>
                                                    <td className="px-3 py-2">{t.nama_pemohon}</td>
                                                    <td className="px-3 py-2 text-xs">{t.jenis_permohonan?.nama}</td>
                                                    <td className="px-3 py-2 text-xs">{p?.tanggal_add ?? '-'}</td>
                                                    <td className="px-3 py-2">
                                                        <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <Button size="sm" asChild>
                                                            <a href={`/${prefix}/${t.id}`}>Proses</a>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
{/* Riwayat Diproses */}
                {history.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <History className="size-4 text-primary" /> Riwayat Diproses (Terakhir)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Kode Tiket</th>
                                        <th className="px-3 py-2">Pemohon</th>
                                        <th className="px-3 py-2">Status Penugasan</th>
                                        <th className="px-3 py-2 text-right">Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((t) => {
                                        const p = (t.penugasans ?? []).at(-1);
                                        return (
                                            <tr key={t.id} className="border-t">
                                                <td className="px-3 py-2 font-semibold">
                                                    <a href={`/${prefix}/${t.id}`} className="hover:underline">
                                                        {t.kode_tiket}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-2">{t.nama_pemohon}</td>
                                                <td className="px-3 py-2">
                                                    <StatusBadge badge={p?.status === 'selesai' ? 'success' : p?.status === 'proses' ? 'warning' : 'secondary'}>
                                                        {p?.status ?? '-'}
                                                    </StatusBadge>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <a href={`/${prefix}/${t.id}`}>Detail</a>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}