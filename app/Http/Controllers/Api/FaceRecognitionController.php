<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\FaceRecognitionService;

class FaceRecognitionController extends Controller
{
    protected $faceService;

    public function __construct(FaceRecognitionService $faceService)
    {
        $this->faceService = $faceService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Enroll a user's face - store reference image
     */
    public function enroll(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:5120', // max 5MB
        ]);

        $user = auth()->user();
        $imagePath = $request->file('image')->store('face_references', 'public');
        
        $user->update([
            'face_reference_image' => $imagePath
        ]);

        return response()->json([
            'message' => 'Foto facial registrada exitosamente',
            'face_reference_image' => $imagePath
        ]);
    }

    /**
     * Verify a user's face - compare with reference
     */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $user = auth()->user();

        // Check if user has reference image
        if (!$user->face_reference_image) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene una foto facial registrada'
            ], 400);
        }

        // Get the reference image path
        $referencePath = storage_path('app/public/' . $user->face_reference_image);
        
        // Save current image temporarily
        $currentImagePath = $request->file('image')->store('temp', 'public');
        $currentPath = storage_path('app/public/' . $currentImagePath);

        try {
            // Call face recognition microservice
            $result = $this->faceService->compareFaces($referencePath, $currentPath);

            // Clean up temp image
            @unlink($currentPath);

            return response()->json([
                'success' => $result['match'],
                'confidence' => $result['confidence'] ?? null,
                'message' => $result['match'] ? 'Identidad verificada' : 'No se pudo verificar la identidad'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la imagen'
            ], 500);
        }
    }

    /**
     * Delete user's face reference
     */
    public function delete()
    {
        $user = auth()->user();

        if ($user->face_reference_image) {
            \Storage::disk('public')->delete($user->face_reference_image);
        }

        $user->update(['face_reference_image' => null]);

        return response()->json([
            'message' => 'Foto facial eliminada'
        ]);
    }
}
