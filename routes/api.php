<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/session/start', [\App\Http\Controllers\Api\SessionController::class, 'start']);
});

Route::get('/games', [\App\Http\Controllers\Api\GameController::class, 'index']);
Route::get('/games/{url}', [\App\Http\Controllers\Api\GameController::class, 'show']);
