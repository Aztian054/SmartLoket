import { TrackingShell } from '@/components/smartloket/tracking-shell';
import { TrackingResult, type TrackingTiket } from '@/components/smartloket/tracking-result';
import { usePage, router } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';

export default function TrackingIndex() {
    const page = usePage();
    const tiket = (page.props as { tiket?: TrackingTiket | null }).tiket ?? null;
    const [q, setQ] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        router.get('/tracking', { q }, { preserveState: true });
    };

    return (
        <TrackingShell title="Pelacakan Status Berkas Pertanahan" subtitle="Pantau proses penyelesaian permohonan sertifikat dan berkas pertanahan Anda secara transparan dan real-time.">
            <form onSubmit={submit} className="relative z-10 -mt-12 rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex flex-col gap-2 md:flex-row">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Masukkan Kode Tiket / Nomor Telepon — cth: K/1/230926/1"
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button type="submit" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
                        Lacak Berkas
                    </button>
                </div>
            </form>

            {q && !tiket && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                    <p className="font-semibold text-red-600">Berkas tidak ditemukan</p>
                    <p className="text-sm text-red-500">
                        Tidak ada berkas dengan kode tiket / nomor telepon <strong>{q}</strong>. Periksa kembali kode yang Anda masukkan.
                    </p>
                </div>
            )}

            {tiket && <TrackingResult tiket={tiket} />}
        </TrackingShell>
    );
}