import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { TiketHeader } from '@/components/smartloket/tiket-header';
import { BidangTable } from '@/components/smartloket/bidang-table';
import { Timeline } from '@/components/smartloket/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Archive } from 'lucide-react';

interface PenugasanRow {
    id: number;
    stage: string;
    stage_label?: string;
    status: string;
    catatan?: string | null;
    tanggal_add?: string | null;
    user?: { id: number; name: string } | null;
}

export default function AdminShow({ tiket, penugasanPerStage, folders }: {
    tiket: SmartTiket;
    penugasanPerStage: PenugasanRow[];
    folders: Array<{ id: number; nama_folder: string; jenis_dokumen?: string | null }>;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: tiket.kode_tiket, href: `/admin/tiket/${tiket.id}` },
    ];
    const [openArsip, setOpenArsip] = useState(false);
    const [folder_id, setFolder] = useState('');
    const [nama_arsip, setNama] = useState('');
    const [tipe, setTipe] = useState('');

    const submitArsip = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/tiket/${tiket.id}/arsipkan`, { folder_id, nama_arsip, tipe }, { onSuccess: () => setOpenArsip(false) });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Berkas ${tiket.kode_tiket}`} />
            <div className="flex h-full flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">Detail Berkas ({tiket.kode_tiket})</h1>
                    <Button size="sm" onClick={() => setOpenArsip(true)} disabled={tiket.status !== 'selesai'}>
                        <Archive className="mr-1 size-4" /> Arsipkan Berkas
                    </Button>
                </div>

                <FlashMessages />
                <TiketHeader tiket={tiket} />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Penugasan per Tahap (Catatan Final)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {penugasanPerStage.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada penugasan.</p>
                        ) : (
                            penugasanPerStage.map((p) => (
                                <div key={p.id} className="flex items-center justify-between gap-3 border-b py-2">
                                    <div>
                                        <span className="text-sm font-medium">{p.stage_label ?? p.stage}</span>
                                        <small className="block text-muted-foreground">{p.user?.name ?? '-'}</small>
                                        {p.catatan && <small className="block text-xs text-primary">{p.catatan}</small>}
                                    </div>
                                    <Badge variant={p.status === 'selesai' ? 'default' : p.status === 'proses' ? 'secondary' : 'outline'}>
                                        {p.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <BidangTable bidangTanahs={tiket.bidang_tanahs} />
                <Timeline riwayatStatuses={tiket.riwayat_statuses} />
            </div>

            {openArsip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpenArsip(false)}>
                    <form onSubmit={submitArsip} className="w-full max-w-md rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h6 className="mb-3 font-bold">Arsipkan {tiket.kode_tiket}</h6>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">Folder <span className="text-red-500">*</span></label>
                            <select value={folder_id} onChange={(e) => setFolder(e.target.value)} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                                <option value="">— Pilih —</option>
                                {folders.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.nama_folder}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">Nama Arsip <span className="text-red-500">*</span></label>
                            <input value={nama_arsip} onChange={(e) => setNama(e.target.value)} required maxLength={200} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                        </div>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">Tipe Dokumen</label>
                            <input value={tipe} onChange={(e) => setTipe(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenArsip(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                <Archive className="mr-1 size-4" /> Arsipkan
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}
