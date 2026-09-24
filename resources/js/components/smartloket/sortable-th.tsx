import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SortDir } from '@/lib/sort';

interface SortableThProps {
    label: string;
    sortKey: string;
    current?: string;
    dir?: SortDir;
    onSort: (key: string, dir: SortDir) => void;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

/**
 * Header kolom yang bisa diklik untuk mengurutkan tabel
 * (klik pertama: asc, klik berikutnya: toggle asc/desc).
 */
export function SortableTh({ label, sortKey, current, dir = 'desc', onSort, className, align = 'left' }: SortableThProps) {
    const active = current === sortKey;
    const next: SortDir = active && dir === 'asc' ? 'desc' : 'asc';

    return (
        <th className={cn('px-3 py-2', align === 'center' && 'text-center', align === 'right' && 'text-right', className)}>
            <button
                type="button"
                onClick={() => onSort(sortKey, next)}
                title={`Urutkan berdasarkan ${label}`}
                className={cn(
                    'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap uppercase tracking-wide transition-colors',
                    active ? 'font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
            >
                {label}
                {active ? (
                    dir === 'asc' ? (
                        <ArrowUp className="size-3.5 shrink-0" />
                    ) : (
                        <ArrowDown className="size-3.5 shrink-0" />
                    )
                ) : (
                    <ArrowUpDown className="size-3.5 shrink-0 opacity-40" />
                )}
            </button>
        </th>
    );
}