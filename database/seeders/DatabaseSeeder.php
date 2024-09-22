<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;
use Illuminate\Support\Str;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Crear usuario admin con contraseña ascent123 correo admin@gmail.com
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('ascent123'),
        ]);

        // Crear usuario cliente con contraseña ascent123 correo client@gmail.com
        User::create([
            'name' => 'Client',
            'email' => 'client@gmail.com',
            'password' => bcrypt('ascent123'),
        ]);

        /*
                Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la sala
            $table->string('uuid')->unique(); // UUID para compartir la sala
            $table->timestamps();
        });*/
        //Crer room
        Room::create([
            'name' => 'Room 1',
            'description' => 'Room 1 description',
            'user_id' => 1,
            'uuid' => Str::uuid(),
        ]);

        Room::create([
            'name' => 'Room 2',
            'description' => 'Room 2 description',
            'user_id' => 1,
            'uuid' => Str::uuid(),
        ]);

        Room::create([
            'name' => 'Room 3',
            'description' => 'Room 3 description',
            'user_id' => 2,
            'uuid' => Str::uuid(),
        ]);

        Room::create([
            'name' => 'Room 4',
            'description' => 'Room 4 description',
            'user_id' => 2,
            'uuid' => Str::uuid(),
        ]);

        // mas salas
        Room::create([
            'name' => 'Room 5',
            'description' => 'Room 5 description',
            'user_id' => 1,
            'uuid' => Str::uuid(),
        ]);

        Room::create([
            'name' => 'Room 6',
            'description' => 'Room 6 description',
            'user_id' => 1,
            'uuid' => Str::uuid(),
        ]);

        Room::create([
            'name' => 'Room 7',
            'description' => 'Room 7 description',
            'user_id' => 1,
            'uuid' => Str::uuid(),
        ]);

        /*        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained(); // Relación con la tabla rooms
            $table->foreignId('user_id')->constrained(); // Relación con la tabla users
            $table->text('message'); // Contenido del mensaje
            $table->timestamps();
        });*/

        // Crear mensajes
        // Mensajes para la sala 1
        $room1 = Room::find(1);
        $room1->messages()->create([
            'user_id' => 1,
            'message' => 'Hola, ¿cómo están?',
        ]);

        $room1->messages()->create([
            'user_id' => 2,
            'message' => 'Bien, gracias. ¿Y tú?',
        ]);

        $room1->messages()->create([
            'user_id' => 1,
            'message' => 'Todo bien, gracias.',
        ]);
        
    }
}
