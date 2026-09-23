import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function FlashMessages() {
    const { flash } = usePage<SharedData>().props;
    const [dismissed, setDismissed] = useState<{ success?: boolean; error?: boolean }>({});

    const success = flash?.success;
    const error = flash?.error;

    if (!success && !error) return null;

    return (
        <div className="mb-6 space-y-3">
            {success && !dismissed.success && (
                <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>{success}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDismissed((d) => ({ ...d, success: true }))}
                        className="text-emerald-700/70 hover:text-emerald-700 dark:text-emerald-300/70"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}
            {error && !dismissed.error && (
                <div className="flex items-start justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDismissed((d) => ({ ...d, error: true }))}
                        className="text-red-700/70 hover:text-red-700 dark:text-red-300/70"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
}