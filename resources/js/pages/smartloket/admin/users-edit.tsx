import AppLayout from '@/layouts/app-layout';
import { FlashMessages } from '@/components/smartloket/flash-messages';
import { RolleBadge } from '@/components/smartloket/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Save } from 'lucide-react';

interface EditUser {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    nip?: string | null;
    no_hp?: string | null;
    is_active: boolean;
    password_text?: string | null;
}

export default function AdminUsersEdit({ user }: { user: EditUser }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Database Tiket (Admin)', href: '/admin' },
        { title: 'Manajemen Akun', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}/edit` },
    ];
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [nip, setNip] = useState(user.nip ?? '');
    const [no_hp, setNoHp] = useState(user.no_hp ?? '');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/admin/users/${user.id}`, { name, username, email, password: password || null, nip: nip || null, no_hp: no_hp || null }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Akun ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Akun {user.name}</h1>
                <div className="flex items-center gap-2 text-sm">
                    <RolleBadge role={user.role} />
                    <span className="text-muted-foreground">Jabatan tidak dapat diubah.</span>
                    {user.password_text && <span className="rounded border px-2 py-0.5 text-xs">Password saat ini: {user.password_text}</span>}
                </div>

                <FlashMessages />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data Akun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label>Nama <span className="text-red-500">*</span></Label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} className="input-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Username <span className="text-red-500">*</span></Label>
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} required maxLength={50} className="input-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Email <span className="text-red-500">*</span></Label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Password Baru</Label>
                                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className="input-sm" />
                                    <small className="text-muted-foreground">Kosongkan jika tidak ingin mengubah password.</small>
                                </div>
                                <div className="space-y-1">
                                    <Label>NIP</Label>
                                    <input value={nip} onChange={(e) => setNip(e.target.value)} maxLength={30} className="input-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label>No. HP</Label>
                                    <input value={no_hp} onChange={(e) => setNoHp(e.target.value)} maxLength={20} className="input-sm" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Save className="mr-1 size-4" /> Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}