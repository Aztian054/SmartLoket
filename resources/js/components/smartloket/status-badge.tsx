import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Peta warna badge Bootstrap (`status_badge` pada model Tiket) → Tailwind.
 */
const badgeClassMap: Record<string, string> = {
    warning: 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300',
    info: 'border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-300',
    secondary: 'border-transparent bg-zinc-500/15 text-zinc-600 dark:text-zinc-300',
    primary: 'border-transparent bg-blue-600/15 text-blue-700 dark:text-blue-300',
    purple: 'border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-300',
    dark: 'border-transparent bg-zinc-800 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-800',
    indigo: 'border-transparent bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    success: 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    danger: 'border-transparent bg-red-500/15 text-red-700 dark:text-red-300',
    light: 'border-border text-muted-foreground',
};

interface StatusBadgeProps {
    badge?: string | null;
    children?: React.ReactNode;
    className?: string;
}

export function StatusBadge({ badge, children, className }: StatusBadgeProps) {
    return (
        <Badge variant="outline" className={cn('uppercase', badgeClassMap[badge ?? 'light'] ?? badgeClassMap.light, className)}>
            {children}
        </Badge>
    );
}

export function RolleBadge({ role }: { role: string }) {
    const labelMap: Record<string, string> = {
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
    return <Badge variant="outline">{labelMap[role] ?? role}</Badge>;
}

export function capitalizeStage(stage: string): string {
    const map: Record<string, string> = {
        verifikasi: 'Verifikasi Berkas',
        warkah: 'Pencarian & Data Warkah',
        validasi_btel: 'Validasi Pra-BTel',
        validasi_suel: 'Validasi Pra-SuEl',
        alih_media_btel: 'Alih Media Pra-BTel',
        alih_media_suel: 'Alih Media Pra-SuEl',
        loket: 'Loket Penerimaan',
        admin: 'DB Admin',
    };
    return map[stage] ?? stage.replaceAll('_', ' ');
}