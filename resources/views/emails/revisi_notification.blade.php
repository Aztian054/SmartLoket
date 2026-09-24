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
                    {{-- Kop Surat Resmi -- Kantor Pertanahan Kota Bandar Lampung --}}
                    <tr>
                        <td style="padding:22px 26px 10px; border-bottom:3px double #222;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                   style="font-family:Times New Roman, Times, serif; color:#000;">
                                <tr>
                                    <td width="84" valign="middle" style="padding-right:12px;">
                                        @php
                                            // Logo disematkan sebagai inline attachment (CID) supaya aman
                                            // di Gmail/Outlook; fallback ke URL publik bila file lepas.
                                            $kopLogoPath = public_path('images/logobpn2026.png');
                                            $kopLogoSrc = null;
                                            if (is_file($kopLogoPath)) {
                                                $kopLogoSrc = (isset($message) && $message instanceof \Illuminate\Mail\Message)
                                                    ? $message->embed($kopLogoPath)
                                                    : asset('images/logobpn2026.png');
                                            }
                                        @endphp
                                        @if($kopLogoSrc)
                                            <img src="{{ $kopLogoSrc }}" alt="Logo Kementerian ATR/BPN"
                                                 width="84" height="84" style="display:block; width:84px; height:84px;">
                                        @endif
                                    </td>
                                    <td valign="middle" style="text-align:center; font-family:Times New Roman, Times, serif; color:#000;">
                                        <div style="font-size:11.5px; font-weight:bold; letter-spacing:0.3px;">
                                            KEMENTERIAN AGRARIA DAN TATA RUANG/BADAN PERTANAHAN NASIONAL
                                        </div>
                                        <div style="font-size:15px; font-weight:bold; letter-spacing:0.6px; margin-top:2px;">
                                            KANTOR PERTANAHAN KOTA BANDAR LAMPUNG
                                        </div>
                                        <div style="font-size:10px; font-weight:bold; letter-spacing:2.5px; margin-top:2px;">
                                            PROVINSI LAMPUNG
                                        </div>
                                        <div style="font-size:8.5px; margin-top:4px;">
                                            Jln. Drs. Warsito No. 5, Bandar Lampung 35215 &nbsp;Telp. (0721) 486217/Fax. (0721) 480223 &nbsp;Email : kot-bandarlampung@atrbpn.go.id
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Subtitle / Judul --}}
                    <tr>
                        <td style="padding:12px 32px 0; text-align:center;">
                            <div style="font-family:Times New Roman, Times, serif; font-size:13px; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #222; padding-bottom:8px; color:#000;">
                                Notifikasi Revisi — Koreksi Berkas Permohonan {{ $tiket->kode_tiket }}
                            </div>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding:28px 32px;">
                            <h1 style="margin:0 0 12px; font-size:16px; font-weight:bold; color:#0b2239;">
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