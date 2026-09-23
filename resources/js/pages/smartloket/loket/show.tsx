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
import { AlertTriangle, Pencil, Receipt, Send, CheckSquare, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LoketShow({ tiket }: { tiket: SmartTiket }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Loket Penerimaan', href: '/loket' },
        { title: tiket.kode_tiket, href: `/loket/${tiket.id}` },
    ];
    const revisiAktif = (tiket.catatan_revisis ?? []).filter((c) => !c.sudah_diproses);
    const [catatan_perbaikan, setCatatanPerbaikan] = useState('');
    const proposer = tiket.petugas_loket ?? null;
    const returnTo = tiket.status === 'dikembalikan';

    const resubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/loket/${tiket.id}/resubmit`, { catatan_perbaikan }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Berkas ${tiket.kode_tiket}`} />
            <div className="flex h-full flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">Detail Berkas</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <a href={`/loket/${tiket.id}/edit`}>
                                <Pencil className="mr-1 size-4" /> Edit Data
                            </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <a href={`/loket/${tiket.id}/print-receipt`} target="_blank" rel="noopener noreferrer">
                                <Receipt className="mr-1 size-4" /> Cetak Tanda Terima
                            </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                            <a href={`/loket/${tiket.id}/print-checklist`} target="_blank" rel="noopener noreferrer">
                                <CheckSquare className="mr-1 size-4" /> Cetak Checklist
                            </a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <a href={`/tracking/${tiket.kode_tiket}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1 size-4" /> Lacak
                            </a>
                        </Button>
                    </div>
                </div>

                <FlashMessages />
                <TiketHeader tiket={tiket} />
{returnTo && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-700 dark:text-red-300">
                        <AlertTriangle className="mt-0.5 size-5" />
                        <div className="flex-1">
                            <h6 className="font-bold">Berkas Dikembalikan untuk Perbaikan Revisi</h6>
                            {revisiAktif.length === 0 && <p className="text-sm">Berkas dikembalikan. Pastikan perbaikan dari pemohon sudah diterima lalu kirim ulang.</p>}
                            {revisiAktif.map((r) => (
                                <div key={r.id} className="mb-2 text-sm">
                                    <strong>
                                        {r.dari_stage} → {r.ke_stage}
                                    </strong>
                                    <div>{r.isi_revisi}</div>
                                    <span className="text-xs opacity-70">
                                        Revisi ke-{r.revisi_ke ?? 1} • Masuk {r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {returnTo && revisiAktif.length > 0 && (
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="text-base">Kirim Ulang Hasil Perbaikan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={resubmit} className="space-y-3">
                                <textarea
                                    rows={3}
                                    value={catatan_perbaikan}
                                    onChange={(e) => setCatatanPerbaikan(e.target.value)}
                                    placeholder="Sebutkan perbaikan yang telah dilakukan oleh pemohon..."
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                                    <Send className="mr-1 size-4" /> Kirim Ulang ke Tahap Berikutnya
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
<div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Persyaratan Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            {(tiket.jenis_permohonan?.persyaratan_dokumens?.length ?? 0) === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada daftar persyaratan untuk {tiket.jenis_permohonan?.nama ?? 'jenis permohonan ini'}.
                                </p>
                            ) : (
                                <ul className="divide-y">
                                    {tiket.jenis_permohonan?.persyaratan_dokumens?.map((d, i) => (
                                        <li key={d.id} className="flex items-center justify-between py-2">
                                            <div>
                                                <span className="text-sm font-medium">
                                                    {i + 1}. {d.nama_dokumen}
                                                </span>
                                                {d.keterangan && <div className="text-xs text-muted-foreground">{d.keterangan}</div>}
                                            </div>
                                            <Badge variant={d.wajib ? 'destructive' : 'secondary'} className="uppercase">
                                                {d.wajib ? 'Wajib' : 'Opsional'}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Petugas & Penugasan</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex justify-between border-b py-1">
                                <small className="text-muted-foreground">Petugas Loket</small>
                                <strong>{proposer?.name ?? '-'}</strong>
                            </div>
                            {(tiket.penugasans ?? []).length === 0 ? (
                                <p className="pt-1 text-sm text-muted-foreground">Belum ada penugasan ke tahap lain.</p>
                            ) : (
                                [...(tiket.penugasans ?? [])]
                                    .sort((a, b) => b.id - a.id)
                                    .map((p) => (
                                        <div key={p.id} className="flex items-center justify-between border-b py-2">
                                            <div>
                                                <span className="block text-sm font-medium">{p.stage}</span>
                                                <small className="text-muted-foreground">{p.user?.name ?? '-'}</small>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={p.status === 'selesai' ? 'default' : p.status === 'proses' ? 'secondary' : 'outline'}>
                                                    {p.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <BidangTable bidangTanahs={tiket.bidang_tanahs} />
                <Timeline riwayatStatuses={tiket.riwayat_statuses} />
            </div>
        </AppLayout>
    );
}