import { cn } from '@/lib/utils';

/**
 * Kop surat resmi — Kantor Pertanahan Kota Bandar Lampung (Kementerian ATR/BPN).
 * Dipakai pada halaman cetak (tanda terima, checklist, form perbaikan, laporan).
 */
export function KopSurat({ subtitle, className }: { subtitle?: string; className?: string }) {
    return (
        <div className={cn('font-serif text-black', className)}>
            <style>{`
                .kop-line {
                    border-bottom: 3px double #222;
                }
            `}</style>
            <div className="kop-line mb-4 flex items-center gap-3 pb-1.5">
                <div className="shrink-0">
                    <img src="/images/logobpn2026.png" alt="Logo Kementerian ATR/BPN" className="h-[84px] w-[84px] object-contain" />
                </div>
                <div className="flex-1 text-center leading-tight">
                    <div className="text-[11.5px] font-bold tracking-wide">KEMENTERIAN AGRARIA DAN TATA RUANG/BADAN PERTANAHAN NASIONAL</div>
                    <div className="text-[15px] font-bold tracking-wide">KANTOR PERTANAHAN KOTA BANDAR LAMPUNG</div>
                    <div className="text-[10px] font-bold tracking-[2.5px]">PROVINSI LAMPUNG</div>
                    <div className="mt-1 text-[8.5px]">
                        Jln. Drs. Warsito No. 5, Bandar Lampung 35215 &nbsp;Telp. (0721) 486217/Fax. (0721) 480223
                        &nbsp;Email : kot-bandarlampung@atrbpn.go.id
                    </div>
                </div>
            </div>
            {subtitle && (
                <div className="-mt-1 mb-4 text-center text-[13px] font-bold uppercase tracking-wide">{subtitle}</div>
            )}
        </div>
    );
}