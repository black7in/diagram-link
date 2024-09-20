<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'user_id', 'uuid'];

    // Relación: una sala pertenece a un usuario (creador)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Una sala tiene muchos mensajes
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
