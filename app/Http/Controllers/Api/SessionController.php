<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameSession;
use App\Services\FaceRecognitionService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class SessionController extends Controller
{
    public function start(Request $request, FaceRecognitionService $faceService)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'current_image' => 'required|string', // Base64 data URI
        ]);

        $user = $request->user();

        // 1. Validar que la foto de referencia existe y está guardada
        if (!$user->face_reference_image || !Storage::disk('public')->exists($user->face_reference_image)) {
            return response()->json(['message' => 'No tienes configurada la Foto de Referencia Biométrica en tu perfil. Configúrala primero.'], 403);
        }

        // 2. Extraer y guardar la foto tomada en este instante
        $base64Image = $request->current_image;
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
                return response()->json(['message' => 'Formato de imagen de cámara inválido'], 400);
            }
            $base64Image = str_replace(' ', '+', $base64Image);
            $imageFile = base64_decode($base64Image);
        } else {
            return response()->json(['message' => 'Formato de imagen base64 inválido'], 400);
        }

        // Guardar en temp
        $tempFileName = 'temp/current_face_' . uniqid() . '.' . $type;
        Storage::disk('local')->put($tempFileName, $imageFile);
        $tempFilePath = Storage::disk('local')->path($tempFileName);

        // 3. Cruzar datos con IA Python
        $refFilePath = storage_path('app/public/' . $user->face_reference_image);
        $isVerified = $faceService->verify($refFilePath, $tempFilePath);

        // 4. ELIMINAR LA FOTO NUEVA (por mandato de privacidad básico y simple)
        if (file_exists($tempFilePath)) {
            unlink($tempFilePath);
        }

        if (!$isVerified) {
            return response()->json(['message' => 'No coincidimos tu cara con la foto de referencia. Presiona Intentar de nuevo.'], 403);
        }

        // 5. El usuario está verificado! Crear la sesión
        $game = Game::where('id', $request->game_id)->where('is_published', true)->firstOrFail();

        $session = GameSession::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'started_at' => Carbon::now(),
        ]);

        return response()->json([
            'session_id' => $session->id,
            'message' => 'Identidad verificada. Sesión iniciada.'
        ], 201);
    }
}