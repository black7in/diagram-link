<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Diagrama extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    
    protected $fillable = ['room_id', 'data']; // Asegúrate de incluir room_id

    // Relación: Un diagrama pertenece a una sala
    public function room() 
    {
        return $this->belongsTo(Room::class, 'room_id', 'id'); // Usa 'room_id' en Diagrama y 'id' en Room
    }
}
