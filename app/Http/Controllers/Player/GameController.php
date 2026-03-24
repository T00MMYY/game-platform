<?php

namespace App\Http\Controllers\Player;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with('user')->where('is_published', true)->latest()->get();
        return Inertia::render('Player/GamesIndex', [
            'games' => $games
        ]);
    }

    public function show(Game $game)
    {
        if (!$game->is_published) {
            abort(404);
        }
        
        $game->load('user');

        return Inertia::render('Player/GameShow', [
            'game' => $game
        ]);
    }
}
