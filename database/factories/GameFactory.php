<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'is_published' => fake()->boolean(80), // 80% chance of getting published
            'url' => fake()->slug(),
            'thumbnail' => null,
            // Assuming the factory will be called after adding an Admin/User 
            // the user_id will likely be overridden or randomly selected
            'user_id' => \App\Models\User::inRandomOrder()->first()->id ?? \App\Models\User::factory(),
        ];
    }
}
