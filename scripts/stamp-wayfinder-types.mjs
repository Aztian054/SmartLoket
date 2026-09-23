// Menandai file hasil generate @laravel/vite-plugin-wayfinder (routes/actions) dengan
// @ts-nocheck agar `tsc --noEmit` tidak tersandung konflik nama route grup+endpoint.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const roots = ['resources/js/routes', 'resources/js/actions'];

function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            walk(full);
        } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
            const src = readFileSync(full, 'utf8');
            if (src.startsWith('// @ts-nocheck')) continue;
            writeFileSync(full, `// @ts-nocheck\n${src}`);
        }
    }
}

for (const root of roots) {
    try {
        walk(root);
    } catch {
        // folder belum ada (belum di-generate) — abaikan
    }
}
console.log('Wayfinder types stamped with @ts-nocheck.');