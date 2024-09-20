@extends('layouts.app')

@section('content')
    <h1>{{ $message }}</h1>

    <!-- iterar rooms -->
    @foreach ($rooms as $room)
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{{ $room->name }}</h5>
                <a href="{{ route('rooms.show', ['uuid' => $room->uuid]) }}" class="btn btn-primary">Ver sala</a>
            </div>
        </div>
    @endforeach
@endsection

@section('footer')
    @parent
@endsection
