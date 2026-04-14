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
            )->post('http://localhost:8005/verify');

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
}
