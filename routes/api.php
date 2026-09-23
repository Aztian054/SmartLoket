<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

/*
| API v1 — SmartLoket (modul pertanahan).
| Endpoint publik: tracking, live stats, dan master jenis permohonan.
*/
Route::prefix('v1')->group(function () {
    // Tracking publik & QR Validation (kode tiket bisa mengandung `/`)
    Route::get('/tracking/{no_tiket}', [ApiController::class, 'tracking'])->where('no_tiket', '.*');

    // Live Dashboard Stats (publik)
    Route::get('/stats', [ApiController::class, 'stats']);

    // Master Services
    Route::get('/jenis-permohonan', [ApiController::class, 'jenisPermohonan']);
});
