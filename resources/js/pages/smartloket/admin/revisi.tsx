import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { type Paginated } from '../loket/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';

export default function AdminRevisi({ tikets, filters }: { tikets: Paginated<SmartTiket>; filters: { q?: string } }) {
    const [q, setQ] = useState(filters.q ?? '');
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: 'Revisi Berkas', href: '/admin/revisi' },
    ];
    const hapus = (id: number) => {
        if (!confirm('Hapus revisi ini dan kembalikan berkas ke DB Admin?')) return;
        router.post(`/admin/revisi/${id}/hapus`, {});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revisi Berkas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <RotateCcw className="size-5 text-primary" /> Revisi Berkas
                </h1>
                <FlashMessages />
                <div className="flex gap-2">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode/nama..." className="w-64" />
                    <Button size="sm" onClick={() => router.get('/admin/revisi', { q })}>
                        Filter
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">Kode Tiket</th>
                                <th className="px-3 py-2">Pemohon</th>
                                <th className="px-3 py-2">Catatan Revisi</th>
                                <th className="px-3 py-2">Petugas Loket</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tikets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                        Tidak ada berkas revisi.
                                    </td>
                                </tr>
                            ) : (
                                tikets.data.map((t) => {
                                    const cr = [...(t.catatan_revisis ?? [])].filter((c) => !c.sudah_diproses).at(-1);
                                    return (
                                        <tr key={t.id} className="border-t">
                                            <td className="px-3 py-2 font-semibold">{t.kode_tiket}</td>
                                            <td className="px-3 py-2">{t.nama_pemohon}</td>
                                            <td className="px-3 py-2 text-xs">{cr?.isi_revisi ?? '-'}</td>
                                            <td className="px-3 py-2 text-xs">{t.petugas_loket?.name ?? '-'}</td>
                                            <td className="px-3 py-2">
                                                <StatusBadge badge={t.status_badge}>{t.status_label}</StatusBadge>
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => hapus(t.id)}>
                                                    <Trash2 className="mr-1 size-4" /> Hapus
                                                </Button>
                                                <Badge variant="secondary" className="ml-1">
                                                    P{t.revisi_ke}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}