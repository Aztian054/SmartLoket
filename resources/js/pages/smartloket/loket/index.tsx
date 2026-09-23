import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { LoketTiketModal } from '@/components/smartloket/forms/loket-tiket-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartJenisPermohonan, type SmartTiket } from '@/types';
import { type Paginated } from './types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart3, Inbox, PlusCircle, Receipt, RotateCcw, Search } from 'lucide-react';

interface LoketIndexProps {
    tikets: Paginated<SmartTiket>;
    revisiBelumDiproses: SmartTiket[];
    jenisPermohonans: SmartJenisPermohonan[];
    jenisHaks: Array<{ id: number; kode: string; nama: string }>;
    filters: { q?: string; status?: string };
}

const STATUS_OPTS: Array<[string, string]> = [
    ['diterima', 'Diterima'],
    ['verifikasi', 'Verifikasi'],
    ['warkah', 'Warkah'],
    ['validasi_btel', 'Validasi BT'],
    ['validasi_suel', 'Validasi SU'],
    ['alih_media_btel', 'Alih Media BT'],
    ['alih_media_suel', 'Alih Media SU'],
    ['selesai', 'Selesai'],
    ['dikembalikan', 'Revisi'],
    ['batal', 'Batal'],
];

export default function LoketIndex({ tikets, revisiBelumDiproses, jenisPermohonans, jenisHaks, filters }: LoketIndexProps) {
    const [openModal, setOpenModal] = useState(false);
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Loket Penerimaan', href: '/loket' }];

    const totalSaya = tikets.total;
    const diproses = tikets.data.filter((t) => !['selesai', 'batal'].includes(t.status)).length;
    const selesaiSaya = tikets.data.filter((t) => t.status === 'selesai').length;
    const revisiPending = revisiBelumDiproses.length;

    const filter = () => router.get('/loket', { q, status });
    const reset = () => {
        setQ('');
        setStatus('');
        router.get('/loket');
    };

    const stats = [
        { label: 'Total Berkas Saya', value: totalSaya, tone: 'text-primary', icon: BarChart3 },
        { label: 'Dalam Proses', value: diproses, tone: 'text-amber-600', icon: RotateCcw },
        { label: 'Selesai', value: selesaiSaya, tone: 'text-emerald-600', icon: BarChart3 },
        { label: 'Revisi Pending', value: revisiPending, tone: 'text-red-600', icon: BarChart3 },
    ];
return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Loket Penerimaan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Loket Penerimaan</h1>
                        <p className="text-muted-foreground">Daftar berkas yang Anda daftarkan / Anda pegang.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setOpenModal(true)}>
                            <PlusCircle className="mr-1 size-4" /> Daftarkan Tiket Baru
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/reports">Rekap Laporan</a>
                        </Button>
                    </div>
                </div>

                <FlashMessages />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => (
                        <Card key={s.label} className="border-l-4 border-l-primary">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold uppercase text-muted-foreground">{s.label}</div>
                                        <div className={`text-3xl font-bold ${s.tone}`}>{s.value.toLocaleString('id-ID')}</div>
                                    </div>
                                    <s.icon className="size-8 text-primary/30" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {revisiBelumDiproses.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                        <strong>{revisiBelumDiproses.length} berkas revisi masih menunggu diproses.</strong>
                        Perbaikan dari pemohon perlu dikirim ulang ke tahap asal.
                        {revisiBelumDiproses.map((rt) => (
                            <a key={rt.id} href={`/loket/${rt.id}`} className="rounded-full border border-red-300 px-3 py-1 text-xs hover:bg-red-100">
                                {rt.kode_tiket}
                            </a>
                        ))}
                    </div>
                )}
<Card>
                    <CardHeader className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="text-base">Daftar Berkas Penerimaan</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode tiket / nama / NIK..." className="w-56" />
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                                <option value="">Semua Status</option>
                                {STATUS_OPTS.map(([v, l]) => (
                                    <option key={v} value={v}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                            <Button size="sm" onClick={filter}>
                                <Search className="mr-1 size-4" /> Filter
                            </Button>
                            {(q || status) && (
                                <Button size="sm" variant="outline" onClick={reset}>
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        {tikets.data.length === 0 ? (
                            <p className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                                <Inbox className="size-10" />
                                Belum ada berkas.{' '}
                                <button className="text-primary underline" onClick={() => setOpenModal(true)}>
                                    Daftarkan tiket pertama
                                </button>
                            </p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Kode Tiket</th>
                                        <th className="px-3 py-2">Pemohon</th>
                                        <th className="px-3 py-2">Jenis</th>
                                        <th className="px-3 py-2 text-center">Bidang</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Tgl Masuk</th>
                                        <th className="px-3 py-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
{tikets.data.map((t) => (
                                        <tr key={t.id} className="border-t">
                                            <td className="px-3 py-2 font-semibold">
                                                <a href={`/loket/${t.id}`} className="hover:underline">
                                                    {t.kode_tiket}
                                                </a>
                                                {t.status === 'dikembalikan' && (
                                                    <Badge variant="destructive" className="ml-1 mt-1 block w-fit normal-case">
                                                        Revisi
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="font-medium">{t.nama_pemohon}</div>
                                                <small className="text-muted-foreground">
                                                    {t.nik_pemohon ?? '-'} • {t.no_hp_pemohon ?? '-'}
                                                </small>
                                            </td>
                                            <td className="px-3 py-2">
                                                <Badge variant="outline">{t.jenis_permohonan?.kode}</Badge>
                                                <small className="block max-w-[160px] truncate text-muted-foreground">{t.jenis_permohonan?.nama}</small>
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <Badge variant="secondary">{t.jumlah_bidang}</Badge>
                                            </td>
                                            <td className="px-3 py-2">
                                                <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                            </td>
                                            <td className="px-3 py-2 text-xs">
                                                {t.tanggal_masuk ? new Date(t.tanggal_masuk).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <a href={`/loket/${t.id}`} className="mr-1 inline-block rounded border px-2 py-1 hover:bg-muted" title="Detail">
                                                    <Search className="size-3" />
                                                </a>
                                                <a href={`/loket/${t.id}/print-receipt`} target="_blank" rel="noopener noreferrer" className="inline-block rounded border px-2 py-1 hover:bg-muted" title="Cetak tanda terima">
                                                    <Receipt className="size-3" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
{tikets.links && tikets.links.length > 3 && (
                    <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
                        <span>
                            Menampilkan {tikets.from ?? 0}–{tikets.to ?? 0} dari {tikets.total} berkas
                        </span>
                        <div className="flex gap-1">
                            {tikets.links.map((l, i) => (
                                <a
                                    key={i}
                                    href={l.url ?? '#'}
                                    className={`rounded border px-2 py-1 text-xs ${l.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <LoketTiketModal open={openModal} onClose={() => setOpenModal(false)} jenisPermohonans={jenisPermohonans} jenisHaks={jenisHaks} />
        </AppLayout>
    );
}