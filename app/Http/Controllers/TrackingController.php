<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(Request $request): Response
    {
        $tiket = null;
        if ($request->filled('q')) {
            $tiket = Tiket::with(['jenisPermohonan', 'bidangTanahs', 'penugasans.user', 'riwayatStatuses', 'lembarKerjaWarkahs'])
                ->where('kode_tiket', 'like', "%{$request->q}%")
                ->first();

            if (! $tiket) {
                $tiket = Tiket::with(['jenisPermohonan', 'bidangTanahs', 'penugasans.user', 'riwayatStatuses', 'lembarKerjaWarkahs'])
                    ->where('nomor_telepon', 'like', "%{$request->q}%")
                    ->first();
            }
        }

        return Inertia::render('smartloket/tracking/index', ['tiket' => $tiket]);
    }

    public function show(string $kode): Response
    {
        $tiket = Tiket::with([
            'jenisPermohonan',
            'bidangTanahs',
            'penugasans.user',
            'riwayatStatuses',
            'lembarKerjaWarkahs',
        ])->where('kode_tiket', $kode)->firstOrFail();

        return Inertia::render('smartloket/tracking/show', ['tiket' => $tiket]);
    }
}
