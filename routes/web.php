<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin,manager'])->group(function () {
    Route::resource('games', \App\Http\Controllers\GameController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/play', [\App\Http\Controllers\Player\GameController::class, 'index'])->name('play.index');
    Route::get('/play/{game}', [\App\Http\Controllers\Player\GameController::class, 'show'])->name('play.show');
});

require __DIR__.'/auth.php';
