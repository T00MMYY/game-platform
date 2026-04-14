<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('game_sessions', function (Blueprint $table) {
        $table->id();
        // Relación con el usuario (Jugador)
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        // Relación con el juego
        $table->foreignId('game_id')->constrained()->onDelete('cascade');
        
        // Datos de la partida
        $table->timestamp('started_at');
        $table->timestamp('finished_at')->nullable();
        $table->integer('score')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_sessions');
    }
};
