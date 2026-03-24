<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::where('email', 'admin@example.com')->first();
        
        \App\Models\Game::factory(10)->create([
            'user_id' => $admin->id ?? \App\Models\User::factory(), 
        ]);
    }
}
