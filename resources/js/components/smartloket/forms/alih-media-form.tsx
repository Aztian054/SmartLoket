import { SelectField, TextAreaField } from './fields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Save } from 'lucide-react';

const BELUM_SUDAH = [
    { value: 'belum', label: 'Belum' },
    { value: 'sudah', label: 'Sudah' },
];

const SCAN_OPTS = [
    { value: 'belum', label: 'Belum' },
    { value: 'sudah', label: 'Sudah' },
    { value: 'kualitas_buruk', label: 'Kualitas Buruk' },
];

interface AlihMediaFormProps {
    routeBase: string;
    tiketId: number;
    su?: boolean;
    existing: {
        status_scan_buku_tanah?: string | null;
        status_scan_surat_ukur?: string | null;
        status_upload_kkp?: string | null;
        status_ttd_elektronik?: string | null;
        tanggal_terbit_sertifikat_el?: string | null;
        catatan?: string | null;
    };
}

export function AlihMediaForm({ routeBase, tiketId, su = false, existing }: AlihMediaFormProps) {
    const scanKey = su ? 'status_scan_surat_ukur' : 'status_scan_buku_tanah';
    const scanLabel = su ? 'Scan Surat Ukur' : 'Scan Buku Tanah';
    const [scan, setScan] = useState(existing[scanKey as keyof typeof existing] ?? 'belum');
    const [upload_kkp, setKkp] = useState(existing.status_upload_kkp ?? 'belum');
    const [ttd, setTtd] = useState(existing.status_ttd_elektronik ?? 'belum');
    const [tanggal, setTanggal] = useState(existing.tanggal_terbit_sertifikat_el ?? '');
    const [catatan, setCatatan] = useState(existing.catatan ?? '');

    const change = (n: string, v: string) => {
        if (n === scanKey) setScan(v);
        else if (n === 'status_upload_kkp') setKkp(v);
        else if (n === 'status_ttd_elektronik') setTtd(v);
        else if (n === 'tanggal_terbit_sertifikat_el') setTanggal(v);
        else if (n === 'catatan') setCatatan(v);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/${routeBase}/${tiketId}/simpan`,
            { [scanKey]: scan, status_upload_kkp: upload_kkp, status_ttd_elektronik: ttd, tanggal_terbit_sertifikat_el: tanggal, catatan },
            { preserveScroll: true },
        );
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <SelectField name={scanKey} label={scanLabel} value={scan} onChange={change} options={SCAN_OPTS} placeholder={null} />
                <SelectField name="status_upload_kkp" label="Upload KKP" value={upload_kkp} onChange={change} options={BELUM_SUDAH} placeholder={null} />
                <SelectField name="status_ttd_elektronik" label="TTD Elektronik" value={ttd} onChange={change} options={BELUM_SUDAH} placeholder={null} />
                <div className="space-y-1">
                    <Label>Tanggal Terbit Sertifikat El.</Label>
                    <input
                        type="date"
                        name="tanggal_terbit_sertifikat_el"
                        value={tanggal}
                        onChange={(e) => change('tanggal_terbit_sertifikat_el', e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    />
                </div>
            </div>
            <TextAreaField name="catatan" label="Catatan" value={catatan} onChange={change} />
            <Button type="submit">
                <Save className="mr-1 size-4" /> Simpan Progres Alih Media {su ? 'SU' : 'BT'}
            </Button>
        </form>
    );
}