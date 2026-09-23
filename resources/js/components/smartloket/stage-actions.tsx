import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { RotateCcw, CheckCircle2, Printer, XCircle } from 'lucide-react';
import { type SmartTiket } from '@/types';

interface StageActionsProps {
    tiket: SmartTiket;
    stage: string;
    routeBase: string;
    canSelesai: boolean;
}

const KE_STAGE_OPTIONS = [
    { value: 'admin', label: 'DB Admin (perbaikan antar-tahap)' },
    { value: 'loket', label: 'Loket (pemohon melengkapi berkas)' },
    { value: 'verifikasi', label: 'Kembali ke Verifikator' },
    { value: 'warkah', label: 'Kembali ke Warkah' },
];

const defaultKeStage: Record<string, string> = {
    verifikasi: 'loket',
    warkah: 'admin',
    validasi_btel: 'warkah',
    validasi_suel: 'warkah',
    alih_media_btel: 'admin',
    alih_media_suel: 'admin',
};

export function StageActions({ tiket, stage, routeBase, canSelesai }: StageActionsProps) {
    const [openSelesai, setOpenSelesai] = useState(false);
    const [openRevisi, setOpenRevisi] = useState(false);
    const [catatan, setCatatan] = useState('');
    const [keStage, setKeStage] = useState(defaultKeStage[stage] ?? 'admin');

    const submitSelesai = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/${routeBase}/${tiket.id}/selesai`, { catatan }, { preserveScroll: true });
    };

    const submitRevisi = (e: React.FormEvent) => {
        e.preventDefault();
        if (!catatan.trim()) {
            alert('Harap isi catatan pada lembar kerja terlebih dahulu untuk mengembalikan berkas (revisi).');
            return;
        }
        router.post(`/${routeBase}/${tiket.id}/revisi`, { isi_revisi: catatan, ke_stage: keStage }, { preserveScroll: true });
    };

    const lepas = () => {
        if (!confirm('Lepas berkas ini kembali ke DB Admin?')) return;
        router.post(`/${routeBase}/${tiket.id}/lepas`, {}, { preserveScroll: true });
    };

    return (
        <>
            <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <CheckCircle2 className="size-4" /> Berkas ini sedang ada dalam antrian pekerjaan Anda.
                </p>
                {!canSelesai && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline">Proses Selesai masih terkunci</Badge> â€” berkas BT/SU belum dicatat pengembaliannya ke Warkah.
                    </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => setOpenSelesai(true)} disabled={!canSelesai}>
                        <CheckCircle2 className="mr-1 size-4" /> Proses Selesai
                    </Button>
                    <Button size="sm" variant="outline" className="bg-amber-600 text-white hover:bg-amber-700" onClick={() => setOpenRevisi(true)}>
                        <RotateCcw className="mr-1 size-4" /> Kembalikan (Revisi)
                    </Button>
                    <a href={`/${routeBase}/${tiket.id}/print-perbaikan`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                            <Printer className="mr-1 size-4" /> Cetak Form Perbaikan
                        </Button>
                    </a>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={lepas}>
                        <XCircle className="mr-1 size-4" /> Lepas
                    </Button>
                </div>
            </div>
{openSelesai && (
                <Modal onClose={() => setOpenSelesai(false)} title={`Selesaikan ${tiket.kode_tiket}`}>
                    <form onSubmit={submitSelesai} className="space-y-3">
                        <p className="text-sm text-muted-foreground">Catatan selesai otomatis dipakai dari isian di bawah (atau biarkan kosong).</p>
                        <div className="space-y-1">
                            <Label>Catatan</Label>
                            <textarea rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenSelesai(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                <CheckCircle2 className="mr-1 size-4" /> Ya, Selesaikan
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {openRevisi && (
                <Modal onClose={() => setOpenRevisi(false)} title={`Kembalikan ${tiket.kode_tiket}`}>
                    <form onSubmit={submitRevisi} className="space-y-3">
                        <div className="space-y-1">
                            <Label>Tujuan Pengembalian</Label>
                            <select value={keStage} onChange={(e) => setKeStage(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                                {KE_STAGE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-muted-foreground">Isi revisi akan otomatis diambil dari kolom catatan di bawah (wajib diisi).</p>
                        <div className="space-y-1">
                            <Label>Catatan Revisi</Label>
                            <textarea rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenRevisi(false)}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700">
                                <RotateCcw className="mr-1 size-4" /> Kembalikan
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h6 className="mb-3 font-bold">{title}</h6>
                {children}
            </div>
        </div>
    );
}
