import { Label } from '@/components/ui/label';

export interface SelectOption {
    value: string;
    label: string;
}

export interface FieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (name: string, value: string) => void;
    required?: boolean;
}

export function SelectField({ name, label, value, onChange, options, required, emptyLabel = '— Pilih —', placeholder = true }: FieldProps & { options: SelectOption[]; emptyLabel?: string; placeholder?: boolean | null }) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <select
                id={name}
                name={name}
                value={value}
                required={required}
                onChange={(e) => onChange(name, e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
            >
                {placeholder !== false && placeholder !== null && <option value="">{emptyLabel}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function TextAreaField({ name, label, value, onChange, rows = 3, placeholder }: FieldProps & { rows?: number; placeholder?: string }) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
            />
        </div>
    );
}