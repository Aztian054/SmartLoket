import AppLayout from '@/layouts/app-layout';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
}

export default function StageSearch({ tikets, search, stage, stageLabel, routeBase }: {
    tikets: SearchRow[];
    search: string | null;
    stage: string;
    stageLabel: string;
    routeBase: string;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: stageLabel, href: `/${routeBase}` },
        { title: 'Hasil Pencarian', href: `/${routeBase}/search` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Hasil Pencarian — ${stageLabel}`} />
            <div className="flex flex-1 flex-col gap-4 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Hasil Pencarian</h1>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">Kode Tiket</th>
                                <th className="px-3 py-2">Pemohon</th>
                                <th className="px-3 py-2">Jenis</th>
                                <th className="px-3 py-2">Bidang</th>
                                <th className="px-3 py-2">Status</th>
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
                            {tikets.map((t) => (
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
                                            <Badge variant="secondary">Terkunci</Badge>
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