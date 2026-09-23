<?php

namespace App\Services;

use App\Mail\RevisionNotification;
use App\Models\Tiket;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\View;

/**
 * RevisionEmailService — pengirim email revisi berkas ke pemohon.
 *
 * Non-fatal: kegagalan SMTP tidak pernah menggagalkan aksi revisi di
 * workflow. Lampiran memakai dompdf (bila terpasang) atau HTML printable.
 */
class RevisionEmailService
{
    public function sendForRevisi(Tiket $tiket, string $isiRevisi, ?string $dariStage = null): void
    {
        $email = $tiket->email_pemohon ?? null;

        // Tanpa email pemohon, alur revisi manual tetap berjalan seperti biasa.
        if (! is_string($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        try {
            // pastikan revisi_ke/status sudah ter-update oleh returnForRevisi.
            $tiket = $tiket->fresh() ?? $tiket;

            $mail = new RevisionNotification($tiket, $isiRevisi, $dariStage);
            $this->prepareAttachment($mail, $tiket);

            Mail::to($email)->send($mail);

            Log::info("SmartLoket: email revisi ke-{$tiket->revisi_ke} terkirim ke {$email} untuk {$tiket->kode_tiket}.", [
                'kode_tiket' => $tiket->kode_tiket,
                'email' => $email,
            ]);
        } catch (\Throwable $e) {
            Log::warning("SmartLoket: gagal mengirim email revisi {$tiket->kode_tiket} ke {$email}: {$e->getMessage()}");
        }
    }

    protected function prepareAttachment(RevisionNotification $mail, Tiket $tiket): void
    {
        $kode = preg_replace('/[^A-Za-z0-9_-]+/', '_', (string) $tiket->kode_tiket);
        $lastRevisi = $tiket->catatanRevisis()->latest('id')->first();

        // 1) PDF via barryvdh/laravel-dompdf bila tersedia.
        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            try {
                $html = View::make('partials.print_perbaikan', [
                    'tiket' => $tiket,
                    'lastRevisi' => $lastRevisi,
                ])->render();

                $pdf = app('dompdf.wrapper')->loadHTML($html);
                $tmp = tempnam(sys_get_temp_dir(), 'revisi_');
                if ($tmp === false) {
                    throw new \RuntimeException('Tidak dapat membuat temp file lampiran.');
                }
                file_put_contents($tmp, $pdf->output());

                $mail->attachmentName = "Form_Perbaikan_{$kode}.pdf";
                $mail->attachmentPath = $tmp;

                return;
            } catch (\Throwable $e) {
                Log::warning("SmartLoket: PDF lampiran revisi gagal, fallback HTML: {$e->getMessage()}");
            }
        }

        // 2) Fallback: lampirkan form cetak sebagai HTML printable.
        $mail->attachmentName = "Form_Perbaikan_{$kode}.html";
        $mail->attachmentHtml = View::make('partials.print_perbaikan', [
            'tiket' => $tiket,
            'lastRevisi' => $lastRevisi,
        ])->render();
    }
}