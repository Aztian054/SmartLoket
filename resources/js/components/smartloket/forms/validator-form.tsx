import { SelectField, TextAreaField } from './fields';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Save } from 'lucide-react';

const SESUAI = [
    { value: 'sesuai', label: 'Sesuai' },
    { value: 'tidak_sesuai', label: 'Tidak Sesuai' },
];

interface ValidatorFormProps {
    routeBase: string;
    tiketId: number;
    su?: boolean;
    existing: {
        kesesuaian_nama?: string | null;
        kesesuaian_luas?: string | null;
        kesesuaian_nib?: string | null;
        cocok_letak?: string | null;
        status_validasi?: string | null;
        catatan?: string | null;
    };
}

export function ValidatorForm({ routeBase, tiketId, su = false, existing }: ValidatorFormProps) {
    const [kesesuaian_nama, setNama] = useState(existing.kesesuaian_nama ?? '');
    const [kesesuaian_luas, setLuas] = useState(existing.kesesuaian_luas ?? '');
    const [kesesuaian_nib, setNib] = useState(existing.kesesuaian_nib ?? '');
    const [cocok_letak, setCocok] = useState(existing.cocok_letak ?? '');
    const [status_validasi, setStatus] = useState(existing.status_validasi ?? '');
    const [catatan, setCatatan] = useState(existing.catatan ?? '');
    const change = (n: string, v: string) => {
        if (n === 'kesesuaian_nama') setNama(v);
        else if (n === 'kesesuaian_luas') setLuas(v);
        else if (n === 'kesesuaian_nib') setNib(v);
        else if (n === 'cocok_letak') setCocok(v);
        else if (n === 'status_validasi') setStatus(v);
        else if (n === 'catatan') setCatatan(v);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/${routeBase}/${tiketId}/simpan`,
            { kesesuaian_nama, kesesuaian_luas, kesesuaian_nib, cocok_letak, status_validasi, catatan },
            { preserveScroll: true },
        );
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <SelectField name="kesesuaian_nama" label="Kesesuaian Nama" value={kesesuaian_nama} onChange={change} options={SESUAI} />
                <SelectField name="kesesuaian_luas" label="Kesesuaian Luas" value={kesesuaian_luas} onChange={change} options={SESUAI} />
                <SelectField name="kesesuaian_nib" label="Kesesuaian NIB" value={kesesuaian_nib} onChange={change} options={SESUAI} />
                {su && <SelectField name="cocok_letak" label="Cocok Letak" value={cocok_letak} onChange={change} options={SESUAI} />}
                <div className={su ? 'md:col-span-2' : ''}>
                    <SelectField
                        name="status_validasi"
                        label="Status Validasi"
                        value={status_validasi}
                        onChange={change}
                        required
                        options={[
                            { value: 'lulus', label: 'LULUS' },
                            { value: 'ditolak', label: 'Ditolak' },
                        ]}
                    />
                </div>
            </div>
            <TextAreaField name="catatan" label="Catatan Validasi" value={catatan} onChange={change} />
            <Button type="submit">
                <Save className="mr-1 size-4" /> Simpan Hasil Validasi {su ? 'SU' : 'BT'}
            </Button>
        </form>
    );
}