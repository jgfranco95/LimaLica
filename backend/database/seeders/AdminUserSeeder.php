<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gmail.com.br'],
            [
                'name' => 'Administrador Lima Lica',
                'password' => Hash::make('LicaLima'),
                'role' => 'admin',
            ]
        );
    }
}
