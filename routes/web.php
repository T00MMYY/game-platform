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
    Route::post('/profile/photo', [\App\Http\Controllers\ProfilePhotoController::class, 'update'])->name('profile.photo.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/security', function () {
        return Inertia::render('Profile/SecuritySettings');
    })->name('profile.security');
});

Route::middleware(['auth', 'role:admin,manager'])->group(function () {
    Route::resource('games', \App\Http\Controllers\GameController::class);
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/play', [\App\Http\Controllers\Player\GameController::class, 'index'])->name('play.index');
    Route::get('/play/{game}', [\App\Http\Controllers\Player\GameController::class, 'show'])->name('play.show');
    
    // Rutas de API internas para la plataforma con sesión web
    Route::post('/api/session/start', [\App\Http\Controllers\Api\SessionController::class, 'start']);
    
    // Chat endpoints
    Route::get('/games/{game}/chat', [\App\Http\Controllers\ChatMessageController::class, 'index']);
    Route::post('/games/{game}/chat', [\App\Http\Controllers\ChatMessageController::class, 'store']);
});

require __DIR__.'/auth.php';
