<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'started_at',
        'ended_at',
        'duration',
    ];
}
