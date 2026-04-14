<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
    /**
     * Update the user's face reference image.
     */
    public function update(Request $request)
    {
        $request->validate([
            'face_reference_image' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:5120'], // Max 5MB
        ]);

        $user = $request->user();

        if ($request->hasFile('face_reference_image')) {
            // Delete old photo if it exists
            if ($user->face_reference_image) {
                Storage::disk('public')->delete($user->face_reference_image);
            }

            // Store new photo
            $path = $request->file('face_reference_image')->store('face-references', 'public');
            
            $user->forceFill([
                'face_reference_image' => $path,
            ])->save();
        }

        return redirect()->back()->with('status', 'face-reference-updated');
    }
}
