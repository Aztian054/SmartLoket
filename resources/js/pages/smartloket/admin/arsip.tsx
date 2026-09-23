import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Archive } from 'lucide-react';

interface FolderRow {
    id: number;
    nama_folder: string;
    jenis_dokumen?: string | null;
    lokasi_fisik?: string | null;
    arsip_tikets_count?: number;
}

export default function AdminArsip({ folders }: { folders: FolderRow[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: 'Arsip (Penataan)', href: '/admin/arsip' },
    ];
    const [open, setOpen] = useState(false);
    const [nama_folder, setNama] = useState('');
    const [jenis_dokumen, setJenis] = useState('');
    const [lokasi_fisik, setLokasi] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/arsip', { nama_folder, jenis_dokumen, lokasi_fisik }, { onSuccess: () => setOpen(false) });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arsip Folder" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Archive className="size-5 text-primary" /> Manajemen Folder Arsip
                        </h1>
                        <p className="text-muted-foreground">Penataan arsip fisik berkas selesai.</p>
                    </div>
                    <Button onClick={() => setOpen(true)}>Tambah Folder</Button>
                </div>

                <FlashMessages />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {folders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada folder arsip.</p>
                    ) : (
                        folders.map((f) => (
                            <Card key={f.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{f.nama_folder}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm">
                                    <p className="mb-0">
                                        <span className="text-muted-foreground">Jenis:</span> {f.jenis_dokumen ?? '-'}
                                    </p>
                                    <p className="mb-0">
                                        <span className="text-muted-foreground">Lokasi:</span> {f.lokasi_fisik ?? '-'}
                                    </p>
                                    <Badge variant="secondary">{f.arsip_tikets_count ?? 0} berkas</Badge>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
                    <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h6 className="mb-3 font-bold">Tambah Folder Arsip</h6>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">
                                Nama Folder <span className="text-red-500">*</span>
                            </label>
                            <input value={nama_folder} onChange={(e) => setNama(e.target.value)} required maxLength={200} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                        </div>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">Jenis Dokumen</label>
                            <input value={jenis_dokumen} onChange={(e) => setJenis(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                        </div>
                        <div className="mb-3 space-y-1">
                            <label className="text-sm font-medium">Lokasi Fisik</label>
                            <input value={lokasi_fisik} onChange={(e) => setLokasi(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}