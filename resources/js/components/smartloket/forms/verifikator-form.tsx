import { SelectField, TextAreaField } from './fields';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Save } from 'lucide-react';

interface VerifikatorFormProps {
    routeBase: string;
    tiketId: number;
    existing: { status?: string | null; catatan?: string | null } | null;
    templateKoreksis?: Array<{ id: number; nama_dokumen_kurang: string }>;
}

export function VerifikatorForm({ routeBase, tiketId, existing, templateKoreksis }: VerifikatorFormProps) {
    const [status_verifikasi, setStatus] = useState(existing?.status ?? '');
    const [catatan, setCatatan] = useState(existing?.catatan ?? '');
    const [dokumen_kurang, setDokumen] = useState<string[]>([]);
    const change = (_n: string, v: string) => setStatus(v);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/${routeBase}/${tiketId}/simpan`, { status_verifikasi, catatan, dokumen_kurang }, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                    name="status_verifikasi"
                    label="Status Pemeriksaan"
                    value={status_verifikasi}
                    onChange={change}
                    required
                    options={[
                        { value: 'lengkap', label: 'LENGKAP — lanjut ke Warkah' },
                        { value: 'perbaikan', label: 'PERBAIKAN — kembali ke pemohon' },
                        { value: 'konsul', label: 'KONSULTASI — perlu pengecekan lanjut' },
                        { value: 'batal', label: 'BATAL — permohonan tidak dilanjutkan' },
                    ]}
                />
                <div className="space-y-1">
                    <label className="text-sm font-medium">Dokumen Kurang (jika tidak lengkap)</label>
                    <select
                        multiple
                        className="h-28 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={dokumen_kurang}
                        onChange={(e) => {
                            const vals = Array.from(e.target.selectedOptions, (o) => o.value);
                            setDokumen(vals);
                        }}
                    >
                        {(templateKoreksis ?? []).map((sk) => (
                            <option key={sk.id} value={sk.nama_dokumen_kurang}>
                                {sk.nama_dokumen_kurang}
                            </option>
                        ))}
                    </select>
                    <small className="text-muted-foreground">Tekan Ctrl untuk memilih banyak dokumen.</small>
                </div>
            </div>
            <TextAreaField name="catatan" label="Catatan / Saran Koreksi" value={catatan} onChange={(n, v) => setCatatan(v)} placeholder="Tulis catatan pemeriksaan..." />
            <Button type="submit">
                <Save className="mr-1 size-4" /> Simpan Hasil Pemeriksaan
            </Button>
        </form>
    );
}