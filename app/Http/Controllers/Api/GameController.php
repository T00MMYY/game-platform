<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Game;
use App\Http\Resources\GameResource;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // For players, we only fetch published games
        $games = Game::with('user')
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return GameResource::collection($games);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Usually, games won't be created via API in this platform architecture,
        // but this could handle score submissions in the future.
        return response()->json(['message' => 'Not implemented yet'], 501);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $url)
    {
        // Try to find the game by URL string first, then fallback to ID
        $game = Game::with('user')
            ->where('is_published', true)
            ->where('url', $url)
            ->first();

        if (!$game) {
            $game = Game::with('user')
                ->where('is_published', true)
                ->where('id', $url)
                ->firstOrFail();
        }

        return new GameResource($game);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return response()->json(['message' => 'Not implemented yet'], 501);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json(['message' => 'Not implemented yet'], 501);
    }
}
