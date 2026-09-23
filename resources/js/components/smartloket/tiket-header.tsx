import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/smartloket/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { type SmartTiket } from '@/types';
import { Ticket } from 'lucide-react';

function formatDate(value?: string | null): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function ProgresPill({ label, status }: { label: string; status?: string | null }) {
    const tone =
        status === 'selesai'
            ? 'text-emerald-600'
            : status === 'proses'
              ? 'text-amber-600'
              : 'text-muted-foreground';
    return (
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs">
            {label}: <span className={`font-semibold uppercase ${tone}`}>{status ?? 'menunggu'}</span>
        </span>
    );
}

export function TiketHeader({ tiket }: { tiket: SmartTiket }) {
    return (
        <Card className="mb-4">
            <CardContent className="space-y-4 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h5 className="flex items-center gap-2 font-bold">
                                <Ticket className="size-4 text-primary" />
                                {tiket.kode_tiket}
                            </h5>
                            <StatusBadge badge={tiket.status_badge}>{tiket.status_label}</StatusBadge>
                            {tiket.status_pembetulan !== 'P0' && (
                                <Badge variant="outline" className="uppercase">
                                    {tiket.status_pembetulan}
                                </Badge>
                            )}
                            {tiket.diserahkan_ke_validator && (
                                <Badge className="uppercase">
                                    <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Diserahkan ke Validator
                                </Badge>
                            )}
                        </div>
                        <small className="block text-muted-foreground">
                            Revisi ke-{tiket.revisi_ke} &bull; Masuk {formatDate(tiket.tanggal_masuk)}
                        </small>
                    </div>
                    <div className="text-left md:text-right">
                        <small className="block text-muted-foreground">Jenis Permohonan</small>
                        <strong>{tiket.jenis_permohonan?.nama ?? '-'}</strong>
                        <div className="mt-1 flex gap-2">
                            <ProgresPill label="BT" status={tiket.status_pra_btel} />
                            <ProgresPill label="SU" status={tiket.status_pra_suel} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                        {[
                            ['Pemohon', tiket.nama_pemohon],
                            ['NIK', tiket.nik_pemohon ?? '-'],
                            ['No. HP', tiket.no_hp_pemohon],
                            ['Email', tiket.email_pemohon ?? '-'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between border-b py-1 text-sm">
                                <small className="text-muted-foreground">{label}</small>
                                <strong className="text-right">{value}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-1">
                        {[
                            ['Hak Sekarang', tiket.no_hak_sekarang ?? '-'],
                            ['Kelurahan', tiket.kelurahan_desa ?? '-'],
                            ['Kecamatan', tiket.kecamatan ?? '-'],
                            ['Jumlah Bidang', String(tiket.jumlah_bidang)],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between border-b py-1 text-sm">
                                <small className="text-muted-foreground">{label}</small>
                                <strong className="text-right">{value}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                {tiket.keterangan && (
                    <div className="flex items-start gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                        <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                        {tiket.keterangan}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}