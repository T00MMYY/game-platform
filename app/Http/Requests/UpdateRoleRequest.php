<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->role?->name === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:roles,name,' . $this->role->id . '|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }
}
