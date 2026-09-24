/**
 * Util sortir klien — dipakai pada tabel daftar tiket/berkas (stage/petugas)
 * dan sebagai tipe arah urut pada tabel yang di-sortir server-side.
 */

export type SortDir = 'asc' | 'desc';

/** Pembanding nilai generik: null/'' dianggap paling bawah, angka diurut numerik, teks pakai collation id+numeric. */
export function compareValues(a: unknown, b: unknown): number {
    const empty = (v: unknown) => v === null || v === undefined || v === '';
    if (empty(a)) {
        return empty(b) ? 0 : 1;
    }
    if (empty(b)) {
        return -1;
    }
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    return String(a).localeCompare(String(b), 'id', { numeric: true, sensitivity: 'base' });
}

/** Sortir array tanpa mengubah urutan asli; `accessor` opsional untuk nilai turunan (relasi/direkat). */
export function sortRows<T>(rows: readonly T[], key: string, dir: SortDir, accessor?: (row: T) => unknown): T[] {
    const get = accessor ?? ((row: T) => (row as Record<string, unknown>)[key]);
    const factor = dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => factor * compareValues(get(a), get(b)));
}