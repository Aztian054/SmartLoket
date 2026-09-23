import { Badge } from '@/components/ui/badge';
import { type SmartBidangTanah } from '@/types';
import { Layers } from 'lucide-react';

export function BidangTable({ bidangTanahs }: { bidangTanahs?: SmartBidangTanah[] }) {
    const rows = bidangTanahs ?? [];
    return (
        <div className="mb-4 rounded-lg border">
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
                <Layers className="size-4 text-primary" />
                <h6 className="font-bold">Bidang Tanah ({rows.length})</h6>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                        <tr>
                            {['#', 'NIB', 'No. Sertifikat Lama', 'No. Sertifikat El.', 'Jenis Hak', 'Pemegang Hak', 'Kelurahan'].map((h) => (
                                <th key={h} className="px-4 py-2 font-medium">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                    Belum ada data bidang tanah.
                                </td>
                            </tr>
                        ) : (
                            rows.map((b) => (
                                <tr key={b.id ?? b.urutan} className="border-t">
                                    <td className="px-4 py-2">{b.urutan}</td>
                                    <td className="px-4 py-2">
                                        <Badge variant="outline">{b.nib ?? '-'}</Badge>
                                    </td>
                                    <td className="px-4 py-2">{b.no_sertifikat_lama ?? '-'}</td>
                                    <td className="px-4 py-2">{b.no_sertifikat_elektronik ?? '-'}</td>
                                    <td className="px-4 py-2">{b.jenis_hak ?? '-'}</td>
                                    <td className="px-4 py-2">{b.nama_pemegang_hak ?? '-'}</td>
                                    <td className="px-4 py-2">
                                        {b.desa_kelurahan ?? '-'}, {b.kecamatan ?? '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}