<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Keperluan lampiran email revisi (RevisionEmailService): view
        // `partials.print_perbaikan` & `partials.kop_surat` disimpan di bawah
        // `resources/views/_legacy_blade/partials`. Daftarkan folder tersebut
        // sebagai lokasi view agar `View::make('partials.print_perbaikan')`
        // dan `@include('partials.kop_surat')` tetap dapat di-resolve.
        View::addLocation(resource_path('views/_legacy_blade'));
    }
}
