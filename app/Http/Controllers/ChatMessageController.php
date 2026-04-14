<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\ChatMessage;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    public function index(Game $game)
    {
        $messages = $game->chatMessages()->with('user:id,name')->latest()->take(50)->get()->reverse()->values();
        return response()->json($messages);
    }

    public function store(Request $request, Game $game)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $message = $game->chatMessages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message
        ]);

        $message->load('user:id,name');

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}

