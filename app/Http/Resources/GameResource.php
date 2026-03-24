<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'url' => $this->url,
            // Returning the full path to the image if it exists
            'thumbnail_url' => $this->thumbnail ? asset('storage/' . $this->thumbnail) : null,
            // Instead of user_id, return just the creator's name
            'creator' => $this->user ? $this->user->name : 'Unknown',
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
