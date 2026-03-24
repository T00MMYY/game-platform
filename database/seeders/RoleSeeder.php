<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Role::firstOrCreate(['name' => 'admin'], ['description' => 'Administrador del sistema']);
        \App\Models\Role::firstOrCreate(['name' => 'manager'], ['description' => 'Gestor de juegos']);
        \App\Models\Role::firstOrCreate(['name' => 'player'], ['description' => 'Jugador estándar']);
    }
}
