import AppLayout from '@/layouts/app-layout';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { SortableTh } from '@/components/smartloket/sortable-th';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { sortRows, type SortDir } from '@/lib/sort';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    lock_reason?: string | null;
}

export default function StageSearch({ tikets, search, stageLabel, routeBase }: {
    tikets: SearchRow[];
    search: string | null;
    stageLabel: string;
    routeBase: string;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: stageLabel, href: `/${routeBase}` },
        { title: 'Hasil Pencarian', href: `/${routeBase}/search` },
    ];

    const [sort, setSort] = useState<{ key: string; dir: SortDir }>({ key: 'kode_tiket', dir: 'asc' });
    const sorted = useMemo(() => sortRows(tikets, sort.key, sort.dir), [tikets, sort]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Hasil Pencarian — ${stageLabel}`} />
            <div className="flex flex-1 flex-col gap-4 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Hasil Pencarian</h1>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <SortableTh label="Kode Tiket" sortKey="kode_tiket" current={sort.key} dir={sort.dir} onSort={(key, d) => setSort({ key, dir: d })} />
                                <SortableTh label="Pemohon" sortKey="nama_pemohon" current={sort.key} dir={sort.dir} onSort={(key, d) => setSort({ key, dir: d })} />
                                <SortableTh label="Jenis" sortKey="jenis" current={sort.key} dir={sort.dir} onSort={(key, d) => setSort({ key, dir: d })} />
                                <SortableTh label="Bidang" sortKey="jumlah_bidang" current={sort.key} dir={sort.dir} onSort={(key, d) => setSort({ key, dir: d })} />
                                <SortableTh label="Status" sortKey="status_label" current={sort.key} dir={sort.dir} onSort={(key, d) => setSort({ key, dir: d })} />
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tikets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                        Tidak ada hasil{search ? ` untuk "${search}"` : ''}.
                                    </td>
                                </tr>
                            )}
                            {sorted.map((t) => (
                                <tr key={t.id} className="border-t">
                                    <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                    <td className="px-3 py-2">{t.nama_pemohon}</td>
                                    <td className="px-3 py-2 text-xs">{t.jenis}</td>
                                    <td className="px-3 py-2">{t.jumlah_bidang}</td>
                                    <td className="px-3 py-2">
                                        <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        {t.locked ? (
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant="secondary" className="normal-case">
                                                    <Lock className="mr-1 size-3" /> Terkunci
                                                </Badge>
                                                {t.lock_reason && (
                                                    <small className="max-w-[230px] text-right text-xs text-muted-foreground">{t.lock_reason}</small>
                                                )}
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`/${routeBase}/${t.id}`}>Detail</a>
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}