import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ArrowRight,
    FileSearch,
    FolderOpen,
    Scale,
    ScanLine,
    BarChart3,
    Search,
    ShieldCheck,
    Layers,
} from 'lucide-react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const stages = [
        { icon: FileSearch, title: 'Verifikasi Berkas', desc: 'Verifikator memeriksa kelengkapan berkas secara sistematis.' },
        { icon: FolderOpen, title: 'Warkah', desc: 'Pencarian & pengelolaan data warkah, serah terima berkas BT/SU.' },
        { icon: Scale, title: 'Validasi BT / SU', desc: 'Validasi pra buku tanah & surat ukur elektronik secara paralel.' },
        { icon: ScanLine, title: 'Alih Media BT / SU', desc: 'Scan, KKP, dan TTD elektronik hingga sertifikat elektronik terbit.' },
    ];

    const features = [
        { icon: Search, title: 'Smart Search', desc: 'Cari & Add berkas dari DB Admin dengan cepat tanpa reload.' },
        { icon: BarChart3, title: 'Monitoring Real-time', desc: 'Dashboard eksekutif Pemimpin, rekap laporan, dan statistik lengkap.' },
        { icon: ShieldCheck, title: 'RBAC 9 Peran', desc: 'Akses terkunci sesuai jabatan: Admin, Loket, hingga Alih Media.' },
        { icon: Layers, title: 'Alur Paralel', desc: 'Validasi & alih media BT/SU berjalan paralel untuk layanan cepat.' },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Head title="Beranda" />
            <header className="border-b">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <img src="/images/logobpn2026.svg" alt="Logo Kementerian ATR/BPN" className="h-10 w-10 rounded-full bg-white p-1 shadow"/>
                        <div>
                            <p className="font-bold leading-none">SmartLoket</p>
                            <p className="text-xs text-muted-foreground">Sistem Loket Pelayanan Pertanahan Elektronik</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <AppearanceToggleDropdown />
                        <Link href="/tracking">
                            <span className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted">Tracking Publik</span>
                        </Link>
                        {auth.user ? (
                            <Link href="/dashboard">
                                <span className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">Dashboard</span>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <span className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">Login Petugas</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <section className="bg-gradient-to-br from-[#0b2239] via-[#123459] to-[#163e66] px-6 py-16 text-white">
                <div className="mx-auto max-w-3xl text-center">
                    <img src="/images/logobpn2026.svg" alt="Logo Kementerian ATR/BPN" className="mx-auto mb-4 h-20 w-20 rounded-full bg-white p-1 object-contain shadow-lg" />
                    <h1 className="text-4xl font-bold tracking-tight">SmartLoket</h1>
                    <p className="mt-2 font-medium text-white/90">Kantor Pertanahan Kota Bandar Lampung</p>
                    <p className="mx-auto mt-4 max-w-xl text-white/70">
                        Sistem Loket Pelayanan Pertanahan Elektronik — 9 peran, alur paralel, dan pelacakan berkas secara transparan &amp; real-time.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link href="/tracking" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-[#0b2239] hover:bg-white/90">
                            Lacak Status Berkas <ArrowRight className="size-4" />
                        </Link>
                        <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2 font-semibold hover:bg-white/10">
                            Masuk Petugas / Internal Kantah
                        </Link>
                    </div>
                </div>
            </section>

            <main className="flex-1 space-y-16 px-6 py-14">
                <section className="mx-auto max-w-5xl">
                    <h2 className="text-center text-2xl font-bold">Alur Layanan (V2.0)</h2>
                    <p className="mt-1 text-center text-muted-foreground">Dari Loket Penerimaan hingga Sertifikat Elektronik terbit.</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stages.map((s) => (
                            <div key={s.title} className="rounded-xl border bg-card p-5 shadow-sm">
                                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                                    <s.icon className="size-5" />
                                </div>
                                <h3 className="font-semibold">{s.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-5xl">
                    <h2 className="text-center text-2xl font-bold">Kenapa SmartLoket?</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f) => (
                            <div key={f.title} className="rounded-xl border bg-card p-5 shadow-sm">
                                <div className="mb-3 inline-flex rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                                    <f.icon className="size-5" />
                                </div>
                                <h3 className="font-semibold">{f.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center shadow-sm">
                    <CheckCircle className="mx-auto mb-3 size-8 text-emerald-600" />
                    <h2 className="text-xl font-bold">Transparan &amp; Akuntabel</h2>
                    <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                        Setiap berkas terlacak dari tiket hingga sertifikat elektronik. Pemohon dapat memantau status berkasnya sendiri kapan saja melalui halaman Tracking Publik.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <Link href="/tracking" className="inline-flex items-center gap-2 text-primary hover:underline">
                            Coba Tracking Publik <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Kantor Pertanahan Kota Bandar Lampung • Sistem Loket Pelayanan Pertanahan Elektronik (SmartLoket)
            </footer>
        </div>
    );
}
