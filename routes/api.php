<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\QueueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Queue API - public endpoints for display
Route::get('/status', [QueueController::class, 'status']);
Route::get('/status/{service}', [QueueController::class, 'statusByService']);

// Data endpoints
Route::get('/services', [QueueController::class, 'services']);
Route::get('/counters', [QueueController::class, 'counters']);
Route::get('/counter/{counter}/current', [QueueController::class, 'currentTicket']);
Route::get('/counter/{counter}/stats', [QueueController::class, 'counterStats']);

// Dashboard and global stats
Route::get('/dashboard/stats', [QueueController::class, 'dashboardStats']);
Route::get('/global/stats', [QueueController::class, 'globalStats']);

// Admin/Resepsionis endpoints
Route::post('/tickets', [QueueController::class, 'createTicket']);
Route::post('/call/next', [QueueController::class, 'callNext']);
Route::post('/call/{ticket}/recall', [QueueController::class, 'recall']);
Route::post('/call/{ticket}/finish', [QueueController::class, 'finish']);

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
