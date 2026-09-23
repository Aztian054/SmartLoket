import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { RolleBadge } from '@/components/smartloket/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Power, Trash2, Users } from 'lucide-react';

interface AdminUser {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    password_text?: string | null;
}

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    pemimpin: 'Pemimpin',
    loket: 'Loket',
    verifikator: 'Verifikator',
    warkah: 'Warkah',
    validator_btel: 'Validator BT',
    validator_suel: 'Validator SU',
    alih_media_btel: 'Alih Media BT',
    alih_media_suel: 'Alih Media SU',
};

export default function AdminUsers({ users, roles, filters }: { users: AdminUser[]; roles: string[]; filters: { role?: string } }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: 'Manajemen Akun', href: '/admin/users' },
    ];
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('loket');
    const [nip, setNip] = useState('');
    const [no_hp, setNoHp] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/users', { name, username, email, password, role, nip: nip || null, no_hp: no_hp || null }, { onSuccess: () => setOpen(false) });
    };
    const toggle = (u: AdminUser) => {
        if (!confirm(`Nonaktifkan/aktifkan ${u.name}?`)) return;
        router.post(`/admin/users/${u.id}/toggle`, {});
    };
    const hapus = (u: AdminUser) => {
        if (!confirm(`Hapus akun ${u.name}?`)) return;
        router.post(`/admin/users/${u.id}/hapus`, {});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Akun" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Users className="size-5 text-primary" /> Manajemen Akun
                        </h1>
                        <p className="text-muted-foreground">Petugas layanan (jabatan tidak dapat diubah setelah dibuat).</p>
                    </div>
                    <div className="flex gap-2">
                        <select value={filters.role ?? ''} onChange={(e) => router.get('/admin/users', { role: e.target.value })} className="input-sm">
                            <option value="">Semua Peran</option>
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {roleLabels[r] ?? r}
                                </option>
                            ))}
                        </select>
                        <Button onClick={() => setOpen(true)}>Buat Akun</Button>
                    </div>
                </div>

                <FlashMessages />
<div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2">Nama</th>
                                <th className="px-3 py-2">Username</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Jabatan</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="px-3 py-2 font-medium">
                                        {u.name}
                                        {u.password_text ? <small className="block text-muted-foreground">Pass: {u.password_text}</small> : null}
                                    </td>
                                    <td className="px-3 py-2">{u.username}</td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">
                                        <RolleBadge role={u.role} />
                                    </td>
                                    <td className="px-3 py-2">
                                        {u.is_active ? (
                                            <Badge className="bg-emerald-600">Aktif</Badge>
                                        ) : (
                                            <Badge variant="secondary">Nonaktif</Badge>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        <a href={`/admin/users/${u.id}/edit`} className="mr-1 inline-block rounded border px-2 py-1 hover:bg-muted" title="Edit">
                                            <Pencil className="size-3" />
                                        </a>
                                        {u.role !== 'admin' && (
                                            <>
                                                <button className="mr-1 inline-block rounded border px-2 py-1 hover:bg-muted" title="Toggle" onClick={() => toggle(u)}>
                                                    <Power className="size-3" />
                                                </button>
                                                <button className="inline-block rounded border px-2 py-1 text-red-600 hover:bg-red-50" title="Hapus" onClick={() => hapus(u)}>
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
{open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
                    <form onSubmit={submit} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h6 className="mb-3 font-bold">Buat Akun Petugas</h6>
                        <div className="grid gap-3">
                            <Field label="Nama" required>
                                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} className="input-sm" />
                            </Field>
                            <Field label="Username" required>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} required maxLength={50} className="input-sm" />
                            </Field>
                            <Field label="Email" required>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-sm" />
                            </Field>
                            <Field label="Password" required>
                                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-sm" />
                            </Field>
                            <Field label="Jabatan" required>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className="input-sm">
                                    {roles.map((r) => (
                                        <option key={r} value={r}>
                                            {roleLabels[r] ?? r}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="NIP">
                                <input value={nip} onChange={(e) => setNip(e.target.value)} maxLength={30} className="input-sm" />
                            </Field>
                            <Field label="No. HP">
                                <input value={no_hp} onChange={(e) => setNoHp(e.target.value)} maxLength={20} className="input-sm" />
                            </Field>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}