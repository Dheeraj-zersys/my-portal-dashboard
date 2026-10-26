<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\BusinessPlanController;
use App\Http\Controllers\DailyProgressReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterData\BusinessUnitController;
use App\Http\Controllers\MasterData\GeographicalAreaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('throttle:5,1')->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    Route::redirect('/', '/dashboard');
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('users', UserController::class)->only(['index', 'store', 'update']);
    Route::resource('business-plans', BusinessPlanController::class)->only(['index', 'store', 'update']);
    Route::resource('daily-progress-reports', DailyProgressReportController::class)->except(['destroy']);

    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::resource('geographical-areas', GeographicalAreaController::class)->only(['index', 'store', 'update']);
        Route::resource('business-units', BusinessUnitController::class)->only(['index', 'store', 'update']);
    });
});
