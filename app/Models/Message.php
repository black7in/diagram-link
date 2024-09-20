<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['room_id', 'user_id', 'message'];

    // Un mensaje pertenece a una sala
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Un mensaje pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
