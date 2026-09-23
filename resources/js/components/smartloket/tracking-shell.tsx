import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export function TrackingShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Head title={`${title} — SmartLoket`} />
            <div className="bg-gradient-to-br from-[#0b2239] to-[#163e66] px-4 pb-4 pt-14 text-center text-white">
                <div className="mb-3 flex items-center justify-center gap-3">
                    <img src="/images/logobpn2026.png" alt="Logo BPN" className="h-14 w-14 rounded-full bg-white p-1 object-contain shadow" />
                    <h5 className="mb-0 font-bold">Kantor Pertanahan Kota Bandar Lampung</h5>
                </div>
                <h2 className="mb-2 text-2xl font-bold">{title}</h2>
                <p className="mx-auto max-w-[600px] text-white/70">{subtitle}</p>
                <Link href="/login" className="mt-3 inline-block rounded-full border border-white/60 px-3 py-1.5 text-sm">
                    Login Petugas / Internal Kantah
                </Link>
            </div>

            <div className="mx-auto max-w-[900px] px-4 py-6">{children}</div>

            <footer className="border-t bg-white py-4 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} Kantor Pertanahan Kota Bandar Lampung • Layanan Cepat, Transparan dan Akuntabel.
            </footer>
        </div>
    );
}