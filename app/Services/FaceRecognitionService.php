<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FaceRecognitionService
{
    /**
     * Valida dos imágenes contra el microservicio Python.
     * Toma las rutas físicas de ambos archivos.
     *
     * @param string $referencePath
     * @param string $currentPath
     * @return bool
     */
    public function verify($referencePath, $currentPath)
    {
        try {
            $response = Http::attach(
                'reference_image', file_get_contents($referencePath), 'reference.jpg'
            )->attach(
                'current_image', file_get_contents($currentPath), 'current.jpg'
            )->post(env('FACE_RECOGNITION_URL', 'http://localhost:8005') . '/verify');

            if ($response->successful()) {
                return $response->json('verified') ?? false;
            }
            
            Log::error('Face Recognition HTTP Error: ' . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error('Face Recognition Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Compare two face images and return match result with confidence.
     *
     * @param string $referencePath
     * @param string $currentPath
     * @return array
     */
    public function compareFaces($referencePath, $currentPath)
    {
        try {
            $response = Http::attach(
                'reference_image', file_get_contents($referencePath), 'reference.jpg'
            )->attach(
                'current_image', file_get_contents($currentPath), 'current.jpg'
            )->post(env('FACE_RECOGNITION_URL', 'http://localhost:8005') . '/compare');

            if ($response->successful()) {
                return [
                    'match' => $response->json('match') ?? false,
                    'confidence' => $response->json('confidence') ?? 0,
                ];
            }
            
            Log::error('Face Recognition HTTP Error: ' . $response->body());
            return ['match' => false, 'confidence' => 0];
        } catch (\Exception $e) {
            Log::error('Face Recognition Error: ' . $e->getMessage());
            return ['match' => false, 'confidence' => 0];
        }
    }
}
