<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Game Sessions
    Route::post('/session/start', [\App\Http\Controllers\Api\SessionController::class, 'start']);
    Route::post('/session/{sessionId}/end', [\App\Http\Controllers\Api\SessionController::class, 'end']);
    Route::get('/session/{sessionId}', [\App\Http\Controllers\Api\SessionController::class, 'show']);

    // Face Recognition
    Route::post('/face/enroll', [\App\Http\Controllers\Api\FaceRecognitionController::class, 'enroll']);
    Route::post('/face/verify', [\App\Http\Controllers\Api\FaceRecognitionController::class, 'verify']);
    Route::delete('/face', [\App\Http\Controllers\Api\FaceRecognitionController::class, 'delete']);
});

// Public routes
Route::get('/games', [\App\Http\Controllers\Api\GameController::class, 'index']);
Route::get('/games/{url}', [\App\Http\Controllers\Api\GameController::class, 'show']);
