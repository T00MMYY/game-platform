<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Game;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // For admin and managers, we display all games for now.
        $games = Game::with('user')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Games/Index', [
            'games' => $games
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Games/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGameRequest $request)
    {
        $validated = $request->validated();
        
        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $validated['user_id'] = auth()->id();

        Game::create($validated);

        return redirect()->route('games.index')->with('success', 'Juego creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Game $game)
    {
        // For players to view the game. For now, handled within players view later.
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Game $game)
    {
        return Inertia::render('Games/Edit', [
            'game' => $game
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGameRequest $request, Game $game)
    {
        $validated = $request->validated();

        if ($request->hasFile('thumbnail')) {
            // Delete old if exists
            if ($game->thumbnail) {
                Storage::disk('public')->delete($game->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $game->update($validated);

        return redirect()->route('games.index')->with('success', 'Juego actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $game)
    {
        if ($game->thumbnail) {
            Storage::disk('public')->delete($game->thumbnail);
        }
        
        $game->delete();

        return redirect()->route('games.index')->with('success', 'Juego eliminado exitosamente.');
    }
}
