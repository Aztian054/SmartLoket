import { TrackingShell } from '@/components/smartloket/tracking-shell';
import { TrackingResult, type TrackingTiket } from '@/components/smartloket/tracking-result';

export default function TrackingShow({ tiket }: { tiket: TrackingTiket }) {
    return (
        <TrackingShell title="Detail Status Berkas" subtitle="Link pelacakan permanen dari loket. Status diperbarui otomatis setiap ada perpindahan tahap.">
            <TrackingResult tiket={tiket} />
        </TrackingShell>
    );
}