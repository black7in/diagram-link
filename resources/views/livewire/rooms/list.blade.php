<?php

use Livewire\Volt\Component;

new class extends Component {
    public $rooms;

    public function mount($rooms)
    {
        $this->rooms = $rooms;
    }
}; ?>

<div>
    <style>
        .card-container {
            flex-direction: column;
        }
    </style>
    <div class="row row-cols-1 row-cols-md-4 g-4 mt-4">
        @foreach ($rooms as $room)
            <div class="col d-flex justify-content-center">
                <div class="card-container">
                    <div class="card text-white mb-3" style="width: 290px;">
                        <!-- Cambia max-width a width y establece el valor a 290px -->
                        <div class="card-header bg-dark">{{ $room->name }}</div>
                        <div class="card-body">
                            <p class="card-text text-dark compact-paragraph">{{ $room->description }}</p>
                            <!--Fecha de creación y actualización de la sala-->
                            <p class="card-text text-dark compact-paragraph">Creado: {{ $room->created_at }}</p>
                            <p class="card-text text-dark compact-paragraph">Actualizado: {{ $room->updated_at }}</p>
                            <!-- Autor-->
                            <p class="card-text text-dark compact-paragraph">Autor: {{ $room->user->name }}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mb-4">
                        <a href="{{ route('rooms.show', $room->uuid) }}" class="btn btn-outline-success me-2">Entrar</a>
                        <a href="#" class="btn btn-outline-danger">Abandonar</a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
