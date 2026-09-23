import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { TiketHeader } from '@/components/smartloket/tiket-header';
import { BidangTable } from '@/components/smartloket/bidang-table';
import { Timeline } from '@/components/smartloket/timeline';
import { StageActions } from '@/components/smartloket/stage-actions';
import { VerifikatorForm } from '@/components/smartloket/forms/verifikator-form';
import { ValidatorForm } from '@/components/smartloket/forms/validator-form';
import { AlihMediaForm } from '@/components/smartloket/forms/alih-media-form';
import { WarkahForm, type LembarWarkah } from '@/components/smartloket/forms/warkah-form';
import { type BreadcrumbItem, type SmartTiket } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Info } from 'lucide-react';

interface ShowProps {
    tiket: SmartTiket;
    stage: string;
    stageLabel: string;
    routeBase: string;
    isActive: boolean;
    mine: boolean;
    canSelesai: boolean;
    canKonfirmasiKembali?: boolean;
    alihMediaSelesai?: { alih_media_btel: boolean; alih_media_suel: boolean };
    lembar?: LembarWarkah | Record<string, unknown> | null;
    templateKoreksis?: Array<{ id: number; nama_dokumen_kurang: string }>;
    validatorUsers?: Array<{ id: number; name: string; role: string }>;
}

export default function Show({ tiket, stage, stageLabel, routeBase, isActive, mine, canSelesai, canKonfirmasiKembali, alihMediaSelesai, lembar, templateKoreksis, validatorUsers }: ShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: stageLabel, href: `/${routeBase}` },
        { title: `Detail ${tiket.kode_tiket}`, href: `/${routeBase}/${tiket.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Berkas ${tiket.kode_tiket}`} />
            <div className="flex h-full flex-1 flex-col gap-3 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Detail Berkas {tiket.kode_tiket}</h1>

                <FlashMessages />

                {isActive && !mine && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="mt-0.5 size-4" />
                        Berkas ini sedang diproses oleh akun lain pada tahap {stageLabel}.
                    </div>
                )}

                <TiketHeader tiket={tiket} />

                {mine && <StageActions tiket={tiket} stage={stage} routeBase={routeBase} canSelesai={canSelesai} />}

                <BidangTable bidangTanahs={tiket.bidang_tanahs} />

                {isActive && mine && stage === 'verifikasi' && (
                    <FormCard title="Hasil Pemeriksaan Verifikator">
                        <VerifikatorForm
                            routeBase={routeBase}
                            tiketId={tiket.id}
                            existing={lembar as never}
                            templateKoreksis={templateKoreksis}
                        />
                    </FormCard>
                )}

                {isActive && mine && stage === 'warkah' && (
                    <WarkahForm
                        tiket={tiket}
                        lembar={(lembar ?? {}) as LembarWarkah}
                        validatorUsers={validatorUsers ?? []}
                        canKonfirmasiKembali={canKonfirmasiKembali ?? false}
                        alihMediaSelesai={alihMediaSelesai}
                    />
                )}

                {(stage === 'validasi_btel' || stage === 'validasi_suel') && isActive && mine && (
                    <FormCard title={stage === 'validasi_btel' ? 'Lembar Validasi Pra-Buku Tanah Elektronik' : 'Lembar Validasi Pra-Surat Ukur Elektronik'}>
                        <ValidatorForm routeBase={routeBase} tiketId={tiket.id} su={stage === 'validasi_suel'} existing={(lembar ?? {}) as never} />
                    </FormCard>
                )}

                {(stage === 'alih_media_btel' || stage === 'alih_media_suel') && isActive && mine && (
                    <FormCard title={stage === 'alih_media_btel' ? 'Lembar Kerja Alih Media BT' : 'Lembar Kerja Alih Media SU'}>
                        <AlihMediaForm routeBase={routeBase} tiketId={tiket.id} su={stage === 'alih_media_suel'} existing={(lembar ?? {}) as never} />
                    </FormCard>
                )}

                {!isActive && (
                    <p className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                        <Info className="size-4" /> Berkas belum di-Add ke antrian Anda pada tahap ini.
                    </p>
                )}

                <Timeline riwayatStatuses={tiket.riwayat_statuses} />
            </div>
        </AppLayout>
    );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4 rounded-lg border">
            <div className="border-b bg-muted/40 px-4 py-3">
                <h6 className="font-bold">{title}</h6>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}