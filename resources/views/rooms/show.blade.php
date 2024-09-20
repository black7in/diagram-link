@extends('layouts.app')

@section('content')
    <!-- Crear 2 columnas -->
    <div class="row">
        <div class="col-md-2">
            <h1>{{ $room->name }}</h1>
            <p>{{ $room->created_at }}</p>
            <p>{{ $room->updated_at }}</p>
        </div>
        <div class="col-md-6">
            @livewire('messages.create', ['room' => $room])
            @livewire('messages.lista', ['room' => $room])
        </div>
    </div>
@endsection

@section('footer')
    @parent
@endsection
