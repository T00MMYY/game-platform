<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/games', [\App\Http\Controllers\Api\GameController::class, 'index']);
Route::get('/games/{url}', [\App\Http\Controllers\Api\GameController::class, 'show']);
