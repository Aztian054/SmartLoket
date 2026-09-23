<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koreksi Berkas {{ $tiket->kode_tiket }} — SmartLoket</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial, Helvetica, sans-serif; color:#334155;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f9; padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(11,34,57,0.08);">
                    {{-- Header --}}
                    <tr>
                        <td style="background:linear-gradient(90deg,#0b2239,#163659); padding:24px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="color:#ffffff; font-size:20px; font-weight:bold;">
                                        SmartLoket
                                    </td>
                                    <td align="right" style="color:#c69214; font-size:12px; font-weight:bold; letter-spacing:1px;">
                                        NOTIFIKASI REVISI
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 16px; font-size:18px; font-weight:bold; color:#0b2239;">
                                Koreksi Berkas Permohonan — {{ $tiket->kode_tiket }}
                            </h1>

                            <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                                Yth. <strong>{{ $tiket->nama_pemohon }}</strong>,
                            </p>
                            <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                                Kami informasikan bahwa permohonan Anda dengan kode tiket
                                <strong>{{ $tiket->kode_tiket }}</strong> perlu dilakukan perbaikan
                                (revisi ke-{{ $tiket->revisi_ke }}).
                            </p>

                            @isset($dariStageLabel)
                            <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                                Tahap pengembalian: <strong>{{ $dariStageLabel }}</strong>
                            </p>
                            @endisset

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                   style="background:#fff8e6; border:1px solid #e9d9a8; border-radius:8px; margin:16px 0;">
                                <tr>
                                    <td style="padding:16px 20px; font-size:14px; line-height:1.6; color:#6b4a00;">
                                        <strong style="display:block; margin-bottom:6px;">Catatan revisi dari petugas:</strong>
                                        {{ $isiRevisi }}
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
                                Silakan lengkapi/perbaiki berkas sesuai catatan di atas, lalu serahkan kembali
                                ke Loket Penerimaan bersama <strong>Form Permohonan Perbaikan</strong> yang terlampir pada email ini.
                            </p>

                            <p style="margin:0 0 24px; font-size:14px; line-height:1.6;">
                                Lacak status permohonan Anda kapan saja melalui halaman pelacakan:
                                <a href="{{ url('/tracking/'.$tiket->kode_tiket) }}" style="color:#0b2239; font-weight:bold;">
                                    {{ url('/tracking/'.$tiket->kode_tiket) }}
                                </a>
                            </p>

                            <p style="margin:0; font-size:14px; line-height:1.6;">
                                Terima kasih.<br>
                                Salam hormat,<br>
                                <strong style="color:#0b2239;">SmartLoket — Sistem Layanan Permohonan</strong>
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background:#f8fafc; padding:16px 32px; font-size:12px; color:#64748b; text-align:center; border-top:1px solid #e2e8f0;">
                            &copy; {{ date('Y') }} SmartLoket. Email ini dikirim otomatis oleh sistem — mohon tidak membalas.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>