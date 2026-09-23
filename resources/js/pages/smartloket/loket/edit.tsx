import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Save } from 'lucide-react';

const inputCls = 'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm';

export default function LoketEdit({ tiket }: { tiket: SmartTiket }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Loket Penerimaan', href: '/loket' },
        { title: tiket.kode_tiket, href: `/loket/${tiket.id}` },
        { title: 'Edit', href: `/loket/${tiket.id}/edit` },
    ];
    const [nama_pemohon, setNama] = useState(tiket.nama_pemohon);
    const [nik_pemohon, setNik] = useState(tiket.nik_pemohon ?? '');
    const [no_hp_pemohon, setHp] = useState(tiket.no_hp_pemohon);
    const [email_pemohon, setEmail] = useState(tiket.email_pemohon ?? '');
    const [no_hak_sekarang, setHak] = useState(tiket.no_hak_sekarang ?? '');
    const [kelurahan_desa, setKelurahan] = useState(tiket.kelurahan_desa ?? '');
    const [kecamatan, setKecamatan] = useState(tiket.kecamatan ?? '');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            `/loket/${tiket.id}`,
            { nama_pemohon, nik_pemohon, no_hp_pemohon, email_pemohon, no_hak_sekarang, kelurahan_desa, kecamatan },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Berkas ${tiket.kode_tiket}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                    <Pencil className="size-5 text-primary" /> Edit Data Berkas
                </h1>

                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-4 py-2 text-sm">
                    <strong>{tiket.kode_tiket}</strong>
                    <StatusBadge badge={tiket.status_badge}>{tiket.status_label}</StatusBadge>
                    <span>• {tiket.jenis_permohonan?.nama ?? '-'}</span>
                    <span>• Jumlah bidang: <strong>{tiket.jumlah_bidang}</strong></span>
                    <span>• Masuk: {tiket.tanggal_masuk ? new Date(tiket.tanggal_masuk).toLocaleDateString('id-ID') : '-'}</span>
                </div>

                <FlashMessages />
<Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Pemohon & Berkas</CardTitle>
                        <p className="text-sm text-muted-foreground">Kode tiket, jenis permohonan, dan data bidang tanah tidak dapat diubah lewat halaman ini.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label>Nama Pemohon <span className="text-red-500">*</span></Label>
                                    <input value={nama_pemohon} onChange={(e) => setNama(e.target.value)} required maxLength={200} className={inputCls} />
                                </div>
                                <div className="space-y-1">
                                    <Label>NIK Pemohon</Label>
                                    <input value={nik_pemohon} onChange={(e) => setNik(e.target.value)} maxLength={20} className={inputCls} />
                                </div>
                                <div className="space-y-1">
                                    <Label>No. HP Pemohon <span className="text-red-500">*</span></Label>
                                    <input value={no_hp_pemohon} onChange={(e) => setHp(e.target.value)} required maxLength={20} className={inputCls} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Email Pemohon <span className="text-red-500">*</span></Label>
                                    <input type="email" value={email_pemohon} onChange={(e) => setEmail(e.target.value)} required maxLength={150} className={inputCls} />
                                    <small className="text-muted-foreground">Dipakai untuk mengirim notifikasi + file revisi otomatis.</small>
                                </div>
                                <div className="space-y-1">
                                    <Label>No. Hak Sekarang</Label>
                                    <input value={no_hak_sekarang} onChange={(e) => setHak(e.target.value)} maxLength={100} className={inputCls} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Kelurahan / Desa</Label>
                                    <input value={kelurahan_desa} onChange={(e) => setKelurahan(e.target.value)} maxLength={100} className={inputCls} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Kecamatan</Label>
                                    <input value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} maxLength={100} className={inputCls} />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Save className="mr-1 size-4" /> Simpan Perubahan
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <a href={`/loket/${tiket.id}`}>Batal</a>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}