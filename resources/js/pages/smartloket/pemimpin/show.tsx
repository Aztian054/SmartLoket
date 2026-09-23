import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { TiketHeader } from '@/components/smartloket/tiket-header';
import { BidangTable } from '@/components/smartloket/bidang-table';
import { Timeline } from '@/components/smartloket/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, ExternalLink, Receipt } from 'lucide-react';

export default function PemimpinShow({ tiket }: { tiket: SmartTiket }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Monitoring & Evaluasi', href: '/pemimpin' },
        { title: tiket.kode_tiket, href: `/pemimpin/tiket/${tiket.id}` },
    ];
    const proposer = tiket.petugas_loket ?? null;
    const persyaratans = tiket.jenis_permohonan?.persyaratan_dokumens ?? [];
    const penugasans = [...(tiket.penugasans ?? [])].sort((a, b) => b.id - a.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Berkas ${tiket.kode_tiket}`} />
            <div className="flex h-full flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold tracking-tight">Detail Berkas</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                            <a href={`/loket/${tiket.id}/print-receipt`} target="_blank" rel="noopener noreferrer">
                                <Receipt className="mr-1 size-4" /> Cetak Tanda Terima
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

                {tiket.status === 'dikembalikan' && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-700 dark:text-red-300">
                        <AlertTriangle className="mt-0.5 size-5" />
                        <div>
                            <h6 className="font-bold">Berkas Dikembalikan untuk Perbaikan Revisi</h6>
                            <p className="text-sm">Berkas sedang menunggu perbaikan dari pemohon sebelum dikirim ulang oleh petugas loket.</p>
                        </div>
                    </div>
                )}
<div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Persyaratan Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            {persyaratans.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada daftar persyaratan untuk jenis permohonan ini.</p>
                            ) : (
                                persyaratans.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between border-b py-2">
                                        <span className="text-sm">{d.nama_dokumen}</span>
                                        <Badge variant={d.wajib ? 'destructive' : 'secondary'} className="uppercase">
                                            {d.wajib ? 'Wajib' : 'Opsional'}
                                        </Badge>
                                    </div>
                                ))
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
                            {penugasans.length === 0 ? (
                                <p className="pt-1 text-sm text-muted-foreground">Belum ada penugasan ke tahap lain.</p>
                            ) : (
                                penugasans.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between border-b py-2">
                                        <div>
                                            <span className="block text-sm font-medium">{p.stage_label ?? p.stage}</span>
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