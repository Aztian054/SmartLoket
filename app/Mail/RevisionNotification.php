<?php

namespace App\Mail;

use App\Models\Tiket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notifikasi revisi berkas (PRD v2.3).
 *
 * Dikirim ke `tiket->email_pemohon` dari tahap mana pun yang melakukan
 * aksi "Kembalikan (Revisi)" — berisi catatan revisi + lampiran
 * Form Permohonan Perbaikan (PDF bila dompdf tersedia, fallback HTML).
 */
class RevisionNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Tiket $tiket;

    public string $isiRevisi;

    public ?string $dariStage;

    /** Label ramah tampilan untuk tahap asal revisi (mis. "Verifikasi Berkas"). */
    public ?string $dariStageLabel;

    /** Path file lampiran (PDF) bila tersedia. */
    public ?string $attachmentPath = null;

    /** Konten lampiran HTML (fallback bila PDF tidak tersedia). */
    public ?string $attachmentHtml = null;

    /** Nama berkas lampiran yang tampil di email. */
    public string $attachmentName;

    public function __construct(Tiket $tiket, string $isiRevisi, ?string $dariStage = null)
    {
        $this->tiket = $tiket;
        $this->isiRevisi = $isiRevisi;
        $this->dariStage = $dariStage;
        $this->dariStageLabel = $dariStage
            ? (Tiket::STAGES[$dariStage] ?? ucwords(str_replace('_', ' ', $dariStage)))
            : null;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Koreksi Berkas {$this->tiket->kode_tiket} (Revisi ke-{$this->tiket->revisi_ke}) — SmartLoket",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.revisi_notification',
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        if ($this->attachmentPath && is_file($this->attachmentPath)) {
            return [
                Attachment::fromPath($this->attachmentPath)
                    ->as($this->attachmentName)
                    ->withMime('application/pdf'),
            ];
        }

        if ($this->attachmentHtml !== null) {
            return [
                Attachment::fromData(fn (): string => (string) $this->attachmentHtml, $this->attachmentName)
                    ->withMime('text/html'),
            ];
        }

        return [];
    }
}