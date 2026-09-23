import { type SmartRiwayatStatus } from '@/types';
import { Clock } from 'lucide-react';

function formatDateTime(value?: string | null): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export function Timeline({ riwayatStatuses }: { riwayatStatuses?: SmartRiwayatStatus[] }) {
    const rows = riwayatStatuses ?? [];
    return (
        <div className="mb-4 rounded-lg border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <Clock className="size-4 text-primary" />
                <h6 className="font-bold">Riwayat Timeline</h6>
            </div>
            <div className="px-4 py-4">
                {rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>
                ) : (
                    <ol className="relative border-l border-border pl-5 space-y-4">
                        {rows.map((r, i) => (
                            <li key={r.id ?? i} className="relative">
                                <span className="absolute -left-[27px] flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {i + 1}
                                </span>
                                <div className="text-sm font-semibold">
                                    {r.stage_dari} → {r.stage_ke}
                                </div>
                                <div className="text-xs text-muted-foreground">{r.keterangan}</div>
                                <div className="text-[11px] text-muted-foreground/70">
                                    {r.user?.name ?? 'Sistem'} &bull; {formatDateTime(r.created_at)}
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}