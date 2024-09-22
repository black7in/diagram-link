<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class RoomController extends Controller
{
    //
    public $message;
    public $rooms;

    public function index(): View
    {


        $message = "Hello World";


        $rooms = Room::where('user_id', Auth::id())->get();


        return view('rooms', [
            'message' => $message,
            'rooms' => $rooms,
        ]);
    }

    // Mostrar una sala específica
    public function show($uuid)
    {
        // Buscar la sala por su UUID
        $room = Room::where('uuid', $uuid)->firstOrFail();

        // Obtener los mensajes relacionados con la sala
        $messages = $room->messages()->with('user')->get();

        // Mostrar la vista de la sala con sus mensajes
        return view('rooms.show', compact('room', 'messages'));
    }

    // Crear una nueva sala
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Crear una nueva sala
        $room = new Room();
        $room->name = $request->name;
        // description
        $room->description = $request->description;
        $room->uuid = Str::uuid();
        $room->user_id = Auth::id();
        $room->save();

        // Redireccionar a la sala creada
        return redirect()->route('rooms.show', $room->uuid);
    }
}
