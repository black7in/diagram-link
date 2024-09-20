<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;

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
}
